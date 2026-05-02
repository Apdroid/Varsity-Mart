"use client";
import { PageHeroSlider } from "./page-hero-slider";

const productSlides = [
	{
		title: "Everything You Need",
		subtitle: "Products",
		description:
			"From textbooks to tech, snacks to study essentials - find it all in one place. Thousands of items from verified sellers.",
		image:
			"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
		cta: "Shop Products",
		ctaLink: "/products",
	},
	{
		title: "Great Deals on Campus",
		subtitle: "Student Prices",
		description:
			"Save money on everything you need. Textbooks, electronics, furniture, and more - all at student-friendly prices.",
		image:
			"https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=600&fit=crop",
		cta: "Browse Deals",
		ctaLink: "/products",
	},
	{
		title: "Buy & Sell with Ease",
		subtitle: "Marketplace",
		description:
			"Connect with students on campus. Buy what you need, sell what you don't. Simple, safe, and secure transactions.",
		image:
			"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
		cta: "Start Shopping",
		ctaLink: "/products",
	},
];

export function ProductsHero() {
	return <PageHeroSlider slides={productSlides} />;
}

