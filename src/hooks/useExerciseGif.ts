import { useEffect, useMemo, useState } from 'react'

interface ExerciseDbItem {
    gifUrl?: string
    target?: string
}

interface ExerciseGifData {
    gifUrl: string
    targetMuscle: string
}

interface UseExerciseGifResult extends ExerciseGifData {
    isLoading: boolean
}

const exerciseGifCache = new Map<string, ExerciseGifData>()

export const EXERCISE_GIF_PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" role="img" aria-label="Sin gif">' +
        '<rect width="480" height="320" rx="24" fill="#E2E8F0"/>' +
        '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#475569" font-size="24" font-family="Inter,Segoe UI,Arial,sans-serif">Sin GIF disponible</text>' +
        '</svg>',
    )

function normalizeExerciseName(value: string) {
    return value.trim().toLowerCase()
}

export function useExerciseGif(exerciseName: string): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const [state, setState] = useState<UseExerciseGifResult>({
        gifUrl: EXERCISE_GIF_PLACEHOLDER,
        targetMuscle: '',
        isLoading: false,
    })

    useEffect(() => {
        if (!normalizedName) {
            setState({
                gifUrl: EXERCISE_GIF_PLACEHOLDER,
                targetMuscle: '',
                isLoading: false,
            })
            return
        }

        const cached = exerciseGifCache.get(normalizedName)
        if (cached) {
            setState({ ...cached, isLoading: false })
            return
        }

        const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
        if (!apiKey) {
            setState({
                gifUrl: EXERCISE_GIF_PLACEHOLDER,
                targetMuscle: '',
                isLoading: false,
            })
            return
        }

        const controller = new AbortController()
        setState((current) => ({ ...current, isLoading: true }))

        const run = async () => {
            try {
                const response = await fetch(
                    `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(normalizedName)}`,
                    {
                        headers: {
                            'X-RapidAPI-Key': apiKey,
                            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                        },
                        signal: controller.signal,
                    },
                )

                if (!response.ok) {
                    throw new Error('ExerciseDB request failed')
                }

                const payload = (await response.json()) as ExerciseDbItem[]
                const firstResult = payload?.find((item) => item.gifUrl)

                const resolved: ExerciseGifData = {
                    gifUrl: firstResult?.gifUrl || EXERCISE_GIF_PLACEHOLDER,
                    targetMuscle: firstResult?.target || '',
                }

                exerciseGifCache.set(normalizedName, resolved)
                setState({ ...resolved, isLoading: false })
            } catch {
                if (!controller.signal.aborted) {
                    const fallback = {
                        gifUrl: EXERCISE_GIF_PLACEHOLDER,
                        targetMuscle: '',
                    }
                    exerciseGifCache.set(normalizedName, fallback)
                    setState({ ...fallback, isLoading: false })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [normalizedName])

    return state
}
