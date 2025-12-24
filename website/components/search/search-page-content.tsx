"use client";

import type React from "react";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Search,
	SlidersHorizontal,
	X,
	ChevronDown,
	Grid3X3,
	LayoutList,
	Package,
	Store,
	UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";

// Categories with subcategories
const categories = [
	{ id: "electronics", name: "Electronics", count: 1240 },
	{ id: "fashion", name: "Fashion", count: 890 },
	{ id: "books", name: "Books & Stationery", count: 567 },
	{ id: "beauty", name: "Beauty & Health", count: 432 },
	{ id: "sports", name: "Sports & Fitness", count: 321 },
	{ id: "home", name: "Dorm Essentials", count: 654 },
	{ id: "gaming", name: "Gaming", count: 234 },
	{ id: "services", name: "Services", count: 178 },
];

const conditions = [
	{ id: "new", label: "New" },
	{ id: "like-new", label: "Like New" },
	{ id: "good", label: "Good" },
	{ id: "fair", label: "Fair" },
];

const sortOptions = [
	{ value: "relevance", label: "Most Relevant" },
	{ value: "newest", label: "Newest First" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "popular", label: "Most Popular" },
];

// Mock search results
const mockProducts: Product[] = [
	{
		id: "1",
		title: 'MacBook Pro 13" M2 - Perfect Condition',
		description: "Barely used MacBook Pro with Apple M2 chip",
		price: 4500,
		compareAtPrice: 5200,
		images: ["/silver-macbook-on-desk.png"],
		category: { id: "1", name: "Electronics", slug: "electronics" },
		condition: "like-new",
		quantity: 1,
		status: "active",
		sellerId: "1",
		seller: {
			id: "1",
			email: "seller@uni.edu",
			firstName: "John",
			lastName: "Doe",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 24,
		isLiked: false,
		tags: ["laptop", "apple", "macbook"],
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "2",
		title: "Calculus Textbook - Stewart 8th Edition",
		description: "Essential textbook for math majors",
		price: 85,
		images: ["/calculus-textbook.png"],
		category: { id: "2", name: "Books", slug: "books" },
		condition: "good",
		quantity: 1,
		status: "active",
		sellerId: "2",
		seller: {
			id: "2",
			email: "seller2@uni.edu",
			firstName: "Jane",
			lastName: "Smith",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 12,
		tags: ["textbook", "math"],
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "3",
		title: "Wireless Earbuds - Sony WF-1000XM4",
		description: "Premium noise cancelling earbuds",
		price: 650,
		compareAtPrice: 850,
		images: ["/wireless-earbuds-sony.jpg"],
		category: { id: "1", name: "Electronics", slug: "electronics" },
		condition: "new",
		quantity: 3,
		status: "active",
		sellerId: "3",
		seller: {
			id: "3",
			email: "seller3@uni.edu",
			firstName: "Mike",
			lastName: "Johnson",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 45,
		isLiked: true,
		tags: ["earbuds", "sony", "wireless"],
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "4",
		title: "Vintage Denim Jacket - Levi's",
		description: "Classic style denim jacket, size M",
		price: 120,
		images: ["/denim-jacket-vintage.jpg"],
		category: { id: "3", name: "Fashion", slug: "fashion" },
		condition: "good",
		quantity: 1,
		status: "active",
		sellerId: "4",
		seller: {
			id: "4",
			email: "seller4@uni.edu",
			firstName: "Sarah",
			lastName: "Lee",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 18,
		tags: ["jacket", "fashion", "vintage"],
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "5",
		title: "Study Desk Lamp - LED with USB Port",
		description: "Adjustable LED lamp perfect for studying",
		price: 75,
		images: ["/led-desk-lamp-modern.jpg"],
		category: { id: "6", name: "Dorm Essentials", slug: "home" },
		condition: "new",
		quantity: 5,
		status: "active",
		sellerId: "5",
		seller: {
			id: "5",
			email: "seller5@uni.edu",
			firstName: "Alex",
			lastName: "Wong",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 32,
		tags: ["lamp", "study", "led"],
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "6",
		title: "Psychology 101 Notes Bundle",
		description: "Complete semester notes with summaries",
		price: 25,
		images: ["/study-notes-notebook.jpg"],
		category: { id: "2", name: "Books", slug: "books" },
		condition: "new",
		quantity: 1,
		status: "active",
		sellerId: "6",
		seller: {
			id: "6",
			email: "seller6@uni.edu",
			firstName: "Emma",
			lastName: "Davis",
			role: "seller",
			isEmailVerified: true,
			isPhoneVerified: false,
			kycStatus: "approved",
			createdAt: "",
			updatedAt: "",
		},
		likesCount: 56,
		tags: ["notes", "psychology", "study"],
		createdAt: "",
		updatedAt: "",
	},
];

type SearchType = "products" | "stores" | "food";

export function SearchPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("query") || "",
	);
	const [searchType, setSearchType] = useState<SearchType>(
		(searchParams.get("type") as SearchType) || "products",
	);
	const [selectedCategory, setSelectedCategory] = useState(
		searchParams.get("category") || "",
	);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState([0, 10000]);
	const [sortBy, setSortBy] = useState("relevance");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [filtersOpen, setFiltersOpen] = useState(false);

	// Collapsible states
	const [categoryOpen, setCategoryOpen] = useState(true);
	const [conditionOpen, setConditionOpen] = useState(true);
	const [priceOpen, setPriceOpen] = useState(true);

	const activeFiltersCount = [
		selectedCategory,
		selectedConditions.length > 0,
		priceRange[0] > 0 || priceRange[1] < 10000,
	].filter(Boolean).length;

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateSearchParams({ q: searchQuery });
	};

	const updateSearchParams = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});
		router.push(`/search?${params.toString()}`);
	};

	const clearAllFilters = () => {
		setSelectedCategory("");
		setSelectedConditions([]);
		setPriceRange([0, 10000]);
		router.push("/search");
	};

	const toggleCondition = (conditionId: string) => {
		setSelectedConditions((prev) =>
			prev.includes(conditionId)
				? prev.filter((c) => c !== conditionId)
				: [...prev, conditionId],
		);
	};

	const FiltersSidebar = () => (
		<div className="space-y-6">
			{/* Search Type Radio Buttons */}
			<div>
				<h3 className="font-semibold text-foreground mb-3">Search In</h3>
				<RadioGroup
					value={searchType}
					onValueChange={(v) => setSearchType(v as SearchType)}
					className="space-y-2"
				>
					<div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
						<RadioGroupItem value="products" id="products" />
						<Label
							htmlFor="products"
							className="flex items-center gap-2 cursor-pointer flex-1"
						>
							<Package className="h-4 w-4 text-muted-foreground" />
							Products
						</Label>
					</div>
					<div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
						<RadioGroupItem value="stores" id="stores" />
						<Label
							htmlFor="stores"
							className="flex items-center gap-2 cursor-pointer flex-1"
						>
							<Store className="h-4 w-4 text-muted-foreground" />
							Stores
						</Label>
					</div>
					<div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
						<RadioGroupItem value="food" id="food" />
						<Label
							htmlFor="food"
							className="flex items-center gap-2 cursor-pointer flex-1"
						>
							<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
							Food & Restaurants
						</Label>
					</div>
				</RadioGroup>
			</div>

			<div className="border-t border-border" />

			{/* Categories */}
			<Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
				<CollapsibleTrigger className="flex items-center justify-between w-full py-2">
					<h3 className="font-semibold text-foreground">Categories</h3>
					<ChevronDown
						className={cn(
							"h-4 w-4 transition-transform",
							categoryOpen && "rotate-180",
						)}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-2">
					<RadioGroup
						value={selectedCategory}
						onValueChange={setSelectedCategory}
						className="space-y-1"
					>
						<div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
							<RadioGroupItem value="" id="all-categories" />
							<Label
								htmlFor="all-categories"
								className="cursor-pointer flex-1 text-sm"
							>
								All Categories
							</Label>
						</div>
						{categories.map((category) => (
							<div
								key={category.id}
								className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
							>
								<RadioGroupItem value={category.id} id={category.id} />
								<Label
									htmlFor={category.id}
									className="cursor-pointer flex-1 text-sm flex justify-between"
								>
									<span>{category.name}</span>
									<span className="text-muted-foreground">({category.count})</span>
								</Label>
							</div>
						))}
					</RadioGroup>
				</CollapsibleContent>
			</Collapsible>

			<div className="border-t border-border" />

			{/* Condition */}
			<Collapsible open={conditionOpen} onOpenChange={setConditionOpen}>
				<CollapsibleTrigger className="flex items-center justify-between w-full py-2">
					<h3 className="font-semibold text-foreground">Condition</h3>
					<ChevronDown
						className={cn(
							"h-4 w-4 transition-transform",
							conditionOpen && "rotate-180",
						)}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-2 space-y-1">
					{conditions.map((condition) => (
						<div
							key={condition.id}
							className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
						>
							<Checkbox
								id={`condition-${condition.id}`}
								checked={selectedConditions.includes(condition.id)}
								onCheckedChange={() => toggleCondition(condition.id)}
							/>
							<Label
								htmlFor={`condition-${condition.id}`}
								className="cursor-pointer flex-1 text-sm"
							>
								{condition.label}
							</Label>
						</div>
					))}
				</CollapsibleContent>
			</Collapsible>

			<div className="border-t border-border" />

			{/* Price Range */}
			<Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
				<CollapsibleTrigger className="flex items-center justify-between w-full py-2">
					<h3 className="font-semibold text-foreground">Price Range</h3>
					<ChevronDown
						className={cn("h-4 w-4 transition-transform", priceOpen && "rotate-180")}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-4">
					<Slider
						value={priceRange}
						onValueChange={setPriceRange}
						min={0}
						max={10000}
						step={100}
						className="mb-4"
					/>
					<div className="flex items-center gap-2">
						<div className="flex-1">
							<Label className="text-xs text-muted-foreground">Min</Label>
							<Input
								type="number"
								value={priceRange[0]}
								onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
								className="h-8 text-sm"
							/>
						</div>
						<span className="text-muted-foreground mt-4">-</span>
						<div className="flex-1">
							<Label className="text-xs text-muted-foreground">Max</Label>
							<Input
								type="number"
								value={priceRange[1]}
								onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
								className="h-8 text-sm"
							/>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>

			{/* Clear Filters */}
			{activeFiltersCount > 0 && (
				<Button
					variant="outline"
					className="w-full bg-transparent"
					onClick={clearAllFilters}
				>
					Clear All Filters
				</Button>
			)}
		</div>
	);

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
			{/* Search Bar */}

			{/* Active Filters */}
			{(selectedCategory || selectedConditions.length > 0) && (
				<div className="flex flex-wrap items-center gap-2 mb-4">
					<span className="text-sm text-muted-foreground">Active filters:</span>
					{selectedCategory && (
						<Badge variant="secondary" className="gap-1">
							{categories.find((c) => c.id === selectedCategory)?.name}
							<button onClick={() => setSelectedCategory("")}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{selectedConditions.map((cond) => (
						<Badge key={cond} variant="secondary" className="gap-1">
							{conditions.find((c) => c.id === cond)?.label}
							<button onClick={() => toggleCondition(cond)}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
					<button
						onClick={clearAllFilters}
						className="text-sm text-primary hover:underline"
					>
						Clear all
					</button>
				</div>
			)}

			<div className="flex gap-8">
				{/* Desktop Filters Sidebar */}
				<aside className="hidden lg:block w-64 shrink-0">
					<div className="sticky top-24">
						<FiltersSidebar />
					</div>
				</aside>

				{/* Main Content */}
				<div className="flex-1 min-w-0">
					{/* Toolbar */}
					<div className="flex items-center justify-between gap-4 mb-6">
						<p className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">
								{mockProducts.length}
							</span>{" "}
							results
							{searchQuery && (
								<>
									{" "}
									for &quot;
									<span className="font-medium text-foreground">{searchQuery}</span>
									&quot;
								</>
							)}
						</p>

						<div className="flex items-center gap-2">
							{/* Mobile Filters Button */}
							<Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="lg:hidden gap-2 bg-transparent"
									>
										<SlidersHorizontal className="h-4 w-4" />
										Filters
										{activeFiltersCount > 0 && (
											<Badge className="h-5 w-5 p-0 flex items-center justify-center bg-emerald-600">
												{activeFiltersCount}
											</Badge>
										)}
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-80 overflow-y-auto">
									<SheetHeader>
										<SheetTitle>Filters</SheetTitle>
									</SheetHeader>
									<div className="mt-6">
										<FiltersSidebar />
									</div>
								</SheetContent>
							</Sheet>

							{/* Sort */}
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px] h-9">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{sortOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* View Toggle */}
							<div className="hidden sm:flex items-center border border-border rounded-md">
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"h-9 w-9 rounded-r-none",
										viewMode === "grid" && "bg-muted",
									)}
									onClick={() => setViewMode("grid")}
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"h-9 w-9 rounded-l-none",
										viewMode === "list" && "bg-muted",
									)}
									onClick={() => setViewMode("list")}
								>
									<LayoutList className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Results Grid */}
					{mockProducts.length > 0 ? (
						<div
							className={cn(
								viewMode === "grid"
									? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
									: "flex flex-col gap-4",
							)}
						>
							{mockProducts.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="font-semibold text-lg text-foreground mb-2">
								No results found
							</h3>
							<p className="text-muted-foreground mb-4">
								Try adjusting your search or filters to find what you&apos;re looking
								for.
							</p>
							<Button variant="outline" onClick={clearAllFilters}>
								Clear filters
							</Button>
						</div>
					)}

					{/* Load More */}
					{mockProducts.length > 0 && (
						<div className="mt-8 text-center">
							<Button variant="outline" size="lg">
								Load More
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
