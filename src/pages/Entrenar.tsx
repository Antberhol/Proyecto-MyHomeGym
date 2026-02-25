import { zodResolver } from '@hookform/resolvers/zod'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { ActiveExerciseCard } from '../components/workout/ActiveExerciseCard'
import { RestTimerOverlay } from '../components/workout/RestTimerOverlay'
import type {
  ActiveExercisePrTarget,
  ExerciseHistoryEntry,
  PreviousExerciseSession,
  SetData,
} from '../components/workout/types'
import { WorkoutControls } from '../components/workout/WorkoutControls'
import { getPersistedWorkoutSession, usePersistedWorkoutSession } from '../hooks/usePersistedWorkoutSession'
import { useWorkoutTimer } from '../hooks/useWorkoutTimer'
import { db } from '../lib/db'
import { registerSetPrs, registerTrainingVolumePr } from '../lib/prs'
import type { PerformedExercise } from '../types/models'
import { calculateSetVolume } from '../utils/calculations'

const trainingSchema = z.object({
  rutinaId: z.string().optional(),
  duracionMinutos: z.coerce.number().min(1).max(300),
  volumenTotalManual: z.coerce.number().min(0).max(100000).optional(),
  notas: z.string().max(300).optional(),
})

type TrainingFormInput = z.input<typeof trainingSchema>
type TrainingFormOutput = z.output<typeof trainingSchema>

interface TrainingSummary {
  durationMinutes: number
  totalVolume: number
  setCount: number
  prsCreated: number
  byExercise: Array<{
    exerciseId: string
    name: string
    volume: number
    sets: number
  }>
}

interface FreeExerciseDraft {
  id: string
  ejercicioId: string
  sets: SetData[]
}

function parseTargetReps(target: string): { min: number; max: number } | null {
  const match = target.match(/(\d+)\s*-\s*(\d+)/)
  if (!match) return null
  return {
    min: Number(match[1]),
    max: Number(match[2]),
  }
}

export function EntrenarPage() {
  const persistedSession = getPersistedWorkoutSession()
  const routinesData = useLiveQuery(() => db.rutinas.toArray(), [])
  const routineExercisesData = useLiveQuery(() => db.rutinaEjercicios.toArray(), [])
  const exercisesData = useLiveQuery(() => db.ejerciciosCatalogo.toArray(), [])
  const performedExercisesData = useLiveQuery(() => db.ejerciciosRealizados.toArray(), [])
  const prsData = useLiveQuery(() => db.prs.toArray(), [])
  const routines = useMemo(() => routinesData ?? [], [routinesData])
  const routineExercises = useMemo(() => routineExercisesData ?? [], [routineExercisesData])
  const exercises = useMemo(() => exercisesData ?? [], [exercisesData])
  const performedExercises = useMemo(() => performedExercisesData ?? [], [performedExercisesData])
  const prs = useMemo(() => prsData ?? [], [prsData])
  const [setData, setSetData] = useState<Record<string, SetData>>(persistedSession?.setData ?? {})
  const [lastSavedMessage, setLastSavedMessage] = useState<string>('')
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(Math.max(0, persistedSession?.activeExerciseIndex ?? 0))
  const [trainingSummary, setTrainingSummary] = useState<TrainingSummary | null>(null)
  const [freeExerciseId, setFreeExerciseId] = useState('')
  const [freeSeriesCount, setFreeSeriesCount] = useState(3)
  const [freeExercisesDraft, setFreeExercisesDraft] = useState<FreeExerciseDraft[]>([])
  const {
    sessionSeconds,
    sessionRunning,
    toggleSessionRunning,
    restSeconds,
    setRestSeconds,
    startRestTimer,
    resetTimers,
    formatClock,
  } = useWorkoutTimer({
    initialSessionSeconds: persistedSession?.sessionSeconds ?? 0,
    initialSessionRunning: true,
    initialRestSeconds: 0,
  })

  const form = useForm<TrainingFormInput, undefined, TrainingFormOutput>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      rutinaId: persistedSession?.selectedRoutineId ?? '',
      duracionMinutos: 45,
      volumenTotalManual: 0,
    },
  })

  const selectedRoutineId = useWatch({ control: form.control, name: 'rutinaId' }) || ''

  const { clearSession } = usePersistedWorkoutSession({
    selectedRoutineId,
    setData,
    sessionSeconds,
    activeExerciseIndex,
  })

  const selectedRoutineExercises = useMemo(() => {
    if (!selectedRoutineId) return []

    return routineExercises
      .filter((item) => item.rutinaId === selectedRoutineId)
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        ...item,
        ejercicio: exercises.find((exercise) => exercise.id === item.ejercicioId),
      }))
  }, [exercises, routineExercises, selectedRoutineId])

  const activeRoutineExercise = selectedRoutineExercises[activeExerciseIndex]

  const previousSessionByExercise = useMemo(() => {
    const grouped = performedExercises.reduce<Record<string, PerformedExercise[]>>((acc, item) => {
      if (!acc[item.ejercicioId]) {
        acc[item.ejercicioId] = []
      }
      acc[item.ejercicioId].push(item)
      return acc
    }, {})

    return Object.entries(grouped).reduce<Record<string, PreviousExerciseSession>>((acc, [exerciseId, entries]) => {
      const latestFecha = entries.reduce((latest, item) => {
        return item.fecha > latest ? item.fecha : latest
      }, entries[0].fecha)

      const latestSets = entries
        .filter((item) => item.fecha === latestFecha)
        .slice()
        .sort((a, b) => a.serieNumero - b.serieNumero)

      acc[exerciseId] = {
        fecha: latestFecha,
        sets: latestSets,
      }

      return acc
    }, {})
  }, [performedExercises])

  const exerciseHistoryByExercise = useMemo(() => {
    const groupedByExercise = performedExercises.reduce<Record<string, Record<string, PerformedExercise[]>>>((acc, item) => {
      if (!acc[item.ejercicioId]) {
        acc[item.ejercicioId] = {}
      }
      if (!acc[item.ejercicioId][item.fecha]) {
        acc[item.ejercicioId][item.fecha] = []
      }
      acc[item.ejercicioId][item.fecha].push(item)
      return acc
    }, {})

    return Object.entries(groupedByExercise).reduce<Record<string, ExerciseHistoryEntry[]>>((acc, [exerciseId, byDate]) => {
      const sessions = Object.entries(byDate)
        .map(([fecha, sets]) => {
          const sortedSets = sets.slice().sort((a, b) => a.serieNumero - b.serieNumero)
          const volume = sortedSets.reduce(
            (total, set) => total + calculateSetVolume(set.pesoUtilizado, set.repeticionesRealizadas),
            0,
          )
          return {
            fecha,
            volume,
            sets: sortedSets,
          }
        })
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))

      acc[exerciseId] = sessions
      return acc
    }, {})
  }, [performedExercises])

  const activeExerciseHistory = activeRoutineExercise
    ? (exerciseHistoryByExercise[activeRoutineExercise.ejercicioId] ?? []).slice(0, 5)
    : []

  const activeExerciseSuggestedWeight = useMemo(() => {
    if (!activeRoutineExercise) return null

    const latestSession = previousSessionByExercise[activeRoutineExercise.ejercicioId]
    if (!latestSession || latestSession.sets.length === 0) return null

    const averageWeight =
      latestSession.sets.reduce((sum, set) => sum + set.pesoUtilizado, 0) / Math.max(1, latestSession.sets.length)

    const targetRange = parseTargetReps(activeRoutineExercise.repeticiones)
    if (!targetRange) return Number(averageWeight.toFixed(1))

    const reachedMaxRange = latestSession.sets.every((set) => set.repeticionesRealizadas >= targetRange.max)
    const suggestedWeight = reachedMaxRange ? averageWeight + 2.5 : averageWeight
    return Number(suggestedWeight.toFixed(1))
  }, [activeRoutineExercise, previousSessionByExercise])

  const activeExercisePrTarget = useMemo<ActiveExercisePrTarget | null>(() => {
    if (!activeRoutineExercise) return null

    const exercisePrs = prs.filter((pr) => pr.ejercicioId === activeRoutineExercise.ejercicioId)

    const maxPeso = exercisePrs
      .filter((pr) => pr.tipo === 'peso_maximo')
      .reduce((max, pr) => Math.max(max, pr.valor), 0)

    const maxVolumenSerie = exercisePrs
      .filter((pr) => pr.tipo === 'volumen_serie')
      .reduce((max, pr) => Math.max(max, pr.valor), 0)

    const repsMismoPeso = exercisePrs
      .filter((pr) => pr.tipo === 'reps_mismo_peso')
      .sort((a, b) => b.valor - a.valor)[0]

    const targetPeso = maxPeso > 0 ? Number((maxPeso + 2.5).toFixed(1)) : activeExerciseSuggestedWeight
    const targetVolumenSerie = maxVolumenSerie > 0 ? Number((maxVolumenSerie * 1.05).toFixed(1)) : null

    return {
      targetPeso,
      targetVolumenSerie,
      repsMismoPeso,
    }
  }, [activeExerciseSuggestedWeight, activeRoutineExercise, prs])

  const prefilledSetData = useMemo(() => {
    if (!selectedRoutineId || selectedRoutineExercises.length === 0) {
      return {}
    }

    return selectedRoutineExercises.reduce<Record<string, SetData>>((acc, routineExercise) => {
      const previousSets = previousSessionByExercise[routineExercise.ejercicioId]?.sets ?? []

      for (let index = 1; index <= routineExercise.series; index += 1) {
        const key = `${routineExercise.id}-${index}`
        const previous = previousSets.find((set) => set.serieNumero === index)
        acc[key] = {
          reps: previous?.repeticionesRealizadas ?? 0,
          peso: previous?.pesoUtilizado ?? 0,
        }
      }

      return acc
    }, {})
  }, [previousSessionByExercise, selectedRoutineExercises, selectedRoutineId])

  const applySessionTimeToDuration = () => {
    const minutes = Math.max(1, Math.ceil(sessionSeconds / 60))
    form.setValue('duracionMinutos', minutes)
  }

  const addFreeExerciseDraft = () => {
    if (!freeExerciseId) return

    const initialSets = Array.from({ length: Math.max(1, freeSeriesCount) }, () => ({ reps: 0, peso: 0 }))
    setFreeExercisesDraft((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        ejercicioId: freeExerciseId,
        sets: initialSets,
      },
    ])
    setFreeExerciseId('')
  }

  const removeFreeExerciseDraft = (draftId: string) => {
    setFreeExercisesDraft((current) => current.filter((item) => item.id !== draftId))
  }

  const addFreeSet = (draftId: string) => {
    setFreeExercisesDraft((current) =>
      current.map((item) =>
        item.id === draftId
          ? {
            ...item,
            sets: [...item.sets, { reps: 0, peso: 0 }],
          }
          : item,
      ),
    )
  }

  const removeFreeSet = (draftId: string, setIndex: number) => {
    setFreeExercisesDraft((current) =>
      current.map((item) => {
        if (item.id !== draftId) return item
        const nextSets = item.sets.filter((_, index) => index !== setIndex)
        return {
          ...item,
          sets: nextSets.length > 0 ? nextSets : [{ reps: 0, peso: 0 }],
        }
      }),
    )
  }

  const updateFreeSetData = (draftId: string, setIndex: number, field: keyof SetData, value: number) => {
    setFreeExercisesDraft((current) =>
      current.map((item) => {
        if (item.id !== draftId) return item

        return {
          ...item,
          sets: item.sets.map((set, index) => {
            if (index !== setIndex) return set
            return {
              reps: field === 'reps' ? value : set.reps,
              peso: field === 'peso' ? value : set.peso,
            }
          }),
        }
      }),
    )
  }

  const getSetValue = (routineExerciseId: string, serieNumero: number): SetData => {
    const key = `${routineExerciseId}-${serieNumero}`
    return setData[key] ?? prefilledSetData[key] ?? { reps: 0, peso: 0 }
  }

  const updateSetData = (routineExerciseId: string, serieNumero: number, field: keyof SetData, value: number) => {
    const key = `${routineExerciseId}-${serieNumero}`
    setSetData((current) => ({
      ...current,
      [key]: {
        reps: field === 'reps' ? value : (current[key]?.reps ?? prefilledSetData[key]?.reps ?? 0),
        peso: field === 'peso' ? value : (current[key]?.peso ?? prefilledSetData[key]?.peso ?? 0),
      },
    }))
  }

  const applySuggestedWeight = () => {
    if (!activeRoutineExercise || activeExerciseSuggestedWeight === null) return

    setSetData((current) => {
      const updated = { ...current }
      for (let setIndex = 1; setIndex <= activeRoutineExercise.series; setIndex += 1) {
        const key = `${activeRoutineExercise.id}-${setIndex}`
        updated[key] = {
          reps: current[key]?.reps ?? prefilledSetData[key]?.reps ?? 0,
          peso: activeExerciseSuggestedWeight,
        }
      }
      return updated
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const now = new Date().toISOString()
    const trainingId = crypto.randomUUID()

    const performedFromRoutine = selectedRoutineExercises.flatMap((routineExercise) => {
      const sets = Array.from({ length: routineExercise.series }, (_, index) => {
        const serieNumero = index + 1
        const serie = getSetValue(routineExercise.id, serieNumero)
        const reps = Number(serie?.reps ?? 0)
        const peso = Number(serie?.peso ?? 0)

        if (reps <= 0 || peso < 0) {
          return null
        }

        return {
          id: crypto.randomUUID(),
          entrenamientoId: trainingId,
          ejercicioId: routineExercise.ejercicioId,
          serieNumero,
          repeticionesRealizadas: reps,
          pesoUtilizado: peso,
          fecha: now,
        }
      })

      return sets.filter((item): item is NonNullable<typeof item> => item !== null)
    })

    const performedFromFree = freeExercisesDraft.flatMap((draft) =>
      draft.sets
        .map((set, index) => {
          const reps = Number(set.reps ?? 0)
          const peso = Number(set.peso ?? 0)

          if (!draft.ejercicioId || reps <= 0 || peso < 0) {
            return null
          }

          return {
            id: crypto.randomUUID(),
            entrenamientoId: trainingId,
            ejercicioId: draft.ejercicioId,
            serieNumero: index + 1,
            repeticionesRealizadas: reps,
            pesoUtilizado: peso,
            fecha: now,
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    )

    const performed = selectedRoutineExercises.length > 0 ? performedFromRoutine : performedFromFree

    const volumenCalculado = performed.reduce((total, item) => {
      return total + calculateSetVolume(item.pesoUtilizado, item.repeticionesRealizadas)
    }, 0)

    const volumenTotal = performed.length > 0
      ? volumenCalculado
      : Number(values.volumenTotalManual ?? 0)

    await db.entrenamientosRegistrados.add({
      id: trainingId,
      rutinaId: values.rutinaId || undefined,
      fecha: now,
      duracionMinutos: values.duracionMinutos,
      notas: values.notas,
      completado: true,
      volumenTotal,
    })

    if (performed.length > 0) {
      await db.ejerciciosRealizados.bulkAdd(performed)
    }

    let prsCreated = 0
    for (const item of performed) {
      prsCreated += await registerSetPrs(item.ejercicioId, item.pesoUtilizado, item.repeticionesRealizadas, now)
    }
    prsCreated += await registerTrainingVolumePr(volumenTotal, now)

    const byExerciseMap = performed.reduce<Record<string, { volume: number; sets: number }>>((acc, item) => {
      const current = acc[item.ejercicioId] ?? { volume: 0, sets: 0 }
      acc[item.ejercicioId] = {
        volume: current.volume + calculateSetVolume(item.pesoUtilizado, item.repeticionesRealizadas),
        sets: current.sets + 1,
      }
      return acc
    }, {})

    const byExercise = Object.entries(byExerciseMap)
      .map(([exerciseId, stats]) => ({
        exerciseId,
        name: exercises.find((exercise) => exercise.id === exerciseId)?.nombre || 'Ejercicio',
        volume: stats.volume,
        sets: stats.sets,
      }))
      .sort((a, b) => b.volume - a.volume)

    setTrainingSummary({
      durationMinutes: values.duracionMinutos,
      totalVolume: volumenTotal,
      setCount: performed.length,
      prsCreated,
      byExercise,
    })

    setLastSavedMessage(
      `Sesión guardada: ${performed.length} series registradas, volumen ${volumenTotal.toFixed(0)} kg, ${prsCreated} PRs nuevos.`,
    )

    form.reset({ duracionMinutos: 45, volumenTotalManual: 0, rutinaId: values.rutinaId })
    setSetData({})
    setFreeExercisesDraft([])
    setFreeExerciseId('')
    setFreeSeriesCount(3)
    resetTimers()
    setActiveExerciseIndex(0)
    clearSession()
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registrar entrenamiento</h1>

      <WorkoutControls
        sessionSeconds={sessionSeconds}
        sessionRunning={sessionRunning}
        restSeconds={restSeconds}
        formatClock={formatClock}
        onToggleSession={toggleSessionRunning}
        onApplySessionDuration={applySessionTimeToDuration}
        onStartRest={startRestTimer}
        onResetRest={() => setRestSeconds(0)}
        onFinishWorkout={() => {
          void onSubmit()
        }}
      />

      <RestTimerOverlay restSeconds={restSeconds} formatClock={formatClock} />

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark md:grid-cols-2">
        <select {...form.register('rutinaId')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900">
          <option value="">Entreno libre</option>
          {routines.map((routine) => (
            <option key={routine.id} value={routine.id}>
              {routine.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          {...form.register('duracionMinutos')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder="Duración (min)"
        />

        {selectedRoutineExercises.length === 0 && freeExercisesDraft.length === 0 && (
          <input
            type="number"
            {...form.register('volumenTotalManual')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Volumen total manual (kg)"
          />
        )}

        <input
          {...form.register('notas')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder="Notas"
        />

        {selectedRoutineExercises.length > 0 && (
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 md:col-span-2 dark:border-slate-700">
            <h2 className="text-base font-semibold">Entrenamiento guiado por rutina</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Campos autocompletados con el último registro de cada ejercicio. Puedes editarlos libremente.
            </p>
            <ActiveExerciseCard
              activeRoutineExercise={activeRoutineExercise}
              activeExerciseIndex={activeExerciseIndex}
              totalExercises={selectedRoutineExercises.length}
              previousSessionByExercise={previousSessionByExercise}
              activeExerciseHistory={activeExerciseHistory}
              activeExerciseSuggestedWeight={activeExerciseSuggestedWeight}
              activeExercisePrTarget={activeExercisePrTarget}
              onPrevious={() => setActiveExerciseIndex((current) => Math.max(0, current - 1))}
              onNext={() => setActiveExerciseIndex((current) => Math.min(selectedRoutineExercises.length - 1, current + 1))}
              onApplySuggestedWeight={applySuggestedWeight}
              onStartRestTimer={startRestTimer}
              getSetValue={getSetValue}
              updateSetData={updateSetData}
            />
          </div>
        )}

        {selectedRoutineExercises.length === 0 && (
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 md:col-span-2 dark:border-slate-700">
            <h2 className="text-base font-semibold">Registro detallado (entreno libre)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Añade ejercicios y registra cada serie con repeticiones y peso. Si no registras series, puedes usar el volumen manual.
            </p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <select
                value={freeExerciseId}
                onChange={(event) => setFreeExerciseId(event.target.value)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 md:col-span-2"
              >
                <option value="">Selecciona ejercicio</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={freeSeriesCount}
                onChange={(event) => setFreeSeriesCount(Math.max(1, Number(event.target.value) || 1))}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder="Series"
              />
              <button
                type="button"
                onClick={addFreeExerciseDraft}
                className="rounded border border-slate-300 px-2 py-1 text-xs"
              >
                Añadir ejercicio
              </button>
            </div>

            <div className="space-y-3">
              {freeExercisesDraft.map((draft) => {
                const exerciseName = exercises.find((exercise) => exercise.id === draft.ejercicioId)?.nombre || 'Ejercicio'
                return (
                  <div key={draft.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{exerciseName}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addFreeSet(draft.id)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px]"
                        >
                          + Serie
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFreeExerciseDraft(draft.id)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px] text-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {draft.sets.map((set, setIndex) => (
                        <div key={`${draft.id}-${setIndex + 1}`} className="rounded bg-slate-50 p-2 dark:bg-slate-800">
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-xs font-medium">Serie {setIndex + 1}</p>
                            <button
                              type="button"
                              onClick={() => removeFreeSet(draft.id, setIndex)}
                              className="text-[11px] text-red-600"
                            >
                              borrar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(event) =>
                                updateFreeSetData(draft.id, setIndex, 'reps', Number(event.target.value) || 0)
                              }
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                              placeholder="Reps"
                            />
                            <input
                              type="number"
                              step="0.5"
                              value={set.peso}
                              onChange={(event) =>
                                updateFreeSetData(draft.id, setIndex, 'peso', Number(event.target.value) || 0)
                              }
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                              placeholder="Peso"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {freeExercisesDraft.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-300">No has añadido ejercicios al registro libre.</p>
              )}
            </div>
          </div>
        )}

        <button type="submit" className="rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white md:col-span-2">
          Guardar sesión
        </button>
      </form>

      {lastSavedMessage && (
        <p className="rounded-lg bg-white p-3 text-sm text-slate-700 shadow dark:bg-gym-cardDark dark:text-slate-200">{lastSavedMessage}</p>
      )}

      {trainingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl space-y-4 rounded-xl bg-white p-5 shadow-xl dark:bg-gym-cardDark">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Resumen de entrenamiento</h2>
              <button
                type="button"
                onClick={() => setTrainingSummary(null)}
                className="rounded border border-slate-300 px-2 py-1 text-xs"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                Duración: <span className="font-semibold">{trainingSummary.durationMinutes} min</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                Volumen: <span className="font-semibold">{trainingSummary.totalVolume.toFixed(0)} kg</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                Series: <span className="font-semibold">{trainingSummary.setCount}</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                PRs nuevos: <span className="font-semibold">{trainingSummary.prsCreated}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Desglose por ejercicio</h3>
              {trainingSummary.byExercise.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">No hubo series registradas para mostrar desglose.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {trainingSummary.byExercise.map((item) => (
                    <li key={item.exerciseId} className="flex items-center justify-between rounded border border-slate-200 p-2 dark:border-slate-700">
                      <span>{item.name}</span>
                      <span>{item.sets} series · {item.volume.toFixed(0)} kg</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}