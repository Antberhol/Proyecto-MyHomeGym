import type { Routine } from '../../types/models'

interface RoutineSelectorProps {
    routines: Routine[]
    onStartRoutine: (routineId: string) => void
    onStartFree: () => void
}

export function RoutineSelector({ routines, onStartRoutine, onStartFree }: RoutineSelectorProps) {
    return (
        <section className="space-y-4 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
            <div>
                <h2 className="text-lg font-semibold">Selecciona tu entrenamiento</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Elige una rutina para iniciar en modo guiado o usa entreno libre.
                </p>
            </div>

            <button
                type="button"
                onClick={onStartFree}
                className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-4 text-left transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
            >
                <p className="text-base font-semibold">Entreno Libre</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">Sin rutina predefinida</p>
            </button>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {routines.map((routine) => (
                    <article key={routine.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: routine.color }} />
                            <h3 className="font-semibold">{routine.nombre}</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{routine.descripcion || 'Sin descripción'}</p>
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{routine.diasSemana.join(' · ')}</p>

                        <button
                            type="button"
                            onClick={() => onStartRoutine(routine.id)}
                            className="mt-3 h-11 w-full rounded-lg bg-gym-primary px-3 text-sm font-semibold text-white"
                        >
                            Iniciar Entrenamiento
                        </button>
                    </article>
                ))}
            </div>

            {routines.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-300">No tienes rutinas todavía. Puedes iniciar entreno libre.</p>
            )}
        </section>
    )
}
