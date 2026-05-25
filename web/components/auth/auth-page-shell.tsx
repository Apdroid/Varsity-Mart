"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { AuthHeader } from "./auth-header"

type AuthPageShellProps = {
	children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
	const router = useRouter()

	return (
		<div className="h-screen flex flex-col">
			{/* Header */}
			<AuthHeader />

			{/* Main Content with Side Image */}
			<div className="flex flex-1 overflow-hidden">
				{/* Image Section - Hidden on Mobile */}
				<div className="hidden lg:flex lg:w-1/2 bg-muted">
					<Image
						src="/user.webp"
						alt="Varsity Mart"
						width={1080}
						height={1440}
						className="w-full h-full object-cover"
						priority
					/>
				</div>

				{/* Auth Card Section */}
				<div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 overflow-y-scroll">
					<div className="w-full max-w-xl min-h-screen mx-auto my-10">
						{/* Back button */}
						<button
							type="button"
							onClick={() => router.back()}
							className="mb-6 sm:mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							Back
						</button>

						{children}
					</div>
				</div>
			</div>
		</div>
	)
}
