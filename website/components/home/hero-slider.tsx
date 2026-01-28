"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Star, Shield, Truck } from "lucide-react";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function VarsityMartHeroSlider() {
	const progressBar = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperType | null>(null);

	const slides = [
		{
			title: "Delicious Campus Dining",
			subtitle: "🍽️ Restaurants",
			description:
				"Fresh meals, quick bites, and campus favorites delivered to your door",
			image:
				"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop",
			cta: "Browse Restaurants",
			ctaLink: "/restaurants",
			highlight: "30+ Campus Restaurants",
		},
		{
			title: "Campus Stores & Boutiques",
			subtitle: "🛍️ Stores",
			description: "Fashion, accessories, and everything you need for campus life",
			image:
				"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
			cta: "Explore Stores",
			ctaLink: "/stores",
			highlight: "Verified Campus Sellers",
		},
		{
			title: "Everything You Need",
			subtitle: "📦 Products",
			description: "From snacks to study essentials - find it all in one place",
			image:
				"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
			cta: "Shop Products",
			ctaLink: "/products",
			highlight: "1000+ Products",
		},
		{
			title: "Make Your Best Offer",
			subtitle: "💰 Special Feature",
			description: "Name your price on select items and grab amazing deals",
			image:
				"https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=600&fit=crop",
			cta: "Start Bidding",
			ctaLink: "/deals",
			highlight: "Save up to 50%",
		},
	];

	const onAutoplayTimeLeft = (_swiper: SwiperType, _time: number, progress: number) => {
		if (progressBar.current) {
			progressBar.current.style.width = `${(1 - progress) * 100}%`;
		}
	};

	return (
		<div className="relative max-w-360 my-4 mx-auto w-full h-[320px] md:h-[420px] overflow-hidden md:rounded-2xl rounded-lg bg-neutral-900 shadow-xl">
			<Swiper
				ref={swiperRef}
				modules={[Autoplay, Navigation, Pagination, EffectFade]}
				spaceBetween={0}
				slidesPerView={1}
				effect="fade"
				fadeEffect={{ crossFade: true }}
				loop={true}
				speed={600}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				pagination={{
					clickable: true,
					dynamicBullets: false,
				}}
				navigation={{
					nextEl: ".custom-next",
					prevEl: ".custom-prev",
				}}
				onAutoplayTimeLeft={onAutoplayTimeLeft}
				className="hero-swiper w-full h-full"
			>
				{slides.map((slide, index) => (
					<SwiperSlide key={index}>
						<div className="relative w-full h-full">
							{/* Background Image */}
							<div
								className="absolute inset-0 bg-cover bg-center scale-105"
								style={{ backgroundImage: `url(${slide.image})` }}
							/>

							{/* Gradient Overlay - Enhanced for better readability */}
							<div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40" />
							<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

							{/* Content */}
							<div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
								<div className="slide-content text-white max-w-2xl">
									{/* Subtitle Badge */}
									<div>
										<span className="inline-block px-4 py-1.5 mb-4 text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
											{slide.subtitle}
										</span>
									</div>

									{/* Title */}
									<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight tracking-tight">
										{slide.title}
									</h1>

									{/* Description */}
									<p className="text-sm md:text-lg mb-4 md:mb-6 leading-relaxed text-white/85 max-w-lg">
										{slide.description}
									</p>

									{/* Highlight Badge */}
									<div className="mb-5 md:mb-6">
										<span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium text-white border border-primary/30">
											<Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
											{slide.highlight}
										</span>
									</div>

									{/* CTA Button */}
									<div className="flex flex-wrap gap-3">
										<Link
											href={slide.ctaLink}
											className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all hover:scale-[1.02] shadow-lg group"
										>
											{slide.cta}
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Link>
										<Link
											href="/categories"
											className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
										>
											View All Categories
										</Link>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom Navigation Arrows */}
			<button
				className="custom-prev absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 hidden sm:flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110 text-white border border-white/20"
				aria-label="Previous slide"
			>
				<ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
			</button>

			<button
				className="custom-next absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 hidden sm:flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110 text-white border border-white/20"
				aria-label="Next slide"
			>
				<ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
			</button>

			{/* Trust Indicators */}
			<div className="absolute bottom-16 md:bottom-20 right-4 md:right-8 z-10 hidden lg:flex flex-col gap-2">
				<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs border border-white/20">
					<Shield className="h-4 w-4 text-green-400" />
					<span>Verified Sellers</span>
				</div>
				<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs border border-white/20">
					<Truck className="h-4 w-4 text-blue-400" />
					<span>Campus Delivery</span>
				</div>
			</div>

			{/* Auto-play Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
				<div
					ref={progressBar}
					className="h-full bg-white transition-all"
					style={{ width: "0%" }}
				/>
			</div>
		</div>
	);
}
