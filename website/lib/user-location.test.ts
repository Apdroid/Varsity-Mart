import { describe, expect, it } from "vitest"
import { getUserLocationValue } from "./user-location"

describe("getUserLocationValue", () => {
	it("returns strings as they are", () => {
		expect(getUserLocationValue("Legon")).toBe("Legon")
	})

	it("prefers name, then short_name, then id", () => {
		expect(getUserLocationValue({ id: "1", name: "Legon", short_name: "LG" })).toBe("Legon")
		expect(getUserLocationValue({ id: "1", short_name: "LG" })).toBe("LG")
		expect(getUserLocationValue({ id: "1" })).toBe("1")
	})

	it("returns an empty string for missing values", () => {
		expect(getUserLocationValue(null)).toBe("")
		expect(getUserLocationValue(undefined)).toBe("")
		expect(getUserLocationValue({})).toBe("")
	})
})
