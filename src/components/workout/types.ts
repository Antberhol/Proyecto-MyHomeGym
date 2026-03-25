import type { Exercise, PerformedExercise, PersonalRecord, RoutineExercise } from '../../types/models'

export type WorkoutSetType = 'normal' | 'warmup' | 'dropset' | 'failure'

export interface SetData {
    reps: number
    peso: number
    rpe?: number
    type?: WorkoutSetType
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
