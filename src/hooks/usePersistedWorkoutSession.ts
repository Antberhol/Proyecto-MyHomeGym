import { useEffect } from 'react'
import type { SetData } from '../components/workout/types'

const WORKOUT_SESSION_STORAGE_KEY = 'myhomegym.activeWorkoutSession'

interface PersistedWorkoutSession {
    selectedRoutineId: string
    setData: Record<string, SetData>
    sessionSeconds: number
    activeExerciseIndex: number
}

interface UsePersistedWorkoutSessionParams {
    selectedRoutineId: string
    setData: Record<string, SetData>
    sessionSeconds: number
    activeExerciseIndex: number
}

function safeReadSession(): PersistedWorkoutSession | null {
    if (typeof window === 'undefined') return null

    const raw = window.localStorage.getItem(WORKOUT_SESSION_STORAGE_KEY)
    if (!raw) return null

    try {
        const parsed = JSON.parse(raw) as PersistedWorkoutSession
        if (typeof parsed !== 'object' || parsed === null) return null

        return {
            selectedRoutineId: parsed.selectedRoutineId ?? '',
            setData: parsed.setData ?? {},
            sessionSeconds: Number(parsed.sessionSeconds ?? 0),
            activeExerciseIndex: Number(parsed.activeExerciseIndex ?? 0),
        }
    } catch {
        return null
    }
}

export function getPersistedWorkoutSession(): PersistedWorkoutSession | null {
    return safeReadSession()
}

export function clearPersistedWorkoutSession() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(WORKOUT_SESSION_STORAGE_KEY)
}

export function usePersistedWorkoutSession({
    selectedRoutineId,
    setData,
    sessionSeconds,
    activeExerciseIndex,
}: UsePersistedWorkoutSessionParams) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const hasMeaningfulData = Boolean(
            selectedRoutineId || Object.keys(setData).length > 0 || sessionSeconds > 0 || activeExerciseIndex > 0,
        )

        if (!hasMeaningfulData) {
            clearPersistedWorkoutSession()
            return
        }

        const session: PersistedWorkoutSession = {
            selectedRoutineId,
            setData,
            sessionSeconds,
            activeExerciseIndex,
        }

        window.localStorage.setItem(WORKOUT_SESSION_STORAGE_KEY, JSON.stringify(session))
    }, [activeExerciseIndex, selectedRoutineId, sessionSeconds, setData])

    return {
        clearSession: clearPersistedWorkoutSession,
    }
}
