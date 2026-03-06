import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { progressRepository } from '../repositories/progressRepository'
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

    if (['biceps', 'triceps', 'antebrazos', 'brazo', 'brazos'].includes(normalized)) return 'arms'
    if (['dorsales', 'trapecio', 'espalda'].includes(normalized)) return 'back'
    if (['gluteos', 'gluteo', 'femorales', 'cuadriceps', 'pierna', 'piernas'].includes(normalized)) return 'legs'
    if (['abdominales', 'abdomen', 'abs', 'core'].includes(normalized)) return 'core'
    if (['pectoral', 'pectorales', 'pecho'].includes(normalized)) return 'chest'
    if (['deltoides', 'hombro', 'hombros'].includes(normalized)) return 'shoulders'

    return normalized
}

export function MuscleDistributionChart() {
    const { t } = useTranslation()
    const performedExercises = useLiveQuery(() => progressRepository.listPerformedExercises(), []) ?? []
    const exercises = useLiveQuery(() => progressRepository.listExercises(), []) ?? []

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
            <h2 className="mb-3 text-lg font-semibold">{t('muscleDistribution.title')}</h2>
            {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">{t('muscleDistribution.empty')}</p>
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
                                label={({ name, percent }) => {
                                    const label = t(`muscleGroups.${String(name)}`, { defaultValue: String(name) })
                                    return `${label} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                                }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `${Number(value ?? 0).toFixed(0)} kg`}
                                labelFormatter={(label) => t(`muscleGroups.${String(label)}`, { defaultValue: String(label) })}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    )
}
