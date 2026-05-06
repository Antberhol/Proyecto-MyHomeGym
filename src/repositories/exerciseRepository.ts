import { db } from '../lib/db'
import type { Exercise } from '../types/models'

export const exerciseRepository = {
    async listExercises(): Promise<Exercise[]> {
        return db.getAllExercisesCatalog()
    },

    async getUsageFrequencyMap(): Promise<Map<string, number>> {
        const performed = await db.getAllPerformedExercises()
        return performed.reduce((acc, item) => {
            acc.set(item.ejercicioId, (acc.get(item.ejercicioId) ?? 0) + 1)
            return acc
        }, new Map<string, number>())
    },

    async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
        return db.getExerciseById(exerciseId)
    },

    async createExercise(exercise: Exercise): Promise<string> {
        const now = new Date().toISOString()
        const id = await db.addExercise({
            ...exercise,
            updatedAt: exercise.updatedAt ?? now,
            isSynced: false,
        })

        await db.enqueueSyncOperation({
            entityType: 'exercise',
            entityId: id,
            payload: '{}',
        })

        return id
    },

    async updateExercise(exerciseId: string, changes: Partial<Exercise>): Promise<number> {
        const now = new Date().toISOString()
        const updated = await db.updateExercise(exerciseId, {
            ...changes,
            updatedAt: changes.updatedAt ?? now,
            isSynced: false,
        })

        if (updated > 0) {
            await db.enqueueSyncOperation({
                entityType: 'exercise',
                entityId: exerciseId,
                payload: '{}',
            })
        }

        return updated
    },

    async deleteExercise(exerciseId: string): Promise<void> {
        await db.deleteExercise(exerciseId)
    },
}
