import { api } from "./client"
import type {
	ApiResponse,
	AuthStatus,
	BecomeSellerStatus,
	ForgotPasswordRequest,
	GoogleLoginRequest,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	ResetPasswordRequest,
	SellerStatus,
	User,
	VerifyEmailRequest,
} from "./types"
import { apiClientFormData } from "./client"

export const authApi = {
	login: (data: LoginRequest) =>
		api.post<LoginResponse>("/auth/login/", data),

	register: (data: RegisterRequest) =>
		api.post<ApiResponse<{ user: User }>>("/auth/register/", data),

	logout: (logoutAll?: boolean) =>
		api.post<ApiResponse<null>>("/auth/logout/", { logout_all: logoutAll }),

	googleLogin: (data: GoogleLoginRequest) =>
		api.post<LoginResponse>("/auth/google/", data),

	getUserInfo: () =>
		api.get<ApiResponse<User>>("/users/me/"),

	checkStatus: () =>
		api.get<ApiResponse<AuthStatus>>("/auth/check-status/"),

	verifyEmail: (data: VerifyEmailRequest) =>
		api.post<ApiResponse<{ user: User }>>("/auth/verify-email/", data),

	resendVerification: (email?: string) =>
		api.post<ApiResponse<null>>("/auth/resend-verification/", { email }),

	forgotPassword: (data: ForgotPasswordRequest) =>
		api.post<ApiResponse<null>>("/auth/forgot-password/", data),

	resetPassword: (data: ResetPasswordRequest) =>
		api.post<ApiResponse<null>>("/auth/reset-password/", data),

	refreshToken: () =>
		api.post<ApiResponse<null>>("/auth/refresh-token/"),

	getSellerStatus: () =>
		api.get<ApiResponse<SellerStatus>>("/auth/seller-status/"),

	getKycStatus: () =>
		api.get<BecomeSellerStatus>("/auth/become-a-seller/"),

	becomeASeller: (data: FormData) =>
		apiClientFormData<ApiResponse<{ message: string }>>(
			"/auth/become-a-seller/",
			data,
			{ method: "POST" }
		),
}
