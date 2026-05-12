import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MenuItemOption } from "@/lib/api/types"

export type CartLine = {
	lineId: string
	restaurantId: string
	restaurantName: string
	itemId: string
	itemName: string
	itemImage?: string
	selectedSize: MenuItemOption | null
	selectedProtein: MenuItemOption | null
	selectedSides: MenuItemOption[]
	selectedModifiers: string[]
	notes: string
	quantity: number
	unitPrice: number
	lineTotal: number
}

type CartStore = {
	lines: CartLine[]
	addLine: (line: Omit<CartLine, "lineId" | "lineTotal">) => void
	updateQty: (lineId: string, delta: number) => void
	removeLine: (lineId: string) => void
	clearCart: () => void
}

function fingerprint(line: Omit<CartLine, "lineId" | "lineTotal">): string {
	return [
		line.restaurantId,
		line.itemId,
		line.selectedSize?.name ?? "",
		line.selectedProtein?.name ?? "",
		line.selectedSides
			.map((s) => s.name)
			.sort()
			.join(","),
		[...line.selectedModifiers].sort().join(","),
		line.notes.trim(),
	].join("|")
}

function newId(): string {
	return Math.random().toString(36).slice(2, 10)
}

export const useCartStore = create<CartStore>()(
	persist(
		(set) => ({
			lines: [],

			addLine(incoming) {
				const key = fingerprint(incoming)
				set((state) => {
					const existing = state.lines.find(
						(l) => fingerprint(l) === key
					)
					if (existing) {
						return {
							lines: state.lines.map((l) =>
								l.lineId === existing.lineId
									? {
										...l,
										quantity: l.quantity + incoming.quantity,
										lineTotal: l.unitPrice * (l.quantity + incoming.quantity),
									}
									: l
							),
						}
					}
					const newLine: CartLine = {
						...incoming,
						lineId: newId(),
						lineTotal: incoming.unitPrice * incoming.quantity,
					}
					return { lines: [...state.lines, newLine] }
				})
			},

			updateQty(lineId, delta) {
				set((state) => {
					const updated = state.lines
						.map((l) =>
							l.lineId === lineId
								? {
									...l,
									quantity: l.quantity + delta,
									lineTotal: l.unitPrice * (l.quantity + delta),
								}
								: l
						)
						.filter((l) => l.quantity > 0)
					return { lines: updated }
				})
			},

			removeLine(lineId) {
				set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) }))
			},

			clearCart() {
				set({ lines: [] })
			},
		}),
		{ name: "vm-cart" }
	)
)

/* Derived selectors */
export function useCartCount(): number {
	return useCartStore((s) =>
		s.lines.reduce((sum, l) => sum + l.quantity, 0)
	)
}

export function useCartTotal(): number {
	return useCartStore((s) =>
		s.lines.reduce((sum, l) => sum + l.lineTotal, 0)
	)
}
