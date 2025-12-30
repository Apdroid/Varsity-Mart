"use client";
import {
	Bed,
	Bell,
	BookOpen,
	Camera,
	ChefHat,
	Dumbbell,
	Headphones,
	Heart,
	Laptop,
	Menu,
	Music,
	Package,
	Palette,
	Shirt,
	ShoppingBag,
	ShoppingCart,
	Smartphone,
	Store,
	Utensils,
	X,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import { LoginButton } from "../auth/auth-button";
import ProfileDropdown from "../auth/user-dropdown";
import { LocationSelector } from "./location-selector";
import Logo from "./logo";
import { UniversityDisplay } from "./university-display";

const navigation = [
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Stores", href: "/stores", icon: Store },
	{ name: "Food", href: "/restaurants", icon: ChefHat },
];

// Product categories
const productCategories = [
	{ name: "Textbooks", icon: BookOpen, href: "/search?category=textbooks" },
	{ name: "Electronics", icon: Laptop, href: "/search?category=electronics" },
	{ name: "Fashion", icon: Shirt, href: "/search?category=fashion" },
	{
		name: "Room Essentials",
		icon: Bed,
		href: "/search?category=room-essentials",
	},
	{
		name: "Accessories",
		icon: ShoppingBag,
		href: "/search?category=accessories",
	},
	{
		name: "Phones & Tablets",
		icon: Smartphone,
		href: "/search?category=phones",
	},
	{ name: "Audio", icon: Headphones, href: "/search?category=audio" },
	{ name: "Sports & Fitness", icon: Dumbbell, href: "/search?category=sports" },
	{ name: "Art Supplies", icon: Palette, href: "/search?category=art" },
	{ name: "Musical Instruments", icon: Music, href: "/search?category=music" },
	{ name: "Photography", icon: Camera, href: "/search?category=photography" },
];

// Food categories
const foodCategories = [
	{ name: "Ghanaian", href: "/restaurants?category=ghanaian" },
	{ name: "Fast Food", href: "/restaurants?category=fast-food" },
	{ name: "Cafe", href: "/restaurants?category=cafe" },
	{ name: "Desserts", href: "/restaurants?category=desserts" },
	{ name: "Beverages", href: "/restaurants?category=beverages" },
	{ name: "Snacks", href: "/restaurants?category=snacks" },
];

// Store categories
const storeCategories = [
	{ name: "Electronics", href: "/stores?category=electronics" },
	{ name: "Fashion", href: "/stores?category=fashion" },
	{ name: "Books", href: "/stores?category=books" },
	{ name: "Beauty", href: "/stores?category=beauty" },
	{ name: "Sports", href: "/stores?category=sports" },
	{ name: "General", href: "/stores?category=general" },
];

const searchPlaceholders = [
	"HP Laptop",
	"Wireless Headphones",
	"Bel's Kitchen",
	"Shoes",
	"Smartphone",
	"Waakye Special",
	"Textbooks",
	"Fashion Store",
];

export function Header() {
	const path = usePathname();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("/");
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [activeCategoryType, setActiveCategoryType] = useState<
		"products" | "stores" | "food"
	>("products");
	const { items } = useCartStore();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
	const { scrollY } = useScroll();
	const searchParams = useSearchParams();
	const { isAuthenticated } = useAuth();

	// Handle scroll direction for header visibility
	useMotionValueEvent(scrollY, "change", (current) => {
		if (typeof current === "number") {
			const scrollDifference = current - lastScrollY;

			// Show header when scrolling up or at the top
			if (current < 10) {
				setIsVisible(true);
			} else if (scrollDifference < 0) {
				// Scrolling up
				setIsVisible(true);
			} else if (scrollDifference > 0) {
				// Scrolling down
				setIsVisible(false);
			}

			setLastScrollY(current);
		}
	});

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
		}
	};

	useEffect(() => {
		for (const item of navigation) {
			const currentPath = path.endsWith(item.href);
			if (currentPath) {
				setActiveTab(item.href);
				break;
			}
		}
		const query = searchParams.get("query");
		if (query) {
			setSearchQuery(query);
		}
	}, [path, searchParams]);

	// Determine active category type based on path
	useEffect(() => {
		if (path.startsWith("/restaurants") || path.startsWith("/food")) {
			setActiveCategoryType("food");
		} else if (path.startsWith("/stores")) {
			setActiveCategoryType("stores");
		} else {
			setActiveCategoryType("products");
		}
	}, [path]);

	// Get current categories based on active type
	const currentCategories =
		activeCategoryType === "food"
			? foodCategories
			: activeCategoryType === "stores"
				? storeCategories
				: productCategories;

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 w-full bg-card border-b border-border/80 transition-transform duration-300",
				isVisible ? "translate-y-0" : "-translate-y-full",
			)}
		>
			{/* First Deck - Main Navigation */}
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					{/* Logo and Main Nav */}
					<div className="flex items-center gap-6">
						<Logo />
						<nav className="hidden lg:flex items-center gap-1">
							{navigation.map((item) => {
								const isActive = activeTab === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md",
											isActive
												? "text-primary"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<item.icon className="h-4 w-4" />
										{item.name}
										{isActive && (
											<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
										)}
									</Link>
								);
							})}
						</nav>
					</div>

					{/* Search Bar - Using PlaceholdersAndVanishInput */}
					<div className="flex-1 max-w-2xl hidden md:flex">
						<PlaceholdersAndVanishInput
							placeholders={searchPlaceholders}
							className="max-w-full"
							onChange={(e) => setSearchQuery(e.target.value)}
							onSubmit={handleSearch}
							newValue={searchQuery}
						/>
					</div>

					{/* Location Selector */}
					{isAuthenticated && <LocationSelector />}

					{/* University Display - Only for unauthenticated users */}
					{!isAuthenticated && <UniversityDisplay />}

					{/* Actions */}
					<div className="flex items-center gap-1 sm:gap-2">
						{isAuthenticated ? (
							<ProfileDropdown
								align="end"
								trigger={
									<button className="rounded-full" type="button">
										<Avatar className="size-9 cursor-pointer">
											<AvatarImage
												src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
												alt="User"
											/>
											<AvatarFallback>JD</AvatarFallback>
										</Avatar>
									</button>
								}
							/>
						) : (
							<LoginButton />
						)}

						<Link href="/cart">
							<Button variant="ghost" size="icon" className="h-9 w-9 relative">
								<ShoppingCart className="h-5 w-5" />
								{cartCount > 0 && (
									<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary border-2 border-background">
										{cartCount}
									</Badge>
								)}
								<span className="sr-only">Cart</span>
							</Button>
						</Link>

						<AnimatedThemeToggler />

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
							<span className="sr-only">Menu</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Second Deck - Categories */}
			<div className="hidden lg:block border-t border-border/80 bg-card">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-8 h-12">
						{/* Category Type Selector */}
						<div className="flex items-center gap-1 border-r border-border pr-6">
							<button
								onClick={() => setActiveCategoryType("products")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
									activeCategoryType === "products"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								Products
							</button>
							<button
								onClick={() => setActiveCategoryType("stores")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
									activeCategoryType === "stores"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								Stores
							</button>
							<button
								onClick={() => setActiveCategoryType("food")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
									activeCategoryType === "food"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								Food
							</button>
						</div>

						{/* Category Links */}
						<div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
							{currentCategories.map((category, idx) => (
								<Link
									key={idx}
									href={category.href}
									className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
								>
									{"icon" in category && (
										<category.icon className="h-3.5 w-3.5 text-primary" />
									)}
									{category.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Search */}
			<div className="md:hidden px-4 pb-3 border-t border-border">
				<PlaceholdersAndVanishInput
					placeholders={searchPlaceholders}
					onChange={(e) => setSearchQuery(e.target.value)}
					onSubmit={handleSearch}
					newValue={searchQuery}
				/>
			</div>

			{/* Mobile Menu */}
			<div
				className={cn(
					"lg:hidden border-t border-border overflow-hidden transition-all duration-200",
					mobileMenuOpen ? "max-h-96 py-4" : "max-h-0",
				)}
			>
				<nav className="flex flex-col gap-1 px-4">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
							onClick={() => setMobileMenuOpen(false)}
						>
							<item.icon className="h-5 w-5" />
							{item.name}
						</Link>
					))}
					{isAuthenticated && (
						<>
							<div className="border-t border-border my-2" />
							<Link
								href="/wishlist"
								className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md sm:hidden"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Heart className="h-5 w-5" />
								Wishlist
							</Link>
							<Link
								href="/notifications"
								className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md sm:hidden"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Bell className="h-5 w-5" />
								Notifications
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
