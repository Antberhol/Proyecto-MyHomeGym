import { db } from './db'
import { calculateSetVolume } from '../utils/calculations'
import type { PerformedExercise } from '../types/models'

function buildSetDetail(peso: number, reps: number, rpe?: number): string {
    const base = `${peso}kg x ${reps} reps`
    if (typeof rpe === 'number' && rpe > 0) {
        return `${base} @ RPE ${rpe}`
    }
    return base
}

export async function registerSetPrs(
    exerciseId: string,
    peso: number,
    reps: number,
    fechaIso: string,
    type?: PerformedExercise['type'],
    rpe?: number,
): Promise<number> {
    if (type === 'warmup') {
        return 0
    }

    const history = await db.getPersonalRecordsByExercise(exerciseId)
    let created = 0
    const detail = buildSetDetail(peso, reps, rpe)

    const maxPeso = history
        .filter((item) => item.tipo === 'peso_maximo')
        .reduce((best, item) => Math.max(best, item.valor), 0)

    if (peso > maxPeso) {
        const id = await db.addPersonalRecord({
            id: crypto.randomUUID(),
            ejercicioId: exerciseId,
            tipo: 'peso_maximo',
            valor: peso,
            fecha: fechaIso,
            detalle,
        })
        await db.enqueueSyncOperation({ entityType: 'pr', entityId: id, payload: '{}' })
        created += 1
    }

    const volumenSerie = calculateSetVolume(peso, reps)
    const maxVolumenSerie = history
        .filter((item) => item.tipo === 'volumen_serie')
        .reduce((best, item) => Math.max(best, item.valor), 0)

    if (volumenSerie > maxVolumenSerie) {
        const id = await db.addPersonalRecord({
            id: crypto.randomUUID(),
            ejercicioId: exerciseId,
            tipo: 'volumen_serie',
            valor: volumenSerie,
            fecha: fechaIso,
            detalle,
        })
        await db.enqueueSyncOperation({ entityType: 'pr', entityId: id, payload: '{}' })
        created += 1
    }

    const sameWeightKey = `a ${peso}kg`
    const maxRepsAtWeight = history
        .filter((item) => item.tipo === 'reps_mismo_peso' && item.detalle === sameWeightKey)
        .reduce((best, item) => Math.max(best, item.valor), 0)

    if (reps > maxRepsAtWeight) {
        const id = await db.addPersonalRecord({
            id: crypto.randomUUID(),
            ejercicioId: exerciseId,
            tipo: 'reps_mismo_peso',
            valor: reps,
            fecha: fechaIso,
            detalle: sameWeightKey,
        })
        await db.enqueueSyncOperation({ entityType: 'pr', entityId: id, payload: '{}' })
        created += 1
    }

    return created
}

export async function registerTrainingVolumePr(volumenTotal: number, fechaIso: string): Promise<number> {
    const globalExerciseId = 'GLOBAL'
    const history = await db.getPersonalRecordsByExercise(globalExerciseId)
    const maxVolume = history
        .filter((item) => item.tipo === 'volumen_total')
        .reduce((best, item) => Math.max(best, item.valor), 0)

    if (volumenTotal <= maxVolume) {
        return 0
    }

    const id = await db.addPersonalRecord({
        id: crypto.randomUUID(),
        ejercicioId: globalExerciseId,
        tipo: 'volumen_total',
        valor: volumenTotal,
        fecha: fechaIso,
        detalle: 'Volumen total de sesión',
    })

    await db.enqueueSyncOperation({ entityType: 'pr', entityId: id, payload: '{}' })

    return 1
}
