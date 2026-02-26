import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'

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

interface UseExerciseDetailOptions {
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
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

function buildQueryCandidates(exerciseName: string, options?: UseExerciseDetailOptions): string[] {
    const candidates = new Set<string>()

    if (options?.exerciseDbName?.trim()) {
        candidates.add(normalizeExerciseName(options.exerciseDbName))
    }

    for (const alias of options?.exerciseDbAliases ?? []) {
        if (alias.trim()) {
            candidates.add(normalizeExerciseName(alias))
        }
    }

    for (const candidate of getExerciseDbQueryCandidates(exerciseName)) {
        candidates.add(candidate)
    }

    return Array.from(candidates)
}

async function searchExerciseByCandidates(
    candidates: string[],
    apiKey: string,
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    for (const candidate of candidates) {
        const response = await fetch(
            `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(candidate)}?rapidapi-key=${encodeURIComponent(apiKey)}`,
            { signal },
        )

        if (!response.ok) {
            continue
        }

        const payload = (await response.json()) as ExerciseDbItem[]
        if (!Array.isArray(payload) || payload.length === 0) {
            continue
        }

        const best = selectBestMatch(payload, candidate)
        if (best?.id) {
            return best
        }
    }

    return null
}

async function searchExerciseById(exerciseDbId: string, apiKey: string, signal: AbortSignal): Promise<ExerciseDbItem | null> {
    const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/exercise/${encodeURIComponent(exerciseDbId)}?rapidapi-key=${encodeURIComponent(apiKey)}`,
        { signal },
    )

    if (!response.ok) {
        return null
    }

    const payload = (await response.json()) as ExerciseDbItem
    if (!payload?.id) {
        return null
    }

    return payload
}

export function useExerciseDetail(exerciseName: string, options?: UseExerciseDetailOptions): UseExerciseDetailResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}`
    const cached = normalizedName ? detailCache.get(cacheKey) : undefined
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
                const byId = exerciseDbId?.trim()
                    ? await searchExerciseById(exerciseDbId, apiKey, controller.signal)
                    : null
                const candidates = buildQueryCandidates(exerciseName, {
                    exerciseDbId,
                    exerciseDbName,
                    exerciseDbAliases,
                })
                const bestMatch = byId ?? (await searchExerciseByCandidates(candidates, apiKey, controller.signal))

                if (!bestMatch?.id) {
                    detailCache.set(cacheKey, null)
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

                detailCache.set(cacheKey, detailData)
                setState({ data: detailData, isLoading: false, notFound: false })
            } catch {
                if (!controller.signal.aborted) {
                    detailCache.set(cacheKey, null)
                    setState({ data: null, isLoading: false, notFound: true })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [aliasSignature, apiKey, cacheKey, exerciseDbAliases, exerciseDbId, exerciseDbName, exerciseName, normalizedName, shouldFetch])

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
