import apiClient, { type ApiGetMeResponse, type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/api"
import type { User } from "@/types/models"

export const authService = {
	async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, data)
		return response.data
	},

	async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data)
		return response.data
	},

	async logout(): Promise<ApiResponse<null>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
		return response.data
	},

	// Google OAuth - initiates the OAuth flow
	getGoogleAuthUrl(): string {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http:///api.varsitymart.org/v1"
		return `${apiUrl}${ENDPOINTS.AUTH.GOOGLE}`
	},

	async googleCallback(code: string): Promise<ApiResponse<LoginResponse>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.GOOGLE_CALLBACK, { code })
		return response.data
	},

	async verifyEmail(code: string): Promise<ApiResponse<User>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { code })
		return response.data
	},

	async resendVerification(email: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
		return response.data
	},

	async forgotPassword(email: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
		return response.data
	},

	async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password })
		return response.data
	},

	async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
			currentPassword,
			newPassword,
		})
		return response.data
	},

	async getMe(): Promise<ApiGetMeResponse> {
		const response = await apiClient.get(ENDPOINTS.AUTH.CHECK_STATUS)
		return response.data
	},

	async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
		const response = await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, data)
		return response.data
	},
}
