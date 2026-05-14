"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"

// Socket.IO requires HTTP/HTTPS — strip any ws/wss scheme from the env var
const rawBase = process.env.NEXT_PUBLIC_WS_URL || "https://api.varsitymart.org"
const SOCKET_BASE = rawBase.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://")

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

// ── Server → client event payloads (snake_case from Django backend) ────────────

interface ConversationMessagesPayload {
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

interface ChatMessagePayload {
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

interface TypingPayload {
	user_id: string
	is_typing: boolean
}

interface PresencePayload {
	user_id: string
	is_online: boolean
	timestamp: string
}

interface DeliveryReceiptPayload {
	message_id: string
	delivered_to: string
	delivered_at: string
}

interface ReadReceiptPayload {
	message_ids: string[]
	reader_id: string
	read_at: string
}

// ── Transform helpers ──────────────────────────────────────────────────────────

function fromInitial(msg: ConversationMessagesPayload["messages"][0]): ChatMessage {
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

function fromIncoming(msg: ChatMessagePayload): ChatMessage {
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

export function useChatSocket({
	conversationId,
	currentUserId,
	onMessage,
	onTyping,
	onPresence,
	onReadReceipt,
	onDeliveryReceipt,
}: UseChatSocketOptions): UseChatSocketReturn {
	const socketRef = useRef<Socket | null>(null)
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Keep callback refs stable so changing them doesn't reconnect the socket
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

	useEffect(() => {
		if (!conversationId || !currentUserId) return

		setIsConnecting(true)
		setIsConnected(false)

		const socket = io(SOCKET_BASE, {
			withCredentials: true,              // sends HTTP-only cookies on every request
			transports: ["websocket"],          // skip HTTP polling; go straight to WS
			path: `/ws/chat/${conversationId}/`,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 30000,
		})

		socketRef.current = socket

		socket.on("connect", () => {
			setIsConnected(true)
			setIsConnecting(false)
		})

		socket.on("disconnect", (reason) => {
			setIsConnected(false)
			// "io server disconnect" means the server closed it intentionally — don't retry
			if (reason === "io server disconnect") setIsConnecting(false)
		})

		socket.on("connect_error", () => {
			setIsConnecting(false)
			setIsConnected(false)
		})

		socket.on("reconnect_attempt", () => setIsConnecting(true))
		socket.on("reconnect_failed", () => setIsConnecting(false))

		// ── Server events ──────────────────────────────────────────────────────

		socket.on("conversation_messages", (data: ConversationMessagesPayload) => {
			setMessages(data.messages.map(fromInitial))
		})

		socket.on("chat_message", (data: ChatMessagePayload) => {
			const msg = fromIncoming(data)
			setMessages((prev) => {
				if (prev.some((m) => m.id === msg.id)) return prev
				return [...prev, msg]
			})
			onMessageRef.current?.(msg)

			if (data.sender_id !== currentUserId) {
				socket.emit("read_receipt", { message_ids: [data.message_id] })
			}
		})

		socket.on("typing", (data: TypingPayload) => {
			if (data.user_id === currentUserId) return
			setOtherUserTyping(data.is_typing)
			onTypingRef.current?.(data.user_id, data.is_typing)
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
			if (data.is_typing) {
				typingTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), 5000)
			}
		})

		socket.on("user_joined", (data: PresencePayload) => {
			if (data.user_id === currentUserId) return
			setOtherUserOnline(true)
			onPresenceRef.current?.(data.user_id, true)
		})

		socket.on("user_left", (data: PresencePayload) => {
			if (data.user_id === currentUserId) return
			setOtherUserOnline(false)
			onPresenceRef.current?.(data.user_id, false)
		})

		socket.on("delivery_receipt", (data: DeliveryReceiptPayload) => {
			setMessages((prev) =>
				prev.map((m) => m.id === data.message_id ? { ...m, deliveredAt: data.delivered_at } : m)
			)
			onDeliveryReceiptRef.current?.(data.message_id, data.delivered_at)
		})

		socket.on("read_receipt", (data: ReadReceiptPayload) => {
			setMessages((prev) =>
				prev.map((m) =>
					data.message_ids.includes(m.id) ? { ...m, isRead: true, readAt: data.read_at } : m
				)
			)
			onReadReceiptRef.current?.(data.message_ids, data.read_at)
		})

		return () => {
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
			socket.disconnect()
			socketRef.current = null
			setIsConnected(false)
			setIsConnecting(false)
		}
	}, [conversationId, currentUserId])

	const sendMessage = useCallback((text: string) => {
		if (!text.trim()) return
		socketRef.current?.emit("chat_message", { text: text.trim() })
	}, [])

	const sendTyping = useCallback((isTyping: boolean) => {
		socketRef.current?.emit("typing", { is_typing: isTyping })
	}, [])

	const sendReadReceipt = useCallback((messageIds: string[]) => {
		if (messageIds.length === 0) return
		socketRef.current?.emit("read_receipt", { message_ids: messageIds })
	}, [])

	const reconnect = useCallback(() => {
		socketRef.current?.disconnect()
		socketRef.current?.connect()
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
