"use client";

import { ArrowRight, BadgeCheck, Star, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { Store as StoreType } from "@/types/models";

interface StoreCardCompactProps {
	store: StoreType;
}

export function StoreCardCompact({ store }: StoreCardCompactProps) {
	return (
		<Card className="rounded-xl cursor-pointer group relative overflow-hidden border-border/50 bg-card hover:shadow-lg hover:border-border transition-all duration-300 h-full">
			<Link href={`/stores/${store.id}`} className="block">
				{/* Banner */}
				<div className="relative h-24 sm:h-28 bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
					{store.banner && (
						<Image
							src={store.banner}
							alt={store.name}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					)}
					{!store.isOpen && (
						<div className="absolute inset-0 bg-background/60 flex items-center justify-center">
							<Badge variant="secondary" className="text-[10px]">Closed</Badge>
						</div>
					)}
				</div>

				{/* Content */}
				<CardContent className="p-3 pt-0">
					<div className="flex items-start gap-2 -mt-6 relative">
						<div className="w-12 h-12 rounded-lg border-2 border-background bg-background overflow-hidden shrink-0 shadow-md">
							<Image
								src={store.logo || "/placeholder.svg?height=48&width=48&query=store logo"}
								alt={store.name}
								width={48}
								height={48}
								className="object-cover"
							/>
						</div>
						<div className="pt-5 min-w-0 flex-1">
							<div className="flex items-center gap-1">
								<h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
									{store.name}
								</h3>
								{store.isVerified && (
									<BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
								)}
							</div>
							<p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
								{store.description}
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
						<div className="flex items-center gap-1 text-xs">
							<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							<span className="font-medium text-foreground">{store.rating}</span>
							<span className="text-muted-foreground text-[10px]">({store.reviewsCount})</span>
						</div>
						<span className="text-[10px] text-muted-foreground">{store.productsCount} items</span>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

interface StoresCarouselProps {
	stores: StoreType[];
	title?: string;
	subtitle?: string;
	viewAllLink?: string;
	viewAllText?: string;
	showBanner?: boolean;
	className?: string;
}

export function StoresCarousel({
	stores,
	title = "Campus Stores",
	subtitle = "Shop from verified student-run businesses",
	viewAllLink = "/stores",
	viewAllText = "Browse All Stores",
	showBanner = false,
	className,
}: StoresCarouselProps) {
	return (
		<section className={className}>
			{/* Optional Banner */}
			{showBanner && (
				<div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-10" />
					<img
						src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
						alt="Campus stores"
						className="w-full h-36 sm:h-44 object-cover"
					/>
					<div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-4 sm:px-6">
						<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-[10px] font-medium mb-2 border border-white/20">
							<Store className="h-3 w-3" />
							Verified Campus Sellers
						</span>
						<h2 className="text-lg sm:text-xl font-bold text-white mb-1">Support Local</h2>
						<p className="text-xs text-white/80 mb-3 max-w-xs hidden sm:block">
							Shop from student-run businesses on campus
						</p>
						<Link
							href={viewAllLink}
							className="inline-flex items-center gap-1.5 bg-white hover:bg-white/90 text-primary font-medium px-3 py-1.5 text-xs rounded-lg shadow transition-all hover:scale-[1.02] group"
						>
							Explore Stores
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

			{/* Stores Carousel */}
			<Carousel
				opts={{
					align: "start",
					loop: false,
					dragFree: true,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-3">
					{stores.map((store) => (
						<CarouselItem
							key={store.id}
							className="pl-3 basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%] xl:basis-[18%]"
						>
							<StoreCardCompact store={store} />
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
