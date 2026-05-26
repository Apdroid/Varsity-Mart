'use client';
import dynamic from "next/dynamic"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"
import {
	MagnifyingGlassIcon,
	CaretDownIcon,
	CaretRightIcon,
	ListIcon,
	PhoneIcon,
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
	BellIcon,
} from "@phosphor-icons/react"
import { Clock, Loader2, MessageCircleIcon, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import { useAuthGate } from "@/providers/auth-gate-provider";
import { useNotifications } from "@/hooks/queries/use-user";
import { useRouter, usePathname } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CampusSelector } from "./campus-selector";
import { UnauthUserMenu } from "./unauth-user-menu";
import { Button } from "@/components/ui/button";

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


function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()
	const options = [
		{ value: "light", icon: Sun, label: "Light" },
		{ value: "dark", icon: Moon, label: "Dark" },
	] as const

	return (
		<div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5">
			{options.map(({ value, icon: Icon, label }) => (
				<button
					key={value}
					type="button"
					aria-label={label}
					onClick={() => setTheme(value)}
					className={cn(
						"flex h-10 w-10 items-center justify-center rounded-full  transition-colors",
						theme === value
							? "bg-background text-vm-tangerine shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<Icon className="h-5 w-5" />
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

type AnyIcon = React.ComponentType<{ className?: string }>

const announcementDropdowns = [
	{ label: "EN", options: ["English", "Twi", "Ga", "Ewe"] },
	{ label: "GHS", options: ["GHS — Ghana Cedi", "USD — US Dollar"] },
]

const socialLinks: { href: string; label: string; Icon: PhosphorIcon }[] = [
	{ href: "https://x.com", label: "Twitter", Icon: XLogoIcon },
	{ href: "https://facebook.com", label: "Facebook", Icon: FacebookLogoIcon },
]

const quickFilters = [
	{ href: "/products", prefix: "/products", label: "Products" },
	{ href: "/restaurants", prefix: "/restaurants", label: "Food & Drinks" },
	{ href: "/stores", prefix: "/stores", label: "Stores" },
]

const topAccountItems: { href: string; label: string; Icon: AnyIcon }[] = [
	{ href: "/account", Icon: UserCircleIcon, label: "My Account" },
	{ href: "/account/orders", Icon: PackageIcon, label: "Orders" },
]

const bottomAccountItems: { href: string; label: string; Icon: AnyIcon }[] = [
	{ href: "/messages", Icon: MessageCircleIcon as AnyIcon, label: "Chats" },
	{ href: "/account/settings", Icon: GearIcon, label: "Settings" },
]

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

function formatNotificationTime(dateStr: string) {
	const date = new Date(dateStr)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffMins = Math.floor(diffMs / 60000)
	const diffHours = Math.floor(diffMs / 3600000)
	const diffDays = Math.floor(diffMs / 86400000)

	if (diffMins < 1) return "Just now"
	if (diffMins < 60) return `${diffMins}m`
	if (diffHours < 24) return `${diffHours}h`
	if (diffDays < 7) return `${diffDays}d`
	return date.toLocaleDateString()
}

function getNotificationGlyph(type: string) {
	switch (type) {
		case "order_update":
			return "📦"
		case "new_message":
		case "message":
			return "💬"
		case "promotion":
			return "🎉"
		case "price_drop":
			return "💰"
		case "new_follower":
			return "👋"
		case "review":
			return "⭐"
		default:
			return "🔔"
	}
}

// function getWishlistCount(...sources: Array<unknown>): number {
// 	for (const source of sources) {
// 		if (!source || typeof source !== "object") continue
// 		const data = source as Record<string, unknown>
// 		const value =
// 			data.wishlistCount ??
// 			data.wishlist_count ??
// 			data.likedCount ??
// 			data.liked_count ??
// 			data.savedCount ??
// 			data.saved_count
//
// 		if (typeof value === "number" && Number.isFinite(value)) {
// 			return Math.max(0, value)
// 		}
// 		if (typeof value === "string") {
// 			const parsed = Number(value)
// 			if (Number.isFinite(parsed)) {
// 				return Math.max(0, parsed)
// 			}
// 		}
// 	}
// 	return 0
// }
//
/* -----------------------------------------------------------
	 1. Announcement bar — graphite background
----------------------------------------------------------- */
function AnnouncementBar() {
	return (
		<div
			className="hidden w-full bg-vm-graphite text-xs text-white md:block"
		>
			<div className="vm-section mx-auto flex h-9 items-center justify-between px-4">
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
					<Link
						href="tel:+233240000000"
						className="flex items-center gap-1.5 text-white/75 transition hover:text-white"
					>
						<PhoneIcon className="h-3.5 w-3.5" />
						+233 24 000 0000
					</Link>

					<Separator orientation="vertical" className="h-3 bg-white/15" />

					{announcementDropdowns.map(({ label, options }) => (
						<DropdownMenu key={label}>
							<DropdownMenuTrigger className="flex items-center gap-1 text-white/75 transition hover:text-white">
								{label} <CaretDownIcon className="h-3 w-3" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="min-w-32">
								{options.map((option) => (
									<DropdownMenuItem key={option}>{option}</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					))}

					<Separator orientation="vertical" className="h-3 bg-white/15" />

					<div className="flex items-center gap-3 text-white/75">
						{socialLinks.map(({ href, label, Icon }) => (
							<Link key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition hover:text-white">
								<Icon className="h-4 w-4" weight="bold" />
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 2. Main row — logo · search · account/cart
----------------------------------------------------------- */
function MainBar({ checkHasStore }: { checkHasStore: (hasStore: boolean) => void }) {
	const router = useRouter()
	const { user, isAuthenticated, isLoading: authLoading } = useAuth()
	const shouldLoadNotifications = isAuthenticated && !authLoading
	const { data: notificationsData, isLoading: notificationsLoading } = useNotifications(1, 8, false, {
		enabled: shouldLoadNotifications,
	})
	const [desktopQuery, setDesktopQuery] = useState("")
	const [desktopCategory, setDesktopCategory] = useState("All Categories")
	const [isDesktopFocused, setIsDesktopFocused] = useState(false)
	const [desktopRecentSearches, setDesktopRecentSearches] = useState<string[]>([])
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setDesktopRecentSearches(loadRecentSearches())
		checkHasStore(
			Boolean(user?.hasStore)
		)
	}, [checkHasStore, user?.hasStore])

	const displayName = user ? `${user.firstName} ${user.lastName} `.trim() : ""
	const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U"
	const notifications = notificationsData?.results ?? []
	const unreadCount = notifications.filter((notification) => !notification.isRead).length
	const unreadCountLabel = unreadCount > 99 ? "99+" : unreadCount

	const handleLogout = () => router.push("/logout")

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
			<div className="vm-section mx-auto flex h-18 items-center justify-between gap-2 px-3 md:h-16 md:gap-4 md:px-4">
				{/* Mobile Navigation Menu */}
				<Sheet>
					<SheetTrigger asChild>
						<ListIcon className=" md:hidden h-9 w-9 " />
					</SheetTrigger>
					<SheetContent side="left" className="w-80 p-0 border-none">
						<SheetHeader className="p-4">
							<SheetTitle className="text-left">
								<Logo variant="auth" className="" />
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
					<Logo variant="header" className="w-28 md:w-auto" />
				</Link>

				{/* Compact Search Bar */}
				<div className="relative hidden flex-1 md:block md:max-w-2xl">
					<div className="relative flex h-10 w-full items-center overflow-hidden rounded-full bg-accent transition-all focus-within:bg-background focus-within:shadow-sm">
						<MagnifyingGlassIcon className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
						<Input
							placeholder="Search…"
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
							className="h-full flex-1 border-0 bg-inherit text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-graphite"
						/>
						<Select value={desktopCategory} onValueChange={setDesktopCategory}>
							<SelectTrigger className="h-full w-32 border-0 bg-transparent text-xs shadow-none focus:ring-0 focus:ring-offset-0 dark:bg-inherit">
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="end">
								{searchCategories.map((c) => (
									<SelectItem key={c} value={c} className="text-xs">
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<button
							type="button"
							onClick={handleDesktopSearch}
							className="ml-1 mr-1 flex h-7 shrink-0 cursor-pointer items-center rounded-full bg-vm-tangerine px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
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

				{/* Campus Selector - Hidden on Mobile */}


				{/* <ThemeToggleButton className="hidden h-10 w-10 sm:inline-flex" /> */}
				<div className="flex gap-1.5 md:gap-4">

					<div className="hidden lg:flex">
						<CampusSelector />
					</div>
					<FoodCartSheet />
					<CartSheet />

					{authLoading ? (
						<div
							className="h-10 w-10 items-center justify-center inline-flex"
							aria-label="Loading account"
						>
							<Loader2 className="h-5 w-5 animate-spin" />
						</div>
					) : isAuthenticated && user ? (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="relative h-10 w-10 items-center justify-center hidden md:inline-flex"
										aria-label="Open notifications menu"
									>
										<BellIcon className="h-6 w-6" weight="regular" />
										{unreadCount > 0 && (
											<Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full border-0 bg-vm-tangerine px-1.5 text-[10px] font-bold leading-none text-white">
												{unreadCountLabel}
											</Badge>
										)}
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-88 p-0">
									<div className="px-4 pt-4 pb-2">
										<div className="flex items-center justify-between gap-2">
											<p className="text-sm font-semibold">Notifications</p>
											{unreadCount > 0 && (
												<p className="text-xs text-muted-foreground">
													{unreadCount} unread
												</p>
											)}
										</div>
									</div>
									<div className="px-2 pb-2">
										{notificationsLoading ? (
											<div className="flex items-center justify-center py-8 text-muted-foreground">
												<Loader2 className="h-4 w-4 animate-spin" />
											</div>
										) : notifications.length === 0 ? (
											<p className="px-2 py-8 text-center text-sm text-muted-foreground">
												No notifications yet
											</p>
										) : (
											<>
												{notifications.slice(0, 5).map((notification) => (
													<DropdownMenuItem key={notification.id} asChild className="py-2">
														<Link href="/account/notifications" className="items-start">
															<span className="mr-2 text-base">
																{getNotificationGlyph(notification.type)}
															</span>
															<span className="min-w-0 flex-1">
																<span className={cn("block truncate text-sm", !notification.isRead && "font-semibold")}>
																	{notification.title}
																</span>
																<span className="block truncate text-xs text-muted-foreground">
																	{notification.message}
																</span>
															</span>
															<span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
																{formatNotificationTime(notification.createdAt)}
															</span>
														</Link>
													</DropdownMenuItem>
												))}
												<DropdownMenuSeparator className="my-1" />
												<DropdownMenuItem asChild className="justify-center py-2 text-sm font-medium text-vm-tangerine focus:text-vm-tangerine">
													<Link href="/account/notifications">View all notifications</Link>
												</DropdownMenuItem>
											</>
										)}
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger asChild className="">
									<button
										type="button"
										className="relative h-10 w-10 items-center justify-center inline-flex"
										aria-label="Open account menu"
									>
										<Avatar className={cn("h-8 w-8 md:h-10 md:w-10",
											"after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:transition-colors")}>
											<AvatarImage src={user.avatar || user.avatarUrl || user.profilePic} alt={displayName || "User"} />
											<AvatarFallback className="text-[11px] font-semibold">{initials}</AvatarFallback>
										</Avatar>
										{unreadCount > 0 && (
											<span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-vm-tangerine md:hidden" />
										)}
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-64 p-0">
									{/* ── Profile header ── */}
									<div className="flex flex-col items-center gap-2 px-4 py-5">
										<Avatar className="h-20 w-20">
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
									<div className="py-1.5 px-4">
										{topAccountItems.map(({ href, Icon, label }) => (
											<DropdownMenuItem key={href} asChild className="text-base">
												<Link href={href}>
													<Icon className="mr-2.5 size-5" />
													{label}
												</Link>
											</DropdownMenuItem>
										))}

										{!user.hasStore && !user.hasRestaurant ? (
											<DropdownMenuItem asChild className="text-base">
												<Link href="/seller/start">

													<StorefrontIcon className="mr-2.5 size-5" />
													Start Selling
												</Link>
											</DropdownMenuItem>
										) : (
											<>
												{user.hasStore && (
													<DropdownMenuItem asChild className="text-base">
														<Link href="/seller/store">
															<StorefrontIcon className="mr-2.5 size-5" />
															My Store
														</Link>
													</DropdownMenuItem>
												)}
												{user.hasRestaurant && (
													<DropdownMenuItem asChild className="text-base">
														<Link href="/seller/restaurant">
															<ForkKnifeIcon className="mr-2.5 size-5" />
															My Restaurant
														</Link>
													</DropdownMenuItem>
												)}
											</>
										)}

										{bottomAccountItems.map(({ href, Icon, label }) => (
											<DropdownMenuItem key={href} asChild className="text-base">
												<Link href={href}>
													<Icon className="mr-2.5 size-5" />
													{label}
												</Link>
											</DropdownMenuItem>
										))}
									</div>

									<DropdownMenuSeparator className="my-0" />
									<div className="py-1.5">
										<DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
											<SignOutIcon className="mr-2.5 size-5" />
											Sign Out
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<UnauthUserMenu />
							<Button
								asChild
								className="hidden sm:inline-flex h-10 rounded-full bg-vm-tangerine hover:bg-vm-tangerine/90 px-6"
							>
								<Link href="/register">Create Account</Link>
							</Button>
						</>
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
			</div >
		</div>
	)
}

/* -----------------------------------------------------------
	 3. Nav row — categories + main links
----------------------------------------------------------- */
function NavLink({ href, children, exact }: { href: string; children: React.ReactNode; exact?: boolean }) {
	const pathname = usePathname()
	const isActive = exact ? pathname === href : pathname.startsWith(href)
	return (
		<NavigationMenuItem>
			<NavigationMenuLink
				href={href}
				className={cn(
					"relative inline-flex h-10 items-center px-3 hover:bg-none text-sm font-medium transition-colors hover:text-vm-tangerine",
					"after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:transition-colors",
					isActive
						? "text-foreground font-bold after:bg-vm-tangerine"
						: "text-foreground after:bg-transparent"
				)}
			>
				{children}
			</NavigationMenuLink>
		</NavigationMenuItem>
	)
}

function NavBar({ hasStore }: { hasStore: boolean }) {
	const router = useRouter()
	const { requireAuth } = useAuthGate()
	const sellerCtaLabel = hasStore ? "My Store" : "Become a Seller"
	const sellerCtaHref = hasStore ? "/seller/store" : "/seller/start"
	return (
		<div className="hidden bg-card pb-4 shadow-sm lg:block">
			<div className="vm-section mx-auto flex h-12 items-center justify-between px-4">
				{/* Left — primary nav with active-state awareness */}
				<NavigationMenu>
					<NavigationMenuList className="gap-3">
						<NavLink href="/" exact>Home</NavLink>
						<NavLink href="/products">Products</NavLink>
						<NavLink href="/restaurants">Restaurants</NavLink>
						<NavLink href="/stores">Stores & Vendors</NavLink>
						<NavigationMenuItem>
							<button
								type="button"
								onClick={() => requireAuth(() => router.push(sellerCtaHref))}
								className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-vm-tangerine px-4 text-sm font-semibold text-white hover:border-2 hover:border-vm-tangerine hover:bg-accent hover:text-foreground transition-all ease-linear dark:hover:text-vm-tangerine"
							>
								{sellerCtaLabel}
								<CaretRightIcon className="h-3.5 w-3.5" />
							</button>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* Right — category dropdowns + CTA */}
				<NavigationMenu>
					<NavigationMenuList className="gap-0">
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-10 bg-transparent text-sm font-medium text-foreground hover:text-foreground data-[state=open]:text-foreground">
								Shop
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-120 grid-cols-2 gap-1 p-3">
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
							<NavigationMenuTrigger className="h-10 bg-transparent text-sm font-medium text-foreground hover:text-foreground data-[state=open]:text-foreground">
								Food Court
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-120 grid-cols-2 gap-0.5 p-2">
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

						<NavLink href="/help">Track Order</NavLink>

					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</div>
	)
}

/* -----------------------------------------------------------
	 Mobile search + quick-filter bar (below main row, mobile only)
----------------------------------------------------------- */
function MobileSearchBar({ hasStore }: { hasStore: boolean }) {
	const sellerCtaLabel = hasStore ? "My Store" : "Become a Seller"
	const sellerCtaHref = hasStore ? "/seller/store" : "/seller/start"
	const router = useRouter()
	const { requireAuth } = useAuthGate()
	const pathname = usePathname()
	const [mobileQuery, setMobileQuery] = useState("")
	const [isMobileFocused, setIsMobileFocused] = useState(false)
	const [mobileRecentSearches, setMobileRecentSearches] = useState<string[]>([])

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
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
		<div className="border-t border-border/40 bg-card px-3 pb-2 pt-1.5 md:hidden">
			<div className="relative">
				<div className="relative flex h-10 items-center overflow-hidden rounded-full transition-all">
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
						className="h-full border-0 bg-accent rounded-r-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-graphite px-4"
					/>
					<button
						type="button"
						onClick={handleMobileSearch}
						className="flex h-full w-10 shrink-0 cursor-pointer items-center justify-center rounded-r-full bg-vm-tangerine text-white transition-opacity hover:opacity-90"
						aria-label="Search"
					>
						<MagnifyingGlassIcon className="h-3.5 w-3.5" />
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

			<div className="mt-2 flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
				{quickFilters.map(({ href, prefix, label }) => (
					<Link
						key={href}
						href={href}
						className={cn(
							"shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors hover:text-vm-tangerine",
							pathname.startsWith(prefix)
								? "text-vm-graphite dark:text-vm-tangerine font-semibold"
								: "text-foreground"
						)}
					>
						{label}
					</Link>
				))}
				<div className="mx-1 h-3.5 w-px shrink-0 bg-border" />
				<button
					type="button"
					onClick={() => requireAuth(() => router.push(sellerCtaHref))}
					className="shrink-0 inline-flex items-center gap-1 rounded-full bg-vm-tangerine px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
				>
					{sellerCtaLabel}
					<CaretRightIcon className="h-3 w-3" />
				</button>
			</div>

		</div>
	)
}

/* -----------------------------------------------------------
	 Composed header
----------------------------------------------------------- */
export default function VarsityMartHeader() {
	const headerHidden = useScrollDirection()
	const [hasStore, setHasStore] = useState(false);

	const handleStore = (hasStore: boolean) => {
		setHasStore(hasStore)
	}
	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full   transition-transform duration-300 will-change-transform ${headerHidden ? "-translate-y-full" : "translate-y-0"
					}`}
			>
				{/* <AnnouncementBar /> */}
				<MainBar checkHasStore={handleStore} />
				<MobileSearchBar hasStore={hasStore} />
				<NavBar hasStore={hasStore} />
			</header>
		</>
	)
}
