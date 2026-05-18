type UserLocationValue =
	| string
	| {
			id?: string
			name?: string
			short_name?: string
	  }
	| null
	| undefined

export function getUserLocationValue(value: UserLocationValue): string {
	if (typeof value === "string") {
		return value
	}

	return value?.name ?? value?.short_name ?? value?.id ?? ""
}
