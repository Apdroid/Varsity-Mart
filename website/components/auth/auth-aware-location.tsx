"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/queries/useAuth";
import { LocationSelector } from "@/components/layout/location-selector";
import { UniversityDisplay } from "@/components/layout/university-display";

/**
 * AuthAwareLocation - Shows location selector or university based on auth state
 * Uses activity pattern to observe auth state changes
 */
export function AuthAwareLocation() {
	const { isAuthenticated, isLoading } = useAuth();
	const [hydrated, setHydrated] = useState(false);

	// Client-side hydration check
	useEffect(() => {
		setHydrated(true);
	}, []);

	// Log state changes
	useEffect(() => {
		if (hydrated) {
			console.log("📍 AuthAwareLocation - State:", { isAuthenticated, isLoading });
		}
	}, [isAuthenticated, isLoading, hydrated]);

	// Don't render during SSR or loading
	if (!hydrated || isLoading) {
		return null;
	}

	// Show location selector if authenticated, university display otherwise
	return isAuthenticated ? <LocationSelector /> : <UniversityDisplay />;
}
