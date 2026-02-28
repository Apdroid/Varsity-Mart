"use client";

import { Suspense } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/queries/useAuth";

function CallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { refetchUser } = useAuth();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			// Check if there's an error from the OAuth provider
			const errorParam = searchParams.get("error");
			if (errorParam) {
				setError(errorParam === "access_denied"
					? "You cancelled the sign-in process."
					: "Authentication failed. Please try again."
				);
				return;
			}

			// The backend should have set the auth cookies already
			// We just need to refetch the user data
			try {
				await refetchUser();

				// Check if user needs to complete profile
				// The backend should indicate this in the response or we can check user data
				const needsProfileCompletion = searchParams.get("complete_profile");

				if (needsProfileCompletion === "true") {
					router.push("/auth/complete-profile");
				} else {
					// Redirect to home or the originally requested page
					const redirectTo = searchParams.get("redirect") || "/";
					router.push(redirectTo);
				}
			} catch (err) {
				console.error("OAuth callback error:", err);
				setError("Failed to complete sign-in. Please try again.");
			}
		};

		handleCallback();
	}, [searchParams, refetchUser, router]);

	if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-6">
				<div className="text-center max-w-md">
					<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
						<svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<h1 className="text-xl font-semibold mb-2">Sign-in Failed</h1>
					<p className="text-muted-foreground mb-6">{error}</p>
					<div className="flex gap-3 justify-center">
						<Link
							href="/auth/login"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							Try Again
						</Link>
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
						>
							Go Home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6">
			<div className="text-center">
				<div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground mx-auto mb-6">
					<ShoppingBag className="h-8 w-8" />
				</div>
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<h1 className="text-xl font-semibold mb-2">Completing Sign-in</h1>
				<p className="text-muted-foreground">Please wait while we set up your account...</p>
			</div>
		</div>
	);
}

export default function OAuthCallbackPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex flex-col items-center justify-center p-6">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		}>
			<CallbackContent />
		</Suspense>
	);
}
