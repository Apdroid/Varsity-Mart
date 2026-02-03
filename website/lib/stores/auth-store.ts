import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/models";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Actions
	setUser: (user: User | null) => void;
	setIsAuthenticated: (auth: boolean) => void;
	setLoading: (loading: boolean) => void;
	logout: () => void;
	updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			isLoading: true,

			setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
setUser: (user) => {
console.log("🏪 Zustand Store - Setting user:", user);
set({
user,
isAuthenticated: !!user,
isLoading: false,
});
},

			setLoading: (isLoading) => set({ isLoading }),

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
				});
			},

			updateProfile: (data) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...data } : null,
				})),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
