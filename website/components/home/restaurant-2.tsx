"use client";
import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
	Clock,
	Star,
	DollarSign,
	MapPin,
	Heart,
	Search,
	Filter,
	TrendingUp,
	Zap,
	Award,
} from "lucide-react";

interface Restaurant {
	id: string;
	name: string;
	description: string;
	logo: string;
	banner: string;
	cuisine: string[];
	rating: number;
	reviewsCount: number;
	deliveryTime: string;
	deliveryFee: number;
	minOrder: number;
	isOpen: boolean;
	tags: string[];
	location: {
		address: string;
	};
}

// Curated banner images for different restaurant types
const getBannerImage = (restaurantName: string, cuisine: string[]): string => {
	const bannerMap: { [key: string]: string } = {
		pizza:
			"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
		cafe:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
		coffee:
			"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
		burger:
			"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
		healthy:
			"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
		asian:
			"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
		mexican:
			"https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
		african:
			"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
		seafood:
			"https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80",
		default:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
	};

	const cuisineStr = cuisine.join(" ").toLowerCase();

	for (const [key, url] of Object.entries(bannerMap)) {
		if (cuisineStr.includes(key) || restaurantName.toLowerCase().includes(key)) {
			return url;
		}
	}

	return bannerMap.default;
};

interface RestaurantCardEnhancedProps {
	restaurant: Restaurant;
	variant?: "default" | "compact" | "featured";
}

const RestaurantCardEnhanced: React.FC<RestaurantCardEnhancedProps> = ({
	restaurant,
	variant = "default",
}) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const bannerImage = getBannerImage(restaurant.name, restaurant.cuisine);

	if (variant === "compact") {
		return (
			<Card className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50">
				<div className="flex gap-4 p-4">
					{/* Compact image */}
					<div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40 z-10" />
						<img
							src={bannerImage}
							alt={restaurant.name}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
						/>
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-2 mb-2">
							<h3 className="font-bold text-foreground truncate">{restaurant.name}</h3>
							<Badge
								variant={restaurant.isOpen ? "default" : "secondary"}
								className="text-xs flex-shrink-0"
							>
								{restaurant.isOpen ? "Open" : "Closed"}
							</Badge>
						</div>

						<div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
							<div className="flex items-center gap-1">
								<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
								<span className="font-medium text-foreground">{restaurant.rating}</span>
							</div>
							<span>•</span>
							<div className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								<span>{restaurant.deliveryTime}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-1">
							{restaurant.tags.slice(0, 2).map((tag, idx) => (
								<span
									key={idx}
									className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>
			</Card>
		);
	}

	if (variant === "featured") {
		return (
			<Card className="group relative overflow-hidden border-border bg-card hover:shadow-2xl transition-all duration-500 col-span-full md:col-span-2">
				<div className="flex flex-col md:flex-row">
					{/* Featured image */}
					<div className="relative w-full md:w-2/5 h-80 overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/60 to-transparent z-10" />
						<img
							src={bannerImage}
							alt={restaurant.name}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						/>

						<div className="absolute top-6 left-6 z-20">
							<Badge className="bg-yellow-500 text-black border-0 shadow-lg text-sm px-3 py-1">
								<Award className="w-4 h-4 mr-1" />
								Featured
							</Badge>
						</div>

						<button
							onClick={() => setIsFavorite(!isFavorite)}
							className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
						>
							<Heart
								className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`}
							/>
						</button>

						<div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full px-5 py-3 shadow-xl">
							<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
							<span className="font-bold text-foreground text-lg">
								{restaurant.rating}
							</span>
							<span className="text-muted-foreground">
								({restaurant.reviewsCount})
							</span>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 p-8">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h2 className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
									{restaurant.name}
								</h2>
								<div className="flex flex-wrap gap-2 mb-3">
									{restaurant.cuisine.map((item, idx) => (
										<Badge
											key={idx}
											variant="outline"
											className="border-border text-foreground"
										>
											{item}
										</Badge>
									))}
								</div>
							</div>
							<Badge
								variant={restaurant.isOpen ? "default" : "secondary"}
								className="text-sm"
							>
								{restaurant.isOpen ? "Open Now" : "Closed"}
							</Badge>
						</div>

						<p className="text-muted-foreground text-lg leading-relaxed mb-6">
							{restaurant.description}
						</p>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div className="text-center p-3 rounded-lg bg-muted/50">
								<Clock className="w-5 h-5 text-primary mx-auto mb-1" />
								<p className="text-xs text-muted-foreground">Delivery</p>
								<p className="font-semibold text-foreground">
									{restaurant.deliveryTime}
								</p>
							</div>
							<div className="text-center p-3 rounded-lg bg-muted/50">
								<DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
								<p className="text-xs text-muted-foreground">Fee</p>
								<p className="font-semibold text-foreground">
									GH₵{restaurant.deliveryFee}
								</p>
							</div>
							<div className="text-center p-3 rounded-lg bg-muted/50">
								<TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
								<p className="text-xs text-muted-foreground">Min Order</p>
								<p className="font-semibold text-foreground">
									GH₵{restaurant.minOrder}
								</p>
							</div>
							<div className="text-center p-3 rounded-lg bg-muted/50">
								<MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
								<p className="text-xs text-muted-foreground">Location</p>
								<p className="font-semibold text-foreground text-xs leading-tight">
									{restaurant.location.address.split(",")[0]}
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mb-6">
							{restaurant.tags.map((tag, idx) => (
								<span
									key={idx}
									className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
								>
									{tag}
								</span>
							))}
						</div>

						<Button
							size="lg"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
						>
							<Zap className="w-5 h-5 mr-2" />
							Order Now
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	// Default variant
	return (
		<Card className="group relative overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
			<div className="relative h-52 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50 z-10 opacity-90 group-hover:opacity-80 transition-opacity" />
				<img
					src={bannerImage}
					alt={restaurant.name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
				/>

				<div className="absolute top-4 right-4 z-20">
					<Badge
						variant={restaurant.isOpen ? "default" : "secondary"}
						className="bg-background/95 backdrop-blur-sm text-foreground border-border shadow-lg"
					>
						{restaurant.isOpen ? "Open Now" : "Closed"}
					</Badge>
				</div>

				<button
					onClick={() => setIsFavorite(!isFavorite)}
					className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
				>
					<Heart
						className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`}
					/>
				</button>

				<div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
					<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
					<span className="font-bold text-foreground">{restaurant.rating}</span>
					<span className="text-muted-foreground text-sm">
						({restaurant.reviewsCount})
					</span>
				</div>
			</div>

			<CardHeader className="space-y-3 pb-3">
				<CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
					{restaurant.name}
				</CardTitle>

				<CardDescription className="line-clamp-2 text-muted-foreground leading-relaxed">
					{restaurant.description}
				</CardDescription>

				<div className="flex flex-wrap gap-2">
					{restaurant.cuisine.slice(0, 3).map((item, idx) => (
						<Badge
							key={idx}
							variant="outline"
							className="border-border text-foreground text-xs font-medium"
						>
							{item}
						</Badge>
					))}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Clock className="w-4 h-4 text-primary" />
						<span>{restaurant.deliveryTime}</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<DollarSign className="w-4 h-4 text-primary" />
						<span>GH₵{restaurant.deliveryFee} fee</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground col-span-2">
						<MapPin className="w-4 h-4 text-primary" />
						<span className="truncate">{restaurant.location.address}</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 pt-2 border-t border-border">
					{restaurant.tags.map((tag, idx) => (
						<span
							key={idx}
							className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
						>
							{tag}
						</span>
					))}
				</div>

				<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
					Order Now • Min GH₵{restaurant.minOrder}
				</Button>
			</CardContent>
		</Card>
	);
};

interface RestaurantsSectionAdvancedProps {
	restaurants: Restaurant[];
}

const RestaurantsSectionAdvanced: React.FC<RestaurantsSectionAdvancedProps> = ({
	restaurants,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const categories = [
		"all",
		"ghanaian",
		"fast food",
		"healthy",
		"asian",
		"cafe",
	];

	const filteredRestaurants = restaurants.filter((restaurant) => {
		const matchesSearch =
			restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" ||
			restaurant.cuisine.some((c) => c.toLowerCase().includes(selectedCategory));
		return matchesSearch && matchesCategory;
	});

	const featuredRestaurant =
		restaurants.find((r) => r.rating >= 4.7) || restaurants[0];
	const topRatedRestaurants = restaurants
		.filter((r) => r.rating >= 4.5)
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 4);

	return (
		<section className="w-full py-12 md:py-16 bg-background">
			<div className="container mx-auto px-4">
				{/* Hero Banner */}
				<div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
					<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent z-10" />
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80')",
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

					<div className="relative z-20 px-8 md:px-16 py-20 md:py-28">
						<div className="max-w-3xl">
							<Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm mb-4 text-sm px-4 py-1">
								<Zap className="w-3 h-3 mr-1" />
								Fast Delivery
							</Badge>

							<h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-2xl">
								Hungry?
								<br />
								<span className="text-primary">We've got you.</span>
							</h1>

							<p className="text-xl md:text-2xl text-white/95 font-medium mb-8 leading-relaxed drop-shadow-lg">
								Discover amazing food from campus restaurants, delivered fresh to your
								doorstep in minutes
							</p>

							{/* Search bar in hero */}
							<div className="flex gap-3 max-w-2xl">
								<div className="relative flex-1">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
									<Input
										placeholder="Search for restaurants or cuisines..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-12 h-14 bg-background/95 backdrop-blur-sm border-border text-foreground shadow-xl"
									/>
								</div>
								<Button
									size="lg"
									className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-14 shadow-xl"
								>
									Search
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Category Tabs */}
				<Tabs
					value={selectedCategory}
					onValueChange={setSelectedCategory}
					className="mb-8"
				>
					<TabsList className="bg-muted border border-border inline-flex">
						{categories.map((category) => (
							<TabsTrigger
								key={category}
								value={category}
								className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								{category}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				{/* Featured Restaurant */}
				{selectedCategory === "all" && (
					<div className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
									Featured Restaurant
								</h2>
								<p className="text-muted-foreground text-lg">Highest rated this week</p>
							</div>
						</div>

						<div className="grid grid-cols-1">
							<RestaurantCardEnhanced
								restaurant={featuredRestaurant}
								variant="featured"
							/>
						</div>
					</div>
				)}

				{/* Top Rated Section */}
				{selectedCategory === "all" && (
					<div className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
									Top Rated
								</h2>
								<p className="text-muted-foreground text-lg">
									Students' favorite picks
								</p>
							</div>
							<Button
								variant="ghost"
								className="text-primary font-semibold hover:text-primary/80"
							>
								See all →
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{topRatedRestaurants.map((restaurant) => (
								<RestaurantCardEnhanced
									key={restaurant.id}
									restaurant={restaurant}
									variant="compact"
								/>
							))}
						</div>
					</div>
				)}

				{/* All Restaurants Grid */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
								{selectedCategory === "all"
									? "All Restaurants"
									: `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Restaurants`}
							</h2>
							<p className="text-muted-foreground text-lg">
								{filteredRestaurants.length} restaurants available
							</p>
						</div>
						<Button variant="outline" className="gap-2">
							<Filter className="w-4 h-4" />
							Filters
						</Button>
					</div>

					{filteredRestaurants.length === 0 ? (
						<div className="text-center py-16">
							<p className="text-muted-foreground text-lg">
								No restaurants found matching your search.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredRestaurants.map((restaurant) => (
								<RestaurantCardEnhanced key={restaurant.id} restaurant={restaurant} />
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export { RestaurantsSectionAdvanced, RestaurantCardEnhanced };
export default RestaurantsSectionAdvanced;
