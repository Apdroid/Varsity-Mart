"use client";

import { Heart, MessageCircle, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";

interface ProductCardProps {
	product: Product;
	className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
	const discount = product.compareAtPrice
		? Math.round(
				((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
			)
		: 0;

	return (
		<div
			className={cn(
				"group relative bg-card border border-border/50 rounded-lg overflow-hidden hover:shadow-lg hover:border-border transition-all duration-300",
				className,
			)}
		>
			{/* Image Container */}
			<Link
				href={`/products/${product.id}`}
				className="block aspect-square relative overflow-hidden bg-muted/30"
			>
				<Image
					src={
						product.images[0] || "/placeholder.svg?height=300&width=300&query=product"
					}
					alt={product.title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>

				{/* Badges - Positioned top left */}
				<div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
					{discount > 0 && (
						<Badge className="bg-red-500 hover:bg-red-500 text-white text-xs font-semibold px-2 py-0.5 shadow-sm">
							-{discount}%
						</Badge>
					)}
					{product.condition !== "new" && (
						<Badge variant="secondary" className="capitalize text-xs px-2 py-0.5 bg-background/90 backdrop-blur-sm shadow-sm">
							{product.condition}
						</Badge>
					)}
				</div>

				{/* Quick Actions - Top right */}
				<div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm border border-border/50"
					>
						<Heart
							className={cn("h-4 w-4", product.isLiked && "fill-red-500 text-red-500")}
						/>
					</Button>
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm border border-border/50"
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>

				{/* Quick Add to Cart - Bottom overlay on hover */}
				<div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
					<Button
						size="sm"
						className="w-full h-8 text-xs font-medium bg-white hover:bg-white/90 text-black gap-1.5"
					>
						<ShoppingCart className="h-3.5 w-3.5" />
						Add to Cart
					</Button>
				</div>
			</Link>

			{/* Content */}
			<div className="p-3 space-y-2">
				{/* Title */}
				<Link href={`/products/${product.id}`}>
					<h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug hover:text-primary transition-colors">
						{product.title}
					</h3>
				</Link>

				{/* Price */}
				<div className="flex items-baseline gap-2">
					<span className="font-bold text-lg text-foreground">
						GH₵{product.price.toLocaleString()}
					</span>
					{product.compareAtPrice && (
						<span className="text-xs text-muted-foreground line-through">
							GH₵{product.compareAtPrice.toLocaleString()}
						</span>
					)}
				</div>

				{/* Store/Seller & Chat */}
				<div className="flex items-center justify-between pt-2 border-t border-border/50">
					<Link
						href={`/stores/${product.storeId}`}
						className="text-xs text-muted-foreground hover:text-primary transition-colors truncate max-w-[60%] flex items-center gap-1"
					>
						<span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
						{product.store?.name || product.seller?.firstName}
					</Link>
					<Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary">
						<MessageCircle className="h-3 w-3" />
						Chat
					</Button>
				</div>
			</div>
		</div>
	);
}
