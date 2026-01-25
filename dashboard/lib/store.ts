import {create} from 'zustand';

// Types
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin';
    avatar?: string;
}

export interface Notification {
    id: string;
    type: 'kyc' | 'order' | 'user' | 'product';
    message: string;
    read: boolean;
    timestamp: string;
}

export interface Filter {
    search: string;
    status: string;
    category: string;
    dateRange: { from: string; to: string } | null;
    sortBy: string;
}

// Admin Store
interface AdminStore {
    currentUser: AdminUser | null;
    setCurrentUser: (user: AdminUser | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
    currentUser: {
        id: '1',
        name: 'Admin User',
        email: 'admin@varsitymart.com',
        role: 'superadmin',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    setCurrentUser: (user) => set({currentUser: user}),
}));

// Notifications Store
interface NotificationsStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        })),
    markAsRead: (id) =>
        set((state) => {
            const updated = state.notifications.map((n) =>
                n.id === id ? {...n, read: true} : n
            );
            const newUnread = updated.filter((n) => !n.read).length;
            return {
                notifications: updated,
                unreadCount: newUnread,
            };
        }),
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({...n, read: true})),
            unreadCount: 0,
        })),
    removeNotification: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: state.unreadCount - (notification?.read ? 0 : 1),
            };
        }),
}));

// Filters Store
interface FiltersStore {
    filters: Filter;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
    setCategory: (category: string) => void;
    setDateRange: (from: string, to: string) => void;
    setSortBy: (sortBy: string) => void;
    resetFilters: () => void;
}

const defaultFilter: Filter = {
    search: '',
    status: '',
    category: '',
    dateRange: null,
    sortBy: 'recent',
};

export const useFiltersStore = create<FiltersStore>((set) => ({
    filters: defaultFilter,
    setSearch: (search) => set((state) => ({filters: {...state.filters, search}})),
    setStatus: (status) => set((state) => ({filters: {...state.filters, status}})),
    setCategory: (category) => set((state) => ({filters: {...state.filters, category}})),
    setDateRange: (from, to) =>
        set((state) => ({
            filters: {...state.filters, dateRange: {from, to}},
        })),
    setSortBy: (sortBy) => set((state) => ({filters: {...state.filters, sortBy}})),
    resetFilters: () => set({filters: defaultFilter}),
}));

// UI Store
interface UIStore {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    selectedTab: 'overview',
    setSelectedTab: (tab) => set({selectedTab: tab}),
}));
