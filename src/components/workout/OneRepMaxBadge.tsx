import { calculate1RM } from '../../utils/calculations'

interface OneRepMaxBadgeProps {
    weight: number
    reps: number
}

export function OneRepMaxBadge({ weight, reps }: OneRepMaxBadgeProps) {
    const oneRepMax = calculate1RM(weight, reps)

    if (oneRepMax <= 0) {
        return <p className="text-[11px] text-slate-500 dark:text-slate-400">1RM Est: —</p>
    }

    return (
        <p className="text-[11px] text-slate-600 dark:text-slate-300">
            1RM Est: <span className="font-semibold">{oneRepMax.toFixed(1)} kg</span>
        </p>
    )
}
