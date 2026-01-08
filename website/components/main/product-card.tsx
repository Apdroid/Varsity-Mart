"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const discount = Math.round(
		((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
	);

	return (
		<Card
			className="group relative overflow-hidden border-none ring-0 hover:bg-card bg-transparent  hover:shadow-xl transition-all duration-300 cursor-pointer max-w-sm"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
				<Image
					width={300}
					height={300}
					src={product.images[0]}
					alt={product.title}
					className="w-full h-full object-cover rounded-lg  transition-transform duration-500"
				/>

				{product.compareAtPrice && (
					<Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
						{discount}% OFF
					</Badge>
				)}

				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setIsLiked(!isLiked);
					}}
					className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md"
				>
					<Heart
						className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`}
					/>
				</button>

				<div
					className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-all duration-300 ${isHovered
							? "translate-y-0 opacity-100"
							: "translate-y-full opacity-0"
						}`}
				>
					<Button
						className="w-full bg-primary text-white hover:text-primary  hover:bg-gray-100 font-semibold"
						onClick={(e) => {
							e.stopPropagation();
							console.log("Add to cart:", product.id);
						}}
					>
						<ShoppingCart className="w-4 h-4 mr-2" />
						Add to Cart
					</Button>
				</div>
			</div>

			<CardContent className="p-4">
				<h3 className="font-bold text-md mb-2 line-clamp-2 hover:text-primary transition-colors">
					{product.title}
				</h3>

				<div className="flex items-center gap-2">
					<span className="text-xl font-bold">
						GH₵{product.price.toLocaleString()}
					</span>
					{product.compareAtPrice && (
						<span className="text-sm  line-through">
							GH₵{product.compareAtPrice.toLocaleString()}
						</span>
					)}
				</div>
			</CardContent>
			<CardFooter className="border-none">
				<div className="flex items-center gap-2 ">
					<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
						<User className="w-4 h-4 text-gray-600" />
					</div>
					<span className="text-sm ">
						{product.seller.firstName} {product.seller.lastName}
					</span>
				</div>
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
