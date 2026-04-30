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
            className={cn('bg-gym-card border border-gym-border rounded-xl p-4', className)}
            {...props}
        />
    )
}
