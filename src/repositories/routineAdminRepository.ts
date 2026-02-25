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
        return db.addRoutine(routine)
    },

    async updateRoutine(routineId: string, changes: Partial<Routine>): Promise<number> {
        return db.updateRoutine(routineId, changes)
    },

    async deleteRoutine(routineId: string): Promise<void> {
        await db.deleteRoutineAndLinkedExercises(routineId)
    },

    async createRoutineExercises(items: RoutineExercise[]): Promise<string> {
        return db.bulkAddRoutineExercises(items)
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
    },

    async reorderRoutineExercises(items: Array<{ id: string; orden: number }>): Promise<void> {
        await db.reorderRoutineExercises(items)
    },

    async updateRoutineExercise(routineExerciseId: string, changes: Partial<RoutineExercise>): Promise<number> {
        return db.updateRoutineExercise(routineExerciseId, changes)
    },
}
