"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Package, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useMyOrders, useMyFoodOrders } from "@/hooks/queries/use-orders"
import type { OrderStatus, FoodOrderStatus } from "@/lib/api/types"
import Image from "next/image"
import { cn } from "@/lib/utils"

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-GH", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

function formatGHS(n: number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 2,
	}).format(n)
}

function toNumber(value: number | string | undefined) {
	if (typeof value === "number") return value
	if (typeof value === "string") {
		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : 0
	}
	return 0
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------
type AnyStatus = OrderStatus | FoodOrderStatus

interface StatusStyle {
	bg: string
	text: string
	dot: string
	pulse: boolean
}

function getStatusStyle(status: AnyStatus): StatusStyle {
	switch (status) {
		case "pending":
			return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500", pulse: true }
		case "pending_payment":
			return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500", pulse: true }
		case "payment_confirmed":
		case "paid":
			return { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400", dot: "bg-teal-500", pulse: false }
		case "confirmed":
		case "processing":
			return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500", pulse: true }
		case "preparing":
			return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-500", pulse: true }
		case "ready":
		case "picked_up":
			return { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400", dot: "bg-sky-500", pulse: true }
		case "shipped":
		case "in_delivery":
			return { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400", dot: "bg-indigo-500", pulse: true }
		case "delivered":
			return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500", pulse: false }
		case "cancelled":
			return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-400", pulse: false }
		case "refunded":
			return { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", dot: "bg-rose-400", pulse: false }
		default:
			return { bg: "bg-muted", text: "text-foreground", dot: "bg-muted-foreground", pulse: false }
	}
}

function StatusBadge({ status }: { status: AnyStatus }) {
	const { bg, text, dot, pulse } = getStatusStyle(status)
	return (
		<span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize", bg, text)}>
			<span className="relative flex h-2 w-2">
				{pulse && (
					<span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dot)} />
				)}
				<span className={cn("relative inline-flex h-2 w-2 rounded-full", dot)} />
			</span>
			{status.replace(/_/g, " ")}
		</span>
	)
}

// ---------------------------------------------------------------------------
// Order progress stepper
// ---------------------------------------------------------------------------
const PRODUCT_STEPS: { label: string; statuses: OrderStatus[] }[] = [
	{ label: "Payment",    statuses: ["pending", "pending_payment"] },
	{ label: "Confirmed",  statuses: ["payment_confirmed", "paid"] },
	{ label: "Processing", statuses: ["confirmed", "processing"] },
	{ label: "Shipping",   statuses: ["shipped", "in_delivery"] },
	{ label: "Delivered",  statuses: ["delivered"] },
]

const FOOD_STEPS: { label: string; statuses: FoodOrderStatus[] }[] = [
	{ label: "Payment",   statuses: ["pending", "pending_payment"] },
	{ label: "Confirmed", statuses: ["confirmed"] },
	{ label: "Preparing", statuses: ["preparing"] },
	{ label: "Ready",     statuses: ["ready", "picked_up", "in_delivery"] },
	{ label: "Delivered", statuses: ["delivered"] },
]

function OrderProgress({ status, type }: { status: AnyStatus; type: "product" | "food" }) {
	if (status === "cancelled" || status === "refunded") return null

	const steps = type === "product"
		? PRODUCT_STEPS as { label: string; statuses: AnyStatus[] }[]
		: FOOD_STEPS as { label: string; statuses: AnyStatus[] }[]

	const currentIdx = steps.findIndex((s) => s.statuses.includes(status))

	return (
		<div className="mt-3  bg-background rounded-full p-3">
			<div className="flex items-start">
				{steps.map((step, i) => {
					const isDone    = i < currentIdx
					const isCurrent = i === currentIdx
					const isLast    = i === steps.length - 1
					return (
						<div key={step.label} className="flex flex-1 flex-col items-center">
							<div className="flex w-full items-center">
								<div className={cn("h-px flex-1 transition-colors", i === 0 ? "invisible" : isDone || isCurrent ? "bg-primary" : "bg-border")} />
								<div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
									{isCurrent && (
										<span className="absolute h-4 w-4 animate-ping rounded-full bg-primary opacity-30" />
									)}
									<span className={cn(
										"relative h-3 w-3 rounded-full border-2 transition-colors",
										isDone || isCurrent ? "border-primary bg-primary" : "border-border bg-background"
									)} />
								</div>
								<div className={cn("h-px flex-1 transition-colors", isLast ? "invisible" : isDone ? "bg-primary" : "bg-border")} />
							</div>
							{/* labels: hidden on mobile, visible on sm+ */}
							<span className={cn(
								"mt-1 hidden text-center text-[10px] leading-tight sm:block",
								isCurrent ? "font-semibold text-primary" :
								isDone    ? "text-foreground" :
								            "text-foreground/80"
							)}>
								{step.label}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------
function OrdersSkeleton() {
	return (
		<div className="space-y-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center gap-4 rounded-lg bg-card p-4">
					<Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>
					<Skeleton className="h-6 w-24 rounded-full" />
				</div>
			))}
		</div>
	)
}

// ---------------------------------------------------------------------------
// Restaurant logo / fallback
// ---------------------------------------------------------------------------
function RestaurantAvatar({ logo, name }: { logo?: string; name: string }) {
	if (logo) {
		return (
			<Image
				src={logo}
				alt={name}
				width={64}
				height={64}
				className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
			/>
		)
	}
	return (
		<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted sm:h-16 sm:w-16">
			<UtensilsCrossed className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function OrdersPage() {
	const router = useRouter()
	const { isLoading: authLoading, isAuthenticated } = useAuth()
	const [tab, setTab] = useState("products")

	const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
	const { data: foodOrdersData, isLoading: foodOrdersLoading } = useMyFoodOrders()

	const orders = ordersData?.data?.orders || []
	const foodOrders = foodOrdersData?.data?.orders || []

	if (authLoading) {
		return (
			<div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (!isAuthenticated) {
		router.push("/login?redirect=/account/orders")
		return null
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-6">
					<Link
						href="/account"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to account
					</Link>
				</div>

				<h1 className="mb-6 text-2xl font-bold">Your Orders</h1>

				<Tabs value={tab} onValueChange={setTab}>
					<TabsList className="mb-6 w-full px-6">
						<TabsTrigger value="products" className="flex-1">
							Product Orders
						</TabsTrigger>
						<TabsTrigger value="food" className="flex-1">
							Food Orders
						</TabsTrigger>
					</TabsList>

					{/* ── Product orders ── */}
					<TabsContent value="products">
						{ordersLoading ? (
							<OrdersSkeleton />
						) : orders.length === 0 ? (
							<div className="rounded-lg border bg-card p-8 text-center">
								<Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
								<h2 className="text-lg font-semibold">No orders yet</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									When you place an order, it will appear here
								</p>
								<Button asChild className="mt-4">
									<Link href="/products">Browse Products</Link>
								</Button>
							</div>
						) : (
							<div className="space-y-3">
								{orders.map((order) => {
									const orderNumber = order.order_number || order.orderNumber || order.id
									const orderName = order.product.title || orderNumber
									const createdAt = order.created_at || order.createdAt || new Date().toISOString()
									const itemCount = order.quantity ?? order.items?.length ?? 1
									const productImage = order.product.image || ""
									const total = toNumber(order.total)
									return (
										<Link
											key={order.id}
											href={`/orders/${order.order_number}`}
											className="block rounded-lg bg-card p-4 transition-colors hover:bg-muted/50"
										>
											<div className="flex items-start gap-3 sm:gap-4">
												{productImage ? (
													<Image
														src={productImage}
														width={64}
														height={64}
														alt={orderName}
														className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
													/>
												) : (
													<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted sm:h-16 sm:w-16">
														<Package className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
													</div>
												)}
												<div className="min-w-0 flex-1">
													<p className="truncate font-semibold">{orderName}</p>
													<p className="text-sm text-muted-foreground">
														#{orderNumber} · {formatDate(createdAt)}
													</p>
													<p className="mt-0.5 text-sm">
														{itemCount} item{itemCount !== 1 ? "s" : ""}{" "}
														<span className="font-semibold text-vm-tangerine">{formatGHS(total)}</span>
													</p>
												</div>
												<StatusBadge status={order.status} />
											</div>
											<OrderProgress status={order.status} type="product" />
										</Link>
									)
								})}
							</div>
						)}
					</TabsContent>

					{/* ── Food orders ── */}
					<TabsContent value="food">
						{foodOrdersLoading ? (
							<OrdersSkeleton />
						) : foodOrders.length === 0 ? (
							<div className="rounded-lg bg-card p-8 text-center">
								<Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
								<h2 className="text-lg font-semibold">No food orders yet</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									When you order from a restaurant, it will appear here
								</p>
								<Button asChild className="mt-4">
									<Link href="/restaurants">Browse Restaurants</Link>
								</Button>
							</div>
						) : (
							<div className="space-y-3">
								{foodOrders.map((order) => {
									const orderId = order.id || order.orderId
									const createdAt = order.createdAt || order.created_at || new Date().toISOString()
									const restaurantName = order.restaurantName || order.restaurant?.name || "Restaurant"
									const restaurantLogo = order.restaurantLogo || order.restaurant?.logo
									const orderNumber = order.orderNumber || order.order_number || order.orderId
									const total = toNumber(order.total)
									const itemCount = order.items?.length ?? 1
									return (
										<Link
											key={orderId}
											href={`/orders/food/${orderId}`}
											className="block rounded-lg bg-card p-4 transition-colors hover:bg-muted/50"
										>
											<div className="flex items-start gap-3 sm:gap-4">
												<RestaurantAvatar logo={restaurantLogo} name={restaurantName} />
												<div className="min-w-0 flex-1">
													<p className="truncate font-semibold">{restaurantName}</p>
													<p className="text-sm text-muted-foreground">
														#{orderNumber} · {formatDate(createdAt)}
													</p>
													<p className="mt-0.5 text-sm">
														{itemCount} item{itemCount !== 1 ? "s" : ""}{" "}
														<span className="font-semibold text-vm-tangerine">{formatGHS(total)}</span>
													</p>
												</div>
												<StatusBadge status={order.status} />
											</div>
											<OrderProgress status={order.status} type="food" />
										</Link>
									)
								})}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
