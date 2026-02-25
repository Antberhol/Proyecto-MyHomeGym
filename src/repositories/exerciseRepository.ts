import { db } from '../lib/db'
import type { Exercise } from '../types/models'

export const exerciseRepository = {
    async listExercises(): Promise<Exercise[]> {
        return db.getAllExercisesCatalog()
    },

    async createExercise(exercise: Exercise): Promise<string> {
        return db.addExercise(exercise)
    },

    async updateExercise(exerciseId: string, changes: Partial<Exercise>): Promise<number> {
        return db.updateExercise(exerciseId, changes)
    },

    async deleteExercise(exerciseId: string): Promise<void> {
        await db.deleteExercise(exerciseId)
    },
}
