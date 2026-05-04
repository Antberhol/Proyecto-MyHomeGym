import { useEffect, useRef, useState } from 'react'
import { EXERCISE_GIF_PLACEHOLDER, useExerciseGif } from '../../hooks/useExerciseGif'
import { ExerciseMediaFallback } from './ExerciseMediaFallback'

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
    forceFetchGif?: boolean
    fallbackLabel?: string
    showFallbackPulse?: boolean
}

export function ExerciseThumbnail({
    exerciseId,
    nombre,
    grupoMuscularPrimario,
    gifUrl: exerciseGifUrl,
    imagenUrl,
    exerciseDbId,
    exerciseDbName,
    exerciseDbAliases,
    className = '',
    forceFetchGif,
    fallbackLabel,
    showFallbackPulse = false,
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

    const shouldForceFetch =
        forceFetchGif ||
        !exerciseGifUrl?.trim() ||
        exerciseGifUrl.trim() === EXERCISE_GIF_PLACEHOLDER ||
        /squats_demo\.gif/i.test(exerciseGifUrl)
    const shouldFetchGif = shouldForceFetch || (isVisible && (isHovered || hasInteracted))

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
    const [loadedUrl, setLoadedUrl] = useState<string | null>(null)
    const [errorUrl, setErrorUrl] = useState<string | null>(null)
    const imageStatus: 'loading' | 'loaded' | 'error' =
        loadedUrl === resolvedGifUrl ? 'loaded' : errorUrl === resolvedGifUrl ? 'error' : 'loading'

    const shouldShowSkeleton = imageStatus === 'loading' || (shouldFetchGif && isLoading)

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
            {imageStatus === 'error' && (
                <div
                    className="absolute inset-0 z-20"
                    title={`Sin imagen disponible para ${nombre}`}
                    aria-label={`Sin imagen disponible para ${nombre}`}
                >
                    <ExerciseMediaFallback
                        className="absolute inset-0 rounded-none"
                        label={fallbackLabel}
                        showPulse={showFallbackPulse}
                    />
                </div>
            )}
            <img
                src={resolvedGifUrl}
                alt={`GIF de ${nombre}`}
                className={`relative z-10 h-full w-full object-cover transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                loading="lazy"
                onLoad={() => {
                    setLoadedUrl(resolvedGifUrl)
                    setErrorUrl(null)
                }}
                onError={() => {
                    setErrorUrl(resolvedGifUrl)
                }}
                aria-hidden={imageStatus !== 'loaded'}
            />
        </div>
    )
}
