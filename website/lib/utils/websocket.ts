import { io, type Socket } from "socket.io-client"

type EventCallback = (...args: unknown[]) => void
type ConnectionListener = (connected: boolean) => void

class WebSocketClient {
	private socket: Socket | null = null
	private _isConnected = false
	private refCount = 0
	private listeners = new Map<string, Set<EventCallback>>()
	private connectionListeners = new Set<ConnectionListener>()

	get isConnected() {
		return this._isConnected
	}

	/** Subscribe to connection state changes. Returns an unsubscribe fn. */
	onConnectionChange(listener: ConnectionListener): () => void {
		this.connectionListeners.add(listener)
		return () => this.connectionListeners.delete(listener)
	}

	connect() {
		this.refCount++
		if (this.socket?.connected) return

		const url =
			process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "wss://api.varsitymart.org/ws/chat"

		this.socket = io(url, {
			withCredentials: true,
			transports: ["websocket", "polling"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		})

		this.socket.on("connect", () => {
			this._isConnected = true
			this.connectionListeners.forEach((l) => l(true))
		})

		this.socket.on("disconnect", () => {
			this._isConnected = false
			this.connectionListeners.forEach((l) => l(false))
		})

		this.socket.on("connect_error", (err) => {
			console.warn("[WS] Connection error:", err.message)
		})

		// Re-attach any listeners registered before connect()
		this.listeners.forEach((callbacks, event) => {
			callbacks.forEach((cb) => this.socket?.on(event, cb))
		})
	}

	disconnect() {
		this.refCount = Math.max(0, this.refCount - 1)
		if (this.refCount > 0) return
		this.socket?.disconnect()
		this.socket = null
		this._isConnected = false
	}

	on(event: string, callback: EventCallback) {
		if (!this.listeners.has(event)) this.listeners.set(event, new Set())
		this.listeners.get(event)!.add(callback)
		this.socket?.on(event, callback)
	}

	off(event: string, callback: EventCallback) {
		this.listeners.get(event)?.delete(callback)
		this.socket?.off(event, callback)
	}

	emit(event: string, data: unknown) {
		if (this._isConnected) this.socket?.emit(event, data)
	}
}

export const wsClient = new WebSocketClient()
export type WebSocketEvents = Record<string, unknown>
