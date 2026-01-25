import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {API} from './api';
import {toast} from 'sonner';

// Dashboard hooks
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => API.dashboard.getStats(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useRevenueChart = () => {
    return useQuery({
        queryKey: ['dashboard', 'revenue'],
        queryFn: () => API.dashboard.getRevenueChart(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useOrdersChart = () => {
    return useQuery({
        queryKey: ['dashboard', 'orders'],
        queryFn: () => API.dashboard.getOrdersChart(),
        staleTime: 5 * 60 * 1000,
    });
};

// Users hooks
export const useUsers = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['users', page, limit],
        queryFn: () => API.users.getAll(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => API.users.getById(id),
        enabled: !!id,
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, status}: { id: number; status: string }) =>
            API.users.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']});
            toast.success('User status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update user status');
        },
    });
};

// KYC hooks
export const usePendingKYC = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['kyc', 'pending', page, limit],
        queryFn: () => API.kyc.getPending(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useVerifyKYC = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => API.kyc.verify(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['kyc']});
            toast.success('KYC verified successfully');
        },
        onError: () => {
            toast.error('Failed to verify KYC');
        },
    });
};

export const useRejectKYC = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, reason}: { id: number; reason: string }) =>
            API.kyc.reject(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['kyc']});
            toast.success('KYC rejected');
        },
        onError: () => {
            toast.error('Failed to reject KYC');
        },
    });
};

// Products hooks
export const useProducts = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => API.products.getAll(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => API.products.getById(id),
        enabled: !!id,
    });
};

export const useUpdateProductStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, status}: { id: number; status: string }) =>
            API.products.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
            toast.success('Product status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update product status');
        },
    });
};

// Orders hooks
export const useOrders = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['orders', page, limit],
        queryFn: () => API.orders.getAll(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => API.orders.getById(id),
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, status}: { id: string; status: string }) =>
            API.orders.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']});
            toast.success('Order status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update order status');
        },
    });
};

// Restaurants hooks
export const useRestaurants = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['restaurants', page, limit],
        queryFn: () => API.restaurants.getAll(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useRestaurant = (id: number) => {
    return useQuery({
        queryKey: ['restaurants', id],
        queryFn: () => API.restaurants.getById(id),
        enabled: !!id,
    });
};

// Categories hooks
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => API.categories.getAll(),
        staleTime: 10 * 60 * 1000,
    });
};

// Notifications hooks
export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => API.notifications.getAll(),
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Ambassador hooks
export const useAmbassadors = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['ambassadors', page, limit],
        queryFn: () => API.ambassadors.getAll(page, limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useAmbassador = (id: number) => {
    return useQuery({
        queryKey: ['ambassadors', id],
        queryFn: () => API.ambassadors.getById(id),
        enabled: !!id,
    });
};

export const useAmbassadorLeaderboard = () => {
    return useQuery({
        queryKey: ['ambassadors', 'leaderboard'],
        queryFn: () => API.ambassadors.getLeaderboard(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useMissions = () => {
    return useQuery({
        queryKey: ['missions'],
        queryFn: () => API.ambassadors.getMissions(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useRewards = () => {
    return useQuery({
        queryKey: ['rewards'],
        queryFn: () => API.ambassadors.getRewards(),
        staleTime: 10 * 60 * 1000,
    });
};

export const useUpdateAmbassadorStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, status}: { id: number; status: string }) =>
            API.ambassadors.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['ambassadors']});
            toast.success('Ambassador status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update ambassador status');
        },
    });
};

export const useProcessPayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, amount, method}: { id: number; amount: number; method: string }) =>
            API.ambassadors.processPayout(id, amount, method),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['ambassadors']});
            toast.success('Payout processed successfully');
        },
        onError: () => {
            toast.error('Failed to process payout');
        },
    });
};
