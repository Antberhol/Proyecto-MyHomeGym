import { useMemo, useState } from 'react'
import { getExerciseIllustrationUrl } from '../../utils/exerciseIllustration'

interface ExerciseThumbnailProps {
    nombre: string
    grupoMuscularPrimario?: string
    equipoNecesario?: string
    imagenUrl?: string
    className?: string
}

export function ExerciseThumbnail({
    nombre,
    grupoMuscularPrimario,
    equipoNecesario,
    imagenUrl,
    className = 'h-16 w-24',
}: ExerciseThumbnailProps) {
    const fallbackUrl = useMemo(
        () =>
            getExerciseIllustrationUrl({
                nombre,
                grupoMuscularPrimario,
                equipoNecesario,
            }),
        [equipoNecesario, grupoMuscularPrimario, nombre],
    )

    const [currentSrc, setCurrentSrc] = useState(imagenUrl?.trim() || fallbackUrl)

    return (
        <img
            src={currentSrc}
            alt={`Ilustración de ${nombre}`}
            className={`${className} rounded-lg border border-slate-200 object-cover dark:border-slate-700`}
            loading="lazy"
            onError={() => {
                if (currentSrc !== fallbackUrl) {
                    setCurrentSrc(fallbackUrl)
                }
            }}
        />
    )
}
