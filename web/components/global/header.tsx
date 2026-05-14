'use client';
import {
	MagnifyingGlassIcon,
	ShoppingBagIcon,
	HeartIcon,
	CaretDownIcon,
	CaretRightIcon,
	ListIcon,
	PhoneIcon,
	MapPinIcon,
	FireIcon,
	TruckIcon,
	TShirtIcon,
	LaptopIcon,
	BookOpenIcon,
	ForkKnifeIcon,
	SparkleIcon,
	HouseIcon,
	BarbellIcon,
	GiftIcon,
	FacebookLogoIcon,
	XLogoIcon,
	UserCircleIcon,
	SignOutIcon,
	GearIcon,
	PackageIcon,
} from "@phosphor-icons/react"
import { Loader2, MessageCircleIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "./logo";
import Link from "next/link";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useAuth } from "@/providers/auth-provider";
import { useCurrentUser } from "@/hooks/queries/use-user";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

function ThemeToggleButton({ className = "" }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme()
	const isDark = resolvedTheme === "dark"

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={className}
		>
			{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
		</Button>
	)
}


const categories = [
	{ label: "Fashion & Apparel", icon: TShirtIcon },
	{ label: "Electronics & Phones", icon: LaptopIcon },
	{ label: "Books & Stationery", icon: BookOpenIcon },
	{ label: "Food & Drinks", icon: ForkKnifeIcon },
	{ label: "Beauty & Personal Care", icon: SparkleIcon },
	{ label: "Home & Hostel Supplies", icon: HouseIcon },
	{ label: "Sports & Fitness", icon: BarbellIcon },
	{ label: "Gifts & Accessories", icon: GiftIcon },
] as const

const searchCategories = [
	"All Categories",
	"Fashion & Apparel",
	"Electronics & Phones",
	"Books & Stationery",
	"Food & Drinks",
	"Beauty & Personal Care",
	"Home & Hostel Supplies",
] as const

function getCategoryHref(label: string) {
	return `/search?category=${encodeURIComponent(label.toLowerCase())}`
}

function buildGlobalSearchHref(query: string, category?: string) {
	const params = new URLSearchParams()
	const trimmedQuery = query.trim()

	if (trimmedQuery) {
		params.set("query", trimmedQuery)
	}
	if (category && category !== "All Categories") {
		params.set("category", category)
	}

	const next = params.toString()
	return next ? `/search?${next}` : "/search"
}

function getWishlistCount(...sources: Array<unknown>): number {
	for (const source of sources) {
		if (!source || typeof source !== "object") continue
		const data = source as Record<string, unknown>
		const value =
			data.wishlistCount ??
			data.wishlist_count ??
			data.likedCount ??
			data.liked_count ??
			data.savedCount ??
			data.saved_count

		if (typeof value === "number" && Number.isFinite(value)) {
			return Math.max(0, value)
		}
		if (typeof value === "string") {
			const parsed = Number(value)
			if (Number.isFinite(parsed)) {
				return Math.max(0, parsed)
			}
		}
	}
	return 0
}

/* -----------------------------------------------------------
	 1. Announcement bar — graphite background
----------------------------------------------------------- */
function AnnouncementBar() {
	return (
		<div
			className="w-full text-xs text-white bg-vm-graphite"
		>
			<div className="container mx-auto flex h-9 items-center justify-between px-4">
				<div className="flex items-center gap-4">
					<Badge
						className="h-5 gap-1 rounded-sm border-0 px-1.5 font-bold uppercase tracking-wide bg-vm-tangerine text-white"
					>
						<FireIcon className="h-3 w-3" />
						Hot
					</Badge>
					<span className="hidden items-center gap-1.5 sm:flex">
						<TruckIcon className="h-3.5 w-3.5" />
						Free campus delivery on orders over GHS 100
					</span>
					<span className="flex items-center gap-1.5 sm:hidden">
						<TruckIcon className="h-3.5 w-3.5" />
						Free delivery over GHS 100
					</span>
				</div>

				<div className="hidden items-center gap-4 md:flex">
					<a
						href="tel:+233240000000"
						className="flex items-center gap-1.5 text-white/75 transition hover:text-white"
					>
						<PhoneIcon className="h-3.5 w-3.5" />
						+233 24 000 0000
					</a>

					<Separator orientation="vertical" className="h-3 bg-white/15" />

					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1 text-white/75 transition hover:text-white">
							EN <CaretDownIcon className="h-3 w-3" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-32">
							<DropdownMenuItem>English</DropdownMenuItem>
							<DropdownMenuItem>Twi</DropdownMenuItem>
							<DropdownMenuItem>Ga</DropdownMenuItem>
							<DropdownMenuItem>Ewe</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1 text-white/75 transition hover:text-white">
							GHS <CaretDownIcon className="h-3 w-3" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-32">
							<DropdownMenuItem>GHS — Ghana Cedi</DropdownMenuItem>
							<DropdownMenuItem>USD — US Dollar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Separator orientation="vertical" className="h-3 bg-white/15" />

					<div className="flex items-center gap-3 text-white/75">
						<a
							href="https://x.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Twitter"
							className="transition hover:text-white"
						>
							<XLogoIcon className="h-4 w-4" weight="bold" />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook"
							className="transition hover:text-white"
						>
							<FacebookLogoIcon className="h-4 w-4" weight="bold" size={32} />
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 2. Main row — logo · search · account/cart
----------------------------------------------------------- */
function MainBar() {
	const router = useRouter()
	const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
	const { data: currentUserData } = useCurrentUser({ enabled: isAuthenticated })
	const [desktopQuery, setDesktopQuery] = useState("")
	const [desktopCategory, setDesktopCategory] = useState("All Categories")

	const wishlistCount = getWishlistCount(currentUserData?.data, user)
	const displayName = user ? `${user.firstName} ${user.lastName} `.trim() : ""
	const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U"

	const handleLogout = async () => {
		await logout()
		router.push("/")
	}

	const handleDesktopSearch = useCallback(() => {
		router.push(buildGlobalSearchHref(desktopQuery, desktopCategory))
	}, [router, desktopCategory, desktopQuery])

	return (
		<div className=" bg-card">
			<div className="container mx-auto flex justify-between h-20 items-center gap-6 px-4">
				{/* Mobile Navigation Menu */}
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<ListIcon className="h-5 w-5" />
							<span className="sr-only">Open menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-80 p-0 border-none">
						<SheetHeader className="p-4">
							<SheetTitle className="text-left">
								<Logo variant="header" />
							</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col p-2">
							{categories.map(({ label, icon: Icon }) => (
								<Link
									key={label}
									href={getCategoryHref(label)}
									className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition hover:bg-muted"
								>
									<Icon className="h-4 w-4 text-muted-foreground" />
									{label}
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>


				<Link href="/" className="shrink-0">
					<Logo variant="header" />
				</Link>

				<div className="hidden flex-1 md:block">
					<div className="relative flex h-11 w-full items-center overflow-hidden rounded-full  bg-accent transition-all focus-within:border-primary/30 focus-within:bg-background focus-within:shadow-sm">
						<MagnifyingGlassIcon className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
						<Input
							placeholder="Search for jollof, hoodies, textbooks…"
							value={desktopQuery}
							onChange={(event) => setDesktopQuery(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault()
									handleDesktopSearch()
								}
							}}
							className="h-full border-0 bg-inherit dark:bg-inherit shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						<Select value={desktopCategory} onValueChange={setDesktopCategory}>
							<SelectTrigger className="h-full w-38.75 border-0 dark:bg-inherit bg-transparent text-sm shadow-none focus:ring-0 focus:ring-offset-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="end">
								{searchCategories.map((c) => (
									<SelectItem key={c} value={c}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<button
							type="button"
							onClick={handleDesktopSearch}
							className="mr-1.5 ml-1 flex h-8 shrink-0 cursor-pointer bg-vm-tangerine items-center rounded-full px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							Search
						</button>
					</div>
				</div>


				<div className="flex items-center gap-0.5 sm:gap-1">
					<ThemeToggleButton className="hidden h-10 w-10 sm:inline-flex" />

					{authLoading ? (
						<div
							className="h-10 w-10 items-center justify-center inline-flex"
							aria-label="Loading account"
						>
							<Loader2 className="h-5 w-5 animate-spin" />
						</div>
					) : isAuthenticated && user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="h-10 w-10 items-center justify-center inline-flex"
									aria-label="Open account menu"
								>
									<Avatar className="h-7 w-7">
										<AvatarImage src={user.avatar || user.avatarUrl || user.profilePic} alt={displayName || "User"} />
										<AvatarFallback className="text-[11px] font-semibold">{initials}</AvatarFallback>
									</Avatar>
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<p className="truncate text-sm font-semibold">{displayName || "Account"}</p>
									<p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/account">
										<UserCircleIcon className="mr-2 h-4 w-4" />
										My Account
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/account/orders">
										<PackageIcon className="mr-2 h-4 w-4" />
										Orders
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/account/wishlist">
										<HeartIcon className="mr-2 h-4 w-4" />
										Wishlist
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/messages">
										<MessageCircleIcon className="mr-2 h-4 w-4" />
										Chats
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/account/settings">
										<GearIcon className="mr-2 h-4 w-4" />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="sm:hidden" asChild>
									<div className="flex w-full items-center justify-between">
										<span className="text-sm">Theme</span>
										<ThemeToggleButton className="h-8 w-8" />
									</div>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<SignOutIcon className="mr-2 h-4 w-4" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/login"
									aria-label="Sign in"
									className="h-10 w-10 items-center justify-center inline-flex"
								>
									<UserCircleIcon className="h-7 w-7" weight="light" />
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Sign in to buy and sell</p>
							</TooltipContent>
						</Tooltip>
					)}

					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="/account/wishlist"
								aria-label="Wishlist"
								className="relative hidden h-10 w-10 items-center justify-center sm:inline-flex"
							>
								<HeartIcon className="h-7 w-7" weight="light" />
								{wishlistCount > 0 && (
									<Badge
										className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full border-2 border-background bg-vm-tangerine p-0 text-[10px] font-bold leading-none text-white"
									>
										{wishlistCount}
									</Badge>
								)}
							</Link>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Wishlist</p>
						</TooltipContent>
					</Tooltip>

					<CartSheet />
				</div>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 3. Nav row — categories + main links
----------------------------------------------------------- */
function NavBar() {
	return (
		<div className="hidden bg-card pb-4 shadow-lg lg:block">
			<div className="container mx-auto flex h-12 items-center gap-2 px-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="h-10 gap-2.5 rounded-full  px-4 bg-vm-graphite font-semibold text-white"
						>
							<ListIcon className="h-4 w-4" />
							All Categories
							<CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-60" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-[240px] p-1"
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Browse Campus Marketplace
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{categories.map(({ label, icon: Icon }) => (
							<DropdownMenuItem
								key={label}
								className="cursor-pointer gap-2.5 py-2 text-sm"
							>
								<Icon className="h-4 w-4 text-muted-foreground" />
								{label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<NavigationMenu className="ml-1">
					<NavigationMenuList className="gap-0">
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/"
								className="inline-flex h-10 items-center px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
							>
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 bg-transparent text-sm font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground">
								Shop
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[560px] grid-cols-2 gap-1 p-3">
									{[
										"Today's Deals",
										"New Arrivals",
										"Best Sellers",
										"Trending on Campus",
										"Hostel Essentials",
										"Exam Week Picks",
										"Local Brands",
										"Clearance",
									].map((item) => (
										<Link
											key={item}
											href={`/search?query=${encodeURIComponent(item)}`}
											className="rounded-md px-3 py-2 text-sm transition hover:bg-muted"
										>
											{item}
										</Link>
									))}
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 bg-transparent text-sm font-medium text-foreground/70 hover:text-foreground data-[state=open]:text-foreground">
								Food Court
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[480px] grid-cols-2 gap-0.5 p-2">
									{[
										"Order Now",
										"Popular Vendors",
										"Breakfast",
										"Lunch Specials",
										"Drinks & Smoothies",
										"Snacks",
										"Pre-order for Tomorrow",
										"Group Orders",
									].map((item) => (
										<Link
											key={item}
											href={`/search?type=restaurants&query=${encodeURIComponent(item)}`}
											className="rounded-md px-3 py-2 text-sm transition hover:bg-muted"
										>
											{item}
										</Link>
									))}
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink
								href="/stores"
								className="inline-flex h-10 items-center px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
							>
								Vendors
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink
								href="/help"
								className="inline-flex h-10 items-center px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
							>
								Track Order
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink
								href="/sell"
								className="ml-1 inline-flex h-8 items-center bg-vm-tangerine gap-1.5 rounded-full px-4 text-sm font-semibold hover:text-black dark:hover:text-white text-white transition-opacity hover:opacity-90"
							>
								Become a Seller
								<CaretRightIcon className="h-3.5 w-3.5" />
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
					<MapPinIcon className="h-3.5 w-3.5" />
					Delivering to <span className="font-medium text-foreground">KNUST Campus</span>
				</div>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 Mobile search + quick-filter bar (below main row, mobile only)
----------------------------------------------------------- */
function MobileSearchBar() {
	const router = useRouter()
	const [mobileQuery, setMobileQuery] = useState("")

	const handleMobileSearch = useCallback(() => {
		router.push(buildGlobalSearchHref(mobileQuery))
	}, [router, mobileQuery])

	return (
		<div className="md:hidden bg-card border-t border-border/40 px-4 pb-3 pt-2">
			<div className="relative flex h-11 items-center overflow-hidden rounded-full bg-accent transition-all focus-within:bg-background focus-within:shadow-sm">
				<MagnifyingGlassIcon className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
				<Input
					placeholder="Search products, food, stores…"
					value={mobileQuery}
					onChange={(event) => setMobileQuery(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault()
							handleMobileSearch()
						}
					}}
					className="h-full border-0 bg-inherit dark:bg-inherit shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
				<button
					type="button"
					onClick={handleMobileSearch}
					className="mr-1.5 ml-1 flex h-8 shrink-0 cursor-pointer items-center rounded-full bg-vm-tangerine px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					Search
				</button>
			</div>

			<div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<Link
					href="/search"
					className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
				>
					<ShoppingBagIcon className="h-3.5 w-3.5 text-vm-tangerine" />
					Products
				</Link>
				<Link
					href="/restaurants"
					className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
				>
					<ForkKnifeIcon className="h-3.5 w-3.5 text-vm-tangerine" />
					Food
				</Link>
				<Link
					href="/stores"
					className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
				>
					<MapPinIcon className="h-3.5 w-3.5 text-vm-tangerine" />
					Stores
				</Link>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 Composed header
----------------------------------------------------------- */
export default function VarsityMartHeader() {
	return (
		<>
			<header className="sticky top-0 z-50 w-full shadow-sm">
				<AnnouncementBar />
				<MainBar />
				<MobileSearchBar />
				<NavBar />
			</header>
		</>
	)
}
