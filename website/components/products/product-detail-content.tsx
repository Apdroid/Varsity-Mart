"use client";

import { MakeOfferModal } from "@/components/offers/make-offer-modal";
import { RelatedProducts, MoreFromSeller, RecentlyViewed, trackProductView } from "@/components/products/related-products";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/hooks/queries/useCart";
import { useProduct, useLikeProduct } from "@/hooks/queries/useProducts";
import { useProductOffers, useCreateOffer } from "@/hooks/queries/useOffers";
import { useStartConversation } from "@/hooks/queries/useChat";
import { useAuth } from "@/hooks/queries/useAuth";
import { cn } from "@/lib/utils";
import type { Product, Offer } from "@/types/models";
import {
	BadgeCheck,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	HandCoins,
	Heart,
	Loader2,
	MessageCircle,
	Minus,
	Package,
	Plus,
	Share2,
	Shield,
	ShoppingCart,
	Star,
	Tag,
	Truck,
	Zap,
	AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ProductDetailContentProps {
	productId: string;
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
	const router = useRouter();
	const { data: productResponse, isLoading, error } = useProduct(productId);
	const { mutate: likeProduct, isPending: isLiking } = useLikeProduct();
	const { addItem, removeItem, isInCart, getQuantity, updateQuantity } = useCart();
	const { user, isAuthenticated } = useAuth();
	const { data: offersResponse } = useProductOffers(productId);
	const { mutate: createOffer, isPending: isCreatingOffer } = useCreateOffer();
	const { mutate: startConversation, isPending: isStartingChat } = useStartConversation();

	const [selectedImage, setSelectedImage] = useState(0);
	const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false);

	// Track this product as recently viewed
	useEffect(() => {
		trackProductView(productId);
	}, [productId]);

	// Find the current user's active offers on this product
	const myOffers: Offer[] = (offersResponse?.data as Offer[] || []).filter(
		(o: Offer) => o.buyerId === user?.id && (o.status === "pending" || o.status === "countered")
	);

	// Show loading skeleton
	if (isLoading) {
		return (
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid lg:grid-cols-2 gap-8">
					<div className="space-y-4">
						<Skeleton className="aspect-square rounded-xl" />
						<div className="flex gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="w-20 h-20 rounded-lg" />
							))}
						</div>
					</div>
					<div className="space-y-6">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</div>
			</div>
		);
	}

	// Show error
	if (error || !productResponse?.data) {
		return (
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
				<Alert>
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						Unable to load product details. Please try again later.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const product = productResponse.data;

	const discount = product.compareAtPrice
		? Math.round(
			((product.compareAtPrice - product.price) /
				product.compareAtPrice) *
			100,
		)
		: 0;

	const handleAddToCart = () => {
		addItem(product, 1);
	};

	const handleLikeProduct = () => {
		likeProduct(product.id);
	};

	const handleSubmitOffer = (amount: number, message?: string) => {
		createOffer({
			productId: product.id,
			data: { amount, message },
		});
	};

	const handleMessageSeller = () => {
		if (!isAuthenticated) {
			router.push("/auth/login");
			return;
		}
		startConversation(
			{ participantId: product.sellerId, initialMessage: `Hi! I'm interested in "${product.title}"` },
			{ onSuccess: () => router.push("/messages") },
		);
	};

	const productInCart = isInCart(product.id);
	const cartQuantity = getQuantity(product.id);

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
											product.isLiked && "text-red-500 border-red-500",
										)}
										onClick={handleLikeProduct}
										disabled={isLiking}
									>
										<Heart className={cn("h-5 w-5", product.isLiked && "fill-current")} />
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
								{productInCart ? (
									<div className="flex-1 flex items-center h-12 rounded-lg border border-primary bg-primary/5">
										<Button
											variant="ghost"
											size="icon"
											className="h-12 w-12 rounded-r-none text-primary hover:bg-primary/10"
											onClick={() => {
												if (cartQuantity <= 1) removeItem(product.id);
												else updateQuantity(product.id, cartQuantity - 1);
											}}
										>
											<Minus className="h-4 w-4" />
										</Button>
										<div className="flex-1 flex items-center justify-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span className="font-semibold text-primary text-sm">
												In Cart ({cartQuantity})
											</span>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-12 w-12 rounded-l-none text-primary hover:bg-primary/10"
											onClick={() => updateQuantity(product.id, cartQuantity + 1)}
											disabled={cartQuantity >= product.quantity}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								) : (
									<Button
										size="lg"
										className="flex-1 bg-primary hover:bg-primary/90 gap-2 h-12 text-base font-semibold shadow-lg shadow-primary/20"
										onClick={handleAddToCart}
									>
										<ShoppingCart className="h-5 w-5" />
										Add to Cart
									</Button>
								)}
								<Button
									size="lg"
									variant="outline"
									className="gap-2 bg-transparent h-12 w-12"
									title="Message Seller"
									onClick={handleMessageSeller}
									disabled={isStartingChat}
								>
									{isStartingChat ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : (
										<MessageCircle className="h-5 w-5" />
									)}
								</Button>
							</div>

							{/* Existing Offers from Current User */}
							{myOffers.length > 0 && (
								<div className="space-y-2">
									{myOffers.map((offer) => (
										<div
											key={offer.id}
											className="flex items-center gap-3 p-3 rounded-xl border bg-muted/50 border-border"
										>
											<div className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-muted">
												{offer.status === "pending" ? (
													<Clock className="h-4 w-4 text-muted-foreground" />
												) : (
													<HandCoins className="h-4 w-4 text-muted-foreground" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">
													Your offer: GH₵{offer.amount.toLocaleString()}
												</p>
												<p className="text-[11px] text-muted-foreground">
													{offer.status === "pending"
														? "Waiting for seller response"
														: `Seller countered with GH₵${offer.counterAmount?.toLocaleString()}`}
												</p>
											</div>
											<Badge
												variant="secondary"
												className={cn(
													"text-[10px] capitalize shrink-0",
													offer.status === "pending" && "bg-amber-500/10 text-amber-600",
													offer.status === "countered" && "bg-blue-500/10 text-blue-600",
												)}
											>
												{offer.status}
											</Badge>
										</div>
									))}
								</div>
							)}

							{/* Enhanced Make Offer Button */}
							<Button
								size="lg"
								variant="outline"
								className="w-full gap-3 h-14 border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5 group relative overflow-hidden"
								onClick={() => setIsMakeOfferOpen(true)}
								disabled={isCreatingOffer}
							>
								<div className="absolute inset-0 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
								<div className="relative flex items-center gap-3">
									<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
										{isCreatingOffer ? (
											<Loader2 className="h-5 w-5 animate-spin" />
										) : (
											<HandCoins className="h-5 w-5" />
										)}
									</div>
									<div className="text-left">
										<p className="font-semibold text-sm">
											{myOffers.length > 0 ? "Make Another Offer" : "Make an Offer"}
										</p>
										<p className="text-[10px] text-muted-foreground">Negotiate a better price</p>
									</div>
								</div>
								<Tag className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
							</Button>
						</div>

						{/* Quick Info */}
						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
									<Package className="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Stock</p>
									<p className="text-sm font-semibold text-foreground">{product.quantity} available</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
									<Zap className="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Condition</p>
									<p className="text-sm font-semibold text-foreground capitalize">{product.condition.replace("-", " ")}</p>
								</div>
							</div>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-3 gap-2">
							<div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border text-center">
								<Shield className="h-5 w-5 text-foreground" />
								<span className="text-[10px] font-medium text-muted-foreground">Escrow Protection</span>
							</div>
							<div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border text-center">
								<Truck className="h-5 w-5 text-foreground" />
								<span className="text-[10px] font-medium text-muted-foreground">Campus Delivery</span>
							</div>
							<div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border text-center">
								<BadgeCheck className="h-5 w-5 text-foreground" />
								<span className="text-[10px] font-medium text-muted-foreground">Verified Seller</span>
							</div>
						</div>

						{/* Seller Info */}
						<div className="p-4 rounded-xl border border-border bg-card">
							<div className="flex items-center gap-4">
								<Avatar className="h-14 w-14">
									<AvatarImage
										src={product.store?.logo || product.seller.avatar}
									/>
									<AvatarFallback>
										{product.seller?.firstName?.[0] || product.seller.fullName?.[0] || "S"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<Link
										href={product.storeId ? `/stores/${product.storeId}` : "#"}
										className="font-semibold text-foreground hover:text-primary/90 transition-colors"
									>
										{product.store?.name ||
											(product.seller.firstName && product.seller.lastName
												? `${product.seller.firstName} ${product.seller.lastName}`
												: product.seller.fullName || "Unknown Seller")}
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

			{/* Related Products Sections */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
				{/* More from same seller */}
				<MoreFromSeller
					sellerId={product.sellerId}
					storeId={product.storeId}
					currentProductId={product.id}
					storeName={product.store?.name}
				/>

				{/* Related products by category */}
				<RelatedProducts currentProduct={product} />

				{/* Recently viewed */}
				<RecentlyViewed excludeProductId={product.id} />
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
