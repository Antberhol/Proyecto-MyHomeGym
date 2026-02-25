interface RestTimerOverlayProps {
    restSeconds: number
    formatClock: (seconds: number) => string
}

export function RestTimerOverlay({ restSeconds, formatClock }: RestTimerOverlayProps) {
    if (restSeconds <= 0) return null

    return (
        <div className="pointer-events-none fixed bottom-24 right-4 z-40 rounded-xl bg-gym-primary/95 px-4 py-3 text-white shadow-xl">
            <p className="text-xs uppercase tracking-wide">Descanso</p>
            <p className="text-2xl font-bold">{formatClock(restSeconds)}</p>
        </div>
    )
}
