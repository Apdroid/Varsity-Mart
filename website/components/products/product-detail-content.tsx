"use client";

import { MakeOfferModal } from "@/components/offers/make-offer-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    HandCoins,
    Heart,
    MessageCircle,
    Share2,
    Shield,
    Star,
    Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mockProducts } from "@/data/products/products";
import type { Product } from "@/types/models";

interface ProductDetailContentProps {
	productId: string;
	initialProduct?: Product;
}

export function ProductDetailContent({ productId, initialProduct }: ProductDetailContentProps) {
	// Transform API response format to component format
	const product: Product = initialProduct ? {
		id: initialProduct.id,
		title: initialProduct.title,
		description: initialProduct.description,
		price: initialProduct.price,
		compareAtPrice: initialProduct.originalPrice,
		images: initialProduct.images,
		category: { 
			id: "", 
			name: initialProduct.category, 
			slug: initialProduct.category.toLowerCase() 
		},
		condition: initialProduct.condition,
		quantity: initialProduct.stock || 1,
		status: "active" as const,
		sellerId: initialProduct.seller?.id || "",
		seller: {
			id: initialProduct.seller?.id || "",
			email: "",
			firstName: initialProduct.seller?.name?.split(" ")[0] || "",
			lastName: initialProduct.seller?.name?.split(" ")[1] || "",
			role: "seller" as const,
			isEmailVerified: false,
			isPhoneVerified: false,
			kycStatus: "pending" as const,
			createdAt: "",
			updatedAt: "",
		},
		likesCount: initialProduct.likes || 0,
		isLiked: initialProduct.isLiked || false,
		storeId: "",
		tags: initialProduct.badges || [],
		createdAt: initialProduct.createdAt || "",
		updatedAt: initialProduct.updatedAt || "",
	} : mockProducts.find((p) => p.id === productId) || mockProducts[0];
	
	const [selectedImage, setSelectedImage] = useState(0);
	const [isLiked, setIsLiked] = useState(product.isLiked || false);
	const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false);
	const { addItem } = useCartStore();

	const discount = product.compareAtPrice
		? Math.round(
				((product.compareAtPrice - product.price) /
					product.compareAtPrice) *
					100,
			)
		: 0;

	const handleAddToCart = () => {
		addItem({
			productId: product.id,
			...product,
			quantity: 1,
			price: product.price,
		});
	};

	const handleSubmitOffer = (amount: number, message?: string) => {
		console.log("[v0] Offer submitted:", { amount, message });
		alert(
			`Offer submitted! You offered GH₵${amount.toLocaleString()}${message ? `\nMessage: ${message}` : ""}`,
		);
	};

	return (
		<>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<ChevronRight className="h-4 w-4" />
					<Link href="/products" className="hover:text-foreground">
						Products
					</Link>
					<ChevronRight className="h-4 w-4" />
					<Link
						href={`/search?category=${product.category.slug}`}
						className="hover:text-foreground"
					>
						{product.category.name}
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-foreground truncate max-w-[200px]">
						{product.title}
					</span>
				</nav>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Images */}
					<div className="space-y-4">
						<div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
							<Image
								src={
									product.images[selectedImage] ||
									"/placeholder.svg?height=600&width=600&query=product"
								}
								alt={product.title}
								fill
								className="object-cover"
							/>
							{discount > 0 && (
								<Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm">
									{discount}% OFF
								</Badge>
							)}

							{/* Navigation Arrows */}
							{product.images.length > 1 && (
								<>
									<Button
										variant="secondary"
										size="icon"
										className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
										onClick={() =>
											setSelectedImage((prev) =>
												prev === 0 ? product.images.length - 1 : prev - 1,
											)
										}
									>
										<ChevronLeft className="h-5 w-5" />
									</Button>
									<Button
										variant="secondary"
										size="icon"
										className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
										onClick={() =>
											setSelectedImage((prev) =>
												prev === product.images.length - 1 ? 0 : prev + 1,
											)
										}
									>
										<ChevronRight className="h-5 w-5" />
									</Button>
								</>
							)}
						</div>

						{/* Thumbnails */}
						{product.images.length > 1 && (
							<div className="flex gap-2 overflow-x-auto pb-2">
								{product.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={cn(
											"relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
											selectedImage === index
												? "border-primary"
												: "border-transparent",
										)}
									>
										<Image
											src={
												image ||
												"/placeholder.svg?height=80&width=80&query=product thumbnail"
											}
											alt={`${product.title} ${index + 1}`}
											fill
											className="object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="space-y-6">
						{/* Title & Actions */}
						<div>
							<div className="flex items-start justify-between gap-4 mb-2">
								<h1 className="text-2xl font-bold text-foreground text-balance">
									{product.title}
								</h1>
								<div className="flex gap-2 shrink-0">
									<Button
										variant="outline"
										size="icon"
										className={cn(
											"h-10 w-10 bg-transparent",
											isLiked && "text-red-500 border-red-500",
										)}
										onClick={() => setIsLiked(!isLiked)}
									>
										<Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="h-10 w-10 bg-transparent"
									>
										<Share2 className="h-5 w-5" />
									</Button>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="secondary" className="capitalize">
									{product.condition.replace("-", " ")}
								</Badge>
								<Badge variant="outline" className="bg-transparent">
									{product.category.name}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{product.likesCount} likes
								</span>
							</div>
						</div>

						{/* Price */}
						<div className="flex items-baseline gap-3">
							<span className="text-3xl font-bold text-foreground">
								GH₵{product.price.toLocaleString()}
							</span>
							{product.compareAtPrice && (
								<span className="text-lg text-muted-foreground line-through">
									GH₵{product.compareAtPrice.toLocaleString()}
								</span>
							)}
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col gap-3">
							<div className="flex gap-3">
								<Button
									size="lg"
									className="flex-1 bg-primary/90 hover:bg-primary gap-2"
									onClick={handleAddToCart}
								>
									Buy Now at GH₵{product.price.toLocaleString()}
								</Button>
								<Button size="lg" variant="outline" className="gap-2 bg-transparent">
									<MessageCircle className="h-5 w-5" />
								</Button>
							</div>
							<Button
								size="lg"
								variant="outline"
								className="w-full gap-2 border-2 border-primary text-primary/80 hover:bg-primary/10 hover:text-primary "
								onClick={() => setIsMakeOfferOpen(true)}
							>
								<HandCoins className="h-5 w-5" />
								Make an Offer
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="flex flex-wrap gap-4 py-4 border-y border-border">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Shield className="h-4 w-4 text-primary/90" />
								<span>Escrow Protection</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Truck className="h-4 w-4 text-primary/90" />
								<span>Campus Delivery</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Check className="h-4 w-4 text-primary/90" />
								<span>Verified Seller</span>
							</div>
						</div>

						{/* Seller Info */}
						<div className="p-4 rounded-xl border border-border bg-card">
							<div className="flex items-center gap-4">
								<Avatar className="h-14 w-14">
									<AvatarImage
										src={product.store?.logo || product.seller.avatar}
									/>
									<AvatarFallback>{product.seller.firstName[0]}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<Link
										href={product.storeId ? `/stores/${product.storeId}` : "#"}
										className="font-semibold text-foreground hover:text-primary/90 transition-colors"
									>
										{product.store?.name ||
											`${product.seller.firstName} ${product.seller.lastName}`}
									</Link>
									{product.store && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
												<span>{product.store.rating}</span>
											</div>
											<span>•</span>
											<span>{product.store.reviewsCount} reviews</span>
											<span>•</span>
											<span>{product.store.productsCount} products</span>
										</div>
									)}
									{product.store?.isVerified && (
										<Badge
											variant="secondary"
											className="mt-1 text-xs bg-primary/10 text-primary"
										>
											Verified Store
										</Badge>
									)}
								</div>
								<Button variant="outline" size="sm" asChild className="bg-transparent">
									<Link href={`/stores/${product.storeId}`}>View Store</Link>
								</Button>
							</div>
						</div>

						{/* Description */}
						<div>
							<h2 className="font-semibold text-foreground mb-3">Description</h2>
							<p className="text-muted-foreground whitespace-pre-line leading-relaxed">
								{product.description}
							</p>
						</div>

						{/* Tags */}
						{product.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{product.tags.map((tag) => (
									<Link
										key={tag}
										href={`/search?q=${tag}`}
										className="text-sm text-muted-foreground hover:text-primary/90 transition-colors"
									>
										#{tag}
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<MakeOfferModal
				product={product}
				open={isMakeOfferOpen}
				onOpenChange={setIsMakeOfferOpen}
				onSubmit={handleSubmitOffer}
			/>
		</>
	);
}
