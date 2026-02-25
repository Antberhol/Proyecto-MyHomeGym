export interface WorkoutShareData {
    totalVolume: number
    durationMinutes: number
    prsCreated: number
    setCount: number
    dateLabel?: string
}

interface WorkoutShareCardProps {
    data: WorkoutShareData
}

export function WorkoutShareCard({ data }: WorkoutShareCardProps) {
    return (
        <div className="relative flex h-[640px] w-[360px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gym-bgDark p-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e6394622,transparent_55%)]" />

            <header className="relative">
                <p className="text-sm tracking-[0.2em] text-slate-300">MYHOMEGYM</p>
                <h2 className="mt-2 text-4xl font-black leading-tight">
                    WORKOUT
                    <br />
                    COMPLETE ✅
                </h2>
                <p className="mt-3 text-sm text-slate-300">{data.dateLabel ?? new Date().toLocaleDateString()}</p>
            </header>

            <main className="relative space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-300">Volumen total</p>
                    <p className="text-4xl font-extrabold">{data.totalVolume.toFixed(0)} kg</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[11px] text-slate-300">Tiempo</p>
                        <p className="text-xl font-bold">{data.durationMinutes}m</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[11px] text-slate-300">Series</p>
                        <p className="text-xl font-bold">{data.setCount}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[11px] text-slate-300">PRs</p>
                        <p className="text-xl font-bold">{data.prsCreated}</p>
                    </div>
                </div>
            </main>

            <footer className="relative text-sm text-slate-300">Entrena inteligente. Progresa cada semana. 💪</footer>
        </div>
    )
}
