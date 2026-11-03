import { describe, expect, it } from "vitest"
import { scopeFilters, withScopeLoading } from "./campus-scope"

type Filters = { page?: number; campus?: string; sellerId?: string; storeId?: string }
const scope = (f: Filters | undefined, campus: string | undefined) => scopeFilters<Filters>(f, campus)

describe("scopeFilters", () => {
	it("adds the campus to a listing filter", () => {
		expect(scope({ page: 1 }, "campus-1")).toEqual({ page: 1, campus: "campus-1" })
	})

	it("works when no filters are given", () => {
		expect(scope(undefined, "campus-1")).toEqual({ campus: "campus-1" })
	})

	it("leaves filters alone when no campus is known", () => {
		const filters = { page: 1 }
		expect(scope(filters, undefined)).toBe(filters)
	})

	it("does not override an explicit campus", () => {
		expect(scope({ campus: "explicit" }, "campus-1")).toEqual({ campus: "explicit" })
	})

	it("does not scope seller or store specific listings", () => {
		expect(scope({ sellerId: "s1" }, "campus-1")).toEqual({ sellerId: "s1" })
		expect(scope({ storeId: "st1" }, "campus-1")).toEqual({ storeId: "st1" })
	})
})

describe("withScopeLoading", () => {
	it("reports loading while the campus is unresolved and there is no data", () => {
		expect(withScopeLoading({ data: undefined, isLoading: false }, false).isLoading).toBe(true)
	})

	it("keeps real data visible while the campus resolves", () => {
		const query = { data: [1], isLoading: false }
		expect(withScopeLoading(query, false)).toBe(query)
	})

	it("passes the query through once the campus is ready", () => {
		const query = { data: undefined, isLoading: false }
		expect(withScopeLoading(query, true)).toBe(query)
	})
})
