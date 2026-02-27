import { useTranslation } from 'react-i18next'

interface WorkoutControlsProps {
    sessionSeconds: number
    sessionRunning: boolean
    restSeconds: number
    formatClock: (seconds: number) => string
    onToggleSession: () => void
    onApplySessionDuration: () => void
    onStartRest: (seconds: number) => void
    onResetRest: () => void
    onFinishWorkout: () => void
    onDiscardWorkout: () => void
}

export function WorkoutControls({
    sessionSeconds,
    sessionRunning,
    restSeconds,
    formatClock,
    onToggleSession,
    onApplySessionDuration,
    onStartRest,
    onResetRest,
    onFinishWorkout,
    onDiscardWorkout,
}: WorkoutControlsProps) {
    const { t } = useTranslation()

    return (
        <section className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark md:grid-cols-3">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-300">{t('training.controls.sessionTimer')}</p>
                <p className="text-3xl font-bold">{formatClock(sessionSeconds)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onToggleSession}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        {sessionRunning ? t('training.controls.pause') : t('training.controls.resume')}
                    </button>
                    <button
                        type="button"
                        onClick={onApplySessionDuration}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        {t('training.controls.useForDuration')}
                    </button>
                </div>
            </div>

            <div>
                <p className="text-sm text-slate-500 dark:text-slate-300">{t('training.controls.restTimer')}</p>
                <p className="text-3xl font-bold">{formatClock(restSeconds)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onStartRest(60)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        60s
                    </button>
                    <button
                        type="button"
                        onClick={() => onStartRest(90)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        90s
                    </button>
                    <button
                        type="button"
                        onClick={() => onStartRest(120)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        120s
                    </button>
                    <button
                        type="button"
                        onClick={onResetRest}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                    >
                        {t('training.controls.reset')}
                    </button>
                </div>
            </div>

            <div className="grid items-end gap-2">
                <button
                    type="button"
                    onClick={onFinishWorkout}
                    className="w-full rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white"
                >
                    {t('training.controls.finishWorkout')}
                </button>
                <button
                    type="button"
                    onClick={onDiscardWorkout}
                    className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
                >
                    {t('training.controls.discardWorkout')}
                </button>
            </div>
        </section>
    )
}
