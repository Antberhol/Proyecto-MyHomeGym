import { Flame } from 'lucide-react'

interface StreakBadgeProps {
    dayStreak: number
    weekStreak: number
    totalTrainings: number
}

export function StreakBadge({ dayStreak, weekStreak, totalTrainings }: StreakBadgeProps) {
    const isHot = dayStreak > 3

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300 ${isHot ? 'animate-pulse' : ''}`}
            title={`Racha actual: ${dayStreak} días consecutivos`}
            aria-label={`Racha de ${dayStreak} días y ${weekStreak} semanas. ${totalTrainings} entrenamientos totales.`}
        >
            <Flame size={16} className="fill-current" />
            <span className="text-xs font-semibold">🔥 {dayStreak}d · {weekStreak}w</span>
            <span className="text-[11px] opacity-80">{totalTrainings} total</span>
        </div>
    )
}
