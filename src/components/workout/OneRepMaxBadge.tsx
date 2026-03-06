import { useTranslation } from 'react-i18next'
import { calculate1RM } from '../../utils/calculations'

interface OneRepMaxBadgeProps {
    weight: number
    reps: number
}

export function OneRepMaxBadge({ weight, reps }: OneRepMaxBadgeProps) {
    const { t } = useTranslation()
    const oneRepMax = calculate1RM(weight, reps)

    if (oneRepMax <= 0) {
        return <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('oneRepMax.estimatedEmpty')}</p>
    }

    return (
        <p className="text-[11px] text-slate-600 dark:text-slate-300">
            {t('oneRepMax.estimatedLabel')}: <span className="font-semibold">{oneRepMax.toFixed(1)} kg</span>
        </p>
    )
}
