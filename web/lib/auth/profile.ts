import { getUserLocationValue } from "@/lib/user-location"
import type { User } from "@/lib/api/types"

export type MissingProfileField = "phone" | "institution" | "campus"

type ProfileUser = Pick<User, "phone"> & {
	university?: unknown
	campus?: { name?: string; short_name?: string; id?: string; university?: unknown } | null
}

/**
 * Which required profile fields are still empty.
 *
 * The institution may come back on `user.university` or only nested inside
 * `user.campus.university`; either counts. Otherwise a user who has a campus
 * could be sent to /complete-profile forever, because the form only asks for
 * a campus and never for the institution on its own.
 */
export function getMissingProfileFields(user: ProfileUser | null | undefined): MissingProfileField[] {
	if (!user) return []
	const missing: MissingProfileField[] = []
	if (!user.phone?.trim()) missing.push("phone")
	const institution =
		getUserLocationValue(user.university as Parameters<typeof getUserLocationValue>[0]) ||
		getUserLocationValue(user.campus?.university as Parameters<typeof getUserLocationValue>[0])
	if (!institution.trim()) missing.push("institution")
	if (!getUserLocationValue(user.campus).trim()) missing.push("campus")
	return missing
}

/** True when a signed-in user still has to complete their profile. */
export function needsProfileCompletion(user: ProfileUser | null | undefined): boolean {
	return getMissingProfileFields(user).length > 0
}
