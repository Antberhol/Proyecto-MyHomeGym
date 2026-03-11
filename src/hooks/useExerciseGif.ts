import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'
import { exerciseRepository } from '../repositories/exerciseRepository'

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
    exerciseId?: string
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
    fallbackGifUrl?: string
    /** When false, returns placeholder immediately without fetching (IntersectionObserver gate). */
    enabled?: boolean
}

let hasWarnedMissingExerciseDbKey = false
const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'
const EXERCISE_GIF_CACHE_KEY_PREFIX = 'gifcache_v1_'
const EXERCISE_GIF_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
let hasRunCacheCleanup = false

interface ExerciseGifCacheEntry extends ExerciseGifData {
    cachedAt: number
}

function getLocalStorageSafe(): Storage | null {
    try {
        return globalThis.localStorage ?? null
    } catch {
        return null
    }
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

function buildGifCacheStorageKey(cacheKey: string): string {
    return `${EXERCISE_GIF_CACHE_KEY_PREFIX}${cacheKey}`
}

function readExerciseGifCache(cacheKey: string): ExerciseGifData | undefined {
    const storage = getLocalStorageSafe()
    if (!storage) {
        return undefined
    }

    const storageKey = buildGifCacheStorageKey(cacheKey)

    try {
        const rawValue = storage.getItem(storageKey)
        if (!rawValue) {
            return undefined
        }

        const parsed = JSON.parse(rawValue) as Partial<ExerciseGifCacheEntry>
        if (!parsed || typeof parsed !== 'object') {
            storage.removeItem(storageKey)
            return undefined
        }

        if (typeof parsed.cachedAt !== 'number' || Date.now() - parsed.cachedAt > EXERCISE_GIF_CACHE_TTL_MS) {
            storage.removeItem(storageKey)
            return undefined
        }

        if (typeof parsed.gifUrl !== 'string' || typeof parsed.targetMuscle !== 'string') {
            storage.removeItem(storageKey)
            return undefined
        }

        if (!parsed.gifUrl || parsed.gifUrl === EXERCISE_GIF_PLACEHOLDER) {
            storage.removeItem(storageKey)
            return undefined
        }

        return {
            gifUrl: parsed.gifUrl,
            targetMuscle: parsed.targetMuscle,
            resolvedExerciseDbId: typeof parsed.resolvedExerciseDbId === 'string' ? parsed.resolvedExerciseDbId : undefined,
            resolvedExerciseDbName: typeof parsed.resolvedExerciseDbName === 'string' ? parsed.resolvedExerciseDbName : undefined,
        }
    } catch {
        storage.removeItem(storageKey)
        return undefined
    }
}

function writeExerciseGifCache(cacheKey: string, value: ExerciseGifData): void {
    if (!value.gifUrl || value.gifUrl === EXERCISE_GIF_PLACEHOLDER) {
        return
    }

    const storage = getLocalStorageSafe()
    if (!storage) {
        return
    }

    const storageKey = buildGifCacheStorageKey(cacheKey)
    const payload: ExerciseGifCacheEntry = {
        ...value,
        cachedAt: Date.now(),
    }

    try {
        storage.setItem(storageKey, JSON.stringify(payload))
    } catch {
        // Ignore quota and serialization errors to keep GIF resolution resilient.
    }
}

// FIX 4: Persist whenever we have a new/better exerciseDbId — no resolvedByCandidate gate.
async function persistResolvedExerciseDbLink(input: {
    exerciseId?: string
    currentExerciseDbId?: string
    currentExerciseDbName?: string
    resolvedExerciseDbId?: string
    resolvedExerciseDbName?: string
    resolvedByCandidate: boolean
}): Promise<void> {
    const exerciseId = input.exerciseId?.trim()
    if (!exerciseId) {
        return
    }

    const resolvedExerciseDbId = input.resolvedExerciseDbId?.trim()
    if (!resolvedExerciseDbId) {
        return
    }

    // Only persist when the resolved ID differs from what is currently stored.
    if (resolvedExerciseDbId === input.currentExerciseDbId?.trim()) {
        return
    }

    const resolvedExerciseDbName = input.resolvedExerciseDbName?.trim()
    if (!resolvedExerciseDbName) {
        return
    }

    try {
        await exerciseRepository.updateExercise(exerciseId, {
            exerciseDbId: resolvedExerciseDbId,
            exerciseDbName: resolvedExerciseDbName,
        })
    } catch {
        // Ignore persistence failures so GIF rendering is not blocked.
    }
}

export const EXERCISE_GIF_PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" role="img" aria-label="Exercise image">' +
        '<rect width="480" height="320" rx="24" fill="#E2E8F0"/>' +
        '<rect x="160" y="120" width="160" height="110" rx="14" fill="#94A3B8"/>' +
        '<circle cx="240" cy="175" r="34" fill="#CBD5E1"/>' +
        '<circle cx="240" cy="175" r="22" fill="#94A3B8"/>' +
        '<rect x="197" y="105" width="46" height="22" rx="7" fill="#94A3B8"/>' +
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

function normalizeGifUrl(url: string): string {
    const normalized = url.trim()
    if (!normalized) {
        return ''
    }

    return normalized.replace(/^http:\/\//i, 'https://')
}

// FIX 1: Use the CDN gifUrl from the API response directly — no key-in-URL.
function resolveExerciseGifUrl(item: ExerciseDbItem | null): string {
    if (!item?.gifUrl) {
        return ''
    }
    return normalizeGifUrl(item.gifUrl)
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

    if (strongTokenMatch) {
        return strongTokenMatch
    }

    // FIX 3: Loose fallback — single-result list with valid data.
    if (items.length === 1 && items[0].gifUrl && items[0].id) {
        return items[0]
    }

    return null
}

export function useExerciseGif(exerciseName: string, options?: UseExerciseGifOptions): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const exerciseId = options?.exerciseId
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const fallbackGifUrl = normalizeGifUrl(options?.fallbackGifUrl ?? '')
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${fallbackGifUrl}`
    const cached = useMemo(
        () => (normalizedName ? readExerciseGifCache(cacheKey) : undefined),
        [cacheKey, normalizedName],
    )
    // FIX 5: disabled when element not yet visible (IntersectionObserver gate in ExerciseThumbnail).
    const enabled = options?.enabled !== false
    const shouldFetch = Boolean(normalizedName && !cached && enabled)

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

    // VISUAL 3: Clean up expired localStorage cache entries once per app lifecycle.
    useEffect(() => {
        if (hasRunCacheCleanup) return
        hasRunCacheCleanup = true
        const storage = getLocalStorageSafe()
        if (!storage) return
        const keysToRemove: string[] = []
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i)
            if (!key?.startsWith(EXERCISE_GIF_CACHE_KEY_PREFIX)) continue
            try {
                const raw = storage.getItem(key)
                if (!raw) { keysToRemove.push(key); continue }
                const parsed = JSON.parse(raw) as Partial<ExerciseGifCacheEntry>
                if (typeof parsed.cachedAt !== 'number' || Date.now() - parsed.cachedAt > EXERCISE_GIF_CACHE_TTL_MS) {
                    keysToRemove.push(key)
                }
            } catch {
                keysToRemove.push(key)
            }
        }
        for (const key of keysToRemove) {
            storage.removeItem(key)
        }
    }, [])

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

                const resolvedByCandidate = !byId && Boolean(firstResult?.id)

                const resolved: ExerciseGifData = {
                    gifUrl:
                        resolveExerciseGifUrl(firstResult) ||
                        fallbackGifUrl ||
                        EXERCISE_GIF_PLACEHOLDER,
                    targetMuscle: firstResult?.target || '',
                    resolvedExerciseDbId: firstResult?.id,
                    resolvedExerciseDbName: firstResult?.name,
                }

                await persistResolvedExerciseDbLink({
                    exerciseId,
                    currentExerciseDbId: exerciseDbId,
                    currentExerciseDbName: exerciseDbName,
                    resolvedExerciseDbId: resolved.resolvedExerciseDbId,
                    resolvedExerciseDbName: resolved.resolvedExerciseDbName,
                    resolvedByCandidate,
                })

                writeExerciseGifCache(cacheKey, resolved)
                setState({ ...resolved, isLoading: false })
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.warn('[GIF]', error)
                    const resolvedFallbackGifUrl = options?.fallbackGifUrl
                        ? normalizeGifUrl(options.fallbackGifUrl)
                        : EXERCISE_GIF_PLACEHOLDER

                    const fallback = {
                        gifUrl: resolvedFallbackGifUrl,
                        targetMuscle: '',
                        resolvedExerciseDbId: undefined,
                        resolvedExerciseDbName: undefined,
                    }
                    writeExerciseGifCache(cacheKey, fallback)
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
        exerciseId,
        exerciseDbAliases,
        exerciseDbId,
        exerciseDbName,
        exerciseName,
        fallbackGifUrl,
        normalizedName,
        options?.fallbackGifUrl,
        shouldFetch,
    ])

    if (!normalizedName || !enabled) {
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
