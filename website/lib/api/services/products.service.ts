import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type {
	ProductFilters,
	CreateProductRequest,
	UpdateProductRequest,
	ProductsApiResponse,
	SingleProductApiResponse,
	ApiProduct,
} from "@/types/api"

export const productsService = {
	async getProducts(filters: ProductFilters = {}): Promise<ProductsApiResponse> {
		const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, { params: filters })
		return response.data
	},

	async getProductById(id: string): Promise<SingleProductApiResponse> {
		const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id))
		return response.data
	},

	async createProduct(data: CreateProductRequest): Promise<ApiResponse<ApiProduct>> {
		const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, data)
		return response.data
	},

	async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<ApiProduct>> {
		const response = await apiClient.patch(ENDPOINTS.PRODUCTS.UPDATE(id), data)
		return response.data
	},

	async deleteProduct(id: string): Promise<ApiResponse<null>> {
		const response = await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id))
		return response.data
	},

	async likeProduct(id: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
		const response = await apiClient.post(ENDPOINTS.PRODUCTS.LIKE(id))
		return response.data
	},

	async getCategories(): Promise<ApiResponse<Array<{ id: string; name: string; icon: string }>>> {
		const response = await apiClient.get(ENDPOINTS.PRODUCTS.CATEGORIES)
		return response.data
	},

	async getMyProducts(filters: ProductFilters = {}): Promise<ProductsApiResponse> {
		const response = await apiClient.get(ENDPOINTS.PRODUCTS.MY_PRODUCTS, { params: filters })
		return response.data
	},

	async searchProducts(query: string, filters: ProductFilters = {}): Promise<ProductsApiResponse> {
		const response = await apiClient.get(ENDPOINTS.PRODUCTS.SEARCH, {
			params: { q: query, ...filters },
		})
		return response.data
	},
}
