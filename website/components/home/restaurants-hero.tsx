"use client";
import { PageHeroSlider } from "./page-hero-slider";

const restaurantSlides = [
	{
		title: "Delicious Campus Dining",
		subtitle: "Restaurants",
		description:
			"Fresh meals, quick bites, and campus favorites delivered to your door. From traditional Ghanaian cuisine to international flavors.",
		image:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop",
		cta: "Browse Restaurants",
		ctaLink: "/restaurants",
	},
	{
		title: "Authentic Ghanaian Cuisine",
		subtitle: "Local Favorites",
		description:
			"Experience the best of Ghanaian food right on campus. Waakye, Jollof, Banku, and more - all made fresh daily.",
		image:
			"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&h=600&fit=crop",
		cta: "Order Now",
		ctaLink: "/restaurants",
	},
	{
		title: "Quick & Convenient",
		subtitle: "Fast Delivery",
		description:
			"Get your favorite meals delivered in 15-30 minutes. Perfect for busy students who need quality food on the go.",
		image:
			"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=600&fit=crop",
		cta: "Explore Menu",
		ctaLink: "/restaurants",
	},
];

export function RestaurantsHero() {
	return <PageHeroSlider slides={restaurantSlides} />;
}

