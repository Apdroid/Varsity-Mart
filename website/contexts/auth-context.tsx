"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { queryKeys } from "@/lib/api/query-keys";
import { authService } from "@/lib/api/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types/api";
import type { User } from "@/types/models";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (data: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (data: Partial<User>) => void;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const queryClient = useQueryClient();
	const router = useRouter();

	// Check authentication status on mount
	useEffect(() => {
		const run = async () => {
			try {
				console.log("🔐 Checking authentication status...");
				const response = await authService.getMe();
				console.log("✅ User authenticated:", response.data);
				setUser(response.data);
				setIsAuthenticated(true);
			} catch {
				console.log("❌ User not authenticated");
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		run();
	}, []);

	const login = async (data: LoginRequest) => {
		try {
			console.log("🔑 Logging in...");
			const response = await authService.login(data);
			console.log("✅ Login successful:", response.data);

			const userData = response.data.user;
			setUser(userData);
			setIsAuthenticated(true);

			// Update React Query cache
			queryClient.setQueryData(queryKeys.auth.user(), userData);

			// Navigate to home
			router.push("/");
		} catch (error) {
			console.error("❌ Login failed:", error);
			throw error;
		}
	};

	const register = async (data: RegisterRequest) => {
		try {
			console.log("📝 Registering...");
			const response = await authService.register(data);
			console.log("✅ Registration successful:", response.data);

			const userData = response.data.user;
			setUser(userData);
			setIsAuthenticated(true);

			// Update React Query cache
			queryClient.setQueryData(queryKeys.auth.user(), userData);

			// Navigate to verify email
			router.push("/verify-email");
		} catch (error) {
			console.error("❌ Registration failed:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			console.log("🚪 Logging out...");
			await authService.logout();
		} catch (error) {
			console.error("❌ Logout API failed:", error);
		} finally {
			// Clear state regardless of API success
			setUser(null);
			setIsAuthenticated(false);
			queryClient.clear();
			router.push("/auth/login");
		}
	};

	const updateProfile = (data: Partial<User>) => {
		if (user) {
			const updatedUser = { ...user, ...data };
			setUser(updatedUser);
			queryClient.setQueryData(queryKeys.auth.user(), updatedUser);
		}
	};

	const refetchUser = async () => {
		try {
			console.log("🔄 Refetching user...");
			const response = await authService.getMe();
			console.log("✅ User refetched:", response.data);
			setUser(response.data);
			setIsAuthenticated(true);
		} catch (error) {
			console.log("❌ Failed to refetch user");
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
		updateProfile,
		refetchUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
