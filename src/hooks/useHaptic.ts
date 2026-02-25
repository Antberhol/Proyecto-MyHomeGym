import { useEffect } from 'react'
import { subscribeWorkoutTimerFinished } from '../lib/events'

function canVibrate(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

function trigger(pattern: number | number[]) {
    if (!canVibrate()) return
    navigator.vibrate(pattern)
}

export function useHaptic() {
    const triggerSelection = () => trigger(10)
    const triggerSuccess = () => trigger([50, 50, 50])
    const triggerWarning = () => trigger([20, 30, 20, 30, 20])

    useEffect(() => {
        return subscribeWorkoutTimerFinished(() => {
            triggerSuccess()
        })
    }, [])

    return {
        triggerSelection,
        triggerSuccess,
        triggerWarning,
    }
}
