"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
	className?: string;
}

export function AuthLayout({ children, title, description, className }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-muted/30">
			{/* Header */}
			<header className="p-4 sm:p-6">
				<Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
						<ShoppingBag className="h-4 w-4" />
					</div>
					<span className="font-bold text-lg">VarsityMart</span>
				</Link>
			</header>

			{/* Main content */}
			<main className="flex-1 flex items-center justify-center p-4 sm:p-6">
				<div className={cn("w-full max-w-md", className)}>
					{/* Title Section */}
					<div className="text-center mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h1>
						<p className="text-muted-foreground text-sm sm:text-base">{description}</p>
					</div>

					{/* Form Card */}
					<div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
						{children}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="p-4 sm:p-6 text-center">
				<p className="text-xs text-muted-foreground">
					© {new Date().getFullYear()} VarsityMart. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
