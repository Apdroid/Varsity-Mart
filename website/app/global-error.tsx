"use client";

import { AlertTriangle, Home, RefreshCw, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log error to error reporting service
		console.error("Global application error:", error);
	}, [error]);

	const clearCacheAndReload = () => {
		if (typeof window !== "undefined" && "caches" in window) {
			caches.keys().then((names) => {
				names.forEach((name) => {
					caches.delete(name);
				});
			});
		}
		window.location.reload();
	};

	return (
		<html>
			<body className="bg-background text-foreground">
				<div className="flex min-h-screen items-center justify-center px-4 py-16">
					<div className="mx-auto max-w-2xl text-center">
						{/* Error Illustration */}
						<div className="mb-8 flex justify-center">
							<div className="relative">
								<div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-3xl" />
								<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/20">
									<AlertTriangle className="h-16 w-16 text-destructive" />
								</div>
							</div>
						</div>

						{/* Error Message */}
						<h1 className="mb-4 text-4xl font-bold text-foreground">
							Critical Error
						</h1>
						<p className="mb-6 text-lg text-muted-foreground">
							A critical error occurred that prevented the application from
							loading. Please try refreshing the page or clearing your cache.
						</p>

						{/* Error Details Card */}
						{error.message && (
							<Card className="mb-8 border-destructive/20 bg-destructive/5">
								<CardContent className="pt-6">
									<div className="text-left">
										<p className="mb-1 text-sm font-semibold text-foreground">
											Error Details
										</p>
										<p className="text-sm text-muted-foreground">
											{error.message}
										</p>
										{error.digest && (
											<p className="mt-2 text-xs text-muted-foreground">
												Error ID: {error.digest}
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Action Buttons */}
						<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button
								onClick={reset}
								size="lg"
								className="bg-primary hover:bg-primary/90"
							>
								<RefreshCw className="mr-2 h-5 w-5" />
								Reload Page
							</Button>
							<Button
								onClick={clearCacheAndReload}
								variant="outline"
								size="lg"
							>
								<Trash2 className="mr-2 h-5 w-5" />
								Clear Cache & Reload
							</Button>
							<Button
								onClick={() => (window.location.href = "/")}
								variant="ghost"
								size="lg"
							>
								<Home className="mr-2 h-5 w-5" />
								Go Home
							</Button>
						</div>

						{/* Help Card */}
						<Card className="border-border bg-card">
							<CardContent className="pt-6">
								<p className="mb-2 text-sm font-semibold text-foreground">
									Still having issues?
								</p>
								<p className="mb-4 text-sm text-muted-foreground">
									Try these troubleshooting steps:
								</p>
								<ul className="mb-4 space-y-2 text-left text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="mt-1 text-primary">•</span>
										<span>Clear your browser cache and cookies</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-primary">•</span>
										<span>Disable browser extensions temporarily</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-primary">•</span>
										<span>Try using a different browser</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 text-primary">•</span>
										<span>Contact support if the problem persists</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</body>
		</html>
	);
}

