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
	const { isAuthenticated, isLoading, needsProfileCompletion, needsVerification } = useAuth()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (isLoading) return

		// Redirect authenticated users away from auth-only pages.
		// Exception: a freshly-registered user is authenticated but still needs
		// email verification, so they must be allowed to stay on /verify-email.
		if (isAuthenticated) {
			const onAuthPage = AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
			const isVerifyPage = pathname === "/verify-email" || pathname.startsWith("/verify-email/")
			if (onAuthPage && !(isVerifyPage && needsVerification)) {
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
