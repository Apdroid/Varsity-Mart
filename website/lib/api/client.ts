import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.varsitymart.com/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
// No client-side token injection for httpOnly cookie flows.
// Cookies will be sent automatically by the browser when `withCredentials: true`.

// Response interceptor for error handling
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
				const response = await axios.post(`${API_BASE_URL}/auth/refresh`, undefined, { withCredentials: true });

				// After a successful refresh the server should set new httpOnly cookies.
				// Retry the original request; cookies will be sent automatically.
				return apiClient(originalRequest);
			} catch (refreshError) {
				// Refresh failed: redirect to login
				if (typeof window !== "undefined") {
					window.location.href = "/login";
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

export interface ApiError {
	success: false;
	message: string;
	errors?: Record<string, string[]>;
}

export default apiClient;
