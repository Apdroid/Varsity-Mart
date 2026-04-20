"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
	Search,
	Send,
	MoreVertical,
	ImageIcon,
	ArrowLeft,
	CheckCheck,
	ShoppingBag,
	Smile,
	Paperclip,
	ChevronRight,
	Wifi,
	WifiOff,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from "@/hooks/queries/useChat"
import { useProducts } from "@/hooks/queries/useProducts"
import { useAuth } from "@/hooks/queries/useAuth"
import { useWebSocket } from "@/hooks/use-websocket"
import { wsClient } from "@/lib/utils/websocket"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Conversation List Item ─────────────────────────────────────────────────
function ConversationItem({
	conversation,
	isActive,
	onClick,
}: {
	conversation: any
	isActive: boolean
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full px-4 py-3 flex items-start gap-3 transition-colors text-left",
				"hover:bg-accent/50",
				isActive && "bg-accent",
			)}
		>
			<div className="relative shrink-0">
				<Avatar className="h-11 w-11">
					<AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
					<AvatarFallback className="text-sm font-medium">
						{conversation.user.name[0]}
					</AvatarFallback>
				</Avatar>
				{conversation.user.isOnline && (
					<span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-0.5">
					<span
						className={cn(
							"text-sm",
							conversation.unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground",
						)}
					>
						{conversation.user.name}
					</span>
					<span
						className={cn(
							"text-[11px] shrink-0",
							conversation.unread > 0 ? "text-primary font-medium" : "text-muted-foreground",
						)}
					>
						{conversation.time}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<p
						className={cn(
							"text-[13px] truncate flex-1",
							conversation.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground",
						)}
					>
						{conversation.lastMessage}
					</p>
					{conversation.unread > 0 && (
						<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground px-1.5 shrink-0">
							{conversation.unread}
						</span>
					)}
				</div>
				{conversation.product && (
					<div className="flex items-center gap-2 mt-1.5 px-2 py-1.5 bg-muted/60 rounded-lg">
						<div className="w-6 h-6 rounded overflow-hidden shrink-0">
							<Image
								src={conversation.product.image || "/placeholder.svg"}
								alt={conversation.product.title}
								width={24}
								height={24}
								className="object-cover w-full h-full"
							/>
						</div>
						<span className="text-[11px] text-muted-foreground truncate">
							{conversation.product.title}
						</span>
					</div>
				)}
			</div>
		</button>
	)
}

// ─── Message Bubble ─────────────────────────────────────────────────────────
function MessageBubble({ message, isMe }: { message: any; isMe: boolean }) {
	const time = message.time ?? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	return (
		<div className={cn("flex gap-2 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
			<div
				className={cn(
					"rounded-2xl px-4 py-2.5 shadow-sm",
					isMe
						? "bg-primary text-primary-foreground rounded-br-md"
						: "bg-card border border-border rounded-bl-md",
					message.id?.startsWith("temp-") && "opacity-70",
				)}
			>
				<p className="text-sm leading-relaxed">{message.content}</p>
				<div
					className={cn(
						"flex items-center justify-end gap-1 mt-1",
						isMe ? "text-primary-foreground/60" : "text-muted-foreground",
					)}
				>
					<span className="text-[10px]">{time}</span>
					{isMe && <CheckCheck className="h-3.5 w-3.5" />}
				</div>
			</div>
		</div>
	)
}

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
	return (
		<div className="flex gap-2 max-w-[80%]">
			<div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm flex items-center gap-1.5">
				<span className="text-[11px] text-muted-foreground">{name} is typing</span>
				<span className="flex gap-0.5 items-center">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
							style={{ animationDelay: `${i * 150}ms` }}
						/>
					))}
				</span>
			</div>
		</div>
	)
}

// ─── Recommended Products Panel ─────────────────────────────────────────────
function RecommendedProducts({ className }: { className?: string }) {
	const { data: response, isLoading } = useProducts({ limit: 6 })
	const products = response?.data?.products ?? []

	return (
		<div className={cn("flex flex-col h-full", className)}>
			<div className="px-4 py-3 border-b border-border">
				<h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
					<ShoppingBag className="h-4 w-4 text-primary" />
					Recommended
				</h3>
				<p className="text-[11px] text-muted-foreground mt-0.5">Based on your conversations</p>
			</div>
			<ScrollArea className="flex-1">
				<div className="p-3 space-y-3">
					{isLoading ? (
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex gap-3 p-2">
								<Skeleton className="h-16 w-16 rounded-lg shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-3 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
									<Skeleton className="h-4 w-1/3" />
								</div>
							</div>
						))
					) : products.length > 0 ? (
						products.map((product) => (
							<Link
								key={product.id}
								href={`/products/${product.id}`}
								className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
							>
								<div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
									<Image
										src={product.images?.[0]?.url || product.images?.[0]?.optimized_url || "/placeholder.svg"}
										alt={product.title}
									fill
									sizes="64px"
									className="object-cover group-hover:scale-105 transition-transform"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
										{product.title}
									</p>
									<p className="text-[11px] text-muted-foreground mt-0.5">
										{product.condition?.replace("-", " ")}
									</p>
									<p className="text-sm font-bold text-primary mt-1">
										GH₵{product.price?.toLocaleString()}
									</p>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
							</Link>
						))
					) : (
						<p className="text-sm text-muted-foreground text-center py-8">No recommendations yet</p>
					)}
				</div>
			</ScrollArea>
			<div className="p-3 border-t border-border">
				<Button variant="outline" size="sm" className="w-full bg-transparent text-xs" asChild>
					<Link href="/products">Browse All Products</Link>
				</Button>
			</div>
		</div>
	)
}

// ─── Empty Chat State ───────────────────────────────────────────────────────
function EmptyChatState() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center text-center px-8">
			<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
				<Send className="h-8 w-8 text-primary" />
			</div>
			<h3 className="text-lg font-semibold text-foreground mb-1">Your Messages</h3>
			<p className="text-sm text-muted-foreground max-w-xs">
				Select a conversation to start chatting, or message a seller from their product page
			</p>
		</div>
	)
}

// ─── Main Content ───────────────────────────────────────────────────────────
export function MessagesPageContent() {
	const { user } = useAuth()
	const { isConnected, emitTyping, emitStopTyping } = useWebSocket()

	const { data: conversationsResponse, isLoading: loadingConversations } = useConversations()
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [newMessage, setNewMessage] = useState("")
	const [showSidebar, setShowSidebar] = useState(true)
	const [searchQuery, setSearchQuery] = useState("")
	const [typingName, setTypingName] = useState<string | null>(null)

	const messagesEndRef = useRef<HTMLDivElement>(null)
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const conversations = Array.isArray(conversationsResponse?.data)
		? conversationsResponse.data
		: conversationsResponse?.data
			? [conversationsResponse.data]
			: []

	const selectedConversation: any = conversations.find((c: any) => c.id === selectedId) || null

	const { data: messagesResponse } = useMessages(selectedId || "")
	const { mutate: sendMessage, isPending: isSending } = useSendMessage()
	const { mutate: markAsRead } = useMarkAsRead()

	const allMessages = messagesResponse?.pages?.flatMap((p: any) => p.data || []) || []

	const filteredConversations = searchQuery
		? conversations.filter(
				(c: any) =>
					c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: conversations

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [allMessages.length])

	// Listen for typing events on the selected conversation
	useEffect(() => {
		if (!selectedId) return

		const handleTyping = (data: unknown) => {
			const { conversationId, userName } = data as { conversationId: string; userName: string }
			if (conversationId !== selectedId) return
			setTypingName(userName ?? "Someone")
		}

		const handleStopTyping = (data: unknown) => {
			const { conversationId } = data as { conversationId: string }
			if (conversationId !== selectedId) return
			setTypingName(null)
		}

		wsClient.on("typing", handleTyping)
		wsClient.on("stop_typing", handleStopTyping)

		return () => {
			wsClient.off("typing", handleTyping)
			wsClient.off("stop_typing", handleStopTyping)
			setTypingName(null)
		}
	}, [selectedId])

	const handleSelectConversation = useCallback(
		(id: string) => {
			setSelectedId(id)
			setShowSidebar(false)
			const conv = conversations.find((c: any) => c.id === id)
			if ((conv as any)?.unread > 0 || (conv as any)?.unreadCount > 0) {
				markAsRead(id)
			}
		},
		[conversations, markAsRead],
	)

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setNewMessage(e.target.value)
			if (!selectedId) return

			// Emit typing — debounce stop_typing by 2s
			emitTyping(selectedId)
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
			typingTimeoutRef.current = setTimeout(() => {
				emitStopTyping(selectedId)
			}, 2000)
		},
		[selectedId, emitTyping, emitStopTyping],
	)

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim() || !selectedId) return

		// Clear typing indicator immediately
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		emitStopTyping(selectedId)

		sendMessage({
			conversationId: selectedId,
			data: { conversationId: selectedId, content: newMessage.trim() },
		})
		setNewMessage("")
	}

	return (
		<div className="h-[calc(100vh-4rem)] flex bg-background">
			{/* ─── Conversations Sidebar ──────────────────────────────────────── */}
			<div
				className={cn(
					"w-full md:w-80 lg:w-[340px] border-r border-border flex flex-col bg-background shrink-0",
					!showSidebar && "hidden md:flex",
				)}
			>
				{/* Header */}
				<div className="px-4 pt-4 pb-3">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-bold text-foreground">Messages</h1>
							{isConnected ? (
								<Wifi className="h-3.5 w-3.5 text-emerald-500" />
							) : (
								<WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
							)}
						</div>
						<Badge variant="secondary" className="text-xs">
							{conversations.filter((c: any) => c.unread > 0).length} unread
						</Badge>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search conversations..."
							className="pl-10 h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<Separator />

				{/* Conversations List */}
				<ScrollArea className="flex-1">
					{loadingConversations ? (
						<div className="space-y-1 p-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-start gap-3 p-3">
									<Skeleton className="h-11 w-11 rounded-full shrink-0" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-3 w-24" />
										<Skeleton className="h-3 w-full" />
									</div>
								</div>
							))}
						</div>
					) : filteredConversations.length > 0 ? (
						<div className="py-1">
							{filteredConversations.map((conversation: any) => (
								<ConversationItem
									key={conversation.id}
									conversation={conversation}
									isActive={selectedId === conversation.id}
									onClick={() => handleSelectConversation(conversation.id)}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
							<Search className="h-8 w-8 text-muted-foreground mb-2" />
							<p className="text-sm text-muted-foreground">
								{searchQuery ? "No conversations match your search" : "No conversations yet"}
							</p>
						</div>
					)}
				</ScrollArea>
			</div>

			{/* ─── Chat Area ──────────────────────────────────────────────────── */}
			<div className={cn("flex-1 flex flex-col min-w-0", showSidebar && "hidden md:flex")}>
				{selectedConversation ? (
					<>
						{/* Chat Header */}
						<div className="h-[60px] px-4 border-b border-border flex items-center justify-between bg-background shrink-0">
							<div className="flex items-center gap-3">
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden h-8 w-8"
									onClick={() => setShowSidebar(true)}
								>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<Avatar className="h-9 w-9">
									<AvatarImage src={selectedConversation.user.avatar || "/placeholder.svg"} />
									<AvatarFallback className="text-xs">
										{selectedConversation.user.name[0]}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-foreground truncate">
										{selectedConversation.user.name}
									</p>
									<p className="text-[11px] text-muted-foreground flex items-center gap-1">
										{selectedConversation.user.isOnline ? (
											<>
												<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
												Online
											</>
										) : (
											"Offline"
										)}
									</p>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>View Profile</DropdownMenuItem>
									<DropdownMenuItem>Block User</DropdownMenuItem>
									<DropdownMenuItem className="text-destructive">Delete Chat</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Product Context Banner */}
						{selectedConversation.product && (
							<div className="px-4 py-2.5 bg-accent/30 border-b border-border flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
									<Image
										src={selectedConversation.product.image || "/placeholder.svg"}
										alt={selectedConversation.product.title}
										width={40}
										height={40}
										className="object-cover w-full h-full"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-foreground truncate">
										{selectedConversation.product.title}
									</p>
									<p className="text-[11px] text-muted-foreground">About this product</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									className="bg-transparent text-xs h-7 shrink-0"
									asChild
								>
									<Link href={`/products/${selectedConversation.product.id || "#"}`}>View</Link>
								</Button>
							</div>
						)}

						{/* Messages */}
						<ScrollArea className="flex-1 px-4">
							<div className="py-4 space-y-3">
								{/* Date separator */}
								<div className="flex items-center gap-3 py-2">
									<Separator className="flex-1" />
									<span className="text-[11px] text-muted-foreground font-medium px-2 shrink-0">
										Today
									</span>
									<Separator className="flex-1" />
								</div>

								{allMessages.map((message: any) => (
									<MessageBubble
										key={message.id}
										message={message}
										isMe={
											message.senderId === user?.id || message.senderId === "me"
										}
									/>
								))}

								{/* Typing indicator */}
								{typingName && <TypingIndicator name={typingName} />}

								<div ref={messagesEndRef} />
							</div>
						</ScrollArea>

						{/* Message Input */}
						<div className="px-4 py-3 border-t border-border bg-background shrink-0">
							<form onSubmit={handleSendMessage} className="flex items-end gap-2">
								<div className="flex gap-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-9 w-9 text-muted-foreground hover:text-foreground"
									>
										<Paperclip className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-9 w-9 text-muted-foreground hover:text-foreground"
									>
										<ImageIcon className="h-4 w-4" />
									</Button>
								</div>
								<div className="flex-1 relative">
									<Input
										placeholder="Type a message..."
										value={newMessage}
										onChange={handleInputChange}
										className="pr-10 bg-muted/50 border-0 focus-visible:ring-1"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
									>
										<Smile className="h-4 w-4" />
									</Button>
								</div>
								<Button
									type="submit"
									size="icon"
									className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 shrink-0"
									disabled={!newMessage.trim() || isSending}
								>
									<Send className="h-4 w-4" />
								</Button>
							</form>
						</div>
					</>
				) : (
					<EmptyChatState />
				)}
			</div>

			{/* ─── Recommended Products Panel (Desktop Only) ──────────────────── */}
			<div className="hidden xl:flex w-72 border-l border-border shrink-0">
				<RecommendedProducts className="w-full" />
			</div>
		</div>
	)
}
