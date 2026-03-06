import { useEffect, useState } from 'react'
import type { Exercise } from '../../types/models'
import { EXERCISE_GIF_PLACEHOLDER, useExerciseGif } from '../../hooks/useExerciseGif'

interface ExerciseCardProps {
    exercise: Pick<Exercise, 'id' | 'nombre' | 'grupoMuscularPrimario' | 'exerciseDbId' | 'exerciseDbName' | 'exerciseDbAliases'>
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    const { gifUrl, targetMuscle, isLoading } = useExerciseGif(exercise.nombre, {
        exerciseId: exercise.id,
        exerciseDbId: exercise.exerciseDbId,
        exerciseDbName: exercise.exerciseDbName,
        exerciseDbAliases: exercise.exerciseDbAliases,
    })
    const [gifLoaded, setGifLoaded] = useState(false)

    useEffect(() => {
        setGifLoaded(false)
    }, [gifUrl])

    return (
        <div className="flex items-center gap-3">
            <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                {(isLoading || !gifLoaded) && (
                    <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
                )}
                <img
                    src={gifUrl}
                    alt={`GIF de ${exercise.nombre}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onLoad={() => setGifLoaded(true)}
                    onError={(event) => {
                        event.currentTarget.src = EXERCISE_GIF_PLACEHOLDER
                        setGifLoaded(true)
                    }}
                />
            </div>
            <div>
                <h2 className="font-semibold">{exercise.nombre}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                    Objetivo: {targetMuscle || exercise.grupoMuscularPrimario}
                </p>
            </div>
        </div>
    )
}
