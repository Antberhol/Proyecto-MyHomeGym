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
    fallbackGifUrl?: string
}

const exerciseGifCache = new Map<string, ExerciseGifData>()
let hasWarnedMissingExerciseDbKey = false
const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'
const EXERCISE_DB_PUBLIC_API_BASE = 'https://exercisedb-api.vercel.app/api/v1'

interface ExerciseDbPublicItem {
    name?: string
    gifUrl?: string
    targetMuscles?: string[]
}

interface ExerciseDbPublicResponse {
    data?: ExerciseDbPublicItem[]
}

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

        const best = selectBestMatch(
            payload.filter((item) => item.id || item.gifUrl),
            candidate,
        )
        if (best) {
            return best
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

async function searchPublicExerciseDbByCandidates(
    candidates: string[],
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    for (const candidate of candidates) {
        const response = await fetch(
            `${EXERCISE_DB_PUBLIC_API_BASE}/exercises?search=${encodeURIComponent(candidate)}&limit=24`,
            { signal },
        )

        if (!response.ok) {
            continue
        }

        const payload = (await response.json()) as ExerciseDbPublicResponse
        const items = Array.isArray(payload.data) ? payload.data : []
        if (items.length === 0) {
            continue
        }

        const mapped = items
            .filter((item) => item.gifUrl)
            .map<ExerciseDbItem>((item) => ({
                name: item.name,
                gifUrl: normalizeGifUrl(item.gifUrl ?? ''),
                target: item.targetMuscles?.[0] ?? '',
            }))

        const best = selectBestMatch(mapped, candidate)
        if (best) {
            return {
                name: best.name,
                gifUrl: best.gifUrl,
                target: best.target,
            }
        }
    }

    return null
}

function buildExerciseGifUrl(exerciseId: string, apiKey: string): string {
    return `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${encodeURIComponent(exerciseId)}&rapidapi-key=${encodeURIComponent(apiKey)}`
}

function normalizeGifUrl(url: string): string {
    const normalized = url.trim()
    if (!normalized) {
        return ''
    }

    return normalized.replace(/^http:\/\//i, 'https://')
}

function resolveExerciseGifUrl(item: ExerciseDbItem | null, apiKey?: string, fallbackExerciseDbId?: string): string {
    if (!item) {
        if (fallbackExerciseDbId?.trim() && apiKey) {
            return buildExerciseGifUrl(fallbackExerciseDbId, apiKey)
        }

        return EXERCISE_GIF_PLACEHOLDER
    }

    if (item.id && apiKey) {
        return buildExerciseGifUrl(item.id, apiKey)
    }

    if (item.gifUrl) {
        return normalizeGifUrl(item.gifUrl)
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

function tokenizeForMatch(value: string): string[] {
    return normalizeExerciseName(value)
        .split(' ')
        .filter((token) => token.length > 2)
}

function selectBestMatch(items: ExerciseDbItem[], candidate: string): ExerciseDbItem | null {
    if (items.length === 0) {
        return null
    }

    const normalizedCandidate = normalizeExerciseName(candidate)
    const exact = items.find((item) => normalizeExerciseName(item.name ?? '') === normalizedCandidate)
    if (exact) {
        return exact
    }

    const candidateTokens = tokenizeForMatch(candidate)
    if (candidateTokens.length === 0) {
        return null
    }

    const strongTokenMatch = items.find((item) => {
        const nameTokens = new Set(tokenizeForMatch(item.name ?? ''))
        if (nameTokens.size === 0) {
            return false
        }

        return candidateTokens.every((token) => nameTokens.has(token))
    })

    return strongTokenMatch ?? null
}

export function useExerciseGif(exerciseName: string, options?: UseExerciseGifOptions): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const fallbackGifUrl = normalizeGifUrl(options?.fallbackGifUrl ?? '')
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${fallbackGifUrl}`
    const cached = normalizedName ? exerciseGifCache.get(cacheKey) : undefined
    const shouldFetch = Boolean(normalizedName && !cached)

    const [state, setState] = useState<UseExerciseGifResult>({
        gifUrl: fallbackGifUrl || EXERCISE_GIF_PLACEHOLDER,
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
        if (!shouldFetch) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            setState({
                gifUrl: fallbackGifUrl || EXERCISE_GIF_PLACEHOLDER,
                targetMuscle: '',
                resolvedExerciseDbId: undefined,
                resolvedExerciseDbName: undefined,
                isLoading: true,
            })

            try {
                const byId = apiKey && exerciseDbId?.trim()
                    ? await searchExerciseDbById(exerciseDbId, apiKey, controller.signal)
                    : null

                const candidates = buildQueryCandidates(exerciseName, {
                    exerciseDbId,
                    exerciseDbName,
                    exerciseDbAliases,
                })
                let firstResult = byId

                if (!firstResult && apiKey) {
                    firstResult = await searchExerciseDbByCandidates(candidates, apiKey, controller.signal)
                }

                if (!firstResult) {
                    firstResult = await searchPublicExerciseDbByCandidates(candidates, controller.signal)
                }

                const resolved: ExerciseGifData = {
                    gifUrl:
                        resolveExerciseGifUrl(firstResult, apiKey, exerciseDbId) ||
                        fallbackGifUrl ||
                        EXERCISE_GIF_PLACEHOLDER,
                    targetMuscle: firstResult?.target || '',
                    resolvedExerciseDbId: firstResult?.id,
                    resolvedExerciseDbName: firstResult?.name,
                }

                exerciseGifCache.set(cacheKey, resolved)
                setState({ ...resolved, isLoading: false })
            } catch {
                if (!controller.signal.aborted) {
                    const fallbackGifUrl = apiKey && exerciseDbId?.trim()
                        ? buildExerciseGifUrl(exerciseDbId, apiKey)
                        : (options?.fallbackGifUrl ? normalizeGifUrl(options.fallbackGifUrl) : EXERCISE_GIF_PLACEHOLDER)

                    const fallback = {
                        gifUrl: fallbackGifUrl,
                        targetMuscle: '',
                        resolvedExerciseDbId: undefined,
                        resolvedExerciseDbName: undefined,
                    }
                    exerciseGifCache.set(cacheKey, fallback)
                    setState({ ...fallback, isLoading: false })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [
        aliasSignature,
        apiKey,
        cacheKey,
        exerciseDbAliases,
        exerciseDbId,
        exerciseDbName,
        exerciseName,
        fallbackGifUrl,
        normalizedName,
        options?.fallbackGifUrl,
        shouldFetch,
    ])

    if (!normalizedName) {
        return {
            gifUrl: fallbackGifUrl || EXERCISE_GIF_PLACEHOLDER,
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
