"use client";
import {
	Clock,
	DollarSign,
	Flame,
	Heart,
	ShoppingCart,
	Star,
	UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EstablishmentCardSideOverlay = ({
	product,
}: {
	product: Establishment;
}) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const isRestaurant = product.establishmentType === "restaurant";

	const handleCardClick = () => {
		// Check if mobile (screen width < 1024px)
		if (window.innerWidth < 1024) {
			// Use hash-based navigation for mobile
			window.location.hash = `#/establishment/${product.id}`;
		} else {
			// Desktop: flip the card
			setIsFlipped(!isFlipped);
		}
	};

	const badgeConfig = isRestaurant
		? {
				bg: "bg-amber-500 hover:bg-amber-600",
				icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
				label: "Restaurant",
			}
		: {
				bg: "bg-emerald-500 hover:bg-emerald-600",
				icon: <Flame className="w-3.5 h-3.5" />,
				label: "Food Stall",
			};

	const sellerInitials =
		`${product.seller.firstName[0]}${product.seller.lastName[0]}`.toUpperCase();

	return (
		<div
			className="relative w-full max-w-sm h-86"
			style={{ perspective: "1000px" }}
		>
			<div
				className="relative w-full h-full cursor-pointer transition-transform duration-700"
				style={{
					transformStyle: "preserve-3d",
					transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
				onClick={handleCardClick}
			>
				{/* Front Side */}
				<motion.div
					className="absolute w-full h-full"
					style={{
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
					}}
				>
					<Card className="p-0 group relative bg-transparent overflow-hidden border-none ring-0 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
						<div className="relative aspect-square overflow-hidden rounded-xs bg-gray-100">
							<Image
								width={500}
								height={500}
								src={product.banner}
								alt={product.name}
								className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
							/>

							{/* Gradient Overlay on Hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

							{/* Establishment Type Badge */}
							<Badge
								className={`absolute top-3 left-3 ${badgeConfig.bg} flex items-center gap-1.5 shadow-lg`}
							>
								{badgeConfig.icon}
								{badgeConfig.label}
							</Badge>

							{/* Like Button */}
							<motion.button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setIsLiked(!isLiked);
								}}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl"
							>
								<Heart
									className={`w-5 h-5 transition-all ${
										isLiked
											? "fill-red-500 text-red-500 scale-110"
											: "text-gray-700"
									}`}
								/>
							</motion.button>

							{/* Discount Badge */}
							{product.compareAtPrice && product.price && (
								<Badge className="absolute bottom-3 left-3 bg-red-500 hover:bg-red-600 shadow-lg">
									{Math.round(
										((product.compareAtPrice - product.price) /
											product.compareAtPrice) *
											100,
									)}
									% OFF
								</Badge>
							)}
						</div>

						<CardContent className="p-4 flex-1">
							<h3 className=" font-bold leading-tight text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
								{product.name}
							</h3>

							{/* Rating */}
							{product.rating && (
								<div className="flex items-center gap-2 mb-2">
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										<span className="text-sm font-semibold">
											{product.rating}
										</span>
									</div>
									{product.reviewsCount && (
										<span className="text-xs">
											({product.reviewsCount} reviews)
										</span>
									)}
								</div>
							)}

							{/* Delivery Info */}
							{/* {product.deliveryTime && ( */}
							{/* 	<div className="flex flex-col  md:gap-1 gap-1 text-xs mb-3"> */}
							{/* 		<div className="flex items-center gap-1"> */}
							{/* 			<Clock className="w-3.5 h-3.5" /> */}
							{/* 			{product.deliveryTime} */}
							{/* 		</div> */}
							{/* 		{product.deliveryFee !== undefined && ( */}
							{/* 				<div className="flex items-center gap-1"> */}
							{/* 					<DollarSign className="w-3.5 h-3.5" /> */}
							{/* 					GH₵{product.deliveryFee} delivery */}
							{/* 				</div> */}
							{/* 		)} */}
							{/* 	</div> */}
							{/* )} */}

							{/* Hover hint on desktop */}
							<p className="text-xs text-muted-foreground italic mt-auto hidden lg:block">
								Click to view menu
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Back Side */}
				<div
					className="absolute w-full h-full"
					style={{
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<Card className="relative overflow-hidden shadow-2xl h-full flex flex-col">

						{/* Menu List */}
						<div className="flex-1 overflow-y-auto px-3 py-3 bg-background/30">
							<div className="align-center mb-3 flex items-center gap-2">
								<UtensilsCrossed className="w-4 h-4" />
								<h4 className="font-bold text-sm">Popular Meals</h4>
							</div>

							{product.meals && product.meals.length > 0 ? (
								<ul className="">
									{product.meals.map((meal) => (
										<li
											key={meal.id}
											className="flex items-center gap-2 text-sm px-1 px-3 bg-card/80 rounded-lg hover:bg-card transition-colors"
										>
											<div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
											<span className="line-clamp-1">{meal.name}</span>
										</li>
									))}
								</ul>
							) : (
								<div className="text-center py-8">
									<UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
									<p className="text-sm text-muted-foreground italic">
										No meals listed yet
									</p>
								</div>
							)}
						</div>

						{/* Footer Button */}
						<div className="p-5  bg-card">
							<Button
								onClick={(e) => {
									e.stopPropagation();
									// Handle order action
								}}
								className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-lg h-6 p-4 text-base"
							>
								<ShoppingCart className="w-5 h-5 mr-2" />
								Order Now
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default EstablishmentCardSideOverlay;
