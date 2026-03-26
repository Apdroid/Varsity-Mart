"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { queryKeys } from "@/lib/api/query-keys"
import { authService } from "@/lib/api/services/auth.service"
import { userService } from "@/lib/api/services/user.service"
import type { LoginRequest, RegisterRequest } from "@/types/api"
import type { User } from "@/types/models"

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Single source of truth: check session first, then fetch full profile if authenticated.
  // Login/register bypass this by writing the full User directly into cache.
  const {
    data: user = null,
    isFetched,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const status = await authService.getMe()
      if (!status.data.isAuthenticated) return null
      const profile = await userService.getProfile()
      return profile.data
    },
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const isAuthenticated = !!user

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData<User | null>(queryKeys.user.profile(), response.data.user)
      router.push("/")
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      queryClient.setQueryData<User | null>(queryKeys.user.profile(), response.data.user)
      router.push("/auth/verify-email")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear()
      router.push("/auth/login")
    },
  })

  const updateProfile = (data: Partial<User>) => {
    queryClient.setQueryData<User | null>(queryKeys.user.profile(), (old) =>
      old ? { ...old, ...data } : null,
    )
  }

  return {
    user,
    isAuthenticated,
    isLoading: !isFetched,
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
