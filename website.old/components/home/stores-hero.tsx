"use client";
import { PageHeroSlider } from "./page-hero-slider";

const storeSlides = [
	{
		title: "Campus Stores & Boutiques",
		subtitle: "Stores",
		description:
			"Fashion, accessories, electronics, and everything you need for campus life. Shop from verified student-run businesses.",
		image:
			"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
		cta: "Explore Stores",
		ctaLink: "/stores",
	},
	{
		title: "Student-Run Businesses",
		subtitle: "Verified Sellers",
		description:
			"Support your fellow students and discover unique products. All stores are verified and trusted by the campus community.",
		image:
			"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
		cta: "Browse Stores",
		ctaLink: "/stores",
	},
	{
		title: "Everything You Need",
		subtitle: "One Stop Shop",
		description:
			"From textbooks to tech, fashion to furniture - find it all in one place. Convenient shopping right on campus.",
		image:
			"https://images.unsplash.com/photo-1555529908-3b01d1190a19?w=1200&h=600&fit=crop",
		cta: "Shop Now",
		ctaLink: "/stores",
	},
];

export function StoresHero() {
	return <PageHeroSlider slides={storeSlides} />;
}

