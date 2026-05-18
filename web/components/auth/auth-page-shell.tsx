"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Logo from "../global/logo"
import Link from "next/link"

type AuthPageShellProps = {
	children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
	const router = useRouter()

	return (
		<div className="flex my-20 flex-col items-center justify-center bg-cover">
			<div className="w-full max-w-sm md:max-w-xl mx-auto my-5">
				{/* Back button */}
				<button
					type="button"
					onClick={() => router.back()}
					className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</button>


				<Link href="/">
					<Logo variant="auth" className="my-10 mx-auto" />
				</Link>
				{children}
			</div>
		</div>
	)
}
