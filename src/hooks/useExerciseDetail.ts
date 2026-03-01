import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'
import i18n from '../i18n'

export interface ExerciseDetailData {
    gifUrl: string
    target: string
    equipment: string
    instructions: string[]
    secondaryMuscles: string[]
}

export interface ExerciseDetailDebugInfo {
    source: 'id' | 'candidate' | 'cache' | 'none'
    resolvedExerciseDbId?: string
    resolvedExerciseDbName?: string
    usedCandidate?: string
    candidatesTried: string[]
    gifValidated: boolean
    lastError?: string
}

interface ExerciseDbItem {
    id?: string
    name?: string
    gifUrl?: string
    target?: string
    equipment?: string
    instructions?: string[]
    secondaryMuscles?: string[]
}

interface UseExerciseDetailResult {
    data: ExerciseDetailData | null
    isLoading: boolean
    isTranslatingInstructions: boolean
    notFound: boolean
    debug: ExerciseDetailDebugInfo
}

interface UseExerciseDetailOptions {
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
}

interface CachedDetailEntry {
    data: ExerciseDetailData | null
    notFound: boolean
    debug: ExerciseDetailDebugInfo
}

const detailCache = new Map<string, CachedDetailEntry>()
const gifUrlCache = new Map<string, string>()
const translatedInstructionCache = new Map<string, string>()
const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'
const EXERCISE_DB_PUBLIC_API_BASE = 'https://exercisedb-api.vercel.app/api/v1'

interface ExerciseDbPublicItem {
    name?: string
    gifUrl?: string
    targetMuscles?: string[]
    equipments?: string[]
    instructions?: string[]
    secondaryMuscles?: string[]
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

async function translateInstructionToSpanish(text: string, signal: AbortSignal): Promise<string> {
    const normalizedText = text.trim()
    if (!normalizedText) {
        return text
    }

    const cacheKey = `es|${normalizedText}`
    const cached = translatedInstructionCache.get(cacheKey)
    if (cached) {
        return cached
    }

    const timeoutController = new AbortController()
    const abortTimeout = window.setTimeout(() => timeoutController.abort(), 5000)
    const relayAbort = () => timeoutController.abort()
    signal.addEventListener('abort', relayAbort, { once: true })

    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: normalizedText,
                source: 'en',
                target: 'es',
                format: 'text',
            }),
            signal: timeoutController.signal,
        })

        if (!response.ok) {
            return text
        }

        const payload = (await response.json()) as { translatedText?: string }
        const translated = payload.translatedText?.trim()
        if (!translated) {
            return text
        }

        translatedInstructionCache.set(cacheKey, translated)
        return translated
    } catch {
        return text
    } finally {
        clearTimeout(abortTimeout)
        signal.removeEventListener('abort', relayAbort)
    }
}

async function maybeTranslateInstructions(
    instructions: string[],
    language: 'es' | 'en',
    signal: AbortSignal,
): Promise<string[]> {
    if (language !== 'es' || instructions.length === 0) {
        return instructions
    }

    const translated = await Promise.all(
        instructions.map((instruction) => translateInstructionToSpanish(instruction, signal)),
    )

    return translated
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

function resolveExerciseGifUrl(item: ExerciseDbItem, apiKey?: string): string {
    if (item.id && apiKey) {
        const cached = gifUrlCache.get(item.id)
        if (cached) {
            return cached
        }

        const resolved = buildExerciseGifUrl(item.id, apiKey)
        gifUrlCache.set(item.id, resolved)
        return resolved
    }

    if (item.gifUrl?.trim()) {
        return normalizeGifUrl(item.gifUrl)
    }

    return ''
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

    const candidateTokens = tokenizeForMatch(exerciseName)
    if (candidateTokens.length === 0) {
        return null
    }

    const strongTokenMatch = items.find((item) => {
        const itemTokens = new Set(tokenizeForMatch(item.name ?? ''))
        if (itemTokens.size === 0) {
            return false
        }

        return candidateTokens.every((token) => itemTokens.has(token))
    })

    return strongTokenMatch ?? null
}

function tokenizeForMatch(value: string): string[] {
    return normalizeExerciseName(value)
        .split(' ')
        .filter((token) => token.length > 2)
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
): Promise<{ item: ExerciseDbItem; usedCandidate: string } | null> {
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

        const best = selectBestMatch(payload, candidate)
        if (best?.id) {
            return { item: best, usedCandidate: candidate }
        }
    }

    return null
}

async function searchExerciseById(exerciseDbId: string, apiKey: string, signal: AbortSignal): Promise<ExerciseDbItem | null> {
    const response = await fetch(
        `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/exercise/${encodeURIComponent(exerciseDbId)}`,
        buildExerciseDbRequestInit(apiKey, signal),
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

async function searchPublicExerciseByCandidates(
    candidates: string[],
    signal: AbortSignal,
): Promise<{ item: ExerciseDbItem; usedCandidate: string } | null> {
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

        const mapped = items.map<ExerciseDbItem>((item) => ({
            name: item.name,
            gifUrl: item.gifUrl,
            target: item.targetMuscles?.[0] ?? '',
            equipment: item.equipments?.[0] ?? '',
            instructions: Array.isArray(item.instructions) ? item.instructions : [],
            secondaryMuscles: Array.isArray(item.secondaryMuscles) ? item.secondaryMuscles : [],
        }))

        const best = selectBestMatch(mapped, candidate)
        if (best?.gifUrl) {
            return { item: best, usedCandidate: candidate }
        }
    }

    return null
}

export function useExerciseDetail(exerciseName: string, options?: UseExerciseDetailOptions): UseExerciseDetailResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const currentLanguage = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en'
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${currentLanguage}`
    const cached = normalizedName ? detailCache.get(cacheKey) : undefined
    const shouldFetch = Boolean(normalizedName && cached === undefined)
    const [state, setState] = useState<UseExerciseDetailResult>({
        data: null,
        isLoading: false,
        isTranslatingInstructions: false,
        notFound: false,
        debug: {
            source: 'none',
            candidatesTried: [],
            gifValidated: false,
        },
    })

    useEffect(() => {
        if (!shouldFetch) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            const candidates = buildQueryCandidates(exerciseName, {
                exerciseDbId,
                exerciseDbName,
                exerciseDbAliases,
            })

            setState({
                data: null,
                isLoading: true,
                isTranslatingInstructions: false,
                notFound: false,
                debug: {
                    source: 'none',
                    candidatesTried: candidates,
                    gifValidated: false,
                },
            })

            try {
                const byId = apiKey && exerciseDbId?.trim()
                    ? await searchExerciseById(exerciseDbId, apiKey, controller.signal)
                    : null
                let byCandidate: { item: ExerciseDbItem; usedCandidate: string } | null = null

                if (!byId && apiKey) {
                    byCandidate = await searchExerciseByCandidates(candidates, apiKey, controller.signal)
                }

                if (!byId && !byCandidate) {
                    byCandidate = await searchPublicExerciseByCandidates(candidates, controller.signal)
                }
                const bestMatch = byId ?? byCandidate?.item ?? null

                if (!bestMatch) {
                    if (apiKey && exerciseDbId?.trim()) {
                        const fallbackData: ExerciseDetailData = {
                            gifUrl: buildExerciseGifUrl(exerciseDbId, apiKey),
                            target: '',
                            equipment: '',
                            instructions: [],
                            secondaryMuscles: [],
                        }

                        const fallbackEntry: CachedDetailEntry = {
                            data: fallbackData,
                            notFound: false,
                            debug: {
                                source: 'id',
                                resolvedExerciseDbId: exerciseDbId,
                                candidatesTried: candidates,
                                gifValidated: true,
                            },
                        }

                        detailCache.set(cacheKey, fallbackEntry)
                        setState({
                            data: fallbackData,
                            isLoading: false,
                            isTranslatingInstructions: false,
                            notFound: false,
                            debug: fallbackEntry.debug,
                        })
                        return
                    }

                    const notFoundEntry: CachedDetailEntry = {
                        data: null,
                        notFound: true,
                        debug: {
                            source: 'none',
                            candidatesTried: candidates,
                            gifValidated: false,
                        },
                    }
                    detailCache.set(cacheKey, notFoundEntry)
                    setState({ data: null, isLoading: false, isTranslatingInstructions: false, notFound: true, debug: notFoundEntry.debug })
                    return
                }

                const rawInstructions = Array.isArray(bestMatch.instructions) ? bestMatch.instructions : []
                const detailData: ExerciseDetailData = {
                    gifUrl: resolveExerciseGifUrl(bestMatch, apiKey),
                    target: bestMatch.target ?? '',
                    equipment: bestMatch.equipment ?? '',
                    instructions: rawInstructions,
                    secondaryMuscles: Array.isArray(bestMatch.secondaryMuscles) ? bestMatch.secondaryMuscles : [],
                }

                if (currentLanguage === 'es' && rawInstructions.length > 0) {
                    setState({
                        data: detailData,
                        isLoading: false,
                        isTranslatingInstructions: true,
                        notFound: false,
                        debug: {
                            source: byId || bestMatch.id ? 'id' : 'candidate',
                            resolvedExerciseDbId: bestMatch.id,
                            resolvedExerciseDbName: bestMatch.name,
                            usedCandidate: byCandidate?.usedCandidate,
                            candidatesTried: candidates,
                            gifValidated: Boolean(detailData.gifUrl),
                            lastError: detailData.gifUrl ? undefined : 'gif_fetch_failed',
                        },
                    })

                    detailData.instructions = await maybeTranslateInstructions(rawInstructions, currentLanguage, controller.signal)
                }

                const successEntry: CachedDetailEntry = {
                    data: detailData,
                    notFound: false,
                    debug: {
                        source: byId || bestMatch.id ? 'id' : 'candidate',
                        resolvedExerciseDbId: bestMatch.id,
                        resolvedExerciseDbName: bestMatch.name,
                        usedCandidate: byCandidate?.usedCandidate,
                        candidatesTried: candidates,
                        gifValidated: Boolean(detailData.gifUrl),
                        lastError: detailData.gifUrl ? undefined : 'gif_fetch_failed',
                    },
                }

                detailCache.set(cacheKey, successEntry)
                setState({ data: detailData, isLoading: false, isTranslatingInstructions: false, notFound: false, debug: successEntry.debug })
            } catch {
                if (!controller.signal.aborted) {
                    const errorEntry: CachedDetailEntry = {
                        data: null,
                        notFound: true,
                        debug: {
                            source: 'none',
                            candidatesTried: buildQueryCandidates(exerciseName, {
                                exerciseDbId,
                                exerciseDbName,
                                exerciseDbAliases,
                            }),
                            gifValidated: false,
                            lastError: 'request_failed',
                        },
                    }
                    detailCache.set(cacheKey, errorEntry)
                    setState({ data: null, isLoading: false, isTranslatingInstructions: false, notFound: true, debug: errorEntry.debug })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [aliasSignature, apiKey, cacheKey, currentLanguage, exerciseDbAliases, exerciseDbId, exerciseDbName, exerciseName, normalizedName, shouldFetch])

    if (!normalizedName) {
        return {
            data: null,
            isLoading: false,
            isTranslatingInstructions: false,
            notFound: false,
            debug: {
                source: 'none',
                candidatesTried: [],
                gifValidated: false,
                lastError: undefined,
            },
        }
    }

    if (cached !== undefined) {
        return {
            data: cached.data,
            isLoading: false,
            isTranslatingInstructions: false,
            notFound: cached.notFound,
            debug: {
                ...cached.debug,
                source: 'cache',
            },
        }
    }

    return state
}
