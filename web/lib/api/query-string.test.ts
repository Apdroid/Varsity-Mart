import { describe, expect, it } from "vitest"
import { buildQueryString } from "./query-string"

describe("buildQueryString", () => {
	it("returns an empty string when there is nothing to send", () => {
		expect(buildQueryString({})).toBe("")
		expect(buildQueryString({ a: undefined, b: null, c: "" })).toBe("")
	})

	it("serialises values and skips empty ones", () => {
		expect(buildQueryString({ page: 2, q: "jollof rice", empty: "", missing: undefined })).toBe(
			"?page=2&q=jollof+rice"
		)
	})

	it("keeps falsy-but-meaningful values", () => {
		expect(buildQueryString({ page: 0, isOpen: false })).toBe("?page=0&isOpen=false")
	})
})
