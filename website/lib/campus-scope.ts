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
