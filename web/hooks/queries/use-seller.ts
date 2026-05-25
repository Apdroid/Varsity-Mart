"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"

export const sellerKeys = {
  all: ["seller"] as const,
  kycStatus: () => [...sellerKeys.all, "kyc-status"] as const,
}

export function useKycStatus(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sellerKeys.kycStatus(),
    queryFn: () => authApi.getKycStatus(),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  })
}

export function useSubmitKyc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => authApi.becomeASeller(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.kycStatus() })
    },
  })
}
