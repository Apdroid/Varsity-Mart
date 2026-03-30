"use client";

import {
	ArrowLeft,
	BadgeCheck,
	Clock,
	Heart,
	Info,
	MapPin,
	Minus,
	Plus,
	Search,
	Share2,
	ShoppingBag,
	Star,
	Truck,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { RestaurantsCarousel } from "@/components/home/restaurants-carousel";
import { useRestaurant, useRestaurantMenu, useRestaurants } from "@/hooks/queries/useRestaurants";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/models";

interface CartItem {
	item: MenuItem;
	quantity: number;
}

interface RestaurantDetailContentProps {
	restaurantId: string;
	initialRestaurant?: any;
	initialMenu?: any;
}

export function RestaurantDetailContent({
	restaurantId,
	initialRestaurant,
	initialMenu,
}: RestaurantDetailContentProps) {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLiked, setIsLiked] = useState(false);

	const { data: restaurantData } = useRestaurant(restaurantId);
	const { data: menuData } = useRestaurantMenu(restaurantId);
	const { data: allRestaurantsData } = useRestaurants({ limit: 10 } as any);
	const nearbyRestaurants = ((allRestaurantsData as any)?.data ?? []).filter(
		(r: any) => r.id !== restaurantId,
	).slice(0, 10);

	// Use initial data if provided, otherwise use API data
	const rawRestaurant = initialRestaurant || (restaurantData as any)?.data;
	const restaurant = rawRestaurant
		? {
			id: rawRestaurant.id,
			name: rawRestaurant.name,
			description: rawRestaurant.description,
			logo: rawRestaurant.logo,
			banner: rawRestaurant.banner,
			cuisine: [rawRestaurant.category],
			rating: rawRestaurant.rating,
			reviewsCount: rawRestaurant.totalReviews,
			deliveryTime: rawRestaurant.deliveryTime,
			deliveryFee: rawRestaurant.deliveryFee,
			minOrder: rawRestaurant.minOrder,
			isOpen: rawRestaurant.isOpen,
			tags: rawRestaurant.tags || [],
			ownerId: rawRestaurant.owner?.id || "",
			owner: rawRestaurant.owner || {},
			location: {
				street: rawRestaurant.location || "Campus Area",
			},
			phone: rawRestaurant.phone || "+233 XX XXX XXXX",
		}
		: null;

	// Transform menu
	const rawMenu = initialMenu || (menuData as any)?.data;
	const menu = rawMenu?.categories
		? rawMenu.categories.map((cat: { name: string; items: any[] }) => ({
			category: cat.name,
			items: cat.items.map((item: any) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price,
				image: item.image,
				isAvailable: item.isAvailable,
				preparationTime: item.preparationTime,
				restaurantId: restaurantId,
				isPopular: item.isPopular || false,
			})),
		}))
		: [];

	const [activeCategory, setActiveCategory] = useState(menu[0]?.category || "");

	// Cart functions
	const addToCart = (item: MenuItem) => {
		setCart((prev) => {
			const existing = prev.find((c) => c.item.id === item.id);
			if (existing) {
				return prev.map((c) =>
					c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
				);
			}
			return [...prev, { item, quantity: 1 }];
		});
	};

	const removeFromCart = (itemId: string) => {
		setCart((prev) => {
			const existing = prev.find((c) => c.item.id === itemId);
			if (existing && existing.quantity > 1) {
				return prev.map((c) =>
					c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c,
				);
			}
			return prev.filter((c) => c.item.id !== itemId);
		});
	};

	const clearCart = () => setCart([]);
	const getItemQuantity = (itemId: string) => cart.find((c) => c.item.id === itemId)?.quantity || 0;
	const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
	const cartItemsCount = cart.reduce((acc, c) => acc + c.quantity, 0);

	// Filter menu items by search
	const filteredMenu = menu.map((category: { category: string; items: MenuItem[] }) => ({
		...category,
		items: category.items.filter((item: MenuItem) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description?.toLowerCase().includes(searchQuery.toLowerCase())
		),
	})).filter((category: { items: MenuItem[] }) => category.items.length > 0);

	// Get popular items
	const popularItems = menu.flatMap((cat: { items: MenuItem[] }) => cat.items).filter((item: any) => item.isPopular).slice(0, 6);

	if (!restaurant) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-10 h-10 rounded-full animate-pulse mx-auto mb-3" style={{ background: "var(--ink-4)" }} />
					<p style={{ color: "var(--ink-3)" }}>Loading restaurant…</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Banner */}
			<div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
				<Image
					src={restaurant.banner || "/placeholder.svg?height=400&width=800&query=restaurant food"}
					alt={restaurant.name}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

				{/* Top Navigation */}
				<div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
					<Link
						href="/restaurants"
						className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-background transition-all shadow-sm"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Back</span>
					</Link>

					<div className="flex items-center gap-2">
						<button
							onClick={() => setIsLiked(!isLiked)}
							className="flex items-center justify-center w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-all shadow-sm"
						>
							<Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
						</button>
						<button className="flex items-center justify-center w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-all shadow-sm">
							<Share2 className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>

			{/* Restaurant Info Card */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative -mt-20 sm:-mt-24 mb-6">
					<div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Logo */}
							<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-border bg-background overflow-hidden shrink-0 shadow-md -mt-12 sm:-mt-16">
								<Image
									src={restaurant.logo || "/placeholder.svg?height=96&width=96&query=restaurant logo"}
									alt={restaurant.name}
									width={96}
									height={96}
									className="object-cover w-full h-full"
								/>
							</div>

							{/* Info */}
							<div className="flex-1 min-w-0">
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h1 className="text-xl sm:text-2xl font-bold text-foreground">{restaurant.name}</h1>
											<BadgeCheck className="h-5 w-5 text-primary shrink-0" />
										</div>
										<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{restaurant.description}</p>
									</div>
									<Badge
										variant={restaurant.isOpen ? "default" : "secondary"}
										className={cn(
											"shrink-0",
											restaurant.isOpen ? "bg-green-500 hover:bg-green-500" : ""
										)}
									>
										{restaurant.isOpen ? "Open Now" : "Closed"}
									</Badge>
								</div>

								{/* Quick Stats */}
								<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
									<div className="flex items-center gap-1.5">
										<div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
											<Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
											<span className="font-semibold text-foreground">{restaurant.rating}</span>
										</div>
										<span className="text-muted-foreground">({restaurant.reviewsCount} reviews)</span>
									</div>
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<Clock className="h-4 w-4 text-primary" />
										<span>{restaurant.deliveryTime || "20-30 min"}</span>
									</div>
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<Truck className="h-4 w-4 text-primary" />
										<span>GH₵{restaurant.deliveryFee} delivery</span>
									</div>
								</div>

								{/* Tags */}
								{restaurant.tags && restaurant.tags.length > 0 && (
									<div className="flex flex-wrap gap-1.5 mt-3">
										{restaurant.tags.slice(0, 5).map((tag: string, idx: number) => (
											<span
												key={idx}
												className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Info Bar */}
						<div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="h-4 w-4 text-primary" />
								<span>{restaurant.location?.street || "Campus Area"}</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Info className="h-4 w-4 text-primary" />
								<span>Min order: GH₵{restaurant.minOrder}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Search Bar */}
				<div className="relative mb-6">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search menu items..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-11 rounded-xl"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Menu Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32 lg:pb-8">
					{/* Menu Section */}
					<div className="lg:col-span-2">
						{/* Category Tabs */}
						<div className="relative top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl sm:border">
							<div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
								{menu.map((category: { category: string }) => (
									<button
										key={category.category}
										onClick={() => setActiveCategory(category.category)}
										className={cn(
											"px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
											activeCategory === category.category
												? "bg-primary text-primary-foreground"
												: "text-muted-foreground hover:text-foreground hover:bg-muted"
										)}
									>
										{category.category}
									</button>
								))}
							</div>
						</div>

						{/* Menu Items */}
						<div className="mt-6 space-y-8">
							{(searchQuery ? filteredMenu : menu).map((category: { category: string; items: MenuItem[] }) => (
								<div
									key={category.category}
									id={category.category.toLowerCase().replace(/\s+/g, "-")}
									className={cn(
										!searchQuery && activeCategory !== category.category && "hidden lg:block"
									)}
								>
									<h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
										{category.category}
										<span className="text-sm font-normal text-muted-foreground">
											({category.items.length} items)
										</span>
									</h2>
									<div className="grid gap-3">
										{category.items.map((item: MenuItem) => {
											const quantity = getItemQuantity(item.id);
											return (
												<div
													key={item.id}
													className={cn(
														"flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors",
														!item.isAvailable && "opacity-60"
													)}
												>
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between gap-2 mb-1">
															<h3 className="font-semibold text-foreground">{item.name}</h3>
															{(item as any).isPopular && (
																<Badge variant="secondary" className="shrink-0 text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">
																	🔥 Popular
																</Badge>
															)}
														</div>
														<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
															{item.description}
														</p>
														<div className="flex items-center justify-between">
															<span className="text-lg font-bold text-foreground">
																GH₵{item.price.toFixed(2)}
															</span>
															{item.isAvailable ? (
																quantity > 0 ? (
																	<div className="flex items-center gap-1 bg-primary/10 rounded-full p-1">
																		<Button
																			size="icon"
																			variant="ghost"
																			className="h-8 w-8 rounded-full hover:bg-primary/20"
																			onClick={() => removeFromCart(item.id)}
																		>
																			<Minus className="h-4 w-4" />
																		</Button>
																		<span className="w-8 text-center font-semibold text-primary">{quantity}</span>
																		<Button
																			size="icon"
																			className="h-8 w-8 rounded-full"
																			onClick={() => addToCart(item)}
																		>
																			<Plus className="h-4 w-4" />
																		</Button>
																	</div>
																) : (
																	<Button
																		size="sm"
																		className="rounded-full gap-1.5 px-4"
																		onClick={() => addToCart(item)}
																	>
																		<Plus className="h-4 w-4" />
																		Add
																	</Button>
																)
															) : (
																<Badge variant="secondary">Unavailable</Badge>
															)}
														</div>
													</div>
													{item.image && (
														<div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted shrink-0">
															<Image
																src={item.image}
																alt={item.name}
																width={112}
																height={112}
																className="object-cover w-full h-full"
															/>
														</div>
													)}
												</div>
											);
										})}
									</div>
								</div>
							))}

							{searchQuery && filteredMenu.length === 0 && (
								<div className="text-center py-12">
									<p className="text-muted-foreground">No items found for "{searchQuery}"</p>
									<Button variant="link" onClick={() => setSearchQuery("")}>
										Clear search
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Desktop Cart Sidebar */}
					<div className="hidden lg:block">
						<div className="sticky top-20">
							<div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-bold text-lg text-foreground flex items-center gap-2">
										<ShoppingBag className="h-5 w-5 text-primary" />
										Your Order
									</h3>
									{cart.length > 0 && (
										<button
											onClick={clearCart}
											className="text-xs text-muted-foreground hover:text-destructive transition-colors"
										>
											Clear all
										</button>
									)}
								</div>

								{cart.length === 0 ? (
									<div className="text-center py-8">
										<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
											<ShoppingBag className="h-8 w-8 text-muted-foreground" />
										</div>
										<p className="text-muted-foreground text-sm">Your cart is empty</p>
										<p className="text-xs text-muted-foreground mt-1">Add items to get started</p>
									</div>
								) : (
									<>
										<div className="space-y-3 max-h-64 overflow-y-auto">
											{cart.map((cartItem) => (
												<div key={cartItem.item.id} className="flex items-center gap-3">
													<div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
														<Image
															src={cartItem.item.image || "/placeholder.svg"}
															alt={cartItem.item.name}
															width={48}
															height={48}
															className="object-cover w-full h-full"
														/>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-foreground truncate">{cartItem.item.name}</p>
														<p className="text-xs text-muted-foreground">GH₵{cartItem.item.price}</p>
													</div>
													<div className="flex items-center gap-1">
														<Button
															size="icon"
															variant="outline"
															className="h-7 w-7 rounded-full"
															onClick={() => removeFromCart(cartItem.item.id)}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="w-6 text-center text-sm font-medium">{cartItem.quantity}</span>
														<Button
															size="icon"
															className="h-7 w-7 rounded-full"
															onClick={() => addToCart(cartItem.item)}
														>
															<Plus className="h-3 w-3" />
														</Button>
													</div>
												</div>
											))}
										</div>

										<Separator className="my-4" />

										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">Subtotal</span>
												<span className="text-foreground">GH₵{cartTotal.toFixed(2)}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">Delivery</span>
												<span className="text-foreground">GH₵{restaurant.deliveryFee}</span>
											</div>
											<Separator className="my-2" />
											<div className="flex justify-between font-bold text-base">
												<span className="text-foreground">Total</span>
												<span className="text-primary">GH₵{(cartTotal + restaurant.deliveryFee).toFixed(2)}</span>
											</div>
										</div>

										<Button className="w-full mt-4 h-12 text-base font-semibold" size="lg">
											Proceed to Checkout
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Cart Button */}
			{cartItemsCount > 0 && (
				<div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
					<Sheet>
						<SheetTrigger asChild>
							<Button className="w-full h-14 text-base font-semibold gap-3" size="lg">
								<div className="flex items-center gap-2">
									<ShoppingBag className="h-5 w-5" />
									<span className="bg-primary-foreground text-primary px-2 py-0.5 rounded-full text-sm font-bold">
										{cartItemsCount}
									</span>
								</div>
								<span className="flex-1">View Cart</span>
								<span className="font-bold">GH₵{(cartTotal + restaurant.deliveryFee).toFixed(2)}</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
							<SheetHeader className="pb-4 border-b border-border">
								<div className="flex items-center justify-between">
									<SheetTitle className="flex items-center gap-2">
										<ShoppingBag className="h-5 w-5 text-primary" />
										Your Order
									</SheetTitle>
									<button
										onClick={clearCart}
										className="text-xs text-muted-foreground hover:text-destructive"
									>
										Clear all
									</button>
								</div>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto py-4 space-y-3">
								{cart.map((cartItem) => (
									<div key={cartItem.item.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
										<div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
											<Image
												src={cartItem.item.image || "/placeholder.svg"}
												alt={cartItem.item.name}
												width={64}
												height={64}
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-foreground truncate">{cartItem.item.name}</p>
											<p className="text-sm text-muted-foreground">GH₵{cartItem.item.price}</p>
										</div>
										<div className="flex items-center gap-2">
											<Button
												size="icon"
												variant="outline"
												className="h-8 w-8 rounded-full"
												onClick={() => removeFromCart(cartItem.item.id)}
											>
												<Minus className="h-3 w-3" />
											</Button>
											<span className="w-6 text-center font-semibold">{cartItem.quantity}</span>
											<Button
												size="icon"
												className="h-8 w-8 rounded-full"
												onClick={() => addToCart(cartItem.item)}
											>
												<Plus className="h-3 w-3" />
											</Button>
										</div>
									</div>
								))}
							</div>

							<div className="pt-4 border-t border-border space-y-4">
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Subtotal</span>
										<span className="text-foreground">GH₵{cartTotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Delivery Fee</span>
										<span className="text-foreground">GH₵{restaurant.deliveryFee}</span>
									</div>
									<Separator />
									<div className="flex justify-between font-bold text-lg">
										<span className="text-foreground">Total</span>
										<span className="text-primary">GH₵{(cartTotal + restaurant.deliveryFee).toFixed(2)}</span>
									</div>
								</div>

								<Button className="w-full h-14 text-base font-semibold" size="lg">
									Proceed to Checkout
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			)}

			{/* Similar Restaurants */}
			<section className="py-10 px-4 sm:px-6 lg:px-8 bg-muted/30 mt-8">
				<div className="mx-auto max-w-7xl">
					<RestaurantsCarousel
						restaurants={nearbyRestaurants}
						title="You Might Also Like"
						subtitle="Similar restaurants near you"
						viewAllLink="/restaurants"
						viewAllText="See All Restaurants"
					/>
				</div>
			</section>
		</div>
	);
}
