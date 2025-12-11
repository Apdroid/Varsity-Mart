"use client";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronDown,
	Menu,
	Moon,
	Search,
	ShoppingBag,
	ShoppingCart,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { totalItems } = useCart();

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
			{/* Main Nav */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 gap-4">
					<Link to="/" className="flex items-center gap-2 shrink-0">
						<motion.div
							className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ShoppingBag className="w-5 h-5 text-white" />
						</motion.div>
						<span className="font-bold text-xl text-[#0f172a] hidden sm:block">
							Varsity Mart
						</span>
					</Link>

					{/* Search Bar - Desktop */}
					<div className="hidden md:flex flex-1 max-w-xl">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search products, food, stores..."
								className="pl-10 pr-4 h-10 w-full bg-secondary border-0 focus-visible:ring-[#1e3a8a]"
							/>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<Link to="/checkout">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button variant="ghost" size="icon" className="relative">
									<ShoppingCart className="w-5 h-5 text-[#0f172a]" />
									<AnimatePresence>
										{totalItems > 0 && (
											<motion.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												exit={{ scale: 0 }}
												className="absolute -top-1 -right-1 bg-[#1e3a8a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
											>
												{totalItems > 99 ? "99+" : totalItems}
											</motion.span>
										)}
									</AnimatePresence>
								</Button>
							</motion.div>
						</Link>
						<Button
							variant="ghost"
							className="hidden sm:inline-flex text-[#0f172a] hover:text-[#1e3a8a]"
						>
							Login
						</Button>
						<Button className="bg-[#1e3a8a] hover:bg-[#3b82f6] text-white">
							Sign Up
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			<div className="hidden md:block border-t border-border bg-secondary/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-6 h-10 text-sm">
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 text-[#0f172a] hover:text-[#1e3a8a] transition-colors">
								Categories <ChevronDown className="w-4 h-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Electronics</DropdownMenuItem>
								<DropdownMenuItem>Books</DropdownMenuItem>
								<DropdownMenuItem>Fashion</DropdownMenuItem>
								<DropdownMenuItem>Food</DropdownMenuItem>
								<DropdownMenuItem>Housing</DropdownMenuItem>
								<DropdownMenuItem>Stationery</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Link
							to="/restaurants"
							className="text-[#0f172a] hover:text-[#1e3a8a] transition-colors"
						>
							Restaurants
						</Link>
						<a
							href="#night-shop"
							className="flex items-center gap-1 text-[#0f172a] hover:text-[#1e3a8a] transition-colors"
						>
							Night Shop <Moon className="w-3 h-3" />
						</a>
						<a
							href="#"
							className="text-[#0ea5e9] font-medium hover:text-[#3b82f6] transition-colors"
						>
							Deals
						</a>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="md:hidden border-t border-border bg-white overflow-hidden"
					>
						<div className="px-4 py-3 space-y-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search products, food, stores..."
									className="pl-10 pr-4 h-10 w-full bg-secondary border-0"
								/>
							</div>
							<div className="flex flex-col gap-2 pt-2">
								<a href="#" className="py-2 text-[#0f172a] font-medium">
									Categories
								</a>
								<Link to="/restaurants" className="py-2 text-[#0f172a]">
									Restaurants
								</Link>
								<a href="#night-shop" className="py-2 text-[#0f172a]">
									Night Shop
								</a>
								<a href="#" className="py-2 text-[#0ea5e9] font-medium">
									Deals
								</a>
								<Link
									to="/checkout"
									className="py-2 text-[#0f172a] flex items-center gap-2"
								>
									<ShoppingCart className="w-4 h-4" />
									Cart {totalItems > 0 && `(${totalItems})`}
								</Link>
								<Button
									variant="ghost"
									className="justify-start px-0 text-[#0f172a]"
								>
									Login
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
