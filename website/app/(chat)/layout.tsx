"use client"

import Link from "next/link"
import Logo from "@/components/global/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/providers/auth-provider"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
	const { user } = useAuth()
	const initials = user
		? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
		: "?"

	return (
		<div className="flex h-dvh flex-col overflow-hidden">
			<header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
				<Link href="/">
					<Logo variant="header" className="w-28" />
				</Link>
				{user && (
					<Avatar className="h-7 w-7">
						<AvatarImage
							src={user.avatar || user.avatarUrl || user.profilePic}
							alt={user.firstName}
						/>
						<AvatarFallback className="text-[10px] font-semibold">{initials}</AvatarFallback>
					</Avatar>
				)}
			</header>
			<div className="min-h-0 flex-1 overflow-hidden">
				{children}
			</div>
		</div>
	)
}
