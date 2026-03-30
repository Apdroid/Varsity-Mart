"use client";
import { Clock, DollarSign, Star, Truck, ArrowRight, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type { Restaurant } from "@/types/models";

interface RestaurantCardProps {
	restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
	return (
		<Card className="rounded-xl cursor-pointer group relative overflow-hidden border-border/50 bg-card hover:shadow-xl hover:border-border transition-all duration-300 py-0">
			<Link href={`/restaurants/${restaurant.id}`} className="flex flex-col relative">
				{/* Banner with overlay */}
				<div className="relative bg-muted h-40 md:h-48 overflow-hidden">
					<Image
						width={500}
						height={500}
						src={restaurant.banner || "/placeholder.svg?height=300&width=500&query=restaurant"}
						alt={restaurant.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>

					{/* Status badge */}
					<div className="absolute top-3 right-3 z-20">
						<Badge
							variant={restaurant.isOpen ? "default" : "secondary"}
							className={`${restaurant.isOpen ? 'bg-green-500 hover:bg-green-500' : 'bg-muted'} text-white shadow-md text-xs`}
						>
							{restaurant.isOpen ? "Open Now" : "Closed"}
						</Badge>
					</div>

					{/* Rating badge - bottom left */}
					<div className="absolute bottom-0 left-0 z-30 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-tr-xl shadow-lg">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm font-bold text-foreground">
							{restaurant.rating}
						</span>
						<span className="text-muted-foreground text-xs">
							({restaurant.reviewsCount})
						</span>
					</div>
				</div>

				<CardHeader className="space-y-2 pb-2 px-4 pt-4">
					<CardTitle className="text-base md:text-lg capitalize font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
						{restaurant.name}
					</CardTitle>

					{/* Tags */}
					{restaurant.tags && restaurant.tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{restaurant.tags.slice(0, 3).map((tag, idx) => (
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
					<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
						<div className="flex items-center gap-1.5">
							<Truck className="w-3.5 h-3.5 text-primary" />
							<span>GH₵{restaurant.deliveryFee}</span>
						</div>
						<span className="text-border">•</span>
						<div className="flex items-center gap-1.5">
							<Clock className="w-3.5 h-3.5 text-primary" />
							<span>20-30 min</span>
						</div>
						<span className="text-border hidden sm:inline">•</span>
						<div className="hidden sm:flex items-center gap-1.5">
							<DollarSign className="w-3.5 h-3.5 text-primary" />
							<span>Min GH₵{restaurant.minOrder}</span>
						</div>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
};

interface RestaurantsSectionProps {
	restaurants: Restaurant[];
	title?: string;
	subtitle?: string;
}

const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({
	restaurants,
	title = "Craving something delicious?",
	subtitle = "Browse restaurants on campus",
}) => {
	return (
		<section className="w-full py-12 md:py-16 bg-muted/30">
			<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
				{/* Hero Banner - Improved */}
				<div className="relative rounded-2xl overflow-hidden mb-10 shadow-xl">
					<div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/50 z-10" />
					<img
						src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
						alt="Delicious food"
						className="w-full h-64 md:h-80 object-cover"
					/>
					<div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 md:px-12 lg:px-16">
						<span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-4 border border-white/20">
							<UtensilsCrossed className="h-3.5 w-3.5" />
							Campus Food Delivery
						</span>
						<h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
							Hungry?
						</h1>
						<p className="text-sm md:text-lg text-white/85 font-medium mb-6 max-w-xl leading-relaxed">
							Your favorite campus restaurants, delivered fresh to your doorstep
						</p>
						<Link
							href="/restaurants"
							className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg shadow-lg transition-all hover:scale-[1.02] group"
						>
							Explore Restaurants
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
				</div>

				{/* Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
					<div>
						<h2 className="text-xl md:text-3xl font-bold text-foreground mb-1">
							{title}
						</h2>
						<p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
					</div>
					<Link
						href="/restaurants"
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
					>
						See all restaurants
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				{/* Restaurant Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{restaurants.map((restaurant) => (
						<RestaurantCard key={restaurant.id} restaurant={restaurant} />
					))}
				</div>
			</div>
		</section>
	);
};
export { RestaurantsSection, RestaurantCard };
export default RestaurantsSection;
