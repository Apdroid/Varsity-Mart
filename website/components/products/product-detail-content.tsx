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

const mockProduct: Product = {
	id: "1",
	title: 'MacBook Pro 13" M2 2023 - Perfect Condition with Box & Accessories',
	description: `Selling my MacBook Pro 13" with M2 chip in excellent condition. Only used for 6 months for school work.

Specs:
- Apple M2 chip with 8-core CPU and 10-core GPU
- 16GB unified memory
- 512GB SSD storage
- 13.3-inch Retina display
- macOS Sonoma installed

Includes:
- Original box
- 67W USB-C Power Adapter
- USB-C to MagSafe 3 Cable
- AppleCare+ until December 2025

Battery health: 98%
Cycle count: 45

Reason for selling: Upgraded to 16" model for work.

Can meet on campus for inspection. Serious buyers only.`,
	price: 4500,
	compareAtPrice: 5200,
	images: [
		"/silver-macbook-on-desk.png",
		"/macbook-keyboard.jpg",
		"/macbook-side-view.jpg",
		"/macbook-box-accessories.jpg",
	],
	category: { id: "1", name: "Electronics", slug: "electronics" },
	subcategory: "Laptops",
	condition: "like-new",
	quantity: 1,
	status: "active",
	sellerId: "1",
	seller: {
		id: "1",
		email: "john@campus.edu",
		firstName: "John",
		lastName: "Mensah",
		avatar: "/male-student-portrait.png",
		role: "seller",
		isEmailVerified: true,
		isPhoneVerified: true,
		kycStatus: "approved",
		createdAt: "2023-01-15",
		updatedAt: "2024-01-01",
	},
	storeId: "store-1",
	store: {
		id: "store-1",
		name: "TechDeals GH",
		description: "Premium tech at student prices",
		logo: "/tech-store-logo.png",
		ownerId: "1",
		owner: {} as any,
		rating: 4.8,
		reviewsCount: 127,
		productsCount: 45,
		isVerified: true,
		isOpen: true,
		createdAt: "",
		updatedAt: "",
	},
	likesCount: 24,
	isLiked: false,
	tags: ["laptop", "apple", "macbook", "m2"],
	createdAt: "2024-01-10",
	updatedAt: "2024-01-10",
};

interface ProductDetailContentProps {
	productId: string;
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [isLiked, setIsLiked] = useState(mockProduct.isLiked);
	const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false);
	const { addItem } = useCartStore();

	const discount = mockProduct.compareAtPrice
		? Math.round(
				((mockProduct.compareAtPrice - mockProduct.price) /
					mockProduct.compareAtPrice) *
					100,
			)
		: 0;

	const handleAddToCart = () => {
		addItem({
			productId: mockProduct.id,
			...mockProduct,
			quantity: 1,
			price: mockProduct.price,
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
						href={`/search?category=${mockProduct.category.slug}`}
						className="hover:text-foreground"
					>
						{mockProduct.category.name}
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-foreground truncate max-w-[200px]">
						{mockProduct.title}
					</span>
				</nav>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Images */}
					<div className="space-y-4">
						<div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
							<Image
								src={
									mockProduct.images[selectedImage] ||
									"/placeholder.svg?height=600&width=600&query=product"
								}
								alt={mockProduct.title}
								fill
								className="object-cover"
							/>
							{discount > 0 && (
								<Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm">
									{discount}% OFF
								</Badge>
							)}

							{/* Navigation Arrows */}
							{mockProduct.images.length > 1 && (
								<>
									<Button
										variant="secondary"
										size="icon"
										className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
										onClick={() =>
											setSelectedImage((prev) =>
												prev === 0 ? mockProduct.images.length - 1 : prev - 1,
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
												prev === mockProduct.images.length - 1 ? 0 : prev + 1,
											)
										}
									>
										<ChevronRight className="h-5 w-5" />
									</Button>
								</>
							)}
						</div>

						{/* Thumbnails */}
						{mockProduct.images.length > 1 && (
							<div className="flex gap-2 overflow-x-auto pb-2">
								{mockProduct.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={cn(
											"relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
											selectedImage === index
												? "border-emerald-600"
												: "border-transparent",
										)}
									>
										<Image
											src={
												image ||
												"/placeholder.svg?height=80&width=80&query=product thumbnail"
											}
											alt={`${mockProduct.title} ${index + 1}`}
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
									{mockProduct.title}
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
									{mockProduct.condition.replace("-", " ")}
								</Badge>
								<Badge variant="outline" className="bg-transparent">
									{mockProduct.category.name}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{mockProduct.likesCount} likes
								</span>
							</div>
						</div>

						{/* Price */}
						<div className="flex items-baseline gap-3">
							<span className="text-3xl font-bold text-foreground">
								GH₵{mockProduct.price.toLocaleString()}
							</span>
							{mockProduct.compareAtPrice && (
								<span className="text-lg text-muted-foreground line-through">
									GH₵{mockProduct.compareAtPrice.toLocaleString()}
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
									Buy Now at GH₵{mockProduct.price.toLocaleString()}
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
										src={mockProduct.store?.logo || mockProduct.seller.avatar}
									/>
									<AvatarFallback>{mockProduct.seller.firstName[0]}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<Link
										href={mockProduct.storeId ? `/stores/${mockProduct.storeId}` : "#"}
										className="font-semibold text-foreground hover:text-primary/90 transition-colors"
									>
										{mockProduct.store?.name ||
											`${mockProduct.seller.firstName} ${mockProduct.seller.lastName}`}
									</Link>
									{mockProduct.store && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
												<span>{mockProduct.store.rating}</span>
											</div>
											<span>•</span>
											<span>{mockProduct.store.reviewsCount} reviews</span>
											<span>•</span>
											<span>{mockProduct.store.productsCount} products</span>
										</div>
									)}
									{mockProduct.store?.isVerified && (
										<Badge
											variant="secondary"
											className="mt-1 text-xs bg-emerald-100 text-emerald-700"
										>
											Verified Store
										</Badge>
									)}
								</div>
								<Button variant="outline" size="sm" asChild className="bg-transparent">
									<Link href={`/stores/${mockProduct.storeId}`}>View Store</Link>
								</Button>
							</div>
						</div>

						{/* Description */}
						<div>
							<h2 className="font-semibold text-foreground mb-3">Description</h2>
							<p className="text-muted-foreground whitespace-pre-line leading-relaxed">
								{mockProduct.description}
							</p>
						</div>

						{/* Tags */}
						{mockProduct.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{mockProduct.tags.map((tag) => (
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
				product={mockProduct}
				open={isMakeOfferOpen}
				onOpenChange={setIsMakeOfferOpen}
				onSubmit={handleSubmitOffer}
			/>
		</>
	);
}
