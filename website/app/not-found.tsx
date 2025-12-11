import { Home, Search, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";

export default function NotFound() {
	return (
		<MainLayout>
			<div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
				<div className="mx-auto max-w-2xl text-center">
					{/* 404 Illustration */}
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
							<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
								<ShoppingBag className="h-16 w-16 text-primary" />
							</div>
						</div>
					</div>

					{/* Error Code */}
					<div className="mb-6">
						<h1 className="mb-2 text-8xl font-black text-foreground">404</h1>
						<div className="mx-auto h-1 w-24 rounded-full bg-primary" />
					</div>
					
					<h2 className="mb-4 text-3xl font-bold text-foreground">
						Page Not Found
					</h2>
					<p className="mb-8 text-lg text-muted-foreground">
						Oops! The page you&apos;re looking for doesn&apos;t exist. It might
						have been moved, deleted, or the URL might be incorrect.
					</p>

					{/* Action Buttons */}
					<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button asChild size="lg" className="bg-primary hover:bg-primary/90">
							<Link href="/">
								<Home className="mr-2 h-5 w-5" />
								Go Home
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/products">
								<Search className="mr-2 h-5 w-5" />
								Browse Products
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="lg"
							onClick={() => window.history.back()}
						>
							<ArrowLeft className="mr-2 h-5 w-5" />
							Go Back
						</Button>
					</div>

					{/* Quick Links Card */}
					<Card className="border-border bg-card">
						<CardContent className="pt-6">
							<p className="mb-4 text-sm font-semibold text-foreground">
								Popular Pages
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<Link
									href="/products"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Products
								</Link>
								<Link
									href="/restaurants"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Restaurants
								</Link>
								<Link
									href="/stores"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Stores
								</Link>
								<Link
									href="/deals"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Deals
								</Link>
								<Link
									href="/categories"
									className="rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
								>
									Categories
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</MainLayout>
	);
}

