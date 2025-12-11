import {
	BadgeCheck,
	ChevronLeft,
	ChevronRight,
	MapPin,
	Star,
} from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const products = [
	{
		id: 1,
		title: "iPhone 14 Pro - Excellent Condition",
		price: "GH₵ 4,500",
		rating: 4.9,
		reviews: 23,
		condition: "Used",
		location: "Main Campus",
		verified: true,
		image: "/iphone-14-pro.png",
	},
	{
		id: 2,
		title: "Introduction to Algorithms Textbook",
		price: "GH₵ 120",
		rating: 4.8,
		reviews: 45,
		condition: "Like New",
		location: "Library Block",
		verified: true,
		image: "/algorithms-textbook.jpg",
	},
	{
		id: 3,
		title: "Nike Air Jordan 1 High - Size 42",
		price: "GH₵ 890",
		rating: 5.0,
		reviews: 12,
		condition: "New",
		location: "Hostel A",
		verified: true,
		image: "/nike-air-jordan-sneakers.jpg",
	},
	{
		id: 4,
		title: "MacBook Air M2 - 256GB",
		price: "GH₵ 8,200",
		rating: 4.7,
		reviews: 18,
		condition: "Used",
		location: "Engineering Block",
		verified: true,
		image: "/macbook-air-laptop.jpg",
	},
	{
		id: 5,
		title: "Sony WH-1000XM5 Headphones",
		price: "GH₵ 1,800",
		rating: 4.9,
		reviews: 31,
		condition: "New",
		location: "Main Campus",
		verified: true,
		image: "/sony-headphones.png",
	},
	{
		id: 6,
		title: "PS5 Digital Edition + Games",
		price: "GH₵ 5,500",
		rating: 4.8,
		reviews: 8,
		condition: "Used",
		location: "Hostel B",
		verified: true,
		image: "/playstation-5-console.png",
	},
	{
		id: 7,
		title: "Desk Lamp with Wireless Charger",
		price: "GH₵ 180",
		rating: 4.6,
		reviews: 56,
		condition: "New",
		location: "Main Campus",
		verified: false,
		image: "/modern-desk-lamp.png",
	},
	{
		id: 8,
		title: "Canon EOS R50 Camera Kit",
		price: "GH₵ 6,800",
		rating: 5.0,
		reviews: 5,
		condition: "New",
		location: "Arts Block",
		verified: true,
		image: "/canon-camera.jpg",
	},
];

export function FeaturedProducts() {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = 320;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="py-16 md:py-20 bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl md:text-3xl font-bold text-blue-900">
						Trending on Campus
					</h2>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="hidden md:flex bg-transparent"
							onClick={() => scroll("left")}
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="hidden md:flex bg-transparent"
							onClick={() => scroll("right")}
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
						<a
							href="#"
							className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
						>
							View All →
						</a>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{products.map((product) => (
						<Card
							key={product.id}
							className="flex-shrink-0 w-[260px] md:w-[280px] bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 snap-start cursor-pointer border-0 shadow-md"
						>
							<CardContent className="p-0">
								<div className="relative aspect-square overflow-hidden rounded-t-lg bg-secondary">
									<img
										src={product.image || "/placeholder.svg"}
										alt={product.title}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
									<Badge
										className={`absolute top-3 left-3 ${
											product.condition === "New"
												? "bg-blue-600 hover:bg-blue-600"
												: "bg-blue-900 hover:bg-blue-900"
										} text-white`}
									>
										{product.condition}
									</Badge>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-blue-900 line-clamp-2 mb-2 min-h-[48px]">
										{product.title}
									</h3>
									<p className="text-xl font-bold text-blue-600 mb-2">
										{product.price}
									</p>
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
											<span className="text-sm font-medium">
												{product.rating}
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											({product.reviews})
										</span>
										{product.verified && (
											<Badge
												variant="secondary"
												className="text-xs gap-1 bg-blue-50 text-blue-700 hover:bg-blue-50"
											>
												<BadgeCheck className="w-3 h-3" />
												Verified
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-1 text-sm text-muted-foreground">
										<MapPin className="w-3 h-3" />
										{product.location}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
