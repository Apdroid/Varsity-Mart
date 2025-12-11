"use client";

import { AlertCircle, Home, RefreshCw, Bug } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log error to error reporting service
		console.error("Application error:", error);
	}, [error]);

	return (
		<MainLayout>
			<div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
				<div className="mx-auto max-w-2xl text-center">
					{/* Error Illustration */}
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-3xl" />
							<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/20">
								<AlertCircle className="h-16 w-16 text-destructive" />
							</div>
						</div>
					</div>

					{/* Error Message */}
					<h1 className="mb-4 text-4xl font-bold text-foreground">
						Something went wrong!
					</h1>
					<p className="mb-6 text-lg text-muted-foreground">
						We encountered an unexpected error. Don&apos;t worry, our team has
						been notified and is working on a fix.
					</p>

					{/* Error Details Card */}
					{error.message && (
						<Card className="mb-8 border-destructive/20 bg-destructive/5">
							<CardContent className="pt-6">
								<div className="flex items-start gap-3">
									<Bug className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
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
							Try Again
						</Button>
						<Button asChild variant="outline" size="lg">
							<a href="/">
								<Home className="mr-2 h-5 w-5" />
								Go Home
							</a>
						</Button>
					</div>

					{/* Help Card */}
					<Card className="border-border bg-card">
						<CardContent className="pt-6">
							<p className="mb-2 text-sm font-semibold text-foreground">
								Need Help?
							</p>
							<p className="mb-4 text-sm text-muted-foreground">
								If this problem persists, we&apos;re here to help.
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<a
									href="/contact"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Contact Support
								</a>
								<a
									href="/help"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Help Center
								</a>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</MainLayout>
	);
}

