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
import type { Product, RestaurantListItem, StoreListItem } from "@/lib/api/types"

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

const FALLBACK_RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop"
const FALLBACK_STORE_IMAGE = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"

function formatGHS(value: string | number) {
	const n = typeof value === "string" ? parseFloat(value) : value
	if (Number.isNaN(n)) return ""
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

function productImage(product: Product | undefined) {
	return (
		product?.images?.[0]?.optimized_url ||
		product?.images?.[0]?.url ||
		FALLBACK_PRODUCT_IMAGE
	)
}

/* -----------------------------------------------------------
	 Hero showcase — large immersive card, left 3/5 of bento.
	 Full-bleed rotating imagery with overlaid badge + copy,
	 styled in the warm VM palette (tangerine glow, not neon).
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
	}, [paused, slides.length])

	const go = (dir: 1 | -1) =>
		setIndex((i) => (i + dir + slides.length) % slides.length)

	return (
		<div
			className="group relative h-full min-h-[480px] overflow-hidden rounded-2xl bg-vm-graphite"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{slides.map((slide, i) => (
				<div
					key={slide.title}
					className={cn(
						"absolute inset-0 transition-opacity duration-700 ease-out",
						i === index ? "opacity-100" : "pointer-events-none opacity-0"
					)}
					aria-hidden={i !== index}
				>
					{/* Full-bleed image */}
					<Image
						src={slide.image}
						fill
						sizes="(min-width: 1024px) 55vw, 100vw"
						alt=""
						priority={i === 0}
						className="object-cover object-center transition-transform duration-[6000ms] ease-out group-hover:scale-105"
					/>

					{/* Warm gradient for legibility + soft tangerine glow accent */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
					<div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-vm-tangerine/30 blur-3xl" />

					{/* Copy overlay */}
					<div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
						<span className="inline-block rounded-full bg-vm-tangerine px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
							{slide.eyebrow}
						</span>
						<h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-white lg:text-5xl">
							{slide.title}{" "}
							<span className="text-vm-tangerine">{slide.highlight}</span>
						</h2>
						<p className="mt-3 text-lg font-semibold text-white/90 md:text-xl">
							{slide.subtitle}
						</p>
						<p className="mt-1 max-w-md text-sm text-white/65">
							{slide.description}
						</p>
						<Button
							asChild
							className="mt-6 h-11 w-fit rounded-full bg-white px-6 text-sm font-semibold text-vm-graphite shadow-sm hover:bg-white/90"
						>
							<Link href={slide.ctaHref}>
								{slide.cta}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			))}

			{/* Prev / Next */}
			<button
				onClick={() => go(-1)}
				aria-label="Previous slide"
				className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white opacity-0 shadow-md backdrop-blur-sm transition hover:bg-white/30 group-hover:opacity-100"
			>
				<ChevronLeft className="h-5 w-5" />
			</button>
			<button
				onClick={() => go(1)}
				aria-label="Next slide"
				className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white opacity-0 shadow-md backdrop-blur-sm transition hover:bg-white/30 group-hover:opacity-100"
			>
				<ChevronRight className="h-5 w-5" />
			</button>

			{/* Dots */}
			<div className="absolute bottom-5 right-8 flex items-center gap-2 md:right-10">
				{slides.map((_, i) => (
					<button
						key={i}
						onClick={() => setIndex(i)}
						aria-label={`Go to slide ${i + 1}`}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							i === index ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
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
					{slides.map((slide, i) => (
						<CarouselItem key={slide.title} className="pl-0">
							<div className="relative h-75 w-full overflow-hidden rounded-2xl bg-vm-graphite">
								<Image
									src={slide.image}
									fill
									sizes="100vw"
									alt=""
									priority={i === 0}
									className="object-cover object-center"
								/>
								{/* Bottom gradient */}
								<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
								<div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-vm-tangerine/30 blur-3xl" />

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
	 Live restaurant promo — right column, wide top slot.
	 Full-bleed banner: works regardless of image aspect ratio.
----------------------------------------------------------- */
function LiveRestaurantPromo({ restaurant }: { restaurant: RestaurantListItem | undefined }) {
	const href = restaurant ? `/restaurants/${restaurant.id}` : "/restaurants"
	const bannerImage = restaurant?.banner || FALLBACK_RESTAURANT_IMAGE

	return (
		<Link
			href={href}
			className="group/card relative flex h-full overflow-hidden rounded-2xl bg-vm-graphite transition-transform duration-300 hover:-translate-y-0.5"
		>
			<Image
				src={bannerImage}
				alt={restaurant?.name ?? "Restaurant"}
				fill
				sizes="40vw"
				className="object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

			{/* Badge */}
			<div className="absolute left-4 top-4">
				<span className="inline-block rounded-full bg-vm-tangerine px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
					Restaurant Rush
				</span>
			</div>

			{/* Bottom content */}
			<div className="absolute inset-x-0 bottom-0 p-4">
				<div className="mb-1.5 flex items-center gap-2">
					{restaurant?.logo && (
						<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
							<Image src={restaurant.logo} alt="" fill sizes="24px" className="object-cover" />
						</div>
					)}
					<span className={cn(
						"rounded-full px-2 py-0.5 text-[10px] font-semibold text-white",
						restaurant?.isOpen ? "bg-green-500/80" : "bg-rose-500/80"
					)}>
						{restaurant ? (restaurant.isOpen ? "Open now" : "Closed") : "Order food"}
					</span>
				</div>

				<h3 className="line-clamp-1 text-base font-bold leading-tight text-white">
					{restaurant?.name ?? "Campus Food Deals"}
				</h3>

				{restaurant && (
					<div className="mt-1 flex items-center gap-3">
						<div className="flex items-center gap-1">
							<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
							<span className="text-xs font-semibold text-white">{restaurant.rating}</span>
						</div>
						{restaurant.deliveryTime && (
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3 text-white/50" />
								<span className="text-xs text-white/60">{restaurant.deliveryTime}</span>
							</div>
						)}
					</div>
				)}

				<span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/75 transition-all group-hover/card:gap-2 group-hover/card:text-white">
					View Restaurants <ArrowRight className="h-3 w-3" />
				</span>
			</div>
		</Link>
	)
}

/* -----------------------------------------------------------
	 Live store promo — right column, small bottom-left slot.
	 StoreListItem has no banner — render a compact branded card
	 in the warm VM palette with the logo as an avatar.
----------------------------------------------------------- */
function LiveStorePromo({ store }: { store: StoreListItem | undefined }) {
	const href = store ? `/stores/${store.id}` : "/stores"
	const logo = store?.logo || FALLBACK_STORE_IMAGE

	return (
		<Link
			href={href}
			className="group/card relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5e9dd] to-[#ecdcc9] p-3.5 transition-transform duration-300 hover:-translate-y-0.5"
		>
			{/* Soft tangerine glow accent */}
			<div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-vm-tangerine/20 blur-2xl" />

			<div className="relative flex items-start justify-between">
				<span className="inline-block rounded-full bg-vm-graphite px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
					Top Store
				</span>
				<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/70">
					<Image src={logo} alt="" fill sizes="40px" className="object-cover" />
				</div>
			</div>

			<div className="relative">
				{store ? (
					<>
						<div className="mb-0.5 flex items-center gap-1.5">
							<span className={cn("h-1.5 w-1.5 rounded-full", store.isOpen ? "bg-green-500" : "bg-rose-400")} />
							<span className="text-[10px] font-medium text-vm-graphite/60">
								{store.isOpen ? "Open now" : "Closed"}
							</span>
						</div>
						<h3 className="line-clamp-1 text-sm font-bold leading-tight tracking-tight text-vm-graphite">
							{store.name}
						</h3>
						<div className="mt-1 flex items-center gap-2">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
								<span className="text-xs font-semibold text-vm-graphite">{store.rating}</span>
							</div>
							<div className="flex items-center gap-1">
								<Package className="h-3 w-3 text-vm-graphite/50" />
								<span className="text-[11px] text-vm-graphite/55">{store.totalProducts}</span>
							</div>
						</div>
					</>
				) : (
					<h3 className="text-sm font-bold tracking-tight text-vm-graphite">Vendor Spotlight</h3>
				)}

				<span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-vm-tangerine transition-all group-hover/card:gap-2">
					Browse <ArrowRight className="h-3 w-3" />
				</span>
			</div>
		</Link>
	)
}

/* -----------------------------------------------------------
	 Live product promo — right column, small bottom-right slot.
	 Full-bleed product image with overlaid title + price.
----------------------------------------------------------- */
function LiveProductPromo({ product }: { product: Product | undefined }) {
	const href = product ? `/products/${product.id}` : "/products"

	return (
		<Link
			href={href}
			className="group/card relative flex h-full overflow-hidden rounded-2xl bg-vm-graphite transition-transform duration-300 hover:-translate-y-0.5"
		>
			<Image
				src={productImage(product)}
				alt={product?.title ?? "Product"}
				fill
				sizes="20vw"
				className="object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

			{/* Badge */}
			<div className="absolute left-3 top-3">
				<span className="inline-block rounded-full bg-vm-tangerine px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm">
					Trending
				</span>
			</div>

			<div className="absolute inset-x-0 bottom-0 p-3">
				<h3 className="line-clamp-1 text-sm font-bold leading-tight text-white">
					{product?.title ?? "Top Products"}
				</h3>
				{product && (
					<p className="mt-0.5 text-xs font-bold text-vm-tangerine">
						{formatGHS(product.price)}
					</p>
				)}
				<span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white/70 transition-all group-hover/card:gap-2 group-hover/card:text-white">
					Shop now <ArrowRight className="h-3 w-3" />
				</span>
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
]

function FeaturesStrip() {
	return (
		<div className="mt-6 grid grid-cols-2 overflow-hidden rounded-md bg-border md:grid-cols-4">
			{features.map(({ icon: Icon, title, subtitle }) => (
				<div
					key={title}
					className="flex items-center gap-2.5 bg-card px-3.5 py-4 transition-colors hover:bg-muted/40 sm:gap-3 sm:px-5 sm:py-5"
				>
					<div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-accent sm:h-10 sm:w-10">
						<Icon className="h-4 w-4 text-vm-tangerine sm:h-5 sm:w-5" />
					</div>
					<div className="min-w-0">
						<div className="text-[13px] font-semibold leading-tight text-foreground sm:text-sm">{title}</div>
						<div className="truncate text-[11px] text-muted-foreground sm:text-xs">{subtitle}</div>
					</div>
				</div>
			))}
		</div>
	)
}

/* -----------------------------------------------------------
	 Composed bento — large showcase + featured card grid
----------------------------------------------------------- */
export default function VarsityMartHeroBento() {
	const { data: featuredProducts } = useFeaturedProducts()
	const { data: featuredStores } = useFeaturedStores()
	const { data: restaurantsData } = useRestaurants({ limit: 4 })

	const slides = React.useMemo(() => fallbackSlides.map((slide, i) => {
		if (i === 0) {
			const img = featuredProducts?.[0]?.images?.[0]?.optimized_url || featuredProducts?.[0]?.images?.[0]?.url
			return img ? { ...slide, image: img } : slide
		}
		if (i === 1) {
			const img = restaurantsData?.restaurants?.[0]?.banner || restaurantsData?.restaurants?.[0]?.logo
			return img ? { ...slide, image: img } : slide
		}
		const img = featuredStores?.[0]?.logo
		return img ? { ...slide, image: img } : slide
	}), [featuredProducts, featuredStores, restaurantsData])

	const promoRestaurant = restaurantsData?.restaurants?.[0]
	const promoStore = featuredStores?.[0]
	const promoProduct = featuredProducts?.[0]

	return (
		<section>
			{/* Mobile: app-style carousel + featured card grid */}
			<div className="px-4 pt-4 pb-2 lg:hidden">
				<MobileHeroCarousel slides={slides} />
				<div className="mt-3 grid grid-cols-2 gap-3">
					<div className="h-32">
						<LiveStorePromo store={promoStore} />
					</div>
					<div className="h-32">
						<LiveProductPromo product={promoProduct} />
					</div>
				</div>
			</div>

			{/* Desktop: bento grid — large showcase (3/5) + featured grid (2/5) */}
			<div className="vm-section mx-auto hidden px-4 py-6 lg:block">
				<div className="grid grid-cols-5 gap-4">
					{/* Showcase — spans 3 of 5 columns */}
					<div className="col-span-3">
						<HeroSlider slides={slides} />
					</div>

					{/* Right column — wide promo on top, two small below */}
					<div className="col-span-2 grid grid-rows-[1.15fr_1fr] gap-4">
						<LiveRestaurantPromo restaurant={promoRestaurant} />
						<div className="grid grid-cols-2 gap-4">
							<LiveStorePromo store={promoStore} />
							<LiveProductPromo product={promoProduct} />
						</div>
					</div>
				</div>
			</div>

			{/* Features strip — both breakpoints */}
			<div className="vm-section ">
				<FeaturesStrip />
			</div>
		</section>
	)
}
