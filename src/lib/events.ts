export const WORKOUT_TIMER_FINISHED_EVENT = 'workout:timer-finished'

export interface WorkoutTimerFinishedDetail {
    finishedAtIso: string
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
