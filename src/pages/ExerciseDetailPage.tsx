import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/design-system/Button'
import { Card } from '../components/design-system/Card'
import { getPreferredExerciseDbName } from '../constants/exerciseDbAliases'
import { useExerciseDetail } from '../hooks/useExerciseDetail'
import { EXERCISE_GIF_PLACEHOLDER } from '../hooks/useExerciseGif'
import { exerciseRepository } from '../repositories/exerciseRepository'
import { firebaseFirestore, isFirebaseConfigured } from '../services/firebase'
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
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [isCatalogLoading, setIsCatalogLoading] = useState(true)
    const [catalogError, setCatalogError] = useState('')

    useEffect(() => {
        const run = async () => {
            if (!id) {
                setCatalogError('Ejercicio no válido.')
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
                    setCatalogError('No se encontró el ejercicio solicitado.')
                    return
                }

                const exerciseRef = doc(firebaseFirestore, 'ejerciciosCatalogo', id)
                const snapshot = await getDoc(exerciseRef)

                if (!snapshot.exists()) {
                    setCatalogError('No se encontró el ejercicio solicitado.')
                    return
                }

                const rawData = snapshot.data() as Omit<Exercise, 'id'>
                setExercise({ id: snapshot.id, ...rawData })
            } catch {
                setCatalogError('No se pudo cargar el ejercicio.')
            } finally {
                setIsCatalogLoading(false)
            }
        }

        void run()
    }, [id])

    const englishAlias =
        exercise?.exerciseDbName ??
        exercise?.exerciseDbAliases?.[0] ??
        (exercise ? getPreferredExerciseDbName(exercise.nombre) : undefined)

    const detail = useExerciseDetail(exercise?.nombre ?? '', {
        exerciseDbId: exercise?.exerciseDbId,
        exerciseDbName: englishAlias,
        exerciseDbAliases: exercise?.exerciseDbAliases,
    })

    if (isCatalogLoading || (exercise && detail.isLoading)) {
        return <ExerciseDetailSkeleton />
    }

    if (catalogError) {
        return (
            <div className="space-y-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                    ← Volver al catálogo
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

    return (
        <div className="space-y-4">
            <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                ← Volver al catálogo
            </Button>

            <Card className="space-y-4">
                {detail.data?.gifUrl ? (
                    <img
                        src={detail.data.gifUrl}
                        alt={`GIF de ${exercise.nombre}`}
                        className="h-64 w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.src = EXERCISE_GIF_PLACEHOLDER
                        }}
                    />
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                        No se encontró información detallada para este ejercicio
                    </div>
                )}

                <div>
                    <h1 className="text-2xl font-bold">{exercise.nombre}</h1>
                    {englishAlias ? (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Alias EN: <span className="font-medium">{englishAlias}</span>
                        </p>
                    ) : null}
                </div>

                <div className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    <p className="font-semibold">Diagnóstico API (temporal)</p>
                    <p>source: {detail.debug.source}</p>
                    <p>alias usado: {englishAlias || 'n/a'}</p>
                    <p>candidate usado: {detail.debug.usedCandidate || 'n/a'}</p>
                    <p>exerciseDbId resuelto: {detail.debug.resolvedExerciseDbId || 'n/a'}</p>
                    <p>exerciseDbName resuelto: {detail.debug.resolvedExerciseDbName || 'n/a'}</p>
                    <p>gif validado: {detail.debug.gifValidated ? 'sí' : 'no'}</p>
                    <p>error: {detail.debug.lastError || 'none'}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Músculo objetivo</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.target || exercise.grupoMuscularPrimario}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Equipo</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.equipment || exercise.equipoNecesario}</p>
                    </div>
                </div>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Músculos secundarios</h2>
                    {detail.data && detail.data.secondaryMuscles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {detail.data.secondaryMuscles.map((muscle) => (
                                <span key={muscle} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {muscle}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">No se encontró información detallada para este ejercicio</p>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Instrucciones paso a paso</h2>
                    {detail.data && detail.data.instructions.length > 0 ? (
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                            {detail.data.instructions.map((instruction, index) => (
                                <li key={`${instruction}-${index}`}>{instruction}</li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">No se encontró información detallada para este ejercicio</p>
                    )}
                </section>
            </Card>
        </div>
    )
}
