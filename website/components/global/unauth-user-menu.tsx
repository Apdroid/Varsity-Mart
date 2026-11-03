"use client"

import { UserCircleIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UnauthUserMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-10 items-center justify-center gap-1.5 px-2 inline-flex hover:bg-muted rounded-full transition"
					aria-label="Account menu"
				>
					<UserCircleIcon className="h-7 w-7" weight="regular" />
					<span className="hidden text-sm font-medium sm:inline">Sign in</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-72 p-0">
				{/* Welcome section */}
				<div className="px-4 py-6 text-center">
					<h2 className="text-lg font-bold mb-2">Welcome to Varsity Mart</h2>
					<p className="text-sm text-muted-foreground mb-4">
						Sign in to buy, sell, and connect with your campus community
					</p>
					<div className="flex flex-col gap-2">
						<Button
							asChild
							className="w-full rounded-full h-10 bg-vm-tangerine hover:bg-vm-tangerine/90"
						>
							<Link href="/login">Sign In</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="w-full rounded-full h-10"
						>
							<Link href="/register">Create Account</Link>
						</Button>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
