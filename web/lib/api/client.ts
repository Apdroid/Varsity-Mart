const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.varsitymart.org/v1"

export class ApiError extends Error {
  constructor(
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

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    const data = await parseResponse(response).catch(() => undefined)
    throw new ApiError(response.status, response.statusText, data)
  }

  return parseResponse<T>(response)
}

export async function apiClientFormData<T>(
  endpoint: string,
  formData: FormData,
  options: Omit<RequestInit, "body" | "headers"> = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    method: options.method || "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    const data = await parseResponse(response).catch(() => undefined)
    throw new ApiError(response.status, response.statusText, data)
  }

  return parseResponse<T>(response)
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
