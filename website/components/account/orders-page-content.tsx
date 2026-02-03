"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Package, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusColors } from "@/data/account/orders";
import { useMyOrders } from "@/hooks/use-orders";

export function OrdersPageContent() {
	const [activeTab, setActiveTab] = useState("all");
	const [search, setSearch] = useState("");
	
	const { data: ordersResponse, isLoading } = useMyOrders({
		status: activeTab === "all" ? undefined : activeTab,
		search: search || undefined,
	});

	const orders = Array.isArray(ordersResponse?.data) ? ordersResponse.data : [];

	return (
		<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<Link href="/account" className="hover:text-foreground">
					Account
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-foreground">Orders</span>
			</nav>

			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<h1 className="text-2xl font-bold text-foreground">My Orders</h1>
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input 
						type="search" 
						placeholder="Search orders..." 
						className="pl-10" 
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-6">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="processing">Processing</TabsTrigger>
					<TabsTrigger value="shipped">Shipped</TabsTrigger>
					<TabsTrigger value="delivered">Delivered</TabsTrigger>
					<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-16">
							<Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
							<p className="text-muted-foreground">Loading orders...</p>
						</div>
					) : orders.length > 0 ? (
						orders.map((order) => (
							<div
								key={order.id}
								className="border border-border rounded-xl overflow-hidden bg-card"
							>
								{/* Order Header */}
								<div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 border-b border-border">
									<div className="flex flex-wrap items-center gap-4">
										<div>
											<p className="text-sm text-muted-foreground">Order Number</p>
											<p className="font-medium text-foreground">{order.orderNumber}</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Date</p>
											<p className="font-medium text-foreground">
												{new Date(order.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Total</p>
											<p className="font-medium text-foreground">
												GH₵{order.total.toLocaleString()}
											</p>
										</div>
									</div>
									<Badge
										className={statusColors[order.status as keyof typeof statusColors]}
										variant="secondary"
									>
										{order.status}
									</Badge>
								</div>

								{/* Order Items */}
								<div className="p-4">
									{order.items.map((item, index) => (
										<div key={index} className="flex items-center gap-4">
											<div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
												<Image
													src={item.product?.images?.[0] || "/placeholder.svg"}
													alt={item.product?.title || "Product"}
													width={64}
													height={64}
													className="object-cover w-full h-full"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-foreground truncate">
													{item.product?.title}
												</p>
												<p className="text-sm text-muted-foreground">
													Qty: {item.quantity} × GH₵{item.price.toLocaleString()}
												</p>
											</div>
											<Button
												variant="outline"
												size="sm"
												asChild
												className="bg-transparent shrink-0"
											>
												<Link href={`/account/orders/${order.id}`}>View Details</Link>
											</Button>
										</div>
									))}
								</div>
							</div>
						))
					) : (
						<div className="text-center py-16">
							<Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="font-semibold text-lg text-foreground mb-2">
								No orders found
							</h3>
							<p className="text-muted-foreground mb-4">
								You don&apos;t have any orders in this category yet.
							</p>
							<Button asChild className="bg-primary hover:bg-primary/90">
								<Link href="/products">Start Shopping</Link>
							</Button>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
