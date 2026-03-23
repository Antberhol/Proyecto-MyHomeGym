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
    grupoMuscularPrimario,
    equipoNecesario: _equipoNecesario,
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

    const { gifUrl, isLoading } = useExerciseGif(nombre, {
        exerciseId,
        exerciseDbId,
        exerciseDbName,
        exerciseDbAliases,
        fallbackGifUrl: imagenUrl,
        grupoMuscularPrimario,
        enabled: shouldFetchGif,
    })

    const previewUrl = imagenUrl || EXERCISE_GIF_PLACEHOLDER
    const renderedUrl = shouldFetchGif ? gifUrl || previewUrl : previewUrl
    const [gifLoaded, setGifLoaded] = useState(false)

    const shouldShowSkeleton = !isVisible || (shouldFetchGif && (isLoading || !gifLoaded))
    const skeletonOpacityClass = !isVisible ? 'opacity-50' : 'opacity-100'

    useEffect(() => {
        setGifLoaded(false)
    }, [gifUrl])

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
                <div className={`absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700 ${skeletonOpacityClass}`} />
            )}
            <img
                src={renderedUrl}
                alt={`GIF de ${nombre}`}
                className={`h-full w-full object-cover transition-opacity duration-500 ${gifLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setGifLoaded(true)}
                onError={(event) => {
                    event.currentTarget.src = previewUrl
                    setGifLoaded(true)
                }}
            />
        </div>
    )
}
