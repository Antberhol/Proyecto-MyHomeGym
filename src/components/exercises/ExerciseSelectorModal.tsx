import { Dumbbell, Search, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Virtuoso } from 'react-virtuoso'
import { ExerciseThumbnail } from './ExerciseThumbnail'
import { BottomSheet } from '../ui/BottomSheet'

interface ExerciseOption {
    id: string
    nombre: string
    grupoMuscularPrimario: string
    gruposMuscularesSecundarios: string[]
    equipoNecesario: string
    tipoEjercicio?: 'fuerza' | 'cardio' | 'movilidad' | 'estiramiento'
    imagenUrl?: string
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
}

interface ExerciseSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    exercises: ExerciseOption[]
    selectedIds?: string[]
    usageFrequencyById?: Record<string, number>
    onConfirm: (exerciseIds: string[]) => void
}

const GROUP_ORDER = ['todos', 'pecho', 'espalda', 'piernas', 'hombros', 'biceps', 'triceps', 'core']

function equipmentIcon(equipo: string) {
    const normalized = equipo.toLowerCase()
    if (normalized.includes('maquina') || normalized.includes('cable')) {
        return <Settings2 size={14} className="text-slate-500 dark:text-slate-300" />
    }
    return <Dumbbell size={14} className="text-slate-500 dark:text-slate-300" />
}

export function ExerciseSelectorModal({
    isOpen,
    onClose,
    exercises,
    selectedIds = [],
    usageFrequencyById = {},
    onConfirm,
}: ExerciseSelectorModalProps) {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    const [group, setGroup] = useState('todos')
    const [secondaryFilters, setSecondaryFilters] = useState<string[]>([])
    const [sortMode, setSortMode] = useState<'default' | 'mostUsed'>('default')
    const [typeFilter, setTypeFilter] = useState<'all' | 'fuerza' | 'cardio' | 'movilidad' | 'estiramiento'>('all')
    const [localSelected, setLocalSelected] = useState<string[]>(selectedIds)

    const groups = useMemo(() => {
        const unique = Array.from(new Set(exercises.map((item) => item.grupoMuscularPrimario.toLowerCase())))
        const sorted = [...GROUP_ORDER.filter((value) => value === 'todos' || unique.includes(value))]
        for (const value of unique) {
            if (!sorted.includes(value)) sorted.push(value)
        }
        return sorted
    }, [exercises])

    const secondaryGroups = useMemo(() => {
        const unique = new Set<string>()
        for (const exercise of exercises) {
            for (const muscle of exercise.gruposMuscularesSecundarios ?? []) {
                unique.add(muscle.toLowerCase())
            }
        }
        return Array.from(unique).sort()
    }, [exercises])

    const filtered = useMemo(() => {
        const filteredList = exercises.filter((item) => {
            const matchesSearch = item.nombre.toLowerCase().includes(search.toLowerCase())
            const matchesGroup = group === 'todos' || item.grupoMuscularPrimario.toLowerCase() === group
            const matchesSecondary =
                secondaryFilters.length === 0
                || (item.gruposMuscularesSecundarios ?? []).some((muscle) =>
                    secondaryFilters.includes(muscle.toLowerCase()),
                )
            const matchesType = typeFilter === 'all' || item.tipoEjercicio === typeFilter
            return matchesSearch && matchesGroup && matchesSecondary && matchesType
        })

        if (sortMode === 'mostUsed') {
            return filteredList
                .slice()
                .sort((a, b) => (usageFrequencyById[b.id] ?? 0) - (usageFrequencyById[a.id] ?? 0))
        }

        return filteredList
    }, [exercises, group, search, secondaryFilters, sortMode, typeFilter, usageFrequencyById])

    const toggle = (id: string) => {
        setLocalSelected((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        )
    }

    const toggleSecondaryFilter = (muscle: string) => {
        setSecondaryFilters((current) =>
            current.includes(muscle) ? current.filter((item) => item !== muscle) : [...current, muscle],
        )
    }

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title={t('exerciseSelector.title')}>
            <div className="max-h-[75vh] space-y-3 overflow-y-auto pb-2">
                <div className="relative">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t('exerciseSelector.searchPlaceholder')}
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                </div>

                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {groups.map((item) => {
                        const active = group === item
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setGroup(item)}
                                className={`h-11 whitespace-nowrap rounded-full px-4 text-sm font-medium ${active
                                    ? 'bg-gym-primary text-white'
                                    : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
                                    }`}
                            >
                                {item === 'todos'
                                    ? t('exerciseSelector.allGroup')
                                    : t(`muscleGroups.${item}`, {
                                        defaultValue: item.charAt(0).toUpperCase() + item.slice(1),
                                    })}
                            </button>
                        )
                    })}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setSortMode((current) => (current === 'mostUsed' ? 'default' : 'mostUsed'))}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${sortMode === 'mostUsed'
                            ? 'bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/40'
                            : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                            }`}
                    >
                        {t('exerciseSelector.mostUsed')}
                    </button>
                    <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}
                        className="h-9 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                    >
                        <option value="all">{t('exerciseSelector.typeAll')}</option>
                        <option value="fuerza">{t('exerciseSelector.typeStrength')}</option>
                        <option value="cardio">{t('exerciseSelector.typeCardio')}</option>
                        <option value="movilidad">{t('exerciseSelector.typeMobility')}</option>
                        <option value="estiramiento">{t('exerciseSelector.typeStretching')}</option>
                    </select>
                </div>

                {secondaryGroups.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {secondaryGroups.map((muscle) => {
                            const active = secondaryFilters.includes(muscle)
                            return (
                                <button
                                    key={muscle}
                                    type="button"
                                    onClick={() => toggleSecondaryFilter(muscle)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${active
                                        ? 'bg-gym-primary/10 text-gym-primary border border-gym-primary/40'
                                        : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {t(`muscleGroups.${muscle}`, {
                                        defaultValue: muscle.charAt(0).toUpperCase() + muscle.slice(1),
                                    })}
                                </button>
                            )
                        })}
                    </div>
                ) : null}

                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-300">{t('exerciseSelector.emptyWithFilters')}</p>
                    ) : (
                        <Virtuoso
                            data={filtered}
                            className="max-h-[50vh]"
                            itemContent={(_, exercise) => {
                                const checked = localSelected.includes(exercise.id)
                                const usageCount = usageFrequencyById[exercise.id] ?? 0
                                return (
                                    <div
                                        key={exercise.id}
                                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ExerciseThumbnail
                                                exerciseId={exercise.id}
                                                nombre={exercise.nombre}
                                                grupoMuscularPrimario={exercise.grupoMuscularPrimario}
                                                equipoNecesario={exercise.equipoNecesario}
                                                imagenUrl={exercise.imagenUrl}
                                                exerciseDbId={exercise.exerciseDbId}
                                                exerciseDbName={exercise.exerciseDbName}
                                                exerciseDbAliases={exercise.exerciseDbAliases}
                                                className="h-14 w-20"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {exercise.nombre}
                                                    {usageCount > 0 ? (
                                                        <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">× {usageCount}</span>
                                                    ) : null}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                                                        {exercise.grupoMuscularPrimario}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        {equipmentIcon(exercise.equipoNecesario)} {exercise.equipoNecesario}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggle(exercise.id)}
                                            className={`h-11 rounded-lg px-3 text-xs font-medium ${checked
                                                ? 'bg-gym-primary text-white'
                                                : 'border border-slate-300 dark:border-slate-600'
                                                }`}
                                        >
                                            {checked ? t('exerciseSelector.added') : t('exerciseSelector.add')}
                                        </button>
                                    </div>
                                )
                            }}
                        />
                    )}
                </div>

                <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-slate-200 bg-white pt-3 dark:border-slate-700 dark:bg-gym-cardDark">
                    <p className="text-xs text-slate-500 dark:text-slate-300">{t('exerciseSelector.selectedCount', { count: localSelected.length })}</p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-lg border border-slate-300 px-3 text-xs dark:border-slate-600"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm(localSelected)
                                onClose()
                            }}
                            className="h-11 rounded-lg bg-gym-primary px-3 text-xs font-semibold text-white"
                        >
                            {t('exerciseSelector.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}
