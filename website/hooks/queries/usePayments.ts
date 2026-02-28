"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { paymentsService } from "@/lib/api/services/payments.service"
import type { InitiatePaymentRequest } from "@/types/api"

export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.payments.methods(),
    queryFn: () => paymentsService.getPaymentMethods().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.payments.wallet(),
    queryFn: () => paymentsService.getWallet().then((res) => res.data),
  })
}

export function useTransactions(filters: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: [...queryKeys.payments.all, "transactions", filters],
    queryFn: () => paymentsService.getTransactions(filters).then((res) => res.data),
  })
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: InitiatePaymentRequest) => paymentsService.initiatePayment(data),
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (paymentId: string) => paymentsService.verifyPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.wallet() })
    },
  })
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof paymentsService.addPaymentMethod>[0]) =>
      paymentsService.addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.methods() })
    },
  })
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentsService.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.methods() })
    },
  })
}

export function useRequestPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ amount, paymentMethodId }: { amount: number; paymentMethodId: string }) =>
      paymentsService.requestPayout(amount, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.wallet() })
    },
  })
}
