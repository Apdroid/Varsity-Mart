"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paymentsApi } from "@/lib/api/payments"
import type { AddPaymentMethodRequest, UpdatePaymentMethodRequest, PaymentMethod, PayoutRequest } from "@/lib/api/types"

export const paymentKeys = {
  all: ["payments"] as const,
  methods: () => [...paymentKeys.all, "methods"] as const,
  escrow: () => [...paymentKeys.all, "escrow"] as const,
  banks: () => [...paymentKeys.all, "banks"] as const,
  verify: (reference: string) => [...paymentKeys.all, "verify", reference] as const,
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: async () => {
      const response = await paymentsApi.methods.list()
      return response.data   
			},
  })
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddPaymentMethodRequest) => paymentsApi.methods.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() })
    },
  })
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.methods.remove(methodId),
    onMutate: async (methodId) => {
      await queryClient.cancelQueries({ queryKey: paymentKeys.methods() })
      const previous = queryClient.getQueryData<{ methods: PaymentMethod[] }>(paymentKeys.methods())
      if (previous) {
        queryClient.setQueryData<{ methods: PaymentMethod[] }>(
          paymentKeys.methods(),
          { methods: previous.methods.filter((m) => m.id !== methodId) }
        )
      }
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(paymentKeys.methods(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() })
    },
  })
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.methods.setDefault(methodId),
    onMutate: async (methodId) => {
      await queryClient.cancelQueries({ queryKey: paymentKeys.methods() })
      const previous = queryClient.getQueryData<{ methods: PaymentMethod[] }>(paymentKeys.methods())
      if (previous) {
        queryClient.setQueryData<{ methods: PaymentMethod[] }>(
          paymentKeys.methods(),
          { methods: previous.methods.map((m) => ({ ...m, isDefault: m.id === methodId })) }
        )
      }
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(paymentKeys.methods(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() })
    },
  })
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ methodId, data }: { methodId: string; data: UpdatePaymentMethodRequest }) =>
      paymentsApi.methods.update(methodId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() })
    },
  })
}

export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: paymentKeys.verify(reference ?? ""),
    queryFn: async () => {
      if (!reference) throw new Error("reference is required")
      const response = await paymentsApi.verify(reference)
      return response.data
    },
    enabled: !!reference,
    retry: false,
  })
}

export function useEscrowBalance() {
  return useQuery({
    queryKey: paymentKeys.escrow(),
    queryFn: async () => {
      const response = await paymentsApi.escrowBalance()
      return response.data
    },
  })
}

export function useBanks() {
  return useQuery({
    queryKey: paymentKeys.banks(),
    queryFn: async () => {
      const response = await paymentsApi.banks()
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useRequestPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PayoutRequest) => paymentsApi.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.escrow() })
    },
  })
}
