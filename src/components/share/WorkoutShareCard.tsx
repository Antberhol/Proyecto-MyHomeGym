import { useTranslation } from 'react-i18next'

interface ShareMuscleDatum {
    muscle: string
    volume: number
}

interface ShareExerciseDatum {
    name: string
    volume: number
}

export interface WorkoutShareData {
    totalVolume: number
    durationMinutes: number
    prsCreated: number
    setCount: number
    dateLabel?: string
    muscleDistribution?: ShareMuscleDatum[]
    topExercises?: ShareExerciseDatum[]
}

interface WorkoutShareCardProps {
    data: WorkoutShareData
}

export function WorkoutShareCard({ data }: WorkoutShareCardProps) {
    const { t } = useTranslation()
    const maxMuscleVolume = Math.max(...(data.muscleDistribution?.map((item) => item.volume) ?? [1]))
    const topMuscles = (data.muscleDistribution ?? []).slice(0, 4)
    const topExercises = (data.topExercises ?? []).slice(0, 3)

    return (
        <div className="relative flex h-[640px] w-[360px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0B1021] p-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,#22d3ee55,transparent_45%),radial-gradient(circle_at_85%_10%,#f43f5e44,transparent_42%),linear-gradient(160deg,#0B1021_0%,#101935_45%,#0d1328_100%)]" />
            <div className="pointer-events-none absolute -right-8 top-40 h-44 w-44 rounded-full border border-cyan-300/20 bg-cyan-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -left-6 bottom-24 h-36 w-36 rounded-full border border-rose-300/20 bg-rose-400/10 blur-2xl" />

            <header className="relative">
                <p className="text-sm tracking-[0.2em] text-cyan-200">MYHOMEGYM</p>
                <h2 className="mt-2 text-4xl font-black leading-tight">
                    {t('workoutShare.titleLine1')}
                    <br />
                    {t('workoutShare.titleLine2')}
                </h2>
                <p className="mt-3 text-sm text-slate-300">{data.dateLabel ?? new Date().toLocaleDateString()} · PR Mode</p>
            </header>

            <main className="relative space-y-3">
                <div className="rounded-2xl border border-cyan-200/20 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-wide text-cyan-100">{t('workoutShare.totalVolume')}</p>
                    <p className="text-4xl font-extrabold tracking-tight">{data.totalVolume.toFixed(0)} kg</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                        <p className="text-[11px] text-slate-300">{t('workoutShare.time')}</p>
                        <p className="text-xl font-bold">{data.durationMinutes}m</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                        <p className="text-[11px] text-slate-300">{t('workoutShare.sets')}</p>
                        <p className="text-xl font-bold">{data.setCount}</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                        <p className="text-[11px] text-slate-300">{t('workoutShare.prs')}</p>
                        <p className="text-xl font-bold">{data.prsCreated}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Muscle Distribution</p>
                    {topMuscles.length === 0 ? (
                        <p className="text-xs text-slate-300">No muscle data available</p>
                    ) : (
                        <div className="space-y-2">
                            {topMuscles.map((item) => {
                                const width = Math.max(12, (item.volume / maxMuscleVolume) * 100)
                                return (
                                    <div key={item.muscle} className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="capitalize text-slate-200">{item.muscle}</span>
                                            <span className="text-cyan-100">{item.volume.toFixed(0)} kg</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/10">
                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-rose-300" style={{ width: `${width}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Top Exercises</p>
                    {topExercises.length === 0 ? (
                        <p className="text-xs text-slate-300">No exercise breakdown</p>
                    ) : (
                        <ul className="space-y-1 text-[11px] text-slate-100">
                            {topExercises.map((item, index) => (
                                <li key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
                                    <span className="truncate pr-2">{item.name}</span>
                                    <span className="font-semibold text-cyan-100">{item.volume.toFixed(0)} kg</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            <footer className="relative text-sm text-slate-300">{t('workoutShare.footer')} · #MyHomeGym</footer>
        </div>
    )
}
