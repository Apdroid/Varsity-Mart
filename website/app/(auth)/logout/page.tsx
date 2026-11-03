"use client"

import Logo from "@/components/global/logo"
import { useAuth } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LogoutPage() {
	const { logout } = useAuth()
	const router = useRouter()

	useEffect(() => {
		logout()
		const timer = setTimeout(() => router.replace("/"), 1000)
		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background">
			<Logo variant="auth" className="w-40" />
			<div className="flex flex-col items-center gap-3 text-center">
				<Loader2 className="h-8 w-8 animate-spin text-vm-tangerine" />
				<p className="text-sm text-muted-foreground">Signing you out…</p>
			</div>
		</div>
	)
}
