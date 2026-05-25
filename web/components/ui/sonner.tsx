"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<Sonner
			theme={(theme as ToasterProps["theme"]) || "light"}
			className="toaster group"
			position="bottom-right"
			richColors
			icons={{
				success: (
					<CheckCircleIcon className="size-5 text-green-500" />
				),
				info: (
					<InfoIcon className="size-5 text-blue-500" />
				),
				warning: (
					<WarningIcon className="size-5 text-yellow-500" />
				),
				error: (
					<XCircleIcon className="size-5 text-red-500" />
				),
				loading: (
					<SpinnerIcon className="size-5 animate-spin text-blue-500" />
				),
			}}
			style={
				{
					"--normal-bg": "hsl(var(--popover))",
					"--normal-text": "hsl(var(--popover-foreground))",
					"--normal-border": "hsl(var(--border))",
					"--border-radius": "var(--radius)",
					"--success-bg": "hsl(142.1 70.6% 45.3% / 0.1)",
					"--success-text": "hsl(142.1 76.2% 36.3%)",
					"--error-bg": "hsl(0 84.2% 60.2% / 0.1)",
					"--error-text": "hsl(0 84.2% 60.2%)",
					"--warning-bg": "hsl(38.6 92.1% 50.4% / 0.1)",
					"--warning-text": "hsl(38.6 92.1% 50.4%)",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: "group toast gap-2 rounded-lg px-4 py-3 shadow-lg border border-border",
					actionButton: "rounded px-2 py-1 text-xs font-medium hover:bg-muted",
					closeButton: "text-muted-foreground hover:text-foreground",
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
