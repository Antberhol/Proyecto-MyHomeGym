import { useEffect, useMemo, useRef } from 'react'
import createBodyHighlighter, {
    ModelType,
    MuscleType,
    type BodyHighlighterInstance,
    type IExerciseData,
} from 'body-highlighter'

type MuscleLevel = 'basico' | 'medio' | 'avanzado' | 'experto'

interface BodyDiagramSvgProps {
    view: 'frontal' | 'posterior'
    levelByMuscle: Record<string, { volume: number; level: MuscleLevel }>
    selectedGroup: string | null
    onSelectGroup: (group: string) => void
}

function levelToFrequency(level: MuscleLevel): number {
    if (level === 'basico') return 1
    if (level === 'medio') return 2
    if (level === 'avanzado') return 3
    return 4
}

function mapMuscleToGroup(muscle: string): string | null {
    if (muscle === MuscleType.CHEST) return 'pecho'
    if (new Set<string>([MuscleType.FRONT_DELTOIDS, MuscleType.BACK_DELTOIDS]).has(muscle)) return 'hombros'
    if (muscle === MuscleType.BICEPS) return 'biceps'
    if (muscle === MuscleType.TRICEPS) return 'triceps'
    if (muscle === MuscleType.FOREARM) return 'antebrazo'
    if (muscle === MuscleType.ABS) return 'core'
    if (muscle === MuscleType.OBLIQUES) return 'oblicuos'
    if (muscle === MuscleType.TRAPEZIUS) return 'trapecio'
    if (muscle === MuscleType.UPPER_BACK) return 'espalda-alta'
    if (muscle === MuscleType.LOWER_BACK) return 'espalda-baja'
    if (muscle === MuscleType.QUADRICEPS) return 'cuadriceps'
    if (muscle === MuscleType.HAMSTRING) return 'isquiotibial'
    if (muscle === MuscleType.GLUTEAL) return 'gluteo'
    if (new Set<string>([MuscleType.CALVES, MuscleType.LEFT_SOLEUS, MuscleType.RIGHT_SOLEUS]).has(muscle)) return 'gemelo'
    if (muscle === MuscleType.ABDUCTOR) return 'aductor'
    if (muscle === MuscleType.ABDUCTORS) return 'abductor'
    return null
}

function buildExerciseData(view: 'frontal' | 'posterior', levelByMuscle: Record<string, { volume: number; level: MuscleLevel }>): IExerciseData[] {
    const commonData: IExerciseData[] = [
        {
            name: 'Pecho',
            muscles: [MuscleType.CHEST],
            frequency: levelToFrequency(levelByMuscle.pecho?.level ?? 'basico'),
        },
        {
            name: 'Hombros',
            muscles: [MuscleType.FRONT_DELTOIDS, MuscleType.BACK_DELTOIDS],
            frequency: levelToFrequency(levelByMuscle.hombros?.level ?? 'basico'),
        },
        {
            name: 'Bíceps',
            muscles: [MuscleType.BICEPS],
            frequency: levelToFrequency(levelByMuscle.biceps?.level ?? 'basico'),
        },
        {
            name: 'Tríceps',
            muscles: [MuscleType.TRICEPS],
            frequency: levelToFrequency(levelByMuscle.triceps?.level ?? 'basico'),
        },
        {
            name: 'Antebrazo',
            muscles: [MuscleType.FOREARM],
            frequency: levelToFrequency(levelByMuscle.antebrazo?.level ?? 'basico'),
        },
        {
            name: 'Core',
            muscles: [MuscleType.ABS],
            frequency: levelToFrequency(levelByMuscle.core?.level ?? 'basico'),
        },
        {
            name: 'Oblicuos',
            muscles: [MuscleType.OBLIQUES],
            frequency: levelToFrequency(levelByMuscle.oblicuos?.level ?? 'basico'),
        },
        {
            name: 'Cuádriceps',
            muscles: [MuscleType.QUADRICEPS],
            frequency: levelToFrequency(levelByMuscle.cuadriceps?.level ?? 'basico'),
        },
        {
            name: 'Isquiotibial',
            muscles: [MuscleType.HAMSTRING],
            frequency: levelToFrequency(levelByMuscle.isquiotibial?.level ?? 'basico'),
        },
        {
            name: 'Glúteo',
            muscles: [MuscleType.GLUTEAL],
            frequency: levelToFrequency(levelByMuscle.gluteo?.level ?? 'basico'),
        },
        {
            name: 'Gemelo',
            muscles: [MuscleType.CALVES, MuscleType.LEFT_SOLEUS, MuscleType.RIGHT_SOLEUS],
            frequency: levelToFrequency(levelByMuscle.gemelo?.level ?? 'basico'),
        },
        {
            name: 'Aductor',
            muscles: [MuscleType.ABDUCTOR],
            frequency: levelToFrequency(levelByMuscle.aductor?.level ?? 'basico'),
        },
        {
            name: 'Abductor',
            muscles: [MuscleType.ABDUCTORS],
            frequency: levelToFrequency(levelByMuscle.abductor?.level ?? 'basico'),
        },
    ]

    if (view === 'posterior') {
        commonData.push(
            {
                name: 'Trapecio',
                muscles: [MuscleType.TRAPEZIUS],
                frequency: levelToFrequency(levelByMuscle.trapecio?.level ?? 'basico'),
            },
            {
                name: 'Espalda alta',
                muscles: [MuscleType.UPPER_BACK],
                frequency: levelToFrequency(levelByMuscle['espalda-alta']?.level ?? 'basico'),
            },
            {
                name: 'Espalda baja',
                muscles: [MuscleType.LOWER_BACK],
                frequency: levelToFrequency(levelByMuscle['espalda-baja']?.level ?? 'basico'),
            },
        )
    }

    return commonData
}

export function BodyDiagramSvg({ view, levelByMuscle, selectedGroup: _selectedGroup, onSelectGroup }: BodyDiagramSvgProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const instanceRef = useRef<BodyHighlighterInstance | null>(null)

    const exerciseData = useMemo(() => buildExerciseData(view, levelByMuscle), [levelByMuscle, view])

    useEffect(() => {
        if (!containerRef.current) return

        const modelType = view === 'frontal' ? ModelType.ANTERIOR : ModelType.POSTERIOR

        const options = {
            container: containerRef.current,
            type: modelType,
            bodyColor: '#f3f4f6',
            data: exerciseData,
            highlightedColors: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
            style: {
                width: '100%',
                maxWidth: '420px',
                margin: '0 auto',
                padding: '0',
            },
            svgStyle: {
                width: '100%',
                height: 'auto',
                display: 'block',
            },
            onClick: ({ muscle }: { muscle: string }) => {
                const mapped = mapMuscleToGroup(muscle)
                if (mapped) {
                    onSelectGroup(mapped)
                }
            },
        }

        if (!instanceRef.current) {
            instanceRef.current = createBodyHighlighter(options)
        } else {
            instanceRef.current.update(options)
        }
    }, [exerciseData, onSelectGroup, view])

    useEffect(() => {
        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy()
                instanceRef.current = null
            }
        }
    }, [])

    return <div ref={containerRef} className="mx-auto w-full" />
}
