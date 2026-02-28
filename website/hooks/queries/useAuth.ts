"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { queryKeys } from "@/lib/api/query-keys"
import { authService } from "@/lib/api/services/auth.service"
import type { LoginRequest, RegisterRequest } from "@/types/api"
import type { User } from "@/types/models"

/**
 * Read cached user from localStorage (written by Zustand persist or our own cache).
 * Returns the user object immediately so components don't flash unauthenticated on reload.
 */
function getCachedUser(): User | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = localStorage.getItem("auth-storage")
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    // Zustand persist stores under { state: { user, isAuthenticated }, version: 0 }
    const user = parsed?.state?.user ?? parsed?.user
    return user ?? undefined
  } catch {
    return undefined
  }
}

/** Write user to the same localStorage key so it survives reload. */
function setCachedUser(user: User | null) {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({ state: { user, isAuthenticated: true }, version: 0 })
      )
    } else {
      localStorage.removeItem("auth-storage")
    }
  } catch {
    // Storage full or unavailable — non-critical
  }
}

// Single source of truth for auth state — React Query cache only
export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isFetched,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const response = await authService.getMe()
      // check-status returns { isAuthenticated, tokens, user } — extract user
      const userData = (response as any).user ?? response.data ?? response
      // Persist to localStorage for instant hydration on next reload
      setCachedUser(userData)
      return userData as User
    },
    // Show cached user instantly while server check runs in background
    placeholderData: getCachedUser,
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const isAuthenticated = !!user

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const userData = response.data.user
      setCachedUser(userData)
      queryClient.setQueryData(queryKeys.auth.user(), userData)
      router.push("/")
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const userData = response.data.user
      setCachedUser(userData)
      queryClient.setQueryData(queryKeys.auth.user(), userData)
      router.push("/verify-email")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Clear persisted cache + React Query cache
      setCachedUser(null)
      queryClient.clear()
      router.push("/auth/login")
    },
  })

  const updateProfile = (data: Partial<User>) => {
    queryClient.setQueryData<User | undefined>(queryKeys.auth.user(), (old) => {
      const updated = old ? { ...old, ...data } : old
      if (updated) setCachedUser(updated)
      return updated
    })
  }

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading: !isFetched && !user,
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
