"use client";

import { ChevronRight, Shield, Store } from "lucide-react";
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
	mockUser,
	recentOrders,
	statusColors,
} from "@/data/account/account";

export function AccountDashboard() {
	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
				<div className="flex items-center gap-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
						<AvatarFallback className="text-2xl">
							{mockUser.firstName[0]}
							{mockUser.lastName[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							{mockUser.firstName} {mockUser.lastName}
						</h1>
						<p className="text-muted-foreground">{mockUser.email}</p>
						{mockUser.kycStatus === "approved" && (
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
						<Link href="/sell">
							<Store className="h-4 w-4 mr-2" />
							Start Selling
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Menu */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Account Menu</CardTitle>
							<CardDescription>
								Manage your account settings and preferences
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-border">
								{menuItems.map((item) => (
									<Link
										key={item.label}
										href={item.href}
										className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
									>
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
											<item.icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-foreground">{item.label}</p>
											<p className="text-sm text-muted-foreground">{item.description}</p>
										</div>
										{item.count && (
											<Badge variant="secondary" className="shrink-0">
												{item.count}
											</Badge>
										)}
										<ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
									</Link>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Orders */}
				<div>
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Recent Orders</CardTitle>
								<Link
									href="/account/orders"
									className="text-sm text-primary hover:underline"
								>
									View all
								</Link>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentOrders.map((order) => (
								<Link
									key={order.id}
									href={`/account/orders/${order.id}`}
									className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
								>
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-foreground">
											{order.id}
										</span>
										<Badge
											className={statusColors[order.status as keyof typeof statusColors]}
											variant="secondary"
										>
											{order.status}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground truncate">
										{order.product}
									</p>
									<div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
										<span>{order.date}</span>
										<span className="font-medium text-foreground">GH₵{order.total}</span>
									</div>
								</Link>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
