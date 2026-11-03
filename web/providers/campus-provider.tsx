"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
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
	/** False until auth and the guest's stored selection have both resolved */
	isReady: boolean
	showPicker: boolean
	openPicker: () => void
	closePicker: () => void
	saveGuestSelection: (selection: GuestCampusSelection) => void
}

const CampusContext = createContext<CampusContextValue | null>(null)

export function CampusProvider({ children }: { children: ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth()
	const [guestSelection, setGuestSelection] = useState<GuestCampusSelection | null>(null)
	const [pickerOpen, setPickerOpen] = useState(false)
	// Set when the guest closes the picker without choosing, so the auto-prompt stays dismissed.
	const [promptDismissed, setPromptDismissed] = useState(false)
	const [hydrated, setHydrated] = useState(false)

	// Hydrate from localStorage once on mount. It has to happen after mount so the
	// server render and first client render match; this is a one-time read of an external store.
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			// eslint-disable-next-line react-hooks/set-state-in-effect
			if (raw) setGuestSelection(JSON.parse(raw) as GuestCampusSelection)
		} catch {}
		setHydrated(true)
	}, [])

	// Prompt guests who haven't chosen a campus yet (derived, so no effect is needed)
	const shouldPrompt = hydrated && !isLoading && !isAuthenticated && !guestSelection && !promptDismissed
	const showPicker = pickerOpen || shouldPrompt

	const saveGuestSelection = useCallback((selection: GuestCampusSelection) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
		setGuestSelection(selection)
		setPickerOpen(false)
	}, [])

	const openPicker = useCallback(() => {
		setPromptDismissed(false)
		setPickerOpen(true)
	}, [])
	const closePicker = useCallback(() => {
		setPickerOpen(false)
		setPromptDismissed(true)
	}, [])

	const isFromProfile = isAuthenticated && !!user
	const isReady = hydrated && !isLoading

	const value = useMemo<CampusContextValue>(
		() => ({
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
			isReady,
			showPicker,
			openPicker,
			closePicker,
			saveGuestSelection,
		}),
		[user, guestSelection, isFromProfile, isReady, showPicker, openPicker, closePicker, saveGuestSelection]
	)

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
