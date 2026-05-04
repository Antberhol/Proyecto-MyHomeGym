import { db } from '../lib/db'
import type { Exercise, Routine, RoutineExercise } from '../types/models'

export const routineAdminRepository = {
    async listRoutines(): Promise<Routine[]> {
        return db.getAllRoutines()
    },

    async listExercises(): Promise<Exercise[]> {
        return db.getAllExercisesCatalog()
    },

    async listRoutineExercises(): Promise<RoutineExercise[]> {
        return db.getAllRoutineExercises()
    },

    async createRoutine(routine: Routine): Promise<string> {
        const now = new Date().toISOString()
        const id = await db.addRoutine({
            ...routine,
            updatedAt: routine.updatedAt ?? now,
            isSynced: false,
        })

        await db.enqueueSyncOperation({
            entityType: 'routine',
            entityId: id,
            payload: '{}',
        })

        return id
    },

    async updateRoutine(routineId: string, changes: Partial<Routine>): Promise<number> {
        const now = new Date().toISOString()
        const updated = await db.updateRoutine(routineId, {
            ...changes,
            updatedAt: changes.updatedAt ?? now,
            isSynced: false,
        })

        if (updated > 0) {
            await db.enqueueSyncOperation({
                entityType: 'routine',
                entityId: routineId,
                payload: '{}',
            })
        }

        return updated
    },

    async deleteRoutine(routineId: string): Promise<void> {
        await db.deleteRoutineAndLinkedExercises(routineId)
    },

    async createRoutineExercises(items: RoutineExercise[]): Promise<string> {
        const now = new Date().toISOString()
        const normalized = items.map((item) => ({
            ...item,
            updatedAt: item.updatedAt ?? now,
            isSynced: false,
        }))

        const result = await db.bulkAddRoutineExercises(normalized)
        await Promise.all(
            normalized.map((item) =>
                db.enqueueSyncOperation({
                    entityType: 'routineExercise',
                    entityId: item.id,
                    payload: '{}',
                }),
            ),
        )
        return result
    },

    async addExerciseToRoutine(item: RoutineExercise): Promise<string> {
        const now = new Date().toISOString()
        const normalized: RoutineExercise = {
            ...item,
            updatedAt: item.updatedAt ?? now,
            isSynced: false,
        }

        const result = await db.bulkAddRoutineExercises([normalized])
        await db.enqueueSyncOperation({
            entityType: 'routineExercise',
            entityId: normalized.id,
            payload: '{}',
        })
        return result
    },

    async deleteRoutineExercise(routineExerciseId: string): Promise<void> {
        await db.deleteRoutineExercise(routineExerciseId)
    },

    async swapRoutineExerciseOrder(
        currentId: string,
        currentOrder: number,
        targetId: string,
        targetOrder: number,
    ): Promise<void> {
        await db.swapRoutineExerciseOrders(currentId, currentOrder, targetId, targetOrder)

        await Promise.all([
            db.enqueueSyncOperation({ entityType: 'routineExercise', entityId: currentId, payload: '{}' }),
            db.enqueueSyncOperation({ entityType: 'routineExercise', entityId: targetId, payload: '{}' }),
        ])
    },

    async reorderRoutineExercises(items: Array<{ id: string; orden: number }>): Promise<void> {
        await db.reorderRoutineExercises(items)

        await Promise.all(
            items.map((item) =>
                db.enqueueSyncOperation({
                    entityType: 'routineExercise',
                    entityId: item.id,
                    payload: '{}',
                }),
            ),
        )
    },

    async updateRoutineExercise(routineExerciseId: string, changes: Partial<RoutineExercise>): Promise<number> {
        const now = new Date().toISOString()
        const updated = await db.updateRoutineExercise(routineExerciseId, {
            ...changes,
            updatedAt: changes.updatedAt ?? now,
            isSynced: false,
        })

        if (updated > 0) {
            await db.enqueueSyncOperation({
                entityType: 'routineExercise',
                entityId: routineExerciseId,
                payload: '{}',
            })
        }

        return updated
    },
}
