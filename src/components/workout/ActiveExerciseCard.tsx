import type {
    ActiveExercisePrTarget,
    ActiveRoutineExercise,
    ExerciseHistoryEntry,
    PreviousExerciseSession,
    SetData,
    WorkoutSetType,
} from './types'
import { NumberStepper } from '../ui/NumberStepper'
import { OneRepMaxBadge } from './OneRepMaxBadge'
import { useTranslation } from 'react-i18next'
import { useExerciseGif } from '../../hooks/useExerciseGif'
import { normalizeExerciseName } from '../../constants/exerciseDbAliases'
import { useMemo, useState } from 'react'

interface ActiveExerciseCardProps {
    activeRoutineExercise: ActiveRoutineExercise | undefined
    activeExerciseIndex: number
    totalExercises: number
    previousSessionByExercise: Record<string, PreviousExerciseSession>
    activeExerciseHistory: ExerciseHistoryEntry[]
    activeExerciseSuggestedWeight: number | null
    activeExercisePrTarget: ActiveExercisePrTarget | null
    onPrevious: () => void
    onNext: () => void
    onApplySuggestedWeight: () => void
    onStartRestTimer: (seconds: number) => void
    getSetValue: (routineExerciseId: string, serieNumero: number) => SetData
    updateSetData: (
        routineExerciseId: string,
        serieNumero: number,
        field: keyof SetData,
        value: number | WorkoutSetType,
    ) => void
}

const SET_TYPE_LABELS: Record<WorkoutSetType, string> = {
    normal: 'N',
    warmup: 'W',
    dropset: 'D',
    failure: 'F',
}

const SET_TYPE_STYLES: Record<WorkoutSetType, string> = {
    normal: 'border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
    warmup: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dropset: 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/20 dark:text-orange-300',
    failure: 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300',
}

function normalizeGifUrl(url: string): string {
    const normalized = url.trim()
    if (!normalized) return ''
    return normalized.replace(/^http:\/\//i, 'https://')
}

export function ActiveExerciseCard({
    activeRoutineExercise,
    activeExerciseIndex,
    totalExercises,
    previousSessionByExercise,
    activeExerciseHistory,
    activeExerciseSuggestedWeight,
    activeExercisePrTarget,
    onPrevious,
    onNext,
    onApplySuggestedWeight,
    onStartRestTimer,
    getSetValue,
    updateSetData,
}: ActiveExerciseCardProps) {
    const { t } = useTranslation()
    const [gifCacheBuster, setGifCacheBuster] = useState<number>(0)

    if (!activeRoutineExercise) {
        return null
    }

    const previousSession = previousSessionByExercise[activeRoutineExercise.ejercicioId]

    const exercise = activeRoutineExercise.ejercicio
    const exerciseName = exercise?.nombre || t('training.exerciseCard.exercise')

    const cacheKey = useMemo(() => {
        const normalizedName = normalizeExerciseName(exerciseName)
        const exerciseDbId = exercise?.exerciseDbId ?? ''
        const exerciseDbName = exercise?.exerciseDbName ?? ''
        const aliasSignature = (exercise?.exerciseDbAliases ?? []).join('|')
        const directGifUrl = normalizeGifUrl(exercise?.gifUrl ?? '')
        const fallbackGifUrl = normalizeGifUrl(exercise?.imagenUrl ?? '')
        const primaryMuscleSignature = normalizeExerciseName(exercise?.grupoMuscularPrimario ?? '')

        return `${normalizedName}|${exerciseDbId}|${exerciseDbName}|${aliasSignature}|${directGifUrl}|${fallbackGifUrl}|${primaryMuscleSignature}|${gifCacheBuster}`
    }, [exercise, exerciseName, gifCacheBuster])

    const { gifUrl: resolvedGifUrl, isLoading: gifIsLoading } = useExerciseGif(exerciseName, {
        exerciseId: exercise?.id,
        exerciseDbId: exercise?.exerciseDbId,
        exerciseDbName: exercise?.exerciseDbName,
        exerciseDbAliases: exercise?.exerciseDbAliases,
        gifUrl: exercise?.gifUrl,
        fallbackGifUrl: exercise?.imagenUrl,
        grupoMuscularPrimario: exercise?.grupoMuscularPrimario,
        enabled: true,
        cacheBuster: gifCacheBuster,
    })

    return (
        <div className="space-y-4 bg-gym-card border border-gym-border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-gym-card-2 border border-gym-border rounded-xl p-3">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="rounded-lg border border-gym-border px-3 py-1 text-xs text-gym-text-base hover:bg-gym-card"
                >
                    {t('training.exerciseCard.previous')}
                </button>
                <p className="text-xs text-gym-text-dim">
                    {t('training.exerciseCard.exerciseCount', { current: activeExerciseIndex + 1, total: totalExercises })}
                </p>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-lg border border-gym-border px-3 py-1 text-xs text-gym-text-base hover:bg-gym-card"
                >
                    {t('training.exerciseCard.next')}
                </button>
            </div>

            <div className="space-y-3">
                <div className="bg-gym-black border border-gym-border rounded-xl overflow-hidden h-[200px] relative">
                    {(gifIsLoading || !resolvedGifUrl) && (
                        <div className="absolute inset-0 animate-pulse bg-gym-card-2" />
                    )}
                    {resolvedGifUrl && (
                        <img
                            src={resolvedGifUrl}
                            alt={t('training.exerciseCard.gifAlt', { name: exerciseName })}
                            className="h-full w-full object-contain bg-gym-black"
                            loading="lazy"
                        />
                    )}
                </div>

                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="font-display text-2xl text-gym-yellow uppercase tracking-wider truncate">
                            {exerciseName}
                        </div>
                        <div className="mt-1 text-gym-text-dim text-xs">
                            {t('training.exerciseCard.seriesRepsLine', { series: activeRoutineExercise.series, reps: activeRoutineExercise.repeticiones })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            try {
                                globalThis.localStorage?.removeItem(`gifcache_v2_${cacheKey}`)
                            } catch {
                                // ignore
                            }
                            setGifCacheBuster(Date.now())
                        }}
                        className="shrink-0 rounded-lg border border-gym-yellow text-gym-yellow px-3 py-2 text-xs font-semibold hover:bg-gym-yellow/10"
                    >
                        {t('training.exerciseCard.gifIncorrect')}
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: activeRoutineExercise.series }, (_, setIndex) => {
                        const serieNumero = setIndex + 1
                        const current = getSetValue(activeRoutineExercise.id, serieNumero)
                        const isDone = (current.reps ?? 0) > 0 && (current.peso ?? 0) > 0
                        return (
                            <div
                                key={`chip-${activeRoutineExercise.id}-${serieNumero}`}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${isDone
                                    ? 'bg-gym-yellow text-black'
                                    : 'border border-gym-yellow text-gym-yellow'
                                    }`}
                            >
                                {t('training.exerciseCard.setChip', { number: serieNumero })}
                            </div>
                        )
                    })}
                </div>
            </div>
            {previousSession && (
                <p className="text-xs text-gym-text-dim">
                    {t('training.exerciseCard.lastRecord', { date: new Date(previousSession.fecha).toLocaleDateString() })}:{' '}
                    {previousSession.sets.map((set) => `S${set.serieNumero} ${set.repeticionesRealizadas}x${set.pesoUtilizado}kg`).join(' · ')}
                </p>
            )}

            {activeExerciseSuggestedWeight !== null && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        {t('training.exerciseCard.suggestedLoad')} <span className="font-semibold">{activeExerciseSuggestedWeight} kg</span>
                    </p>
                    <button
                        type="button"
                        onClick={onApplySuggestedWeight}
                        className="mt-2 rounded border border-emerald-400 px-2 py-1 text-[11px] text-emerald-700 dark:text-emerald-300"
                    >
                        {t('training.exerciseCard.applySuggestion')}
                    </button>
                </div>
            )}

            {activeExercisePrTarget && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-900 dark:bg-amber-950/20">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{t('training.exerciseCard.nextPrTarget')}</p>
                    {activeExercisePrTarget.targetPeso && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            {t('training.exerciseCard.maxWeight')}: <span className="font-semibold">{t('training.exerciseCard.beatValue', { value: `${activeExercisePrTarget.targetPeso} kg` })}</span>
                        </p>
                    )}
                    {activeExercisePrTarget.targetVolumenSerie && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            {t('training.exerciseCard.volumePerSet')}: <span className="font-semibold">{t('training.exerciseCard.beatValue', { value: activeExercisePrTarget.targetVolumenSerie })}</span>
                        </p>
                    )}
                    {activeExercisePrTarget.repsMismoPeso && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            {t('training.exerciseCard.repsSameWeight')}: {t('training.exerciseCard.beatValue', { value: activeExercisePrTarget.repsMismoPeso.valor })} ({activeExercisePrTarget.repsMismoPeso.detalle})
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {Array.from({ length: activeRoutineExercise.series }, (_, setIndex) => {
                    const serieNumero = setIndex + 1
                    const key = `${activeRoutineExercise.id}-${serieNumero}`
                    const current = getSetValue(activeRoutineExercise.id, serieNumero)
                    const currentSetType = current.type ?? 'normal'
                    const previousSet = previousSessionByExercise[activeRoutineExercise.ejercicioId]?.sets.find(
                        (set) => set.serieNumero === serieNumero,
                    )

                    return (
                        <div key={key} className={`rounded-md p-2 ${SET_TYPE_STYLES[currentSetType]}`}>
                            <p className="mb-2 text-xs font-medium">{t('training.exerciseCard.setNumber', { number: serieNumero })}</p>
                            {previousSet && (
                                <p className="mb-2 text-[11px] text-slate-600 dark:text-slate-300">
                                    {t('training.exerciseCard.previousSet')}: {previousSet.repeticionesRealizadas} {t('training.exerciseCard.repsShort')} · {previousSet.pesoUtilizado} kg
                                </p>
                            )}
                            <div className="grid grid-cols-1 gap-2">
                                <NumberStepper
                                    id={`${key}-reps`}
                                    label={t('training.repsPlaceholder')}
                                    value={current.reps}
                                    step={1}
                                    min={0}
                                    onChange={(value) =>
                                        updateSetData(activeRoutineExercise.id, serieNumero, 'reps', value)
                                    }
                                />
                                <NumberStepper
                                    id={`${key}-peso`}
                                    label={t('training.weightPlaceholder')}
                                    value={current.peso}
                                    step={0.5}
                                    min={0}
                                    decimals={1}
                                    onChange={(value) =>
                                        updateSetData(activeRoutineExercise.id, serieNumero, 'peso', value)
                                    }
                                />
                                <div className="space-y-1">
                                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Tipo</span>
                                    <div className="grid grid-cols-4 gap-1">
                                        {(Object.keys(SET_TYPE_LABELS) as WorkoutSetType[]).map((typeOption) => {
                                            const isActive = currentSetType === typeOption
                                            return (
                                                <button
                                                    key={typeOption}
                                                    type="button"
                                                    onClick={() =>
                                                        updateSetData(activeRoutineExercise.id, serieNumero, 'type', typeOption)
                                                    }
                                                    className={`h-8 rounded border text-[11px] font-semibold transition ${isActive
                                                            ? SET_TYPE_STYLES[typeOption]
                                                            : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-300'
                                                        }`}
                                                    title={typeOption}
                                                >
                                                    {SET_TYPE_LABELS[typeOption]}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor={`${key}-rpe`} className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                        {t('training.exerciseCard.rpeLabel')}
                                    </label>
                                    <input
                                        id={`${key}-rpe`}
                                        type="number"
                                        min={1}
                                        max={10}
                                        step={0.5}
                                        value={current.rpe ?? ''}
                                        placeholder="7.5"
                                        onChange={(event) =>
                                            updateSetData(
                                                activeRoutineExercise.id,
                                                serieNumero,
                                                'rpe',
                                                Number(event.target.value) || 0,
                                            )
                                        }
                                        className={`h-9 w-full rounded border px-2 text-xs ${(current.rpe ?? 0) >= 9
                                            ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300'
                                            : (current.rpe ?? 0) >= 6
                                                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300'
                                                : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300'
                                            }`}
                                    />
                                </div>
                                <OneRepMaxBadge weight={current.peso} reps={current.reps} />
                            </div>
                            <button
                                type="button"
                                onClick={() => onStartRestTimer(activeRoutineExercise.descansoSegundos)}
                                className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                            >
                                {t('training.exerciseCard.startRest', { seconds: activeRoutineExercise.descansoSegundos })}
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <p className="mb-2 text-xs font-semibold">{t('training.exerciseCard.recentHistory')}</p>
                {activeExerciseHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-300">{t('training.exerciseCard.noHistory')}</p>
                ) : (
                    <ul className="space-y-1 text-xs">
                        {activeExerciseHistory.map((session) => (
                            <li
                                key={`${activeRoutineExercise.ejercicioId}-${session.fecha}`}
                                className="rounded border border-slate-200 p-2 dark:border-slate-700"
                            >
                                <p className="font-medium">
                                    {new Date(session.fecha).toLocaleDateString()} · {session.volume.toFixed(0)} kg
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    {session.sets
                                        .map((set) => `S${set.serieNumero} ${set.repeticionesRealizadas}x${set.pesoUtilizado}kg`)
                                        .join(' · ')}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
