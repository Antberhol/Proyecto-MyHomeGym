import { zodResolver } from '@hookform/resolvers/zod'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type {
    ActiveExercisePrTarget,
    ExerciseHistoryEntry,
    PreviousExerciseSession,
    SetData,
} from '../components/workout/types'
import { useAudioFeedback } from './useAudioFeedback'
import { useHaptic } from './useHaptic'
import { getPersistedWorkoutSession, usePersistedWorkoutSession } from './usePersistedWorkoutSession'
import { useWorkoutTimer } from './useWorkoutTimer'
import { registerSetPrs, registerTrainingVolumePr } from '../lib/prs'
import { shareWorkoutResult } from '../lib/shareWorkoutResult'
import { routineRepository } from '../repositories/routineRepository'
import { workoutRepository } from '../repositories/workoutRepository'
import type { PerformedExercise } from '../types/models'
import { calculateSetVolume } from '../utils/calculations'
import type { WorkoutShareData } from '../components/share/WorkoutShareCard'

const trainingSchema = z.object({
    rutinaId: z.string().optional(),
    duracionMinutos: z.coerce.number().min(1).max(300),
    volumenTotalManual: z.coerce.number().min(0).max(100000).optional(),
    notas: z.string().max(300).optional(),
})

type TrainingFormInput = z.input<typeof trainingSchema>
type TrainingFormOutput = z.output<typeof trainingSchema>

type TrainingView = 'selection' | 'active' | 'summary'

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

function parseInputNumber(raw: string): number {
    const normalized = raw.replace(',', '.').trim()
    if (!normalized) return 0
    const parsed = Number(normalized)
    if (!Number.isFinite(parsed)) return 0
    return Number(parsed.toString())
}

export function useActiveWorkoutController() {
    useAudioFeedback()
    useHaptic()

    const persistedSession = getPersistedWorkoutSession()
    const hasPersistedSession = Boolean(
        persistedSession
        && (
            persistedSession.selectedRoutineId
            || Object.keys(persistedSession.setData ?? {}).length > 0
            || (persistedSession.sessionSeconds ?? 0) > 0
            || (persistedSession.activeExerciseIndex ?? 0) > 0
        ),
    )

    const routinesData = useLiveQuery(() => routineRepository.listRoutines(), [])
    const routineExercisesData = useLiveQuery(() => routineRepository.listRoutineExercises(), [])
    const exercisesData = useLiveQuery(() => routineRepository.listExercises(), [])
    const performedExercisesData = useLiveQuery(() => routineRepository.listPerformedExercises(), [])
    const prsData = useLiveQuery(() => routineRepository.listPersonalRecords(), [])

    const routines = useMemo(() => routinesData ?? [], [routinesData])
    const routineExercises = useMemo(() => routineExercisesData ?? [], [routineExercisesData])
    const exercises = useMemo(() => exercisesData ?? [], [exercisesData])
    const performedExercises = useMemo(() => performedExercisesData ?? [], [performedExercisesData])
    const prs = useMemo(() => prsData ?? [], [prsData])

    const [view, setView] = useState<TrainingView>(hasPersistedSession ? 'active' : 'selection')
    const [setData, setSetData] = useState<Record<string, SetData>>(persistedSession?.setData ?? {})
    const [lastSavedMessage, setLastSavedMessage] = useState<string>('')
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(Math.max(0, persistedSession?.activeExerciseIndex ?? 0))
    const [trainingSummary, setTrainingSummary] = useState<TrainingSummary | null>(null)
    const [freeExerciseId, setFreeExerciseId] = useState('')
    const [freeSeriesCount, setFreeSeriesCount] = useState(3)
    const [freeExercisesDraft, setFreeExercisesDraft] = useState<FreeExerciseDraft[]>([])
    const [isPlateCalculatorOpen, setIsPlateCalculatorOpen] = useState(false)

    const {
        sessionSeconds,
        sessionRunning,
        setSessionRunning,
        toggleSessionRunning,
        restSeconds,
        setRestSeconds,
        startRestTimer,
        resetTimers,
        formatClock,
    } = useWorkoutTimer({
        initialSessionSeconds: persistedSession?.sessionSeconds ?? 0,
        initialSessionRunning: false,
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

    useEffect(() => {
        if (view === 'active') {
            setSessionRunning(true)
            return
        }

        setSessionRunning(false)
    }, [setSessionRunning, view])

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
                    rpe: previous?.rpe,
                }
            }

            return acc
        }, {})
    }, [previousSessionByExercise, selectedRoutineExercises, selectedRoutineId])

    const applySessionTimeToDuration = () => {
        const minutes = Math.max(1, Math.ceil(sessionSeconds / 60))
        form.setValue('duracionMinutos', minutes)
    }

    const startRoutine = (routineId: string) => {
        form.setValue('rutinaId', routineId)
        setTrainingSummary(null)
        setLastSavedMessage('')
        setActiveExerciseIndex(0)
        setView('active')
    }

    const startFreeTraining = () => {
        form.setValue('rutinaId', '')
        setTrainingSummary(null)
        setLastSavedMessage('')
        setActiveExerciseIndex(0)
        setView('active')
    }

    const exitToSelection = () => {
        setTrainingSummary(null)
        setSetData({})
        setFreeExercisesDraft([])
        setFreeExerciseId('')
        setFreeSeriesCount(3)
        setActiveExerciseIndex(0)
        setLastSavedMessage('')
        form.reset({
            rutinaId: '',
            duracionMinutos: 45,
            volumenTotalManual: 0,
            notas: '',
        })
        resetTimers()
        setSessionRunning(false)
        clearSession()
        setView('selection')
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

    const updateFreeSetData = (draftId: string, setIndex: number, field: keyof SetData, rawValue: string) => {
        const value = parseInputNumber(rawValue)
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
                rpe: field === 'rpe'
                    ? (value > 0 ? value : undefined)
                    : (current[key]?.rpe ?? prefilledSetData[key]?.rpe),
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
                    rpe: current[key]?.rpe ?? prefilledSetData[key]?.rpe,
                }
            }
            return updated
        })
    }

    const onSubmit = form.handleSubmit(async (values) => {
        setSessionRunning(false)

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
                    rpe: serie?.rpe && serie.rpe > 0 ? serie.rpe : undefined,
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
                        rpe: set.rpe && set.rpe > 0 ? set.rpe : undefined,
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

        await workoutRepository.createCompletedTraining(
            {
                id: trainingId,
                rutinaId: values.rutinaId || undefined,
                fecha: now,
                duracionMinutos: values.duracionMinutos,
                notas: values.notas,
                completado: true,
                volumenTotal,
            },
            performed,
        )

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

        setSetData({})
        setFreeExercisesDraft([])
        setFreeExerciseId('')
        setFreeSeriesCount(3)
        setRestSeconds(0)
        setActiveExerciseIndex(0)
        clearSession()
        setView('summary')
    })

    const sharePreviewData = useMemo<WorkoutShareData | null>(() => {
        if (!trainingSummary) return null

        return {
            totalVolume: trainingSummary.totalVolume,
            durationMinutes: trainingSummary.durationMinutes,
            prsCreated: trainingSummary.prsCreated,
            setCount: trainingSummary.setCount,
            dateLabel: new Date().toLocaleDateString(),
        }
    }, [trainingSummary])

    const onShareSummary = async () => {
        if (!sharePreviewData) return

        try {
            const status = await shareWorkoutResult(sharePreviewData)
            setLastSavedMessage(status === 'shared' ? 'Resumen compartido con éxito.' : 'Imagen del resumen descargada.')
        } catch {
            setLastSavedMessage('No se pudo compartir el resumen. Instala html2canvas o revisa permisos del dispositivo.')
        }
    }

    const openPlateCalculator = () => setIsPlateCalculatorOpen(true)
    const closePlateCalculator = () => setIsPlateCalculatorOpen(false)

    return {
        form,
        view,
        routines,
        exercises,
        selectedRoutineExercises,
        activeRoutineExercise,
        activeExerciseIndex,
        previousSessionByExercise,
        activeExerciseHistory,
        activeExerciseSuggestedWeight,
        activeExercisePrTarget,
        setData,
        freeExerciseId,
        freeSeriesCount,
        freeExercisesDraft,
        trainingSummary,
        lastSavedMessage,
        sharePreviewData,
        sessionSeconds,
        sessionRunning,
        restSeconds,
        formatClock,
        isPlateCalculatorOpen,
        startRoutine,
        startFreeTraining,
        exitToSelection,
        applySessionTimeToDuration,
        toggleSessionRunning,
        startRestTimer,
        setRestSeconds,
        onSubmit,
        onShareSummary,
        getSetValue,
        updateSetData,
        applySuggestedWeight,
        setActiveExerciseIndex,
        setFreeExerciseId,
        setFreeSeriesCount,
        addFreeExerciseDraft,
        addFreeSet,
        removeFreeExerciseDraft,
        removeFreeSet,
        updateFreeSetData,
        openPlateCalculator,
        closePlateCalculator,
    }
}
