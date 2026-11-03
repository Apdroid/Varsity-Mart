"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import { createContext, useCallback, useContext, useState } from "react"

interface AuthGateContextValue {
	requireAuth: (fn: () => void) => void
}

const AuthGateContext = createContext<AuthGateContextValue | null>(null)

export function useAuthGate() {
	const ctx = useContext(AuthGateContext)
	if (!ctx) throw new Error("useAuthGate must be used within AuthGateProvider")
	return ctx
}

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [open, setOpen] = useState(false)

	const requireAuth = useCallback(
		(fn: () => void) => {
			if (isAuthenticated) {
				fn()
			} else {
				setOpen(true)
			}
		},
		[isAuthenticated]
	)

	return (
		<AuthGateContext.Provider value={{ requireAuth }}>
			{children}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Sign in to continue</DialogTitle>
						<DialogDescription>
							You need an account to do that. Sign in or create a free account to keep shopping.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-2 pt-2">
						<Button
							asChild
							className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
							onClick={() => setOpen(false)}
						>
							<Link href="/login">Sign In</Link>
						</Button>
						<Button asChild variant="outline" onClick={() => setOpen(false)}>
							<Link href="/register">Create Account</Link>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AuthGateContext.Provider>
	)
}
