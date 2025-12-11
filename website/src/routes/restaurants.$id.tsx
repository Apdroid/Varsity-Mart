import type { ErrorComponentProps } from "@tanstack/react-router";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	BadgeCheck,
	Clock,
	Heart,
	MapPin,
	Minus,
	Moon,
	Phone,
	Plus,
	Search,
	ShoppingCart,
	Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/header";
import { MenuItemModal } from "@/components/menu-item-modal";
import { NotFound } from "@/components/NotFound.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type CartItem, useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/restaurants/$id")({
	component: RestaurantDetailPage,
	errorComponent: RestaurantErrorComponent,
	notFoundComponent: () => {
		return <NotFound>Post not found</NotFound>;
	},
});

function RestaurantErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />;
}

interface MenuItem {
	id: number;
	name: string;
	description: string;
	price: string;
	image: string;
	popular?: boolean;
	sizes?: { name: string; price: string }[];
	addOns?: { name: string; price: string }[];
	tags?: string[];
}

interface MenuCategory {
	category: string;
	items: MenuItem[];
}

const restaurants: Record<
	string,
	{
		id: number;
		name: string;
		verified: boolean;
		rating: number;
		reviews: number;
		deliveryTime: string;
		deliveryFee: string;
		tags: string[];
		nightShop: boolean;
		location: string;
		coordinates: { lat: number; lng: number };
		hours: string;
		minOrder: string;
		description: string;
		specialties: string[];
		cuisine: string;
		image: string;
		isOpen: boolean;
		freeDelivery: boolean;
		phone: string;
		menu: MenuCategory[];
	}
> = {
	"1": {
		id: 1,
		name: "Mama's Kitchen",
		verified: true,
		rating: 4.8,
		reviews: 342,
		deliveryTime: "25-35 min",
		deliveryFee: "GHC 8",
		tags: ["Fast Delivery", "Popular", "Student Favorite"],
		nightShop: true,
		location: "KNUST Main Gate",
		coordinates: { lat: 6.6745, lng: -1.5614 },
		hours: "8:00 AM - 10:00 PM",
		minOrder: "GHC 15",
		description:
			"Authentic local dishes prepared with love. Popular for our waakye and banku with tilapia.",
		specialties: ["Waakye", "Banku & Tilapia", "Jollof Rice", "Red Red"],
		cuisine: "Local Food",
		image: "/african-restaurant-kitchen-with-warm-lighting-and-.jpg",
		isOpen: true,
		freeDelivery: false,
		phone: "+233 24 123 4567",
		menu: [
			{
				category: "Popular",
				items: [
					{
						id: 1,
						name: "Waakye Special",
						description:
							"Rice and beans with spaghetti, gari, egg, wele, and shito",
						price: "GHC 18",
						image: "/waakye-ghanaian-rice-beans-dish-colorful-plate.jpg",
						popular: true,
						tags: ["Spicy", "Filling"],
						sizes: [
							{ name: "Regular", price: "GHC 18" },
							{ name: "Large", price: "GHC 25" },
						],
						addOns: [
							{ name: "Extra Egg", price: "+GHC 3" },
							{ name: "Extra Wele", price: "+GHC 5" },
							{ name: "Fried Fish", price: "+GHC 8" },
						],
					},
					{
						id: 2,
						name: "Banku & Tilapia",
						description:
							"Fresh tilapia with banku, pepper sauce and vegetables",
						price: "GHC 45",
						image: "/banku-tilapia-ghanaian-grilled-fish-dish.jpg",
						popular: true,
						tags: ["Grilled", "Protein Rich"],
						sizes: [
							{ name: "Regular", price: "GHC 45" },
							{ name: "Large", price: "GHC 60" },
						],
						addOns: [
							{ name: "Extra Pepper", price: "+GHC 2" },
							{ name: "Extra Fish", price: "+GHC 20" },
							{ name: "Kenkey", price: "+GHC 5" },
						],
					},
				],
			},
			{
				category: "Main Course",
				items: [
					{
						id: 3,
						name: "Jollof Rice",
						description: "Smoky party jollof rice with chicken",
						price: "GHC 30",
						image: "/jollof-rice-west-african-dish-chicken.jpg",
						tags: ["Smoky", "Popular"],
						sizes: [
							{ name: "Regular", price: "GHC 30" },
							{ name: "Large", price: "GHC 40" },
						],
						addOns: [
							{ name: "Extra Chicken", price: "+GHC 10" },
							{ name: "Coleslaw", price: "+GHC 5" },
							{ name: "Plantain", price: "+GHC 5" },
						],
					},
					{
						id: 4,
						name: "Fufu & Light Soup",
						description: "Traditional fufu with goat meat light soup",
						price: "GHC 35",
						image: "/fufu-light-soup-ghanaian-traditional.jpg",
						tags: ["Traditional", "Hearty"],
						sizes: [
							{ name: "Regular", price: "GHC 35" },
							{ name: "Large", price: "GHC 50" },
						],
						addOns: [
							{ name: "Extra Meat", price: "+GHC 12" },
							{ name: "Mushrooms", price: "+GHC 5" },
						],
					},
				],
			},
			{
				category: "Sides",
				items: [
					{
						id: 5,
						name: "Kelewele",
						description: "Spiced fried plantains",
						price: "GHC 12",
						image: "/kelewele-spiced-fried-plantains-ghanaian.jpg",
						tags: ["Spicy", "Snack"],
						sizes: [
							{ name: "Small", price: "GHC 12" },
							{ name: "Large", price: "GHC 18" },
						],
					},
					{
						id: 6,
						name: "Fried Yam",
						description: "Crispy fried yam with pepper sauce",
						price: "GHC 15",
						image: "/fried-yam-african-side-dish.jpg",
						tags: ["Crispy"],
						sizes: [
							{ name: "Regular", price: "GHC 15" },
							{ name: "Large", price: "GHC 22" },
						],
					},
				],
			},
		],
	},
	"2": {
		id: 2,
		name: "Burger Hub",
		verified: true,
		rating: 4.6,
		reviews: 256,
		deliveryTime: "20-30 min",
		deliveryFee: "GHC 5",
		tags: ["Fast Food", "Popular"],
		nightShop: false,
		location: "Commercial Area",
		coordinates: { lat: 6.685, lng: -1.572 },
		hours: "10:00 AM - 9:00 PM",
		minOrder: "GHC 20",
		description:
			"Juicy burgers and crispy fries. The best fast food on campus!",
		specialties: ["Classic Burger", "Cheese Fries", "Milkshakes"],
		cuisine: "Fast Food",
		image: "/burger-restaurant-modern-interior-with-neon-lights.jpg",
		isOpen: true,
		freeDelivery: true,
		phone: "+233 24 987 6543",
		menu: [
			{
				category: "Popular",
				items: [
					{
						id: 10,
						name: "Classic Cheeseburger",
						description:
							"Beef patty with cheese, lettuce, tomato, and special sauce",
						price: "GHC 28",
						image: "/classic-cheeseburger-fries.png",
						popular: true,
						tags: ["Bestseller"],
						sizes: [
							{ name: "Single", price: "GHC 28" },
							{ name: "Double", price: "GHC 40" },
						],
						addOns: [
							{ name: "Extra Cheese", price: "+GHC 4" },
							{ name: "Bacon", price: "+GHC 6" },
							{ name: "Avocado", price: "+GHC 5" },
						],
					},
					{
						id: 11,
						name: "Loaded Fries",
						description:
							"Crispy fries with cheese sauce, bacon bits, and jalapeños",
						price: "GHC 22",
						image: "/loaded-cheese-fries-with-toppings.jpg",
						popular: true,
						tags: ["Shareable"],
						sizes: [
							{ name: "Regular", price: "GHC 22" },
							{ name: "Large", price: "GHC 32" },
						],
					},
				],
			},
			{
				category: "Burgers",
				items: [
					{
						id: 12,
						name: "BBQ Bacon Burger",
						description: "Smoky BBQ sauce with crispy bacon and onion rings",
						price: "GHC 35",
						image: "/bbq-bacon-burger-with-onion-rings.jpg",
						tags: ["Smoky", "Premium"],
						sizes: [
							{ name: "Single", price: "GHC 35" },
							{ name: "Double", price: "GHC 48" },
						],
					},
					{
						id: 13,
						name: "Veggie Burger",
						description: "Plant-based patty with fresh vegetables",
						price: "GHC 25",
						image: "/veggie-burger-fresh-vegetables.jpg",
						tags: ["Vegetarian", "Healthy"],
						sizes: [{ name: "Regular", price: "GHC 25" }],
					},
				],
			},
			{
				category: "Drinks",
				items: [
					{
						id: 14,
						name: "Chocolate Milkshake",
						description: "Rich and creamy chocolate milkshake",
						price: "GHC 18",
						image: "/chocolate-milkshake-whipped-cream.jpg",
						tags: ["Cold", "Sweet"],
						sizes: [
							{ name: "Regular", price: "GHC 18" },
							{ name: "Large", price: "GHC 25" },
						],
					},
				],
			},
		],
	},
};

function RestaurantDetailPage() {
	const { id } = Route.useParams();
	console.log("id:", id);
	const restaurant = restaurants[id];

	const [activeCategory, setActiveCategory] = useState("Popular");
	const [searchQuery, setSearchQuery] = useState("");
	const [isFavorite, setIsFavorite] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		items: cartItems,
		addItem,
		totalItems,
		totalPrice,
		updateQuantity,
	} = useCart();

	if (!restaurant) {
		return (
			<div className="min-h-screen bg-slate-50">
				<Navbar />
				<main className="max-w-6xl mx-auto px-4 py-16 text-center">
					<h1 className="text-2xl font-bold text-blue-900 mb-4">
						Restaurant not found
					</h1>
					<Link to="/restaurants">
						<Button className="bg-blue-600 hover:bg-blue-700">
							Back to Restaurants
						</Button>
					</Link>
				</main>
				<Footer />
			</div>
		);
	}

	const filteredMenu = restaurant.menu.map((category) => ({
		...category,
		items: category.items.filter(
			(item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase()),
		),
	}));

	const currentCategory =
		filteredMenu.find((cat) => cat.category === activeCategory) ||
		filteredMenu[0];

	const handleAddToCart = (
		itemId: number,
		quantity: number,
		size: string,
		addOns: string[],
		specialInstructions: string,
		totalPrice: number,
	) => {
		const menuItem = restaurant.menu
			.flatMap((cat) => cat.items)
			.find((item) => item.id === itemId);
		if (!menuItem) return;

		const cartItem: CartItem = {
			id: itemId,
			name: menuItem.name,
			price: menuItem.price,
			image: menuItem.image,
			quantity,
			size,
			addOns,
			specialInstructions,
			totalPrice,
			restaurantId: id,
			restaurantName: restaurant.name,
		};

		addItem(cartItem);
	};

	const getItemQuantityInCart = (itemId: number) => {
		return cartItems
			.filter((item) => item.id === itemId)
			.reduce((sum, item) => sum + item.quantity, 0);
	};

	const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.6668736098!2d${restaurant.coordinates.lng}!3d${restaurant.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(restaurant.name)}!5e0!3m2!1sen!2sgh!4v1234567890`;

	return (
		<div className="min-h-screen bg-slate-50">
			<Navbar />

			<main>
				{/* Hero Header */}
				<motion.div
					className="relative h-64 md:h-80 bg-slate-900"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4 }}
				>
					<img
						src={
							restaurant.image ||
							"/placeholder.svg?height=320&width=1200&query=restaurant interior"
						}
						alt={restaurant.name}
						className="w-full h-full object-cover opacity-70"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

					{/* Navigation */}
					<div className="absolute top-4 left-4 right-4 flex justify-between items-center">
						<Link to="/restaurants">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="secondary"
									size="icon"
									className="rounded-full bg-white/90 backdrop-blur-sm"
								>
									<ArrowLeft className="w-5 h-5" />
								</Button>
							</motion.div>
						</Link>
						<div className="flex gap-2">
							{restaurant.isOpen && (
								<Badge className="bg-green-500 hover:bg-green-500 text-white">
									Open Now
								</Badge>
							)}
							{restaurant.verified && (
								<Badge className="bg-blue-600 hover:bg-blue-600 text-white flex items-center gap-1">
									<BadgeCheck className="w-3 h-3" /> Verified
								</Badge>
							)}
						</div>
					</div>

					{/* Restaurant Info */}
					<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<div className="flex items-center gap-2 mb-2">
								<h1 className="text-3xl md:text-4xl font-bold">
									{restaurant.name}
								</h1>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setIsFavorite(!isFavorite)}
								>
									<Heart
										className={`w-6 h-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
									/>
								</motion.button>
							</div>
							<p className="text-white/80 text-sm mb-3">{restaurant.cuisine}</p>
						</motion.div>
					</div>
				</motion.div>

				{/* Stats Bar */}
				<motion.div
					className="bg-white border-b"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div className="max-w-6xl mx-auto px-4 py-4">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-1">
									<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
									<span className="font-bold">{restaurant.rating}</span>
									<span className="text-muted-foreground text-sm">
										({restaurant.reviews} reviews)
									</span>
								</div>
								<div className="flex items-center gap-1 text-muted-foreground">
									<Clock className="w-4 h-4" />
									<span>{restaurant.deliveryTime}</span>
								</div>
								<div className="text-muted-foreground">
									{restaurant.freeDelivery ? (
										<span className="text-green-600 font-medium">
											Free Delivery
										</span>
									) : (
										<span>{restaurant.deliveryFee} Delivery</span>
									)}
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{restaurant.tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="bg-blue-50 text-blue-700"
									>
										{tag}
									</Badge>
								))}
								{restaurant.nightShop && (
									<Badge className="bg-indigo-600 hover:bg-indigo-600 text-white">
										<Moon className="w-3 h-3 mr-1" /> Night Shop
									</Badge>
								)}
							</div>
						</div>
					</div>
				</motion.div>

				<div className="max-w-6xl mx-auto px-4 py-8">
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Left Column - Info & Menu */}
						<div className="lg:col-span-2 space-y-6">
							{/* Restaurant Details */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<Card>
									<CardContent className="p-6">
										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<p className="text-muted-foreground">
													{restaurant.description}
												</p>
												<div className="space-y-2 text-sm">
													<div className="flex items-center gap-2">
														<MapPin className="w-4 h-4 text-blue-600" />
														<span>{restaurant.location}</span>
													</div>
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4 text-blue-600" />
														<span>{restaurant.hours}</span>
													</div>
													<div className="flex items-center gap-2">
														<Phone className="w-4 h-4 text-blue-600" />
														<span>{restaurant.phone}</span>
													</div>
												</div>
												<div>
													<h4 className="font-medium text-blue-900 mb-2">
														Our Specialties
													</h4>
													<div className="flex flex-wrap gap-2">
														{restaurant.specialties.map((specialty) => (
															<Badge
																key={specialty}
																variant="outline"
																className="border-blue-200 text-blue-700"
															>
																{specialty}
															</Badge>
														))}
													</div>
												</div>
											</div>
											{/* Google Maps */}
											<div className="rounded-xl overflow-hidden border border-slate-200 h-48 md:h-full min-h-48">
												<iframe
													src={mapSrc}
													width="100%"
													height="100%"
													style={{ border: 0 }}
													allowFullScreen
													loading="lazy"
													referrerPolicy="no-referrer-when-downgrade"
													title={"${restaurant.name} Location"}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Menu Section */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
							>
								<Card>
									<CardContent className="p-6">
										{/* Search */}
										<div className="relative mb-6">
											<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												placeholder="Search menu..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												className="pl-10"
											/>
										</div>

										{/* Category Tabs */}
										<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
											{restaurant.menu.map((category) => (
												<motion.div
													key={category.category}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Button
														variant={
															activeCategory === category.category
																? "default"
																: "outline"
														}
														className={
															activeCategory === category.category
																? "bg-blue-600 hover:bg-blue-700 shrink-0"
																: "shrink-0"
														}
														onClick={() => setActiveCategory(category.category)}
													>
														{category.category}
													</Button>
												</motion.div>
											))}
										</div>

										{/* Menu Items */}
										<div className="space-y-4">
											<AnimatePresence mode="wait">
												{currentCategory?.items.length === 0 ? (
													<motion.p
														key="empty"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														className="text-center text-muted-foreground py-8"
													>
														No items found matching your search.
													</motion.p>
												) : (
													<motion.div
														key={activeCategory}
														initial={{ opacity: 0, x: 10 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: -10 }}
														transition={{ duration: 0.2 }}
														className="space-y-4"
													>
														{currentCategory?.items.map((item, index) => {
															const quantityInCart = getItemQuantityInCart(
																item.id,
															);
															return (
																<motion.div
																	key={item.id}
																	initial={{ opacity: 0, y: 10 }}
																	animate={{ opacity: 1, y: 0 }}
																	transition={{ delay: index * 0.05 }}
																	whileHover={{ scale: 1.01 }}
																	className="flex gap-4 p-4 bg-slate-50 rounded-xl cursor-pointer transition-shadow hover:shadow-md"
																	onClick={() => {
																		setSelectedItem(item);
																		setIsModalOpen(true);
																	}}
																>
																	<div className="relative">
																		<img
																			src={
																				item.image ||
																				"/placeholder.svg?height=100&width=100&query=food dish"
																			}
																			alt={item.name}
																			className="w-24 h-24 rounded-lg object-cover"
																		/>
																		{item.popular && (
																			<Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-500 text-white text-xs">
																				Popular
																			</Badge>
																		)}
																	</div>
																	<div className="flex-1">
																		<h3 className="font-semibold text-blue-900">
																			{item.name}
																		</h3>
																		<p className="text-sm text-muted-foreground line-clamp-2 mb-2">
																			{item.description}
																		</p>
																		<div className="flex items-center justify-between">
																			<span className="font-bold text-blue-600">
																				{item.price}
																			</span>
																			{quantityInCart > 0 ? (
																				<div
																					className="flex items-center gap-2"
																					onClick={(e) => e.stopPropagation()}
																				>
																					<Button
																						size="icon"
																						variant="outline"
																						className="h-8 w-8 rounded-full bg-transparent"
																						onClick={() => {
																							const cartItem = cartItems.find(
																								(ci) => ci.id === item.id,
																							);
																							if (cartItem) {
																								updateQuantity(
																									item.id,
																									cartItem.quantity - 1,
																									cartItem.size,
																									cartItem.addOns,
																								);
																							}
																						}}
																					>
																						<Minus className="w-3 h-3" />
																					</Button>
																					<span className="font-medium w-6 text-center">
																						{quantityInCart}
																					</span>
																					<Button
																						size="icon"
																						className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
																						onClick={() => {
																							setSelectedItem(item);
																							setIsModalOpen(true);
																						}}
																					>
																						<Plus className="w-3 h-3" />
																					</Button>
																				</div>
																			) : (
																				<motion.div
																					whileHover={{ scale: 1.05 }}
																					whileTap={{ scale: 0.95 }}
																				>
																					<Button
																						size="sm"
																						className="bg-blue-600 hover:bg-blue-700"
																						onClick={(e) => {
																							e.stopPropagation();
																							setSelectedItem(item);
																							setIsModalOpen(true);
																						}}
																					>
																						<Plus className="w-4 h-4 mr-1" />{" "}
																						Add
																					</Button>
																				</motion.div>
																			)}
																		</div>
																	</div>
																</motion.div>
															);
														})}
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</div>

						{/* Right Column - Cart Sidebar */}
						<div className="hidden lg:block">
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 }}
								className="sticky top-24"
							>
								<Card>
									<CardContent className="p-6">
										<h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
											<ShoppingCart className="w-5 h-5" />
											Your Order
										</h3>

										{cartItems.length === 0 ? (
											<div className="text-center py-8 text-muted-foreground">
												<ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
												<p>Your cart is empty</p>
												<p className="text-sm">Add items to get started</p>
											</div>
										) : (
											<>
												<div className="space-y-4 max-h-80 overflow-y-auto mb-4">
													<AnimatePresence>
														{cartItems.map((item) => (
															<motion.div
																key={`${item.id}-${item.size}-${JSON.stringify(item.addOns)}`}
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: "auto" }}
																exit={{ opacity: 0, height: 0 }}
																className="flex gap-3 pb-3 border-b"
															>
																<img
																	src={
																		item.image ||
																		"/placeholder.svg?height=48&width=48&query=food"
																	}
																	alt={item.name}
																	className="w-12 h-12 rounded-lg object-cover"
																/>
																<div className="flex-1 min-w-0">
																	<h4 className="font-medium text-sm truncate">
																		{item.name}
																	</h4>
																	{item.size && (
																		<p className="text-xs text-muted-foreground">
																			{item.size}
																		</p>
																	)}
																	{item.addOns && item.addOns.length > 0 && (
																		<p className="text-xs text-muted-foreground truncate">
																			+{item.addOns.join(", ")}
																		</p>
																	)}
																	<div className="flex items-center justify-between mt-1">
																		<span className="text-xs text-muted-foreground">
																			x{item.quantity}
																		</span>
																		<span className="font-medium text-blue-600 text-sm">
																			GHC {item.totalPrice.toFixed(2)}
																		</span>
																	</div>
																</div>
															</motion.div>
														))}
													</AnimatePresence>
												</div>

												<div className="border-t pt-4 space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">
															Subtotal
														</span>
														<span>GHC {totalPrice.toFixed(2)}</span>
													</div>
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">
															Delivery
														</span>
														<span>
															{restaurant.freeDelivery
																? "Free"
																: restaurant.deliveryFee}
														</span>
													</div>
													<div className="flex justify-between font-bold text-lg pt-2 border-t">
														<span>Total</span>
														<span className="text-blue-600">
															GHC{" "}
															{(
																totalPrice +
																(restaurant.freeDelivery
																	? 0
																	: Number.parseFloat(
																			restaurant.deliveryFee.replace(
																				"GHC ",
																				"",
																			),
																		))
															).toFixed(2)}
														</span>
													</div>
												</div>

												<Link to="/checkout">
													<motion.div
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														className="mt-4"
													>
														<Button className="w-full bg-blue-600 hover:bg-blue-700">
															Checkout ({totalItems} items)
														</Button>
													</motion.div>
												</Link>
											</>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</div>

				{/* Mobile Cart Bar */}
				<AnimatePresence>
					{cartItems.length > 0 && (
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 100, opacity: 0 }}
							className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40"
						>
							<Link to="/checkout">
								<Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 flex items-center justify-between px-6">
									<span className="flex items-center gap-2">
										<ShoppingCart className="w-5 h-5" />
										<span>{totalItems} items</span>
									</span>
									<span className="font-bold">GHC {totalPrice.toFixed(2)}</span>
								</Button>
							</Link>
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			{/* Menu Item Modal */}
			<MenuItemModal
				item={selectedItem}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedItem(null);
				}}
				onAddToCart={handleAddToCart}
				restaurantName={restaurant.name}
				deliveryTime={restaurant.deliveryTime}
			/>

			<Footer />
		</div>
	);
}
