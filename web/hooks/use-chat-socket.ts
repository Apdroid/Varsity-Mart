"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.varsitymart.org"

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

type WebSocketEvent =
  | ConversationMessagesEvent
  | ChatMessageEvent
  | TypingEvent
  | PresenceEvent
  | DeliveryReceiptEvent
  | ReadReceiptEvent

function transformMessage(msg: ChatMessageEvent | ConversationMessagesEvent["messages"][0]): ChatMessage {
  const isLiveMessage = "message_id" in msg
  return {
    id: isLiveMessage ? (msg as ChatMessageEvent).message_id : msg.id,
    senderId: isLiveMessage ? (msg as ChatMessageEvent).sender_id : msg.sender_id,
    text: msg.text,
    timestamp: msg.timestamp,
    deliveredAt: isLiveMessage ? (msg as ChatMessageEvent).delivered_at : msg.delivered_at,
    isRead: isLiveMessage ? (msg as ChatMessageEvent).is_read : msg.is_read,
    readAt: isLiveMessage ? (msg as ChatMessageEvent).read_at : msg.read_at,
    flagged: msg.flagged,
    flagReason: isLiveMessage ? (msg as ChatMessageEvent).flag_reason : msg.flag_reason,
  }
}

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
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageQueueRef = useRef<string[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [otherUserOnline, setOtherUserOnline] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  const maxReconnectAttempts = 5

  const flushMessageQueue = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      while (messageQueueRef.current.length > 0) {
        const msg = messageQueueRef.current.shift()
        if (msg) wsRef.current.send(msg)
      }
    }
  }, [])

  const send = useCallback((data: object) => {
    const message = JSON.stringify(data)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    } else {
      messageQueueRef.current.push(message)
    }
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      return
    }

    setIsConnecting(true)

    const url = `${WS_BASE_URL}/ws/chat/${conversationId}/`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      setIsConnecting(false)
      reconnectAttemptsRef.current = 0
      flushMessageQueue()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent

        switch (data.type) {
          case "conversation_messages": {
            const initialMessages = data.messages.map(transformMessage)
            setMessages(initialMessages)
            break
          }

          case "chat_message": {
            const newMessage = transformMessage(data)
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) return prev
              return [...prev, newMessage]
            })
            onMessage?.(newMessage)

            if (data.sender_id !== currentUserId) {
              send({ type: "read_receipt", message_ids: [data.message_id] })
            }
            break
          }

          case "typing": {
            if (data.user_id !== currentUserId) {
              setOtherUserTyping(data.is_typing)
              onTyping?.(data.user_id, data.is_typing)

              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
              }
              if (data.is_typing) {
                typingTimeoutRef.current = setTimeout(() => {
                  setOtherUserTyping(false)
                }, 5000)
              }
            }
            break
          }

          case "user_joined":
          case "user_left": {
            if (data.user_id !== currentUserId) {
              setOtherUserOnline(data.is_online)
              onPresence?.(data.user_id, data.is_online)
            }
            break
          }

          case "delivery_receipt": {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === data.message_id ? { ...m, deliveredAt: data.delivered_at } : m
              )
            )
            onDeliveryReceipt?.(data.message_id, data.delivered_at)
            break
          }

          case "read_receipt": {
            setMessages((prev) =>
              prev.map((m) =>
                data.message_ids.includes(m.id) ? { ...m, isRead: true, readAt: data.read_at } : m
              )
            )
            onReadReceipt?.(data.message_ids, data.read_at)
            break
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err)
      }
    }

    ws.onclose = (event) => {
      setIsConnected(false)
      setIsConnecting(false)
      wsRef.current = null

      if (event.code === 4401) {
        console.error("WebSocket auth failed - token may be expired")
        return
      }

      if (event.code === 4403) {
        console.error("WebSocket access denied - not a participant")
        return
      }

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }, [conversationId, currentUserId, flushMessageQueue, onMessage, onTyping, onPresence, onReadReceipt, onDeliveryReceipt, send, isConnecting])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return
      send({ type: "chat_message", text: text.trim() })
    },
    [send]
  )

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      send({ type: "typing", is_typing: isTyping })
    },
    [send]
  )

  const sendReadReceipt = useCallback(
    (messageIds: string[]) => {
      if (messageIds.length === 0) return
      send({ type: "read_receipt", message_ids: messageIds })
    },
    [send]
  )

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttemptsRef.current = 0
    connect()
  }, [disconnect, connect])

  useEffect(() => {
    if (conversationId && currentUserId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [conversationId, currentUserId, connect, disconnect])

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
