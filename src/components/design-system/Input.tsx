import { clsx } from 'clsx'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import type { InputHTMLAttributes } from 'react'

function cn(...inputs: Array<string | undefined | false>) {
    return twMerge(clsx(inputs))
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, className, containerClassName, id, ...props },
    ref,
) {
    const inputId = id ?? props.name

    return (
        <div className={cn('space-y-1', containerClassName)}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={cn(
                    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-gym-primary dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100',
                    error && 'border-red-500 focus:border-red-500',
                    className,
                )}
                {...props}
            />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
    )
})
