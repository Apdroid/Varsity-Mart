"use client"

import { create } from "zustand"

interface UIState {
  // Modal state
  activeModal: string | null
  modalData: Record<string, unknown> | null
  openModal: (id: string, data?: Record<string, unknown>) => void
  closeModal: () => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Mobile menu
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Active tab tracking (per-section)
  activeTabs: Record<string, string>
  setActiveTab: (section: string, tab: string) => void

  // Loading overlay for UX feedback (not server loading)
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  // Modals
  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Tabs
  activeTabs: {},
  setActiveTab: (section, tab) =>
    set((s) => ({ activeTabs: { ...s.activeTabs, [section]: tab } })),

  // Global loading
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}))
