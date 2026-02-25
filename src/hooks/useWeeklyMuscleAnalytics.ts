import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { db } from '../lib/db'
import type { AnalyticsWorkerResponse } from '../workers/analytics.worker'

export type MuscleData = {
    volume: number
    daysTrained: number
}

export type MuscleAnalytics = Record<string, MuscleData>
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
    const [analytics, setAnalytics] = useState<MuscleAnalytics>(DEFAULT_MUSCLE_ANALYTICS)
    const requestIdRef = useRef(0)

    const rawData = useLiveQuery(async () => {
        const since = new Date()
        since.setDate(since.getDate() - 7)

        const [sets, exercises] = await Promise.all([
            db.ejerciciosRealizados.where('fecha').aboveOrEqual(since.toISOString()).toArray(),
            db.ejerciciosCatalogo.toArray(),
        ])

        return {
            sets: sets.map((item) => ({
                ejercicioId: item.ejercicioId,
                repeticionesRealizadas: item.repeticionesRealizadas,
                pesoUtilizado: item.pesoUtilizado,
                fecha: item.fecha,
            })),
            exercises: exercises.map((exercise) => ({
                id: exercise.id,
                grupoMuscularPrimario: exercise.grupoMuscularPrimario,
            })),
        }
    }, [])

    const worker = useMemo(
        () => new Worker(new URL('../workers/analytics.worker.ts', import.meta.url), { type: 'module' }),
        [],
    )

    useEffect(() => {
        return () => {
            worker.terminate()
        }
    }, [worker])

    useEffect(() => {
        if (!rawData) {
            return
        }

        const requestId = ++requestIdRef.current

        const onMessage = (event: MessageEvent<AnalyticsWorkerResponse>) => {
            const payload = event.data
            if (payload.requestId !== requestIdRef.current) return
            setAnalytics(payload.analytics)
        }

        const onError = () => {
            if (requestId !== requestIdRef.current) return
            setAnalytics(DEFAULT_MUSCLE_ANALYTICS)
        }

        worker.addEventListener('message', onMessage)
        worker.addEventListener('error', onError)
        worker.postMessage({
            requestId,
            sets: rawData.sets,
            exercises: rawData.exercises,
        })

        return () => {
            worker.removeEventListener('message', onMessage)
            worker.removeEventListener('error', onError)
        }
    }, [rawData, worker])

    return analytics
}
