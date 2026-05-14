"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, MessageSquareDashed } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useConversations } from "@/hooks/queries/use-conversations"
import type { Conversation } from "@/lib/api/types"
import Image from "next/image"

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime()
	const mins = Math.floor(diff / 60000)
	if (mins < 1) return "now"
	if (mins < 60) return `${mins}m`
	const hours = Math.floor(mins / 60)
	if (hours < 24) return `${hours}h`
	const days = Math.floor(hours / 24)
	if (days < 7) return `${days}d`
	return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" })
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

function ConversationRow({
	conversation,
	isActive,
}: {
	conversation: Conversation
	isActive: boolean
}) {
	const other = conversation.other_user
	const displayName =
		[other.firstName, other.lastName].filter(Boolean).join(" ").trim() ||
		other.name ||
		"User"

	const lastText = conversation.last_message?.text || "Tap to start chatting"
	const hasUnread = conversation.unread_count > 0
	const ts = conversation.last_message?.timestamp || conversation.created_at

	return (
		<Link
			href={`/messages/${conversation.id}`}
			className={cn(
				"flex gap-3 px-4 py-3 transition-colors",
				isActive
					? "bg-vm-tangerine/10 border-l-2 border-vm-tangerine"
					: "border-l-2 border-transparent hover:bg-muted/60",
				hasUnread && !isActive && "bg-vm-tangerine/5"
			)}
		>
			{/* Avatar */}
			<div className="relative shrink-0">
				<Avatar className="h-11 w-11">
					<AvatarImage src={other.avatar} alt={displayName} />
					<AvatarFallback className="bg-vm-tangerine/10 text-vm-tangerine text-sm font-bold">
						{initials(displayName)}
					</AvatarFallback>
				</Avatar>
				{/* Online dot — we don't have live presence in the list, so omit */}
			</div>

			{/* Text */}
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline justify-between gap-2">
					<span
						className={cn(
							"truncate text-sm",
							hasUnread ? "font-bold text-foreground" : "font-medium text-foreground/90"
						)}
					>
						{displayName}
					</span>
					<span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(ts)}</span>
				</div>

				<div className="mt-0.5 flex items-center justify-between gap-2">
					<p
						className={cn(
							"truncate text-xs",
							hasUnread ? "font-medium text-foreground/80" : "text-muted-foreground"
						)}
					>
						{lastText}
					</p>
					{hasUnread && (
						<span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-vm-tangerine px-1.5 text-[10px] font-bold text-vm-tangerine-foreground">
							{conversation.unread_count > 99 ? "99+" : conversation.unread_count}
						</span>
					)}
				</div>

				{/* Product chip */}
				{conversation.product && (
					<div className="mt-1.5 flex items-center gap-1.5 rounded-md bg-muted/80 px-2 py-0.5">
						{conversation.product.image && (
							<Image
								width={16}
								height={16}
								src={conversation.product.image}
								alt=""
								className="h-4 w-4 rounded object-cover"
							/>
						)}
						<span className="truncate text-[11px] text-muted-foreground">
							{conversation.product.title}
						</span>
					</div>
				)}
			</div>
		</Link>
	)
}

function SidebarSkeleton() {
	return (
		<div className="divide-y divide-border/50">
			{Array.from({ length: 7 }).map((_, i) => (
				<div key={i} className="flex gap-3 px-4 py-3">
					<Skeleton className="h-11 w-11 rounded-full shrink-0" />
					<div className="flex-1 space-y-2 pt-0.5">
						<div className="flex justify-between">
							<Skeleton className="h-3.5 w-28" />
							<Skeleton className="h-3 w-8" />
						</div>
						<Skeleton className="h-3 w-44" />
					</div>
				</div>
			))}
		</div>
	)
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-16 text-center">
			<MessageSquareDashed className="mb-4 h-10 w-10 text-muted-foreground/30" />
			<p className="text-sm font-semibold text-foreground">No conversations yet</p>
			<p className="mt-1 text-xs text-muted-foreground leading-relaxed">
				Message a seller from any product page to start haggling
			</p>
		</div>
	)
}

export function ConversationsSidebar() {
	const pathname = usePathname()
	const [search, setSearch] = React.useState("")
	const { data, isLoading } = useConversations()

	const activeId = pathname.startsWith("/messages/")
		? pathname.replace("/messages/", "").split("/")[0]
		: null

	const raw = data?.results
	const conversations: Conversation[] = Array.isArray(raw) ? raw : []
	const filtered = search
		? conversations.filter((c) => {
			const name = [c.other_user.firstName, c.other_user.lastName, c.other_user.name]
				.filter(Boolean)
				.join(" ")
				.toLowerCase()
			return name.includes(search.toLowerCase())
		})
		: conversations

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="shrink-0 px-4 pb-3 pt-4">
				<h1 className="mb-3 text-lg font-bold font-heading">Messages</h1>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9 pl-8 text-sm"
					/>
				</div>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<SidebarSkeleton />
				) : filtered.length === 0 ? (
					search ? (
						<p className="px-4 py-8 text-center text-xs text-muted-foreground">
							No conversations matching &ldquo;{search}&rdquo;
						</p>
					) : (
						<EmptyState />
					)
				) : (
					<div className="divide-y divide-border/50">
						{filtered.map((c) => (
							<ConversationRow
								key={c.id}
								conversation={c}
								isActive={c.id === activeId}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
