"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { queryKeys } from "@/lib/api/query-keys"
import { authService } from "@/lib/api/services/auth.service"
import type { LoginRequest, RegisterRequest } from "@/types/api"
import type { ApiGetMeResponse } from "@/lib/api/client"
import type { User } from "@/types/models"

// Single source of truth for auth state — React Query cache only
export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: meData,
    isFetched,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getMe(),
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const isAuthenticated = meData?.data.isAuthenticated ?? false
  const user = meData?.data.user ?? null

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async () => {
      await refetchUser()
      router.push("/")
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async () => {
      await refetchUser()
      router.push("/verify-email")
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
    queryClient.setQueryData<ApiGetMeResponse | undefined>(
      queryKeys.auth.user(),
      (old) => {
        if (!old) return old
        return {
          ...old,
          data: { ...old.data, user: { ...old.data.user, ...data } },
        }
      },
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
