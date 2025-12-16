"use client";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function VarsityMartHeroSlider() {
	const progressBar = useRef(null);
	const swiperRef = useRef(null);

	const slides = [
		{
			title: "Delicious Campus Dining",
			subtitle: "Restaurants",
			description:
				"Fresh meals, quick bites, and campus favorites delivered to your door",
			image:
				"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop",
			cta: "Browse Restaurants",
			accentColor: "bg-blue-600",
		},
		{
			title: "Campus Stores & Boutiques",
			subtitle: "Stores",
			description: "Fashion, accessories, and everything you need for campus life",
			image:
				"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
			cta: "Explore Stores",
			accentColor: "bg-blue-600",
		},
		{
			title: "Everything You Need",
			subtitle: "Products",
			description: "From snacks to study essentials - find it all in one place",
			image:
				"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
			cta: "Shop Products",
			accentColor: "bg-blue-600",
		},
		{
			title: "Make Your Best Offer",
			subtitle: "Special Feature",
			description: "Name your price on select items and grab amazing deals",
			image:
				"https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=600&fit=crop",
			cta: "Start Bidding",
			accentColor: "bg-blue-600",
		},
	];

	const onAutoplayTimeLeft = (s, time, progress) => {
		if (progressBar.current) {
			progressBar.current.style.width = `${(1 - progress) * 100}%`;
		}
	};

	return (
		<div className="relative max-w-360 my-2 mx-auto w-full h-100 overflow-hidden md:rounded-2xl rounded-none bg-neutral-900">
			<style>{`
      `}</style>

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
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url(${slide.image})` }}
							/>

							{/* Dark Overlay */}
							<div className="absolute inset-0 bg-black/60" />

							{/* Content */}
							<div className="relative h-full flex items-center justify-center px-8 md:px-16">
								<div className="slide-content text-center text-white max-w-6xl">
									{/* Subtitle */}
									<div>
										<span
											className={`inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider uppercase bg-primary text-white rounded-full`}
										>
											{slide.subtitle}
										</span>
									</div>

									{/* Title */}
									<h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
										{slide.title}
									</h1>

									{/* Description */}
									<p className="text-md md:text-xl mb-8 leading-relaxed text-white/90">
										{slide.description}
									</p>

									{/* CTA Button */}
									<div>
										<button
											type="button"
											className={`px-5 py-3  bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl`}
										>
											{slide.cta}
										</button>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom Navigation Arrows */}
			<button
				className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all hover:scale-110 text-white border border-white/30 hidden md:flex"
				aria-label="Previous slide"
			>
				<ChevronLeft className="w-6 h-6" />
			</button>

			<button
				className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all hover:scale-110 text-white border border-white/30 hidden md:flex"
				aria-label="Next slide"
			>
				<ChevronRight className="w-6 h-6" />
			</button>

			{/* Auto-play Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
				<div
					ref={progressBar}
					className="h-full bg-blue-600 transition-all"
					style={{ width: "0%" }}
				/>
			</div>
		</div>
	);
}
