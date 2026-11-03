"use client"

import { useQuery } from "@tanstack/react-query"
import { campusApi } from "@/lib/api/campus"

// Universities and campuses are essentially static — cache for 24 hours.
const STALE = 24 * 60 * 60 * 1000

export const campusKeys = {
	universities: () => ["universities"] as const,
	campusesByUniversity: (universityId: string) =>
		["campuses", "by-university", universityId] as const,
}

export function useUniversities() {
	return useQuery({
		queryKey: campusKeys.universities(),
		queryFn: async () => {
			const first = await campusApi.universities(1)
			let results = first.results

			// Fetch remaining pages in parallel if the list spans multiple pages
			if (first.count > first.results.length && first.results.length > 0) {
				const totalPages = Math.ceil(first.count / first.results.length)
				const rest = await Promise.all(
					Array.from({ length: totalPages - 1 }, (_, i) =>
						campusApi.universities(i + 2)
					)
				)
				results = [...results, ...rest.flatMap((r) => r.results)]
			}

			return results
		},
		staleTime: STALE,
		gcTime: STALE,
	})
}

export function useCampusesByUniversity(universityId: string) {
	return useQuery({
		queryKey: campusKeys.campusesByUniversity(universityId),
		queryFn: async () => {
			return campusApi.campusesByUniversity(universityId)
		},
		enabled: !!universityId,
		staleTime: STALE,
		gcTime: STALE,
	})
}
