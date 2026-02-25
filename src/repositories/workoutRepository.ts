import { db } from '../lib/db'
import type { PerformedExercise, RegisteredTraining } from '../types/models'

export const workoutRepository = {
    async createCompletedTraining(training: RegisteredTraining, performed: PerformedExercise[]): Promise<void> {
        await db.saveCompletedTraining(training, performed)
    },
}
