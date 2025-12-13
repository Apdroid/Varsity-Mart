import { io, type Socket } from "socket.io-client"

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || "wss://api.varsitymart.com"

class WebSocketClient {
  private socket: Socket | null = null
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map()

  connect(token: string) {
    if (this.socket?.connected) return

    this.socket = io(WS_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on("connect", () => {
      console.log("WebSocket connected")
    })

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason)
    })

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error)
    })

    // Re-attach all listeners after reconnection
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback)
      })
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    this.socket?.on(event, callback)
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    this.listeners.get(event)?.delete(callback)
    this.socket?.off(event, callback)
  }

  emit(event: string, data?: unknown) {
    this.socket?.emit(event, data)
  }

  get isConnected() {
    return this.socket?.connected ?? false
  }
}

export const wsClient = new WebSocketClient()

// WebSocket event types
export type WebSocketEvents = {
  new_message: { conversationId: string; message: Message }
  order_status_update: { orderId: string; status: string }
  new_notification: { notification: Notification }
  typing: { conversationId: string; userId: string }
  stop_typing: { conversationId: string; userId: string }
}

import type { Message, Notification } from "@/types/models"
