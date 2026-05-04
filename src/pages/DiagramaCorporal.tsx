import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MuscleHeatmap } from '../components/body/MuscleHeatmap'
import { type MuscleAnalyticsRange, useMuscleAnalytics } from '../hooks/useWeeklyMuscleAnalytics'

export function DiagramaCorporalPage() {
	const { t } = useTranslation()
	const [range, setRange] = useState<MuscleAnalyticsRange>('week')
	const analytics = useMuscleAnalytics(range)

	const buttonBase = 'px-3 py-1.5 text-xs font-semibold transition-colors'
	const selectedClass = 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
	const idleClass = 'text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'

	return (
		<div className="space-y-4">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
						{t('bodyDiagram.title')}
					</h1>
					<p className="text-xs text-slate-600 dark:text-slate-300">
						{t('bodyDiagram.subtitle')}
					</p>
				</div>

				<div
					className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-gym-cardDark"
					role="group"
					aria-label={t('bodyDiagram.range.aria')}
				>
					<button
						type="button"
						className={`${buttonBase} ${range === 'week' ? selectedClass : idleClass}`}
						aria-pressed={range === 'week'}
						onClick={() => setRange('week')}
					>
						{t('bodyDiagram.range.week')}
					</button>
					<button
						type="button"
						className={`${buttonBase} ${range === 'month' ? selectedClass : idleClass}`}
						aria-pressed={range === 'month'}
						onClick={() => setRange('month')}
					>
						{t('bodyDiagram.range.month')}
					</button>
					<button
						type="button"
						className={`${buttonBase} ${range === 'total' ? selectedClass : idleClass}`}
						aria-pressed={range === 'total'}
						onClick={() => setRange('total')}
					>
						{t('bodyDiagram.range.total')}
					</button>
				</div>
			</header>

			<MuscleHeatmap muscleAnalytics={analytics} />
		</div>
	)
}
