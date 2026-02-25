import type {
    ActiveExercisePrTarget,
    ActiveRoutineExercise,
    ExerciseHistoryEntry,
    PreviousExerciseSession,
    SetData,
} from './types'
import { NumberStepper } from '../ui/NumberStepper'
import { OneRepMaxBadge } from './OneRepMaxBadge'

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
    updateSetData: (routineExerciseId: string, serieNumero: number, field: keyof SetData, value: number) => void
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
    if (!activeRoutineExercise) {
        return null
    }

    const previousSession = previousSessionByExercise[activeRoutineExercise.ejercicioId]

    return (
        <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                >
                    Anterior
                </button>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                    Ejercicio {activeExerciseIndex + 1} de {totalExercises}
                </p>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                >
                    Siguiente
                </button>
            </div>

            <p className="text-sm font-medium">
                {activeExerciseIndex + 1}. {activeRoutineExercise.ejercicio?.nombre || 'Ejercicio'} · {activeRoutineExercise.series}{' '}
                series · objetivo {activeRoutineExercise.repeticiones}
            </p>
            {previousSession && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                    Último registro ({new Date(previousSession.fecha).toLocaleDateString()}):{' '}
                    {previousSession.sets.map((set) => `S${set.serieNumero} ${set.repeticionesRealizadas}x${set.pesoUtilizado}kg`).join(' · ')}
                </p>
            )}

            {activeExerciseSuggestedWeight !== null && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Carga sugerida: <span className="font-semibold">{activeExerciseSuggestedWeight} kg</span>
                    </p>
                    <button
                        type="button"
                        onClick={onApplySuggestedWeight}
                        className="mt-2 rounded border border-emerald-400 px-2 py-1 text-[11px] text-emerald-700 dark:text-emerald-300"
                    >
                        Aplicar sugerencia a todas las series
                    </button>
                </div>
            )}

            {activeExercisePrTarget && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-900 dark:bg-amber-950/20">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Siguiente objetivo PR</p>
                    {activeExercisePrTarget.targetPeso && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Peso máximo: superar <span className="font-semibold">{activeExercisePrTarget.targetPeso} kg</span>
                        </p>
                    )}
                    {activeExercisePrTarget.targetVolumenSerie && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Volumen por serie: superar <span className="font-semibold">{activeExercisePrTarget.targetVolumenSerie}</span>
                        </p>
                    )}
                    {activeExercisePrTarget.repsMismoPeso && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Repeticiones mismo peso: superar <span className="font-semibold">{activeExercisePrTarget.repsMismoPeso.valor}</span> ({activeExercisePrTarget.repsMismoPeso.detalle})
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {Array.from({ length: activeRoutineExercise.series }, (_, setIndex) => {
                    const serieNumero = setIndex + 1
                    const key = `${activeRoutineExercise.id}-${serieNumero}`
                    const current = getSetValue(activeRoutineExercise.id, serieNumero)
                    const previousSet = previousSessionByExercise[activeRoutineExercise.ejercicioId]?.sets.find(
                        (set) => set.serieNumero === serieNumero,
                    )

                    return (
                        <div key={key} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                            <p className="mb-2 text-xs font-medium">Serie {serieNumero}</p>
                            {previousSet && (
                                <p className="mb-2 text-[11px] text-slate-600 dark:text-slate-300">
                                    Anterior: {previousSet.repeticionesRealizadas} reps · {previousSet.pesoUtilizado} kg
                                </p>
                            )}
                            <div className="grid grid-cols-1 gap-2">
                                <NumberStepper
                                    id={`${key}-reps`}
                                    label="Reps"
                                    value={current.reps}
                                    step={1}
                                    min={0}
                                    onChange={(value) =>
                                        updateSetData(activeRoutineExercise.id, serieNumero, 'reps', value)
                                    }
                                />
                                <NumberStepper
                                    id={`${key}-peso`}
                                    label="Peso (kg)"
                                    value={current.peso}
                                    step={0.5}
                                    min={0}
                                    decimals={1}
                                    onChange={(value) =>
                                        updateSetData(activeRoutineExercise.id, serieNumero, 'peso', value)
                                    }
                                />
                                <div className="space-y-1">
                                    <label htmlFor={`${key}-rpe`} className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                        RPE
                                    </label>
                                    <select
                                        id={`${key}-rpe`}
                                        value={current.rpe ?? ''}
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
                                    >
                                        <option value="">RPE (1-10)</option>
                                        {Array.from({ length: 10 }, (_, idx) => idx + 1).map((rpeValue) => (
                                            <option key={rpeValue} value={rpeValue}>{rpeValue}</option>
                                        ))}
                                    </select>
                                </div>
                                <OneRepMaxBadge weight={current.peso} reps={current.reps} />
                            </div>
                            <button
                                type="button"
                                onClick={() => onStartRestTimer(activeRoutineExercise.descansoSegundos)}
                                className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                            >
                                Iniciar descanso ({activeRoutineExercise.descansoSegundos}s)
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <p className="mb-2 text-xs font-semibold">Historial reciente del ejercicio</p>
                {activeExerciseHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-300">Aún no hay sesiones previas de este ejercicio.</p>
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
