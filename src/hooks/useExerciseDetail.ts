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
    fallbackInstructions?: string
    fallbackGifUrl?: string
}

interface CachedDetailEntry {
    data: ExerciseDetailData | null
    notFound: boolean
    debug: ExerciseDetailDebugInfo
}

const detailCache = new Map<string, CachedDetailEntry>()
const gifUrlCache = new Map<string, string>()
const translatedInstructionCache = new Map<string, string>()
const INSTRUCTION_TRANSLATION_CACHE_VERSION = 'es-fallback-v2'
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

function stripStepPrefix(step: string) {
    return step
        .replace(/^step\s*:?\s*\d+\s*/i, '')
        .replace(/^\d+[).:-]?\s*/, '')
        .trim()
}

function parseFallbackInstructions(value?: string): string[] {
    const normalized = value?.trim()
    if (!normalized) {
        return []
    }

    const byLine = normalized
        .split(/\r?\n/)
        .map((line) => stripStepPrefix(line.trim()))
        .filter(Boolean)

    if (byLine.length > 1) {
        return byLine
    }

    return [stripStepPrefix(normalized)]
}

function detectInstructionLanguage(text: string): 'es' | 'en' {
    const normalized = text.toLowerCase()

    if (/[áéíóúñ¿¡]/i.test(text)) {
        return 'es'
    }

    if (
        /\b(el|la|los|las|de|del|con|manten|mantén|evita|controla|sube|baja|repite|sin|hombros|cadera|espalda|rodillas)\b/i.test(
            normalized,
        )
    ) {
        return 'es'
    }

    return 'en'
}

function hasEnglishResidue(text: string): boolean {
    return /\b(the|and|with|your|you|keep|pull|push|lower|raise|repeat|for|number|repetitions|starting|position|body|feet|bench|grip|shoulder|shoulders|elbow|elbows|arm|arms|back|chest|slowly|pause)\b/i.test(
        text,
    )
}

const spanishLeadReplacements: Array<[RegExp, string]> = [
    [/^set up\b/i, 'Prepara'],
    [/^stand with\b/i, 'Colócate de pie con'],
    [/^stand facing\b/i, 'Colócate frente a'],
    [/^stand\b/i, 'Colócate de pie'],
    [/^sit on\b/i, 'Siéntate en'],
    [/^sit\b/i, 'Siéntate'],
    [/^lie\b/i, 'Túmbate'],
    [/^start in\b/i, 'Comienza en'],
    [/^start by\b/i, 'Comienza'],
    [/^attach\b/i, 'Coloca'],
    [/^adjust\b/i, 'Ajusta'],
    [/^grasp\b/i, 'Sujeta'],
    [/^grab\b/i, 'Agarra'],
    [/^keep\b/i, 'Mantén'],
    [/^engage\b/i, 'Activa'],
    [/^pull\b/i, 'Tira'],
    [/^push\b/i, 'Empuja'],
    [/^lower\b/i, 'Baja'],
    [/^raise\b/i, 'Eleva'],
    [/^pause\b/i, 'Haz una pausa'],
    [/^repeat\b/i, 'Repite'],
    [/^continue\b/i, 'Continúa'],
    [/^switch\b/i, 'Cambia'],
    [/^hold\b/i, 'Mantén'],
    [/^inhale\b/i, 'Inhala'],
    [/^exhale\b/i, 'Exhala'],
]

const spanishInlineReplacements: Array<[RegExp, string]> = [
    [/\bshoulder-width apart\b/gi, 'a la anchura de los hombros'],
    [/\bhip-width apart\b/gi, 'a la anchura de la cadera'],
    [/\bfeet flat on the ground\b/gi, 'pies apoyados en el suelo'],
    [/\bfeet flat on the floor\b/gi, 'pies apoyados en el suelo'],
    [/\bpalms facing down\b/gi, 'palmas hacia abajo'],
    [/\bpalms facing up\b/gi, 'palmas hacia arriba'],
    [/\bpalms facing each other\b/gi, 'palmas enfrentadas'],
    [/\boverhand grip\b/gi, 'agarre prono'],
    [/\bunderhand grip\b/gi, 'agarre supino'],
    [/\bneutral grip\b/gi, 'agarre neutro'],
    [/\bshoulder blades\b/gi, 'escápulas'],
    [/\bcore\b/gi, 'core'],
    [/\bstarting position\b/gi, 'posición inicial'],
    [/\bdesired number of repetitions\b/gi, 'número de repeticiones deseado'],
    [/\bfor the desired number of repetitions\b/gi, 'durante el número de repeticiones deseado'],
    [/\bslowly\b/gi, 'lentamente'],
    [/\bmoment\b/gi, 'instante'],
    [/\bbench\b/gi, 'banco'],
    [/\bbarbell\b/gi, 'barra'],
    [/\bdumbbell\b/gi, 'mancuerna'],
    [/\bcable machine\b/gi, 'máquina de poleas'],
    [/\bcable\b/gi, 'cable'],
    [/\brow\b/gi, 'remo'],
    [/\bpull-up bar\b/gi, 'barra de dominadas'],
    [/\bbodyweight\b/gi, 'peso corporal'],
    [/\bbody weight\b/gi, 'peso corporal'],
    [/\belbows\b/gi, 'codos'],
    [/\bshoulders\b/gi, 'hombros'],
    [/\bchest\b/gi, 'pecho'],
    [/\bback\b/gi, 'espalda'],
]

function fallbackTranslateInstructionToSpanish(text: string): string {
    const trimmed = text.trim()
    if (!trimmed) {
        return text
    }

    if (detectInstructionLanguage(trimmed) === 'es') {
        return trimmed
    }

    let translated = trimmed

    for (const [pattern, replacement] of spanishLeadReplacements) {
        if (pattern.test(translated)) {
            translated = translated.replace(pattern, replacement)
            break
        }
    }

    for (const [pattern, replacement] of spanishInlineReplacements) {
        translated = translated.replace(pattern, replacement)
    }

    translated = translated
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .trim()

    if (detectInstructionLanguage(translated) !== 'es' || hasEnglishResidue(translated)) {
        return 'Ejecuta la repetición con técnica controlada y rango completo.'
    }

    return translated || trimmed
}

function normalizeTranslatedInstruction(
    originalText: string,
    translatedText: string,
    targetLanguage: 'es' | 'en',
): string {
    const candidate = translatedText.trim() || originalText.trim()

    if (targetLanguage === 'es' && (detectInstructionLanguage(candidate) !== 'es' || hasEnglishResidue(candidate))) {
        return fallbackTranslateInstructionToSpanish(originalText)
    }

    return candidate
}

function shouldTranslateInstructions(instructions: string[], language: 'es' | 'en') {
    return instructions.some((instruction) => detectInstructionLanguage(instruction) !== language)
}

async function translateInstruction(
    text: string,
    sourceLanguage: 'es' | 'en',
    targetLanguage: 'es' | 'en',
    signal: AbortSignal,
): Promise<string> {
    const normalizedText = text.trim()
    if (!normalizedText) {
        return text
    }

    if (sourceLanguage === targetLanguage) {
        return normalizedText
    }

    const cacheKey = `${sourceLanguage}|${targetLanguage}|${normalizedText}`
    const cached = translatedInstructionCache.get(cacheKey)
    if (cached) {
        return cached
    }

    const fallbackTranslation =
        targetLanguage === 'es' ? fallbackTranslateInstructionToSpanish(normalizedText) : normalizedText

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
                source: sourceLanguage,
                target: targetLanguage,
                format: 'text',
            }),
            signal: timeoutController.signal,
        })

        if (!response.ok) {
            return fallbackTranslation
        }

        const payload = (await response.json()) as { translatedText?: string }
        const translated = payload.translatedText?.trim()
        if (!translated) {
            return fallbackTranslation
        }

        const normalizedTranslated = normalizeTranslatedInstruction(normalizedText, translated, targetLanguage)

        translatedInstructionCache.set(cacheKey, normalizedTranslated)
        return normalizedTranslated
    } catch {
        return fallbackTranslation
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
    if (instructions.length === 0) {
        return instructions
    }

    const translated = await Promise.all(
        instructions.map((instruction) =>
            translateInstruction(
                instruction,
                detectInstructionLanguage(instruction),
                language,
                signal,
            ),
        ),
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
    const fallbackInstructionsValue = options?.fallbackInstructions
    const fallbackGifUrl = normalizeGifUrl(options?.fallbackGifUrl ?? '')
    const fallbackInstructionSignature = normalizeExerciseName(fallbackInstructionsValue ?? '')
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${INSTRUCTION_TRANSLATION_CACHE_VERSION}|${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${currentLanguage}|${fallbackGifUrl}|${fallbackInstructionSignature}`
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
            const fallbackInstructions = parseFallbackInstructions(fallbackInstructionsValue)
                .map((instruction) => stripStepPrefix(instruction))
                .filter(Boolean)
            const resolvedFallbackGifUrl =
                fallbackGifUrl || (apiKey && exerciseDbId?.trim() ? buildExerciseGifUrl(exerciseDbId, apiKey) : '')

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
                    if (resolvedFallbackGifUrl || fallbackInstructions.length > 0) {
                        const needsFallbackTranslation =
                            fallbackInstructions.length > 0 &&
                            shouldTranslateInstructions(fallbackInstructions, currentLanguage)

                        if (needsFallbackTranslation) {
                            setState({
                                data: {
                                    gifUrl: resolvedFallbackGifUrl,
                                    target: '',
                                    equipment: '',
                                    instructions: fallbackInstructions,
                                    secondaryMuscles: [],
                                },
                                isLoading: false,
                                isTranslatingInstructions: true,
                                notFound: false,
                                debug: {
                                    source: exerciseDbId ? 'id' : 'none',
                                    resolvedExerciseDbId: exerciseDbId,
                                    candidatesTried: candidates,
                                    gifValidated: Boolean(resolvedFallbackGifUrl),
                                },
                            })
                        }

                        const translatedFallbackInstructions = needsFallbackTranslation
                            ? await maybeTranslateInstructions(fallbackInstructions, currentLanguage, controller.signal)
                            : fallbackInstructions

                        const fallbackData: ExerciseDetailData = {
                            gifUrl: resolvedFallbackGifUrl,
                            target: '',
                            equipment: '',
                            instructions: translatedFallbackInstructions,
                            secondaryMuscles: [],
                        }

                        const fallbackEntry: CachedDetailEntry = {
                            data: fallbackData,
                            notFound: false,
                            debug: {
                                source: exerciseDbId ? 'id' : 'none',
                                resolvedExerciseDbId: exerciseDbId,
                                candidatesTried: candidates,
                                gifValidated: Boolean(resolvedFallbackGifUrl),
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

                const rawInstructions = Array.isArray(bestMatch.instructions)
                    ? bestMatch.instructions.map((instruction) => stripStepPrefix(instruction)).filter(Boolean)
                    : []
                const instructionSource = rawInstructions.length > 0 ? rawInstructions : fallbackInstructions
                const detailData: ExerciseDetailData = {
                    gifUrl: resolveExerciseGifUrl(bestMatch, apiKey) || resolvedFallbackGifUrl,
                    target: bestMatch.target ?? '',
                    equipment: bestMatch.equipment ?? '',
                    instructions: instructionSource,
                    secondaryMuscles: Array.isArray(bestMatch.secondaryMuscles) ? bestMatch.secondaryMuscles : [],
                }

                const needsTranslation =
                    instructionSource.length > 0 &&
                    shouldTranslateInstructions(instructionSource, currentLanguage)

                if (needsTranslation) {
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

                    detailData.instructions = await maybeTranslateInstructions(
                        instructionSource,
                        currentLanguage,
                        controller.signal,
                    )
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
                    if (resolvedFallbackGifUrl || fallbackInstructions.length > 0) {
                        const translatedFallbackInstructions = await maybeTranslateInstructions(
                            fallbackInstructions,
                            currentLanguage,
                            controller.signal,
                        )
                        const fallbackData: ExerciseDetailData = {
                            gifUrl: resolvedFallbackGifUrl,
                            target: '',
                            equipment: '',
                            instructions: translatedFallbackInstructions,
                            secondaryMuscles: [],
                        }

                        const fallbackEntry: CachedDetailEntry = {
                            data: fallbackData,
                            notFound: false,
                            debug: {
                                source: exerciseDbId ? 'id' : 'none',
                                resolvedExerciseDbId: exerciseDbId,
                                candidatesTried: candidates,
                                gifValidated: Boolean(resolvedFallbackGifUrl),
                                lastError: 'request_failed',
                            },
                        }

                        detailCache.set(cacheKey, fallbackEntry)
                        setState({ data: fallbackData, isLoading: false, isTranslatingInstructions: false, notFound: false, debug: fallbackEntry.debug })
                        return
                    }

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
    }, [
        aliasSignature,
        apiKey,
        cacheKey,
        currentLanguage,
        exerciseDbAliases,
        exerciseDbId,
        exerciseDbName,
        exerciseName,
        fallbackGifUrl,
        fallbackInstructionsValue,
        normalizedName,
        shouldFetch,
    ])

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
