"use client"

import { useEffect, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { wsClient, type WebSocketEvents } from "@/lib/utils/websocket"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useNotificationStore } from "@/lib/stores/notification-store"
import { queryKeys } from "@/lib/api/query-keys"

export function useWebSocket() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return

    // Connect to WebSocket. Server should authenticate via httpOnly cookies (sent automatically).
    wsClient.connect()

    // Handle new messages
    const handleNewMessage = (data: WebSocketEvents["new_message"]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(data.conversationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
    }

    // Handle order status updates
    const handleOrderUpdate = (data: WebSocketEvents["order_status_update"]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.orderId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() })
    }

    // Handle new notifications
    const handleNewNotification = (data: WebSocketEvents["new_notification"]) => {
      addNotification(data.notification)
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() })
    }

    wsClient.on("new_message", handleNewMessage)
    wsClient.on("order_status_update", handleOrderUpdate)
    wsClient.on("new_notification", handleNewNotification)

    return () => {
      wsClient.off("new_message", handleNewMessage)
      wsClient.off("order_status_update", handleOrderUpdate)
      wsClient.off("new_notification", handleNewNotification)
      wsClient.disconnect()
    }
  }, [isAuthenticated, queryClient, addNotification])

  const emitTyping = useCallback((conversationId: string) => {
    wsClient.emit("typing", { conversationId })
  }, [])

  const emitStopTyping = useCallback((conversationId: string) => {
    wsClient.emit("stop_typing", { conversationId })
  }, [])

  return {
    isConnected: wsClient.isConnected,
    emitTyping,
    emitStopTyping,
  }
}
