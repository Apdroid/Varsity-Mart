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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/ui/search-modal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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

export function Header() {
	const path = usePathname();
	const [activeTab, setActiveTab] = useState("/");
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const { items } = useCartStore();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
	const { scrollY } = useScroll();
	const { isAuthenticated, user } = useAuth();



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

	// Keyboard shortcut for search (Cmd+K / Ctrl+K)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchModalOpen(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

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
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						{/* Left: Logo and Navigation */}
						<div className="flex items-center gap-6 lg:gap-8">
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

						{/* Center: Search Bar */}
						<div className="flex-1 max-w-xl hidden md:block">
							<button
								type="button"
								onClick={() => setSearchModalOpen(true)}
								className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground bg-accent/50 hover:bg-accent border border-border rounded-lg transition-colors"
							>
								<Search className="h-4 w-4" />
								<span>Search for products, stores, or food...</span>
								<kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
									<span className="text-xs">⌘</span>K
								</kbd>
							</button>
						</div>

						{/* Right: Actions */}
						<div className="flex items-center gap-2 lg:gap-3">
							{/* Location Selector */}
							{isAuthenticated && <LocationSelector />}
							{!isAuthenticated && <UniversityDisplay />}

							{/* User Profile or Login */}
							{isAuthenticated ? (
								<ProfileDropdown
									align="end"
									trigger={
										<button className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all" type="button">
											<Avatar className="size-9 cursor-pointer">
												<AvatarImage src={user!?.avatar} alt="User"/>
												<AvatarFallback className="bg-primary/10 text-primary font-semibold">
													{user!?.fullName?.charAt(0) || <CircleUser size="28" />}
												</AvatarFallback>
											</Avatar>
										</button>
									}
								/>
							) : (
								<LoginButton />
							)}

							{/* Cart */}
							<Link href="/cart">
								<Button variant="ghost" size="icon" className="h-10 w-10 relative hover:bg-primary/10">
									<ShoppingCart className="h-5 w-5" />
									{cartCount > 0 && (
										<Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs bg-primary text-primary-foreground border-2 border-background">
											{cartCount > 99 ? '99+' : cartCount}
										</Badge>
									)}
								</Button>
							</Link>

							{/* Theme Toggle */}
							<AnimatedThemeToggler />

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

										{/* Quick Links */}
										{isAuthenticated && (
											<>
												<div>
													<h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Your Account</h3>
													<nav className="flex flex-col gap-1">
														<Link
															href="/wishlist"
															className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
															onClick={() => setMobileMenuOpen(false)}
														>
															<Heart className="h-5 w-5 text-primary" />
															Wishlist
														</Link>
														<Link
															href="/notifications"
															className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
															onClick={() => setMobileMenuOpen(false)}
														>
															<Bell className="h-5 w-5 text-primary" />
															Notifications
														</Link>
														<Link
															href="/account"
															className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
															onClick={() => setMobileMenuOpen(false)}
														>
															<CircleUser className="h-5 w-5 text-primary" />
															My Account
														</Link>
													</nav>
												</div>
												<Separator />
											</>
										)}

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
