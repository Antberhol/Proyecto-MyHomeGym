import { create } from 'zustand'
import { authService, type AuthUser } from '../services/authService'

interface AuthState {
    user: AuthUser | null
    isGuest: boolean
    isAuthReady: boolean
    isAuthLoading: boolean
    authError?: string
    setUser: (user: AuthUser | null) => void
    enterAsGuest: () => void
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    clearAuthError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isGuest: false,
    isAuthReady: false,
    isAuthLoading: false,
    authError: undefined,
    setUser: (user) =>
        set((state) => ({
            user,
            isAuthReady: true,
            isGuest: user ? false : state.isGuest,
        })),
    enterAsGuest: () =>
        set({
            user: null,
            isGuest: true,
            isAuthReady: true,
            isAuthLoading: false,
            authError: undefined,
        }),
    loginWithGoogle: async () => {
        set({ isAuthLoading: true, authError: undefined })
        try {
            const user = await authService.signInWithGoogle()
            set({ user, isGuest: false, isAuthReady: true, isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                authError: error instanceof Error ? error.message : 'No se pudo iniciar sesión con Google',
            })
        }
    },
    logout: async () => {
        set({ isAuthLoading: true, authError: undefined })
        try {
            await authService.signOut()
            set({ user: null, isGuest: false, isAuthReady: true, isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                authError: error instanceof Error ? error.message : 'No se pudo cerrar sesión',
            })
        }
    },
    clearAuthError: () => set({ authError: undefined }),
}))