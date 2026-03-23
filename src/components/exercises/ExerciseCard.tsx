import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Exercise } from '../../types/models'
import { EXERCISE_GIF_PLACEHOLDER, useExerciseGif } from '../../hooks/useExerciseGif'

interface ExerciseCardProps {
    exercise: Pick<Exercise, 'id' | 'nombre' | 'grupoMuscularPrimario' | 'equipoNecesario' | 'imagenUrl' | 'exerciseDbId' | 'exerciseDbName' | 'exerciseDbAliases' | 'instrucciones'>
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    const { i18n } = useTranslation()
    const [isHovered, setIsHovered] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const shouldFetchGif = isHovered || hasInteracted

    const { gifUrl, targetMuscle, instructions, isLoading } = useExerciseGif(exercise.nombre, {
        exerciseId: exercise.id,
        exerciseDbId: exercise.exerciseDbId,
        exerciseDbName: exercise.exerciseDbName,
        exerciseDbAliases: exercise.exerciseDbAliases,
        fallbackGifUrl: exercise.imagenUrl,
        grupoMuscularPrimario: exercise.grupoMuscularPrimario,
        enabled: shouldFetchGif,
    })
    const [gifLoaded, setGifLoaded] = useState(false)

    useEffect(() => {
        setGifLoaded(false)
    }, [gifUrl])

    const language = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en'
    const localInstructions = (exercise.instrucciones ?? '').split(/\r?\n|\.\s+/).map((step) => step.trim()).filter((step) => step.length > 0)
    const apiInstructions = (instructions ?? []).filter((step) => step.trim().length > 0)
    const generatedInstructions = language === 'es' ? [
        `Coloca tu cuerpo en la posición inicial de ${exercise.nombre} y estabiliza el core.`,
        'Ejecuta el movimiento de forma controlada y con rango completo.',
        'Regresa a la posición inicial manteniendo la técnica y repite.'
    ] : [
        `Set your body in the starting position for ${exercise.nombre} and brace your core.`,
        'Perform each rep in a controlled full range of motion.',
        'Return to the starting position with good form and repeat.'
    ]
    let effectiveInstructions: string[] = []
    if (language === 'es') {
        effectiveInstructions = localInstructions.length > 0 ? localInstructions : generatedInstructions
    } else {
        effectiveInstructions = apiInstructions.length > 0 ? apiInstructions : generatedInstructions
    }

    const equipmentTags = [exercise.equipoNecesario]
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())

    return (
        <div
            className="space-y-3"
            onMouseEnter={() => {
                setIsHovered(true)
                setHasInteracted(true)
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setHasInteracted(true)}
        >
            <div className="flex items-center gap-3">
                <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    {(shouldFetchGif && isLoading && !gifLoaded) && (
                        <div className="absolute inset-0 z-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
                    )}
                    <img
                        src={gifUrl}
                        alt={`GIF de ${exercise.nombre}`}
                        className="relative z-10 h-full w-full object-cover transition-opacity duration-300"
                        loading="lazy"
                        onLoad={() => setGifLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = EXERCISE_GIF_PLACEHOLDER
                            setGifLoaded(true)
                        }}
                    />
                </div>
                <div>
                    <h2 className="font-semibold">{exercise.nombre}</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                        Objetivo: {targetMuscle || exercise.grupoMuscularPrimario}
                    </p>
                    {equipmentTags.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                            {equipmentTags.map((tag) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-700">
                <ol className="list-decimal space-y-1.5 pl-5 text-xs text-slate-700 dark:text-slate-200">
                    {effectiveInstructions.map((step, index) => (
                        <li key={`${exercise.id}-step-${index}`}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
