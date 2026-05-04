import { Flame } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StreakBadgeProps {
    dayStreak: number
    weekStreak: number
    totalTrainings: number
}

export function StreakBadge({ dayStreak, weekStreak, totalTrainings }: StreakBadgeProps) {
    const { t } = useTranslation()
    const isHot = dayStreak > 3

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300 ${isHot ? 'animate-pulse' : ''}`}
            title={t('a11y.streakBadgeTitle', { days: dayStreak })}
            aria-label={t('a11y.streakBadgeAria', { days: dayStreak, weeks: weekStreak, total: totalTrainings })}
        >
            <Flame size={16} className="fill-current" />
            <span className="text-xs font-semibold">🔥 {dayStreak}d · {weekStreak}w</span>
            <span className="text-[11px] opacity-80">{totalTrainings} total</span>
        </div>
    )
}
