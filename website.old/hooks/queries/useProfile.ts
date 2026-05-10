"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { userService, type UserUpdate, type AddressData } from "@/lib/api/services/user.service"

export function useProfile() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => userService.getProfile().then((res) => res.data),
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserUpdate) => userService.updateProfile(data),
    onSuccess: (response) => {
      const updatedUser = response.data
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser)
      // Keep auth cache in sync
      queryClient.setQueryData(queryKeys.auth.user(), (old: any) =>
        old ? { ...old, ...updatedUser } : old
      )
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    },
  })

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  }
}

export function useAddresses() {
  const queryClient = useQueryClient()

  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.user.addresses(),
    queryFn: () => userService.getAddresses().then((res) => res.data),
  })

  const addAddressMutation = useMutation({
    mutationFn: (address: Omit<AddressData, "id">) => userService.addAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() })
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, address }: { id: string; address: Partial<AddressData> }) =>
      userService.updateAddress(id, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() })
    },
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() })
    },
  })

  return {
    addresses,
    isLoading,
    addAddress: addAddressMutation.mutate,
    isAdding: addAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutate,
    isUpdating: updateAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutate,
    isDeleting: deleteAddressMutation.isPending,
  }
}
