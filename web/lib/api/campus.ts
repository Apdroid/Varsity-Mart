import { api } from "./client"
import type { DRFPaginatedList, University, Campus } from "./types"

export const campusApi = {
	universities: (page = 1) =>
		api.get<DRFPaginatedList<University>>(`/universities/?page=${page}`),

	university: (id: string) =>
		api.get<University>(`/universities/${id}/`),

	campuses: () =>
		api.get<DRFPaginatedList<Campus>>("/campuses/"),

	campusesByUniversity: (universityId: string) =>
		api.get<DRFPaginatedList<Campus>>(`/universities/${universityId}/campuses/`),
}
