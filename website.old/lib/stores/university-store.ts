import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UniversityState {
	selectedUniversity: string | null;
	selectedCampus: string | null;
	setUniversity: (university: string, campus?: string) => void;
	clearUniversity: () => void;
}

export const useUniversityStore = create<UniversityState>()(
	persist(
		(set) => ({
			selectedUniversity: null,
			selectedCampus: null,
			setUniversity: (university: string, campus?: string) =>
				set({ selectedUniversity: university, selectedCampus: campus || null }),
			clearUniversity: () => set({ selectedUniversity: null, selectedCampus: null }),
		}),
		{
			name: "university-storage",
		},
	),
);

