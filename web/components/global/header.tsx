'use client';
import dynamic from "next/dynamic"
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
	StorefrontIcon,
} from "@phosphor-icons/react"
import { Clock, Loader2, MessageCircleIcon, Monitor, Moon, Sun } from "lucide-react"
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
import { cn } from "@/lib/utils";
const CartSheet = dynamic(() => import("@/components/cart/cart-sheet").then(m => m.CartSheet), { ssr: false })
const FoodCartSheet = dynamic(() => import("@/components/cart/food-cart-sheet").then(m => m.FoodCartSheet), { ssr: false })
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function useScrollDirection() {
	const [hidden, setHidden] = useState(false)
	const lastY = useRef(0)

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY
			if (y > lastY.current + 8) {
				setHidden(true)
			} else if (y < lastY.current - 4) {
				setHidden(false)
			}
			lastY.current = y
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return hidden
}

const RECENT_SEARCHES_KEY = "vm-recent-searches"
const TRENDING_SEARCHES = [
	"jollof", "macbook", "hostel mattress", "calculator",
	"indomie", "sneakers", "phone", "books",
]

function loadRecentSearches(): string[] {
	try {
		const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
		if (!stored) return []
		const parsed = JSON.parse(stored) as string[]
		return Array.isArray(parsed) ? parsed.slice(0, 5) : []
	} catch { return [] }
}

function saveRecentSearch(query: string, current: string[]): string[] {
	const next = [query, ...current.filter((s) => s !== query)].slice(0, 5)
	try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)) } catch { }
	return next
}

function SuggestionButton({
	icon,
	label,
	onSelect,
}: {
	icon: React.ReactNode
	label: string
	onSelect: () => void
}) {
	return (
		<button
			type="button"
			onMouseDown={(e) => e.preventDefault()}
			onClick={onSelect}
			className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
		>
			{icon}
			<span className="truncate">{label}</span>
		</button>
	)
}

function SearchSuggestionsDropdown({
	query,
	recentSearches,
	onSelect,
}: {
	query: string
	recentSearches: string[]
	onSelect: (q: string) => void
}) {
	const q = query.toLowerCase().trim()

	const filteredRecent = q
		? recentSearches.filter((s) => s.toLowerCase().includes(q))
		: recentSearches

	const filteredTrending = (
		q ? TRENDING_SEARCHES.filter((s) => s.toLowerCase().includes(q)) : TRENDING_SEARCHES
	).filter((s) => !filteredRecent.includes(s))

	const isExactMatch =
		filteredRecent.some((s) => s.toLowerCase() === q) ||
		filteredTrending.some((s) => s.toLowerCase() === q)

	const showQueryRow = q.length > 0 && !isExactMatch

	const hasResults = showQueryRow || filteredRecent.length > 0 || filteredTrending.length > 0

	return (
		<div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
			{showQueryRow && (
				<>
					<SuggestionButton
						icon={<MagnifyingGlassIcon className="h-3.5 w-3.5 shrink-0 text-vm-tangerine" />}
						label={`Search "${query.trim()}"`}
						onSelect={() => onSelect(query.trim())}
					/>
					{(filteredRecent.length > 0 || filteredTrending.length > 0) && (
						<div className="mx-3 border-t border-border/60" />
					)}
				</>
			)}

			{filteredRecent.length > 0 && (
				<>
					<p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
						Recent
					</p>
					{filteredRecent.map((s) => (
						<SuggestionButton
							key={s}
							icon={<Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
							label={s}
							onSelect={() => onSelect(s)}
						/>
					))}
					{filteredTrending.length > 0 && <div className="mx-3 my-1 border-t border-border/60" />}
				</>
			)}

			{filteredTrending.length > 0 && (
				<>
					<p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
						Trending on Campus
					</p>
					{filteredTrending.map((s) => (
						<SuggestionButton
							key={s}
							icon={<FireIcon className="h-3.5 w-3.5 shrink-0 text-vm-tangerine" />}
							label={s}
							onSelect={() => onSelect(s)}
						/>
					))}
				</>
			)}

			{!hasResults && (
				<p className="px-4 py-6 text-center text-sm text-muted-foreground">
					No suggestions found
				</p>
			)}

			<div className="h-2" />
		</div>
	)
}

function ThemeToggleButton({ className = "" }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme()
	const isDark = resolvedTheme === "dark"

	return (
		<button
			type="button"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={`h-10 w-10 inline-flex items-center justify-center ${className}`}
		>
			{isDark ? <Sun className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
		</button>
	)
}

function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const options = [
		{ value: "light", icon: Sun, label: "Light" },
		{ value: "dark", icon: Moon, label: "Dark" },
		{ value: "system", icon: Monitor, label: "System" },
	] as const

	return (
		<div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
			{options.map(({ value, icon: Icon, label }) => (
				<button
					key={value}
					type="button"
					aria-label={label}
					onClick={() => setTheme(value)}
					className={cn(
						"flex h-7 w-7 items-center justify-center rounded-md transition-colors",
						theme === value
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<Icon className="h-3.5 w-3.5" />
				</button>
			))}
		</div>
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
	const [desktopQuery, setDesktopQuery] = useState("")
	const [desktopCategory, setDesktopCategory] = useState("All Categories")
	const [isDesktopFocused, setIsDesktopFocused] = useState(false)
	const [desktopRecentSearches, setDesktopRecentSearches] = useState<string[]>([])

	useEffect(() => {
		setDesktopRecentSearches(loadRecentSearches())
	}, [])

	const displayName = user ? `${user.firstName} ${user.lastName} `.trim() : ""
	const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U"

	const handleLogout = async () => {
		await logout()
		router.push("/")
	}

	const navigate = useCallback((url: string) => {
		const targetUrl = new URL(url, window.location.origin)
		const currentUrl = new URL(window.location.href)
		const isSameUrl =
			currentUrl.pathname === targetUrl.pathname &&
			targetUrl.searchParams.get("query") === currentUrl.searchParams.get("query")
		startTransition(() => {
			if (isSameUrl) {
				router.refresh()
			} else {
				router.push(url)
			}
		})
	}, [router])

	const handleDesktopSearch = useCallback(() => {
		const trimmed = desktopQuery.trim()
		if (trimmed) {
			setDesktopRecentSearches((prev) => saveRecentSearch(trimmed, prev))
		}
		setIsDesktopFocused(false)
		navigate(buildGlobalSearchHref(desktopQuery, desktopCategory))
	}, [navigate, desktopCategory, desktopQuery])

	const handleSelectDesktopSuggestion = useCallback((suggestion: string) => {
		setDesktopQuery(suggestion)
		setDesktopRecentSearches((prev) => saveRecentSearch(suggestion, prev))
		setIsDesktopFocused(false)
		navigate(buildGlobalSearchHref(suggestion, desktopCategory))
	}, [navigate, desktopCategory])

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

				<div className="relative hidden flex-1 md:block">
					<div className="relative flex h-11 w-full items-center overflow-hidden rounded-full bg-accent transition-all focus-within:bg-background focus-within:shadow-sm">
						<MagnifyingGlassIcon className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
						<Input
							placeholder="Search for jollof, hoodies, textbooks…"
							value={desktopQuery}
							onChange={(event) => setDesktopQuery(event.target.value)}
							onFocus={() => setIsDesktopFocused(true)}
							onBlur={() => setTimeout(() => setIsDesktopFocused(false), 150)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault()
									handleDesktopSearch()
								}
								if (event.key === "Escape") setIsDesktopFocused(false)
							}}
							className="h-full border-0 bg-inherit shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-inherit"
						/>
						<Select value={desktopCategory} onValueChange={setDesktopCategory}>
							<SelectTrigger className="h-full w-38.75 border-0 bg-transparent text-sm shadow-none focus:ring-0 focus:ring-offset-0 dark:bg-inherit">
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
							className="ml-1 mr-1.5 flex h-8 shrink-0 cursor-pointer items-center rounded-full bg-vm-tangerine px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							Search
						</button>
					</div>
					{isDesktopFocused && (
						<SearchSuggestionsDropdown
							query={desktopQuery}
							recentSearches={desktopRecentSearches}
							onSelect={handleSelectDesktopSuggestion}
						/>
					)}
					{isDesktopFocused && typeof document !== "undefined" && createPortal(
						<div
							className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
							onClick={() => setIsDesktopFocused(false)}
						/>,
						document.body
					)}
				</div>


				<div className="flex items-center gap-0.5 sm:gap-1">
					{/* <ThemeToggleButton className="hidden h-10 w-10 sm:inline-flex" /> */}

					<FoodCartSheet />
					<CartSheet />
					<span className="w-5"></span>
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
							<DropdownMenuContent align="end" className="w-64 p-0">
								{/* ── Profile header ── */}
								<div className="flex flex-col items-center gap-2 px-4 py-5 border-b border-border">
									<Avatar className="h-14 w-14">
										<AvatarImage src={user.avatar || user.avatarUrl || user.profilePic} alt={displayName || "User"} />
										<AvatarFallback className="text-base font-bold">{initials}</AvatarFallback>
									</Avatar>
									<div className="text-center min-w-0 w-full">
										<p className="truncate font-semibold text-sm">{displayName || "Account"}</p>
										<p className="truncate text-xs text-muted-foreground">{user.email}</p>
									</div>
									<ThemeSwitcher />
								</div>

								{/* ── Menu items ── */}
								<div className="py-1.5">
									<DropdownMenuItem asChild>
										<Link href="/account">
											<UserCircleIcon className="mr-2.5 h-4 w-4" />
											My Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/account/orders">
											<PackageIcon className="mr-2.5 h-4 w-4" />
											Orders
										</Link>
									</DropdownMenuItem>
									{!user.hasStore && !user.hasRestaurant ? (
										<DropdownMenuItem asChild>
											<Link href="/seller/start">
												<StorefrontIcon className="mr-2.5 h-4 w-4" />
												Start Selling
											</Link>
										</DropdownMenuItem>
									) : (
										<>
											{user.hasStore && (
												<DropdownMenuItem asChild>
													<Link href="/seller/store">
														<StorefrontIcon className="mr-2.5 h-4 w-4" />
														My Store
													</Link>
												</DropdownMenuItem>
											)}
											{user.hasRestaurant && (
												<DropdownMenuItem asChild>
													<Link href="/seller/restaurant">
														<ForkKnifeIcon className="mr-2.5 h-4 w-4" />
														My Restaurant
													</Link>
												</DropdownMenuItem>
											)}
										</>
									)}
									{ /*	
									<DropdownMenuItem asChild>
										<Link href="/account/wishlist">
											<HeartIcon className="mr-2.5 h-4 w-4" />
											Wishlist
										</Link>
									</DropdownMenuItem>
							*/		}
									<DropdownMenuItem asChild>
										<Link href="/messages">
											<MessageCircleIcon className="mr-2.5 h-4 w-4" />
											Chats
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/account/settings">
											<GearIcon className="mr-2.5 h-4 w-4" />
											Settings
										</Link>
									</DropdownMenuItem>
								</div>

								<DropdownMenuSeparator className="my-0" />
								<div className="py-1.5">
									<DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
										<SignOutIcon className="mr-2.5 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</div>
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
									<UserCircleIcon className="h-7 w-7" weight="regular" />
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Sign in to buy and sell</p>
							</TooltipContent>
						</Tooltip>
					)}

					{/*
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="/account/wishlist"
								aria-label="Wishlist"
								className="relative hidden h-10 w-10 items-center justify-center sm:inline-flex"
							>
								<HeartIcon className="h-7 w-7" weight="regular" />
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
*/}
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
	const [isMobileFocused, setIsMobileFocused] = useState(false)
	const [mobileRecentSearches, setMobileRecentSearches] = useState<string[]>([])

	useEffect(() => {
		setMobileRecentSearches(loadRecentSearches())
	}, [])

	const navigate = useCallback((url: string) => {
		const targetUrl = new URL(url, window.location.origin)
		const currentUrl = new URL(window.location.href)
		const isSameUrl =
			currentUrl.pathname === targetUrl.pathname &&
			targetUrl.searchParams.get("query") === currentUrl.searchParams.get("query")
		startTransition(() => {
			if (isSameUrl) {
				router.refresh()
			} else {
				router.push(url)
			}
		})
	}, [router])

	const handleMobileSearch = useCallback(() => {
		const trimmed = mobileQuery.trim()
		if (trimmed) {
			setMobileRecentSearches((prev) => saveRecentSearch(trimmed, prev))
		}
		setIsMobileFocused(false)
		navigate(buildGlobalSearchHref(mobileQuery))
	}, [navigate, mobileQuery])

	const handleSelectMobileSuggestion = useCallback((suggestion: string) => {
		setMobileQuery(suggestion)
		setMobileRecentSearches((prev) => saveRecentSearch(suggestion, prev))
		setIsMobileFocused(false)
		navigate(buildGlobalSearchHref(suggestion))
	}, [navigate])

	return (
		<div className="md:hidden bg-card border-t border-border/40 px-4 pb-3 pt-2">
			<div className="relative">
				<div className="relative flex h-11 items-center overflow-hidden rounded-full bg-accent transition-all focus-within:bg-background focus-within:shadow-sm">
					<MagnifyingGlassIcon className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
					<Input
						placeholder="Search products, food, stores…"
						value={mobileQuery}
						onChange={(event) => setMobileQuery(event.target.value)}
						onFocus={() => setIsMobileFocused(true)}
						onBlur={() => setTimeout(() => setIsMobileFocused(false), 150)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault()
								handleMobileSearch()
							}
							if (event.key === "Escape") setIsMobileFocused(false)
						}}
						className="h-full border-0 bg-inherit shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-inherit"
					/>
					<button
						type="button"
						onClick={handleMobileSearch}
						className="ml-1 mr-1.5 flex h-8 shrink-0 cursor-pointer items-center rounded-full bg-vm-tangerine px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						Search
					</button>
				</div>
				{isMobileFocused && (
					<SearchSuggestionsDropdown
						query={mobileQuery}
						recentSearches={mobileRecentSearches}
						onSelect={handleSelectMobileSuggestion}
					/>
				)}
				{isMobileFocused && typeof document !== "undefined" && createPortal(
					<div
						className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
						onClick={() => setIsMobileFocused(false)}
					/>,
					document.body
				)}
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
	const headerHidden = useScrollDirection()

	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full shadow-sm transition-transform duration-300 will-change-transform ${headerHidden ? "-translate-y-full" : "translate-y-0"
					}`}
			>
				<AnnouncementBar />
				<MainBar />
				<MobileSearchBar />
				<NavBar />
			</header>
		</>
	)
}
