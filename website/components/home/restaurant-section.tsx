"use client";
import { Clock, DollarSign, MapPin, Star, Truck } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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

interface RestaurantCardProps {
	restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
	return (
		<Card className="group flex justify-between relative overflow-hidden border-border hover:bg-card active:bg-card bg-transparent md:bg-card hover:shadow-xl transition-all duration-500  py-0">
			{/* Banner with overlay */}
			<div className="relative bg-card h-48 overflow-hidden">
				<div className="absolute inset-0 z-10 bg-linear-to-r from-black/10 via-black/20 to-black/10 " />
				<Image
					width={500}
					height={500}
					src={restaurant.banner}
					alt={restaurant.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
				/>

				{/* Status badge */}
				<div className="absolute top-4 right-4 z-20">
					<Badge
						variant={restaurant.isOpen ? "default" : "secondary"}
						className="bg-card/95 backdrop-blur-sm text-foreground border-border shadow-lg"
					>
						{restaurant.isOpen ? "Open Now" : "Closed"}
					</Badge>
				</div>

				<div className="absolute bottom-0 rounded-tr-lg left-0 z-30 flex items-center gap-2 bg-card backdrop-blur-sm px-2 py-1 md:px-4 md:py-2 shadow-lg">
					<Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
					<span className="text-sm font-bold text-foreground">
						{restaurant.rating}
					</span>
					<span className="text-muted-foreground text-sm">
						({restaurant.reviewsCount})
					</span>
				</div>
			</div>

			<CardHeader className="relative space-y-1 pb-1 px-2">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-sm md:text-xl capitalize font-bold text-foreground group-hover:text-primary transition-colors">
						{restaurant.name}
					</CardTitle>
				</div>

				{/* <CardDescription className="line-clamp-2 text-muted-foreground leading-relaxed"> */}
				{/* 	{restaurant.description} */}
				{/* </CardDescription> */}

				{/* Tags */}
				<div className="flex flex-wrap gap-1 md:gap-2 pt-2 border-t border-border">
					{restaurant.tags.map((tag, idx) => (
						<span
							key={idx}
							className="text-xs px-2 py-1 rounded-full bg-primary/10 font-light md:font-medium"
						>
							{tag}
						</span>
					))}
				</div>

				{/* Cuisine tags */}
			</CardHeader>

			<CardContent className="space-y-3 px-2">
				{/* Info grid */}
				<div className="flex flex-col md:flex-row flex-wrap gap-2 text-xs pb-5 flex-start md:items-center ">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Truck className="w-4 h-4 text-primary" />
						<span className="text-xs">GH₵{restaurant.deliveryFee} fee</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground ">
						<MapPin className="w-4 h-4 text-primary" />
						<span className="truncate text-xs">{restaurant.location.address}</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground ">
						<DollarSign className="w-4 h-4 text-primary" />
						<span className="truncate text-xs">Min GH₵{restaurant.minOrder}</span>
					</div>
				</div>
			</CardContent>
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
		<section className="w-full py-18 bg-background">
			<div className="max-w-360 mx-auto my-0 px-4">
				{/* Hero Banner */}
				<div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
					<img
						src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
						alt="Delicious food"
						className="w-full h-80 object-cover"
					/>
					<div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-12 md:px-20">
						<h1 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
							Hungry?
						</h1>
						<p className="text-md md:text-xl text-white/90 font-medium mb-8 max-w-2xl leading-relaxed">
							Your favorite campus restaurants, delivered fresh to your doorstep
						</p>
						<Button className="bg-white hover:bg-white/90 text-md font-medium md:font-bold  text-black  md:text-lg px-5 py-4 shadow-xl">
							Explore Restaurants
						</Button>
					</div>
				</div>

				{/* Section Header */}
				<div className="flex items-end justify-between mb-8">
					<div>
						<h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
							{title}
						</h2>
						<p className="text-muted-foreground text-md md:text-lg">{subtitle}</p>
					</div>
					<Button
						variant="ghost"
						className="text-primary font-semibold hover:text-primary/80"
					>
						See more →
					</Button>
				</div>

				{/* Restaurant Grid */}
				<div className="grid grid-cols-2 auto-rows-fr md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
					{restaurants.map((restaurant) => (
						<RestaurantCard key={restaurant.id} restaurant={restaurant} />
					))}
				</div>
			</div>
		</section>
	);
};

// Example usage with the mock data
export const mockRestaurants: Restaurant[] = [
	{
		id: "1",
		name: "Campus Bites Cafe",
		description:
			"Quick bites and fresh sandwiches. Popular spot for breakfast and lunch between classes.",
		logo: "/placeholder-logo.png",
		banner:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
		cuisine: ["Cafe", "Sandwiches", "Breakfast"],
		rating: 4.5,
		reviewsCount: 234,
		deliveryTime: "15-25 min",
		deliveryFee: 5,
		minOrder: 20,
		isOpen: true,
		tags: ["Fast", "Popular", "Breakfast"],
		location: {
			address: "Building A, Ground Floor",
		},
	},
	{
		id: "2",
		name: "Waakye Junction",
		description:
			"Traditional Ghanaian waakye served with your choice of protein and sides. Student favorites!",
		logo: "/placeholder-logo.png",
		banner:
			"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
		cuisine: ["Ghanaian", "Local", "Rice"],
		rating: 4.7,
		reviewsCount: 456,
		deliveryTime: "20-30 min",
		deliveryFee: 8,
		minOrder: 15,
		isOpen: true,
		tags: ["Local", "Affordable", "Traditional"],
		location: {
			address: "Near Main Gate",
		},
	},
	{
		id: "3",
		name: "Pizza Palace",
		description:
			"Fresh pizzas made to order. Late-night delivery available for those study sessions!",
		logo: "/placeholder-logo.png",
		banner:
			"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
		cuisine: ["Italian", "Pizza", "Fast Food"],
		rating: 4.3,
		reviewsCount: 189,
		deliveryTime: "25-35 min",
		deliveryFee: 10,
		minOrder: 30,
		isOpen: true,
		tags: ["Late Night", "Pizza", "Popular"],
		location: {
			address: "Student Center, 2nd Floor",
		},
	},
	{
		id: "4",
		name: "Jollof Express",
		description:
			"Best jollof rice on campus! Authentic Ghanaian recipes with generous portions.",
		logo: "/placeholder-logo.png",
		banner:
			"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
		cuisine: ["Ghanaian", "West African", "Rice"],
		rating: 4.8,
		reviewsCount: 523,
		deliveryTime: "20-30 min",
		deliveryFee: 7,
		minOrder: 20,
		isOpen: true,
		tags: ["Popular", "Jollof", "Authentic"],
		location: {
			address: "Hostel Area, Block C",
		},
	},
];

// Export both the section and individual card
export { RestaurantsSection, RestaurantCard };
export default RestaurantsSection;

// Example implementation
export const RestaurantsSectionExample = () => {
	return <RestaurantsSection restaurants={mockRestaurants} />;
};
