"use client"

import { useEffect, useState } from "react"
import { useCampus } from "@/providers/campus-provider"
import { useCampusesByUniversity, useUniversities } from "@/hooks/queries/use-campus"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { MapPinIcon, CaretDownIcon, ArrowRightIcon, ArrowLeftIcon } from "@phosphor-icons/react"

export function CampusSelector() {
	const { universityId, campusId, universityName, campusName, saveGuestSelection, isFromProfile } = useCampus()
	const { data: universities = [] } = useUniversities()
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [selectedUniversityId, setSelectedUniversityId] = useState(universityId || "")
	const { data: campuses = [] } = useCampusesByUniversity(selectedUniversityId || "")
	const selectedUniversity = universities.find(u => u.id === selectedUniversityId || u.id === universityId)
	const displayUniversityName = selectedUniversity?.short_name || universityName || "Select Institution"

	const normalizedQuery = query.trim().toLowerCase()
	const filteredUniversities = normalizedQuery
		? universities.filter(u =>
			[u.short_name, u.name].some(value =>
				value?.toLowerCase().includes(normalizedQuery),
			),
		)
		: universities
	const filteredCampuses = normalizedQuery
		? campuses.filter(c => c.name?.toLowerCase().includes(normalizedQuery))
		: campuses

	useEffect(() => {
		if (universityId) {
			setSelectedUniversityId(universityId)
		}
	}, [universityId])

	const handleUniversityChange = (newUnivId: string) => {
		setSelectedUniversityId(newUnivId)
	}

	const handleCampusChange = (newCampusId: string) => {
		const selectedCampus = campuses.find(c => c.id === newCampusId)
		const activeUniversity = universities.find(u => u.id === selectedUniversityId)
		if (selectedCampus && activeUniversity && !isFromProfile) {
			saveGuestSelection({
				universityId: activeUniversity.id,
				universityName: activeUniversity.name,
				campusId: newCampusId,
				campusName: selectedCampus.name,
			})
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Popover
				open={isOpen}
				onOpenChange={(nextOpen) => {
					setIsOpen(nextOpen)
					if (!nextOpen) {
						setQuery("")
					}
				}}
			>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 px-2.5 text-xs sm:text-sm gap-1.5 rounded-full bg-muted/40 hover:bg-muted"
					>
						<MapPinIcon className="h-4 w-4 shrink-0" weight="bold" />
						<span className="font-medium">{displayUniversityName}</span>
						<CaretDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-72 p-0">
					<div className="flex flex-col">
						<div className="px-3 pt-2">
							<input
								type="text"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder={selectedUniversityId ? "Search campuses" : "Search institutions"}
								aria-label={selectedUniversityId ? "Search campuses" : "Search institutions"}
								className="w-full rounded-md bg-muted px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
							/>
						</div>
						<div className="max-h-64 overflow-y-auto">
							{selectedUniversityId ? (
								<>
									<div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
										<button
											type="button"
											onClick={() => {
												setSelectedUniversityId("")
												setQuery("")
											}}
											className="rounded-full px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted"
										>
											<ArrowLeftIcon weight="bold" className="h-5 w-5" />
										</button>
										<span>Campuses</span>
									</div>
									{filteredCampuses.length > 0 ? (
										filteredCampuses.map((c) => (
											<button
												key={c.id}
												onClick={() => {
													handleCampusChange(c.id)
													setIsOpen(false)
												}}
												className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${campusId === c.id ? "bg-muted font-medium" : ""
													}`}
											>
												{c.name}
											</button>
										))
									) : (
										<div className="px-3 py-3 text-sm text-muted-foreground">No campuses found.</div>
									)}
								</>
							) : (
								<>
									<div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
										Institutions
									</div>
									{filteredUniversities.length > 0 ? (
										filteredUniversities.map((u) => (
											<button
												key={u.id}
												onClick={() => {
													handleUniversityChange(u.id)
													setQuery("")
												}}
												className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${selectedUniversityId === u.id ? "bg-muted font-medium" : ""
													}`}
											>
												{u.short_name}
											</button>
										))
									) : (
										<div className="px-3 py-3 text-sm text-muted-foreground">No institutions found.</div>
									)}
								</>
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
