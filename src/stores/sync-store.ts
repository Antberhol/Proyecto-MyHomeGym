import { create } from 'zustand'

export type SyncUiStatus = 'idle' | 'offline' | 'syncing' | 'synced' | 'error'

interface SyncState {
    status: SyncUiStatus
    pendingChanges: number
    lastSyncAt?: string
    lastError?: string
    setStatus: (status: SyncUiStatus) => void
    setPendingChanges: (count: number) => void
    setLastSyncAt: (iso: string) => void
    setLastError: (message?: string) => void
}

export const useSyncStore = create<SyncState>((set) => ({
    status: navigator.onLine ? 'idle' : 'offline',
    pendingChanges: 0,
    lastSyncAt: undefined,
    lastError: undefined,
    setStatus: (status) => set({ status }),
    setPendingChanges: (pendingChanges) => set({ pendingChanges }),
    setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
    setLastError: (lastError) => set({ lastError }),
}))
