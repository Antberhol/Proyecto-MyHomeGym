export const WORKOUT_TIMER_FINISHED_EVENT = 'workout:timer-finished'
export const TRAINING_SAVED_EVENT = 'workout:training-saved'

export interface WorkoutTimerFinishedDetail {
    finishedAtIso: string
}

export interface TrainingSavedDetail {
    trainingId: string
}

export function emitWorkoutTimerFinished(detail?: WorkoutTimerFinishedDetail) {
    if (typeof window === 'undefined') return

    window.dispatchEvent(
        new CustomEvent<WorkoutTimerFinishedDetail>(WORKOUT_TIMER_FINISHED_EVENT, {
            detail: detail ?? { finishedAtIso: new Date().toISOString() },
        }),
    )
}

export function subscribeWorkoutTimerFinished(
    listener: (detail: WorkoutTimerFinishedDetail) => void,
): () => void {
    if (typeof window === 'undefined') {
        return () => { }
    }

    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<WorkoutTimerFinishedDetail>
        listener(customEvent.detail ?? { finishedAtIso: new Date().toISOString() })
    }

    window.addEventListener(WORKOUT_TIMER_FINISHED_EVENT, handler)

    return () => {
        window.removeEventListener(WORKOUT_TIMER_FINISHED_EVENT, handler)
    }
}

export function emitTrainingSaved(detail: TrainingSavedDetail) {
    if (typeof window === 'undefined') return

    window.dispatchEvent(
        new CustomEvent<TrainingSavedDetail>(TRAINING_SAVED_EVENT, {
            detail,
        }),
    )
}

export function subscribeTrainingSaved(
    listener: (detail: TrainingSavedDetail) => void,
): () => void {
    if (typeof window === 'undefined') {
        return () => { }
    }

    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<TrainingSavedDetail>
        const detail = customEvent.detail
        if (!detail?.trainingId) return
        listener(detail)
    }

    window.addEventListener(TRAINING_SAVED_EVENT, handler)

    return () => {
        window.removeEventListener(TRAINING_SAVED_EVENT, handler)
    }
}
