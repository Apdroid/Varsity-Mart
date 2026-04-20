"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";

interface ProductCardProps {
	product: Product;
	className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
	const discount = product.compareAtPrice && product.compareAtPrice > product.price
		? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
		: 0;

	const badge = product.tags?.[0];
	const sellerName = product.seller?.fullName ?? product.seller?.firstName ?? "Seller";

	return (
		<div
			className={cn(
				"group overflow-hidden transition-all duration-200",
				"hover:shadow-[var(--sh-md)]",
				className,
			)}
			style={{
				background: "var(--surface)",
				border: "1px solid var(--ink-4)",
				borderRadius: "var(--r)",
				boxShadow: "var(--sh-sm)",
			}}
		>
			{/* Image */}
			<Link
				href={`/products/${product.id}`}
				className="block aspect-square relative overflow-hidden"
				style={{ background: "var(--bg)" }}
			>
				<Image
					src={product.images[0] || "/placeholder.svg"}
					alt={product.title}
				fill
				sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
				className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
				/>

				{/* Badges */}
				<div className="absolute top-2 left-2 flex flex-col gap-1">
					{discount > 0 && (
						<span
							className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
							style={{ background: "var(--orange)" }}
						>
							-{discount}%
						</span>
					)}
					{badge && badge !== "hot" && (
						<span className="vm-badge text-[10px]">{badge}</span>
					)}
					{badge === "hot" && (
						<span
							className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
							style={{ background: "var(--orange-dark)" }}
						>
							🔥 HOT
						</span>
					)}
				</div>

				{/* Wishlist */}
				<Button
					size="icon"
					variant="ghost"
					className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
					style={{ background: "rgba(255,255,255,0.9)" }}
					aria-label="Add to wishlist"
				>
					<Heart
						className={cn("h-3.5 w-3.5", product.isLiked && "fill-current")}
						style={{ color: product.isLiked ? "var(--orange)" : "var(--ink-3)" }}
					/>
				</Button>
			</Link>

			{/* Content */}
			<div className="p-2.5 space-y-1.5">
				<Link href={`/products/${product.id}`}>
					<h3
						className="font-medium text-[13px] leading-snug line-clamp-2 transition-colors group-hover:text-[var(--orange)]"
						style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }}
					>
						{product.title}
					</h3>
				</Link>

				<div className="flex items-baseline gap-1.5">
					<span
						className="font-semibold text-sm font-price"
						style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}
					>
						GH₵{Number(product.price).toLocaleString()}
					</span>
					{product.compareAtPrice && product.compareAtPrice > product.price && (
						<span
							className="text-[11px] line-through"
							style={{ color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}
						>
							GH₵{Number(product.compareAtPrice).toLocaleString()}
						</span>
					)}
				</div>

				<div
					className="flex items-center justify-between pt-2"
					style={{ borderTop: "1px solid var(--ink-4)" }}
				>
					<Link
						href={product.storeId ? `/stores/${product.storeId}` : `/products?seller=${product.sellerId}`}
						className="text-[11px] truncate max-w-[58%] transition-colors"
						style={{ color: "var(--ink-3)", fontFamily: "var(--font-body)" }}
					>
						{product.store?.name || sellerName}
					</Link>
					<Button
						size="sm"
						className="h-6 text-[11px] gap-1 px-2 rounded-[calc(var(--r)-2px)] font-medium"
						style={{
							background: "var(--orange-dim)",
							color: "var(--orange-dark)",
							border: "1px solid var(--orange-border)",
						}}
					>
						<ShoppingCart className="h-3 w-3" />
						Add
					</Button>
				</div>
			</div>
		</div>
	);
}
