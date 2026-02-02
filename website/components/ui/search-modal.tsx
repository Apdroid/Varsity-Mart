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
	Clock,
	X,
	ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/products/products";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";

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

const recentSearches = [
	"MacBook Pro",
	"Bluetooth Speaker",
	"Calculus Textbook",
];

export function SearchModal({ open, onOpenChange, initialQuery = "" }: SearchModalProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [filteredProducts, setFilteredProducts] = useState(mockProducts.slice(0, 6));
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		if (searchQuery.trim()) {
			setIsSearching(true);
			// Filter products based on search query
			const filtered = mockProducts.filter((product) =>
				product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
			).slice(0, 8);
			setFilteredProducts(filtered);
		} else {
			setIsSearching(false);
			setFilteredProducts(mockProducts.slice(0, 6));
		}
	}, [searchQuery]);

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
		<div className="fixed inset-0 z-50 bg-background/40">
			{/* Header */}
			<div className="border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4 h-16">
						{/* Search Input */}
						<div className="flex-1 relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search for products, stores, or food..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleSearch(searchQuery);
									}
									if (e.key === "Escape") {
										onOpenChange(false);
									}
								}}
								className="pl-12 pr-4 h-12 text-base border-2 focus-visible:ring-primary"
								autoFocus
							/>
						</div>

						{/* Close Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onOpenChange(false)}
							className="h-10 w-10"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className=" bg-background container mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
				{isSearching ? (
					// Search Results - Products
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">
								{filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} for "{searchQuery}"
							</h3>
							{filteredProducts.length > 0 && (
								<Button
									variant="link"
									className="text-primary"
									onClick={() => handleSearch(searchQuery)}
								>
									View all results
									<ArrowRight className="ml-1 h-4 w-4" />
								</Button>
							)}
						</div>

						{filteredProducts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{filteredProducts.map((product: Product) => (
									<Link
										key={product.id}
										href={`/products/${product.id}`}
										onClick={handleProductClick}
										className="group block rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden bg-card"
									>
										<div className="aspect-square relative overflow-hidden bg-accent">
											<Image
												src={product.images[0] || "/placeholder.svg"}
												alt={product.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											{product.compareAtPrice && (
												<Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
													{Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
												</Badge>
											)}
										</div>
										<div className="p-3">
											<h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
												{product.title}
											</h4>
											<div className="flex items-center gap-2">
												<span className="text-lg font-bold text-primary">
													GH₵{product.price}
												</span>
												{product.compareAtPrice && (
													<span className="text-xs text-muted-foreground line-through">
														GH₵{product.compareAtPrice}
													</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												{product.condition}
											</p>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="mx-auto w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
									<Search className="h-10 w-10 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold mb-2">No products found</h3>
								<p className="text-muted-foreground mb-4">
									Try searching with different keywords
								</p>
							</div>
						)}
					</div>
				) : (
					// Default View: Categories, Trending, Products
					<div className="space-y-8">
						{/* Trending Searches */}
						<div>
							<div className="flex items-center gap-2 mb-4">
								<TrendingUp className="h-5 w-5 text-primary" />
								<h3 className="text-lg font-semibold">Trending Searches</h3>
							</div>
							<div className="flex flex-wrap gap-2">
								{trendingSearches.map((term) => (
									<button
										key={term}
										type="button"
										onClick={() => setSearchQuery(term)}
										className="px-4 py-2 text-sm rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 transition-all font-medium"
									>
										{term}
									</button>
								))}
							</div>
						</div>

						{/* Popular Products */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">Popular Products</h3>
								<Link
									href="/products"
									className="text-sm text-primary hover:underline flex items-center gap-1"
									onClick={() => onOpenChange(false)}
								>
									View all
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
								{filteredProducts.map((product: Product) => (
									<Link
										key={product.id}
										href={`/products/${product.id}`}
										onClick={handleProductClick}
										className="group block rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden bg-card"
									>
										<div className="aspect-square relative overflow-hidden bg-accent">
											<Image
												src={product.images[0] || "/placeholder.svg"}
												alt={product.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
										<div className="p-2">
											<h4 className="font-medium text-xs line-clamp-1 mb-1 group-hover:text-primary transition-colors">
												{product.title}
											</h4>
											<span className="text-sm font-bold text-primary">
												GH₵{product.price}
											</span>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* Browse by Category */}
						<div>
							<h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{categories.map((category) => (
									<Link
										key={category.name}
										href={category.href}
										onClick={handleCategoryClick}
										className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
									>
										<div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
											<category.icon className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">{category.name}</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
