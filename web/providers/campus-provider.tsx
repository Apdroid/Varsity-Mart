"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react"
import { useAuth } from "@/providers/auth-provider"

const STORAGE_KEY = "vm-campus-selection"

export interface GuestCampusSelection {
	universityId: string
	universityName: string
	campusId: string
	campusName: string
}

interface CampusContextValue {
	universityId: string | null
	universityName: string | null
	campusId: string | null
	campusName: string | null
	/** True when the values come from the signed-in user's profile */
	isFromProfile: boolean
	showPicker: boolean
	openPicker: () => void
	closePicker: () => void
	saveGuestSelection: (selection: GuestCampusSelection) => void
}

const CampusContext = createContext<CampusContextValue | null>(null)

export function CampusProvider({ children }: { children: ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth()
	const [guestSelection, setGuestSelection] = useState<GuestCampusSelection | null>(null)
	const [showPicker, setShowPicker] = useState(false)
	const [hydrated, setHydrated] = useState(false)

	// Hydrate from localStorage once on mount
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) setGuestSelection(JSON.parse(raw) as GuestCampusSelection)
		} catch {}
		setHydrated(true)
	}, [])

	// Prompt guests who haven't chosen a campus yet
	useEffect(() => {
		if (!hydrated || isLoading) return
		if (!isAuthenticated && !guestSelection) {
			setShowPicker(true)
		}
	}, [hydrated, isLoading, isAuthenticated, guestSelection])

	const saveGuestSelection = useCallback((selection: GuestCampusSelection) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
		setGuestSelection(selection)
		setShowPicker(false)
	}, [])

	const openPicker = useCallback(() => setShowPicker(true), [])
	const closePicker = useCallback(() => setShowPicker(false), [])

	const isFromProfile = isAuthenticated && !!user

	const value: CampusContextValue = {
		universityId: isFromProfile
			? (user!.university?.id ?? null)
			: (guestSelection?.universityId ?? null),
		universityName: isFromProfile
			? (user!.university?.name ?? null)
			: (guestSelection?.universityName ?? null),
		campusId: isFromProfile
			? (user!.campus?.id ?? null)
			: (guestSelection?.campusId ?? null),
		campusName: isFromProfile
			? (user!.campus?.name ?? null)
			: (guestSelection?.campusName ?? null),
		isFromProfile,
		showPicker,
		openPicker,
		closePicker,
		saveGuestSelection,
	}

	return (
		<CampusContext.Provider value={value}>
			{children}
		</CampusContext.Provider>
	)
}

export function useCampus() {
	const ctx = useContext(CampusContext)
	if (!ctx) throw new Error("useCampus must be used within CampusProvider")
	return ctx
}
