"use client";
import {
	ChefHat,
	Menu,
	Package,
	Search,
	ShoppingCart,
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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/queries/useCart";
import { useSearchProducts } from "@/hooks/queries/useProducts";
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
	const { items } = useCart();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
	const { scrollY } = useScroll();
	const router = useRouter();

	const { data: searchData } = useSearchProducts(searchQuery.trim().length > 1 ? searchQuery : "");
	const searchResults = searchData?.data?.products?.slice(0, 6) ?? [];

	useMotionValueEvent(scrollY, "change", (current) => {
		if (typeof current === "number") {
			const scrollDifference = current - lastScrollY;
			if (current < 10) {
				setIsVisible(true);
			} else if (scrollDifference < 0) {
				setIsVisible(true);
			} else if (scrollDifference > 0) {
				setIsVisible(false);
			}
			setLastScrollY(current);
		}
	});

	useEffect(() => {
		for (const item of navigation) {
			if (path.endsWith(item.href)) {
				setActiveTab(item.href);
				break;
			}
		}
	}, [path]);

	useEffect(() => {
		setShowAutocomplete(searchQuery.trim().length > 1 && searchResults.length > 0);
	}, [searchQuery, searchResults.length]);

	const searchRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowAutocomplete(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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
				"fixed p-1 top-0 left-0 right-0 z-50 border-b transition-transform duration-200",
				isVisible ? "translate-y-0" : "-translate-y-full",
			)}
			style={{
				background: "var(--ink)",
				borderColor: "rgba(255,255,255,0.08)",
				color: "rgba(255,255,255,0.9)",
			}}
		>
				<div className="container mx-auto px-4">
					<div className="flex h-14 items-center justify-between gap-4">
						{/* Left: Logo and Nav */}
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
												"flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors pb-1",
								isActive
									? "border-b-2"
									: "opacity-60 hover:opacity-100",
											)}
										>
											<item.icon className="h-4 w-4" />
											{item.name}
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Center: Search */}
						<div
							className="flex-1 max-w-xl hidden md:block relative"
							ref={searchRef}
						>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									ref={searchInputRef}
									type="text"
									placeholder="Search products, stores..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSearch(searchQuery);
										if (e.key === "Escape") {
											setShowAutocomplete(false);
											setSearchQuery("");
										}
									}}
									onFocus={() => {
										if (
											searchQuery.trim().length > 1 &&
											searchResults.length > 0
										) {
											setShowAutocomplete(true);
										}
									}}
									className="w-full pl-10 pr-16 py-2 text-sm rounded-md focus:outline-none focus:ring-1"
								style={{
									background: "rgba(255,255,255,0.08)",
									border: "1px solid rgba(255,255,255,0.12)",
									color: "rgba(255,255,255,0.9)",
								}}
								/>
								<kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
									⌘K
								</kbd>
							</div>

						{showAutocomplete && searchResults.length > 0 && (
							<div
								className="absolute top-full left-0 right-0 mt-1 rounded-[var(--r)] shadow-[var(--sh-lg)] z-50 overflow-hidden"
								style={{ background: "var(--surface)", border: "1px solid var(--ink-4)" }}
							>
								{searchResults.map((product) => (
									<Link
										key={product.id}
										href={`/products/${product.id}`}
										onClick={() => {
											setShowAutocomplete(false);
											setSearchQuery("");
										}}
										className="flex items-center gap-3 p-2 transition-colors"
										style={{ color: "var(--ink)" }}
									>
										<div
											className="relative w-10 h-10 rounded overflow-hidden shrink-0"
											style={{ background: "var(--bg)" }}
										>
											<Image
												src={product.images?.[0]?.url || product.images?.[0]?.optimized_url || "/placeholder.svg"}
												alt={product.title}
											fill
											sizes="40px"
											className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
												{product.title}
											</p>
											<p className="text-sm font-semibold font-price" style={{ color: "var(--orange)", fontFamily: "var(--font-mono)" }}>
												GH₵{product.price}
											</p>
										</div>
									</Link>
								))}
								<button
									type="button"
									onClick={() => handleSearch(searchQuery)}
									className="w-full p-2 text-sm font-medium transition-colors"
									style={{
										color: "var(--orange)",
										borderTop: "1px solid var(--ink-4)",
									}}
								>
									View all results
								</button>
							</div>
						)}
						</div>

						{/* Right: Actions */}
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setSearchModalOpen(true)}
							>
								<Search className="h-5 w-5" />
							</Button>

							<div className="hidden sm:block">
								<AuthAwareLocation />
							</div>

							<AuthAwareProfile />

							<Link href="/cart">
								<Button variant="ghost" size="icon" className="relative">
									<ShoppingCart className="h-5 w-5" />
									{cartCount > 0 && (
										<Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs">
											{cartCount > 99 ? "99+" : cartCount}
										</Badge>
									)}
								</Button>
							</Link>

							<div className="hidden sm:block">
								<AnimatedThemeToggler />
							</div>

							<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="lg:hidden">
										<Menu className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-72">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-4 mt-4">
										<nav className="flex flex-col gap-1">
											{navigation.map((item) => (
												<Link
													key={item.name}
													href={item.href}
													className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
													onClick={() => setMobileMenuOpen(false)}
												>
													<item.icon className="h-4 w-4 text-primary" />
													{item.name}
												</Link>
											))}
										</nav>
										<Separator />
										<AuthAwareMobileMenu
											onLinkClickAction={() => setMobileMenuOpen(false)}
										/>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</header>

			<SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
		</>
	);
}
