import { useAuthStore } from "./auth-store";
import useStore from "./useStore";

// Next.js safe hooks for auth store
export const useAuthUser = () => useStore(useAuthStore, (state) => state.user);
export const useIsAuthenticated = () =>
	useStore(useAuthStore, (state) => state.isAuthenticated);
export const useAuthLoading = () =>
	useStore(useAuthStore, (state) => state.isLoading);

// Actions - access them directly without wrapper since they're stable functions
export const useAuthActions = () => useAuthStore.getState();
