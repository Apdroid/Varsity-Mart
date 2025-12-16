"use client";
import {
	Bell,
	ChefHat,
	Heart,
	Menu,
	MessageCircle,
	Package,
	ShoppingCart,
	Store,
	User,
	X,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/lib/stores/cart.store";
import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

const navigation = [
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Stores", href: "/stores", icon: Store },
	{ name: "Food", href: "/food", icon: ChefHat },
];
const placeholders = [
	"HP Laptop",
	"Wireless Headphones",
	"Bel's Kitchen",
	"Shoes",
	"Smartphone",
];

export function Header() {
	const path = usePathname();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("/");
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { items } = useCartStore();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
	const { scrollYProgress } = useScroll();
	const searchParams = useSearchParams();

	useMotionValueEvent(scrollYProgress, "change", (current) => {
		if (typeof current === "number") {
			let direction = current! - scrollYProgress.getPrevious()!;

			if (scrollYProgress.get() < 0.02) {
				setIsScrolled(false);
			} else {
				setIsScrolled(true);
			}
		}
	});
	const handleSearch = () => {
		if (activeTab !== "/search") {
			router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
		} else {
			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.set("query", searchQuery);
			router.push(`/search?${newSearchParams.toString()}`);
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
		searchParams.get("query") && setSearchQuery(searchParams.get("query") || "");
	}, [path, searchParams]);

	return (
		<header
			className={`sticky top-0 p-2 z-50 w-full bg-background  ${isScrolled ? "border-b" : ""} `}
		>
			<div className="px-4 sm:px-6 lg:px-8">
				<div
					className={`desktop-nav box-border border-b  transition-all duration-300   `}
				>
					<div className="flex h-16 items-center justify-between gap-4 ">
						{/* Logo */}
						<div className="flex gap-4">
							<Link href="/" className="flex items-center gap-2 shrink-0 ml-2 ">
								<div className="flex h-9 w-9 items-center justify-center rounded-full font-sans text-primary bg-primary/20  font-extrabold text-2xl">
									V
								</div>
								<span className="text-xl font-black font-mono text-foreground  hidden sm:block">
									VarsityMart
								</span>
							</Link>
							<nav className="hidden md:flex  items-center gap-4">
								{navigation.map((item) => {
									return (
										<Link
											key={item.name}
											href={item.href}
											className={`relative flex items-center gap-2 px-3 py-2  text-muted-foreground  hover:text-foreground transition-colors ${activeTab === item.href ? "text-primary" : ""} `}
										>
											{/* <item.icon className="h-6 w-6 text-primary group-hover:font-bold " /> */}

											{item.name}
											{activeTab === item.href && (
												<div className="absolute bottom-0 left-0 right-0 text-center flex items-center h-0.5  bg-primary rounded-full" />
											)}
										</Link>
									);
								})}
							</nav>
						</div>
						<div className="flex-1 max-w-2xl hidden md:flex">
							<PlaceholdersAndVanishInput
								placeholders={placeholders}
								className="max-w-3xl"
								onChange={(e) => setSearchQuery(e.target.value)}
								onSubmit={handleSearch}
								newValue={searchQuery}
							/>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-1 sm:gap-2">
							<Link href="/wishlist" className="hidden sm:flex">
								<Button variant="ghost" size="icon" className="h-9 w-9">
									<Heart className="h-5 w-5" />
									<span className="sr-only">Wishlist</span>
								</Button>
							</Link>

							<Link href="/messages">
								<Button variant="ghost" size="icon" className="h-9 w-9 relative">
									<MessageCircle className="h-5 w-5" />
									<span className="sr-only">Messages</span>
								</Button>
							</Link>

							<Link href="/notifications" className="hidden sm:flex">
								<Button variant="ghost" size="icon" className="h-9 w-9 relative">
									<Bell className="h-5 w-5" />
									<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary border-2 border-background">
										3
									</Badge>
									<span className="sr-only">Notifications</span>
								</Button>
							</Link>

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

							{/* User Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-9 w-9">
										<Avatar>
											<AvatarImage src="https://github.com/shadcn.png" />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<span className="sr-only">Account</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem asChild>
										<Link href="/account" className="cursor-pointer">
											My Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/account/orders" className="cursor-pointer">
											My Orders
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/account/wishlist" className="cursor-pointer">
											Wishlist
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/sell" className="cursor-pointer">
											Start Selling
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/seller/dashboard" className="cursor-pointer">
											Seller Dashboard
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/auth/login" className="cursor-pointer">
											Sign In
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/auth/register" className="cursor-pointer">
											Create Account
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
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

					<div className="flex-1 w-full md:hidden mb-4">
						<PlaceholdersAndVanishInput
							placeholders={placeholders}
							onChange={(e) => setSearchQuery(e.target.value)}
							onSubmit={handleSearch}
							newValue={searchQuery}
						/>
					</div>
				</div>

				{/* Mobile Menu */}
				<div
					className={cn(
						"md:hidden border-t border-border overflow-hidden transition-all duration-200",
						mobileMenuOpen ? "max-h-96 py-4" : "max-h-0",
					)}
				>
					<nav className="flex flex-col gap-1">
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
					</nav>
				</div>
			</div>
		</header>
	);
}
