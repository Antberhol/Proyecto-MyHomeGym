import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Exercise, PerformedExercise, RegisteredTraining } from '../../types/models'

interface WorkoutFeedItemProps {
    training: RegisteredTraining
    exercises: PerformedExercise[]
    exerciseCatalog: Exercise[]
    prsCount: number
}

function formatRelativeDate(dateIso: string, t: (key: string, options?: Record<string, unknown>) => string): string {
    const today = new Date()
    const target = new Date(dateIso)

    const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const targetKey = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()
    const diffDays = Math.round((todayKey - targetKey) / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return t('dashboard.activityFeed.today')
    if (diffDays === 1) return t('dashboard.activityFeed.yesterday')
    return t('dashboard.activityFeed.daysAgo', { count: diffDays })
}

export function WorkoutFeedItem({ training, exercises, exerciseCatalog, prsCount }: WorkoutFeedItemProps) {
    const { t } = useTranslation()

    const exerciseNameById = useMemo(
        () => new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise.nombre])),
        [exerciseCatalog],
    )

    const topExercises = useMemo(() => {
        const counts = exercises.reduce<Record<string, number>>((acc, item) => {
            acc[item.ejercicioId] = (acc[item.ejercicioId] ?? 0) + 1
            return acc
        }, {})

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([exerciseId]) => exerciseNameById.get(exerciseId) ?? t('dashboard.common.exercise'))
    }, [exerciseNameById, exercises, t])

    return (
        <article className="rounded-xl border border-gym-border bg-gym-card p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-gym-text-dim">{formatRelativeDate(training.fecha, t)}</p>
                    <p className="mt-1 text-sm font-semibold text-gym-text-bright">{new Date(training.fecha).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-gym-border px-2 py-1 text-[11px] text-gym-text-base">
                        {training.duracionMinutos} {t('dashboard.common.minAbbrev')}
                    </span>
                    <span className="rounded-full border border-gym-yellow/40 bg-gym-yellow/10 px-2 py-1 text-[11px] text-gym-yellow">
                        {training.volumenTotal.toFixed(0)} kg
                    </span>
                    {prsCount > 0 ? (
                        <span className="rounded-full border border-gym-yellow/40 bg-gym-yellow/10 px-2 py-1 text-[11px] text-gym-yellow">
                            {t('dashboard.activityFeed.prBadge', { count: prsCount })}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {topExercises.map((name) => (
                    <span key={name} className="rounded-full border border-gym-border px-2 py-1 text-[11px] text-gym-text-dim">
                        {name}
                    </span>
                ))}
            </div>
        </article>
    )
}
