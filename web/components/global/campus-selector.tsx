"use client"

import { useCampus } from "@/providers/campus-provider"
import { useCampusesByUniversity, useUniversities } from "@/hooks/queries/use-campus"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MapPinIcon } from "@phosphor-icons/react"

export function CampusSelector() {
	const { universityId, campusId, universityName, campusName, saveGuestSelection, isFromProfile } = useCampus()
	const { data: universities = [] } = useUniversities()
	const { data: campuses = [] } = useCampusesByUniversity(universityId || "")

	const handleUniversityChange = (newUnivId: string) => {
		const selectedUniv = universities.find(u => u.id === newUnivId)
		if (selectedUniv && !isFromProfile) {
			saveGuestSelection({
				universityId: newUnivId,
				universityName: selectedUniv.name,
				campusId: "",
				campusName: "",
			})
		}
	}

	const handleCampusChange = (newCampusId: string) => {
		const selectedCampus = campuses.find(c => c.id === newCampusId)
		if (selectedCampus && universityName && universityId && !isFromProfile) {
			saveGuestSelection({
				universityId,
				universityName,
				campusId: newCampusId,
				campusName: selectedCampus.name,
			})
		}
	}

	return (
		<div className="flex items-center gap-1.5 text-xs sm:text-sm">
			<MapPinIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
			<Select value={universityId || ""} onValueChange={handleUniversityChange}>
				<SelectTrigger className="w-fit border-0 bg-transparent h-auto p-0 shadow-none hover:bg-muted rounded px-1.5 focus:ring-0 focus:ring-offset-0">
					<SelectValue placeholder="Select University" />
				</SelectTrigger>
				<SelectContent align="start" className="w-64">
					{universities.map((u) => (
						<SelectItem key={u.id} value={u.id}>
							{u.short_name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{universityId && campuses.length > 0 && (
				<>
					<span className="text-muted-foreground">/</span>
					<Select value={campusId || ""} onValueChange={handleCampusChange}>
						<SelectTrigger className="w-fit border-0 bg-transparent h-auto p-0 shadow-none hover:bg-muted rounded px-1.5 focus:ring-0 focus:ring-offset-0">
							<SelectValue placeholder="Select Campus" />
						</SelectTrigger>
						<SelectContent align="start" className="w-64">
							{campuses.map((c) => (
								<SelectItem key={c.id} value={c.id} className="">
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</>
			)}
		</div>
	)
}
