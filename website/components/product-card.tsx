"use client";

import { Heart, ShoppingCart } from "lucide-react";
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
				"group bg-card border border-border rounded-md overflow-hidden hover:border-primary/50 transition-colors",
				className,
			)}
		>
			{/* Image */}
			<Link
				href={`/products/${product.id}`}
				className="block aspect-square relative overflow-hidden bg-muted"
			>
				<Image
					src={product.images[0] || "/placeholder.svg"}
					alt={product.title}
					fill
					className="object-cover"
				/>

				{/* Badges */}
				<div className="absolute top-2 left-2 flex flex-col gap-1">
					{discount > 0 && (
						<Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
							-{discount}%
						</Badge>
					)}
					{product.condition !== "new" && (
						<Badge variant="secondary" className="capitalize text-xs px-1.5 py-0.5">
							{product.condition}
						</Badge>
					)}
				</div>

				{/* Wishlist */}
				<Button
					size="icon"
					variant="ghost"
					className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
				>
					<Heart
						className={cn("h-4 w-4", product.isLiked && "fill-red-500 text-red-500")}
					/>
				</Button>
			</Link>

			{/* Content */}
			<div className="p-3 space-y-2">
				<Link href={`/products/${product.id}`}>
					<h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
						{product.title}
					</h3>
				</Link>

				<div className="flex items-baseline gap-2">
					<span className="font-bold text-base">
						GH₵{product.price.toLocaleString()}
					</span>
					{product.compareAtPrice && (
						<span className="text-xs text-muted-foreground line-through">
							GH₵{product.compareAtPrice.toLocaleString()}
						</span>
					)}
				</div>

				<div className="flex items-center justify-between pt-2 border-t border-border">
					<Link
						href={`/stores/${product.storeId}`}
						className="text-xs text-muted-foreground hover:text-primary truncate max-w-[60%]"
					>
						{product.store?.name || product.seller?.firstName}
					</Link>
					<Button size="sm" variant="outline" className="h-7 text-xs gap-1">
						<ShoppingCart className="h-3 w-3" />
						Add
					</Button>
				</div>
			</div>
		</div>
	);
}
