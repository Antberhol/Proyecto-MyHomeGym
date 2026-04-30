import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Exercise } from '../../types/models'
import { useExerciseGif } from '../../hooks/useExerciseGif'
import { ExerciseMediaFallback } from './ExerciseMediaFallback'

interface ExerciseCardProps {
    exercise: Pick<Exercise, 'id' | 'nombre' | 'grupoMuscularPrimario' | 'equipoNecesario' | 'gifUrl' | 'imagenUrl' | 'exerciseDbId' | 'exerciseDbName' | 'exerciseDbAliases' | 'instrucciones'>
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    const { i18n, t } = useTranslation()
    const [isHovered, setIsHovered] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const shouldFetchGif = isHovered || hasInteracted

    const { gifUrl, targetMuscle, instructions, isLoading } = useExerciseGif(exercise.nombre, {
        exerciseId: exercise.id,
        exerciseDbId: exercise.exerciseDbId,
        exerciseDbName: exercise.exerciseDbName,
        exerciseDbAliases: exercise.exerciseDbAliases,
        gifUrl: exercise.gifUrl,
        fallbackGifUrl: exercise.imagenUrl,
        grupoMuscularPrimario: exercise.grupoMuscularPrimario,
        enabled: shouldFetchGif,
    })
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

    useEffect(() => {
        setImageStatus('loading')
    }, [gifUrl])

    const language = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en'

    // Función estricta para detectar si una frase es española y NO contiene basura en inglés
    const isSpanishStep = (step: string) => {
        const lowerStep = step.toLowerCase()
        const hasEnglish = /\b(the|to|and|with|your|you|keep|push|pull|lower|raise|repeat|starting|position|feet|hands|back|straight|then)\b/.test(lowerStep)
        const hasSpanish = /\b(el|la|los|las|y|con|tu|su|mantén|empuja|tira|baja|eleva|repite|posición|espalda|pecho|brazos|pies|manos)\b/.test(lowerStep)
        return hasSpanish && !hasEnglish // Debe tener palabras clave en ES y NINGUNA en EN
    }

    // Extraemos y limpiamos la BD local
    const rawLocalSteps = (exercise.instrucciones ?? '')
        .split(/\r?\n|.\s+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 5)

    const pureSpanishInstructions = rawLocalSteps.filter(isSpanishStep)
    const apiInstructions = (instructions ?? []).filter((step) => step.trim().length > 0)

    // Instrucciones dinámicas generadas si todo falla
    const generatedInstructions = language === 'es'
        ? [
            `Prepárate para realizar ${exercise.nombre}. Ajusta el peso adecuado a tu nivel.`,
            `Adopta la posición inicial, manteniendo una buena postura y activando el core.`,
            `Ejecuta el movimiento de forma controlada, sintiendo el trabajo en la zona de ${exercise.grupoMuscularPrimario || 'esfuerzo'}.`,
            `Regresa a la posición inicial sin perder la tensión muscular y repite.`
        ]
        : [
            `Get ready for ${exercise.nombre}. Select an appropriate weight.`,
            `Assume the starting position, keeping good posture and a tight core.`,
            `Perform the movement with control, focusing on your ${targetMuscle || exercise.grupoMuscularPrimario || 'target'} muscles.`,
            `Return to the start position maintaining muscle tension and repeat.`
        ]

    // Asignación final sin mezcla de idiomas
    let effectiveInstructions: string[] = []
    if (language === 'es') {
        // Si logramos salvar al menos 2 pasos buenos en español de la BD, los usamos. Si no, usamos las generadas.
        effectiveInstructions = pureSpanishInstructions.length >= 2 ? pureSpanishInstructions : generatedInstructions
    } else {
        // En inglés priorizamos la API
        effectiveInstructions = apiInstructions.length > 0 ? apiInstructions : generatedInstructions
    }

    const equipmentTags = [exercise.equipoNecesario]
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())

    const muscleTags = [exercise.grupoMuscularPrimario]
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
                <div className="relative aspect-square h-24 overflow-hidden rounded-xl border border-gym-border bg-gym-black">
                    {(imageStatus === 'loading' || (shouldFetchGif && isLoading)) && (
                        <div className="absolute inset-0 z-0 animate-pulse bg-gym-card-2" />
                    )}
                    {imageStatus === 'error' && (
                        <div className="absolute inset-0 z-10">
                            <ExerciseMediaFallback className="rounded-none" />
                        </div>
                    )}
                    <img
                        src={gifUrl}
                        alt={`GIF de ${exercise.nombre}`}
                        className={`relative z-10 h-full w-full object-cover transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={() => setImageStatus('loaded')}
                        onError={() => setImageStatus('error')}
                        aria-hidden={imageStatus !== 'loaded'}
                    />

                    <div
                        className={`absolute inset-0 z-20 flex items-center justify-center bg-black/70 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <span className="rounded-full bg-gym-yellow px-3 py-1 text-xs font-bold text-black">
                            {t('catalog.viewDetail')}
                        </span>
                    </div>
                </div>
                <div>
                    <h2 className="font-display tracking-wider uppercase text-gym-yellow text-xl">{exercise.nombre}</h2>
                    <p className="text-xs text-gym-text-dim">
                        {t('catalog.target')}: {targetMuscle || exercise.grupoMuscularPrimario}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {muscleTags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/30 rounded-full text-xs px-2 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                        {equipmentTags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/30 rounded-full text-xs px-2 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gym-card border border-gym-border rounded-xl p-3">
                <ol className="list-decimal space-y-1.5 pl-5 text-xs text-gym-text-base">
                    {effectiveInstructions.map((step, index) => (
                        <li key={`${exercise.id}-step-${index}`}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
