import type {
    ActiveExercisePrTarget,
    ActiveRoutineExercise,
    ExerciseHistoryEntry,
    PreviousExerciseSession,
    SetData,
} from './types'

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
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={current.reps}
                                    onChange={(event) =>
                                        updateSetData(
                                            activeRoutineExercise.id,
                                            serieNumero,
                                            'reps',
                                            Number(event.target.value) || 0,
                                        )
                                    }
                                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                                    placeholder="Reps"
                                />
                                <input
                                    type="number"
                                    step="0.5"
                                    value={current.peso}
                                    onChange={(event) =>
                                        updateSetData(
                                            activeRoutineExercise.id,
                                            serieNumero,
                                            'peso',
                                            Number(event.target.value) || 0,
                                        )
                                    }
                                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                                    placeholder="Peso"
                                />
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
