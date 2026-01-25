'use client';

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin';
    avatar?: string;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({isLoading: true});

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock authentication - in production, replace with real API call
                if (email === 'admin@varsitymart.com' && password === 'password123') {
                    const user: AuthUser = {
                        id: '1',
                        name: 'Admin User',
                        email: 'admin@varsitymart.com',
                        role: 'superadmin',
                        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
                    };

                    set({
                        user,
                        token: 'mock-jwt-token-' + Date.now(),
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return true;
                }

                set({isLoading: false});
                return false;
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user) => {
                set({user, isAuthenticated: !!user});
            },

            checkAuth: () => {
                const state = get();
                return state.isAuthenticated && !!state.token && !!state.user;
            },
        }),
        {
            name: 'varsitymart-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Hook to check if user is authenticated
export function useAuth() {
    const {user, isAuthenticated, isLoading, login, logout, checkAuth} = useAuthStore();

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
    };
}
