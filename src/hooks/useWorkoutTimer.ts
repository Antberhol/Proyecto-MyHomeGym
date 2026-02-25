import { useEffect, useRef, useState } from 'react'
import { useAudioFeedback } from './useAudioFeedback'

interface UseWorkoutTimerOptions {
    initialSessionSeconds?: number
    initialSessionRunning?: boolean
    initialRestSeconds?: number
}

export function formatClock(totalSeconds: number): string {
    const safe = Math.max(0, totalSeconds)
    const minutes = Math.floor(safe / 60)
    const seconds = safe % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function useWorkoutTimer(options: UseWorkoutTimerOptions = {}) {
    const [sessionSeconds, setSessionSeconds] = useState(options.initialSessionSeconds ?? 0)
    const [sessionRunning, setSessionRunning] = useState(options.initialSessionRunning ?? true)
    const [restSeconds, setRestSeconds] = useState(options.initialRestSeconds ?? 0)
    const previousRestSecondsRef = useRef(restSeconds)
    const { playTimerFinished } = useAudioFeedback()

    useEffect(() => {
        if (!sessionRunning) return

        const intervalId = window.setInterval(() => {
            setSessionSeconds((current) => current + 1)
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [sessionRunning])

    useEffect(() => {
        if (restSeconds <= 0) return

        const intervalId = window.setInterval(() => {
            setRestSeconds((current) => Math.max(0, current - 1))
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [restSeconds])

    useEffect(() => {
        if (previousRestSecondsRef.current > 0 && restSeconds === 0) {
            playTimerFinished()
        }

        previousRestSecondsRef.current = restSeconds
    }, [playTimerFinished, restSeconds])

    const toggleSessionRunning = () => {
        setSessionRunning((current) => !current)
    }

    const startRestTimer = (seconds: number) => {
        setRestSeconds(Math.max(0, seconds))
    }

    const resetTimers = () => {
        setSessionSeconds(0)
        setSessionRunning(true)
        setRestSeconds(0)
    }

    return {
        sessionSeconds,
        setSessionSeconds,
        sessionRunning,
        setSessionRunning,
        toggleSessionRunning,
        restSeconds,
        setRestSeconds,
        startRestTimer,
        resetTimers,
        formatClock,
    }
}
