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
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/lib/stores/cart.store";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Stores", href: "/stores", icon: Store },
	{ name: "Food", href: "/food", icon: ChefHat },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { items } = useCartStore();
	const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 shrink-0">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
							V
						</div>
						<span className="text-xl font-bold text-foreground hidden sm:block">
							VarsityMart
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
							>
								<item.icon className="h-4 w-4" />
								{item.name}
							</Link>
						))}
					</nav>

					{/* Spacer for better layout */}
					<div className="flex-1 hidden lg:block" />

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
								<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 border-2 border-background">
									3
								</Badge>
								<span className="sr-only">Notifications</span>
							</Button>
						</Link>

						<Link href="/cart">
							<Button variant="ghost" size="icon" className="h-9 w-9 relative">
								<ShoppingCart className="h-5 w-5" />
								{cartCount > 0 && (
									<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 border-2 border-background">
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
									<User className="h-5 w-5" />
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
