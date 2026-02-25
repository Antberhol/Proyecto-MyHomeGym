interface NumberStepperProps {
    value: number
    onChange: (nextValue: number) => void
    step?: number
    min?: number
    max?: number
    label?: string
    id?: string
    decimals?: number
}

export function NumberStepper({
    value,
    onChange,
    step = 1,
    min = 0,
    max,
    label,
    id,
    decimals,
}: NumberStepperProps) {
    const clampValue = (nextValue: number) => {
        const withMin = Math.max(min, nextValue)
        if (typeof max === 'number') {
            return Math.min(max, withMin)
        }
        return withMin
    }

    const normalizeValue = (nextValue: number) => {
        const fixed = typeof decimals === 'number' ? Number(nextValue.toFixed(decimals)) : nextValue
        return clampValue(fixed)
    }

    const increment = () => {
        onChange(normalizeValue(value + step))
    }

    const decrement = () => {
        onChange(normalizeValue(value - step))
    }

    const handleInputChange = (raw: string) => {
        const normalizedRaw = raw.replace(',', '.')
        const parsed = Number(normalizedRaw)
        onChange(normalizeValue(Number.isFinite(parsed) ? parsed : 0))
    }

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    {label}
                </label>
            )}
            <div className="grid grid-cols-[3rem_1fr_3rem] items-stretch rounded-xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
                <button
                    type="button"
                    onClick={decrement}
                    className="rounded-l-xl text-2xl font-bold text-slate-700 active:scale-[0.98] dark:text-slate-100"
                    aria-label={`Disminuir ${label ?? 'valor'}`}
                >
                    -
                </button>
                <input
                    id={id}
                    type="number"
                    value={Number.isFinite(value) ? value : 0}
                    onChange={(event) => handleInputChange(event.target.value)}
                    className="w-full border-x border-slate-200 bg-transparent px-2 py-2 text-center text-base font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:text-slate-100"
                    inputMode="decimal"
                    pattern="[0-9]*"
                />
                <button
                    type="button"
                    onClick={increment}
                    className="rounded-r-xl text-2xl font-bold text-slate-700 active:scale-[0.98] dark:text-slate-100"
                    aria-label={`Aumentar ${label ?? 'valor'}`}
                >
                    +
                </button>
            </div>
        </div>
    )
}
