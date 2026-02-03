"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { queryKeys } from "@/lib/api/query-keys";
import { authService } from "@/lib/api/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types/api";

export function useAuth() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {
		user,
		isAuthenticated,
		setIsAuthenticated,
		setUser,
		logout: clearAuth,
		setLoading,
	} = useAuthStore();

	// Get current user - this should run on mount to check if user is already logged in
	const { isLoading: isCheckingAuth, isFetched: isAuthFetched, refetch: refetchUser } = useQuery({
		queryKey: queryKeys.auth.user(),
		queryFn: async () => {
			try {
				console.log("🔐 Fetching user from /auth/check-status/...");
				const response = await authService.getMe();
				console.log("✅ Auth check response:", response);
				console.log("👤 User data:", response.data);
				setUser(response.data);
				return response.data;
			} catch (error) {
				console.error("❌ Auth check failed:", error);
				// If getMe fails, user is not authenticated
				clearAuth();
				throw error;
			}
		},
		enabled: typeof window !== "undefined",
		retry: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	// Initialize auth state on mount
	useEffect(() => {
		if (isAuthFetched) {
			setIsAuthenticated(!!user);
			setLoading(false);
		}
	}, [isAuthFetched, user, setIsAuthenticated, setLoading]);

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: (data: LoginRequest) => authService.login(data),
		onSuccess: async (response) => {
			const userData = response.data.user;
			// Update Zustand store immediately
			setUser(userData);
			setIsAuthenticated(true);
			
			// Update React Query cache
			queryClient.setQueryData(queryKeys.auth.user(), userData);

			// Refetch to ensure we have the latest data
		await refetchUser();
			router.push("/");
		},
		onError: (error) => {
			console.error("Login failed:", error);
		},
	});

	// Register mutation
	const registerMutation = useMutation({
		mutationFn: (data: RegisterRequest) => authService.register(data),
		onSuccess: async (response) => {
			const userData = response.data.user;
			setUser(userData);
			setIsAuthenticated(true);
			
			// Update the query cache for the user
			queryClient.setQueryData(queryKeys.auth.user(), userData);
			
			router.push("/verify-email");
		},
	});

	// Logout mutation
	const logoutMutation = useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			clearAuth();
			queryClient.clear();
			router.push("/auth/login");
		},
		onError: () => {
			// Still clear local state even if API call fails
			clearAuth();
			queryClient.clear();
			router.push("/auth/login");
		},
	});

	return {
		user,
		isAuthenticated,
		isLoading: !isAuthFetched,
		setIsAuthenticated,
		login: loginMutation.mutate,
		loginAsync: loginMutation.mutateAsync,
		isLoggingIn: loginMutation.isPending,
		loginError: loginMutation.error,
		register: registerMutation.mutate,
		registerAsync: registerMutation.mutateAsync,
		isRegistering: registerMutation.isPending,
		registerError: registerMutation.error,
		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
		refetchUser,
	};
}
