import type { Exercise, PerformedExercise, PersonalRecord, RoutineExercise } from '../../types/models'

export interface SetData {
    reps: number
    peso: number
}

export interface PreviousExerciseSession {
    fecha: string
    sets: PerformedExercise[]
}

export interface ExerciseHistoryEntry {
    fecha: string
    volume: number
    sets: PerformedExercise[]
}

export type ActiveRoutineExercise = RoutineExercise & {
    ejercicio?: Exercise
}

export interface ActiveExercisePrTarget {
    targetPeso: number | null
    targetVolumenSerie: number | null
    repsMismoPeso: PersonalRecord | undefined
}
