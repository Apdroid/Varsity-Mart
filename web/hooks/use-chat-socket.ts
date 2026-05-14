"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const rawBase = process.env.NEXT_PUBLIC_WS_URL || "wss://api.varsitymart.org"
// Ensure we use the WebSocket scheme
const WS_BASE = rawBase.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://")

export interface ChatMessage {
	id: string
	senderId: string
	text: string
	timestamp: string
	deliveredAt?: string | null
	isRead: boolean
	readAt?: string | null
	flagged: boolean
	flagReason?: string | null
}

// ── Server → client message shapes (Django Channels sends JSON with a `type` field) ──

interface ConversationMessagesEvent {
	type: "conversation_messages"
	conversation_id: string
	messages: Array<{
		id: string
		sender_id: string
		text: string
		timestamp: string
		delivered_at: string | null
		is_read: boolean
		read_at: string | null
		flagged: boolean
		flag_reason: string | null
	}>
	pagination: {
		limit: number
		count: number
		has_more: boolean
	}
}

interface ChatMessageEvent {
	type: "chat_message"
	message_id: string
	sender_id: string
	text: string
	timestamp: string
	delivered_at: string | null
	is_read: boolean
	read_at: string | null
	flagged: boolean
	flag_reason: string | null
}

interface TypingEvent {
	type: "typing"
	user_id: string
	is_typing: boolean
}

interface PresenceEvent {
	type: "user_joined" | "user_left"
	user_id: string
	is_online: boolean
	timestamp: string
}

interface DeliveryReceiptEvent {
	type: "delivery_receipt"
	message_id: string
	delivered_to: string
	delivered_at: string
}

interface ReadReceiptEvent {
	type: "read_receipt"
	message_ids: string[]
	reader_id: string
	read_at: string
}

type ServerEvent =
	| ConversationMessagesEvent
	| ChatMessageEvent
	| TypingEvent
	| PresenceEvent
	| DeliveryReceiptEvent
	| ReadReceiptEvent

// ── Transform helpers ──────────────────────────────────────────────────────────

function fromInitial(msg: ConversationMessagesEvent["messages"][0]): ChatMessage {
	return {
		id: msg.id,
		senderId: msg.sender_id,
		text: msg.text,
		timestamp: msg.timestamp,
		deliveredAt: msg.delivered_at,
		isRead: msg.is_read,
		readAt: msg.read_at,
		flagged: msg.flagged,
		flagReason: msg.flag_reason,
	}
}

function fromIncoming(msg: ChatMessageEvent): ChatMessage {
	return {
		id: msg.message_id,
		senderId: msg.sender_id,
		text: msg.text,
		timestamp: msg.timestamp,
		deliveredAt: msg.delivered_at,
		isRead: msg.is_read,
		readAt: msg.read_at,
		flagged: msg.flagged,
		flagReason: msg.flag_reason,
	}
}

// ── Hook types ─────────────────────────────────────────────────────────────────

interface UseChatSocketOptions {
	conversationId: string
	currentUserId: string
	onMessage?: (message: ChatMessage) => void
	onTyping?: (userId: string, isTyping: boolean) => void
	onPresence?: (userId: string, isOnline: boolean) => void
	onReadReceipt?: (messageIds: string[], readAt: string) => void
	onDeliveryReceipt?: (messageId: string, deliveredAt: string) => void
}

interface UseChatSocketReturn {
	messages: ChatMessage[]
	isConnected: boolean
	isConnecting: boolean
	otherUserOnline: boolean
	otherUserTyping: boolean
	sendMessage: (text: string) => void
	sendTyping: (isTyping: boolean) => void
	sendReadReceipt: (messageIds: string[]) => void
	reconnect: () => void
}

const MAX_RECONNECT_ATTEMPTS = 5
const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 30000

export function useChatSocket({
	conversationId,
	currentUserId,
	onMessage,
	onTyping,
	onPresence,
	onReadReceipt,
	onDeliveryReceipt,
}: UseChatSocketOptions): UseChatSocketReturn {
	const wsRef = useRef<WebSocket | null>(null)
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const attemptRef = useRef(0)
	const unmountedRef = useRef(false)

	// Keep callback refs stable so changing them doesn't reconnect
	const onMessageRef = useRef(onMessage)
	const onTypingRef = useRef(onTyping)
	const onPresenceRef = useRef(onPresence)
	const onReadReceiptRef = useRef(onReadReceipt)
	const onDeliveryReceiptRef = useRef(onDeliveryReceipt)
	useEffect(() => { onMessageRef.current = onMessage }, [onMessage])
	useEffect(() => { onTypingRef.current = onTyping }, [onTyping])
	useEffect(() => { onPresenceRef.current = onPresence }, [onPresence])
	useEffect(() => { onReadReceiptRef.current = onReadReceipt }, [onReadReceipt])
	useEffect(() => { onDeliveryReceiptRef.current = onDeliveryReceipt }, [onDeliveryReceipt])

	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isConnected, setIsConnected] = useState(false)
	const [isConnecting, setIsConnecting] = useState(false)
	const [otherUserOnline, setOtherUserOnline] = useState(false)
	const [otherUserTyping, setOtherUserTyping] = useState(false)

	// Expose a ref to sendRaw so emitters can access current socket without captures
	const sendRaw = useCallback((payload: object) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify(payload))
		}
	}, [])

	useEffect(() => {
		if (!conversationId || !currentUserId) return
		unmountedRef.current = false

		function connect() {
			if (unmountedRef.current) return
			setIsConnecting(true)
			setIsConnected(false)

			const ws = new WebSocket(`${WS_BASE}/ws/chat/${conversationId}/`)
			wsRef.current = ws

			ws.onopen = () => {
				if (unmountedRef.current) { ws.close(); return }
				attemptRef.current = 0
				setIsConnected(true)
				setIsConnecting(false)
			}

			ws.onclose = (event) => {
				setIsConnected(false)
				if (unmountedRef.current) return
				// 1000 = normal close (server-initiated intentional close) — don't retry
				if (event.code === 1000 || attemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
					setIsConnecting(false)
					return
				}
				const delay = Math.min(BASE_DELAY_MS * 2 ** attemptRef.current, MAX_DELAY_MS)
				attemptRef.current += 1
				setIsConnecting(true)
				reconnectTimeoutRef.current = setTimeout(connect, delay)
			}

			ws.onerror = () => {
				// onerror is always followed by onclose, so reconnection is handled there
				setIsConnecting(false)
			}

			ws.onmessage = (event) => {
				let data: ServerEvent
				try {
					data = JSON.parse(event.data as string) as ServerEvent
				} catch {
					return
				}

				switch (data.type) {
					case "conversation_messages":
						setMessages(data.messages.map(fromInitial))
						break

					case "chat_message": {
						const msg = fromIncoming(data)
						setMessages((prev) => {
							if (prev.some((m) => m.id === msg.id)) return prev
							return [...prev, msg]
						})
						onMessageRef.current?.(msg)
						if (data.sender_id !== currentUserId) {
							sendRaw({ type: "read_receipt", message_ids: [data.message_id] })
						}
						break
					}

					case "typing":
						if (data.user_id === currentUserId) break
						setOtherUserTyping(data.is_typing)
						onTypingRef.current?.(data.user_id, data.is_typing)
						if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
						if (data.is_typing) {
							typingTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), 5000)
						}
						break

					case "user_joined":
						if (data.user_id === currentUserId) break
						setOtherUserOnline(true)
						onPresenceRef.current?.(data.user_id, true)
						break

					case "user_left":
						if (data.user_id === currentUserId) break
						setOtherUserOnline(false)
						onPresenceRef.current?.(data.user_id, false)
						break

					case "delivery_receipt":
						setMessages((prev) =>
							prev.map((m) => m.id === data.message_id ? { ...m, deliveredAt: data.delivered_at } : m)
						)
						onDeliveryReceiptRef.current?.(data.message_id, data.delivered_at)
						break

					case "read_receipt":
						setMessages((prev) =>
							prev.map((m) =>
								data.message_ids.includes(m.id) ? { ...m, isRead: true, readAt: data.read_at } : m
							)
						)
						onReadReceiptRef.current?.(data.message_ids, data.read_at)
						break
				}
			}
		}

		connect()

		return () => {
			unmountedRef.current = true
			if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
			wsRef.current?.close(1000, "unmount")
			wsRef.current = null
			setIsConnected(false)
			setIsConnecting(false)
		}
	}, [conversationId, currentUserId, sendRaw])

	const sendMessage = useCallback((text: string) => {
		if (!text.trim()) return
		sendRaw({ type: "chat_message", text: text.trim() })
	}, [sendRaw])

	const sendTyping = useCallback((isTyping: boolean) => {
		sendRaw({ type: "typing", is_typing: isTyping })
	}, [sendRaw])

	const sendReadReceipt = useCallback((messageIds: string[]) => {
		if (messageIds.length === 0) return
		sendRaw({ type: "read_receipt", message_ids: messageIds })
	}, [sendRaw])

	const reconnect = useCallback(() => {
		if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
		wsRef.current?.close(1000, "manual reconnect")
	}, [])

	return {
		messages,
		isConnected,
		isConnecting,
		otherUserOnline,
		otherUserTyping,
		sendMessage,
		sendTyping,
		sendReadReceipt,
		reconnect,
	}
}
