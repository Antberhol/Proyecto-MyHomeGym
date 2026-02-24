import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemePreference } from '../types/models'

interface UiState {
  theme: ThemePreference
  sidebarCollapsed: boolean
  setTheme: (theme: ThemePreference) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'gym-ui-state',
    },
  ),
)