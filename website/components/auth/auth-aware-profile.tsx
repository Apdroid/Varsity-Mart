"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import ProfileDropdown from "@/components/auth/user-dropdown";
import { LoginButton } from "@/components/auth/auth-button";

/**
 * AuthAwareProfile - Uses activity pattern to observe auth state changes
 * This component automatically re-renders when auth state changes from React Query
 */
export function AuthAwareProfile() {
	const { user, isAuthenticated, isLoading } = useAuth();
	const [hydrated, setHydrated] = useState(false);

	// Client-side hydration check
	useEffect(() => {
		setHydrated(true);
		console.log("🎯 AuthAwareProfile - Hydrated");
	}, []);

	// Log auth state changes for debugging
	useEffect(() => {
		if (hydrated) {
			console.log("🎯 AuthAwareProfile - Auth State Changed:", {
				isAuthenticated,
				hasUser: !!user,
				isLoading,
				userName: user?.fullName,
			});
		}
	}, [isAuthenticated, user, isLoading, hydrated]);

	// Don't render anything during SSR
	if (!hydrated) {
		return (
			<div className="h-9 w-9 rounded-full bg-accent/20" />
		);
	}

	// Show loading skeleton
	if (isLoading) {
		return (
			<div className="h-9 w-9 rounded-full bg-accent animate-pulse" />
		);
	}

	// Show profile if authenticated and user exists
	if (isAuthenticated && user) {
		const userInitial = user.fullName?.charAt(0)?.toUpperCase() ||
		                    user.email?.charAt(0)?.toUpperCase() ||
		                    "U";

		return (
			<ProfileDropdown
				align="end"
				trigger={
					<button
						className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
						type="button"
						aria-label="User profile menu"
					>
						<Avatar className="size-9 cursor-pointer">
							<AvatarImage
								src={user.avatar || undefined}
								alt={user.fullName || "User"}
							/>
							<AvatarFallback className="bg-primary/10 text-primary font-semibold">
								{userInitial}
							</AvatarFallback>
						</Avatar>
					</button>
				}
			/>
		);
	}

	// Show login button by default
	return <LoginButton />;
}
