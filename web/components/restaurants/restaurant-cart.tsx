"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowRight, Users } from "lucide-react"
import { toast } from "sonner"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartLine } from "./cart-line"
import { useCartStore, useCartCount, useCartTotal } from "@/store/cart-store"

function formatGHS(n: number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

function subscribeDesktop(onChange: () => void) {
	if (typeof window === "undefined") return () => undefined
	const mql = window.matchMedia("(min-width: 1024px)")
	mql.addEventListener("change", onChange)
	return () => mql.removeEventListener("change", onChange)
}

function getDesktopSnapshot() {
	if (typeof window === "undefined") return false
	return window.matchMedia("(min-width: 1024px)").matches
}

function CartContent({
	lines,
	total,
	onCheckout,
}: {
	lines: ReturnType<typeof useCartStore.getState>["lines"]
	total: number
	onCheckout: () => void
}) {
	const isEmpty = lines.length === 0

	return isEmpty ? (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
			<div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
				<ShoppingBag className="h-7 w-7 text-muted-foreground" />
			</div>
			<div>
				<p className="font-semibold">Your order is empty</p>
				<p className="mt-1 text-sm text-muted-foreground">Browse the menu and tap + to add items.</p>
			</div>
		</div>
	) : (
		<>
			<ScrollArea className="flex-1">
				<div className="px-5">
					{lines.map((line, i) => (
						<React.Fragment key={line.lineId}>
							<CartLine line={line} />
							{i < lines.length - 1 && <Separator />}
						</React.Fragment>
					))}
				</div>
			</ScrollArea>

			<div className="shrink-0 border-t border-border bg-card px-5 py-4">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Subtotal</span>
					<span className="font-bold">{formatGHS(total)}</span>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">Delivery fee added at checkout.</p>
				<Button
					className="mt-3 w-full bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
					size="lg"
					onClick={onCheckout}
				>
					Proceed to Checkout
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</>
	)
}

export function RestaurantCart() {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const lines = useCartStore((s) => s.lines)
	const count = useCartCount()
	const total = useCartTotal()
	const isDesktop = React.useSyncExternalStore(
		subscribeDesktop,
		getDesktopSnapshot,
		() => false
	)

	const handleCheckout = () => {
		setOpen(false)
		router.push("/food-checkout")
	}

	if (isDesktop) {
		return (
			<aside className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card">
				<div className="border-b border-border px-5 py-4">
					<div className="flex items-center justify-between">
						<h2 className="text-base font-bold">
							Your Order
							{count > 0 && (
								<span className="ml-2 rounded-full bg-vm-tangerine px-2 py-0.5 text-xs font-bold text-white">
									{count}
								</span>
							)}
						</h2>
						<button
							type="button"
							onClick={() => toast.info("Group order coming soon!")}
							className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
						>
							<Users className="h-3.5 w-3.5" />
							Group order
						</button>
					</div>
				</div>
				<div className="flex max-h-[calc(100vh-11rem)] min-h-[22rem] flex-col">
					<CartContent
						lines={lines}
						total={total}
						onCheckout={handleCheckout}
					/>
				</div>
			</aside>
		)
	}

	return (
		<>
			{count > 0 && (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-vm-graphite px-4 py-3 text-white shadow-xl transition-all hover:bg-vm-graphite/90 active:scale-95"
				>
					<div className="relative">
						<ShoppingBag className="h-5 w-5" />
						<span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-vm-tangerine text-[9px] font-black">
							{count}
						</span>
					</div>
					<span className="text-sm font-semibold">{formatGHS(total)}</span>
				</button>
			)}

			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent className="max-h-[90vh] bg-background">
					<DrawerHeader className="border-b border-border px-5 py-3 text-left">
						<div className="flex items-center justify-between">
							<DrawerTitle className="text-base font-bold">
								Your Order
								{count > 0 && (
									<span className="ml-2 rounded-full bg-vm-tangerine px-2 py-0.5 text-xs font-bold text-white">
										{count}
									</span>
								)}
							</DrawerTitle>
							<button
								type="button"
								onClick={() => toast.info("Group order coming soon!")}
								className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
							>
								<Users className="h-3.5 w-3.5" />
								Group order ↗
							</button>
						</div>
					</DrawerHeader>

					<CartContent
						lines={lines}
						total={total}
						onCheckout={handleCheckout}
					/>

					<DrawerFooter className="p-0" />
				</DrawerContent>
			</Drawer>
		</>
	)
}
