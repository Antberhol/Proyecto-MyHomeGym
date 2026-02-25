import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface BottomSheetProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onClick={onClose}
                >
                    <motion.section
                        role="dialog"
                        aria-modal="true"
                        aria-label={title ?? 'Bottom sheet'}
                        className="w-full rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-gym-cardDark"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
                        drag="y"
                        dragDirectionLock
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.22 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 120 || info.velocity.y > 800) {
                                onClose()
                            }
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
                        {title && <h3 className="mb-3 text-base font-semibold">{title}</h3>}
                        {children}
                    </motion.section>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
