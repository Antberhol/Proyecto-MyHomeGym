import { db } from '../lib/db'
import type { Exercise, PerformedExercise, PersonalRecord, Routine, RoutineExercise } from '../types/models'

export const routineRepository = {
    async listRoutines(): Promise<Routine[]> {
        return db.getAllRoutines()
    },

    async listRoutineExercises(): Promise<RoutineExercise[]> {
        return db.getAllRoutineExercises()
    },

    async listExercises(): Promise<Exercise[]> {
        return db.getAllExercisesCatalog()
    },

    async listPerformedExercises(): Promise<PerformedExercise[]> {
        return db.getAllPerformedExercises()
    },

    async listPersonalRecords(): Promise<PersonalRecord[]> {
        return db.getAllPersonalRecords()
    },
}
