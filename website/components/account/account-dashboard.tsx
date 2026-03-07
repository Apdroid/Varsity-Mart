"use client";
import { useEffect, useState } from "react";
import { ChevronRight, Shield, Store, Loader2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	menuItems,
	statusColors,
} from "@/data/account/account";
import { useAuth } from "@/hooks/queries/useAuth";
import { useMyOrders } from "@/hooks/queries/useOrders";
export function AccountDashboard() {
	const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const { data: ordersResponse, isLoading: isLoadingOrders } = useMyOrders({ limit: 3 });
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	useEffect(() => {
		console.log("📊 Account Dashboard - Mounted:", mounted);
		console.log("📊 Account Dashboard - User:", user);
		console.log("📊 Account Dashboard - isAuthenticated:", isAuthenticated);
		console.log("📊 Account Dashboard - isAuthLoading:", isAuthLoading);
	}, [user, isAuthenticated, isAuthLoading, mounted]);
	const recentOrders = ordersResponse?.data || [];
	if (!mounted || isAuthLoading) {
		return (
<div className="flex h-96 items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
					<p className="text-muted-foreground">Loading your account...</p>
				</div>
			</div>
		);
	}
	if (!user) {
		return (
<div className="flex h-96 items-center justify-center">
				<div className="text-center">
					<p className="text-foreground font-semibold mb-2">Unable to load account</p>
					<p className="text-muted-foreground mb-4">Please try refreshing the page</p>
					<Button onClick={() => window.location.reload()}>Refresh Page</Button>
				</div>
			</div>
		);
	}
	const userInitial = user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U";
	return (
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
				<div className="flex items-center gap-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={user.avatar || undefined} alt={user.firstName || "User"} />
						<AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
							{userInitial}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-2xl font-bold text-foreground">{user.firstName || "User"}</h1>
						<p className="text-muted-foreground">{user.email || ""}</p>
						{user.kycStatus === "approved" && (
							<Badge className="mt-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
								<Shield className="h-3 w-3 mr-1" />
								Verified Student
							</Badge>
						)}
					</div>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" asChild className="bg-transparent">
						<Link href="/account/profile">Edit Profile</Link>
					</Button>
					<Button asChild className="bg-primary hover:bg-primary/90">
						<Link href="/sell"><Store className="h-4 w-4 mr-2" />Start Selling</Link>
					</Button>
				</div>
			</div>
			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Account Menu</CardTitle>
							<CardDescription>Manage your account settings and preferences</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-border">
								{menuItems.map((item) => (
<Link key={item.label} href={item.href} className="flex items-center gap-4 p-4 hover:bg-muted transition-colors">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
											<item.icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-foreground">{item.label}</p>
											<p className="text-sm text-muted-foreground">{item.description}</p>
										</div>
										<ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
									</Link>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Recent Orders</CardTitle>
								<Link href="/account/orders" className="text-sm text-primary hover:underline">View all</Link>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{isLoadingOrders ? (
<div className="flex justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
								</div>
							) : recentOrders.length > 0 ? (
recentOrders.map((order) => (
<Link key={order.id} href={`/account/orders/${order.id}`} className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-foreground">#{order.orderNumber}</span>
											<Badge className={statusColors[order.status as keyof typeof statusColors]} variant="secondary">{order.status}</Badge>
										</div>
										<p className="text-sm text-muted-foreground truncate">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
										<div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
											<span>{new Date((order as any).createdAt ?? (order as any).date).toLocaleDateString()}</span>
											<span className="font-medium text-foreground">GH₵{order.total.toFixed(2)}</span>
										</div>
									</Link>
								))
							) : (
<p className="text-center text-muted-foreground py-8">No orders yet</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
