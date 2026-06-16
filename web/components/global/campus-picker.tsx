"use client"

import { useState, useMemo } from "react"
import { MapPinIcon, BuildingsIcon, CheckIcon, CaretRightIcon, ArrowLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Loader2 } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCampus, type GuestCampusSelection } from "@/providers/campus-provider"
import { useUniversities, useCampusesByUniversity } from "@/hooks/queries/use-campus"
import type { University, Campus } from "@/lib/api/types"

export function CampusPicker() {
	const { showPicker, closePicker, saveGuestSelection, isFromProfile } = useCampus()
	const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
	const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null)
	const [uniSearch, setUniSearch] = useState("")

	const { data: universities, isLoading: uniLoading } = useUniversities()
	const { data: campuses, isLoading: campusLoading } = useCampusesByUniversity(
		selectedUniversity?.id ?? ""
	)

	const filteredUniversities = useMemo(() => {
		const list = universities ?? []
		const q = uniSearch.trim().toLowerCase()
		if (!q) return list
		return list.filter(
			(u) =>
				u.name.toLowerCase().includes(q) ||
				(u.short_name?.toLowerCase().includes(q) ?? false)
		)
	}, [universities, uniSearch])

	if (isFromProfile) return null

	const step = selectedUniversity ? "campus" : "university"

	const handleSelectUniversity = (uni: University) => {
		setSelectedUniversity(uni)
		setSelectedCampus(null)
	}

	const handleBack = () => {
		setSelectedUniversity(null)
		setSelectedCampus(null)
		setUniSearch("")
	}

	const handleSave = () => {
		if (!selectedUniversity || !selectedCampus) return
		const selection: GuestCampusSelection = {
			universityId: selectedUniversity.id,
			universityName: selectedUniversity.name,
			campusId: selectedCampus.id,
			campusName: selectedCampus.name,
		}
		saveGuestSelection(selection)
	}

	return (
		<Dialog open={showPicker} onOpenChange={(open) => { if (!open) closePicker() }}>
			<DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">

				{/* Header */}
				<DialogHeader className="border-b border-foreground/8 px-5 py-4 shrink-0">
					<div className="flex items-center gap-2">
						{step === "campus" && (
							<button
								type="button"
								onClick={handleBack}
								className="mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Back to institution selection"
							>
								<ArrowLeftIcon className="h-4 w-4" />
							</button>
						)}
						<MapPinIcon className="h-5 w-5 shrink-0 text-vm-tangerine" />
						<DialogTitle className="text-base">
							{step === "university" ? "Select your institution" : selectedUniversity!.name}
						</DialogTitle>
					</div>
					<DialogDescription className="text-left text-xs mt-1">
						{step === "university"
							? "This helps us show you relevant listings near your campus."
							: "Now choose your campus."}
					</DialogDescription>

					{/* Step pills */}
					<div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<span className={cn("transition-colors", step === "university" ? "font-semibold text-vm-tangerine" : "")}>
							Institution
						</span>
						<CaretRightIcon className="h-3 w-3" />
						<span className={cn("transition-colors", step === "campus" ? "font-semibold text-vm-tangerine" : "")}>
							Campus
						</span>
					</div>
				</DialogHeader>

				{/* Search bar — only on university step */}
				{step === "university" && (
					<div className="border-b border-foreground/8 px-4 py-3 shrink-0">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								autoFocus
								placeholder="Search institutions…"
								value={uniSearch}
								onChange={(e) => setUniSearch(e.target.value)}
								className="pl-9 text-sm"
							/>
						</div>
					</div>
				)}

				{/* Scrollable list */}
				<div className="min-h-0 flex-1 overflow-y-auto">
					{step === "university" ? (
						uniLoading ? (
							<div className="flex justify-center py-12">
								<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
							</div>
						) : filteredUniversities.length === 0 ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								No institutions match &ldquo;{uniSearch}&rdquo;
							</p>
						) : (
							<ul className="divide-y divide-foreground/6">
								{filteredUniversities.map((uni) => (
									<li key={uni.id}>
										<button
											type="button"
											onClick={() => handleSelectUniversity(uni)}
											className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted"
										>
											<BuildingsIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-foreground">
													{uni.name}
												</p>
												{uni.short_name && (
													<p className="text-[11px] text-muted-foreground">{uni.short_name}</p>
												)}
											</div>
											<CaretRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
										</button>
									</li>
								))}
							</ul>
						)
					) : (
						campusLoading ? (
							<div className="flex justify-center py-12">
								<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
							</div>
						) : (
							<ul className="divide-y divide-foreground/6">
								{(campuses ?? [] as Campus[]).map((campus) => {
									const isSelected = selectedCampus?.id === campus.id
									return (
										<li key={campus.id}>
											<button
												type="button"
												onClick={() => setSelectedCampus(campus)}
												className={cn(
													"flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted",
													isSelected && "bg-vm-tangerine/5"
												)}
											>
												<MapPinIcon className={cn(
													"h-4 w-4 shrink-0",
													isSelected ? "text-vm-tangerine" : "text-muted-foreground"
												)} />
												<div className="min-w-0 flex-1">
													<p className={cn(
														"truncate text-sm font-medium",
														isSelected ? "text-vm-tangerine" : "text-foreground"
													)}>
														{campus.name}
													</p>
													{campus.short_name && (
														<p className="text-[11px] text-muted-foreground">{campus.short_name}</p>
													)}
												</div>
												{isSelected && (
													<CheckIcon className="h-4 w-4 shrink-0 text-vm-tangerine" />
												)}
											</button>
										</li>
									)
								})}
							</ul>
						)
					)}
				</div>

				{/* Footer */}
				<div className="border-t border-foreground/8 px-5 py-4 shrink-0">
					{step === "campus" && (
						<Button
							className="w-full vm-button"
							disabled={!selectedCampus}
							onClick={handleSave}
						>
							Continue
						</Button>
					)}
					<button
						type="button"
						onClick={closePicker}
						className="mt-2 w-full py-1.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						Skip for now
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
