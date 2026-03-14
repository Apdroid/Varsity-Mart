import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios";
import { ENDPOINTS } from "./endpoints";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.varsitymart.org/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};
		// Handle 401 - Token expired
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				// Attempt silent refresh. Server should read refresh token from httpOnly cookie
				await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, undefined, { withCredentials: true });
				// After a successful refresh the server should set new httpOnly cookies.
				// Retry the original request; cookies will be sent automatically.
				return apiClient(originalRequest);
			} catch (refreshError) {
				// Refresh failed: redirect to login
				if (typeof window !== "undefined") {
					window.location.href = "/auth/login";
				}
			}
		}

		return Promise.reject(error);
	},
);

// Type-safe response wrapper
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	meta?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ApiGetMeResponse{
  success: boolean;
  data: {
    isAuthenticated: boolean;
    user?: {
      id: string;
      email: string;
      firstName: string;
      role: string;
      isVerified: boolean;
      avatar: string;
    };
    tokens?: {
      accessExpiresIn: number;
      willRefreshIn: number;
    };
  };
}

export interface ApiError {
	success: false;
	message: string;
	errors?: Record<string, string[]>;
}

export default apiClient;
