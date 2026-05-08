"use client"

import * as React from "react"
import Image from "next/image"
import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	Truck,
	ShieldCheck,
	RotateCcw,
	Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type Slide = {
	eyebrow: string
	title: string
	highlight: string
	subtitle: string
	description: string
	cta: string
	image: string
	bgClass: string
}

const slides: Slide[] = [
	{
		eyebrow: "Campus Product Picks",
		title: "Top",
		highlight: "Products",
		subtitle: "Fresh drops every week",
		description: "From gadgets to hostel essentials, discover student-favorite deals.",
		cta: "Shop Products",
		bgClass: "bg-[#f5e9dd]",
		image:
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
	},
	{
		eyebrow: "Food Court Spotlight",
		title: "Featured",
		highlight: "Restaurants",
		subtitle: "Fast delivery around campus",
		description: "Order waakye, pizza, smoothies, and late-night chops in minutes.",
		cta: "Order Food",
		bgClass: "bg-[#e8e4dc]",
		image:
			"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
	},
	{
		eyebrow: "Vendor Spotlight",
		title: "Trusted",
		highlight: "Stores",
		subtitle: "Verified campus sellers",
		description: "Browse top vendors for fashion, books, tech, and daily essentials.",
		cta: "Explore Stores",
		bgClass: "bg-[#efe5d9]",
		image:
			"https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600&h=600&fit=crop",
	},
]

/* -----------------------------------------------------------
	 Hero slider — left 2/3 of bento
----------------------------------------------------------- */
function HeroSlider() {
	const [index, setIndex] = React.useState(0)
	const [paused, setPaused] = React.useState(false)

	React.useEffect(() => {
		if (paused) return
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % slides.length)
		}, 6000)
		return () => clearInterval(id)
	}, [paused])

	const go = (dir: 1 | -1) =>
		setIndex((i) => (i + dir + slides.length) % slides.length)

	return (
		<div
			className="group relative overflow-hidden rounded-2xl"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* Slides */}
			<div className="relative h-105 md:h-115">
				{slides.map((slide, i) => (
					<div
						key={slide.title}
						className={cn(
							"absolute inset-0 transition-opacity duration-700 ease-out",
							slide.bgClass,
							i === index ? "opacity-100" : "pointer-events-none opacity-0"
						)}
						aria-hidden={i !== index}
					>
						<div className="grid h-full grid-cols-1 md:grid-cols-2">
							{/* Copy */}
							<div className="flex flex-col justify-center px-8 py-10 md:px-12">
								<span
									className="mb-3 text-xs text-vm-graphite font-semibold uppercase tracking-[0.2em]"
								>
									{slide.eyebrow}
								</span>
								<h2
									className="text-4xl font-bold text-vm-graphite leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
								>
									{slide.title}
									<br />
									<span className="text-vm-tangerine">
										{slide.highlight}
									</span>
								</h2>
								<p
									className="mt-4 text-lg font-semibold text-vm-graphite md:text-xl"
								>
									{slide.subtitle}
								</p>
								<p className="mt-2 max-w-xs text-sm text-black opacity-85">
									{slide.description}
								</p>
								<Button
									className="mt-6 h-11 w-fit rounded-full bg-vm-graphite px-6 text-sm font-semibold text-white shadow-sm hover:opacity-90"
								>
									{slide.cta}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>

							{/* Image */}
							<div className="relative hidden md:block">
								<img
									src={slide.image}
									alt=""
									className="absolute inset-0 h-full w-full object-cover object-center"
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Prev / Next */}
			<button
				onClick={() => go(-1)}
				aria-label="Previous slide"
				className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-black opacity-0 shadow-md backdrop-blur-sm transition hover:bg-white group-hover:opacity-100"
			>
				<ChevronLeft className="h-5 w-5" />
			</button>
			<button
				onClick={() => go(1)}
				aria-label="Next slide"
				className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-black opacity-0 shadow-md backdrop-blur-sm transition hover:bg-white group-hover:opacity-100"
			>
				<ChevronRight className="h-5 w-5" />
			</button>

			{/* Dots */}
			<div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
				{slides.map((_, i) => (
					<button
						key={i}
						onClick={() => setIndex(i)}
						aria-label={`Go to slide ${i + 1}`}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							i === index ? "w-7 bg-vm-graphite" : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
						)}
					/>
				))}
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 Mobile app-style hero carousel (shown below lg breakpoint)
----------------------------------------------------------- */
function MobileHeroCarousel() {
	const [api, setApi] = React.useState<CarouselApi>()
	const [current, setCurrent] = React.useState(0)

	React.useEffect(() => {
		if (!api) return
		api.on("select", () => setCurrent(api.selectedScrollSnap()))
	}, [api])

	React.useEffect(() => {
		if (!api) return
		const id = setInterval(() => api.scrollNext(), 5000)
		return () => clearInterval(id)
	}, [api])

	return (
		<div className="space-y-3">
			<Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
				<CarouselContent className="-ml-0">
					{slides.map((slide) => (
						<CarouselItem key={slide.title} className="pl-0">
							<div
								className={cn(
									"relative h-[300px] w-full overflow-hidden rounded-2xl",
									slide.bgClass
								)}
							>
								<img
									src={slide.image}
									alt=""
									className="absolute inset-0 h-full w-full object-cover object-center"
								/>
								{/* Bottom gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

								{/* Slide content */}
								<div className="absolute inset-x-0 bottom-0 p-5">
									<span className="inline-block rounded-full bg-vm-tangerine px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
										{slide.eyebrow}
									</span>
									<h2 className="mt-2 text-2xl font-black leading-tight text-white">
										{slide.title}{" "}
										<span className="text-vm-tangerine">{slide.highlight}</span>
									</h2>
									<p className="mt-1 line-clamp-1 text-xs text-white/70">
										{slide.description}
									</p>
									<button
										type="button"
										className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-vm-graphite shadow-sm active:scale-95"
									>
										{slide.cta}
										<ArrowRight className="h-3 w-3" />
									</button>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Dot indicators */}
			<div className="flex justify-center gap-1.5">
				{slides.map((_, i) => (
					<button
						key={i}
						type="button"
						onClick={() => api?.scrollTo(i)}
						aria-label={`Go to slide ${i + 1}`}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							i === current ? "w-6 bg-vm-graphite" : "w-1.5 bg-border hover:bg-muted-foreground"
						)}
					/>
				))}
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 Promo card — used twice on the right column
----------------------------------------------------------- */
type PromoProps = {
	eyebrow: string
	title: string
	subtitle?: string
	cta: string
	image: string
	bgClass: string
	accent?: "graphite" | "tangerine"
}

function PromoCard({
	eyebrow,
	title,
	subtitle,
	cta,
	image,
	bgClass,
	accent = "graphite",
}: PromoProps) {
	const accentColor =
		accent === "tangerine" ? "text-vm-tangerine" : "text-vm-graphite"

	return (
		<a
			href="#"
			className={cn(
				"group/card relative flex h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-0.5",
				bgClass
			)}
		>
			{/* Copy */}
			<div className="flex flex-1 flex-col justify-center px-6 py-6">
				<span
					className="text-[10px] font-semibold uppercase tracking-[0.2em] text-vm-graphite opacity-70"
				>
					{eyebrow}
				</span>
				<h3
					className="mt-1.5 text-xl text-vm-graphite font-bold leading-tight tracking-tight"
				>
					{title}
				</h3>
				{subtitle && (
					<p
						className="text-xl font-bold  text-vm-graphite leading-tight tracking-tight"
					>
						{subtitle}
					</p>
				)}
				<span
					className={cn(`mt-3 inline-flex items-center  gap-1.5 text-xs font-semibold transition-all group-hover/card:gap-2`, accentColor)}				>
					{cta}
					<ArrowRight className="h-3.5 w-3.5" />
				</span>
			</div>

			{/* Image */}
			<div className="relative w-1/2 shrink-0">
				<Image
					src={image}
					alt=""
					width={1200}
					height={1200}
					className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
				/>
			</div>
		</a>
	)
}

/* -----------------------------------------------------------
	 Features strip — 4 trust signals
----------------------------------------------------------- */
const features = [
	{
		icon: Truck,
		title: "Campus Delivery",
		subtitle: "Powered by Keber",
	},
	{
		icon: Smartphone,
		title: "Pay with MoMo",
		subtitle: "MTN · Vodafone · AirtelTigo",
	},
	{
		icon: RotateCcw,
		title: "7-Day Returns",
		subtitle: "Hassle-free on most items",
	},
	{
		icon: ShieldCheck,
		title: "Verified Vendors",
		subtitle: "KNUST-approved sellers",
	},
] as const

function FeaturesStrip() {
	return (
		<div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-card p-6 md:grid-cols-4">
			{features.map(({ icon: Icon, title, subtitle }) => (
				<div
					key={title}
					className="flex items-center gap-3 bg-transparent px-5 py-5 transition-colors hover:bg-muted/30"
				>
					<div
						className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
					>
						<Icon
							className="h-8 w-8"

						/>
					</div>
					<div className="min-w-0">
						<div
							className="text-sm font-semibold"
						>
							{title}
						</div>
						<div className="truncate text-xs text-muted-foreground">
							{subtitle}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

/* -----------------------------------------------------------
	 Composed bento
----------------------------------------------------------- */
export default function VarsityMartHeroBento() {
	return (
		<section>
			{/* Mobile: app-style carousel */}
			<div className="px-4 pt-4 pb-2 lg:hidden">
				<MobileHeroCarousel />
			</div>

			{/* Desktop: bento grid */}
			<div className="container mx-auto hidden px-4 py-6 lg:block">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					{/* Slider — spans 2 columns */}
					<div className="lg:col-span-2">
						<HeroSlider />
					</div>

					{/* Right column — 2 stacked promos */}
					<div className="grid grid-cols-1 gap-4">
						<PromoCard
							eyebrow="Restaurant Rush"
							title="Campus"
							subtitle="Food Deals"
							cta="View Restaurants"
							bgClass="bg-[#ededed]"
							accent="graphite"
							image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
						/>
						<PromoCard
							eyebrow="Top Stores"
							title="Vendor"
							subtitle="Spotlight"
							cta="Browse Stores"
							bgClass="bg-[#f5e9dd]"
							accent="tangerine"
							image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=400&fit=crop"
						/>
					</div>
				</div>
			</div>

			{/* Features strip — both breakpoints */}
			<div className="container mx-auto px-4 pb-6">
				<FeaturesStrip />
			</div>
		</section>
	)
}
