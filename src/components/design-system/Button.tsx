import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes } from 'react'

function cn(...inputs: Array<string | undefined | false>) {
    return twMerge(clsx(inputs))
}

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-60',
    {
        variants: {
            variant: {
                primary:
                    'bg-gym-yellow text-black font-bold tracking-wide uppercase hover:bg-gym-yellow-light active:scale-95',
                secondary: 'border border-gym-yellow text-gym-yellow bg-transparent hover:bg-gym-yellow/10',
                danger: 'bg-gym-danger text-white hover:opacity-90',
                ghost: 'text-gym-text-dim hover:text-gym-text-bright',
            },
            size: {
                sm: 'h-9 px-3 text-sm',
                md: 'h-10 px-4 text-sm',
                lg: 'h-11 px-5 text-base',
            },
            fullWidth: {
                true: 'w-full',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            fullWidth: false,
        },
    },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, fullWidth, ...props }: ButtonProps) {
    return <button className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />
}
