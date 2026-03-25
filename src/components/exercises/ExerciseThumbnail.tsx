import { useEffect, useRef, useState } from 'react'
import { DEFAULT_FALLBACK_GIF, useExerciseGif } from '../../hooks/useExerciseGif'

interface ExerciseThumbnailProps {
    exerciseId?: string
    nombre: string
    grupoMuscularPrimario?: string
    equipoNecesario?: string
    gifUrl?: string
    imagenUrl?: string
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
    className?: string
}

export function ExerciseThumbnail({
    exerciseId,
    nombre,
    grupoMuscularPrimario,
    equipoNecesario: _equipoNecesario,
    gifUrl: exerciseGifUrl,
    imagenUrl,
    exerciseDbId,
    exerciseDbName,
    exerciseDbAliases,
    className = 'h-16 w-24',
}: ExerciseThumbnailProps) {
    // Keep IntersectionObserver as a visibility gate, but fetch only after user interaction.
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let timeoutId: ReturnType<typeof setTimeout> | undefined

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    timeoutId = setTimeout(() => setIsVisible(true), 200)
                } else {
                    clearTimeout(timeoutId)
                }
            },
            { threshold: 0.1 },
        )

        observer.observe(container)
        return () => {
            observer.disconnect()
            clearTimeout(timeoutId)
        }
    }, [])

    const shouldFetchGif = isVisible && (isHovered || hasInteracted)

    const { gifUrl: resolvedGifUrl, isLoading } = useExerciseGif(nombre, {
        exerciseId,
        exerciseDbId,
        exerciseDbName,
        exerciseDbAliases,
        gifUrl: exerciseGifUrl,
        fallbackGifUrl: imagenUrl,
        grupoMuscularPrimario,
        enabled: shouldFetchGif,
    })
    const [gifLoaded, setGifLoaded] = useState(false)

    const shouldShowSkeleton = shouldFetchGif && isLoading && !gifLoaded

    useEffect(() => {
        setGifLoaded(false)
    }, [resolvedGifUrl])

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}
            onMouseEnter={() => {
                setIsHovered(true)
                setHasInteracted(true)
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setHasInteracted(true)}
        >
            {shouldShowSkeleton && (
                <div className="absolute inset-0 z-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
            )}
            <img
                src={resolvedGifUrl}
                alt={`GIF de ${nombre}`}
                className="relative z-10 h-full w-full object-cover transition-opacity duration-300"
                loading="lazy"
                onLoad={() => setGifLoaded(true)}
                onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = DEFAULT_FALLBACK_GIF
                    setGifLoaded(true)
                }}
            />
        </div>
    )
}
