import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type AuthUser } from '../services/authService'

async function hashPin(pin: string): Promise<string> {
    const payload = new TextEncoder().encode(pin)
    const digest = await crypto.subtle.digest('SHA-256', payload)
    return Array.from(new Uint8Array(digest))
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')
}

interface AuthState {
    pin?: string
    isLocked: boolean
    user: AuthUser | null
    isAuthLoading: boolean
    authError?: string
    lock: () => void
    unlock: () => void
    setPin: (plainPin: string) => Promise<void>
    clearPin: () => void
    verifyPin: (plainPin: string) => Promise<boolean>
    setUser: (user: AuthUser | null) => void
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    clearAuthError: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            pin: undefined,
            isLocked: false,
            user: null,
            isAuthLoading: false,
            authError: undefined,
            lock: () => set({ isLocked: true }),
            unlock: () => set({ isLocked: false }),
            setPin: async (plainPin) => {
                const pin = await hashPin(plainPin)
                set({ pin })
            },
            clearPin: () => set({ pin: undefined }),
            verifyPin: async (plainPin) => {
                const pinHash = get().pin
                if (!pinHash) return true
                const computedHash = await hashPin(plainPin)
                return pinHash === computedHash
            },
            setUser: (user) => set({ user }),
            loginWithGoogle: async () => {
                set({ isAuthLoading: true, authError: undefined })
                try {
                    const user = await authService.signInWithGoogle()
                    set({ user, isAuthLoading: false })
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
                    set({ user: null, isAuthLoading: false })
                } catch (error) {
                    set({
                        isAuthLoading: false,
                        authError: error instanceof Error ? error.message : 'No se pudo cerrar sesión',
                    })
                }
            },
            clearAuthError: () => set({ authError: undefined }),
        }),
        {
            name: 'myhomegym-auth',
            partialize: (state) => ({ pin: state.pin, isLocked: state.isLocked }),
        },
    ),
)