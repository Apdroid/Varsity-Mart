"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
	} = useAuthStore();

	// Get current user
	const { isLoading, refetch: refetchUser } = useQuery({
		queryKey: queryKeys.auth.user(),
		queryFn: async () => {
			const response = await authService.getMe();
			setUser(response.data);
			return response.data;
		},
		enabled: typeof window !== "undefined",
		retry: false,
	});

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: (data: LoginRequest) => authService.login(data),
		onSuccess: (response) => {
			console.log(response);
			setUser(response.data.user);
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
			router.push("/");
		},
	});

	// Register mutation
	const registerMutation = useMutation({
		mutationFn: (data: RegisterRequest) => authService.register(data),
		onSuccess: (response) => {
			setUser(response.data.user);
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
		isLoading,
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
