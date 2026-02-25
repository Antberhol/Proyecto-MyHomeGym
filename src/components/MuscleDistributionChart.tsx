import { useLiveQuery } from 'dexie-react-hooks'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { db } from '../lib/db'
import { calculateSetVolume } from '../utils/calculations'

const PIE_COLORS = ['#E63946', '#1D3557', '#06D6A0', '#FFD166', '#118AB2', '#9B5DE5', '#8D99AE']

interface MuscleDistributionDatum {
    name: string
    value: number
}

function normalizeGroup(group: string): string {
    const normalized = group
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()

    if (['biceps', 'triceps', 'antebrazos', 'brazo', 'brazos'].includes(normalized)) return 'Brazos'
    if (['dorsales', 'trapecio', 'espalda'].includes(normalized)) return 'Espalda'
    if (['gluteos', 'gluteo', 'femorales', 'cuadriceps', 'pierna', 'piernas'].includes(normalized)) return 'Piernas'
    if (['abdominales', 'abdomen', 'abs', 'core'].includes(normalized)) return 'Core'
    if (['pectoral', 'pectorales', 'pecho'].includes(normalized)) return 'Pecho'
    if (['deltoides', 'hombro', 'hombros'].includes(normalized)) return 'Hombros'

    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function MuscleDistributionChart() {
    const performedExercises = useLiveQuery(() => db.ejerciciosRealizados.toArray(), []) ?? []
    const exercises = useLiveQuery(() => db.ejerciciosCatalogo.toArray(), []) ?? []

    const exerciseGroupMap = new Map(exercises.map((exercise) => [exercise.id, normalizeGroup(exercise.grupoMuscularPrimario)]))

    const data = performedExercises.reduce<Record<string, number>>((acc, set) => {
        const group = exerciseGroupMap.get(set.ejercicioId)
        if (!group) return acc

        const setVolume = calculateSetVolume(set.pesoUtilizado, set.repeticionesRealizadas)
        acc[group] = (acc[group] ?? 0) + setVolume
        return acc
    }, {})

    const chartData: MuscleDistributionDatum[] = Object.entries(data)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    return (
        <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
            <h2 className="mb-3 text-lg font-semibold">Distribución muscular</h2>
            {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">Aún no hay series registradas para calcular la distribución.</p>
            ) : (
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={95}
                                paddingAngle={2}
                                label={({ name, percent }) => `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(0)} kg`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    )
}
