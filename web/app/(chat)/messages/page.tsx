"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessagesSquare } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

function AuthSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="space-y-1 px-4 py-4">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-8 w-full mt-3" />
			</div>
			<div className="divide-y divide-border/50">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex gap-3 px-4 py-3">
						<Skeleton className="h-11 w-11 rounded-full" />
						<div className="flex-1 space-y-2 pt-0.5">
							<Skeleton className="h-3.5 w-28" />
							<Skeleton className="h-3 w-40" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default function MessagesPage() {
	const router = useRouter()
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login?redirect=/messages")
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading || !isAuthenticated) {
		return <AuthSkeleton />
	}

	// Desktop: right panel empty state (sidebar shows the list).
	// Mobile: layout hides this panel and shows the sidebar instead.
	return (
		<div className="hidden md:flex h-full flex-col items-center justify-center gap-3 text-center select-none">
			<MessagesSquare className="h-12 w-12 text-muted-foreground/20" strokeWidth={1.5} />
			<div>
				<p className="font-semibold text-foreground/70">Pick a conversation</p>
				<p className="mt-0.5 text-xs text-muted-foreground">Your messages will appear here</p>
			</div>
		</div>
	)
}
