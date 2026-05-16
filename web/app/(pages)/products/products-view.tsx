"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProductCard } from "@/components/main/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useProducts } from "@/hooks/queries/use-products"
import { useProductCategories } from "@/hooks/queries/use-categories"
import type { Product as ApiProduct, ProductCondition } from "@/lib/api/types"
import { Search, SlidersHorizontal } from "lucide-react"

function mapApiProductToCard(product: ApiProduct) {
	return {
		id: product.id,
		title: product.title,
		description: product.description,
		price: String(product.price),
		originalPrice: product.originalPrice ? String(product.originalPrice) : undefined,
		images: product.images,
		category: {
			id: product.category.id,
			name: product.category.name,
			icon: product.category.icon,
			count: product.category.count ?? 0,
		},
		condition:
			product.condition === "like_new"
				? "Like New"
				: product.condition === "new"
					? "New"
					: product.condition.charAt(0).toUpperCase() + product.condition.slice(1),
		location: product.location,
		seller: {
			id: product.seller.id,
			name: product.seller.name,
			email: product.seller.email ?? "",
			avatar: product.seller.avatarUrl,
			rating: String(product.seller.rating),
		},
		badges: product.badges,
		status: product.status,
		views: product.views,
		likes: product.likes,
		isNightShop: product.isNightShop,
		createdAt: product.createdAt,
	}
}

function ProductsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{Array.from({ length: 20 }).map((_, i) => (
				<div key={i}>
					<Skeleton className="aspect-square w-full rounded-lg" />
					<Skeleton className="mt-2 h-4 w-3/4" />
					<Skeleton className="mt-1 h-4 w-1/2" />
				</div>
			))}
		</div>
	)
}

function ProductsPageContent() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")

	const category = searchParams.get("category") || undefined
	const condition = searchParams.get("condition") as ProductCondition | undefined
	const sortBy = searchParams.get("sortBy") as "newest" | "popular" | "price_low" | "price_high" | undefined
	const page = Number(searchParams.get("page")) || 1

	const { data, isLoading } = useProducts({
		category,
		condition,
		sortBy,
		search: searchParams.get("search") || undefined,
		page,
		limit: 20,
	})

	const { data: categoriesData } = useProductCategories()

	const products = data?.products || []
	const categories = categoriesData || []
	const totalPages = data?.pagination.totalPages ?? 1

	const updateFilters = (updates: Record<string, string | undefined>) => {
		const params = new URLSearchParams(searchParams.toString())
		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value)
			} else {
				params.delete(key)
			}
		})
		params.delete("page")
		router.push(`${pathname}?${params.toString()}`)
	}

	const handleSearch = (e: { preventDefault(): void }) => {
		e.preventDefault()
		updateFilters({ search: searchInput || undefined })
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Products</h1>
				<p className="mt-2 text-muted-foreground">
					Browse all products from campus sellers
				</p>
			</div>

			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<form onSubmit={handleSearch} className="flex gap-2">
					<div className="relative flex-1 sm:w-80">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search products..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Button type="submit">Search</Button>
				</form>

				<div className="flex flex-wrap gap-2">
					<Select
						value={category || "all"}
						onValueChange={(value) => updateFilters({ category: value === "all" ? undefined : value })}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={condition || "all"}
						onValueChange={(value) => updateFilters({ condition: value === "all" ? undefined : value })}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Condition" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="new">New</SelectItem>
							<SelectItem value="like_new">Like New</SelectItem>
							<SelectItem value="good">Good</SelectItem>
							<SelectItem value="fair">Fair</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={sortBy || "newest"}
						onValueChange={(value) => updateFilters({ sortBy: value })}
					>
						<SelectTrigger className="w-36">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="popular">Popular</SelectItem>
							<SelectItem value="price_low">Price: Low to High</SelectItem>
							<SelectItem value="price_high">Price: High to Low</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isLoading ? (
				<ProductsSkeleton />
			) : products.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground" />
					<h2 className="text-xl font-semibold">No products found</h2>
					<p className="mt-2 text-muted-foreground">
						Try adjusting your filters or search terms
					</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => router.push("/products")}
					>
						Clear all filters
					</Button>
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={mapApiProductToCard(product)}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<div className="mt-8 flex justify-center gap-2">
							<Button
								variant="outline"
								disabled={page <= 1}
								onClick={() => {
									const params = new URLSearchParams(searchParams.toString())
									params.set("page", String(page - 1))
									router.push(`${pathname}?${params.toString()}`)
								}}
							>
								Previous
							</Button>
							<span className="flex items-center px-4 text-sm text-muted-foreground">
								Page {page} of {totalPages}
							</span>
							<Button
								variant="outline"
								disabled={page >= totalPages}
								onClick={() => {
									const params = new URLSearchParams(searchParams.toString())
									params.set("page", String(page + 1))
									router.push(`${pathname}?${params.toString()}`)
								}}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export function ProductsView() {
	return (
		<Suspense fallback={<ProductsSkeleton />}>
			<ProductsPageContent />
		</Suspense>
	)
}
