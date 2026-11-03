"use client"

import { useCampus } from "@/providers/campus-provider"

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

/**
 * Adds the campus to listing filters. Seller/store-specific listings are left
 * alone: they're about one seller's or store's items, not a campus feed.
 */
export function scopeFilters<T extends { campus?: string; sellerId?: string; storeId?: string }>(
	filters: T | undefined,
	campus: string | undefined
): T {
	const base = (filters ?? {}) as T
	if (!campus || base.campus || base.sellerId || base.storeId) return base
	return { ...base, campus }
}

/** While the campus is still resolving, report "loading" instead of an empty result. */
export function withScopeLoading<T extends { data: unknown; isLoading: boolean }>(query: T, ready: boolean): T {
	return !ready && query.data === undefined ? { ...query, isLoading: true } : query
}
