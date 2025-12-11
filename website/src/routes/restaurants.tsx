import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	BadgeCheck,
	ChevronDown,
	Clock,
	Filter,
	Heart,
	MapPin,
	Moon,
	Search,
	Star,
	Truck,
	X,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/restaurants")({
	component: RestaurantsPage,
});

const categories = [
	{ id: "all", name: "All", icon: "🍽" },
	{ id: "local", name: "Local Food", icon: "🍛" },
	{ id: "fast-food", name: "Fast Food", icon: "🍔" },
	{ id: "pizza", name: "Pizza", icon: "🍕" },
	{ id: "chinese", name: "Chinese", icon: "🥡" },
	{ id: "african", name: "African", icon: "🥘" },
	{ id: "drinks", name: "Drinks", icon: "🥤" },
];

const restaurants = [
	{
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
		hours: "8:00 AM - 10:00 PM",
		minOrder: "GHC 15",
		description:
			"Authentic local dishes prepared with love. Popular for our waakye and banku with tilapia.",
		specialties: ["Waakye", "Banku & Tilapia", "Jollof Rice", "Red Red"],
		cuisine: "Local Food",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: true,
		freeDelivery: false,
	},
	{
		id: 2,
		name: "Burger Hub",
		verified: true,
		rating: 4.6,
		reviews: 198,
		deliveryTime: "15-25 min",
		deliveryFee: "GHC 5",
		tags: ["Fast Delivery", "Popular"],
		nightShop: false,
		location: "Tech Junction",
		hours: "10:00 AM - 9:00 PM",
		minOrder: "GHC 20",
		description:
			"Premium burgers made with fresh ingredients. The best campus burgers!",
		specialties: ["Classic Burger", "Cheese Burger", "Chicken Wings", "Fries"],
		cuisine: "Fast Food",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: true,
		freeDelivery: true,
	},
	{
		id: 3,
		name: "Pizza Palace",
		verified: true,
		rating: 4.9,
		reviews: 456,
		deliveryTime: "20-30 min",
		deliveryFee: "GHC 10",
		tags: ["Top Rated", "Popular", "Student Favorite"],
		nightShop: true,
		location: "Engineering Gate",
		hours: "11:00 AM - 11:00 PM",
		minOrder: "GHC 30",
		description:
			"Authentic Italian pizzas with fresh toppings. Wood-fired perfection.",
		specialties: [
			"Pepperoni Pizza",
			"Margherita",
			"BBQ Chicken",
			"Veggie Supreme",
		],
		cuisine: "Pizza",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: true,
		freeDelivery: false,
	},
	{
		id: 4,
		name: "Golden Dragon",
		verified: false,
		rating: 4.5,
		reviews: 123,
		deliveryTime: "30-40 min",
		deliveryFee: "GHC 12",
		tags: ["Authentic"],
		nightShop: false,
		location: "Ayeduase Gate",
		hours: "12:00 PM - 9:00 PM",
		minOrder: "GHC 25",
		description: "Traditional Chinese cuisine with authentic flavors.",
		specialties: ["Fried Rice", "Chow Mein", "Sweet & Sour", "Spring Rolls"],
		cuisine: "Chinese",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: false,
		freeDelivery: false,
	},
	{
		id: 5,
		name: "Auntie Akos Chop Bar",
		verified: true,
		rating: 4.7,
		reviews: 287,
		deliveryTime: "20-30 min",
		deliveryFee: "GHC 6",
		tags: ["Budget Friendly", "Student Favorite"],
		nightShop: false,
		location: "Brunei Hostel",
		hours: "6:00 AM - 8:00 PM",
		minOrder: "GHC 10",
		description:
			"Affordable and delicious local food. Student budget-friendly!",
		specialties: ["Fufu", "Kenkey", "Banku", "Rice Balls"],
		cuisine: "African",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: true,
		freeDelivery: false,
	},
	{
		id: 6,
		name: "Smoothie Station",
		verified: true,
		rating: 4.8,
		reviews: 167,
		deliveryTime: "10-15 min",
		deliveryFee: "GHC 3",
		tags: ["Fast Delivery", "Healthy"],
		nightShop: false,
		location: "Unity Hall",
		hours: "7:00 AM - 7:00 PM",
		minOrder: "GHC 15",
		description: "Fresh smoothies, juices, and healthy drinks for students.",
		specialties: [
			"Mango Smoothie",
			"Green Detox",
			"Protein Shake",
			"Fresh Juice",
		],
		cuisine: "Drinks",
		image: "/placeholder.svg?height=300&width=500",
		isOpen: true,
		freeDelivery: true,
	},
];

const sortOptions = [
	{ value: "recommended", label: "Recommended" },
	{ value: "rating", label: "Top Rated" },
	{ value: "delivery", label: "Fastest Delivery" },
	{ value: "price", label: "Lowest Delivery Fee" },
];
function RestaurantsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("recommended");
	const [showOpenOnly, setShowOpenOnly] = useState(false);
	const [showFreeDelivery, setShowFreeDelivery] = useState(false);
	const [showNightShop, setShowNightShop] = useState(false);
	const [favorites, setFavorites] = useState<number[]>([]);

	const toggleFavorite = (id: number) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
		);
	};

	const filteredRestaurants = restaurants
		.filter((r) => {
			if (
				searchQuery &&
				!r.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
				return false;
			if (
				selectedCategory !== "all" &&
				r.cuisine.toLowerCase().replace(" ", "-") !== selectedCategory
			)
				return false;
			if (showOpenOnly && !r.isOpen) return false;
			if (showFreeDelivery && !r.freeDelivery) return false;
			if (showNightShop && !r.nightShop) return false;
			return true;
		})
		.sort((a, b) => {
			if (sortBy === "rating") return b.rating - a.rating;
			if (sortBy === "delivery")
				return (
					Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
				);
			if (sortBy === "price")
				return (
					Number.parseInt(a.deliveryFee.replace("GHC ", "")) -
					Number.parseInt(b.deliveryFee.replace("GHC ", ""))
				);
			return 0;
		});

	const activeFiltersCount = [
		showOpenOnly,
		showFreeDelivery,
		showNightShop,
	].filter(Boolean).length;

	return (
		<div className="min-h-screen bg-slate-50">
			<Navbar />
			<Outlet />
			{/* Hero Section */}
			<section className="bg-linear-to-br from-blue-600 to-blue-900 pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
							Hungry? Order Food
						</h1>
						<p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
							Discover the best restaurants and food spots on campus. Fast
							delivery, great prices.
						</p>
					</div>

					{/* Search Bar */}
					<div className="max-w-2xl mx-auto">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Sarch restaurants..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 pr-4 h-14 text-lg rounded-xl border-0 shadow-lg"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute right-4 top-1/2 -translate-y-1/2"
								>
									<X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
								</button>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="bg-white border-b sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
						{categories.map((category) => (
							<button
								type="button"
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
									selectedCategory === category.id
										? "bg-blue-600 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								}`}
							>
								<span>{category.icon}</span>
								<span className="font-medium">{category.name}</span>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Filters and Results */}
			<section className="py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Filter Bar */}
					<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
						<div className="flex items-center gap-3 flex-wrap">
							{/* Mobile Filter Sheet */}
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										className="md:hidden relative bg-transparent"
									>
										<Filter className="w-4 h-4 mr-2" />
										Filters
										{activeFiltersCount > 0 && (
											<span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
												{activeFiltersCount}
											</span>
										)}
									</Button>
								</SheetTrigger>
								<SheetContent side="bottom" className="h-auto">
									<SheetHeader>
										<SheetTitle>Filters</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-4 py-4">
										<button
											type="button"
											onClick={() => setShowOpenOnly(!showOpenOnly)}
											className={`flex items-center justify-between p-4 rounded-lg border ${
												showOpenOnly
													? "border-blue-600 bg-blue-50"
													: "border-border"
											}`}
										>
											<span>Open Now</span>
											{showOpenOnly && (
												<BadgeCheck className="w-5 h-5 text-blue-600" />
											)}
										</button>
										<button
											type="button"
											onClick={() => setShowFreeDelivery(!showFreeDelivery)}
											className={`flex items-center justify-between p-4 rounded-lg border ${
												showFreeDelivery
													? "border-blue-600 bg-blue-50"
													: "border-border"
											}`}
										>
											<span>Free Delivery</span>
											{showFreeDelivery && (
												<BadgeCheck className="w-5 h-5 text-blue-600" />
											)}
										</button>
										<button
											type="button"
											onClick={() => setShowNightShop(!showNightShop)}
											className={`flex items-center justify-between p-4 rounded-lg border ${
												showNightShop
													? "border-blue-600 bg-blue-50"
													: "border-border"
											}`}
										>
											<span>Night Shop Available</span>
											{showNightShop && (
												<BadgeCheck className="w-5 h-5 text-blue-600" />
											)}
										</button>
									</div>
								</SheetContent>
							</Sheet>

							{/* Desktop Filters */}
							<div className="hidden md:flex items-center gap-3">
								<Button
									variant={showOpenOnly ? "default" : "outline"}
									onClick={() => setShowOpenOnly(!showOpenOnly)}
									className={
										showOpenOnly ? "bg-blue-600 hover:bg-blue-700" : ""
									}
								>
									Open Now
								</Button>
								<Button
									variant={showFreeDelivery ? "default" : "outline"}
									onClick={() => setShowFreeDelivery(!showFreeDelivery)}
									className={
										showFreeDelivery ? "bg-blue-600 hover:bg-blue-700" : ""
									}
								>
									<Truck className="w-4 h-4 mr-2" />
									Free Delivery
								</Button>
								<Button
									variant={showNightShop ? "default" : "outline"}
									onClick={() => setShowNightShop(!showNightShop)}
									className={
										showNightShop ? "bg-blue-600 hover:bg-blue-700" : ""
									}
								>
									<Moon className="w-4 h-4 mr-2" />
									Night Shop
								</Button>
							</div>
						</div>

						{/* Sort Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
									<ChevronDown className="w-4 h-4 ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{sortOptions.map((option) => (
									<DropdownMenuItem
										key={option.value}
										onClick={() => setSortBy(option.value)}
										className={sortBy === option.value ? "bg-blue-50" : ""}
									>
										{option.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Results Count */}
					<p className="text-muted-foreground mb-6">
						{filteredRestaurants.length} restaurant
						{filteredRestaurants.length !== 1 ? "s" : ""} found
					</p>

					{/* Restaurant Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredRestaurants.map((restaurant) => (
							<Link
								key={restaurant.id}
								to="/restaurants/$id"
								params={{ id: restaurant.id.toString() }}
							>
								<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md bg-white h-full">
									<CardContent className="p-0">
										{/* Image */}
										<div className="relative aspect-video overflow-hidden">
											<img
												src={restaurant.image || "/placeholder.svg"}
												alt={restaurant.name}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
											{/* Open/Closed Status */}
											<Badge
												className={`absolute top-3 left-3 ${
													restaurant.isOpen
														? "bg-green-500 hover:bg-green-500"
														: "bg-red-500 hover:bg-red-500"
												} text-white`}
											>
												{restaurant.isOpen ? "Open Now" : "Closed"}
											</Badge>
											{/* Favorite Button */}
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													toggleFavorite(restaurant.id);
												}}
												className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
											>
												<Heart
													className={`w-5 h-5 ${
														favorites.includes(restaurant.id)
															? "fill-red-500 text-red-500"
															: "text-slate-400"
													}`}
												/>
											</button>
											{/* Free Delivery Badge */}
											{restaurant.freeDelivery && (
												<Badge className="absolute bottom-3 left-3 bg-blue-600 hover:bg-blue-600 text-white">
													<Truck className="w-3 h-3 mr-1" />
													Free Delivery
												</Badge>
											)}
										</div>

										{/* Content */}
										<div className="p-4">
											{/* Header */}
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-2">
													<h3 className="text-lg font-bold text-blue-900">
														{restaurant.name}
													</h3>
													{restaurant.verified && (
														<BadgeCheck className="w-5 h-5 text-blue-600" />
													)}
												</div>
											</div>

											{/* Stats Row */}
											<div className="flex items-center gap-4 mb-3 text-sm">
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
													<span className="font-semibold">
														{restaurant.rating}
													</span>
													<span className="text-muted-foreground">
														({restaurant.reviews})
													</span>
												</div>
												<div className="flex items-center gap-1 text-muted-foreground">
													<Clock className="w-4 h-4" />
													{restaurant.deliveryTime}
												</div>
												<span className="text-muted-foreground">
													{restaurant.deliveryFee}
												</span>
											</div>

											{/* Tags */}
											<div className="flex flex-wrap gap-2 mb-3">
												{restaurant.tags.slice(0, 3).map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
													>
														{tag}
													</Badge>
												))}
												{restaurant.nightShop && (
													<Badge
														variant="secondary"
														className="bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs"
													>
														<Moon className="w-3 h-3 mr-1" />
														Night Shop
													</Badge>
												)}
											</div>

											{/* Location */}
											<div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
												<MapPin className="w-4 h-4" />
												{restaurant.location}
											</div>

											{/* Description */}
											<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
												{restaurant.description}
											</p>

											{/* Specialties */}
											<div className="flex flex-wrap gap-1.5">
												{restaurant.specialties.slice(0, 4).map((specialty) => (
													<Badge
														key={specialty}
														variant="outline"
														className="text-xs border-slate-200"
													>
														{specialty}
													</Badge>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Empty State */}
					{filteredRestaurants.length === 0 && (
						<div className="text-center py-16">
							<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
								<Search className="w-10 h-10 text-slate-400" />
							</div>
							<h3 className="text-xl font-semibold text-blue-900 mb-2">
								No restaurants found
							</h3>
							<p className="text-muted-foreground mb-6">
								Try adjusting your filters or search query
							</p>
							<Button
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("all");
									setShowOpenOnly(false);
									setShowFreeDelivery(false);
									setShowNightShop(false);
								}}
								className="bg-blue-600 hover:bg-blue-700"
							>
								Clear All Filters
							</Button>
						</div>
					)}
				</div>
			</section>

			<Footer />
		</div>
	);
}
