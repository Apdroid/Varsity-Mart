const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "https://api.varsitymart.org/v1"

export class ApiError extends Error { constructor(
		public status: number,
		public statusText: string,
		public data?: unknown
	) {
		super(`${status} ${statusText}`)
		this.name = "ApiError"
	}
}

type RequestOptions = Omit<RequestInit, "body"> & {
	body?: unknown
}

async function parseResponse<T>(response: Response): Promise<T> {
	const contentType = response.headers.get("content-type")
	if (contentType?.includes("application/json")) {
		return response.json()
	}
	return response.text() as unknown as T
}

// Deduplicate concurrent refresh calls — all waiters share the same promise.
let refreshPromise: Promise<void> | null = null

async function refreshToken(): Promise<void> {
	const url = `${API_BASE_URL}/auth/refresh-token/`
	const response = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
	})
	if (!response.ok) throw new ApiError(response.status, response.statusText)
}

// Internal executor — handles the 401 → refresh → retry flow.
async function executeRequest<T>(
	endpoint: string,
	config: RequestInit,
	isRetry: boolean
): Promise<T> {
	const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
	const response = await fetch(url, config)

	if (response.status === 401 && !isRetry) {
		if (!refreshPromise) {
			refreshPromise = refreshToken().finally(() => { refreshPromise = null })
		}
		try {
			await refreshPromise
			return executeRequest<T>(endpoint, config, true)
		} catch {
			throw new ApiError(401, "Unauthorized")
		}
	}

	if (!response.ok) {
		const data = await parseResponse(response).catch(() => undefined)
		throw new ApiError(response.status, response.statusText, data)
	}

	return parseResponse<T>(response)
}

export async function apiClient<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const { body, headers, ...rest } = options

	const config: RequestInit = {
		...rest,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	}

	if (body !== undefined) {
		config.body = JSON.stringify(body)
	}

	return executeRequest<T>(endpoint, config, false)
}

export async function apiClientFormData<T>(
	endpoint: string,
	formData: FormData,
	options: Omit<RequestInit, "body" | "headers"> = {}
): Promise<T> {
	const config: RequestInit = {
		...options,
		method: options.method || "POST",
		credentials: "include",
		body: formData,
	}

	return executeRequest<T>(endpoint, config, false)
}

export const api = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		apiClient<T>(endpoint, { ...options, method: "GET" }),

	post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiClient<T>(endpoint, { ...options, method: "POST", body }),

	put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiClient<T>(endpoint, { ...options, method: "PUT", body }),

	patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiClient<T>(endpoint, { ...options, method: "PATCH", body }),

	delete: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiClient<T>(endpoint, { ...options, method: "DELETE", body }),
}
