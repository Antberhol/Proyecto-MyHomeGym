import { doc, getDoc, setDoc } from 'firebase/firestore'
import { subscribeTrainingSaved } from '../lib/events'
import { db } from '../lib/db'
import type { RegisteredTraining } from '../types/models'
import type { AuthUser } from './authService'
import { firebaseFirestore, isFirebaseConfigured } from './firebase'
import { useSyncStore } from '../stores/sync-store'

interface CloudTrainingPayload {
    training: RegisteredTraining
    performed: Awaited<ReturnType<typeof db.getAllPerformedExercises>>
    uploadedAt: string
}

interface CloudBackupDoc {
    updatedAt: string
    data: Awaited<ReturnType<typeof db.exportAllData>>
}

interface PendingTrainingPayload {
    trainingId: string
}

const INITIAL_SYNC_KEY_PREFIX = 'myhomegym-cloud-initial-sync:'

class SyncService {
    private user: AuthUser | null = null
    private unsubscribeTrainingSaved?: () => void
    private started = false

    private formatSyncError(error: unknown, fallback: string) {
        const code =
            typeof error === 'object' && error !== null && 'code' in error
                ? String((error as { code?: string }).code)
                : ''

        if (code.includes('permission-denied')) {
            return 'Firestore no permite sincronizar. Revisa las reglas para usuarios autenticados.'
        }

        if (code.includes('failed-precondition') || code.includes('not-found')) {
            return 'Firestore no está inicializado. Crea la base de datos en Firebase Console.'
        }

        if (code.includes('unauthenticated')) {
            return 'La sesión no es válida para sincronizar. Cierra sesión y vuelve a entrar.'
        }

        if (code.includes('unavailable')) {
            return 'Firestore no está disponible ahora mismo. Inténtalo de nuevo en unos segundos.'
        }

        if (error instanceof Error && error.message.trim()) {
            return error.message
        }

        return fallback
    }

    private get initialSyncKey() {
        return `${INITIAL_SYNC_KEY_PREFIX}${this.user?.uid ?? 'anon'}`
    }

    start() {
        if (this.started) return
        this.started = true

        this.unsubscribeTrainingSaved = subscribeTrainingSaved((detail) => {
            void this.handleTrainingSaved(detail.trainingId)
        })

        window.addEventListener('online', this.onConnectivityChange)
        window.addEventListener('offline', this.onConnectivityChange)
        this.onConnectivityChange()
    }

    stop() {
        if (!this.started) return
        this.started = false

        this.unsubscribeTrainingSaved?.()
        this.unsubscribeTrainingSaved = undefined

        window.removeEventListener('online', this.onConnectivityChange)
        window.removeEventListener('offline', this.onConnectivityChange)
    }

    async setAuthenticatedUser(user: AuthUser | null) {
        this.user = user

        if (!user) {
            useSyncStore.getState().setStatus(navigator.onLine ? 'idle' : 'offline')
            return
        }

        await this.syncOnLogin()
    }

    private onConnectivityChange = () => {
        const setStatus = useSyncStore.getState().setStatus

        if (!navigator.onLine) {
            setStatus('offline')
            return
        }

        if (!this.user) {
            setStatus('idle')
            return
        }

        void this.flushQueue()
    }

    private async syncOnLogin() {
        if (!this.user || !isFirebaseConfigured || !firebaseFirestore) {
            useSyncStore.getState().setStatus(navigator.onLine ? 'idle' : 'offline')
            return
        }

        const syncStore = useSyncStore.getState()

        if (!navigator.onLine) {
            syncStore.setStatus('offline')
            return
        }

        syncStore.setStatus('syncing')

        try {
            const hasSyncedBefore = window.localStorage.getItem(this.initialSyncKey) === 'done'
            if (!hasSyncedBefore) {
                await this.pullCloudBackupToLocal()
                window.localStorage.setItem(this.initialSyncKey, 'done')
            }

            await this.flushQueue()
        } catch (error) {
            syncStore.setStatus('error')
            syncStore.setLastError(
                this.formatSyncError(error, 'No se pudo sincronizar al iniciar sesión'),
            )
        }
    }

    private async pullCloudBackupToLocal() {
        if (!this.user || !firebaseFirestore) return

        const backupRef = doc(firebaseFirestore, 'users', this.user.uid, 'meta', 'backup')
        const snapshot = await getDoc(backupRef)

        if (!snapshot.exists()) {
            await this.pushLocalBackupToCloud()
            return
        }

        const payload = snapshot.data() as CloudBackupDoc
        if (!payload?.data) return

        await db.replaceAllData(payload.data)
    }

    private async pushLocalBackupToCloud() {
        if (!this.user || !firebaseFirestore) return

        const backupRef = doc(firebaseFirestore, 'users', this.user.uid, 'meta', 'backup')
        const currentData = await db.exportAllData()

        await setDoc(
            backupRef,
            {
                updatedAt: new Date().toISOString(),
                data: currentData,
            } satisfies CloudBackupDoc,
            { merge: true },
        )
    }

    private async handleTrainingSaved(trainingId: string) {
        if (!this.user) return

        if (!navigator.onLine) {
            await this.enqueueTraining(trainingId)
            useSyncStore.getState().setStatus('offline')
            return
        }

        try {
            useSyncStore.getState().setStatus('syncing')
            await this.pushTraining(trainingId)
            await this.pushLocalBackupToCloud()
            useSyncStore.getState().setStatus('synced')
            useSyncStore.getState().setLastSyncAt(new Date().toISOString())
            useSyncStore.getState().setLastError(undefined)
        } catch (error) {
            await this.enqueueTraining(trainingId)
            useSyncStore.getState().setStatus('error')
            useSyncStore.getState().setLastError(
                this.formatSyncError(error, 'Error enviando entrenamiento a la nube'),
            )
        } finally {
            const pending = await db.getPendingSyncOperations()
            useSyncStore.getState().setPendingChanges(pending.length)
        }
    }

    private async enqueueTraining(trainingId: string) {
        await db.enqueueSyncOperation({
            entityType: 'training',
            entityId: trainingId,
            payload: JSON.stringify({ trainingId } satisfies PendingTrainingPayload),
        })

        const pending = await db.getPendingSyncOperations()
        useSyncStore.getState().setPendingChanges(pending.length)
    }

    private async pushTraining(trainingId: string) {
        if (!this.user || !firebaseFirestore) return

        const training = (await db.getAllTrainings()).find((item) => item.id === trainingId)
        if (!training) return

        const performed = (await db.getAllPerformedExercises()).filter(
            (item) => item.entrenamientoId === trainingId,
        )

        const trainingRef = doc(firebaseFirestore, 'users', this.user.uid, 'trainings', trainingId)

        await setDoc(
            trainingRef,
            {
                training,
                performed,
                uploadedAt: new Date().toISOString(),
            } satisfies CloudTrainingPayload,
            { merge: true },
        )

        await db.updateTrainingSyncState(trainingId, true, new Date().toISOString())
    }

    private async flushQueue() {
        if (!this.user || !navigator.onLine) {
            return
        }

        useSyncStore.getState().setStatus('syncing')

        try {
            const pending = await db.getPendingSyncOperations()
            useSyncStore.getState().setPendingChanges(pending.length)
            let lastQueueError: string | undefined

            for (const operation of pending) {
                try {
                    if (operation.entityType === 'training') {
                        const payload = JSON.parse(operation.payload) as PendingTrainingPayload
                        await this.pushTraining(payload.trainingId)
                    }

                    await db.markSyncOperationDone(operation.id)
                } catch (error) {
                    const errorMessage = this.formatSyncError(error, 'Error de sincronización en cola')
                    lastQueueError = errorMessage
                    await db.markSyncOperationFailed(
                        operation.id,
                        errorMessage,
                    )
                }
            }

            const remaining = await db.getPendingSyncOperations()
            useSyncStore.getState().setPendingChanges(remaining.length)

            if (remaining.length === 0) {
                await this.pushLocalBackupToCloud()
                useSyncStore.getState().setStatus('synced')
                useSyncStore.getState().setLastSyncAt(new Date().toISOString())
                useSyncStore.getState().setLastError(undefined)
                return
            }

            useSyncStore.getState().setStatus(navigator.onLine ? 'error' : 'offline')
            useSyncStore.getState().setLastError(
                lastQueueError ?? 'Hay cambios pendientes sin sincronizar. Revisa tu conexión o permisos.',
            )
        } catch (error) {
            useSyncStore.getState().setStatus(navigator.onLine ? 'error' : 'offline')
            useSyncStore.getState().setLastError(this.formatSyncError(error, 'Error general de sincronización'))
        }
    }
}

export const syncService = new SyncService()
