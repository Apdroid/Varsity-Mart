"use client"

import { type ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

const AUTH_ONLY_PATHS = [
	"/login",
	"/register",
	"/forgot",
	"/reset",
	"/verify-email",
]

const PROFILE_BYPASS_PATHS = [
	"/login",
	"/register",
	"/forgot",
	"/reset",
	"/verify-email",
	"/complete-profile",
]

export function ProfileGate({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading, needsProfileCompletion } = useAuth()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (isLoading) return

		// Redirect authenticated users away from auth-only pages
		if (isAuthenticated) {
			const onAuthPage = AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
			if (onAuthPage) {
				router.replace("/")
				return
			}
		}

		// Redirect incomplete profiles to the completion page
		if (!isAuthenticated || !needsProfileCompletion) return
		const bypassed = PROFILE_BYPASS_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
		if (bypassed) return
		router.replace("/complete-profile")
	}, [isLoading, isAuthenticated, needsProfileCompletion, pathname, router])

	return <>{children}</>
}
