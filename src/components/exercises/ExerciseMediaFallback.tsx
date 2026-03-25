import { Dumbbell } from 'lucide-react'

interface ExerciseMediaFallbackProps {
    className?: string
}

export function ExerciseMediaFallback({ className = '' }: ExerciseMediaFallbackProps) {
    return (
        <div
            role="img"
            aria-label="Exercise media fallback"
            className={`flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300 ${className}`}
        >
            <div className="flex flex-col items-center gap-2">
                <Dumbbell size={26} strokeWidth={2.2} />
                <span className="text-[10px] font-semibold uppercase tracking-wide">No GIF</span>
            </div>
        </div>
    )
}
