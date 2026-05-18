"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { BowlSteamIcon, ForkKnifeIcon } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { CartLine } from "@/components/restaurants/cart-line"
import { useCartStore, useCartCount, useCartTotal } from "@/store/cart-store"

function formatGHS(n: number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

export function FoodCartSheet() {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const lines = useCartStore((s) => s.lines)
	const count = useCartCount()
	const total = useCartTotal()

	// Group lines by restaurant so items are clearly attributed
	const restaurants = React.useMemo(() => {
		const map = new Map<string, { name: string; lines: typeof lines }>()
		lines.forEach((line) => {
			if (!map.has(line.restaurantId)) {
				map.set(line.restaurantId, { name: line.restaurantName, lines: [] })
			}
			map.get(line.restaurantId)!.lines.push(line)
		})
		return Array.from(map.values())
	}, [lines])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Food order"
					className="relative h-10 w-10 inline-flex items-center justify-center"
				>
					<BowlSteamIcon className="h-7 w-7" weight="regular" />
					{count > 0 && (
						<Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 rounded-full border-2 border-background bg-vm-tangerine p-0 text-[10px] font-bold leading-none text-white">
							{count}
						</Badge>
					)}
				</button>
			</SheetTrigger>

			<SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
				<SheetHeader className="border-b border-border px-5 py-4">
					<SheetTitle className="flex items-center gap-2 text-base">
						Food Order
						{count > 0 && (
							<Badge className="h-5 rounded-full bg-vm-tangerine px-1.5 text-[10px] font-bold text-white">
								{count}
							</Badge>
						)}
					</SheetTitle>
				</SheetHeader>

				{lines.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
						<div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
							<ForkKnifeIcon className="h-7 w-7 text-muted-foreground" weight="light" />
						</div>
						<div>
							<p className="font-semibold">No food items yet</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Browse the food court and add items to your order.
							</p>
						</div>
						<Button
							className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
							onClick={() => { setOpen(false); router.push("/restaurants") }}
						>
							Browse food court
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1">
							<div className="space-y-4 px-5 py-4">
								{restaurants.map((restaurant) => (
									<div key={restaurant.name}>
										<p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											{restaurant.name}
										</p>
										{restaurant.lines.map((line, i) => (
											<React.Fragment key={line.lineId}>
												<CartLine line={line} />
												{i < restaurant.lines.length - 1 && <Separator />}
											</React.Fragment>
										))}
									</div>
								))}
							</div>
						</ScrollArea>

						<div className="space-y-3 border-t border-border bg-card px-5 py-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Subtotal ({count} item{count !== 1 ? "s" : ""})
								</span>
								<span className="text-base font-bold">{formatGHS(total)}</span>
							</div>
							<p className="text-xs text-muted-foreground">
								Delivery fee calculated at checkout.
							</p>
							<Button
								className="w-full bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
								onClick={() => { setOpen(false); router.push("/food-checkout") }}
							>
								Proceed to Checkout
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setOpen(false)}
							>
								Continue Browsing
							</Button>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	)
}
