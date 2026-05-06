import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { progressRepository, type AggregatedWorkoutStats } from '../repositories/progressRepository'

const EMPTY_STATS: AggregatedWorkoutStats = {
    totalWorkouts: 0,
    avgDurationMinutes: 0,
    totalSetsThisWeek: 0,
    bestStreak: 0,
}

export function useWorkoutStats(): AggregatedWorkoutStats {
    const stats = useLiveQuery(() => progressRepository.getAggregatedStats(), [])

    return useMemo(() => stats ?? EMPTY_STATS, [stats])
}
