import { db } from '../lib/db'
import type {
    BodyMeasurement,
    Exercise,
    PerformedExercise,
    PersonalRecord,
    RegisteredTraining,
    Routine,
    RoutineExercise,
} from '../types/models'

export const progressRepository = {
    async listBodyMeasurements(): Promise<BodyMeasurement[]> {
        return db.getAllBodyMeasurements()
    },

    async listTrainings(): Promise<RegisteredTraining[]> {
        return db.getAllTrainings()
    },

    async listTrainingsUntil(maxDateIso: string): Promise<RegisteredTraining[]> {
        return db.getTrainingsBeforeOrEqual(maxDateIso)
    },

    async listPerformedExercises(): Promise<PerformedExercise[]> {
        return db.getAllPerformedExercises()
    },

    async listPerformedExercisesSince(sinceIso: string): Promise<PerformedExercise[]> {
        return db.getPerformedExercisesSince(sinceIso)
    },

    async listExercises(): Promise<Exercise[]> {
        return db.getAllExercisesCatalog()
    },

    async listRoutines(): Promise<Routine[]> {
        return db.getAllRoutines()
    },

    async listRoutineExercises(): Promise<RoutineExercise[]> {
        return db.getAllRoutineExercises()
    },

    async listPersonalRecords(): Promise<PersonalRecord[]> {
        return db.getAllPersonalRecords()
    },
}
