import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'react'

function cn(...inputs: Array<string | undefined | false>) {
    return twMerge(clsx(inputs))
}

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-gym-cardDark', className)}
            {...props}
        />
    )
}
