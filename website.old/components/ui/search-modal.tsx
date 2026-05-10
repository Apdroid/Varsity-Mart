"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	BookOpen,
	Laptop,
	Shirt,
	Bed,
	ShoppingBag,
	Smartphone,
	Headphones,
	Dumbbell,
	Palette,
	Music,
	Camera,
	Search,
	TrendingUp,
	X,
	ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts, useSearchProducts } from "@/hooks/queries/useProducts";
import type { ApiProduct } from "@/types/api";
import type { LucideIcon } from "lucide-react";

interface SearchModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialQuery?: string;
}

const categories: { name: string; icon: LucideIcon; href: string; type: string }[] = [
	{ name: "Textbooks", icon: BookOpen, href: "/search?category=textbooks", type: "Products" },
	{ name: "Electronics", icon: Laptop, href: "/search?category=electronics", type: "Products" },
	{ name: "Fashion", icon: Shirt, href: "/search?category=fashion", type: "Products" },
	{ name: "Room Essentials", icon: Bed, href: "/search?category=room-essentials", type: "Products" },
	{ name: "Accessories", icon: ShoppingBag, href: "/search?category=accessories", type: "Products" },
	{ name: "Phones & Tablets", icon: Smartphone, href: "/search?category=phones", type: "Products" },
	{ name: "Audio", icon: Headphones, href: "/search?category=audio", type: "Products" },
	{ name: "Sports & Fitness", icon: Dumbbell, href: "/search?category=sports", type: "Products" },
	{ name: "Art Supplies", icon: Palette, href: "/search?category=art", type: "Products" },
	{ name: "Musical Instruments", icon: Music, href: "/search?category=music", type: "Products" },
	{ name: "Photography", icon: Camera, href: "/search?category=photography", type: "Products" },
];

const trendingSearches = [
	"HP Laptop",
	"Wireless Headphones",
	"Textbooks",
	"iPhone 13",
	"Nike Sneakers",
	"Waakye Special",
];

export function SearchModal({ open, onOpenChange, initialQuery = "" }: SearchModalProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [showAutocomplete, setShowAutocomplete] = useState(false);

	const isSearching = searchQuery.trim().length > 0;
	const { data: searchData, isLoading: isSearchLoading } = useSearchProducts(
		isSearching ? searchQuery : "",
	);
	const { data: defaultData } = useProducts({ limit: 8 } as any);

	const filteredProducts: ApiProduct[] = isSearching
		? (searchData?.data?.products?.slice(0, 12) ?? [])
		: (defaultData?.data?.products?.slice(0, 8) ?? []);

	const suggestions: string[] = isSearching
		? [...new Set(filteredProducts.map((p) => p.title))].slice(0, 5)
		: [];

	useEffect(() => {
		setShowAutocomplete(suggestions.length > 0 && searchQuery.length > 2);
	}, [suggestions.length, searchQuery]);

	const handleSearch = (query: string) => {
		if (query.trim()) {
			router.push(`/search?query=${encodeURIComponent(query)}`);
			onOpenChange(false);
		}
	};

	const handleCategoryClick = () => {
		onOpenChange(false);
	};

	const handleProductClick = () => {
		onOpenChange(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			{/* Overlay Click to Close */}
			<div className="absolute inset-0" onClick={() => onOpenChange(false)} />

			{/* Modal Content */}
			<div className="relative h-full flex flex-col">
				{/* Header */}
				<div className="border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 shadow-lg">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center gap-4 h-20">
							{/* Search Input */}
							<div className="flex-1 relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
								<Input
									type="text"
									placeholder="Search for products, stores, or food..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSearch(searchQuery);
											setShowAutocomplete(false);
										}
										if (e.key === "Escape") {
											if (showAutocomplete) {
												setShowAutocomplete(false);
											} else {
												onOpenChange(false);
											}
										}
									}}
									className="pl-12 pr-4 h-14 text-base border-2 focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
									autoFocus
								/>

								{/* Autocomplete Dropdown */}
								{showAutocomplete && suggestions.length > 0 && (
									<div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden">
										{suggestions.map((suggestion, index) => (
											<button
												key={index}
												type="button"
												onClick={() => {
													setSearchQuery(suggestion);
													setShowAutocomplete(false);
												}}
												className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
											>
												<Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
												<span className="text-sm font-medium">{suggestion}</span>
											</button>
										))}
									</div>
								)}
							</div>

							{/* Close Button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onOpenChange(false)}
								className="h-12 w-12 rounded-xl hover:bg-accent"
							>
								<X className="h-6 w-6" />
							</Button>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 overflow-y-auto">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{isSearching ? (
					// Search Results - Products
					<div>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold">
								{filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} for <span className="text-primary">"{searchQuery}"</span>
							</h3>
							{filteredProducts.length > 0 && (
								<Button
									variant="link"
									className="text-primary hover:text-primary/80 text-base font-medium"
									onClick={() => handleSearch(searchQuery)}
								>
									View all results
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							)}
						</div>

					{filteredProducts.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
							{filteredProducts.map((product: ApiProduct) => (
								<Link
									key={product.id}
									href={`/products/${product.id}`}
									onClick={handleProductClick}
									className="group block rounded-[var(--r)] overflow-hidden transition-all"
									style={{
										background: "var(--surface)",
										border: "1px solid var(--ink-4)",
										boxShadow: "var(--sh-sm)",
									}}
								>
									<div
										className="aspect-square relative overflow-hidden"
										style={{ background: "var(--bg)" }}
									>
									<Image
										src={product.images?.[0]?.url || product.images?.[0]?.optimized_url || "/placeholder.svg"}
										alt={product.title}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>
								<div className="p-2.5">
									<h4
										className="font-medium text-[13px] line-clamp-2 mb-1.5"
										style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}
									>
										{product.title}
									</h4>
									<span
										className="text-sm font-semibold"
										style={{ color: "var(--orange)", fontFamily: "var(--font-mono)" }}
									>
										GH₵{product.price}
									</span>
									</div>
								</Link>
							))}
							</div>
						) : (
							<div className="text-center py-16">
								<div className="mx-auto w-24 h-24 rounded-full bg-accent/50 flex items-center justify-center mb-6">
									<Search className="h-12 w-12 text-muted-foreground" />
								</div>
								<h3 className="text-xl font-bold mb-2">No products found</h3>
								<p className="text-muted-foreground text-base mb-6">
									Try searching with different keywords
								</p>
							</div>
						)}
					</div>
				) : (
					// Default View: Categories, Trending, Products
					<div className="space-y-10">
						{/* Trending Searches */}
						<div>
							<div className="flex items-center gap-3 mb-6">
								<TrendingUp className="h-6 w-6 text-primary" />
								<h3 className="text-xl font-bold">Trending Searches</h3>
							</div>
							<div className="flex flex-wrap gap-3">
								{trendingSearches.map((term) => (
									<button
										key={term}
										type="button"
										onClick={() => setSearchQuery(term)}
										className="px-6 py-3 text-sm font-medium rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 hover:text-primary transition-all hover:scale-105 active:scale-95"
									>
										{term}
									</button>
								))}
							</div>
						</div>

						{/* Popular Products */}
						<div>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold">Popular Products</h3>
								<Link
									href="/products"
									className="text-base text-primary hover:text-primary/80 font-medium flex items-center gap-2 hover:gap-3 transition-all"
									onClick={() => onOpenChange(false)}
								>
									View all
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
							{filteredProducts.map((product: ApiProduct) => (
								<Link
									key={product.id}
									href={`/products/${product.id}`}
									onClick={handleProductClick}
									className="group block rounded-[var(--r)] overflow-hidden transition-all"
									style={{
										background: "var(--surface)",
										border: "1px solid var(--ink-4)",
										boxShadow: "var(--sh-sm)",
									}}
								>
									<div
										className="aspect-square relative overflow-hidden"
										style={{ background: "var(--bg)" }}
									>
									<Image
										src={product.images?.[0]?.url || product.images?.[0]?.optimized_url || "/placeholder.svg"}
										alt={product.title}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>
								<div className="p-2.5">
									<h4
										className="font-medium text-[13px] line-clamp-2 mb-1"
										style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}
									>
										{product.title}
									</h4>
									<span
										className="text-sm font-semibold"
										style={{ color: "var(--orange)", fontFamily: "var(--font-mono)" }}
									>
										GH₵{product.price}
									</span>
									</div>
								</Link>
							))}
						</div>
						</div>

						{/* Browse by Category */}
						<div className="pb-8">
							<h3 className="text-xl font-bold mb-6">Browse by Category</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
								{categories.map((category) => (
									<Link
										key={category.name}
										href={category.href}
										onClick={handleCategoryClick}
										className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all group hover:scale-105 active:scale-95"
									>
										<div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
											<category.icon className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold truncate">{category.name}</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
					</div>
				</div>
			</div>
		</div>
	);
}
