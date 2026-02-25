import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { calculateSetVolume } from '../utils/calculations'

export type MuscleData = {
    volume: number
    daysTrained: number
}

export type MuscleAnalytics = Record<string, MuscleData>

function normalizeKey(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()
}

function toDateKey(isoDate: string): string {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function mapGroupToMuscles(group: string): string[] {
    const normalized = normalizeKey(group)

    if (['pecho', 'pectoral', 'pectorales'].includes(normalized)) return ['pecho']
    if (['espalda', 'dorsales'].includes(normalized)) return ['espalda-alta', 'espalda-baja', 'trapecio']
    if (['trapecio'].includes(normalized)) return ['trapecio']
    if (['hombro', 'hombros', 'deltoides'].includes(normalized)) return ['hombros']
    if (['biceps'].includes(normalized)) return ['biceps']
    if (['triceps'].includes(normalized)) return ['triceps']
    if (['antebrazo', 'antebrazos'].includes(normalized)) return ['antebrazo']
    if (['core', 'abdomen', 'abdominales', 'abs'].includes(normalized)) return ['core']
    if (['oblicuos'].includes(normalized)) return ['oblicuos']
    if (['pierna', 'piernas'].includes(normalized)) return ['cuadriceps', 'isquiotibial', 'gluteo', 'gemelo']
    if (['cuadriceps'].includes(normalized)) return ['cuadriceps']
    if (['femorales', 'isquios', 'isquiotibial'].includes(normalized)) return ['isquiotibial']
    if (['gluteo', 'gluteos'].includes(normalized)) return ['gluteo']
    if (['gemelo', 'pantorrilla', 'pantorrillas'].includes(normalized)) return ['gemelo']
    if (['aductor'].includes(normalized)) return ['aductor']
    if (['abductor'].includes(normalized)) return ['abductor']

    return [normalized]
}

const DEFAULT_MUSCLE_ANALYTICS: MuscleAnalytics = {
    pecho: { volume: 0, daysTrained: 0 },
    hombros: { volume: 0, daysTrained: 0 },
    biceps: { volume: 0, daysTrained: 0 },
    triceps: { volume: 0, daysTrained: 0 },
    antebrazo: { volume: 0, daysTrained: 0 },
    core: { volume: 0, daysTrained: 0 },
    oblicuos: { volume: 0, daysTrained: 0 },
    trapecio: { volume: 0, daysTrained: 0 },
    'espalda-alta': { volume: 0, daysTrained: 0 },
    'espalda-baja': { volume: 0, daysTrained: 0 },
    cuadriceps: { volume: 0, daysTrained: 0 },
    isquiotibial: { volume: 0, daysTrained: 0 },
    gluteo: { volume: 0, daysTrained: 0 },
    gemelo: { volume: 0, daysTrained: 0 },
    aductor: { volume: 0, daysTrained: 0 },
    abductor: { volume: 0, daysTrained: 0 },
}

export function useWeeklyMuscleAnalytics(): MuscleAnalytics {
    const data = useLiveQuery(async () => {
        const since = new Date()
        since.setDate(since.getDate() - 7)

        const [sets, exercises] = await Promise.all([
            db.ejerciciosRealizados.where('fecha').aboveOrEqual(since.toISOString()).toArray(),
            db.ejerciciosCatalogo.toArray(),
        ])

        const exerciseMuscleMap = new Map(
            exercises.map((exercise) => [exercise.id, mapGroupToMuscles(exercise.grupoMuscularPrimario)]),
        )

        const volumeByMuscle: Record<string, number> = {}
        const daysByMuscle: Record<string, Set<string>> = {}

        for (const item of sets) {
            const muscles = exerciseMuscleMap.get(item.ejercicioId) ?? []
            if (muscles.length === 0) continue

            const volume = calculateSetVolume(item.pesoUtilizado, item.repeticionesRealizadas)
            const distributedVolume = volume / muscles.length
            const dayKey = toDateKey(item.fecha)

            for (const muscle of muscles) {
                volumeByMuscle[muscle] = (volumeByMuscle[muscle] ?? 0) + distributedVolume
                if (!daysByMuscle[muscle]) {
                    daysByMuscle[muscle] = new Set<string>()
                }
                daysByMuscle[muscle].add(dayKey)
            }
        }

        return Object.keys(DEFAULT_MUSCLE_ANALYTICS).reduce<MuscleAnalytics>((acc, muscle) => {
            acc[muscle] = {
                volume: Number((volumeByMuscle[muscle] ?? 0).toFixed(2)),
                daysTrained: daysByMuscle[muscle]?.size ?? 0,
            }
            return acc
        }, { ...DEFAULT_MUSCLE_ANALYTICS })
    }, [])

    return data ?? DEFAULT_MUSCLE_ANALYTICS
}
