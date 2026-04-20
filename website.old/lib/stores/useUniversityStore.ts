import { useUniversityStore } from "./university-store";
import useStore from "./useStore";

// Next.js safe hooks for university store
export const useSelectedUniversity = () =>
	useStore(useUniversityStore, (state) => state.selectedUniversity);
export const useSelectedCampus = () =>
	useStore(useUniversityStore, (state) => state.selectedCampus);

// Actions can be used directly since they're stable functions
export const useUniversityActions = () => useUniversityStore.getState();
