import { useEffect, useState } from 'react'
import { EXERCISE_GIF_PLACEHOLDER, useExerciseGif } from '../../hooks/useExerciseGif'

interface ExerciseThumbnailProps {
    exerciseId?: string
    nombre: string
    grupoMuscularPrimario?: string
    equipoNecesario?: string
    imagenUrl?: string
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
    className?: string
}

export function ExerciseThumbnail({
    exerciseId,
    nombre,
    grupoMuscularPrimario: _grupoMuscularPrimario,
    equipoNecesario: _equipoNecesario,
    imagenUrl,
    exerciseDbId,
    exerciseDbName,
    exerciseDbAliases,
    className = 'h-16 w-24',
}: ExerciseThumbnailProps) {
    const { gifUrl, isLoading } = useExerciseGif(nombre, {
        exerciseId,
        exerciseDbId,
        exerciseDbName,
        exerciseDbAliases,
        fallbackGifUrl: imagenUrl,
    })
    const [gifLoaded, setGifLoaded] = useState(false)

    useEffect(() => {
        setGifLoaded(false)
    }, [gifUrl])

    return (
        <div className={`relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
            {(isLoading || !gifLoaded) && (
                <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
            )}
            <img
                src={gifUrl || EXERCISE_GIF_PLACEHOLDER}
                alt={`GIF de ${nombre}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onLoad={() => setGifLoaded(true)}
                onError={(event) => {
                    event.currentTarget.src = EXERCISE_GIF_PLACEHOLDER
                    setGifLoaded(true)
                }}
            />
        </div>
    )
}
