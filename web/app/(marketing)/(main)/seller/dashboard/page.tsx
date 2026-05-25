"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
	Eye,
	Heart,
	Loader2,
	Package,
	Pencil,
	ShoppingBag,
	Star,
	Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useMyStore } from "@/hooks/queries/use-stores"
import { useMyProducts, useDeleteProduct } from "@/hooks/queries/use-products"
import { useSellerOrders } from "@/hooks/queries/use-orders"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/api/types"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatGHS(n: number | string) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(typeof n === "string" ? parseFloat(n) : n)
}

const ORDER_STATUS_STYLES: Record<string, string> = {
	pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	pending_payment: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	payment_confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	paid: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	processing: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
	shipped: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
	in_delivery: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
	delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	cancelled: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
	refunded: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

function orderStatusLabel(status: string) {
	return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function productStatusStyle(status: string) {
	switch (status.toLowerCase()) {
		case "active":
			return "bg-[color-mix(in_oklch,var(--vm-tangerine),transparent_85%)] text-vm-tangerine"
		case "sold":
			return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
		default:
			return "bg-muted text-muted-foreground"
	}
}

// ── Product row ───────────────────────────────────────────────────────────────

function ProductRow({ product }: { product: Product }) {
	const [deleteOpen, setDeleteOpen] = useState(false)
	const { mutateAsync: deleteProduct, isPending: deleting } = useDeleteProduct()
	const thumbnail = product.images?.[0]?.optimized_url || product.images?.[0]?.url

	async function handleDelete() {
		try {
			await deleteProduct(product.id)
			toast.success("Product deleted.")
		} catch {
			toast.error("Failed to delete product.")
		} finally {
			setDeleteOpen(false)
		}
	}

	return (
		<>
			<div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-background">
				{/* Thumbnail */}
				<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
					{thumbnail ? (
						<Image src={thumbnail} alt={product.title} fill className="object-cover" />
					) : (
						<span className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
							{product.title[0].toUpperCase()}
						</span>
					)}
				</div>

				{/* Info */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="truncate text-sm font-medium leading-none">{product.title}</p>
						<span
							className={cn(
								"hidden shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:inline-block",
								productStatusStyle(product.status)
							)}
						>
							{product.status}
						</span>
					</div>
					<div className="mt-1 hidden items-center gap-2.5 text-xs text-muted-foreground sm:flex">
						<span className="flex items-center gap-0.5">
							<Eye className="h-3 w-3" />
							{product.views}
						</span>
						<span className="flex items-center gap-0.5">
							<Heart className="h-3 w-3" />
							{product.likes}
						</span>
					</div>
				</div>

				{/* Price */}
				<span className="shrink-0 text-sm font-semibold">{formatGHS(Number(product.price))}</span>

				{/* Actions — always visible on mobile, reveal on hover for desktop */}
				<div className="flex shrink-0 items-center gap-0.5 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
					<Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
						<Link href={`/seller/products/${product.id}/edit`}>
							<Pencil className="h-3.5 w-3.5" />
							<span className="sr-only">Edit {product.title}</span>
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
						onClick={() => setDeleteOpen(true)}
						disabled={deleting}
					>
						{deleting ? (
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						) : (
							<Trash2 className="h-3.5 w-3.5" />
						)}
						<span className="sr-only">Delete {product.title}</span>
					</Button>
				</div>
			</div>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this product?</AlertDialogTitle>
						<AlertDialogDescription>
							<strong className="font-medium text-foreground">{product.title}</strong> will be
							permanently removed from your store. This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleting}
							className="bg-destructive text-white hover:bg-destructive/90"
						>
							{deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

// ── Stat cell ─────────────────────────────────────────────────────────────────

function StatCell({
	label,
	value,
	sub,
	accent,
}: {
	label: string
	value: string | number
	sub?: string
	accent?: boolean
}) {
	return (
		<div
			className={cn(
				"flex flex-col justify-between rounded-2xl p-4",
				accent
					? "bg-[color-mix(in_oklch,var(--vm-tangerine),transparent_88%)]"
					: "bg-accent"
			)}
		>
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<div className="mt-3">
				<p className={cn("text-2xl font-bold tracking-tight", accent && "text-vm-tangerine")}>
					{value}
				</p>
				{sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
			</div>
		</div>
	)
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-24 rounded-2xl" />
				))}
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-2 rounded-2xl bg-accent p-5">
					<Skeleton className="h-4 w-32" />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-12 rounded-xl" />
					))}
				</div>
				<div className="space-y-2 rounded-2xl bg-accent p-5">
					<Skeleton className="h-4 w-32" />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-12 rounded-xl" />
					))}
				</div>
			</div>
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
	const router = useRouter()
	const { user, isLoading: authLoading, isAuthenticated } = useAuth()
	const { data: storeData, isLoading: storeLoading } = useMyStore()
	const { data: productsData, isLoading: productsLoading } = useMyProducts()
	const { data: ordersData, isLoading: ordersLoading } = useSellerOrders({ limit: 10 })

	const store = storeData
	const products = productsData?.products || []
	const orders = ordersData?.results || []
	const isLoading = storeLoading || productsLoading || ordersLoading

	if (authLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (!isAuthenticated) {
		router.push("/login?redirect=/seller/dashboard")
		return null
	}

	if (!user?.hasStore && !storeLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-md rounded-2xl bg-accent p-10 text-center">
					<ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
					<h1 className="text-xl font-bold">Start Selling on VarsityMart</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Create your store and start reaching students on campus.
					</p>
					<Button
						asChild
						className="mt-6 w-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
					>
						<Link href="/seller/create-store">Create Your Store</Link>
					</Button>
				</div>
			</div>
		)
	}

	const totalRevenue = orders
		.filter((o) => o.status === "delivered")
		.reduce((sum, o) => sum + parseFloat(String(o.total)), 0)

	const pendingOrders = orders.filter((o) =>
		["pending_payment", "payment_confirmed", "processing", "shipped"].includes(o.status)
	).length

	const activeProducts = products.filter((p) => p.status.toLowerCase() === "active").length

	const topProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 5)

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<p className="text-sm text-muted-foreground">{store?.storeName || "Your Store"}</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm" asChild>
						<Link href="/seller/dashboard/payouts">Payouts</Link>
					</Button>
					<Button variant="outline" size="sm" asChild>
						<Link href="/seller/store">My Store</Link>
					</Button>
					<Button
						size="sm"
						className="bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
						asChild
					>
						<Link href="/seller/products/add">Add Product</Link>
					</Button>
				</div>
			</div>

			{isLoading ? (
				<DashboardSkeleton />
			) : (
				<div className="space-y-6">
					{/* Stats */}
					<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
						<StatCell
							label="Total Revenue"
							value={formatGHS(totalRevenue)}
							sub="from delivered orders"
							accent
						/>
						<StatCell
							label="Pending Orders"
							value={pendingOrders}
							sub="awaiting action"
						/>
						<StatCell
							label="Active Products"
							value={activeProducts}
							sub={`${products.length} total`}
						/>
						<StatCell
							label="Store Rating"
							value={store ? Number.parseFloat(store.rating).toFixed(1) : "—"}
							sub={`${store?.totalReviews || 0} reviews`}
						/>
					</div>

					{/* Content */}
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Recent Orders */}
						<div className="rounded-2xl bg-accent p-5">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<h2 className="font-semibold">Recent Orders</h2>
									<p className="text-xs text-muted-foreground">Latest customer activity</p>
								</div>
								<Button variant="ghost" size="sm" className="text-xs" asChild>
									<Link href="/seller/orders">View all</Link>
								</Button>
							</div>

							{orders.length === 0 ? (
								<div className="py-10 text-center">
									<Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
									<p className="text-sm text-muted-foreground">
										No orders yet. When customers buy, they&apos;ll show up here.
									</p>
								</div>
							) : (
								<div className="space-y-0.5">
									{orders.slice(0, 5).map((order) => (
										<Link
											key={order.id}
											href={`/seller/orders/${order.id}`}
											className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-background"
										>
											<div className="min-w-0">
												<p className="text-sm font-medium">
													#{order.order_number || order.orderNumber}
												</p>
												<p className="mt-0.5 text-xs text-muted-foreground">
													{formatGHS(order.total)}
												</p>
											</div>
											<span
												className={cn(
													"ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
													ORDER_STATUS_STYLES[order.status] ||
													"bg-muted text-muted-foreground"
												)}
											>
												{orderStatusLabel(order.status)}
											</span>
										</Link>
									))}
								</div>
							)}
						</div>

						{/* Products */}
						<div className="rounded-2xl bg-accent p-5">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<h2 className="font-semibold">My Products</h2>
									<p className="text-xs text-muted-foreground">Top by views</p>
								</div>
								<Button variant="ghost" size="sm" className="text-xs" asChild>
									<Link href="/seller/store">View all</Link>
								</Button>
							</div>

							{products.length === 0 ? (
								<div className="py-10 text-center">
									<ShoppingBag className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
									<p className="text-sm text-muted-foreground">No products yet.</p>
									<Button
										asChild
										size="sm"
										className="mt-3 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
									>
										<Link href="/seller/products/add">Add your first product</Link>
									</Button>
								</div>
							) : (
								<div className="space-y-0.5">
									{topProducts.map((product) => (
										<ProductRow key={product.id} product={product} />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Subscription warning */}
					{store && store.subscriptionStatus !== "active" && (
						<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[color-mix(in_oklch,var(--vm-tangerine),transparent_88%)] px-5 py-4">
							<div>
								<p className="font-semibold text-vm-tangerine">Subscription Expired</p>
								<p className="text-sm text-muted-foreground">
									Renew to keep your store visible to customers.
								</p>
							</div>
							<Button
								size="sm"
								className="bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
							>
								Renew Subscription
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
