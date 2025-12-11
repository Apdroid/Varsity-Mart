import axios, { type AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
	baseURL: "https://api.example.com",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error);
		return Promise.reject(error);
	},
);
export default apiClient;
