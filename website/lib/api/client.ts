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
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
	(config) => {
		// Get token from localStorage (client-side only)
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("accessToken");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

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
				const refreshToken = localStorage.getItem("refreshToken");
				if (refreshToken) {
					const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
						refreshToken,
					});

					const { accessToken, refreshToken: newRefreshToken } = response.data.data;
					localStorage.setItem("accessToken", accessToken);
					localStorage.setItem("refreshToken", newRefreshToken);

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}

					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				// Clear tokens and redirect to login
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
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
