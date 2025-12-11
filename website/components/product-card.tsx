"use client";

import { Heart, MessageCircle } from "lucide-react";
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
				"group relative border border-border bg-transparent hover:bg-card  overflow-hidden  hover:shadow-md transition-normal transition-shadow",
				className,
			)}
		>
			{/* Image */}
			<Link
				href={`/products/${product.id}`}
				className="block aspect-square relative overflow-hidden"
			>
				<Image
					src={
						product.images[0] || "/placeholder.svg?height=300&width=300&query=product"
					}
					alt={product.title}
					fill
					className="object-cover transition-transform duration-300 "
				/>
				{discount > 0 && (
					<Badge className="absolute top-2 left-2 bg-red-500 text-white">
						{discount}% OFF
					</Badge>
				)}
				{product.condition !== "new" && (
					<Badge variant="secondary" className="absolute top-2 right-2 capitalize">
						{product.condition}
					</Badge>
				)}
			</Link>

			{/* Quick Actions */}
			<div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<Button
					size="icon"
					variant="secondary"
					className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
				>
					<Heart
						className={cn("h-4 w-4", product.isLiked && "fill-red-500 text-red-500")}
					/>
				</Button>
			</div>

			{/* Content */}
			<div className="p-3">
				<Link href={`/products/${product.id}`}>
					<h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug mb-1 hover:text-primary transition-colors">
						{product.title}
					</h3>
				</Link>

				<div className="flex items-center gap-2 mb-2">
					<span className="font-bold text-lg text-foreground">
						GH₵{product.price.toLocaleString()}
					</span>
					{product.compareAtPrice && (
						<span className="text-sm text-muted-foreground line-through">
							GH₵{product.compareAtPrice.toLocaleString()}
						</span>
					)}
				</div>

				<div className="flex items-center justify-between">
					<Link
						href={`/stores/${product.storeId}`}
						className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-[60%]"
					>
						{product.store?.name || product.seller?.firstName}
					</Link>
					<Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
						<MessageCircle className="h-3 w-3" />
						Chat
					</Button>
				</div>
			</div>
		</div>
	);
}
