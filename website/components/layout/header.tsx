"use client";
import {
	Bed,
	Bell,
	BookOpen,
	Camera,
	ChefHat,
	CircleUser,
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
	Sparkles,
	Store,
	X,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import type { LucideIcon } from "lucide-react";

const navigation = [
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Stores", href: "/stores", icon: Store },
	{ name: "Food", href: "/restaurants", icon: ChefHat },
];

// Product categories
const productCategories: { name: string; icon?: LucideIcon; href: string }[] = [
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
const foodCategories: { name: string; href: string }[] = [
	{ name: "Ghanaian", href: "/restaurants?category=ghanaian" },
	{ name: "Fast Food", href: "/restaurants?category=fast-food" },
	{ name: "Cafe", href: "/restaurants?category=cafe" },
	{ name: "Desserts", href: "/restaurants?category=desserts" },
	{ name: "Beverages", href: "/restaurants?category=beverages" },
	{ name: "Snacks", href: "/restaurants?category=snacks" },
];

// Store categories
const storeCategories: { name: string; href: string }[] = [
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
	const { isAuthenticated, user} = useAuth();

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
				"fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 shadow-sm",
				isVisible ? "translate-y-0" : "-translate-y-full",
			)}
		>
			{/* Promotional Banner - Optional */}
			<div className="hidden md:block bg-primary text-primary-foreground text-center py-1.5 text-xs font-medium">
				<span className="inline-flex items-center gap-2">
					<Sparkles className="h-3 w-3" />
					Free delivery on orders over GH₵100 • Use code CAMPUS10 for 10% off
					<Sparkles className="h-3 w-3" />
				</span>
			</div>

			{/* First Deck - Main Navigation */}
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex h-14 lg:h-16 items-center justify-between gap-4">
					{/* Logo and Main Nav */}
					<div className="flex items-center gap-4 lg:gap-8">
						<Logo />
						<nav className="hidden lg:flex items-center gap-1">
							{navigation.map((item) => {
								const isActive = activeTab === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group",
											isActive
												? "text-primary bg-primary/5"
												: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
										)}
									>
										<item.icon className={cn(
											"h-4 w-4 transition-transform duration-200",
											isActive && "text-primary",
											"group-hover:scale-110"
										)} />
										{item.name}
										{isActive && (
											<div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
										)}
									</Link>
								);
							})}
						</nav>
					</div>

					{/* Search Bar - Enhanced styling */}
					<div className="flex-1 hidden md:flex max-w-xl">
						<div className="relative w-full">
							<PlaceholdersAndVanishInput
								placeholders={searchPlaceholders}
								className="max-w-full"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
								onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSearch(e)}
								newValue={searchQuery}
							/>
						</div>
					</div>

					{/* Location Selector */}
					{isAuthenticated && <LocationSelector />}

					{/* University Display - Only for unauthenticated users */}
					{!isAuthenticated && <UniversityDisplay />}

					{/* Actions */}
					<div className="flex items-center gap-2 sm:gap-3">
						{isAuthenticated ? (
							<ProfileDropdown
								align="end"
								trigger={
									<button className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all" type="button">
										<Avatar className="size-9 cursor-pointer">
											<AvatarImage
												src={user!?.avatar}
												alt="User"/>
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user!?.fullName || <CircleUser size="28" color="white"/>}</AvatarFallback>
										</Avatar>
									</button>
								}
							/>
						) : (
							<LoginButton />
						)}

						<Link href="/cart">
							<Button variant="ghost" size="icon" className="h-10 w-10 relative hover:bg-primary/10 transition-colors">
								<ShoppingCart className="h-5 w-5" />
								{cartCount > 0 && (
									<Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs bg-primary text-primary-foreground border-2 border-background animate-in zoom-in-50 duration-200">
										{cartCount > 99 ? '99+' : cartCount}
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
			<div className="hidden lg:block border-t border-border/50 bg-background/80">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-6 h-11">
						{/* Category Type Selector */}
						<div className="flex items-center gap-1 border-r border-border/50 pr-6">
							<button
								type="button"
								onClick={() => setActiveCategoryType("products")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
									activeCategoryType === "products"
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground hover:bg-accent",
								)}
							>
								Products
							</button>
							<button
								type="button"
								onClick={() => setActiveCategoryType("stores")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
									activeCategoryType === "stores"
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground hover:bg-accent",
								)}
							>
								Stores
							</button>
							<button
								type="button"
								onClick={() => setActiveCategoryType("food")}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
									activeCategoryType === "food"
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground hover:bg-accent",
								)}
							>
								Food
							</button>
						</div>
						{/* Category Links */}
						<div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
							{currentCategories.map((category, idx) => {
								const IconComponent = category.icon;
								return (
									<Link
										key={idx}
										href={category.href}
										className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap shrink-0 group"
									>
										{IconComponent && (
											<IconComponent className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors" />
										)}
										<span className="group-hover:underline underline-offset-2">{category.name}</span>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Search */}
			<div className="md:hidden px-4 pb-3 border-t border-border">
				<PlaceholdersAndVanishInput
					placeholders={searchPlaceholders}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
					onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSearch(e)}
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
