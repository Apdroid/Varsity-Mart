"use client";

import { ArrowRight, Clock, Star, Truck, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { Restaurant } from "@/types/models";

interface RestaurantCardCompactProps {
	restaurant: Restaurant;
}

export function RestaurantCardCompact({ restaurant }: RestaurantCardCompactProps) {
	return (
		<Card className="rounded-xl cursor-pointer group relative overflow-hidden border-border/50 bg-card hover:shadow-lg hover:border-border transition-all duration-300 h-full">
			<Link href={`/restaurants/${restaurant.id}`} className="flex flex-col h-full">
				{/* Banner */}
				<div className="relative h-32 sm:h-36 overflow-hidden">
					<Image
						width={400}
						height={200}
						src={restaurant.banner || "/placeholder.svg?height=200&width=400&query=restaurant"}
						alt={restaurant.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>

					{/* Status */}
					<div className="absolute top-2 right-2 z-20">
						<Badge
							variant={restaurant.isOpen ? "default" : "secondary"}
							className={`${restaurant.isOpen ? "bg-green-500 hover:bg-green-500" : "bg-muted"} text-white shadow-sm text-[10px] px-1.5 py-0.5`}
						>
							{restaurant.isOpen ? "Open" : "Closed"}
						</Badge>
					</div>

					{/* Rating */}
					<div className="absolute bottom-0 left-0 z-30 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-tr-lg">
						<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-bold text-foreground">{restaurant.rating}</span>
					</div>
				</div>

				<CardHeader className="p-3 pb-1">
					<CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
						{restaurant.name}
					</CardTitle>
					{/* Tags */}
					{restaurant.tags && restaurant.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{restaurant.tags.slice(0, 2).map((tag, idx) => (
								<span
									key={idx}
									className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</CardHeader>

				<CardContent className="p-3 pt-0 mt-auto">
					<div className="flex items-center gap-2 text-[10px] text-muted-foreground border-t border-border/50 pt-2">
						<div className="flex items-center gap-1">
							<Truck className="w-3 h-3 text-primary" />
							<span>GH₵{restaurant.deliveryFee}</span>
						</div>
						<span className="text-border">•</span>
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3 text-primary" />
							<span>20-30 min</span>
						</div>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

interface RestaurantsCarouselProps {
	restaurants: Restaurant[];
	title?: string;
	subtitle?: string;
	viewAllLink?: string;
	viewAllText?: string;
	showBanner?: boolean;
	className?: string;
}

export function RestaurantsCarousel({
	restaurants,
	title = "Campus Restaurants",
	subtitle = "Fresh meals delivered to your doorstep",
	viewAllLink = "/restaurants",
	viewAllText = "See All Restaurants",
	showBanner = false,
	className,
}: RestaurantsCarouselProps) {
	return (
		<section className={className}>
			{/* Optional Banner */}
			{showBanner && (
				<div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
					<div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40 z-10" />
					<img
						src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
						alt="Delicious food"
						className="w-full h-36 sm:h-44 object-cover"
					/>
					<div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-4 sm:px-6">
						<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-[10px] font-medium mb-2 border border-white/20">
							<UtensilsCrossed className="h-3 w-3" />
							Campus Food Delivery
						</span>
						<h2 className="text-lg sm:text-xl font-bold text-white mb-1">Hungry?</h2>
						<p className="text-xs text-white/80 mb-3 max-w-xs hidden sm:block">
							Your favorite campus restaurants, delivered fresh
						</p>
						<Link
							href={viewAllLink}
							className="inline-flex items-center gap-1.5 bg-white hover:bg-white/90 text-black font-medium px-3 py-1.5 text-xs rounded-lg shadow transition-all hover:scale-[1.02] group"
						>
							Explore
							<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>
				</div>
			)}

			{/* Section Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
				<div>
					<h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
					{subtitle && (
						<p className="text-muted-foreground text-xs md:text-sm">{subtitle}</p>
					)}
				</div>
				<Link
					href={viewAllLink}
					className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
				>
					{viewAllText}
					<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			{/* Restaurants Carousel */}
			<Carousel
				opts={{
					align: "start",
					loop: false,
					dragFree: true,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-3">
					{restaurants.map((restaurant) => (
						<CarouselItem
							key={restaurant.id}
							className="pl-3 basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] xl:basis-[18%]"
						>
							<RestaurantCardCompact restaurant={restaurant} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Mobile View All */}
			<div className="mt-4 text-center sm:hidden">
				<Link
					href={viewAllLink}
					className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					{viewAllText}
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</section>
	);
}
