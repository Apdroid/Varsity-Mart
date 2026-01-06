"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const ECOMMERCE_SUGGESTIONS = {
	electronics: [
		{ name: "iPhone 15", price: "$999", image: "/iphone-15-hands.png" },
		{
			name: "MacBook Pro",
			price: "$1,999",
			image: "/silver-macbook-pro-desk.png",
		},
		{ name: "iPad Air", price: "$599", image: "/ipad-air-lifestyle.png" },
		{ name: "Apple Watch", price: "$399", image: "/smartwatch.png" },
		{ name: "AirPods Pro", price: "$249", image: "/airpods-pro-lifestyle.png" },
	],
	clothing: [
		{ name: "T-Shirts", price: "$29", image: "/plain-white-tshirt.png" },
		{ name: "Jeans", price: "$79", image: "/denim-jeans-display.png" },
		{ name: "Jackets", price: "$149", image: "/stylish-person-in-jacket.png" },
		{
			name: "Sneakers",
			price: "$129",
			image: "/diverse-sneaker-collection.png",
		},
		{ name: "Hoodies", price: "$59", image: "/hoodie.jpg" },
	],
	home: [
		{ name: "Bedding", price: "$99", image: "/cozy-bedding.png" },
		{ name: "Pillows", price: "$49", image: "/pillow.jpg" },
		{ name: "Cookware", price: "$199", image: "/various-cookware.png" },
		{ name: "Furniture", price: "$599", image: "/furniture.jpg" },
		{ name: "Decor", price: "$39", image: "/home-decor.jpg" },
	],
	books: [
		{ name: "Fiction", price: "$15", image: "/fiction-book.jpg" },
		{ name: "Self-Help", price: "$18", image: "/self-help-book.jpg" },
		{ name: "Biographies", price: "$20", image: "/biography.jpg" },
		{ name: "Cooking", price: "$35", image: "/cookbook.jpg" },
		{ name: "Tech Books", price: "$45", image: "/technology-book.jpg" },
	],
	beauty: [
		{ name: "Skincare", price: "$45", image: "/skincare.jpg" },
		{ name: "Makeup", price: "$35", image: "/makeup.jpg" },
		{ name: "Hair Care", price: "$25", image: "/hair-care.jpg" },
		{ name: "Fragrances", price: "$89", image: "/perfume.jpg" },
		{ name: "Tools", price: "$19", image: "/beauty-tools.jpg" },
	],
};

export function SearchBar() {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredSuggestions, setFilteredSuggestions] = useState<
		Array<{ name: string; price: string; image: string }>
	>([]);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setIsOpen(true);

		if (value.trim() === "") {
			setFilteredSuggestions([]);
		} else {
			const allSuggestions = Object.values(ECOMMERCE_SUGGESTIONS).flat();
			const filtered = allSuggestions
				.filter((suggestion) =>
					suggestion.name.toLowerCase().includes(value.toLowerCase()),
				)
				.slice(0, 5);
			setFilteredSuggestions(filtered);
		}
	};

	const handleSuggestionClick = (suggestion: {
		name: string;
		price: string;
		image: string;
	}) => {
		setSearchQuery(suggestion.name);
		setIsOpen(false);
		console.log("Searching for:", suggestion.name);
	};

	const handleClear = () => {
		setSearchQuery("");
		setFilteredSuggestions([]);
		inputRef.current?.focus();
	};

	const handleSearch = () => {
		if (searchQuery.trim()) {
			console.log("Performing search for:", searchQuery);
			setIsOpen(false);
		}
	};

	return (
		<div ref={containerRef} className="relative w-full max-w-5xl">
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}

			<div className="relative z-50 flex items-center gap-2">
				<div className="relative flex-1 group ">
					<Input
						ref={inputRef}
						type="text"
						placeholder="Search products, categories, brands..."
						value={searchQuery}
						onChange={handleInputChange}
						onFocus={() => searchQuery && setIsOpen(true)}
						className="pl-4 pr-10 py-5 text-base active:outline-primary focus-visible:border-primary focus-visible:ring-primary hover:border-primary"
					/>
					{searchQuery && (
						<button
							onClick={handleClear}
							className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Clear search"
						>
							<X className="w-5 h-5" />
						</button>
					)}
					<button
						onClick={handleSearch}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
						disabled={!searchQuery.trim()}
						aria-label="Search"
					>
						<Search className="w-5 h-5  text-primary group-hover:text-primary" />
					</button>
				</div>
			</div>

			{isOpen && (
				<div
					className={`absolute top-full  left-0 right-0 bg-card border border-primary shadow-lg z-50 overflow-hidden ${searchQuery.trim() === "" ? "" : "max-h-96"
						}`}
				>
					{searchQuery.trim() === "" ? (
						<div className="p-6">
							<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
								{Object.entries(ECOMMERCE_SUGGESTIONS).map(
									([category, items]) => (
										<div key={category} className="flex flex-col gap-3">
											<h3 className="text-sm font-semibold text-muted-foreground capitalize">
												{category}
											</h3>
											<div className="space-y-2 grid gap-3 grid-cols-3">
												{items.slice(0, 3).map((item) => (
													<button
														key={item.name}
														onClick={() => handleSuggestionClick(item)}
														className="w-full text-left rounded-md hover:bg-accent transition-colors flex flex-col items-start gap-2"
													>
														<img
															src={item.image || "/placeholder.svg"}
															alt={item.name}
															className="w-full h-24 object-cover rounded-md"
														/>
														<div className="p-2">
															<p className="text-xs font-medium truncate">
																{item.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{item.price}
															</p>
														</div>
													</button>
												))}
											</div>
										</div>
									),
								)}
							</div>
						</div>
					) : filteredSuggestions.length > 0 ? (
						<div className="p-2 overflow-y-auto">
							{filteredSuggestions.map((suggestion) => (
								<button
									type="button"
									key={suggestion.name}
									onClick={() => handleSuggestionClick(suggestion)}
									className="w-full text-left px-3 py-2.5 rounded-md hover:bg-accent transition-colors flex items-center gap-3"
								>
									<Image
										width={200}
										height={200}
										src={suggestion.image || "/placeholder.svg"}
										alt={suggestion.name}
										className="w-12 h-12 object-cover rounded-md"
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{suggestion.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{suggestion.price}
										</p>
									</div>
								</button>
							))}
						</div>
					) : (
						<div className="p-4 text-center text-muted-foreground text-sm">
							No products found matching &quot;{searchQuery}&quot;
						</div>
					)}
				</div>
			)}
		</div>
	);
}
