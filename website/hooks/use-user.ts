"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { userService, type UserUpdate, type AddressData } from "@/lib/api/services/user.service";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";

export function useProfile() {
	const queryClient = useQueryClient();
	const { updateProfile: updateLocalProfile } = useAuthStore();
	const { toast } = useToast();

	const { data: profile, isLoading, error } = useQuery({
		queryKey: queryKeys.user.profile(),
		queryFn: () => userService.getProfile().then(res => res.data),
	});

	const updateProfileMutation = useMutation({
		mutationFn: (data: UserUpdate) => userService.updateProfile(data),
		onSuccess: (response) => {
			const updatedUser = response.data;
			queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
			updateLocalProfile(updatedUser);
			toast({
				title: "Profile updated",
				description: "Your profile information has been successfully updated.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Update failed",
				description: error?.response?.data?.message || "Something went wrong while updating your profile.",
				variant: "destructive",
			});
		},
	});

	const uploadAvatarMutation = useMutation({
		mutationFn: (file: File) => userService.uploadAvatar(file),
		onSuccess: (response) => {
			const { avatarUrl } = response.data;
			updateLocalProfile({ avatar: avatarUrl });
			queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
			toast({
				title: "Avatar updated",
				description: "Your profile picture has been updated.",
			});
		},
	});

	return {
		profile,
		isLoading,
		error,
		updateProfile: updateProfileMutation.mutate,
		isUpdating: updateProfileMutation.isPending,
		uploadAvatar: uploadAvatarMutation.mutate,
		isUploadingAvatar: uploadAvatarMutation.isPending,
	};
}

export function useAddresses() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: addresses, isLoading } = useQuery({
		queryKey: queryKeys.user.addresses(),
		queryFn: () => userService.getAddresses().then(res => res.data),
	});

	const addAddressMutation = useMutation({
		mutationFn: (address: Omit<AddressData, "id">) => userService.addAddress(address),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
			toast({
				title: "Address added",
				description: "New address has been added to your profile.",
			});
		},
	});

	const updateAddressMutation = useMutation({
		mutationFn: ({ id, address }: { id: string; address: Partial<AddressData> }) => 
			userService.updateAddress(id, address),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
			toast({
				title: "Address updated",
				description: "Address information has been updated.",
			});
		},
	});

	const deleteAddressMutation = useMutation({
		mutationFn: (id: string) => userService.deleteAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
			toast({
				title: "Address deleted",
				description: "Address has been removed from your profile.",
			});
		},
	});

	return {
		addresses,
		isLoading,
		addAddress: addAddressMutation.mutate,
		isAdding: addAddressMutation.isPending,
		updateAddress: updateAddressMutation.mutate,
		isUpdating: updateAddressMutation.isPending,
		deleteAddress: deleteAddressMutation.mutate,
		isDeleting: deleteAddressMutation.isPending,
	};
}
