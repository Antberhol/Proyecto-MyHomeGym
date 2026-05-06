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

interface RecentWorkoutBundle {
    training: RegisteredTraining
    exercises: PerformedExercise[]
}

export interface AggregatedWorkoutStats {
    totalWorkouts: number
    avgDurationMinutes: number
    totalSetsThisWeek: number
    bestStreak: number
}

export const progressRepository = {
    async listBodyMeasurements(): Promise<BodyMeasurement[]> {
        return db.getAllBodyMeasurements()
    },

    async listTrainings(): Promise<RegisteredTraining[]> {
        return db.getAllTrainings()
    },

    async listTrainingsRecent(days: number): Promise<RegisteredTraining[]> {
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - Math.max(0, days))
        return db.getTrainingsSince(cutoff.toISOString())
    },

    async countTrainings(): Promise<number> {
        return db.getTrainingsCount()
    },

    async sumTrainingVolumeAllTime(): Promise<number> {
        return db.getTrainingsTotalVolume()
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

    async listRecentWorkouts(limit = 5): Promise<RecentWorkoutBundle[]> {
        const trainings = (await db.getAllTrainings())
            .filter((training) => training.completado)
            .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
            .slice(0, Math.max(1, limit))

        if (trainings.length === 0) return []

        const performed = await db.getAllPerformedExercises()

        return trainings.map((training) => ({
            training,
            exercises: performed.filter((item) => item.entrenamientoId === training.id),
        }))
    },

    async getExerciseHistory(exerciseId: string, from?: string, to?: string): Promise<PerformedExercise[]> {
        return db.getPerformedExercisesByExerciseAndDateRange(exerciseId, from, to)
    },

    async getExercisePrs(exerciseId: string): Promise<PersonalRecord[]> {
        return db.getPersonalRecordsByExercise(exerciseId)
    },

    async getAggregatedStats(): Promise<AggregatedWorkoutStats> {
        const trainings = (await db.getAllTrainings()).filter((training) => training.completado)
        const performed = await db.getAllPerformedExercises()

        const totalWorkouts = trainings.length

        const now = new Date()
        const last30 = new Date(now)
        last30.setDate(now.getDate() - 30)

        const recentTrainings = trainings.filter((training) => new Date(training.fecha) >= last30)
        const avgDurationMinutes = recentTrainings.length === 0
            ? 0
            : Math.round(
                recentTrainings.reduce((sum, item) => sum + item.duracionMinutos, 0) / recentTrainings.length,
            )

        const startOfWeek = new Date(now)
        startOfWeek.setHours(0, 0, 0, 0)
        const day = (startOfWeek.getDay() + 6) % 7
        startOfWeek.setDate(startOfWeek.getDate() - day)

        const totalSetsThisWeek = performed.filter((item) => new Date(item.fecha) >= startOfWeek).length

        const dateKeys = trainings
            .map((item) => item.fecha)
            .map((value) => {
                const date = new Date(value)
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const dayKey = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${dayKey}`
            })
            .sort()

        let bestStreak = 0
        let currentStreak = 0
        let previousDate: Date | null = null

        for (const key of dateKeys) {
            const [year, month, dayValue] = key.split('-').map(Number)
            const date = new Date(year, month - 1, dayValue)

            if (!previousDate) {
                currentStreak = 1
                bestStreak = Math.max(bestStreak, currentStreak)
                previousDate = date
                continue
            }

            const diffDays = Math.round((date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDays === 0) {
                continue
            }

            if (diffDays === 1) {
                currentStreak += 1
            } else {
                currentStreak = 1
            }

            bestStreak = Math.max(bestStreak, currentStreak)
            previousDate = date
        }

        return {
            totalWorkouts,
            avgDurationMinutes,
            totalSetsThisWeek,
            bestStreak,
        }
    },
}
