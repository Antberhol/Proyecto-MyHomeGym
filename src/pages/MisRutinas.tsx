import { zodResolver } from '@hookform/resolvers/zod'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ExerciseSelectorModal } from '../components/exercises/ExerciseSelectorModal'
import { SortableExerciseList } from '../components/routines/SortableExerciseList'
import { SwipeToDeleteItem } from '../components/ui/SwipeToDeleteItem'
import { routineAdminRepository } from '../repositories/routineAdminRepository'

const routineSchema = z.object({
  nombre: z.string().min(2).max(80),
  descripcion: z.string().max(200).optional(),
  diasSemana: z.string().min(1),
  color: z.string().min(4).max(20),
})

type RoutineForm = z.infer<typeof routineSchema>

export function MisRutinasPage() {
  const routines = useLiveQuery(() => routineAdminRepository.listRoutines(), []) ?? []
  const exercises = useLiveQuery(() => routineAdminRepository.listExercises(), []) ?? []
  const routineExercises = useLiveQuery(() => routineAdminRepository.listRoutineExercises(), []) ?? []
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('')
  const [editingRoutineId, setEditingRoutineId] = useState<string>('')
  const [editRoutineNombre, setEditRoutineNombre] = useState('')
  const [editRoutineDescripcion, setEditRoutineDescripcion] = useState('')
  const [editRoutineDiasSemana, setEditRoutineDiasSemana] = useState('')
  const [editRoutineColor, setEditRoutineColor] = useState('#E63946')
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false)
  const [series, setSeries] = useState<number>(4)
  const [repeticiones, setRepeticiones] = useState<string>('8-12')
  const [descansoSegundos, setDescansoSegundos] = useState<number>(90)
  const [editingRoutineExerciseId, setEditingRoutineExerciseId] = useState<string>('')
  const [editSeries, setEditSeries] = useState(4)
  const [editRepeticiones, setEditRepeticiones] = useState('8-12')
  const [editDescansoSegundos, setEditDescansoSegundos] = useState(90)
  const form = useForm<RoutineForm>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      color: '#E63946',
      diasSemana: 'lunes,miercoles,viernes',
    },
  })

  const onCreate = form.handleSubmit(async (values) => {
    const now = new Date().toISOString()
    await routineAdminRepository.createRoutine({
      id: crypto.randomUUID(),
      nombre: values.nombre,
      descripcion: values.descripcion,
      diasSemana: values.diasSemana
        .split(',')
        .map((day) => day.trim())
        .filter(Boolean),
      activa: true,
      color: values.color,
      createdAt: now,
      updatedAt: now,
    })

    form.reset({ color: '#E63946', diasSemana: 'lunes,miercoles,viernes' })
  })

  const toggleRoutineStatus = async (routineId: string, activa: boolean) => {
    await routineAdminRepository.updateRoutine(routineId, {
      activa: !activa,
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteRoutine = async (routineId: string) => {
    await routineAdminRepository.deleteRoutine(routineId)
  }

  const startEditRoutine = (routineId: string) => {
    const routine = routines.find((item) => item.id === routineId)
    if (!routine) return

    setEditingRoutineId(routineId)
    setEditRoutineNombre(routine.nombre)
    setEditRoutineDescripcion(routine.descripcion ?? '')
    setEditRoutineDiasSemana(routine.diasSemana.join(','))
    setEditRoutineColor(routine.color)
  }

  const cancelEditRoutine = () => {
    setEditingRoutineId('')
  }

  const saveRoutineEdits = async () => {
    if (!editingRoutineId) return

    await routineAdminRepository.updateRoutine(editingRoutineId, {
      nombre: editRoutineNombre.trim() || 'Rutina',
      descripcion: editRoutineDescripcion.trim() || undefined,
      diasSemana: editRoutineDiasSemana
        .split(',')
        .map((day) => day.trim())
        .filter(Boolean),
      color: editRoutineColor,
      updatedAt: new Date().toISOString(),
    })

    setEditingRoutineId('')
  }

  const selectedRoutineExercises = useMemo(() => {
    if (!selectedRoutineId) return []

    return routineExercises
      .filter((item) => item.rutinaId === selectedRoutineId)
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        ...item,
        ejercicio: exercises.find((exercise) => exercise.id === item.ejercicioId),
      }))
  }, [exercises, routineExercises, selectedRoutineId])

  const addExercisesToRoutine = async (exerciseIds: string[]) => {
    if (!selectedRoutineId || exerciseIds.length === 0) return

    const existingIds = new Set(
      routineExercises
        .filter((item) => item.rutinaId === selectedRoutineId)
        .map((item) => item.ejercicioId),
    )

    const idsToAdd = exerciseIds.filter((id) => !existingIds.has(id))
    if (idsToAdd.length === 0) return

    const currentOrders = routineExercises
      .filter((item) => item.rutinaId === selectedRoutineId)
      .map((item) => item.orden)
    const nextOrderBase = (currentOrders.length ? Math.max(...currentOrders) : 0) + 1

    await routineAdminRepository.createRoutineExercises(
      idsToAdd.map((exerciseId, index) => ({
        id: crypto.randomUUID(),
        rutinaId: selectedRoutineId,
        ejercicioId: exerciseId,
        orden: nextOrderBase + index,
        series: Math.max(1, series),
        repeticiones: repeticiones || '8-12',
        descansoSegundos: Math.max(15, descansoSegundos),
      })),
    )
  }

  const removeRoutineExercise = async (routineExerciseId: string) => {
    await routineAdminRepository.deleteRoutineExercise(routineExerciseId)
  }

  const moveRoutineExercise = async (routineExerciseId: string, direction: 'up' | 'down') => {
    const sorted = selectedRoutineExercises
    const currentIndex = sorted.findIndex((item) => item.id === routineExerciseId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= sorted.length) return

    const current = sorted[currentIndex]
    const target = sorted[targetIndex]

    await routineAdminRepository.swapRoutineExerciseOrder(current.id, current.orden, target.id, target.orden)
  }

  const reorderRoutineExercises = async (sourceId: string, targetId: string) => {
    if (!selectedRoutineId || sourceId === targetId) return

    const ordered = selectedRoutineExercises.slice()
    const sourceIndex = ordered.findIndex((item) => item.id === sourceId)
    const targetIndex = ordered.findIndex((item) => item.id === targetId)
    if (sourceIndex === -1 || targetIndex === -1) return

    const [moved] = ordered.splice(sourceIndex, 1)
    ordered.splice(targetIndex, 0, moved)

    await routineAdminRepository.reorderRoutineExercises(
      ordered.map((item, index) => ({
        id: item.id,
        orden: index + 1,
      })),
    )
  }

  const startEditRoutineExercise = (routineExerciseId: string) => {
    const routineExercise = selectedRoutineExercises.find((item) => item.id === routineExerciseId)
    if (!routineExercise) return

    setEditingRoutineExerciseId(routineExerciseId)
    setEditSeries(routineExercise.series)
    setEditRepeticiones(routineExercise.repeticiones)
    setEditDescansoSegundos(routineExercise.descansoSegundos)
  }

  const saveRoutineExerciseEdits = async () => {
    if (!editingRoutineExerciseId) return

    await routineAdminRepository.updateRoutineExercise(editingRoutineExerciseId, {
      series: Math.max(1, editSeries),
      repeticiones: editRepeticiones || '8-12',
      descansoSegundos: Math.max(15, editDescansoSegundos),
    })

    setEditingRoutineExerciseId('')
  }

  return (
    <div className="space-y-6">
      <header className="sticky top-0 z-10 bg-white/80 pb-3 pt-4 backdrop-blur-md dark:bg-slate-900/80">
        <h1 className="text-2xl font-bold">Mis rutinas</h1>
      </header>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Nueva rutina</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            {...form.register('nombre')}
            placeholder="Nombre de rutina"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <input
            {...form.register('diasSemana')}
            placeholder="lunes,miercoles,viernes"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <input
            {...form.register('descripcion')}
            placeholder="Descripción"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <input
            type="color"
            {...form.register('color')}
            className="h-10 w-full rounded-lg border border-slate-300"
          />
          <button type="submit" className="rounded-lg bg-gym-primary px-4 py-3 text-sm font-semibold text-white md:col-span-2">
            Crear rutina
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routines.map((routine) => (
          <SwipeToDeleteItem
            key={routine.id}
            onDelete={() => deleteRoutine(routine.id)}
            disabled={editingRoutineId === routine.id}
          >
            <article className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{routine.nombre}</h3>
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: routine.color }} />
              </div>

              {editingRoutineId === routine.id ? (
                <div className="space-y-2">
                  <input
                    value={editRoutineNombre}
                    onChange={(event) => setEditRoutineNombre(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder="Nombre"
                  />
                  <input
                    value={editRoutineDescripcion}
                    onChange={(event) => setEditRoutineDescripcion(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder="Descripción"
                  />
                  <input
                    value={editRoutineDiasSemana}
                    onChange={(event) => setEditRoutineDiasSemana(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder="lunes,miercoles,viernes"
                  />
                  <input
                    type="color"
                    value={editRoutineColor}
                    onChange={(event) => setEditRoutineColor(event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void saveRoutineEdits()}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditRoutine}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{routine.descripcion || 'Sin descripción'}</p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{routine.diasSemana.join(' · ')}</p>
                </>
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoutineId(routine.id)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                >
                  Gestionar ejercicios
                </button>
                <button
                  type="button"
                  onClick={() => startEditRoutine(routine.id)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => void toggleRoutineStatus(routine.id, routine.activa)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                >
                  {routine.activa ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </article>
          </SwipeToDeleteItem>
        ))}
      </section>

      {selectedRoutineId && (
        <section className="space-y-4 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Constructor de rutina: {routines.find((routine) => routine.id === selectedRoutineId)?.nombre}
            </h2>
            <button
              type="button"
              onClick={() => setSelectedRoutineId('')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <button
              type="button"
              onClick={() => setIsExerciseSelectorOpen(true)}
              className="h-11 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium dark:border-slate-600 md:col-span-2"
            >
              + Añadir ejercicio
            </button>

            <input
              type="number"
              value={series}
              onChange={(event) => setSeries(Number(event.target.value) || 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
              placeholder="Series"
            />

            <input
              value={repeticiones}
              onChange={(event) => setRepeticiones(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
              placeholder="Reps"
            />

            <input
              type="number"
              value={descansoSegundos}
              onChange={(event) => setDescansoSegundos(Number(event.target.value) || 15)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
              placeholder="Descanso (s)"
            />
          </div>

          <ExerciseSelectorModal
            isOpen={isExerciseSelectorOpen}
            onClose={() => setIsExerciseSelectorOpen(false)}
            exercises={exercises.map((item) => ({
              id: item.id,
              nombre: item.nombre,
              grupoMuscularPrimario: item.grupoMuscularPrimario,
              equipoNecesario: item.equipoNecesario,
              imagenUrl: item.imagenUrl,
              exerciseDbId: item.exerciseDbId,
              exerciseDbName: item.exerciseDbName,
              exerciseDbAliases: item.exerciseDbAliases,
            }))}
            selectedIds={selectedRoutineExercises.map((item) => item.ejercicioId)}
            onConfirm={(exerciseIds) => {
              void addExercisesToRoutine(exerciseIds)
            }}
          />

          {selectedRoutineExercises.length > 0 ? (
            <SortableExerciseList
              items={selectedRoutineExercises}
              editingRoutineExerciseId={editingRoutineExerciseId}
              editSeries={editSeries}
              editRepeticiones={editRepeticiones}
              editDescansoSegundos={editDescansoSegundos}
              onEditSeriesChange={setEditSeries}
              onEditRepeticionesChange={setEditRepeticiones}
              onEditDescansoChange={setEditDescansoSegundos}
              onStartEdit={startEditRoutineExercise}
              onSaveEdit={() => {
                void saveRoutineExerciseEdits()
              }}
              onCancelEdit={() => setEditingRoutineExerciseId('')}
              onMove={(routineExerciseId, direction) => {
                void moveRoutineExercise(routineExerciseId, direction)
              }}
              onRemove={(routineExerciseId) => {
                void removeRoutineExercise(routineExerciseId)
              }}
              onReorder={(sourceId, targetId) => {
                void reorderRoutineExercises(sourceId, targetId)
              }}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:text-slate-300">
              Esta rutina todavía no tiene ejercicios asignados.
            </div>
          )}
        </section>
      )}
    </div>
  )
}