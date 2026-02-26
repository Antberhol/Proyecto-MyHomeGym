import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'

interface ExerciseDbItem {
    name?: string
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

async function searchExerciseDbByCandidates(
    candidates: string[],
    apiKey: string,
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    for (const candidate of candidates) {
        const response = await fetch(
            `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(candidate)}`,
            {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                },
                signal,
            },
        )

        if (!response.ok) {
            continue
        }

        const payload = (await response.json()) as ExerciseDbItem[]
        if (!Array.isArray(payload) || payload.length === 0) {
            continue
        }

        const normalizedCandidate = normalizeExerciseName(candidate)
        const exact = payload.find(
            (item) => item.gifUrl && normalizeExerciseName(item.name ?? '') === normalizedCandidate,
        )
        if (exact) {
            return exact
        }

        const partial = payload.find(
            (item) =>
                item.gifUrl &&
                (normalizeExerciseName(item.name ?? '').includes(normalizedCandidate) ||
                    normalizedCandidate.includes(normalizeExerciseName(item.name ?? ''))),
        )
        if (partial) {
            return partial
        }

        const firstWithGif = payload.find((item) => item.gifUrl)
        if (firstWithGif) {
            return firstWithGif
        }
    }

    return null
}

export function useExerciseGif(exerciseName: string): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const cached = normalizedName ? exerciseGifCache.get(normalizedName) : undefined
    const shouldFetch = Boolean(normalizedName && apiKey && !cached)

    const [state, setState] = useState<UseExerciseGifResult>({
        gifUrl: EXERCISE_GIF_PLACEHOLDER,
        targetMuscle: '',
        isLoading: false,
    })

    useEffect(() => {
        if (!shouldFetch || !apiKey) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            setState({
                gifUrl: EXERCISE_GIF_PLACEHOLDER,
                targetMuscle: '',
                isLoading: true,
            })

            try {
                const candidates = getExerciseDbQueryCandidates(exerciseName)
                const firstResult = await searchExerciseDbByCandidates(candidates, apiKey, controller.signal)

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
    }, [apiKey, exerciseName, normalizedName, shouldFetch])

    if (!normalizedName || !apiKey) {
        return {
            gifUrl: EXERCISE_GIF_PLACEHOLDER,
            targetMuscle: '',
            isLoading: false,
        }
    }

    if (cached) {
        return {
            ...cached,
            isLoading: false,
        }
    }

    return state
}
