"use client";

import { ChevronRight, Clock, MapPin, Search, Star, Truck, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RestaurantsCarousel } from "@/components/home/restaurants-carousel";
import { useRestaurants } from "@/hooks/queries/useRestaurants";
import type { Restaurant } from "@/types/models";

// Restaurant Card Component
function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
	return (
		<Card className="rounded-xl cursor-pointer group relative overflow-hidden border-border/50 bg-card hover:shadow-xl hover:border-border transition-all duration-300">
			<Link href={`/restaurants/${restaurant.id}`} className="flex flex-col">
				{/* Banner */}
				<div className="relative h-40 sm:h-48 overflow-hidden">
					<Image
						width={500}
						height={300}
						src={restaurant.banner || "/placeholder.svg?height=300&width=500&query=restaurant"}
						alt={restaurant.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

					{/* Status badge */}
					<div className="absolute top-3 right-3 z-20">
						<Badge
							variant={restaurant.isOpen ? "default" : "secondary"}
							className={`${restaurant.isOpen ? "bg-green-500 hover:bg-green-500" : "bg-muted"} text-white shadow-md text-xs`}
						>
							{restaurant.isOpen ? "Open Now" : "Closed"}
						</Badge>
					</div>

					{/* Rating badge - bottom left */}
					<div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm font-bold text-foreground">{restaurant.rating}</span>
						<span className="text-muted-foreground text-xs">({restaurant.reviewsCount})</span>
					</div>

					{/* Delivery Time - bottom right */}
					<div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
						<Clock className="w-3.5 h-3.5 text-primary-foreground" />
						<span className="text-xs font-medium text-primary-foreground">20-30 min</span>
					</div>
				</div>

				<CardHeader className="space-y-2 pb-2 px-4 pt-4">
					<CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
						{restaurant.name}
					</CardTitle>

					{/* Description */}
					<p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>

					{/* Tags */}
					{restaurant.tags && restaurant.tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5 pt-1">
							{restaurant.tags.slice(0, 4).map((tag, idx) => (
								<span
									key={idx}
									className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</CardHeader>

				<CardContent className="px-4 pb-4">
					{/* Info row */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
						<div className="flex items-center gap-1.5">
							<Truck className="w-4 h-4 text-primary" />
							<span>GH₵{restaurant.deliveryFee} delivery</span>
						</div>
						<div className="flex items-center gap-1.5">
							<MapPin className="w-4 h-4 text-primary" />
							<span>Min GH₵{restaurant.minOrder}</span>
						</div>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

export function RestaurantsPageContent() {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("rating");
	const [filterOpen, setFilterOpen] = useState<string>("all");

	const { data, isLoading } = useRestaurants({ search: searchQuery || undefined } as any);
	const allRestaurants: Restaurant[] = (data as any)?.data ?? [];

	const filteredRestaurants = allRestaurants
		.filter((restaurant) => {
			const matchesOpen =
				filterOpen === "all" ||
				(filterOpen === "open" && restaurant.isOpen) ||
				(filterOpen === "closed" && !restaurant.isOpen);
			return matchesOpen;
		})
		.sort((a, b) => {
			if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
			if (sortBy === "deliveryFee") return (a.deliveryFee ?? 0) - (b.deliveryFee ?? 0);
			if (sortBy === "minOrder") return (a.minOrder ?? 0) - (b.minOrder ?? 0);
			return 0;
		});

	const openRestaurants = allRestaurants.filter((r) => r.isOpen);
	const topRated = allRestaurants.filter((r) => (r.rating ?? 0) >= 4.5);

	return (
		<div className="py-8">
			{/* Breadcrumb */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
				<nav className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground transition-colors">
						Home
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-foreground font-medium">Restaurants</span>
				</nav>
			</div>

			{/* Open Now Carousel */}
			{openRestaurants.length > 0 && (
				<section className="py-6 px-4 sm:px-6 lg:px-8 bg-muted/30">
					<div className="mx-auto max-w-7xl">
						<RestaurantsCarousel
							restaurants={openRestaurants.slice(0, 10)}
							title="🟢 Open Now"
							subtitle="Order from these restaurants right now"
							viewAllLink="/restaurants?filter=open"
							viewAllText="See All Open"
						/>
					</div>
				</section>
			)}

			{/* Top Rated Carousel */}
			{topRated.length > 0 && (
				<section className="py-6 px-4 sm:px-6 lg:px-8 bg-background">
					<div className="mx-auto max-w-7xl">
						<RestaurantsCarousel
							restaurants={topRated.slice(0, 10)}
							title="⭐ Top Rated"
							subtitle="Highest rated restaurants on campus"
							viewAllLink="/restaurants?sort=rating"
							viewAllText="See All Top Rated"
						/>
					</div>
				</section>
			)}

			{/* All Restaurants Section */}
			<section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="mx-auto max-w-7xl">
					{/* Header with Search and Filters */}
					<div className="flex flex-col gap-4 mb-8">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-bold text-foreground">All Restaurants</h2>
								<p className="text-muted-foreground text-sm">
									{filteredRestaurants.length} restaurants available
								</p>
							</div>
						</div>

						{/* Search and Filter Bar */}
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="relative flex-1 max-w-md">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search restaurants, cuisines..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 h-10"
								/>
							</div>

							<div className="flex gap-2">
								<Select value={filterOpen} onValueChange={setFilterOpen}>
									<SelectTrigger className="w-[130px] h-10">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="open">Open Now</SelectItem>
										<SelectItem value="closed">Closed</SelectItem>
									</SelectContent>
								</Select>

								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className="w-[150px] h-10">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="rating">Top Rated</SelectItem>
										<SelectItem value="deliveryFee">Lowest Delivery</SelectItem>
										<SelectItem value="minOrder">Lowest Minimum</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Restaurant Grid */}
					{filteredRestaurants.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{filteredRestaurants.map((restaurant) => (
								<RestaurantCard key={restaurant.id} restaurant={restaurant} />
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
								<UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Try adjusting your search or filters
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setFilterOpen("all");
								}}
							>
								Clear Filters
							</Button>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
