"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/models";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	setUser: (user: User) => void;
}

// Mock users for fake auth
const MOCK_USERS: Record<string, User> = {
	"buyer@campus.edu": {
		id: "buyer-1",
		email: "buyer@campus.edu",
		firstName: "Sarah",
		lastName: "Asante",
		avatar: "/female-student-portrait.png",
		role: "buyer",
		isEmailVerified: true,
		isPhoneVerified: true,
		kycStatus: "approved",
		createdAt: "2023-06-15",
		updatedAt: "2024-01-01",
	},
	"seller@campus.edu": {
		id: "seller-1",
		email: "seller@campus.edu",
		firstName: "John",
		lastName: "Mensah",
		avatar: "/male-student-portrait.png",
		role: "seller",
		isEmailVerified: true,
		isPhoneVerified: true,
		kycStatus: "approved",
		createdAt: "2023-01-15",
		updatedAt: "2024-01-01",
	},
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: true,
			login: async (email: string, _password: string) => {
				// Fake auth - just look up user by email
				const user = MOCK_USERS[email];
				if (user) {
					set({ user, isAuthenticated: true });
				} else {
					throw new Error("Invalid credentials");
				}
			},
			logout: () => {
				set({ user: null, isAuthenticated: false });
			},
			setUser: (user: User) => {
				set({ user, isAuthenticated: true });
			},
		}),
		{
			name: "auth-storage",
		},
	),
);
