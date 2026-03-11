import { useEffect, useRef, useState } from 'react'
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
    // FIX 5: Delay fetch until the element has been visible for 500ms to prevent
    // 30-50 simultaneous API requests on catalog page load.
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let timeoutId: ReturnType<typeof setTimeout> | undefined

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    timeoutId = setTimeout(() => setIsVisible(true), 500)
                } else {
                    clearTimeout(timeoutId)
                }
            },
            { threshold: 0 },
        )

        observer.observe(container)
        return () => {
            observer.disconnect()
            clearTimeout(timeoutId)
        }
    }, [])

    const { gifUrl, isLoading } = useExerciseGif(nombre, {
        exerciseId,
        exerciseDbId,
        exerciseDbName,
        exerciseDbAliases,
        fallbackGifUrl: imagenUrl,
        enabled: isVisible,
    })
    const [gifLoaded, setGifLoaded] = useState(false)

    useEffect(() => {
        setGifLoaded(false)
    }, [gifUrl])

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
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
