"use client"

import { useEffect, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { wsClient, type WebSocketEvents } from "@/lib/utils/websocket"
import { useAuth } from "@/hooks/queries/useAuth"
import { queryKeys } from "@/lib/api/query-keys"

export function useWebSocket() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return

    wsClient.connect()

    const handleNewMessage = (data: WebSocketEvents["new_message"]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(data.conversationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
    }

    const handleOrderUpdate = (data: WebSocketEvents["order_status_update"]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.orderId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() })
    }

    const handleNewNotification = (_data: WebSocketEvents["new_notification"]) => {
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
  }, [isAuthenticated, queryClient])

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
