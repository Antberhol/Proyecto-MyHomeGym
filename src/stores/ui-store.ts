import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemePreference } from '../types/models'

function isAutoTimeDark(date: Date): boolean {
  const hour = date.getHours()
  return hour >= 21 || hour < 7
}

export function resolveDarkThemePreference(
  theme: ThemePreference,
  prefersDark: boolean,
  now: Date = new Date(),
): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  if (theme === 'auto-time') return isAutoTimeDark(now)
  return prefersDark
}

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