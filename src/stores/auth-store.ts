import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
    lock: () => void
    unlock: () => void
    setPin: (plainPin: string) => Promise<void>
    clearPin: () => void
    verifyPin: (plainPin: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            pin: undefined,
            isLocked: false,
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
        }),
        {
            name: 'myhomegym-auth',
            partialize: (state) => ({ pin: state.pin, isLocked: state.isLocked }),
        },
    ),
)