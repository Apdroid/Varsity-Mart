"use client"

import Link from "next/link"
import Logo from "@/components/global/logo"
import { ThemeToggle } from "@/components/global/theme-toggle"

export function AuthHeader() {
	return (
		<div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-4">
			<Link href="/" className="shrink-0">
				<Logo variant="header" />
			</Link>
			<ThemeToggle />
		</div>
	)
}
