import { useMemo, useState } from 'react'
import { BodyDiagramSvg } from './BodyDiagramSvg'
import type { MuscleVolumes } from '../../hooks/useWeeklyMuscleVolumes'

const HEAT_COLORS: [string, string, string, string] = ['#e5e7eb', '#fecaca', '#f87171', '#b91c1c']

type MuscleLevel = 'basico' | 'medio' | 'avanzado' | 'experto'

interface MuscleHeatmapProps {
    muscleVolumes: MuscleVolumes
}

function levelFromRatio(ratio: number): MuscleLevel {
    if (ratio >= 0.75) return 'experto'
    if (ratio >= 0.5) return 'avanzado'
    if (ratio >= 0.25) return 'medio'
    return 'basico'
}

export function MuscleHeatmap({ muscleVolumes }: MuscleHeatmapProps) {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

    const normalizedVolumes = useMemo(() => {
        const merged = { ...muscleVolumes }

        if ((merged.espalda ?? 0) > 0) {
            merged.trapecio = (merged.trapecio ?? 0) + merged.espalda / 3
            merged['espalda-alta'] = (merged['espalda-alta'] ?? 0) + merged.espalda / 3
            merged['espalda-baja'] = (merged['espalda-baja'] ?? 0) + merged.espalda / 3
        }

        if ((merged.brazos ?? 0) > 0) {
            merged.biceps = (merged.biceps ?? 0) + merged.brazos / 3
            merged.triceps = (merged.triceps ?? 0) + merged.brazos / 3
            merged.antebrazo = (merged.antebrazo ?? 0) + merged.brazos / 3
        }

        if ((merged.piernas ?? 0) > 0) {
            merged.cuadriceps = (merged.cuadriceps ?? 0) + merged.piernas / 4
            merged.isquiotibial = (merged.isquiotibial ?? 0) + merged.piernas / 4
            merged.gluteo = (merged.gluteo ?? 0) + merged.piernas / 4
            merged.gemelo = (merged.gemelo ?? 0) + merged.piernas / 4
        }

        return merged
    }, [muscleVolumes])

    const levelByMuscle = useMemo(() => {
        const maxVolume = Math.max(1, ...Object.values(normalizedVolumes))

        return Object.entries(normalizedVolumes).reduce<Record<string, { volume: number; level: MuscleLevel }>>((acc, [muscle, volume]) => {
            const ratio = volume / maxVolume
            acc[muscle] = {
                volume,
                level: levelFromRatio(ratio),
            }
            return acc
        }, {})
    }, [normalizedVolumes])

    return (
        <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
            <h2 className="mb-2 text-lg font-semibold">Mapa de calor muscular (7d)</h2>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-300">
                Intensidad por volumen reciente, de gris (bajo) a rojo intenso (alto).
            </p>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">Frontal</p>
                    <BodyDiagramSvg
                        view="frontal"
                        levelByMuscle={levelByMuscle}
                        selectedGroup={selectedGroup}
                        onSelectGroup={setSelectedGroup}
                        highlightedColors={HEAT_COLORS}
                    />
                </div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">Posterior</p>
                    <BodyDiagramSvg
                        view="posterior"
                        levelByMuscle={levelByMuscle}
                        selectedGroup={selectedGroup}
                        onSelectGroup={setSelectedGroup}
                        highlightedColors={HEAT_COLORS}
                    />
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#e5e7eb' }} /> Bajo</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#fecaca' }} /> Medio</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#f87171' }} /> Alto</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#b91c1c' }} /> Muy alto</span>
            </div>
        </section>
    )
}
