"use client";
import {
	Bell,
	BookOpen,
	ChefHat,
	CircleUser,
	Heart,
	Menu,
	Package,
	Search,
	ShoppingCart,
	Sparkles,
	Store,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AuthAwareLocation } from "@/components/auth/auth-aware-location";
import { AuthAwareMobileMenu } from "@/components/auth/auth-aware-mobile-menu";
import { AuthAwareProfile } from "@/components/auth/auth-aware-profile";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/ui/search-modal";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mockProducts } from "@/data/products/products";
import { useCart } from "@/hooks/queries/useCart";
import { cn } from "@/lib/utils";
import Logo from "./logo";

const navigation = [
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Stores", href: "/stores", icon: Store },
	{ name: "Food", href: "/restaurants", icon: ChefHat },
];

export function Header() {
	const path = usePathname();
	const [activeTab, setActiveTab] = useState("/");
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showAutocomplete, setShowAutocomplete] = useState(false);
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const { items } = useCart();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
	const { scrollY } = useScroll();
	const router = useRouter();



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

	useEffect(() => {
		for (const item of navigation) {
			const currentPath = path.endsWith(item.href);
			if (currentPath) {
				setActiveTab(item.href);
				break;
			}
		}
	}, [path]);

	// Search autocomplete effect
	useEffect(() => {
		if (searchQuery.trim().length > 1) {
			const filtered = mockProducts.filter((product) =>
				product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
			).slice(0, 8);
			setSearchResults(filtered);
			setShowAutocomplete(filtered.length > 0);
		} else {
			setShowAutocomplete(false);
			setSearchResults([]);
		}
	}, [searchQuery]);

	// Click outside to close autocomplete
	const searchRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setShowAutocomplete(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Keyboard shortcut for search focus (Cmd+K / Ctrl+K)
	const searchInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSearch = (query: string) => {
		if (query.trim()) {
			router.push(`/search?query=${encodeURIComponent(query)}`);
			setShowAutocomplete(false);
		}
	};

	return (
		<>
			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 shadow-sm",
					isVisible ? "translate-y-0" : "-translate-y-full",
				)}
			>
				{/* Promotional Banner */}
				<div className="hidden md:block bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground text-center py-2 text-sm font-medium">
					<div className="container mx-auto px-4 flex items-center justify-center gap-2">
						<Sparkles className="h-4 w-4 animate-pulse" />
						<span>Free campus delivery on orders over GH₵100 • Use code <span className="font-bold">CAMPUS10</span> for 10% off</span>
						<Sparkles className="h-4 w-4 animate-pulse" />
					</div>
				</div>

				{/* Main Header */}
				<div className="container mx-auto px-3 sm:px-4 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
						{/* Left: Logo and Navigation */}
						<div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
							<Logo />
							<nav className="hidden lg:flex items-center gap-1">
								{navigation.map((item) => {
									const isActive = activeTab === item.href;
									return (
										<Link
											key={item.name}
											href={item.href}
											className={cn(
												"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg",
												isActive
													? "text-primary bg-primary/10"
													: "text-muted-foreground hover:text-foreground hover:bg-accent",
											)}
										>
											<item.icon className="h-4 w-4" />
											{item.name}
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Center: Search Bar with Autocomplete */}
						<div className="flex-1 max-w-2xl hidden md:block relative" ref={searchRef}>
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
								<input
									ref={searchInputRef}
									type="text"
									placeholder="Search for products, stores, or food..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSearch(searchQuery);
										}
										if (e.key === "Escape") {
											setShowAutocomplete(false);
											setSearchQuery("");
										}
									}}
									onFocus={() => {
										if (searchQuery.trim().length > 1 && searchResults.length > 0) {
											setShowAutocomplete(true);
										}
									}}
									className="w-full flex items-center gap-2 sm:gap-3 px-12 sm:px-12 py-2 sm:py-2.5 text-sm bg-accent/50 hover:bg-accent border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
								<kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
									<span className="text-xs">⌘</span>K
								</kbd>
							</div>

							{/* Autocomplete Dropdown */}
							{showAutocomplete && searchResults.length > 0 && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-2xl shadow-black/20 z-[100] overflow-hidden max-h-[500px] overflow-y-auto">
									{searchResults.map((product) => (
										<Link
											key={product.id}
											href={`/products/${product.id}`}
											onClick={() => {
												setShowAutocomplete(false);
												setSearchQuery("");
											}}
											className="flex items-center gap-4 p-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
										>
											<div className="relative w-12 h-12 rounded-lg overflow-hidden bg-accent shrink-0">
												<Image
													src={product.images[0] || "/placeholder.svg"}
													alt={product.title}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-semibold line-clamp-1 mb-0.5">
													{product.title}
												</h4>
												<div className="flex items-center gap-2">
													<span className="text-sm font-bold text-primary">
														GH₵{product.price}
													</span>
													{product.compareAtPrice && (
														<span className="text-xs text-muted-foreground line-through">
															GH₵{product.compareAtPrice}
														</span>
													)}
												</div>
											</div>
										</Link>
									))}
									{searchResults.length > 0 && (
										<button
											type="button"
											onClick={() => handleSearch(searchQuery)}
											className="w-full p-3 text-sm font-medium text-primary hover:bg-accent transition-colors flex items-center justify-center gap-2"
										>
											View all results for "{searchQuery}"
											<Search className="h-4 w-4" />
										</button>
									)}
								</div>
							)}
						</div>

						{/* Right: Actions */}
						<div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
							{/* Mobile Search Button */}
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 md:hidden"
								onClick={() => setSearchModalOpen(true)}
							>
								<Search className="h-5 w-5" />
							</Button>

							{/* Location Selector - Activity based */}
							<div className="hidden sm:block">
								<AuthAwareLocation />
							</div>

							{/* User Profile or Login - Activity based */}
							<AuthAwareProfile />

							{/* Cart */}
							<Link href="/cart">
								<Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 relative hover:bg-primary/10">
									<ShoppingCart className="h-5 w-5" />
									{cartCount > 0 && (
										<Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs bg-primary text-primary-foreground border-2 border-background">
											{cartCount > 99 ? '99+' : cartCount}
										</Badge>
									)}
								</Button>
							</Link>

							{/* Theme Toggle */}
							<div className="hidden sm:block">
								<AnimatedThemeToggler />
							</div>

							{/* Mobile Menu */}
							<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
										<Menu className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-80 sm:w-96">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-6 mt-6">
										{/* Main Navigation */}
										<div>
											<h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Browse</h3>
											<nav className="flex flex-col gap-1">
												{navigation.map((item) => (
													<Link
														key={item.name}
														href={item.href}
														className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
														onClick={() => setMobileMenuOpen(false)}
													>
														<item.icon className="h-5 w-5 text-primary" />
														{item.name}
													</Link>
												))}
											</nav>
										</div>

										<Separator />

										{/* Quick Links - Activity based */}
										<AuthAwareMobileMenu onLinkClickAction={() => setMobileMenuOpen(false)} />

										<Separator />

										{/* Quick Categories */}
										<div>
											<h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Quick Categories</h3>
											<div className="grid grid-cols-2 gap-2">
												<Link
													href="/search?category=textbooks"
													className="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-accent rounded-lg"
													onClick={() => setMobileMenuOpen(false)}
												>
													<BookOpen className="h-4 w-4 text-primary" />
													<span>Textbooks</span>
												</Link>
												<Link
													href="/search?category=electronics"
													className="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-accent rounded-lg"
													onClick={() => setMobileMenuOpen(false)}
												>
													<Package className="h-4 w-4 text-primary" />
													<span>Electronics</span>
												</Link>
												<Link
													href="/restaurants?category=ghanaian"
													className="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-accent rounded-lg"
													onClick={() => setMobileMenuOpen(false)}
												>
													<ChefHat className="h-4 w-4 text-primary" />
													<span>Ghanaian</span>
												</Link>
												<Link
													href="/stores?category=fashion"
													className="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-accent rounded-lg"
													onClick={() => setMobileMenuOpen(false)}
												>
													<Store className="h-4 w-4 text-primary" />
													<span>Fashion</span>
												</Link>
											</div>
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>

				{/* Mobile Search Bar */}
				<div className="md:hidden px-4 pb-3 border-t border-border">
					<button
						type="button"
						onClick={() => setSearchModalOpen(true)}
						className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground bg-accent/50 border border-border rounded-lg"
					>
						<Search className="h-4 w-4" />
						<span>Search VarsityMart...</span>
					</button>
				</div>
			</header>

			{/* Search Modal */}
			<SearchModal
				open={searchModalOpen}
				onOpenChange={setSearchModalOpen}
			/>
		</>
	);
}
