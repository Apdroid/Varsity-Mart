"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface HeroSlide {
	title: string;
	subtitle: string;
	description: string;
	image: string;
	cta?: string;
	ctaLink?: string;
	accentColor?: string;
}

interface PageHeroSliderProps {
	slides: HeroSlide[];
	height?: string;
}

export function PageHeroSlider({ slides, height = "h-[400px] md:h-[500px]" }: PageHeroSliderProps) {
	const progressBar = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<any>(null);

	const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
		if (progressBar.current) {
			progressBar.current.style.width = `${(1 - progress) * 100}%`;
		}
	};

	return (
		<div className={`relative w-full ${height} overflow-hidden rounded-none md:rounded-2xl bg-neutral-900 mb-8`}>
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
										<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider uppercase bg-primary text-white rounded-full">
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
									{slide.cta && slide.ctaLink && (
										<div>
											<Button
												asChild
												size="lg"
												className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg hover:scale-105 transition-all shadow-xl"
											>
												<Link href={slide.ctaLink}>{slide.cta}</Link>
											</Button>
										</div>
									)}
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
					className="h-full bg-primary transition-all"
					style={{ width: "0%" }}
				/>
			</div>
		</div>
	);
}

