import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'
import { exerciseStaticImages } from '../constants/exerciseStaticImages'
import { exerciseRepository } from '../repositories/exerciseRepository'

interface ExerciseDbItem {
    id?: string
    exerciseId?: string
    name?: string
    gifUrl?: string
    target?: string
    targetMuscles?: string[]
    equipment?: string
    instructions?: string[]
    secondaryMuscles?: string[]
}

interface ExerciseGifData {
    gifUrl: string
    targetMuscle: string
    instructions?: string[]
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
    grupoMuscularPrimario?: string
    /** When false, returns placeholder immediately without fetching (IntersectionObserver gate). */
    enabled?: boolean
}

const EXERCISE_DB_FREE_API_BASE = 'https://oss.exercisedb.dev/api/v1'
const EXERCISE_GIF_CACHE_KEY_PREFIX = 'gifcache_v2_'
const LEGACY_EXERCISE_GIF_CACHE_KEY_PREFIX = 'gifcache_v1_'
const EXERCISE_GIF_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
let hasRunCacheCleanup = false
let activeRequests = 0
const MAX_CONCURRENT = 3
const waitQueue: Array<() => void> = []

function isLegacyRapidApiGifUrl(url: string): boolean {
    return /https?:\/\/exercisedb\.p\.rapidapi\.com\/image/i.test(url)
}

function resolveExerciseDbItemId(item: ExerciseDbItem | null): string {
    return item?.id?.trim() || item?.exerciseId?.trim() || ''
}

function resolveTargetMuscle(item: ExerciseDbItem | null): string {
    const primaryTarget = item?.target?.trim()
    if (primaryTarget) {
        return primaryTarget
    }

    const targetFromList = item?.targetMuscles?.find((muscle) => typeof muscle === 'string' && muscle.trim())?.trim()
    return targetFromList ?? ''
}

function sanitizeInstructions(input: unknown): string[] {
    if (!Array.isArray(input)) {
        return []
    }

    return input
        .filter((step): step is string => typeof step === 'string')
        .map((step) =>
            step
                .replace(/^\s*step\s*:?\s*\d+\s*/i, '')
                .replace(/^\s*\d+[).:-]?\s*/, '')
                .trim(),
        )
        .filter((step) => step.length > 0)
}

function resolveInstructions(item: ExerciseDbItem | null): string[] {
    return sanitizeInstructions(item?.instructions)
}

interface ExerciseGifCacheEntry extends ExerciseGifData {
    cachedAt: number
}

interface ExerciseDbListResponse {
    success?: boolean
    data?:
    | ExerciseDbItem[]
    | {
        previousPage?: string | null
        nextPage?: string | null
        totalExercises?: number
        exercises?: ExerciseDbItem[]
    }
}

interface ExerciseDbItemResponse {
    success?: boolean
    data?: ExerciseDbItem
}

function getLocalStorageSafe(): Storage | null {
    try {
        return globalThis.localStorage ?? null
    } catch {
        return null
    }
}

async function acquireSlot(): Promise<void> {
    if (activeRequests < MAX_CONCURRENT) {
        activeRequests += 1
        return
    }

    await new Promise<void>((resolve) => waitQueue.push(resolve))
    activeRequests += 1
}

function releaseSlot(): void {
    activeRequests = Math.max(0, activeRequests - 1)
    waitQueue.shift()?.()
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

        if (isLegacyRapidApiGifUrl(parsed.gifUrl)) {
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
            instructions: sanitizeInstructions(parsed.instructions),
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
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    for (const candidate of candidates) {
        await acquireSlot()

        try {
            const response = await fetch(
                `${EXERCISE_DB_FREE_API_BASE}/exercises/search?q=${encodeURIComponent(candidate)}&limit=5`,
                { signal },
            )

            if (!response.ok) {
                continue
            }

            const payload = (await response.json()) as ExerciseDbListResponse
            const items = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.data?.exercises)
                    ? payload.data.exercises
                    : []
            if (items.length === 0) {
                continue
            }

            const best = selectBestMatch(
                items.filter((item) => Boolean(resolveExerciseDbItemId(item) || item.gifUrl)),
                candidate,
            )
            if (best) {
                return best
            }
        } catch {
            if (signal.aborted) {
                return null
            }
        } finally {
            releaseSlot()
        }
    }

    return null
}

async function searchExerciseDbById(
    exerciseDbId: string,
    signal: AbortSignal,
): Promise<ExerciseDbItem | null> {
    await acquireSlot()
    try {
        const response = await fetch(
            `${EXERCISE_DB_FREE_API_BASE}/exercises/${encodeURIComponent(exerciseDbId)}`,
            { signal },
        )

        if (!response.ok) {
            return null
        }

        const payload = (await response.json()) as ExerciseDbItemResponse
        const item = payload?.data
        if (!resolveExerciseDbItemId(item ?? null) && !item?.gifUrl) {
            return null
        }

        return item ?? null
    } catch {
        return null
    } finally {
        releaseSlot()
    }
}

function normalizeGifUrl(url: string): string {
    const normalized = url.trim()
    if (!normalized) {
        return ''
    }

    return normalized.replace(/^http:\/\//i, 'https://')
}

function resolveStaticFallbackGifUrl(primaryMuscle?: string): string {
    if (!primaryMuscle?.trim()) return ''

    // Normalizar quitando tildes y pasando a minúsculas
    const normalizedMuscle = primaryMuscle
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

    // Mapeo exhaustivo de sinónimos al nombre base en inglés de tu objeto exerciseStaticImages
    const muscleMap: Record<string, string> = {
        'pecho': 'chest', 'pectorales': 'chest',
        'espalda': 'back', 'dorsales': 'back', 'lumbares': 'back',
        'hombros': 'shoulders', 'deltoides': 'shoulders',
        'brazos': 'arms', 'biceps': 'arms', 'triceps': 'arms', 'antebrazos': 'arms',
        'piernas': 'legs', 'cuadriceps': 'legs', 'femorales': 'legs', 'gemelos': 'legs', 'pantorrillas': 'legs', 'gluteos': 'legs',
        'core': 'core', 'abdominales': 'core', 'abdomen': 'core'
    }

    const mappedKey = muscleMap[normalizedMuscle] || normalizedMuscle

    // Buscar coincidencia en exerciseStaticImages
    if (exerciseStaticImages[mappedKey]) {
        return exerciseStaticImages[mappedKey]
    }

    // Búsqueda parcial como último recurso
    for (const [key, imageUrl] of Object.entries(exerciseStaticImages)) {
        if (mappedKey.includes(key) || key.includes(mappedKey)) {
            return imageUrl
        }
    }

    return ''
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

function selectBestMatch(items: ExerciseDbItem[], candidate: string): ExerciseDbItem | null {
    if (items.length === 0) return null
    const normalizedCandidate = normalizeExerciseName(candidate)
    const exact = items.find((item) => normalizeExerciseName(item.name ?? '') === normalizedCandidate && item.gifUrl)
    if (exact) return exact
    const partial = items.find((item) => normalizeExerciseName(item.name ?? '').includes(normalizedCandidate) && item.gifUrl)
    if (partial) return partial
    const firstWithGif = items.find((item) => item.gifUrl && resolveExerciseDbItemId(item))
    return firstWithGif || null
}

export function useExerciseGif(exerciseName: string, options?: UseExerciseGifOptions): UseExerciseGifResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const exerciseId = options?.exerciseId
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const primaryMuscle = options?.grupoMuscularPrimario
    const fallbackGifUrl = normalizeGifUrl(options?.fallbackGifUrl ?? '')
    const staticFallbackGifUrl = resolveStaticFallbackGifUrl(primaryMuscle)
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const primaryMuscleSignature = normalizeExerciseName(primaryMuscle ?? '')
    const cacheKey = `${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${fallbackGifUrl}|${primaryMuscleSignature}`
    const cached = useMemo(
        () => (normalizedName ? readExerciseGifCache(cacheKey) : undefined),
        [cacheKey, normalizedName],
    )
    // FIX 5: disabled when element not yet visible (IntersectionObserver gate in ExerciseThumbnail).
    const enabled = options?.enabled !== false
    const shouldFetch = Boolean(normalizedName && !cached && enabled)
    const defaultGifUrl = fallbackGifUrl || staticFallbackGifUrl || EXERCISE_GIF_PLACEHOLDER

    const [state, setState] = useState<UseExerciseGifResult>({
        gifUrl: defaultGifUrl,
        targetMuscle: '',
        resolvedExerciseDbId: undefined,
        resolvedExerciseDbName: undefined,
        isLoading: false,
    })

    // VISUAL 3: Clean up expired localStorage cache entries once per app lifecycle.
    useEffect(() => {
        if (hasRunCacheCleanup) return
        hasRunCacheCleanup = true
        const storage = getLocalStorageSafe()
        if (!storage) return
        const keysToRemove: string[] = []
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i)
            if (!key) {
                continue
            }
            if (!key.startsWith(EXERCISE_GIF_CACHE_KEY_PREFIX) && !key.startsWith(LEGACY_EXERCISE_GIF_CACHE_KEY_PREFIX)) {
                continue
            }
            if (key.startsWith(LEGACY_EXERCISE_GIF_CACHE_KEY_PREFIX)) {
                keysToRemove.push(key)
                continue
            }
            try {
                const raw = storage.getItem(key)
                if (!raw) { keysToRemove.push(key); continue }
                const parsed = JSON.parse(raw) as Partial<ExerciseGifCacheEntry>
                if (
                    typeof parsed.cachedAt !== 'number' ||
                    Date.now() - parsed.cachedAt > EXERCISE_GIF_CACHE_TTL_MS ||
                    (typeof parsed.gifUrl === 'string' && isLegacyRapidApiGifUrl(parsed.gifUrl))
                ) {
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
                gifUrl: defaultGifUrl,
                targetMuscle: '',
                resolvedExerciseDbId: undefined,
                resolvedExerciseDbName: undefined,
                isLoading: true,
            })

            try {
                const byId = exerciseDbId?.trim()
                    ? await searchExerciseDbById(exerciseDbId, controller.signal)
                    : null

                const candidates = buildQueryCandidates(exerciseName, {
                    exerciseDbId,
                    exerciseDbName,
                    exerciseDbAliases,
                })
                let firstResult = byId

                if (!firstResult) {
                    firstResult = await searchExerciseDbByCandidates(candidates, controller.signal)
                }

                const resolvedExerciseDbId = resolveExerciseDbItemId(firstResult)
                const resolvedByCandidate = !byId && Boolean(resolvedExerciseDbId)

                const resolved: ExerciseGifData = {
                    gifUrl:
                        resolveExerciseGifUrl(firstResult) ||
                        fallbackGifUrl ||
                        staticFallbackGifUrl ||
                        EXERCISE_GIF_PLACEHOLDER,
                    targetMuscle: resolveTargetMuscle(firstResult),
                    instructions: resolveInstructions(firstResult),
                    resolvedExerciseDbId: resolvedExerciseDbId || undefined,
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
                    const resolvedFallbackGifUrl = fallbackGifUrl || staticFallbackGifUrl || EXERCISE_GIF_PLACEHOLDER

                    const fallback = {
                        gifUrl: resolvedFallbackGifUrl,
                        targetMuscle: '',
                        instructions: [],
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
        cacheKey,
        defaultGifUrl,
        exerciseId,
        exerciseDbAliases,
        exerciseDbId,
        exerciseDbName,
        exerciseName,
        fallbackGifUrl,
        normalizedName,
        staticFallbackGifUrl,
        shouldFetch,
    ])

    if (!normalizedName || !enabled) {
        return {
            gifUrl: defaultGifUrl,
            targetMuscle: '',
            instructions: [],
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
