"use client"

import { useEffect, useState } from "react"

/**
 * An object URL for a File, revoked when the file changes or the component unmounts.
 * Creating and revoking the URL is a side effect on an external resource, so it
 * has to live in an effect.
 */
export function useObjectUrl(file: File | null | undefined) {
	const [url, setUrl] = useState<string | null>(null)

	useEffect(() => {
		if (!file) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setUrl(null)
			return
		}
		const objectUrl = URL.createObjectURL(file)
		setUrl(objectUrl)
		return () => URL.revokeObjectURL(objectUrl)
	}, [file])

	return url
}
