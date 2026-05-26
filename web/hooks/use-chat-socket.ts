"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { conversationsApi } from "@/lib/api/conversations"
import type { Message as ApiMessage } from "@/lib/api/types"

function getBrowserWsBase() {
	if (typeof window === "undefined") return "wss://api.varsitymart.org"
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
	return `${protocol}//${window.location.host}`
}

function getWsBase() {
	const rawBase = process.env.NEXT_PUBLIC_WS_URL?.trim()
	if (!rawBase || rawBase.startsWith("/")) return getBrowserWsBase()
	if (/^wss?:\/\//.test(rawBase)) return rawBase
	if (/^https?:\/\//.test(rawBase)) {
		return rawBase.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://")
	}
	return `wss://${rawBase}`
}

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

interface PresenceStateEvent {
	type: "presence_state"
	users: Array<{ user_id: string; is_online: boolean }>
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

interface ErrorEvent {
	type: "error"
	code: string
	message: string
}

type ServerEvent =
	| ConversationMessagesEvent
	| ChatMessageEvent
	| TypingEvent
	| PresenceEvent
	| PresenceStateEvent
	| DeliveryReceiptEvent
	| ReadReceiptEvent
	| ErrorEvent

// Error codes that mean "stop retrying, no credentials will ever be valid here"
const FATAL_ERROR_CODES = new Set(["AUTHENTICATION_FAILED", "PERMISSION_DENIED", "FORBIDDEN"])

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

function fromApiMessage(msg: ApiMessage): ChatMessage {
	return {
		id: msg.id,
		senderId: msg.sender_id,
		text: msg.text,
		timestamp: msg.timestamp,
		deliveredAt: msg.delivered_at ?? null,
		isRead: msg.is_read,
		readAt: msg.read_at ?? null,
		flagged: msg.flagged,
		flagReason: msg.flag_reason ?? null,
	}
}

function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]) {
	const mergedById = new Map(existing.map((m) => [m.id, m]))
	for (const m of incoming) {
		const previous = mergedById.get(m.id)
		mergedById.set(m.id, previous ? { ...previous, ...m } : m)
	}
	return [...mergedById.values()].sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	)
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

// Adaptive poll interval — slower for idle conversations, faster for active ones.
// Returns ms, or false to pause. Called by React Query after every fetch.
function pollIntervalForMessages(messages: ChatMessage[] | undefined): number {
	if (!messages || messages.length === 0) return 10_000
	const latestMs = messages.reduce(
		(max, m) => Math.max(max, new Date(m.timestamp).getTime()),
		0
	)
	const ageSeconds = (Date.now() - latestMs) / 1000
	if (ageSeconds < 30) return 3_000      // active — someone just sent something
	if (ageSeconds < 120) return 8_000     // recent
	if (ageSeconds < 600) return 20_000    // quiet
	return 60_000                          // idle (>10 min)
}

// Single source of truth for this conversation's messages.
// WS events and HTTP polls both write into the cache under this key.
const chatMessagesKey = (conversationId: string) =>
	["chat", conversationId, "messages"] as const

export function useChatSocket({
	conversationId,
	currentUserId,
	onMessage,
	onTyping,
	onPresence,
	onReadReceipt,
	onDeliveryReceipt,
}: UseChatSocketOptions): UseChatSocketReturn {
	const queryClient = useQueryClient()
	const wsRef = useRef<WebSocket | null>(null)
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const attemptRef = useRef(0)
	const unmountedRef = useRef(false)
	// Set when the server sends a fatal error (e.g. AUTHENTICATION_FAILED).
	// Prevents the reconnect loop from churning against credentials that won't work.
	const fatalErrorRef = useRef(false)

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

	const [isConnected, setIsConnected] = useState(false)
	const [isConnecting, setIsConnecting] = useState(false)
	const [usingHttpFallback, setUsingHttpFallback] = useState(false)
	const [otherUserOnline, setOtherUserOnline] = useState(false)
	const [otherUserTyping, setOtherUserTyping] = useState(false)

	// React Query owns the messages array. WS events feed it via setQueryData;
	// HTTP polling kicks in only when usingHttpFallback flips on.
	// structuralSharing (default) means refetches that produce equal data
	// keep the same array reference — no re-render unless something actually changed.
	const messagesQuery = useQuery({
		queryKey: chatMessagesKey(conversationId),
		queryFn: async () => {
			const response = await conversationsApi.messages(conversationId, 1, 100)
			return response.results.messages.map(fromApiMessage)
		},
		enabled: Boolean(conversationId && currentUserId) && usingHttpFallback,
		// Function form: RQ calls this with the current query state after each fetch
		// and reschedules accordingly. Idle convos drop to 1 poll/min.
		refetchInterval: (query) =>
			usingHttpFallback ? pollIntervalForMessages(query.state.data) : false,
		refetchIntervalInBackground: false,
		// Refetch immediately when the user comes back to the tab — feels instant
		// even though polling is slow while they were away.
		refetchOnWindowFocus: true,
		staleTime: 0,
	})

	// In fallback mode, the connection state the UI cares about is "can I send?".
	// That's a function of whether the HTTP path is working, not whether the WS is.
	// Mirror the query's success/loading into the public isConnected/isConnecting.
	useEffect(() => {
		if (!usingHttpFallback) return
		setIsConnected(messagesQuery.isSuccess)
		setIsConnecting(messagesQuery.isPending)
	}, [usingHttpFallback, messagesQuery.isSuccess, messagesQuery.isPending])

	// In fallback mode, when a poll surfaces unread messages from the other user,
	// mark them read via the same /api route. Fires only when data reference
	// actually changes (structural sharing), so quiet polls don't trigger it.
	useEffect(() => {
		if (!usingHttpFallback || !messagesQuery.data) return
		const hasUnreadFromOther = messagesQuery.data.some(
			(m) => m.senderId !== currentUserId && !m.isRead
		)
		if (hasUnreadFromOther) {
			conversationsApi.markRead(conversationId).catch(() => { /* swallow */ })
		}
	}, [messagesQuery.data, usingHttpFallback, currentUserId, conversationId])

	const sendRaw = useCallback((payload: object) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify(payload))
		}
	}, [])

	useEffect(() => {
		unmountedRef.current = false
		if (!conversationId || !currentUserId || usingHttpFallback) return

		function connect() {
			if (unmountedRef.current) return
			setIsConnecting(true)
			setIsConnected(false)

			const ws = new WebSocket(`${getWsBase()}/ws/chat/${conversationId}/`)
			wsRef.current = ws

			ws.onopen = () => {
				if (unmountedRef.current) { ws.close(); return }
				attemptRef.current = 0
				setUsingHttpFallback(false)
				setIsConnected(true)
				setIsConnecting(false)
				ws.send(JSON.stringify({ type: "get_presence" }))
			}

			ws.onclose = (event) => {
				setIsConnected(false)
				if (unmountedRef.current) return
				if (fatalErrorRef.current) {
					// Hand off to HTTP fallback — the useEffect watching query state
					// will now own isConnected/isConnecting. Don't preset them here.
					setUsingHttpFallback(true)
					return
				}
				const exhaustedReconnects = attemptRef.current >= MAX_RECONNECT_ATTEMPTS
				if (event.code === 1000) {
					setIsConnecting(false)
					return
				}
				if (exhaustedReconnects) {
					setUsingHttpFallback(true)
					return
				}
				const delay = Math.min(BASE_DELAY_MS * 2 ** attemptRef.current, MAX_DELAY_MS)
				attemptRef.current += 1
				setIsConnecting(true)
				reconnectTimeoutRef.current = setTimeout(connect, delay)
			}

			ws.onerror = () => {
				setIsConnecting(false)
			}

			ws.onmessage = (event) => {
				let data: ServerEvent
				try {
					data = JSON.parse(event.data as string) as ServerEvent
				} catch {
					return
				}

				const key = chatMessagesKey(conversationId)

				switch (data.type) {
					case "conversation_messages":
						queryClient.setQueryData<ChatMessage[]>(key, data.messages.map(fromInitial))
						break

					case "chat_message": {
						const msg = fromIncoming(data)
						queryClient.setQueryData<ChatMessage[]>(key, (old = []) => {
							if (old.some((m) => m.id === msg.id)) return old
							return [...old, msg]
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

					case "presence_state":
						for (const u of data.users) {
							if (u.user_id !== currentUserId) {
								setOtherUserOnline(u.is_online)
							}
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
						queryClient.setQueryData<ChatMessage[]>(key, (old = []) =>
							old.map((m) => m.id === data.message_id ? { ...m, deliveredAt: data.delivered_at } : m)
						)
						onDeliveryReceiptRef.current?.(data.message_id, data.delivered_at)
						break

					case "read_receipt":
						queryClient.setQueryData<ChatMessage[]>(key, (old = []) =>
							old.map((m) =>
								data.message_ids.includes(m.id) ? { ...m, isRead: true, readAt: data.read_at } : m
							)
						)
						onReadReceiptRef.current?.(data.message_ids, data.read_at)
						break

					case "error":
						if (FATAL_ERROR_CODES.has(data.code)) {
							fatalErrorRef.current = true
							if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
							ws.close(1000, `fatal: ${data.code}`)
						}
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
	}, [conversationId, currentUserId, sendRaw, usingHttpFallback, queryClient])

	const sendMessage = useCallback((text: string) => {
		const trimmedText = text.trim()
		if (!trimmedText) return
		if (usingHttpFallback) {
			void conversationsApi
				.send(conversationId, { text: trimmedText })
				.then((response) => {
					const nextMessage = fromApiMessage(response.data)
					queryClient.setQueryData<ChatMessage[]>(
						chatMessagesKey(conversationId),
						(old = []) => mergeMessages(old, [nextMessage])
					)
					setIsConnected(true)
					setIsConnecting(false)
				})
				.catch(() => {
					setIsConnected(false)
				})
			return
		}
		sendRaw({ type: "chat_message", text: trimmedText })
	}, [conversationId, sendRaw, usingHttpFallback, queryClient])

	const sendTyping = useCallback((isTyping: boolean) => {
		if (usingHttpFallback) return
		sendRaw({ type: "typing", is_typing: isTyping })
	}, [sendRaw, usingHttpFallback])

	const sendReadReceipt = useCallback((messageIds: string[]) => {
		if (messageIds.length === 0) return
		if (usingHttpFallback) {
			void conversationsApi.markRead(conversationId).catch(() => {
				setIsConnected(false)
			})
			return
		}
		sendRaw({ type: "read_receipt", message_ids: messageIds })
	}, [conversationId, sendRaw, usingHttpFallback])

	const reconnect = useCallback(() => {
		if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
		attemptRef.current = 0
		fatalErrorRef.current = false
		setUsingHttpFallback(false)
		wsRef.current?.close(1000, "manual reconnect")
	}, [])

	return {
		messages: messagesQuery.data ?? [],
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
