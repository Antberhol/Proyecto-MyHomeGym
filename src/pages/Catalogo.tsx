import { zodResolver } from '@hookform/resolvers/zod'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Virtuoso } from 'react-virtuoso'
import { z } from 'zod'
import { ExerciseCard } from '../components/exercises/ExerciseCard'
import { exerciseRepository } from '../repositories/exerciseRepository'
import type { DifficultyLevel } from '../types/models'
import { getExerciseIllustrationUrl } from '../utils/exerciseIllustration'

const customExerciseSchema = z.object({
  nombre: z.string().min(2).max(120),
  grupoMuscularPrimario: z.string().min(2).max(60),
  equipoNecesario: z.string().min(2).max(60),
  nivelDificultad: z.enum(['basico', 'intermedio', 'avanzado']),
  instrucciones: z.string().min(5).max(500),
})

type CustomExerciseForm = z.infer<typeof customExerciseSchema>

export function CatalogoPage() {
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('todos')
  const [equipmentFilter, setEquipmentFilter] = useState('todos')
  const [difficultyFilter, setDifficultyFilter] = useState('todos')
  const [editingExerciseId, setEditingExerciseId] = useState('')
  const [editNombre, setEditNombre] = useState('')
  const [editGrupoMuscular, setEditGrupoMuscular] = useState('')
  const [editEquipo, setEditEquipo] = useState('')
  const [editNivel, setEditNivel] = useState<'basico' | 'intermedio' | 'avanzado'>('basico')
  const [editInstrucciones, setEditInstrucciones] = useState('')

  const exercises = useLiveQuery(() => exerciseRepository.listExercises(), []) ?? []

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.nombre.toLowerCase().includes(search.toLowerCase())
      const matchesMuscle = muscleFilter === 'todos' || exercise.grupoMuscularPrimario === muscleFilter
      const matchesEquipment = equipmentFilter === 'todos' || exercise.equipoNecesario === equipmentFilter
      const matchesDifficulty = difficultyFilter === 'todos' || exercise.nivelDificultad === difficultyFilter
      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty
    })
  }, [difficultyFilter, equipmentFilter, exercises, muscleFilter, search])

  const muscles = useMemo(() => {
    return ['todos', ...new Set(exercises.map((exercise) => exercise.grupoMuscularPrimario))]
  }, [exercises])

  const equipmentOptions = useMemo(() => {
    return ['todos', ...new Set(exercises.map((exercise) => exercise.equipoNecesario))]
  }, [exercises])

  const form = useForm<CustomExerciseForm>({
    resolver: zodResolver(customExerciseSchema),
    defaultValues: {
      nivelDificultad: 'basico',
    },
  })

  const onCreateCustom = form.handleSubmit(async (values) => {
    const now = new Date().toISOString()
    await exerciseRepository.createExercise({
      id: crypto.randomUUID(),
      nombre: values.nombre,
      descripcion: 'Ejercicio personalizado',
      grupoMuscularPrimario: values.grupoMuscularPrimario,
      gruposMuscularesSecundarios: [],
      nivelDificultad: values.nivelDificultad as DifficultyLevel,
      equipoNecesario: values.equipoNecesario,
      imagenUrl: getExerciseIllustrationUrl({
        nombre: values.nombre,
        grupoMuscularPrimario: values.grupoMuscularPrimario,
        equipoNecesario: values.equipoNecesario,
      }),
      instrucciones: values.instrucciones,
      esPersonalizado: true,
      createdAt: now,
      updatedAt: now,
    })

    form.reset({ nivelDificultad: 'basico' })
  })

  const deleteCustomExercise = async (exerciseId: string) => {
    await exerciseRepository.deleteExercise(exerciseId)
  }

  const startEditExercise = (exerciseId: string) => {
    const exercise = exercises.find((item) => item.id === exerciseId)
    if (!exercise || !exercise.esPersonalizado) return

    setEditingExerciseId(exerciseId)
    setEditNombre(exercise.nombre)
    setEditGrupoMuscular(exercise.grupoMuscularPrimario)
    setEditEquipo(exercise.equipoNecesario)
    setEditNivel(exercise.nivelDificultad)
    setEditInstrucciones(exercise.instrucciones)
  }

  const cancelEditExercise = () => {
    setEditingExerciseId('')
  }

  const saveExerciseEdits = async () => {
    if (!editingExerciseId) return

    await exerciseRepository.updateExercise(editingExerciseId, {
      nombre: editNombre.trim() || 'Ejercicio',
      grupoMuscularPrimario: editGrupoMuscular.trim() || 'General',
      equipoNecesario: editEquipo.trim() || 'Ninguno',
      imagenUrl: getExerciseIllustrationUrl({
        nombre: editNombre.trim() || 'Ejercicio',
        grupoMuscularPrimario: editGrupoMuscular.trim() || 'General',
        equipoNecesario: editEquipo.trim() || 'Ninguno',
      }),
      nivelDificultad: editNivel,
      instrucciones: editInstrucciones.trim() || 'Sin instrucciones',
      updatedAt: new Date().toISOString(),
    })

    setEditingExerciseId('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Catálogo de ejercicios</h1>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark md:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar ejercicio..."
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <select
          value={muscleFilter}
          onChange={(event) => setMuscleFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          {muscles.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle}
            </option>
          ))}
        </select>
        <select
          value={equipmentFilter}
          onChange={(event) => setEquipmentFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          {equipmentOptions.map((equipment) => (
            <option key={equipment} value={equipment}>
              {equipment}
            </option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          <option value="todos">todos los niveles</option>
          <option value="basico">básico</option>
          <option value="intermedio">intermedio</option>
          <option value="avanzado">avanzado</option>
        </select>
        <p className="self-center text-sm text-slate-500 dark:text-slate-300">Resultados: {filteredExercises.length}</p>
      </div>

      <div>
        <Virtuoso
          data={filteredExercises}
          useWindowScroll
          itemContent={(_, exercise) => (
            <article key={exercise.id} className="mb-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
              <div className="mb-2 flex items-start justify-between gap-3">
                <ExerciseCard exercise={exercise} />
                <div className="flex items-center gap-2">
                  {exercise.esPersonalizado && (
                    <span className="rounded-full bg-gym-secondary px-2 py-1 text-xs text-white">Personalizado</span>
                  )}
                  {exercise.esPersonalizado && editingExerciseId !== exercise.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditExercise(exercise.id)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteCustomExercise(exercise.id)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-red-600"
                      >
                        Borrar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingExerciseId === exercise.id ? (
                <div className="space-y-2">
                  <input
                    value={editNombre}
                    onChange={(event) => setEditNombre(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900"
                    placeholder="Nombre"
                  />
                  <input
                    value={editGrupoMuscular}
                    onChange={(event) => setEditGrupoMuscular(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900"
                    placeholder="Grupo muscular"
                  />
                  <input
                    value={editEquipo}
                    onChange={(event) => setEditEquipo(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900"
                    placeholder="Equipo"
                  />
                  <select
                    value={editNivel}
                    onChange={(event) => setEditNivel(event.target.value as 'basico' | 'intermedio' | 'avanzado')}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900"
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                  <textarea
                    value={editInstrucciones}
                    onChange={(event) => setEditInstrucciones(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900"
                    placeholder="Instrucciones"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void saveExerciseEdits()}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditExercise}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{exercise.descripcion}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{exercise.grupoMuscularPrimario}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{exercise.equipoNecesario}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{exercise.nivelDificultad}</span>
                  </div>
                </>
              )}
            </article>
          )}
        />
      </div>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Crear ejercicio personalizado</h2>
        <form onSubmit={onCreateCustom} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            {...form.register('nombre')}
            placeholder="Nombre"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <input
            {...form.register('grupoMuscularPrimario')}
            placeholder="Grupo muscular"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <input
            {...form.register('equipoNecesario')}
            placeholder="Equipo"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <select
            {...form.register('nivelDificultad')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="basico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <textarea
            {...form.register('instrucciones')}
            placeholder="Instrucciones"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 md:col-span-2"
          />
          <button type="submit" className="rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            Guardar ejercicio
          </button>
        </form>
      </section>
    </div>
  )
}