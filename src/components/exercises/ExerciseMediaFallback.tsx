import { Dumbbell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ExerciseMediaFallbackProps {
    className?: string
}

export function ExerciseMediaFallback({ className = '' }: ExerciseMediaFallbackProps) {
    const { i18n } = useTranslation()
    const isSpanish = i18n.language.toLowerCase().startsWith('es')
    const label = isSpanish ? 'Sin imagen disponible' : 'No image available'

    return (
        <div
            role="img"
            aria-label={label}
            className={`flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 dark:from-slate-800 dark:to-slate-900 dark:text-slate-200 ${className}`}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-white/60 p-2 dark:bg-slate-700/60">
                    <Dumbbell size={24} strokeWidth={2.3} />
                </div>
                <span className="px-3 text-[11px] font-semibold tracking-wide">{label}</span>
            </div>
        </div>
    )
}
