import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'

interface ExerciseDbItem {
    id?: string
    name?: string
    gifUrl?: string
    target?: string
}

interface ExerciseGifData {
    gifUrl: string
    targetMuscle: string
    resolvedExerciseDbId?: string
    resolvedExerciseDbName?: string
}

interface UseExerciseGifResult extends ExerciseGifData {
    isLoading: boolean
}

interface UseExerciseGifOptions {
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
}

const exerciseGifCache = new Map<string, ExerciseGifData>()
let hasWarnedMissingExerciseDbKey = false
const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'

function buildExerciseDbRequestInit(apiKey: string, signal?: AbortSignal): RequestInit {
    return {
        signal,
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': EXERCISE_DB_RAPIDAPI_HOST,
        },
    }
}

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
            `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(candidate)}`,
            buildExerciseDbRequestInit(apiKey, signal),
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
            (item) => (item.id || item.gifUrl) && normalizeExerciseName(item.name ?? '') === normalizedCandidate,
        )
        if (exact) {
            return exact
        }

        const partial = payload.find(
            (item) =>
                (item.id || item.gifUrl) &&
                (normalizeExerciseName(item.name ?? '').includes(normalizedCandidate) ||
                    normalizedCandidate.includes(normalizeExerciseName(item.name ?? ''))),
        )
        if (partial) {
            return partial
        }

        const firstWithMediaReference = payload.find((item) => item.id || item.gifUrl)
        if (firstWithMediaReference) {
            return firstWithMediaReference
        }
    }

    return null
}

async function searchExerciseDbById(
    exerciseDbId: string,
    apiKey: string,
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    const response = await fetch(
        `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/exercise/${encodeURIComponent(exerciseDbId)}`,
        buildExerciseDbRequestInit(apiKey, signal),
    )

    if (!response.ok) {
        return null
    }

    const payload = (await response.json()) as ExerciseDbItem
    if (!payload?.id && !payload?.gifUrl) {
        return null
    }

    return payload
}

function buildExerciseGifUrl(exerciseId: string, apiKey: string): string {
    return `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${encodeURIComponent(exerciseId)}&rapidapi-key=${encodeURIComponent(apiKey)}`
}

function resolveExerciseGifUrl(item: ExerciseDbItem | null, apiKey: string, fallbackExerciseDbId?: string): string {
    if (!item) {
        if (fallbackExerciseDbId?.trim()) {
            return buildExerciseGifUrl(fallbackExerciseDbId, apiKey)
        }

        return EXERCISE_GIF_PLACEHOLDER
    }

    if (item.gifUrl) {
        return item.gifUrl
    }

    if (item.id) {
        return buildExerciseGifUrl(item.id, apiKey)
    }

    return EXERCISE_GIF_PLACEHOLDER
}

function buildQueryCandidates(exerciseName: string, options?: UseExerciseGifOptions) {
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

export function useExerciseGif(exerciseName: string, options?: UseExerciseGifOptions): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const cached = normalizedName ? exerciseGifCache.get(normalizedName) : undefined
    const shouldFetch = Boolean(normalizedName && apiKey && !cached)
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const aliasSignature = (exerciseDbAliases ?? []).join('|')

    const [state, setState] = useState<UseExerciseGifResult>({
        gifUrl: EXERCISE_GIF_PLACEHOLDER,
        targetMuscle: '',
        resolvedExerciseDbId: undefined,
        resolvedExerciseDbName: undefined,
        isLoading: false,
    })

    useEffect(() => {
        if (!apiKey && !hasWarnedMissingExerciseDbKey) {
            hasWarnedMissingExerciseDbKey = true
            console.warn('VITE_EXERCISEDB_API_KEY is missing. Exercise GIFs will use placeholder images.')
        }
    }, [apiKey])

    useEffect(() => {
        if (!shouldFetch || !apiKey) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            setState({
                gifUrl: EXERCISE_GIF_PLACEHOLDER,
                targetMuscle: '',
                resolvedExerciseDbId: undefined,
                resolvedExerciseDbName: undefined,
                isLoading: true,
            })

            try {
                const byId = exerciseDbId?.trim()
                    ? await searchExerciseDbById(exerciseDbId, apiKey, controller.signal)
                    : null

                const candidates = buildQueryCandidates(exerciseName, {
                    exerciseDbId,
                    exerciseDbName,
                    exerciseDbAliases,
                })
                const firstResult = byId ?? (await searchExerciseDbByCandidates(candidates, apiKey, controller.signal))

                const resolved: ExerciseGifData = {
                    gifUrl: resolveExerciseGifUrl(firstResult, apiKey, exerciseDbId),
                    targetMuscle: firstResult?.target || '',
                    resolvedExerciseDbId: firstResult?.id,
                    resolvedExerciseDbName: firstResult?.name,
                }

                exerciseGifCache.set(normalizedName, resolved)
                setState({ ...resolved, isLoading: false })
            } catch {
                if (!controller.signal.aborted) {
                    const fallbackGifUrl = exerciseDbId?.trim()
                        ? buildExerciseGifUrl(exerciseDbId, apiKey)
                        : EXERCISE_GIF_PLACEHOLDER

                    const fallback = {
                        gifUrl: fallbackGifUrl,
                        targetMuscle: '',
                        resolvedExerciseDbId: undefined,
                        resolvedExerciseDbName: undefined,
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
    }, [aliasSignature, apiKey, exerciseDbAliases, exerciseDbId, exerciseDbName, exerciseName, normalizedName, shouldFetch])

    if (!normalizedName || !apiKey) {
        return {
            gifUrl: EXERCISE_GIF_PLACEHOLDER,
            targetMuscle: '',
            resolvedExerciseDbId: undefined,
            resolvedExerciseDbName: undefined,
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
