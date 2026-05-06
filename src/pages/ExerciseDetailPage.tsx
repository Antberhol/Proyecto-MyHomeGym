import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../components/design-system/Button'
import { Card } from '../components/design-system/Card'
import { ExerciseMediaFallback } from '../components/exercises/ExerciseMediaFallback'
import { StrengthProgressChart } from '../components/stats/StrengthProgressChart'
import { getPreferredExerciseDbName } from '../constants/exerciseDbAliases'
import { useExerciseDetail } from '../hooks/useExerciseDetail'
import { exerciseRepository } from '../repositories/exerciseRepository'
import { progressRepository } from '../repositories/progressRepository'
import { firebaseFirestore, isFirebaseConfigured } from '../services/firebase'
import { estimateOneRmEpley } from '../utils/calculations'
import type { Exercise } from '../types/models'

function ExerciseDetailSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-56 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
        </div>
    )
}

export function ExerciseDetailPage() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [isCatalogLoading, setIsCatalogLoading] = useState(true)
    const [catalogError, setCatalogError] = useState('')
    const [personalNote, setPersonalNote] = useState('')
    const [noteSaved, setNoteSaved] = useState(false)
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
    const [retryCount, setRetryCount] = useState(0)
    const [rangeKey, setRangeKey] = useState<'4w' | '3m' | '1y' | 'all'>('4w')

    useEffect(() => {
        const run = async () => {
            if (!id) {
                setCatalogError(t('exerciseDetail.invalidExercise'))
                setIsCatalogLoading(false)
                return
            }

            try {
                const localExercise = await exerciseRepository.getExerciseById(id)
                if (localExercise) {
                    setExercise(localExercise)
                    return
                }

                if (!isFirebaseConfigured || !firebaseFirestore) {
                    setCatalogError(t('exerciseDetail.requestedExerciseNotFound'))
                    return
                }

                const exerciseRef = doc(firebaseFirestore, 'ejerciciosCatalogo', id)
                const snapshot = await getDoc(exerciseRef)

                if (!snapshot.exists()) {
                    setCatalogError(t('exerciseDetail.requestedExerciseNotFound'))
                    return
                }

                const rawData = snapshot.data() as Omit<Exercise, 'id'>
                setExercise({ id: snapshot.id, ...rawData })
            } catch {
                setCatalogError(t('exerciseDetail.exerciseLoadFailed'))
            } finally {
                setIsCatalogLoading(false)
            }
        }

        void run()
    }, [id, t])

    useEffect(() => {
        if (!exercise) return

        const storageKey = `exercise_notes_${exercise.id}`
        const storedNote = window.localStorage.getItem(storageKey)
        setPersonalNote(storedNote ?? '')
        setNoteSaved(false)
        setImageStatus('loading')
    }, [exercise])

    const englishAlias =
        exercise?.exerciseDbName ??
        exercise?.exerciseDbAliases?.[0] ??
        (exercise ? getPreferredExerciseDbName(exercise.nombre) : undefined)

    const dateRange = useMemo(() => {
        const now = new Date()
        if (rangeKey === 'all') return { from: undefined, to: undefined }

        const from = new Date(now)
        if (rangeKey === '4w') {
            from.setDate(from.getDate() - 28)
        } else if (rangeKey === '3m') {
            from.setMonth(from.getMonth() - 3)
        } else if (rangeKey === '1y') {
            from.setFullYear(from.getFullYear() - 1)
        }

        return { from: from.toISOString(), to: now.toISOString() }
    }, [rangeKey])

    const exerciseHistory = useLiveQuery(
        () => (exercise ? progressRepository.getExerciseHistory(exercise.id, dateRange.from, dateRange.to) : Promise.resolve([])),
        [exercise?.id, dateRange.from, dateRange.to],
    ) ?? []

    const exercisePrs = useLiveQuery(
        () => (exercise ? progressRepository.getExercisePrs(exercise.id) : Promise.resolve([])),
        [exercise?.id],
    ) ?? []

    const sessionHistory = useMemo(() => {
        const grouped = exerciseHistory.reduce<Record<string, typeof exerciseHistory>>((acc, item) => {
            if (!acc[item.fecha]) {
                acc[item.fecha] = []
            }
            acc[item.fecha].push(item)
            return acc
        }, {})

        return Object.entries(grouped)
            .map(([fecha, sets]) => {
                const sorted = sets.slice().sort((a, b) => b.pesoUtilizado - a.pesoUtilizado)
                const maxSet = sorted[0]
                return {
                    fecha,
                    setsCount: sets.length,
                    maxWeight: maxSet?.pesoUtilizado ?? 0,
                    repsAtMax: maxSet?.repeticionesRealizadas ?? 0,
                }
            })
            .sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))
    }, [exerciseHistory])

    const maxWeightSeries = useMemo(
        () => sessionHistory.map((item) => ({
            label: new Date(item.fecha).toLocaleDateString(i18n.language),
            weight: item.maxWeight,
        })),
        [i18n.language, sessionHistory],
    )

    const oneRmSeries = useMemo(
        () => sessionHistory.map((item) => ({
            label: new Date(item.fecha).toLocaleDateString(i18n.language),
            oneRm: estimateOneRmEpley(item.maxWeight, item.repsAtMax),
            weight: item.maxWeight,
        })),
        [i18n.language, sessionHistory],
    )

    const detail = useExerciseDetail(exercise?.nombre ?? '', {
        exerciseId: exercise?.id,
        exerciseDbId: exercise?.exerciseDbId,
        exerciseDbName: englishAlias,
        exerciseDbAliases: exercise?.exerciseDbAliases,
        grupoMuscularPrimario: exercise?.grupoMuscularPrimario,
        fallbackInstructions: exercise?.instrucciones,
        fallbackGifUrl: exercise?.imagenUrl,
        retryKey: retryCount,
    })

    const isSpanishUi = i18n.language.toLowerCase().startsWith('es')
    const hasEnglishInstructions =
        isSpanishUi &&
        (detail.data?.instructions ?? []).some((instruction) => {
            const words = instruction.toLowerCase().match(/\b[a-z][a-z'-]*\b/g) ?? []
            if (words.length === 0) {
                return false
            }

            const englishMatches = words.filter((word) =>
                /^(the|a|an|and|or|with|without|your|you|for|from|to|of|in|on|at|by|then|while|when|keep|maintain|perform|pull|push|lower|raise|pause|repeat|continue|switch|stand|sit|lie|walk|step|grab|grasp|bench|grip|starting|position|shoulder|body|chest|feet|knee|floor|ground|back|arms|elbows)$/.test(word),
            ).length

            return englishMatches >= 3
        })

    useEffect(() => {
        setImageStatus('loading')
    }, [detail.data?.gifUrl])

    const apiSource = 'oss.exercisedb.dev (free)'
    const gifUrlDomain = (() => {
        const gifUrl = detail.data?.gifUrl
        if (!gifUrl || gifUrl.startsWith('data:')) {
            return 'placeholder'
        }

        try {
            return new URL(gifUrl).hostname || 'placeholder'
        } catch {
            return 'placeholder'
        }
    })()

    const clearExerciseGifCache = () => {
        const cacheExerciseDbId =
            exercise?.exerciseDbId?.trim() ||
            detail.debug.resolvedExerciseDbId?.trim() ||
            ''

        if (cacheExerciseDbId) {
            window.localStorage.removeItem(`gifcache_v2_${cacheExerciseDbId}`)
            window.localStorage.removeItem(`gifcache_v1_${cacheExerciseDbId}`)
        }

        setRetryCount((c) => c + 1)
    }

    if (isCatalogLoading || (exercise && detail.isLoading)) {
        return <ExerciseDetailSkeleton />
    }

    if (catalogError) {
        return (
            <div className="space-y-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                    {t('common.backToCatalog')}
                </Button>
                <Card>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{catalogError}</p>
                </Card>
            </div>
        )
    }

    if (!exercise) {
        return null
    }

    const savePersonalNote = () => {
        const storageKey = `exercise_notes_${exercise.id}`
        window.localStorage.setItem(storageKey, personalNote)
        setNoteSaved(true)

        window.setTimeout(() => {
            setNoteSaved(false)
        }, 1200)
    }

    if (detail.notFound && !detail.isLoading) {
        return (
            <div className="space-y-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                    {t('common.backToCatalog')}
                </Button>
                <Card>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{t('common.notFoundDetailedInfo')}</p>
                    <button
                        type="button"
                        onClick={() => setRetryCount((c) => c + 1)}
                        className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        {t('common.retry')}
                    </button>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                {t('common.backToCatalog')}
            </Button>

            <Card className="space-y-4">
                <div className="relative h-80 w-full md:h-96">
                    {imageStatus === 'loading' && (
                        <div className="absolute inset-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                    )}
                    {imageStatus === 'error' && (
                        <div className="absolute inset-0 z-10 rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
                            <ExerciseMediaFallback />
                        </div>
                    )}
                    <img
                        src={detail.data?.gifUrl ?? ''}
                        alt={t('exerciseDetail.gifAlt', { name: exercise.nombre })}
                        className={`h-80 w-full rounded-xl border border-slate-200 bg-slate-100 object-contain p-2 transition-opacity duration-300 dark:border-slate-700 dark:bg-slate-800 md:h-96 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={() => setImageStatus('loaded')}
                        onError={() => setImageStatus('error')}
                        aria-hidden={imageStatus !== 'loaded'}
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{exercise.nombre}</h1>
                    {englishAlias ? (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {t('exerciseDetail.alias')}: <span className="font-medium">{englishAlias}</span>
                        </p>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{t('exerciseDetail.target')}</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.target || exercise.grupoMuscularPrimario}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{t('exerciseDetail.equipment')}</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.equipment || exercise.equipoNecesario}</p>
                    </div>
                </div>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.secondaryMuscles')}</h2>
                    {detail.data && detail.data.secondaryMuscles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {detail.data.secondaryMuscles.map((muscle) => (
                                <span key={muscle} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {muscle}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{t('common.notFoundDetailedInfo')}</p>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.instructions')}</h2>
                    {detail.isTranslatingInstructions ? (
                        <div className="space-y-2">
                            <div className="h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                    ) : null}
                    {detail.data && detail.data.instructions.length > 0 ? (
                        <>
                            {hasEnglishInstructions ? (
                                <p className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:border-amber-500/60 dark:bg-amber-900/20 dark:text-amber-200">
                                    {t('exerciseDetail.instructionsInEnglish')}
                                </p>
                            ) : null}
                            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                                {detail.data.instructions.map((instruction, index) => (
                                    <li key={`${instruction}-${index}`}>{instruction}</li>
                                ))}
                            </ol>
                        </>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{t('common.notFoundDetailedInfo')}</p>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.notes.title')}</h2>
                    <textarea
                        value={personalNote}
                        onChange={(event) => setPersonalNote(event.target.value)}
                        placeholder={t('exerciseDetail.notes.placeholder')}
                        className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={savePersonalNote}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                        >
                            {t('exerciseDetail.notes.save')}
                        </button>
                        {noteSaved ? <span className="text-xs text-emerald-600 dark:text-emerald-300">{t('exerciseDetail.notes.saved')}</span> : null}
                    </div>
                </section>

                {import.meta.env.DEV && (
                    <details className="mt-2 rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
                        <summary className="cursor-pointer font-semibold">⚙ Debug: GIF resolution</summary>
                        <dl className="mt-2 space-y-1">
                            <dt className="font-medium">source</dt>
                            <dd className="pl-4">{detail.debug.source}</dd>
                            <dt className="font-medium">resolvedExerciseDbId</dt>
                            <dd className="pl-4">{detail.debug.resolvedExerciseDbId ?? '—'}</dd>
                            <dt className="font-medium">resolvedExerciseDbName</dt>
                            <dd className="pl-4">{detail.debug.resolvedExerciseDbName ?? '—'}</dd>
                            <dt className="font-medium">usedCandidate</dt>
                            <dd className="pl-4">{detail.debug.usedCandidate ?? '—'}</dd>
                            <dt className="font-medium">candidatesTried</dt>
                            <dd className="pl-4">{detail.debug.candidatesTried.join(', ') || '—'}</dd>
                            <dt className="font-medium">gifValidated</dt>
                            <dd className="pl-4">{String(detail.debug.gifValidated)}</dd>
                            <dt className="font-medium">lastError</dt>
                            <dd className="pl-4">{detail.debug.lastError ?? '—'}</dd>
                            <dt className="font-medium">gifUrl</dt>
                            <dd className="break-all pl-4">{detail.data?.gifUrl ?? '—'}</dd>
                            <dt className="font-medium">apiSource</dt>
                            <dd className="pl-4">{apiSource}</dd>
                            <dt className="font-medium">gifUrlDomain</dt>
                            <dd className="pl-4">{gifUrlDomain}</dd>
                        </dl>
                        <button
                            type="button"
                            onClick={clearExerciseGifCache}
                            className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                        >
                            Limpiar caché de este ejercicio
                        </button>
                    </details>
                )}
            </Card>

            <Card className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.progress.title')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {[{ key: '4w', label: t('exerciseDetail.progress.range.4w') },
                        { key: '3m', label: t('exerciseDetail.progress.range.3m') },
                        { key: '1y', label: t('exerciseDetail.progress.range.1y') },
                        { key: 'all', label: t('exerciseDetail.progress.range.all') }].map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setRangeKey(option.key as '4w' | '3m' | '1y' | 'all')}
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${rangeKey === option.key
                                    ? 'border-gym-yellow text-gym-yellow bg-gym-yellow/10'
                                    : 'border-gym-border text-gym-text-dim'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {sessionHistory.length === 0 ? (
                    <div className="rounded-lg border border-gym-border bg-gym-card-2 p-4 text-sm text-gym-text-dim">
                        {t('exerciseDetail.progress.empty')}
                    </div>
                ) : (
                    <>
                        <div className="bg-gym-card border border-gym-border rounded-xl p-4">
                            <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('exerciseDetail.progress.maxWeight')}</h3>
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={maxWeightSeries}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                        <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                                        <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                                        <Tooltip />
                                        <Line dataKey="weight" stroke="#F5C518" strokeWidth={2} dot={{ fill: '#F5C518', r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('exerciseDetail.progress.oneRm')}</h3>
                            <StrengthProgressChart data={oneRmSeries} />
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold">{t('exerciseDetail.progress.recentSessions')}</h3>
                            <ul className="space-y-2">
                                {sessionHistory.slice(-10).reverse().map((session) => (
                                    <li key={session.fecha} className="rounded-lg border border-gym-border bg-gym-card-2 p-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gym-text-bright">{new Date(session.fecha).toLocaleDateString(i18n.language)}</span>
                                            <span className="text-gym-text-dim">{session.setsCount} {t('exerciseDetail.progress.sets')}</span>
                                        </div>
                                        <div className="mt-1 text-gym-text-dim">
                                            {t('exerciseDetail.progress.maxSet', { weight: session.maxWeight, reps: session.repsAtMax })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold">{t('exerciseDetail.progress.prsTitle')}</h3>
                            {exercisePrs.length === 0 ? (
                                <p className="text-sm text-gym-text-dim">{t('exerciseDetail.progress.noPrs')}</p>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {exercisePrs.map((pr) => (
                                        <li key={pr.id} className="rounded-lg border border-gym-border bg-gym-card-2 p-3">
                                            <div className="flex items-center justify-between">
                                                <span>{t(`progress.pr.type.${pr.tipo}`, { defaultValue: pr.tipo })}</span>
                                                <span>{new Date(pr.fecha).toLocaleDateString(i18n.language)}</span>
                                            </div>
                                            <div className="mt-1 text-gym-text-dim">{pr.valor.toFixed(1)} · {pr.detalle}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}
