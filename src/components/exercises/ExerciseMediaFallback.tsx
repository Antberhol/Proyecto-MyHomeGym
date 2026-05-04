import { ImageOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ExerciseMediaFallbackProps {
    className?: string
    label?: string
    showPulse?: boolean
}

export function ExerciseMediaFallback({ className = '', label, showPulse = false }: ExerciseMediaFallbackProps) {
    const { i18n } = useTranslation()
    const isSpanish = i18n.language.toLowerCase().startsWith('es')
    const resolvedLabel = label ?? (isSpanish ? 'Sin imagen disponible' : 'No image available')

    return (
        <div
            role="img"
            aria-label={resolvedLabel}
            className={`flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200 ${showPulse ? 'animate-pulse' : ''} ${className}`}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-white/60 p-2 dark:bg-slate-700/60">
                    <ImageOff size={24} strokeWidth={2.3} />
                </div>
                <span className="px-3 text-[11px] font-semibold tracking-wide">{resolvedLabel}</span>
            </div>
        </div>
    )
}
