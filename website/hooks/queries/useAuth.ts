"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { queryKeys } from "@/lib/api/query-keys"
import { authService } from "@/lib/api/services/auth.service"
import type { LoginRequest, RegisterRequest } from "@/types/api"
import type { GetMe, User } from "@/types/models"

// Single source of truth for auth state — React Query cache only
export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: userData,
    isLoading,
    isFetched,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const response = await authService.getMe()
      return response
    },
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

	console.log("UserData is ", userData)
  const isAuthenticated = userData?.data.isAuthenticated ;

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const userData = response.data.user
      queryClient.setQueryData(queryKeys.auth.user(), userData)
      router.push("/")
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const userData = response.data.user
      queryClient.setQueryData(queryKeys.auth.user(), userData)
      router.push("/verify-email")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Clear persisted cache + React Query cache
      queryClient.clear()
      router.push("/auth/login")
    },
  })

  const updateProfile = (data: Partial<User>) => {
    queryClient.setQueryData<User | undefined>(queryKeys.auth.user(), (old) => {
      const updated = old ? { ...old, ...data } : old
      return updated
    })
  }

  return {
    user: userData ?? null,
    isAuthenticated,
    isLoading: !isFetched && !userData,
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
    updateProfile,
    refetchUser,
  }
}
