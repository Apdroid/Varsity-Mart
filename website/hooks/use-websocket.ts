"use client"

import { useEffect, useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { wsClient } from "@/lib/utils/websocket"
import { useAuth } from "@/hooks/queries/useAuth"
import { queryKeys } from "@/lib/api/query-keys"

export function useWebSocket() {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const [isConnected, setIsConnected] = useState(wsClient.isConnected)

	useEffect(() => {
		if (!isAuthenticated || typeof window === "undefined") return

		wsClient.connect()

		const unsubscribeConnection = wsClient.onConnectionChange(setIsConnected)

		const handleNewMessage = (data: unknown) => {
			const { conversationId } = data as { conversationId: string }
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(conversationId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
		}

		const handleOrderUpdate = (data: unknown) => {
			const { orderId } = data as { orderId: string }
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() })
		}

		const handleNewNotification = () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() })
		}

		wsClient.on("new_message", handleNewMessage)
		wsClient.on("order_status_update", handleOrderUpdate)
		wsClient.on("new_notification", handleNewNotification)

		return () => {
			unsubscribeConnection()
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

	return { isConnected, emitTyping, emitStopTyping }
}
