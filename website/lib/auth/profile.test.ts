import { describe, expect, it } from "vitest"
import { getMissingProfileFields, needsProfileCompletion } from "./profile"

const complete = {
	phone: "+233201234567",
	university: { id: "u1", name: "University of Ghana" },
	campus: { id: "c1", name: "Legon", university: { id: "u1", name: "University of Ghana" } },
}

describe("getMissingProfileFields", () => {
	it("returns nothing for a complete profile", () => {
		expect(getMissingProfileFields(complete)).toEqual([])
	})

	it("returns nothing when there is no user", () => {
		expect(getMissingProfileFields(null)).toEqual([])
		expect(needsProfileCompletion(undefined)).toBe(false)
	})

	it("reports a missing phone", () => {
		expect(getMissingProfileFields({ ...complete, phone: "  " })).toEqual(["phone"])
	})

	it("reports a missing campus", () => {
		expect(getMissingProfileFields({ ...complete, campus: null })).toContain("campus")
	})

	it("takes the institution from the campus when user.university is empty", () => {
		// Regression: a user with a campus but an empty top-level university used to
		// be redirected to /complete-profile forever, since the form only asks for campus.
		const user = { ...complete, university: { id: "", name: "" } }
		expect(getMissingProfileFields(user)).toEqual([])
		expect(needsProfileCompletion(user)).toBe(false)
	})

	it("still reports the institution when neither source has one", () => {
		const user = { phone: complete.phone, university: null, campus: { id: "c1", name: "Legon" } }
		expect(getMissingProfileFields(user)).toEqual(["institution"])
	})

	it("treats Google sign-ups with empty strings as incomplete", () => {
		const user = { phone: "", university: "", campus: "" } as never
		expect(getMissingProfileFields(user)).toEqual(["phone", "institution", "campus"])
	})
})
