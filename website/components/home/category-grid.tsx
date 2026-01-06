"use client";
import Image from "next/image"
import Link from "next/link";

interface Category {
	id: string;
	title: string;
	description: string;
	image: string;
	colSpan: string;
	rowSpan: string;
}

const CATEGORIES: Category[] = [
	{
		id: "products",
		title: "Products",
		description: "Shop electronics, fashion, and more",
		image: "/e-commerce-products-shopping-online-store.jpg",
		colSpan: "md:col-span-2",
		rowSpan: "md:row-span-2",
	},

	{
		id: "restaurants",
		title: "Restaurants",
		description: "Discover dining experiences",
		image: "/restaurant-fine-dining-food-service.jpg",
		colSpan: "",
		rowSpan: "md:row-span-2",
	},
	{
		id: "stores",
		title: "Stores",
		description: "Browse nearby retail stores",
		image: "/retail-store-shopping-mall-storefront.jpg",
		colSpan: "",
		rowSpan: "",
	},
	{
		id: "food-stalls",
		title: "Food Stalls",
		description: "Find street food and local bites",
		image: "/food-stall-street-food-vendor-market.jpg",
		colSpan: "",
		rowSpan: "",
	},
];

export function CategoryGrid() {
	return (
		<div className=" relative max-w-460 h-120 mx-auto my-4  ">
			<div className="relative grid grid-cols-1  md:grid-cols-4 md:grid-rows-2 gap-2 h-full">
				{CATEGORIES.map((category) => (
					<div
						key={category.id}
						className={`group cursor-pointer w-full h-full rounded-sm ${category.colSpan} ${category.rowSpan}`}
					>
						<Link href={`/category/${category.id}`} className="w-full h-full">
							<div className="relative w-full h-full  overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
								<Image
									width={500}
									height={500}
									src={category.image || "/placeholder.svg"}
									alt={category.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

								<div className="absolute inset-0 flex flex-col justify-end p-6">
									<h2 className="text-xl font-bold text-white mb-2">
										{category.title}
									</h2>
									<p className="text-sm text-gray-100">
										{category.description}
									</p>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
