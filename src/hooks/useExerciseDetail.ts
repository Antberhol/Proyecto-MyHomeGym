import { useEffect, useMemo, useState } from 'react'
import { normalizeExerciseName } from '../constants/exerciseDbAliases'

export interface ExerciseDetailData {
    gifUrl: string
    target: string
    equipment: string
    instructions: string[]
    secondaryMuscles: string[]
}

interface ExerciseDbItem {
    id?: string
    name?: string
    target?: string
    equipment?: string
    instructions?: string[]
    secondaryMuscles?: string[]
}

interface UseExerciseDetailResult {
    data: ExerciseDetailData | null
    isLoading: boolean
    notFound: boolean
}

const detailCache = new Map<string, ExerciseDetailData | null>()

function buildGifUrl(exerciseId: string, apiKey: string): string {
    return `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${encodeURIComponent(exerciseId)}&rapidapi-key=${encodeURIComponent(apiKey)}`
}

function selectBestMatch(items: ExerciseDbItem[], exerciseName: string): ExerciseDbItem | null {
    if (items.length === 0) {
        return null
    }

    const normalizedName = normalizeExerciseName(exerciseName)
    const exact = items.find((item) => normalizeExerciseName(item.name ?? '') === normalizedName)
    if (exact) {
        return exact
    }

    const partial = items.find((item) => {
        const normalizedItem = normalizeExerciseName(item.name ?? '')
        return normalizedItem.includes(normalizedName) || normalizedName.includes(normalizedItem)
    })

    return partial ?? items[0]
}

export function useExerciseDetail(exerciseName: string): UseExerciseDetailResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const cached = normalizedName ? detailCache.get(normalizedName) : undefined
    const shouldFetch = Boolean(normalizedName && apiKey && cached === undefined)
    const [state, setState] = useState<UseExerciseDetailResult>({
        data: null,
        isLoading: false,
        notFound: false,
    })

    useEffect(() => {
        if (!shouldFetch || !apiKey) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            setState({ data: null, isLoading: true, notFound: false })

            try {
                const response = await fetch(
                    `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(normalizedName)}?rapidapi-key=${encodeURIComponent(apiKey)}`,
                    { signal: controller.signal },
                )

                if (!response.ok) {
                    detailCache.set(normalizedName, null)
                    setState({ data: null, isLoading: false, notFound: true })
                    return
                }

                const payload = (await response.json()) as ExerciseDbItem[]
                if (!Array.isArray(payload) || payload.length === 0) {
                    detailCache.set(normalizedName, null)
                    setState({ data: null, isLoading: false, notFound: true })
                    return
                }

                const bestMatch = selectBestMatch(payload, normalizedName)

                if (!bestMatch?.id) {
                    detailCache.set(normalizedName, null)
                    setState({ data: null, isLoading: false, notFound: true })
                    return
                }

                const detailData: ExerciseDetailData = {
                    gifUrl: buildGifUrl(bestMatch.id, apiKey),
                    target: bestMatch.target ?? '',
                    equipment: bestMatch.equipment ?? '',
                    instructions: Array.isArray(bestMatch.instructions) ? bestMatch.instructions : [],
                    secondaryMuscles: Array.isArray(bestMatch.secondaryMuscles) ? bestMatch.secondaryMuscles : [],
                }

                detailCache.set(normalizedName, detailData)
                setState({ data: detailData, isLoading: false, notFound: false })
            } catch {
                if (!controller.signal.aborted) {
                    detailCache.set(normalizedName, null)
                    setState({ data: null, isLoading: false, notFound: true })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [apiKey, normalizedName, shouldFetch])

    if (!normalizedName || !apiKey) {
        return {
            data: null,
            isLoading: false,
            notFound: false,
        }
    }

    if (cached !== undefined) {
        return {
            data: cached,
            isLoading: false,
            notFound: cached === null,
        }
    }

    return state
}
