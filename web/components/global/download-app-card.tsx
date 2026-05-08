"use client"

import * as React from "react"
import Link from "next/link"
import { Download, Smartphone, XIcon } from "lucide-react"
import Logo from "@/components/global/logo"

export function DownloadAppCard() {
	const [isVisible, setIsVisible] = React.useState(true)

	if (!isVisible) {
		return null
	}

	return (
		<div className="fixed md:hidden bottom-4 right-4 z-50">
			<div className="w-70 rounded-lg bg-card p-3 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/95">
				<div className="cancel-btn absolute p-0.5 right-1 top-0 rounded-lg">
					<button
						type="button"
						onClick={() => setIsVisible(false)}
					>
						<XIcon />
					</button>
				</div>
				<div className="mb-2 mt-2 flex  flex-col-reverse  justify-between gap-2">
					<Logo width={96} height={28} className="w-24" />
					<span className="inline-flex mt-3 items-center gap-1 rounded-full  px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						<Smartphone className="h-3 w-3 text-vm-tangerine" />
						Mobile app
					</span>
				</div>

				<p className="text-sm font-semibold text-foreground">
					Shop faster on the go
				</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Get instant deal alerts, order updates, and campus delivery tracking.
				</p>

				<Link
					href="https://varsity-mart.vercel.app/download"
					className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-vm-tangerine px-3 py-2 text-sm font-semibold text-vm-tangerine-foreground transition-opacity hover:opacity-90"
				>
					<Download className="h-4 w-4" />
					Download app
				</Link>
			</div>
		</div>
	)
}
