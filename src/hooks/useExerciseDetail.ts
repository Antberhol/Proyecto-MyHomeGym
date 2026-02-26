import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'

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
    target?: string
    equipment?: string
    instructions?: string[]
    secondaryMuscles?: string[]
}

interface UseExerciseDetailResult {
    data: ExerciseDetailData | null
    isLoading: boolean
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

function buildGifUrl(exerciseId: string, apiKey: string): string {
    return `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${encodeURIComponent(exerciseId)}&rapidapi-key=${encodeURIComponent(apiKey)}`
}

async function hasWorkingGif(exerciseId: string, apiKey: string, signal: AbortSignal): Promise<boolean> {
    const response = await fetch(buildGifUrl(exerciseId, apiKey), { signal })
    if (!response.ok) {
        return false
    }

    const contentType = response.headers.get('content-type') ?? ''
    return contentType.includes('image')
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
): Promise<{ item: ExerciseDbItem; usedCandidate: string } | null> {
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
        const ordered = [best, ...payload].filter((item): item is ExerciseDbItem => Boolean(item?.id))
        const seenIds = new Set<string>()

        for (const item of ordered) {
            const itemId = item.id
            if (!itemId || seenIds.has(itemId)) {
                continue
            }
            seenIds.add(itemId)

            try {
                if (await hasWorkingGif(itemId, apiKey, signal)) {
                    return { item, usedCandidate: candidate }
                }
            } catch {
                continue
            }
        }

        if (best?.id) {
            return { item: best, usedCandidate: candidate }
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

    const hasGif = await hasWorkingGif(payload.id, apiKey, signal)
    if (!hasGif) {
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
        debug: {
            source: 'none',
            candidatesTried: [],
            gifValidated: false,
        },
    })

    useEffect(() => {
        if (!shouldFetch || !apiKey) {
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
                notFound: false,
                debug: {
                    source: 'none',
                    candidatesTried: candidates,
                    gifValidated: false,
                },
            })

            try {
                const byId = exerciseDbId?.trim()
                    ? await searchExerciseById(exerciseDbId, apiKey, controller.signal)
                    : null
                const byCandidate = byId
                    ? null
                    : await searchExerciseByCandidates(candidates, apiKey, controller.signal)
                const bestMatch = byId ?? byCandidate?.item ?? null

                if (!bestMatch?.id) {
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
                    setState({ data: null, isLoading: false, notFound: true, debug: notFoundEntry.debug })
                    return
                }

                const detailData: ExerciseDetailData = {
                    gifUrl: buildGifUrl(bestMatch.id, apiKey),
                    target: bestMatch.target ?? '',
                    equipment: bestMatch.equipment ?? '',
                    instructions: Array.isArray(bestMatch.instructions) ? bestMatch.instructions : [],
                    secondaryMuscles: Array.isArray(bestMatch.secondaryMuscles) ? bestMatch.secondaryMuscles : [],
                }

                const successEntry: CachedDetailEntry = {
                    data: detailData,
                    notFound: false,
                    debug: {
                        source: byId ? 'id' : 'candidate',
                        resolvedExerciseDbId: bestMatch.id,
                        resolvedExerciseDbName: bestMatch.name,
                        usedCandidate: byCandidate?.usedCandidate,
                        candidatesTried: candidates,
                        gifValidated: true,
                    },
                }

                detailCache.set(cacheKey, successEntry)
                setState({ data: detailData, isLoading: false, notFound: false, debug: successEntry.debug })
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
                    setState({ data: null, isLoading: false, notFound: true, debug: errorEntry.debug })
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
            debug: {
                source: 'none',
                candidatesTried: [],
                gifValidated: false,
                lastError: apiKey ? undefined : 'missing_api_key',
            },
        }
    }

    if (cached !== undefined) {
        return {
            data: cached.data,
            isLoading: false,
            notFound: cached.notFound,
            debug: {
                ...cached.debug,
                source: 'cache',
            },
        }
    }

    return state
}
