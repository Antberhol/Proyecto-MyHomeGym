import { db } from '../lib/db'
import { emitTrainingSaved } from '../lib/events'
import type { PerformedExercise, RegisteredTraining } from '../types/models'

export const workoutRepository = {
    async createCompletedTraining(training: RegisteredTraining, performed: PerformedExercise[]): Promise<void> {
        await db.saveCompletedTraining(training, performed)
        emitTrainingSaved({ trainingId: training.id })
    },
}
