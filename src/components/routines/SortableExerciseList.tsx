import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { ExerciseThumbnail } from '../exercises/ExerciseThumbnail'

interface SortableRoutineExercise {
    id: string
    ejercicio?: {
        nombre: string
        grupoMuscularPrimario?: string
        equipoNecesario?: string
        imagenUrl?: string
        exerciseDbId?: string
        exerciseDbName?: string
        exerciseDbAliases?: string[]
    }
    series: number
    repeticiones: string
    descansoSegundos: number
}

interface SortableExerciseListProps {
    items: SortableRoutineExercise[]
    editingRoutineExerciseId: string
    editSeries: number
    editRepeticiones: string
    editDescansoSegundos: number
    onEditSeriesChange: (value: number) => void
    onEditRepeticionesChange: (value: string) => void
    onEditDescansoChange: (value: number) => void
    onStartEdit: (routineExerciseId: string) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onMove: (routineExerciseId: string, direction: 'up' | 'down') => void
    onRemove: (routineExerciseId: string) => void
    onReorder: (sourceId: string, targetId: string) => void
}

interface SortableItemProps {
    item: SortableRoutineExercise
    index: number
    isEditing: boolean
    editSeries: number
    editRepeticiones: string
    editDescansoSegundos: number
    onEditSeriesChange: (value: number) => void
    onEditRepeticionesChange: (value: string) => void
    onEditDescansoChange: (value: number) => void
    onStartEdit: (routineExerciseId: string) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onMove: (routineExerciseId: string, direction: 'up' | 'down') => void
    onRemove: (routineExerciseId: string) => void
}

function SortableItem({
    item,
    index,
    isEditing,
    editSeries,
    editRepeticiones,
    editDescansoSegundos,
    onEditSeriesChange,
    onEditRepeticionesChange,
    onEditDescansoChange,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onMove,
    onRemove,
}: SortableItemProps) {
    const { t } = useTranslation()
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
        >
            <div className="flex items-center gap-3">
                <ExerciseThumbnail
                    nombre={item.ejercicio?.nombre || t('dashboard.common.exercise')}
                    grupoMuscularPrimario={item.ejercicio?.grupoMuscularPrimario}
                    equipoNecesario={item.ejercicio?.equipoNecesario}
                    imagenUrl={item.ejercicio?.imagenUrl}
                    exerciseDbId={item.ejercicio?.exerciseDbId}
                    exerciseDbName={item.ejercicio?.exerciseDbName}
                    exerciseDbAliases={item.ejercicio?.exerciseDbAliases}
                    className="h-12 w-16"
                />
                <div>
                    <p className="font-medium">
                        {index + 1}. {item.ejercicio?.nombre || t('sortableExerciseList.exerciseNotFound')}
                    </p>
                    {isEditing ? (
                        <div className="mt-1 grid grid-cols-1 gap-1 md:grid-cols-3">
                            <input
                                type="number"
                                value={editSeries}
                                onChange={(event) => onEditSeriesChange(Number(event.target.value) || 1)}
                                className="rounded border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                                placeholder={t('training.setsPlaceholder')}
                            />
                            <input
                                value={editRepeticiones}
                                onChange={(event) => onEditRepeticionesChange(event.target.value)}
                                className="rounded border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                                placeholder={t('training.repsPlaceholder')}
                            />
                            <input
                                type="number"
                                value={editDescansoSegundos}
                                onChange={(event) => onEditDescansoChange(Number(event.target.value) || 15)}
                                className="rounded border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                                placeholder={t('routines.restPlaceholder')}
                            />
                        </div>
                    ) : (
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            {t('sortableExerciseList.summary', {
                                series: item.series,
                                reps: item.repeticiones,
                                rest: item.descansoSegundos,
                            })}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="cursor-grab rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    aria-label={t('sortableExerciseList.dragExerciseAria')}
                    {...attributes}
                    {...listeners}
                >
                    ↕
                </button>
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            onClick={onSaveEdit}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                        >
                            {t('common.save')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                        >
                            {t('common.cancel')}
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => onStartEdit(item.id)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    >
                        {t('common.edit')}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onMove(item.id, 'up')}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                >
                    ↑
                </button>
                <button
                    type="button"
                    onClick={() => onMove(item.id, 'down')}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                >
                    ↓
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-red-600"
                >
                    {t('catalog.delete')}
                </button>
            </div>
        </li>
    )
}

export function SortableExerciseList({
    items,
    editingRoutineExerciseId,
    editSeries,
    editRepeticiones,
    editDescansoSegundos,
    onEditSeriesChange,
    onEditRepeticionesChange,
    onEditDescansoChange,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onMove,
    onRemove,
    onReorder,
}: SortableExerciseListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const sourceId = String(active.id)
        const targetId = String(over.id)

        const oldIndex = items.findIndex((item) => item.id === sourceId)
        const newIndex = items.findIndex((item) => item.id === targetId)
        if (oldIndex === -1 || newIndex === -1) return

        arrayMove(items, oldIndex, newIndex)
        onReorder(sourceId, targetId)
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <SortableItem
                            key={item.id}
                            item={item}
                            index={index}
                            isEditing={editingRoutineExerciseId === item.id}
                            editSeries={editSeries}
                            editRepeticiones={editRepeticiones}
                            editDescansoSegundos={editDescansoSegundos}
                            onEditSeriesChange={onEditSeriesChange}
                            onEditRepeticionesChange={onEditRepeticionesChange}
                            onEditDescansoChange={onEditDescansoChange}
                            onStartEdit={onStartEdit}
                            onSaveEdit={onSaveEdit}
                            onCancelEdit={onCancelEdit}
                            onMove={onMove}
                            onRemove={onRemove}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}
