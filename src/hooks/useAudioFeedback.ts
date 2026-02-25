import { useCallback, useMemo, useRef } from 'react'

interface AudioFeedbackOptions {
    timerFinishedMessage?: string
}

export function useAudioFeedback(options: AudioFeedbackOptions = {}) {
    const audioContextRef = useRef<AudioContext | null>(null)
    const timerFinishedMessage = useMemo(
        () => options.timerFinishedMessage ?? 'Descanso terminado, ¡a darle!',
        [options.timerFinishedMessage],
    )

    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null

        if (!audioContextRef.current) {
            const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
            if (!Ctx) return null
            audioContextRef.current = new Ctx()
        }

        return audioContextRef.current
    }, [])

    const playTimerFinished = useCallback((message?: string) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

        const utterance = new SpeechSynthesisUtterance(message ?? timerFinishedMessage)
        utterance.lang = 'es-ES'
        utterance.rate = 1
        utterance.pitch = 1
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
    }, [timerFinishedMessage])

    const playButtonPress = useCallback(() => {
        const audioContext = getAudioContext()
        if (!audioContext) return

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = 'square'
        oscillator.frequency.value = 420

        gainNode.gain.value = 0.0001
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.005)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08)

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.09)
    }, [getAudioContext])

    return {
        playTimerFinished,
        playButtonPress,
    }
}
