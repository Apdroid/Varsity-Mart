"use client"

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react"
import { authApi } from "@/lib/api/auth"
import type {
	LoginRequest,
	RegisterRequest,
	User,
	VerifyEmailRequest,
} from "@/lib/api/types"
import { ApiError } from "@/lib/api/client"

interface AuthContextValue {
	user: User | null
	isLoading: boolean
	isAuthenticated: boolean
	needsVerification: boolean
	needsProfileCompletion: boolean
	login: (data: LoginRequest) => Promise<{ success: boolean; error?: string }>
	register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>
	logout: () => Promise<void>
	googleLogin: (idToken: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean; profileComplete?: boolean; user?: User }>
	verifyEmail: (data: VerifyEmailRequest) => Promise<{ success: boolean; error?: string }>
	resendVerification: (email?: string) => Promise<{ success: boolean; error?: string }>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [needsVerification, setNeedsVerification] = useState(false)

	const needsProfileCompletion = useMemo(() => {
		if (!user) return false
		return !user.phone?.trim() || !user.university?.trim() || !user.campus?.trim()
	}, [user])

	const checkAuth = useCallback(async () => {
		try {
			const response = await authApi.checkStatus()
			if (response.success && response.data.isAuthenticated) {
				const userInfo = await authApi.getUserInfo()
				setUser(userInfo.data)
				setNeedsVerification(!userInfo.data.isVerified)
			} else {
				setUser(null)
			}
		} catch {
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	const login = useCallback(async (data: LoginRequest) => {
		try {
			const response = await authApi.login(data)
			if (response.success && response.data.user) {
				setUser(response.data.user)
				setNeedsVerification(!response.data.user.isVerified)
				return { success: true }
			}
			return { success: false, error: response.message || "Login failed" }
		} catch (err) {
			if (err instanceof ApiError) {
				const errorData = err.data as { message?: string; detail?: string; errors?: Record<string, string[]> }
				const message = errorData?.message || errorData?.detail || "Login failed"
				return { success: false, error: message }
			}
			return { success: false, error: "An unexpected error occurred" }
		}
	}, [])

	const register = useCallback(async (data: RegisterRequest) => {
		try {
			const response = await authApi.register(data)
			if (response.success && response.data.user) {
				setUser(response.data.user)
				setNeedsVerification(true)
				return { success: true }
			}
			return { success: false, error: response.message || "Registration failed" }
		} catch (err) {
			if (err instanceof ApiError) {
				const errorData = err.data as { message?: string; detail?: string; errors?: Record<string, string[]> }
				const message = errorData?.message || errorData?.detail || "Registration failed"
				return { success: false, error: message }
			}
			return { success: false, error: "An unexpected error occurred" }
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			await authApi.logout()
		} finally {
			setUser(null)
			setNeedsVerification(false)
		}
	}, [])

	const googleLogin = useCallback(async (idToken: string) => {
		try {
			const response = await authApi.googleLogin({ id_token: idToken })
			if (response.success && response.data.user) {
				setUser(response.data.user)
				setNeedsVerification(false)
				return {
					success: true,
					isNewUser: response.data.isNewUser,
					profileComplete: response.data.profileComplete,
					user: response.data.user,
				}
			}
			return { success: false, error: response.message || "Google login failed" }
		} catch (err) {
			if (err instanceof ApiError) {
				const errorData = err.data as { message?: string; detail?: string }
				const message = errorData?.message || errorData?.detail || "Google login failed"
				return { success: false, error: message }
			}
			return { success: false, error: "An unexpected error occurred" }
		}
	}, [])

	const verifyEmail = useCallback(async (data: VerifyEmailRequest) => {
		try {
			const response = await authApi.verifyEmail(data)
			if (response.success && response.data.user) {
				setUser(response.data.user)
				setNeedsVerification(false)
				return { success: true }
			}
			return { success: false, error: response.message || "Verification failed" }
		} catch (err) {
			if (err instanceof ApiError) {
				const errorData = err.data as { message?: string; detail?: string }
				const message = errorData?.message || errorData?.detail || "Verification failed"
				return { success: false, error: message }
			}
			return { success: false, error: "An unexpected error occurred" }
		}
	}, [])

	const resendVerification = useCallback(async (email?: string) => {
		try {
			const response = await authApi.resendVerification(email)
			if (response.success) {
				return { success: true }
			}
			return { success: false, error: response.message || "Failed to resend verification" }
		} catch (err) {
			if (err instanceof ApiError) {
				const errorData = err.data as { message?: string; detail?: string }
				const message = errorData?.message || errorData?.detail || "Failed to resend verification"
				return { success: false, error: message }
			}
			return { success: false, error: "An unexpected error occurred" }
		}
	}, [])

	const refreshUser = useCallback(async () => {
		await checkAuth()
	}, [checkAuth])

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isLoading,
			isAuthenticated: !!user,
			needsVerification,
			needsProfileCompletion,
			login,
			register,
			logout,
			googleLogin,
			verifyEmail,
			resendVerification,
			refreshUser,
		}),
		[user, isLoading, needsVerification, needsProfileCompletion, login, register, logout, googleLogin, verifyEmail, resendVerification, refreshUser]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
