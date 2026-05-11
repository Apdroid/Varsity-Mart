"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { OptionGroup } from "./option-group"
import { SidesSelector } from "./sides-selector"
import { ModifierPill } from "./modifier-pill"
import { NotesInput } from "./notes-input"
import { QuantityStepper } from "./quantity-stepper"
import { BundleSuggestions } from "./bundle-suggestions"
import { useCartStore } from "@/store/cart-store"
import type { MenuItem, MenuItemOption, RestaurantWithMenu } from "@/data/restaurant"

type Props = {
	item: MenuItem | null
	restaurant: RestaurantWithMenu
	open: boolean
	onClose: () => void
}

function formatGHS(n: number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		maximumFractionDigits: 0,
	}).format(n)
}

function DietaryBadge({ tag }: { tag: string }) {
	const map: Record<string, { label: string; cls: string }> = {
		vegetarian: { label: "Vegetarian", cls: "bg-emerald-500/10 text-emerald-600" },
		vegan: { label: "Vegan", cls: "bg-green-500/10 text-green-600" },
		halal: { label: "Halal", cls: "bg-sky-500/10 text-sky-600" },
	}
	const entry = map[tag]
	if (!entry) return null
	return (
		<span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${entry.cls}`}>
			{entry.label}
		</span>
	)
}

function CustomizationBody({
	item,
	restaurant,
	onClose,
}: {
	item: MenuItem
	restaurant: RestaurantWithMenu
	onClose: () => void
}) {
	const addLine = useCartStore((s) => s.addLine)
	const [selectedSize, setSelectedSize] = React.useState<MenuItemOption | null>(
		item.sizeOptions?.[0] ?? null
	)
	const [selectedProtein, setSelectedProtein] = React.useState<MenuItemOption | null>(
		item.proteinOptions?.[0] ?? null
	)
	const [selectedSides, setSelectedSides] = React.useState<MenuItemOption[]>([])
	const [selectedModifiers, setSelectedModifiers] = React.useState<string[]>([])
	const [notes, setNotes] = React.useState("")
	const [qty, setQty] = React.useState(1)

	const unitPrice =
		item.basePrice +
		(selectedSize?.priceMod ?? 0) +
		(selectedProtein?.priceMod ?? 0) +
		selectedSides.reduce((s, o) => s + o.priceMod, 0)

	const toggleModifier = (mod: string) =>
		setSelectedModifiers((prev) =>
			prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
		)

	const canAdd = !item.sizeOptions || selectedSize !== null

	const handleAdd = () => {
		if (!canAdd) return
		addLine({
			restaurantId: restaurant.id,
			restaurantName: restaurant.name,
			itemId: item.id,
			itemName: item.name,
			itemImage: item.image,
			selectedSize,
			selectedProtein,
			selectedSides,
			selectedModifiers,
			notes,
			quantity: qty,
			unitPrice,
		})
		toast.success(`${item.name} added to cart`)
		onClose()
	}

	return (
		<div className="grid h-full min-h-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<aside className="hidden min-h-0 border-r border-border bg-card md:grid md:grid-rows-[minmax(13rem,38%)_1fr]">
				<div className="relative h-full w-full overflow-hidden">
					<Image src={item.image} alt={item.name} fill className="object-cover" />
				</div>
				<div className="min-h-0 space-y-3 overflow-y-auto p-5">
					<div className="flex flex-wrap gap-1.5">
						{item.dietaryTags?.map((t) => <DietaryBadge key={t} tag={t} />)}
					</div>
					<h2 className="text-xl font-bold leading-tight">{item.name}</h2>
					<p className="text-sm text-muted-foreground">{item.description}</p>
					{item.allergens && item.allergens.length > 0 && (
						<p className="text-xs text-muted-foreground">
							Contains: {item.allergens.join(", ")}
						</p>
					)}
					<div className="rounded-xl bg-background p-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Live total
						</p>
						<p className="mt-1 text-2xl font-extrabold text-vm-tangerine">
							{formatGHS(unitPrice * qty)}
						</p>
					</div>
				</div>
			</aside>

			<div className="flex min-h-0 flex-col">
				<div className="relative h-40 w-full shrink-0 overflow-hidden md:hidden">
					<Image src={item.image} alt={item.name} fill className="object-cover" />
				</div>

				<ScrollArea className="min-h-0 flex-1">
					<div className="space-y-5 px-5 py-4 md:space-y-6 md:px-6">
						<div className="md:hidden">
							<div className="flex flex-wrap gap-1.5">
								{item.dietaryTags?.map((t) => <DietaryBadge key={t} tag={t} />)}
							</div>
							<h2 className="mt-1.5 text-lg font-bold leading-snug">{item.name}</h2>
							<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
						</div>

						<NotesInput value={notes} onChange={setNotes} />

						<Separator />

						{item.sizeOptions && (
							<>
								<OptionGroup
									label="Size"
									required
									options={item.sizeOptions}
									selected={selectedSize}
									onChange={setSelectedSize}
								/>
								<Separator />
							</>
						)}

						{item.proteinOptions && (
							<>
								<OptionGroup
									label="Protein"
									options={item.proteinOptions}
									selected={selectedProtein}
									onChange={setSelectedProtein}
								/>
								<Separator />
							</>
						)}

						{item.sides && (
							<>
								<SidesSelector
									config={item.sides}
									selected={selectedSides}
									onChange={setSelectedSides}
								/>
								<Separator />
							</>
						)}

						{item.modifiers && item.modifiers.length > 0 && (
							<>
								<div>
									<p className="mb-2.5 text-sm font-semibold">Preferences</p>
									<div className="flex flex-wrap gap-2">
										{item.modifiers.slice(0, 8).map((mod) => (
											<ModifierPill
												key={mod}
												label={mod}
												active={selectedModifiers.includes(mod)}
												onToggle={() => toggleModifier(mod)}
											/>
										))}
									</div>
								</div>
								<Separator />
							</>
						)}

						{item.bundleSuggestionIds && item.bundleSuggestionIds.length > 0 && (
							<BundleSuggestions
								restaurant={restaurant}
								suggestionIds={item.bundleSuggestionIds}
							/>
						)}
					</div>
				</ScrollArea>

				<div className="shrink-0 border-t border-border bg-background px-5 py-4 md:px-6">
					<div className="flex items-center gap-3">
						<QuantityStepper value={qty} onChange={setQty} />
						<button
							type="button"
							disabled={!canAdd}
							onClick={handleAdd}
							className="flex flex-1 items-center justify-between rounded-xl bg-vm-tangerine px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
						>
							<span>Add to cart</span>
							<span>{formatGHS(unitPrice * qty)}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export function CustomizationSheet({ item, restaurant, open, onClose }: Props) {
	if (!item) return null

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="flex h-[88vh] w-[96vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:h-[90vh] sm:max-h-[46rem] sm:w-[92vw] sm:max-w-5xl">
				<DialogTitle className="sr-only">{item.name}</DialogTitle>
				<CustomizationBody
					key={item.id}
					item={item}
					restaurant={restaurant}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	)
}
