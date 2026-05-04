"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { offersService, type CreateOfferRequest, type CounterOfferRequest } from "@/lib/api/services/offers.service"

export function useProductOffers(productId: string) {
  return useQuery({
    queryKey: queryKeys.offers.forProduct(productId),
    queryFn: async () => {
      try {
        return await offersService.getProductOffers(productId)
      } catch {
        return { success: true, data: [] }
      }
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useMyOffers() {
  return useQuery({
    queryKey: queryKeys.offers.myOffers(),
    queryFn: async () => {
      try {
        return await offersService.getMyOffers()
      } catch {
        return { success: true, data: [] }
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateOfferRequest }) =>
      offersService.createOffer(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.forProduct(productId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.myOffers() })
    },
  })
}

export function useCancelOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (offerId: string) => offersService.cancelOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
  })
}

export function useAcceptOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (offerId: string) => offersService.acceptOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
  })
}

export function useDeclineOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (offerId: string) => offersService.declineOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
  })
}

export function useCounterOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ offerId, data }: { offerId: string; data: CounterOfferRequest }) =>
      offersService.counterOffer(offerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
  })
}
