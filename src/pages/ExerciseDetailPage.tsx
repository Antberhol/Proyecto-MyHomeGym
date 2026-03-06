import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [isCatalogLoading, setIsCatalogLoading] = useState(true)
    const [catalogError, setCatalogError] = useState('')

    useEffect(() => {
        const run = async () => {
            if (!id) {
                setCatalogError(t('exerciseDetail.invalidExercise'))
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
                    setCatalogError(t('exerciseDetail.requestedExerciseNotFound'))
                    return
                }

                const exerciseRef = doc(firebaseFirestore, 'ejerciciosCatalogo', id)
                const snapshot = await getDoc(exerciseRef)

                if (!snapshot.exists()) {
                    setCatalogError(t('exerciseDetail.requestedExerciseNotFound'))
                    return
                }

                const rawData = snapshot.data() as Omit<Exercise, 'id'>
                setExercise({ id: snapshot.id, ...rawData })
            } catch {
                setCatalogError(t('exerciseDetail.exerciseLoadFailed'))
            } finally {
                setIsCatalogLoading(false)
            }
        }

        void run()
    }, [id, t])

    const englishAlias =
        exercise?.exerciseDbName ??
        exercise?.exerciseDbAliases?.[0] ??
        (exercise ? getPreferredExerciseDbName(exercise.nombre) : undefined)

    const detail = useExerciseDetail(exercise?.nombre ?? '', {
        exerciseDbId: exercise?.exerciseDbId,
        exerciseDbName: englishAlias,
        exerciseDbAliases: exercise?.exerciseDbAliases,
        fallbackInstructions: exercise?.instrucciones,
        fallbackGifUrl: exercise?.imagenUrl,
    })

    if (isCatalogLoading || (exercise && detail.isLoading)) {
        return <ExerciseDetailSkeleton />
    }

    if (catalogError) {
        return (
            <div className="space-y-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/catalogo')}>
                    {t('common.backToCatalog')}
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
                {t('common.backToCatalog')}
            </Button>

            <Card className="space-y-4">
                <img
                    src={detail.data?.gifUrl || EXERCISE_GIF_PLACEHOLDER}
                    alt={t('exerciseDetail.gifAlt', { name: exercise.nombre })}
                    className="h-80 w-full rounded-xl border border-slate-200 bg-slate-100 object-contain p-2 dark:border-slate-700 dark:bg-slate-800 md:h-96"
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.src = EXERCISE_GIF_PLACEHOLDER
                    }}
                />

                <div>
                    <h1 className="text-2xl font-bold">{exercise.nombre}</h1>
                    {englishAlias ? (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {t('exerciseDetail.alias')}: <span className="font-medium">{englishAlias}</span>
                        </p>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{t('exerciseDetail.target')}</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.target || exercise.grupoMuscularPrimario}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{t('exerciseDetail.equipment')}</p>
                        <p className="mt-1 text-sm font-medium">{detail.data?.equipment || exercise.equipoNecesario}</p>
                    </div>
                </div>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.secondaryMuscles')}</h2>
                    {detail.data && detail.data.secondaryMuscles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {detail.data.secondaryMuscles.map((muscle) => (
                                <span key={muscle} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {muscle}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{t('common.notFoundDetailedInfo')}</p>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t('exerciseDetail.instructions')}</h2>
                    {detail.isTranslatingInstructions ? (
                        <p className="text-xs text-slate-500 dark:text-slate-300">{t('common.translating')}</p>
                    ) : null}
                    {detail.data && detail.data.instructions.length > 0 ? (
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                            {detail.data.instructions.map((instruction, index) => (
                                <li key={`${instruction}-${index}`}>{instruction}</li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{t('common.notFoundDetailedInfo')}</p>
                    )}
                </section>
            </Card>
        </div>
    )
}
