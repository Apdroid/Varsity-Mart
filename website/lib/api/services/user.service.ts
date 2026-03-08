import apiClient, { type ApiResponse } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { User } from "@/types/models";

export interface UserUpdate {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	university?: string;
	campus?: string;
	studentId?: string;
	avatar?: string;
	role?: "buyer" | "seller";
}

export interface AddressData {
	id?: string;
	type: "home" | "dorm" | "other";
	title: string;
	fullName: string;
	phone: string;
	address: string;
	city: string;
	region: string;
	landmarks?: string;
	isDefault: boolean;
}

export const userService = {
	async getProfile(): Promise<ApiResponse<User>> {
		const response = await apiClient.get(ENDPOINTS.USER.ME);
		return response.data;
	},

	async updateProfile(data: UserUpdate): Promise<ApiResponse<User>> {
		const response = await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, data);
		return response.data;
	},

	async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
		const formData = new FormData();
		formData.append("avatar", file);
		const response = await apiClient.post(ENDPOINTS.USER.UPLOAD_AVATAR, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	async getAddresses(): Promise<ApiResponse<AddressData[]>> {
		const response = await apiClient.get(ENDPOINTS.USER.ADDRESSES);
		return response.data;
	},

	async addAddress(address: Omit<AddressData, "id">): Promise<ApiResponse<AddressData>> {
		const response = await apiClient.post(ENDPOINTS.USER.ADDRESSES, address);
		return response.data;
	},

	async updateAddress(id: string, address: Partial<AddressData>): Promise<ApiResponse<AddressData>> {
		const response = await apiClient.patch(ENDPOINTS.USER.ADDRESS(id), address);
		return response.data;
	},

	async deleteAddress(id: string): Promise<ApiResponse<null>> {
		const response = await apiClient.delete(ENDPOINTS.USER.ADDRESS(id));
		return response.data;
	},
};
