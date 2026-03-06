import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BodyDiagramSvg } from './BodyDiagramSvg'
import type { MuscleAnalytics } from '../../hooks/useWeeklyMuscleAnalytics'

const HEAT_COLORS: [string, string, string, string] = ['#e5e7eb', '#fecaca', '#f87171', '#b91c1c']

type MuscleLevel = 'basico' | 'medio' | 'avanzado' | 'experto'

interface MuscleHeatmapProps {
    muscleAnalytics: MuscleAnalytics
}

function levelFromScore(score: number): MuscleLevel {
    if (score >= 0.8) return 'experto'
    if (score >= 0.6) return 'avanzado'
    if (score >= 0.35) return 'medio'
    return 'basico'
}

function normalizeAbsolute(value: number, target: number): number {
    if (target <= 0) return 0
    return Math.min(1, value / target)
}

function mixedScore(volume: number, daysTrained: number): number {
    const volumeScore = normalizeAbsolute(volume, 4500)
    const frequencyScore = normalizeAbsolute(daysTrained, 3)
    return volumeScore * 0.7 + frequencyScore * 0.3
}

export function MuscleHeatmap({ muscleAnalytics }: MuscleHeatmapProps) {
    const { t } = useTranslation()
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

    const normalizedVolumes = useMemo(() => {
        const merged = Object.entries(muscleAnalytics).reduce<Record<string, { volume: number; daysTrained: number }>>((acc, [muscle, data]) => {
            acc[muscle] = {
                volume: data.volume,
                daysTrained: data.daysTrained,
            }
            return acc
        }, {})

        if ((merged.espalda?.volume ?? 0) > 0) {
            merged.trapecio = {
                volume: (merged.trapecio?.volume ?? 0) + merged.espalda.volume / 3,
                daysTrained: Math.max(merged.trapecio?.daysTrained ?? 0, merged.espalda.daysTrained),
            }
            merged['espalda-alta'] = {
                volume: (merged['espalda-alta']?.volume ?? 0) + merged.espalda.volume / 3,
                daysTrained: Math.max(merged['espalda-alta']?.daysTrained ?? 0, merged.espalda.daysTrained),
            }
            merged['espalda-baja'] = {
                volume: (merged['espalda-baja']?.volume ?? 0) + merged.espalda.volume / 3,
                daysTrained: Math.max(merged['espalda-baja']?.daysTrained ?? 0, merged.espalda.daysTrained),
            }
        }

        if ((merged.brazos?.volume ?? 0) > 0) {
            merged.biceps = {
                volume: (merged.biceps?.volume ?? 0) + merged.brazos.volume / 3,
                daysTrained: Math.max(merged.biceps?.daysTrained ?? 0, merged.brazos.daysTrained),
            }
            merged.triceps = {
                volume: (merged.triceps?.volume ?? 0) + merged.brazos.volume / 3,
                daysTrained: Math.max(merged.triceps?.daysTrained ?? 0, merged.brazos.daysTrained),
            }
            merged.antebrazo = {
                volume: (merged.antebrazo?.volume ?? 0) + merged.brazos.volume / 3,
                daysTrained: Math.max(merged.antebrazo?.daysTrained ?? 0, merged.brazos.daysTrained),
            }
        }

        if ((merged.piernas?.volume ?? 0) > 0) {
            merged.cuadriceps = {
                volume: (merged.cuadriceps?.volume ?? 0) + merged.piernas.volume / 4,
                daysTrained: Math.max(merged.cuadriceps?.daysTrained ?? 0, merged.piernas.daysTrained),
            }
            merged.isquiotibial = {
                volume: (merged.isquiotibial?.volume ?? 0) + merged.piernas.volume / 4,
                daysTrained: Math.max(merged.isquiotibial?.daysTrained ?? 0, merged.piernas.daysTrained),
            }
            merged.gluteo = {
                volume: (merged.gluteo?.volume ?? 0) + merged.piernas.volume / 4,
                daysTrained: Math.max(merged.gluteo?.daysTrained ?? 0, merged.piernas.daysTrained),
            }
            merged.gemelo = {
                volume: (merged.gemelo?.volume ?? 0) + merged.piernas.volume / 4,
                daysTrained: Math.max(merged.gemelo?.daysTrained ?? 0, merged.piernas.daysTrained),
            }
        }

        return merged
    }, [muscleAnalytics])

    const levelByMuscle = useMemo(() => {
        return Object.entries(normalizedVolumes).reduce<Record<string, { volume: number; level: MuscleLevel }>>((acc, [muscle, data]) => {
            const score = mixedScore(data.volume, data.daysTrained)
            acc[muscle] = {
                volume: data.volume,
                level: levelFromScore(score),
            }
            return acc
        }, {})
    }, [normalizedVolumes])

    return (
        <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
            <h2 className="mb-2 text-lg font-semibold">{t('muscleHeatmap.title')}</h2>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-300">
                {t('muscleHeatmap.subtitle')}
            </p>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">{t('muscleHeatmap.views.front')}</p>
                    <BodyDiagramSvg
                        view="frontal"
                        levelByMuscle={levelByMuscle}
                        selectedGroup={selectedGroup}
                        onSelectGroup={setSelectedGroup}
                        highlightedColors={HEAT_COLORS}
                    />
                </div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">{t('muscleHeatmap.views.back')}</p>
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
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#e5e7eb' }} /> {t('muscleHeatmap.levels.low')}</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#fecaca' }} /> {t('muscleHeatmap.levels.medium')}</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#f87171' }} /> {t('muscleHeatmap.levels.high')}</span>
                <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#b91c1c' }} /> {t('muscleHeatmap.levels.veryHigh')}</span>
            </div>
        </section>
    )
}
