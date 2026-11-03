/**
 * Build a `?a=1&b=2` query string from an object, skipping undefined, null and
 * empty-string values. Returns "" when nothing is left.
 */
export function buildQueryString(params: object): string {
	const searchParams = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value))
		}
	})
	const query = searchParams.toString()
	return query ? `?${query}` : ""
}
