import { Trash } from 'lucide-react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

interface SwipeToDeleteItemProps {
    children: ReactNode
    onDelete: () => void | Promise<void>
    threshold?: number
    disabled?: boolean
    className?: string
}

export function SwipeToDeleteItem({
    children,
    onDelete,
    threshold = -80,
    disabled = false,
    className,
}: SwipeToDeleteItemProps) {
    const x = useMotionValue(0)
    const reveal = useTransform(x, [-140, 0], [1, 0])

    const resetPosition = () => {
        void animate(x, 0, {
            type: 'spring',
            stiffness: 360,
            damping: 28,
        })
    }

    return (
        <div className={`relative overflow-hidden rounded-xl ${className ?? ''}`}>
            <motion.div
                style={{ opacity: reveal }}
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end bg-red-500 px-5 text-white"
                aria-hidden="true"
            >
                <Trash size={20} />
            </motion.div>

            <motion.div
                drag={disabled ? false : 'x'}
                dragConstraints={{ left: -160, right: 0 }}
                dragElastic={0.08}
                style={{ x }}
                onDragEnd={(_, info) => {
                    if (disabled) {
                        resetPosition()
                        return
                    }

                    if (info.offset.x <= threshold || x.get() <= threshold) {
                        void onDelete()
                        resetPosition()
                        return
                    }

                    resetPosition()
                }}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </div>
    )
}
