"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	Truck,
	ShieldCheck,
	RotateCcw,
	Smartphone,
	Star,
	Clock,
	Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { useFeaturedProducts } from "@/hooks/queries/use-products"
import { useFeaturedStores } from "@/hooks/queries/use-stores"
import { useRestaurants } from "@/hooks/queries/use-restaurants"
import type { RestaurantListItem, StoreListItem } from "@/lib/api/types"

type Slide = {
	eyebrow: string
	title: string
	highlight: string
	subtitle: string
	description: string
	cta: string
	ctaHref: string
	image: string
	bgClass: string
}

const fallbackSlides: Slide[] = [
	{
		eyebrow: "Campus Product Picks",
		title: "Top",
		highlight: "Products",
		subtitle: "Fresh drops every week",
		description: "From gadgets to hostel essentials, discover student-favorite deals.",
		cta: "Shop Products",
		ctaHref: "/products",
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
		ctaHref: "/restaurants",
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
		ctaHref: "/stores",
		bgClass: "bg-[#efe5d9]",
		image:
			"https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600&h=600&fit=crop",
	},
]

/* -----------------------------------------------------------
	 Hero slider — left 2/3 of bento
----------------------------------------------------------- */
function HeroSlider({ slides }: { slides: Slide[] }) {
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
									asChild
									className="mt-6 h-11 w-fit rounded-full bg-vm-graphite px-6 text-sm font-semibold text-white shadow-sm hover:opacity-90"
								>
									<Link href={slide.ctaHref}>
									{slide.cta}
									<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>

							{/* Image */}
							<div className="relative hidden md:block">
								<Image
									src={slide.image}
									width={1200}
									height={1200}
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
function MobileHeroCarousel({ slides }: { slides: Slide[] }) {
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
				<CarouselContent className="ml-0 gap-4" >
					{slides.map((slide) => (
						<CarouselItem key={slide.title} className="pl-0">
							<div
								className={cn(
									"relative h-75 w-full overflow-hidden rounded-2xl",
									slide.bgClass
								)}
							>
								<Image
									src={slide.image}
                  width={1200}
									height={1200}
									alt=""
									className="absolute inset-0 h-full w-full object-cover object-center"
								/>
								{/* Bottom gradient */}
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

								{/* Slide content */}
								<div className="absolute inset-x-0 bottom-0 p-5">
									<span className="inline-block rounded-full bg-vm-tangerine px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
										{slide.eyebrow}
									</span>
									<h2 className="mt-2 text-2xl font-black leading-tight text-white">
										{slide.title}{" "}
										<span className="text-white">{slide.highlight}</span>
									</h2>
									<p className="mt-1 line-clamp-1 text-xs text-white/70">
										{slide.description}
									</p>
									<Link
										href={slide.ctaHref}
										className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-vm-graphite shadow-sm active:scale-95"
									>
										{slide.cta}
										<ArrowRight className="h-3 w-3" />
									</Link>
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
	 Live restaurant promo — right column, top slot
----------------------------------------------------------- */
const FALLBACK_RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
const FALLBACK_STORE_IMAGE = "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=400&fit=crop"

function LiveRestaurantPromo({ restaurant }: { restaurant: RestaurantListItem | undefined }) {
	const image = restaurant?.banner || restaurant?.logo || FALLBACK_RESTAURANT_IMAGE

	return (
		<Link
			href="/restaurants"
			className="group/card relative flex h-full overflow-hidden rounded-2xl bg-[#ededed] transition-transform duration-300 hover:-translate-y-0.5"
		>
			{/* Copy */}
			<div className="flex flex-1 flex-col justify-center px-6 py-6">
				<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-vm-graphite opacity-70">
					Restaurant Rush
				</span>

				{restaurant ? (
					<>
						<div className="mt-2 flex items-center gap-1.5">
							<span className={cn("h-2 w-2 rounded-full", restaurant.isOpen ? "bg-green-500" : "bg-rose-400")} />
							<span className="text-[10px] font-medium text-vm-graphite opacity-60">
								{restaurant.isOpen ? "Open now" : "Closed"}
							</span>
						</div>
						<h3 className="mt-1 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-vm-graphite">
							{restaurant.name}
						</h3>
						<p className="mt-0.5 text-xs text-vm-graphite opacity-60">{restaurant.category}</p>
						<div className="mt-2 flex items-center gap-3">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
								<span className="text-xs font-semibold text-vm-graphite">{restaurant.rating}</span>
							</div>
							{restaurant.deliveryTime && (
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3 text-vm-graphite opacity-50" />
									<span className="text-xs text-vm-graphite opacity-60">{restaurant.deliveryTime}</span>
								</div>
							)}
						</div>
					</>
				) : (
					<>
						<h3 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-vm-graphite">Campus</h3>
						<p className="text-xl font-bold leading-tight tracking-tight text-vm-graphite">Food Deals</p>
					</>
				)}

				<span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-vm-graphite transition-all group-hover/card:gap-2">
					View Restaurants
					<ArrowRight className="h-3.5 w-3.5" />
				</span>
			</div>

			{/* Image */}
			<div className="relative w-1/2 shrink-0">
				<Image
					src={image}
					alt={restaurant?.name ?? ""}
					width={400}
					height={400}
					className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
				/>
			</div>
		</Link>
	)
}

/* -----------------------------------------------------------
	 Live store promo — right column, bottom slot
----------------------------------------------------------- */
function LiveStorePromo({ store }: { store: StoreListItem | undefined }) {
	const href = store ? `/stores/${store.id}` : "/stores"
	const image = store?.logo || FALLBACK_STORE_IMAGE

	return (
		<Link
			href={href}
			className="group/card relative flex h-full overflow-hidden rounded-2xl bg-[#f5e9dd] transition-transform duration-300 hover:-translate-y-0.5"
		>
			{/* Copy */}
			<div className="flex flex-1 flex-col justify-center px-6 py-6">
				<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-vm-graphite opacity-70">
					Top Stores
				</span>

				{store ? (
					<>
						<div className="mt-2 flex items-center gap-1.5">
							<span className={cn("h-2 w-2 rounded-full", store.isOpen ? "bg-green-500" : "bg-rose-400")} />
							<span className="text-[10px] font-medium text-vm-graphite opacity-60">
								{store.isOpen ? "Open now" : "Closed"}
							</span>
						</div>
						<h3 className="mt-1 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-vm-graphite">
							{store.name}
						</h3>
						<p className="mt-0.5 text-xs text-vm-graphite opacity-60">{store.category}</p>
						<div className="mt-2 flex items-center gap-3">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
								<span className="text-xs font-semibold text-vm-graphite">{store.rating}</span>
							</div>
							<div className="flex items-center gap-1">
								<Package className="h-3 w-3 text-vm-graphite opacity-50" />
								<span className="text-xs text-vm-graphite opacity-60">{store.totalProducts} items</span>
							</div>
						</div>
					</>
				) : (
					<>
						<h3 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-vm-graphite">Vendor</h3>
						<p className="text-xl font-bold leading-tight tracking-tight text-vm-graphite">Spotlight</p>
					</>
				)}

				<span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-vm-tangerine transition-all group-hover/card:gap-2">
					Browse Store
					<ArrowRight className="h-3.5 w-3.5" />
				</span>
			</div>

			{/* Image / Logo */}
			<div className="relative w-1/2 shrink-0">
				<Image
					src={image}
					alt={store?.name ?? ""}
					width={400}
					height={400}
					className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
				/>
			</div>
		</Link>
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
	const { data: featuredProducts } = useFeaturedProducts()
	const { data: featuredStores } = useFeaturedStores()
	const { data: restaurantsData } = useRestaurants({ limit: 4 })

	const slides = React.useMemo(() => fallbackSlides.map((slide, i) => {
		if (i === 0) {
			const img = featuredProducts?.[0]?.images?.[0]?.optimized_url
			return img ? { ...slide, image: img } : slide
		}
		if (i === 1) {
			const img = restaurantsData?.restaurants?.[0]?.banner || restaurantsData?.restaurants?.[0]?.logo
			return img ? { ...slide, image: img } : slide
		}
		const img = featuredStores?.[0]?.logo
		return img ? { ...slide, image: img } : slide
	}), [featuredProducts, featuredStores, restaurantsData])

	return (
		<section>
			{/* Mobile: app-style carousel */}
			<div className="px-4 pt-4 pb-2 lg:hidden">
				<MobileHeroCarousel slides={slides} />
			</div>

			{/* Desktop: bento grid */}
			<div className="container mx-auto hidden px-4 py-6 lg:block">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					{/* Slider — spans 2 columns */}
					<div className="lg:col-span-2">
						<HeroSlider slides={slides} />
					</div>

					{/* Right column — 2 live promo cards */}
					<div className="grid grid-cols-1 gap-4">
						<LiveRestaurantPromo restaurant={restaurantsData?.restaurants?.[0]} />
						<LiveStorePromo store={featuredStores?.[0]} />
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
