import { useLiveQuery } from 'dexie-react-hooks'
import { progressRepository } from '../repositories/progressRepository'
import { calculateSetVolume } from '../utils/calculations'

export type MuscleVolumes = Record<string, number>

function normalizeKey(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()
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

const DEFAULT_MUSCLE_VOLUMES: MuscleVolumes = {
    pecho: 0,
    hombros: 0,
    biceps: 0,
    triceps: 0,
    antebrazo: 0,
    core: 0,
    oblicuos: 0,
    trapecio: 0,
    'espalda-alta': 0,
    'espalda-baja': 0,
    cuadriceps: 0,
    isquiotibial: 0,
    gluteo: 0,
    gemelo: 0,
    aductor: 0,
    abductor: 0,
}

export function useWeeklyMuscleVolumes(): MuscleVolumes {
    const data = useLiveQuery(async () => {
        const since = new Date()
        since.setDate(since.getDate() - 7)

        const [sets, exercises] = await Promise.all([
            progressRepository.listPerformedExercisesSince(since.toISOString()),
            progressRepository.listExercises(),
        ])

        const exerciseMuscleMap = new Map(
            exercises.map((exercise) => [exercise.id, mapGroupToMuscles(exercise.grupoMuscularPrimario)]),
        )

        const volumeByMuscle = { ...DEFAULT_MUSCLE_VOLUMES }

        for (const item of sets) {
            const muscles = exerciseMuscleMap.get(item.ejercicioId) ?? []
            if (muscles.length === 0) continue

            const volume = calculateSetVolume(item.pesoUtilizado, item.repeticionesRealizadas)
            const distributedVolume = volume / muscles.length

            for (const muscle of muscles) {
                volumeByMuscle[muscle] = (volumeByMuscle[muscle] ?? 0) + distributedVolume
            }
        }

        return volumeByMuscle
    }, [])

    return data ?? DEFAULT_MUSCLE_VOLUMES
}
