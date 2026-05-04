import { doc, getDoc, setDoc } from 'firebase/firestore'
import { subscribeSyncOperationEnqueued, subscribeTrainingSaved } from '../lib/events'
import { db } from '../lib/db'
import type {
    BodyMeasurement,
    Exercise,
    PersonalRecord,
    RegisteredTraining,
    Routine,
    RoutineExercise,
} from '../types/models'
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

function safeJsonParse<T>(value: string): T | undefined {
    try {
        return JSON.parse(value) as T
    } catch {
        return undefined
    }
}

function sanitizeFirestoreValue<T>(value: T): T {
    if (Array.isArray(value)) {
        return value
            .map((item) => sanitizeFirestoreValue(item))
            .filter((item) => item !== undefined) as T
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([, entryValue]) => entryValue !== undefined)
            .map(([key, entryValue]) => [key, sanitizeFirestoreValue(entryValue)])

        return Object.fromEntries(entries) as T
    }

    return value
}

const INITIAL_SYNC_KEY_PREFIX = 'myhomegym-cloud-initial-sync:'

class SyncService {
    private user: AuthUser | null = null
    private unsubscribeTrainingSaved?: () => void
    private unsubscribeSyncEnqueued?: () => void
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

        this.unsubscribeSyncEnqueued = subscribeSyncOperationEnqueued(() => {
            if (!this.user) return
            if (!navigator.onLine) {
                useSyncStore.getState().setStatus('offline')
                return
            }

            void this.flushQueue()
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

        this.unsubscribeSyncEnqueued?.()
        this.unsubscribeSyncEnqueued = undefined

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
        const sanitizedBackupDoc = sanitizeFirestoreValue({
            updatedAt: new Date().toISOString(),
            data: currentData,
        } satisfies CloudBackupDoc)

        await setDoc(
            backupRef,
            sanitizedBackupDoc,
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

        const trainingRef = doc(firebaseFirestore, 'users', this.user.uid, 'training', trainingId)
        const sanitizedTrainingPayload = sanitizeFirestoreValue({
            training,
            performed,
            uploadedAt: new Date().toISOString(),
        } satisfies CloudTrainingPayload)

        await setDoc(
            trainingRef,
            sanitizedTrainingPayload,
            { merge: true },
        )

        await db.updateTrainingSyncState(trainingId, true, new Date().toISOString())
    }

    private async pushRoutine(routineId: string) {
        if (!this.user || !firebaseFirestore) return

        const routine = await db.getRoutineById(routineId)
        if (!routine) return

        const uploadedAt = new Date().toISOString()
        const routineRef = doc(firebaseFirestore, 'users', this.user.uid, 'routine', routineId)
        const sanitizedRoutinePayload = sanitizeFirestoreValue({
            routine,
            uploadedAt,
        } satisfies { routine: Routine; uploadedAt: string })

        await setDoc(routineRef, sanitizedRoutinePayload, { merge: true })
        await db.updateRoutineSyncState(routineId, true, uploadedAt)
    }

    private async pushRoutineExercise(routineExerciseId: string) {
        if (!this.user || !firebaseFirestore) return

        const routineExercise = await db.getRoutineExerciseById(routineExerciseId)
        if (!routineExercise) return

        const uploadedAt = new Date().toISOString()
        const routineExerciseRef = doc(
            firebaseFirestore,
            'users',
            this.user.uid,
            'routineExercise',
            routineExerciseId,
        )
        const sanitizedPayload = sanitizeFirestoreValue({
            routineExercise,
            uploadedAt,
        } satisfies { routineExercise: RoutineExercise; uploadedAt: string })

        await setDoc(routineExerciseRef, sanitizedPayload, { merge: true })
        await db.updateRoutineExerciseSyncState(routineExerciseId, true, uploadedAt)
    }

    private async pushExercise(exerciseId: string) {
        if (!this.user || !firebaseFirestore) return

        const exercise = await db.getExerciseById(exerciseId)
        if (!exercise) return

        const uploadedAt = new Date().toISOString()
        const exerciseRef = doc(firebaseFirestore, 'users', this.user.uid, 'exercise', exerciseId)
        const sanitizedPayload = sanitizeFirestoreValue({
            exercise,
            uploadedAt,
        } satisfies { exercise: Exercise; uploadedAt: string })

        await setDoc(exerciseRef, sanitizedPayload, { merge: true })
        await db.updateExerciseSyncState(exerciseId, true, uploadedAt)
    }

    private async pushBodyMeasurement(measurementId: string) {
        if (!this.user || !firebaseFirestore) return

        const bodyMeasurement = await db.getBodyMeasurementById(measurementId)
        if (!bodyMeasurement) return

        const uploadedAt = new Date().toISOString()
        const measurementRef = doc(
            firebaseFirestore,
            'users',
            this.user.uid,
            'bodyMeasurement',
            measurementId,
        )
        const sanitizedPayload = sanitizeFirestoreValue({
            bodyMeasurement,
            uploadedAt,
        } satisfies { bodyMeasurement: BodyMeasurement; uploadedAt: string })

        await setDoc(measurementRef, sanitizedPayload, { merge: true })
        await db.updateBodyMeasurementSyncState(measurementId, true, uploadedAt)
    }

    private async pushPersonalRecord(personalRecordId: string) {
        if (!this.user || !firebaseFirestore) return

        const pr = await db.getPersonalRecordById(personalRecordId)
        if (!pr) return

        const uploadedAt = new Date().toISOString()
        const prRef = doc(firebaseFirestore, 'users', this.user.uid, 'pr', personalRecordId)
        const sanitizedPayload = sanitizeFirestoreValue({
            pr,
            uploadedAt,
        } satisfies { pr: PersonalRecord; uploadedAt: string })

        await setDoc(prRef, sanitizedPayload, { merge: true })
        await db.updatePersonalRecordSyncState(personalRecordId, true, uploadedAt)
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
                        const parsed = safeJsonParse<PendingTrainingPayload>(operation.payload)
                        const trainingId = parsed?.trainingId || operation.entityId
                        await this.pushTraining(trainingId)
                    } else if (operation.entityType === 'routine') {
                        await this.pushRoutine(operation.entityId)
                    } else if (operation.entityType === 'routineExercise') {
                        await this.pushRoutineExercise(operation.entityId)
                    } else if (operation.entityType === 'exercise') {
                        await this.pushExercise(operation.entityId)
                    } else if (operation.entityType === 'bodyMeasurement') {
                        await this.pushBodyMeasurement(operation.entityId)
                    } else if (operation.entityType === 'pr') {
                        await this.pushPersonalRecord(operation.entityId)
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
