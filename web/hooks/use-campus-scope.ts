"use client"

import { useCampus } from "@/providers/campus-provider"

export { scopeFilters, withScopeLoading } from "@/lib/campus-scope"

/**
 * The campus that listing requests should be scoped to.
 *
 * `campus` is undefined until a campus is known (guest hasn't picked one yet).
 * `ready` is false until auth + the guest's stored selection have resolved;
 * scoped queries wait for it so they never fire unscoped and then refetch.
 * Because the campus is part of each query key, switching campus or signing
 * in as a user from another campus can never serve the old campus's cache.
 */
export function useCampusScope() {
	const { campusId, isReady } = useCampus()
	return { campus: campusId ?? undefined, ready: isReady }
}
