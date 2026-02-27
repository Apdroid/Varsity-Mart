"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Bell, CircleUser } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * AuthAwareMobileMenu - Shows account links in mobile menu only when authenticated
 */
export function AuthAwareMobileMenu({ onLinkClickAction }: { onLinkClickAction: () => void }) {
	const { isAuthenticated, isLoading } = useAuth();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	// Don't render during SSR or loading
	if (!hydrated || isLoading || !isAuthenticated) {
		return null;
	}

	return (
		<>
			<div>
				<h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Your Account</h3>
				<nav className="flex flex-col gap-1">
					<Link
						href="/wishlist"
						className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
						onClick={onLinkClickAction}
					>
						<Heart className="h-5 w-5 text-primary" />
						Wishlist
					</Link>
					<Link
						href="/notifications"
						className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
						onClick={onLinkClickAction}
					>
						<Bell className="h-5 w-5 text-primary" />
						Notifications
					</Link>
					<Link
						href="/account"
						className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
						onClick={onLinkClickAction}
					>
						<CircleUser className="h-5 w-5 text-primary" />
						My Account
					</Link>
				</nav>
			</div>
		</>
	);
}
