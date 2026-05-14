"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
	ArrowLeft,
	Send,
	MoreVertical,
	Flag,
	WifiOff,
	Loader2,
	Check,
	CheckCheck,
	Package,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { useConversation, useReportMessage } from "@/hooks/queries/use-conversations"
import { useChatSocket, type ChatMessage } from "@/hooks/use-chat-socket"
import { toast } from "sonner"

type Props = {
	params: Promise<{ id: string }>
}

function formatTime(dateStr: string) {
	return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)
	if (date.toDateString() === today.toDateString()) return "Today"
	if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
	return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
}

function initials(name: string) {
	return name
		.split(" ")
		.map((p) => p[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase()
}

function groupMessagesByDate(messages: ChatMessage[]) {
	const groups = new Map<string, ChatMessage[]>()
	messages.forEach((msg) => {
		const key = new Date(msg.timestamp).toDateString()
		if (!groups.has(key)) groups.set(key, [])
		groups.get(key)!.push(msg)
	})
	return groups
}

// ── Message status icon ────────────────────────────────────────────────────────
function MessageStatus({ message }: { message: ChatMessage }) {
	if (message.isRead) {
		return <CheckCheck className="h-3.5 w-3.5 text-vm-tangerine" />
	}
	if (message.deliveredAt) {
		return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
	}
	return <Check className="h-3.5 w-3.5 text-muted-foreground/40" />
}

// ── Single message bubble ──────────────────────────────────────────────────────
function MessageBubble({
	message,
	isOwn,
	showAvatar,
	otherUserAvatar,
	otherUserName,
	onReport,
}: {
	message: ChatMessage
	isOwn: boolean
	showAvatar: boolean
	otherUserAvatar?: string
	otherUserName: string
	onReport: (id: string) => void
}) {
	return (
		<div className={cn("group flex gap-2 items-end", isOwn ? "flex-row-reverse" : "flex-row")}>
			{/* Avatar placeholder keeps alignment consistent */}
			{!isOwn && (
				<div className="w-7 shrink-0">
					{showAvatar ? (
						<Avatar className="h-7 w-7">
							<AvatarImage src={otherUserAvatar} alt={otherUserName} />
							<AvatarFallback className="bg-muted text-[10px] font-bold">
								{initials(otherUserName)}
							</AvatarFallback>
						</Avatar>
					) : null}
				</div>
			)}

			<div className={cn("flex max-w-[72%] flex-col gap-1", isOwn && "items-end")}>
				<div
					className={cn(
						"rounded-2xl px-3.5 py-2.5",
						isOwn
							? "rounded-br-sm bg-vm-tangerine text-vm-tangerine-foreground"
							: "rounded-bl-sm bg-muted text-foreground"
					)}
				>
					<p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{message.text}</p>
				</div>

				{/* Timestamp + status */}
				<div className="flex items-center gap-1.5 px-1">
					<span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
					{isOwn && <MessageStatus message={message} />}
					{message.flagged && (
						<span className="text-[10px] text-destructive">Flagged</span>
					)}
				</div>
			</div>

			{/* Report button (appears on hover for incoming messages) */}
			{!isOwn && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="mb-6 shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
						>
							<MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="text-sm">
						<DropdownMenuItem onClick={() => onReport(message.id)}>
							<Flag className="mr-2 h-3.5 w-3.5" />
							Report message
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
	return (
		<div className="flex items-end gap-2 pl-9">
			<div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
				<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
				<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
				<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
			</div>
			<span className="mb-1 text-[10px] text-muted-foreground">{name}</span>
		</div>
	)
}

// ── Connection status ──────────────────────────────────────────────────────────
function ConnectionBadge({ isConnected, isConnecting }: { isConnected: boolean; isConnecting: boolean }) {
	if (isConnecting) {
		return (
			<div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
				<Loader2 className="h-3 w-3 animate-spin" />
				Connecting
			</div>
		)
	}
	if (!isConnected) {
		return (
			<div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] text-destructive">
				<WifiOff className="h-3 w-3" />
				Offline
			</div>
		)
	}
	return null
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function ChatSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-3 border-b border-border px-4 py-3">
				<Skeleton className="h-9 w-9 rounded-full" />
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>
			<div className="flex-1 space-y-3 p-4">
				{[48, 32, 56, 40, 28, 64].map((w, i) => (
					<div key={i} className={cn("flex", i % 2 === 0 ? "justify-start pl-9" : "justify-end")}>
						<Skeleton className={`h-9 rounded-2xl`} style={{ width: `${w * 2}px` }} />
					</div>
				))}
			</div>
		</div>
	)
}

// ── Main conversation content ──────────────────────────────────────────────────
function ConversationContent({ conversationId }: { conversationId: string }) {
	const router = useRouter()
	const { user } = useAuth()
	const messagesEndRef = React.useRef<HTMLDivElement>(null)
	const textareaRef = React.useRef<HTMLTextAreaElement>(null)
	const [text, setText] = React.useState("")
	const [isTyping, setIsTyping] = React.useState(false)
	const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const { data: convData, isLoading } = useConversation(conversationId)
	const { mutate: reportMessage } = useReportMessage()

	const conversation = convData?.results
	const otherUser = conversation?.other_user
	const displayName =
		otherUser
			? [otherUser.firstName, otherUser.lastName].filter(Boolean).join(" ").trim() ||
			otherUser.name ||
			"User"
			: ""

	const { messages, isConnected, isConnecting, otherUserOnline, otherUserTyping, sendMessage, sendTyping } =
		useChatSocket({ conversationId, currentUserId: user?.id ?? "" })

	// Scroll to bottom on new messages or typing indicator
	React.useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages, otherUserTyping])

	// Auto-resize textarea
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
		e.target.style.height = "auto"
		e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`

		if (!isTyping) {
			setIsTyping(true)
			sendTyping(true)
		}
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		typingTimeoutRef.current = setTimeout(() => {
			setIsTyping(false)
			sendTyping(false)
		}, 2000)
	}

	const handleSend = (e?: React.SubmitEvent<HTMLFormElement>) => {
		e?.preventDefault()
		if (!text.trim() || !isConnected) return
		sendMessage(text.trim())
		setText("")
		setIsTyping(false)
		sendTyping(false)
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		// Reset textarea height
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"
			textareaRef.current.focus()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const handleReport = (messageId: string) => {
		reportMessage(
			{ messageId, reason: "inappropriate" },
			{
				onSuccess: () => toast.success("Message reported"),
				onError: () => toast.error("Failed to report message"),
			}
		)
	}

	if (isLoading) return <ChatSkeleton />

	if (!conversation || !otherUser) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3">
				<p className="text-sm text-muted-foreground">Conversation not found</p>
				<Button variant="ghost" size="sm" onClick={() => router.push("/messages")}>
					Back to messages
				</Button>
			</div>
		)
	}

	const messageGroups = groupMessagesByDate(messages)

	return (
		<div className="flex h-full flex-col">
			{/* ── Header ──────────────────────────────────────────────── */}
			<div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2.5">
				{/* Back arrow — only visible on mobile since desktop always shows sidebar */}
				<button
					type="button"
					onClick={() => router.push("/messages")}
					className="rounded-full p-1.5 hover:bg-muted md:hidden"
				>
					<ArrowLeft className="h-4 w-4" />
				</button>

				<Link href={`/users/${otherUser.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
					<div className="relative shrink-0">
						<Avatar className="h-9 w-9">
							<AvatarImage src={otherUser.avatar} alt={displayName} />
							<AvatarFallback className="bg-vm-tangerine/10 text-vm-tangerine text-xs font-bold">
								{initials(displayName)}
							</AvatarFallback>
						</Avatar>
						{otherUserOnline && (
							<span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
						)}
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold leading-tight">{displayName}</p>
						<p className="text-[11px] text-muted-foreground leading-tight">
							{otherUserOnline
								? "Online now"
								: otherUser.isVerified
									? "Verified seller"
									: "Offline"}
						</p>
					</div>
				</Link>

				<div className="flex shrink-0 items-center gap-2">
					<ConnectionBadge isConnected={isConnected} isConnecting={isConnecting} />

					{/* Product context chip */}
					{conversation.product && (
						<Link
							href={`/products/${conversation.product.id}`}
							className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs transition-colors hover:bg-muted sm:flex"
						>
							{conversation.product.image ? (
								<Image
									width={1200}
									height={1200}
									src={conversation.product.image}
									alt=""
									className="h-7 w-7 rounded-md object-cover"
								/>
							) : (
								<Package className="h-4 w-4 text-muted-foreground" />
							)}
							<span className="max-w-30 truncate font-medium">
								{conversation.product.title}
							</span>
						</Link>
					)}
				</div>
			</div>

			{/* ── Messages ────────────────────────────────────────────── */}
			<div className="flex-1 overflow-y-auto px-4 py-4">
				{messages.length === 0 && !isConnecting ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 text-center">
						<Avatar className="h-14 w-14">
							<AvatarImage src={otherUser.avatar} alt={displayName} />
							<AvatarFallback className="bg-vm-tangerine/10 text-vm-tangerine font-bold">
								{initials(displayName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">{displayName}</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Send a message to kick things off
							</p>
						</div>
						{conversation.product && (
							<Link
								href={`/products/${conversation.product.id}`}
								className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
							>
								{conversation.product.image && (
									<Image width={400} height={400} src={conversation.product.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
								)}
								<span className="font-medium">{conversation.product.title}</span>
							</Link>
						)}
					</div>
				) : (
					<div className="space-y-5">
						{Array.from(messageGroups.entries()).map(([dateKey, msgs]) => (
							<div key={dateKey}>
								<div className="mb-3 flex justify-center">
									<span className="rounded-full bg-muted px-3 py-0.5 text-[11px] text-muted-foreground">
										{formatDate(msgs[0].timestamp)}
									</span>
								</div>
								<div className="space-y-1.5">
									{msgs.map((msg, idx) => {
										const isOwn = msg.senderId === user?.id
										const prevMsg = msgs[idx - 1]
										const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId
										return (
											<MessageBubble
												key={msg.id}
												message={msg}
												isOwn={isOwn}
												showAvatar={showAvatar}
												otherUserAvatar={otherUser.avatar}
												otherUserName={displayName}
												onReport={handleReport}
											/>
										)
									})}
								</div>
							</div>
						))}
						{otherUserTyping && <TypingIndicator name={displayName} />}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* ── Composer ────────────────────────────────────────────── */}
			<form
				onSubmit={handleSend}
				className="shrink-0 border-t border-border bg-background px-4 py-3"
			>
				<div className="flex items-end gap-2">
					<Textarea
						ref={textareaRef}
						value={text}
						onChange={handleTextChange}
						onKeyDown={handleKeyDown}
						placeholder={isConnected ? "Message…" : "Reconnecting…"}
						disabled={!isConnected}
						rows={1}
						className="max-h-30 min-h-10 flex-1 resize-none overflow-hidden py-2.5 text-sm leading-relaxed"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={!text.trim() || !isConnected}
						className="h-10 w-10 shrink-0 bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90 disabled:opacity-40"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
				<p className="mt-1.5 text-[10px] text-muted-foreground/60">
					Enter to send · Shift+Enter for new line
				</p>
			</form>
		</div>
	)
}

// ── Page entry ─────────────────────────────────────────────────────────────────
export default function ConversationPage({ params }: Props) {
	const { id } = use(params)
	const { isAuthenticated, isLoading } = useAuth()
	const router = useRouter()

	React.useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(`/login?redirect=/messages/${id}`)
		}
	}, [isLoading, isAuthenticated, id, router])

	if (isLoading || !isAuthenticated) return <ChatSkeleton />

	return <ConversationContent conversationId={id} />
}
