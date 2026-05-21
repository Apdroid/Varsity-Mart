import { api } from "./client"
import type {
	ApiResponse,
	AddPaymentMethodRequest,
	UpdatePaymentMethodRequest,
	Bank,
	EscrowBalance,
	PaymentMethod,
	PayoutRequest,
	VerifyPaymentResponse,
} from "./types"


export const paymentsApi = {
	methods: {
		list: () =>
			api.get<ApiResponse<{ methods: PaymentMethod[] }>>("/payments/methods/"),

		add: (data: AddPaymentMethodRequest) =>
			api.post<ApiResponse<PaymentMethod>>("/payments/methods/", { ...data, type: "momo" }),

		remove: (methodId: string) =>
			api.delete<ApiResponse<null>>(`/payments/methods/${methodId}/`),

		setDefault: (methodId: string) =>
			api.patch<ApiResponse<PaymentMethod>>(`/payments/methods/${methodId}/`, { is_default: true }),

		update: (methodId: string, data: UpdatePaymentMethodRequest) =>
			api.patch<ApiResponse<PaymentMethod>>(`/payments/methods/${methodId}/`, data),
	},

	verify: (reference: string) =>
		api.get<ApiResponse<VerifyPaymentResponse>>(`/payments/${reference}/verify/`),

	escrowBalance: () =>
		api.get<ApiResponse<EscrowBalance>>("/payments/escrow/balance/"),

	banks: () =>
		api.get<ApiResponse<Bank[]>>("/payments/banks/"),

	requestPayout: (data: PayoutRequest) =>
		api.post<ApiResponse<{ message: string }>>("/payments/payout/", data),
}
