"use client";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const HeaderCategories = () => {
	const categories = [
		{
			id: "products",
			name: "Products",
			subcategories: [
				{
					title: "Electronics",
					items: [
						"Smartphones",
						"Laptops",
						"Tablets",
						"Cameras",
						"Audio",
						"Gaming",
						"Accessories",
					],
				},
				{
					title: "Fashion",
					items: [
						"Men's Clothing",
						"Women's Clothing",
						"Kids Fashion",
						"Shoes",
						"Bags",
						"Jewelry",
					],
				},
				{
					title: "Home & Living",
					items: [
						"Furniture",
						"Kitchen",
						"Bedding",
						"Decor",
						"Appliances",
						"Storage",
					],
				},
			],
			featured: [
				{
					title: "New Arrivals",
					subtitle: "Latest Collection",
					bg: "bg-gradient-to-br from-blue-600 to-blue-800",
					image: "✨",
				},
				{
					title: "Best Sellers",
					subtitle: "Top Rated Items",
					bg: "bg-gradient-to-br from-purple-600 to-purple-800",
					image: "🔥",
				},
			],
		},
		{
			id: "stores",
			name: "Stores",
			subcategories: [
				{
					title: "By Category",
					items: [
						"Electronics Store",
						"Fashion Boutique",
						"Home Goods",
						"Sports & Outdoors",
						"Beauty & Health",
						"Books & Media",
					],
				},
				{
					title: "By Brand",
					items: [
						"Premium Brands",
						"Local Shops",
						"International",
						"Luxury",
						"Budget Friendly",
						"Eco-Friendly",
					],
				},
				{
					title: "Services",
					items: [
						"Same Day Delivery",
						"Click & Collect",
						"Gift Wrapping",
						"Personal Shopping",
						"Returns & Exchange",
					],
				},
			],
			featured: [
				{
					title: "Featured Stores",
					subtitle: "Curated Selection",
					bg: "bg-gradient-to-br from-emerald-600 to-emerald-800",
					image: "🏬",
				},
				{
					title: "Store Locator",
					subtitle: "Find Stores Near You",
					bg: "bg-gradient-to-br from-cyan-600 to-cyan-800",
					image: "📍",
				},
			],
		},
		{
			id: "restaurants",
			name: "Restaurants",
			subcategories: [
				{
					title: "By Cuisine",
					items: [
						"Italian",
						"Chinese",
						"Japanese",
						"Mexican",
						"Indian",
						"Thai",
						"Mediterranean",
					],
				},
				{
					title: "By Type",
					items: [
						"Fine Dining",
						"Casual Dining",
						"Fast Casual",
						"Cafe",
						"Bistro",
						"Buffet",
					],
				},
				{
					title: "Special",
					items: [
						"Vegetarian",
						"Vegan Options",
						"Halal",
						"Kosher",
						"Family-Friendly",
						"Romantic",
					],
				},
			],
			featured: [
				{
					title: "Top Rated",
					subtitle: "Customer Favorites",
					bg: "bg-gradient-to-br from-orange-600 to-orange-800",
					image: "⭐",
				},
				{
					title: "New Restaurants",
					subtitle: "Just Opened",
					bg: "bg-gradient-to-br from-pink-600 to-pink-800",
					image: "🍽️",
				},
			],
		},
		{
			id: "stalls",
			name: "Food Stalls",
			subcategories: [
				{
					title: "By Food Type",
					items: [
						"Street Food",
						"BBQ",
						"Tacos",
						"Noodles",
						"Burgers",
						"Pizza",
						"Desserts",
					],
				},
				{
					title: "By Location",
					items: [
						"Food Court",
						"Market Square",
						"Park Plaza",
						"Beach Front",
						"Downtown",
					],
				},
				{
					title: "Quick Bites",
					items: [
						"Under $10",
						"Lunch Specials",
						"Breakfast",
						"Late Night",
						"Vegetarian",
					],
				},
			],
			featured: [
				{
					title: "Street Favorites",
					subtitle: "Local Delights",
					bg: "bg-gradient-to-br from-yellow-600 to-yellow-800",
					image: "🌮",
				},
				{
					title: "Night Market",
					subtitle: "Open Till Late",
					bg: "bg-gradient-to-br from-indigo-600 to-indigo-800",
					image: "🍜",
				},
			],
		},
	];

	return (
		<div className="bg-transparent  flex">
			<div className="px-10 ">
				<NavigationMenu className="py-2">
					<NavigationMenuList className="gap-2">
						{categories.map((category) => (
							<NavigationMenuItem key={category.id}>
								<NavigationMenuTrigger className="text-base font-medium">
									{category.name}
								</NavigationMenuTrigger>
								<NavigationMenuContent className="data-[state=open]:animate-in data-[state=closed]:animate-out">
									<div className="w-screen bg-background  shadow-xl border-t">
										<div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-8">
											<div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
												{category.subcategories.map((subcategory, idx) => (
													<div key={idx}>
														<h3 className="font-bold  mb-4 text-sm">
															{subcategory.title}
														</h3>
														<ul className="space-y-2">
															{subcategory.items.map((item, itemIdx) => (
																<li key={itemIdx}>
																	<NavigationMenuLink asChild>
																		<a
																			href="#"
																			className="block text-sm rounded px-2 py-1.5 transition-colors"
																		>
																			{item}
																		</a>
																	</NavigationMenuLink>
																</li>
															))}
														</ul>
													</div>
												))}
											</div>

											<div className="w-96 space-y-4">
												{category.featured.map((featured, idx) => (
													<Card
														key={idx}
														className={`${featured.bg} text-white border-0 cursor-pointer hover:scale-105 transition-transform overflow-hidden`}
													>
														<CardHeader className="relative pb-2">
															<CardTitle className="text-lg">
																{featured.title}
															</CardTitle>
															<CardDescription className="text-white/90">
																{featured.subtitle}
															</CardDescription>
															<div className="absolute bottom-0 right-2 text-6xl opacity-20">
																{featured.image}
															</div>
														</CardHeader>
													</Card>
												))}
											</div>
										</div>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</div>
	);
};
