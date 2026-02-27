import { zodResolver } from '@hookform/resolvers/zod'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
  getExerciseDbAliasesForName,
  getExerciseDbQueryCandidates,
  getPreferredExerciseDbName,
} from '../constants/exerciseDbAliases'
import { exerciseRepository } from '../repositories/exerciseRepository'
import type { DifficultyLevel } from '../types/models'

const customExerciseSchema = z.object({
  nombre: z.string().min(2).max(120),
  grupoMuscularPrimario: z.string().min(2).max(60),
  equipoNecesario: z.string().min(2).max(60),
  nivelDificultad: z.enum(['basico', 'intermedio', 'avanzado']),
  instrucciones: z.string().min(5).max(500),
})

type CustomExerciseForm = z.infer<typeof customExerciseSchema>

const ALL_FILTER = '__all__'

function normalizeToken(value: string): string {
  return value.trim().toLowerCase()
}

export function CatalogoPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState(ALL_FILTER)
  const [equipmentFilter, setEquipmentFilter] = useState(ALL_FILTER)
  const [difficultyFilter, setDifficultyFilter] = useState(ALL_FILTER)
  const [editingExerciseId, setEditingExerciseId] = useState('')
  const [editNombre, setEditNombre] = useState('')
  const [editGrupoMuscular, setEditGrupoMuscular] = useState('')
  const [editEquipo, setEditEquipo] = useState('')
  const [editNivel, setEditNivel] = useState<'basico' | 'intermedio' | 'avanzado'>('basico')
  const [editInstrucciones, setEditInstrucciones] = useState('')

  const exercises = useLiveQuery(() => exerciseRepository.listExercises(), []) ?? []

  const filteredExercises = useMemo(() => {
    const normalizedSearch = normalizeToken(search)

    return exercises.filter((exercise) => {
      const matchesSearch = normalizeToken(exercise.nombre).includes(normalizedSearch)
      const matchesMuscle =
        muscleFilter === ALL_FILTER || normalizeToken(exercise.grupoMuscularPrimario) === normalizeToken(muscleFilter)
      const matchesEquipment =
        equipmentFilter === ALL_FILTER || normalizeToken(exercise.equipoNecesario) === normalizeToken(equipmentFilter)
      const matchesDifficulty =
        difficultyFilter === ALL_FILTER || normalizeToken(exercise.nivelDificultad) === normalizeToken(difficultyFilter)
      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty
    })
  }, [difficultyFilter, equipmentFilter, exercises, muscleFilter, search])

  const muscles = useMemo(() => {
    const values = Array.from(
      new Set(
        exercises
          .map((exercise) => exercise.grupoMuscularPrimario.trim())
          .filter(Boolean),
      ),
    )
    return [ALL_FILTER, ...values]
  }, [exercises])

  const equipmentOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        exercises
          .map((exercise) => exercise.equipoNecesario.trim())
          .filter(Boolean),
      ),
    )
    return [ALL_FILTER, ...values]
  }, [exercises])

  const form = useForm<CustomExerciseForm>({
    resolver: zodResolver(customExerciseSchema),
    defaultValues: {
      nivelDificultad: 'basico',
    },
  })

  const onCreateCustom = form.handleSubmit(async (values) => {
    const now = new Date().toISOString()
    const preferredDbName =
      getPreferredExerciseDbName(values.nombre) ?? getExerciseDbQueryCandidates(values.nombre)[0]
    const aliases = getExerciseDbAliasesForName(values.nombre)

    await exerciseRepository.createExercise({
      id: crypto.randomUUID(),
      nombre: values.nombre,
      descripcion: 'Ejercicio personalizado',
      grupoMuscularPrimario: values.grupoMuscularPrimario,
      gruposMuscularesSecundarios: [],
      nivelDificultad: values.nivelDificultad as DifficultyLevel,
      equipoNecesario: values.equipoNecesario,
      exerciseDbName: preferredDbName,
      exerciseDbAliases: aliases.length > 0 ? aliases : undefined,
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

    const nextNombre = editNombre.trim() || 'Ejercicio'
    const nextGrupo = editGrupoMuscular.trim() || 'General'
    const nextEquipo = editEquipo.trim() || 'Ninguno'
    const preferredDbName =
      getPreferredExerciseDbName(nextNombre) ?? getExerciseDbQueryCandidates(nextNombre)[0]
    const aliases = getExerciseDbAliasesForName(nextNombre)

    await exerciseRepository.updateExercise(editingExerciseId, {
      nombre: nextNombre,
      grupoMuscularPrimario: nextGrupo,
      equipoNecesario: nextEquipo,
      exerciseDbId: undefined,
      exerciseDbName: preferredDbName,
      exerciseDbAliases: aliases.length > 0 ? aliases : undefined,
      nivelDificultad: editNivel,
      instrucciones: editInstrucciones.trim() || 'Sin instrucciones',
      updatedAt: new Date().toISOString(),
    })

    setEditingExerciseId('')
  }

  return (
    <div className="space-y-6">
      <header className="mobile-sticky-header sticky top-0 z-10 bg-white/80 pb-3 pt-4 backdrop-blur-md dark:bg-slate-900/80">
        <h1 className="text-2xl font-bold">{t('catalog.title')}</h1>
      </header>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark md:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('catalog.searchPlaceholder')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
        />
        <select
          value={muscleFilter}
          onChange={(event) => setMuscleFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
        >
          {muscles.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle === ALL_FILTER ? t('catalog.all') : muscle}
            </option>
          ))}
        </select>
        <select
          value={equipmentFilter}
          onChange={(event) => setEquipmentFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
        >
          {equipmentOptions.map((equipment) => (
            <option key={equipment} value={equipment}>
              {equipment === ALL_FILTER ? t('catalog.all') : equipment}
            </option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
        >
          <option value={ALL_FILTER}>{t('catalog.allLevels')}</option>
          <option value="basico">{t('catalog.levelBasic')}</option>
          <option value="intermedio">{t('catalog.levelIntermediate')}</option>
          <option value="avanzado">{t('catalog.levelAdvanced')}</option>
        </select>
        <p className="self-center text-sm text-slate-500 dark:text-slate-300">{t('catalog.results', { count: filteredExercises.length })}</p>
      </div>

      <div>
        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <article
              key={exercise.id}
              className="mb-3 cursor-pointer rounded-xl bg-white p-4 shadow transition hover:shadow-md dark:bg-gym-cardDark"
              onClick={() => {
                if (editingExerciseId !== exercise.id) {
                  navigate(`/catalogo/${exercise.id}`)
                }
              }}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{exercise.nombre}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{t('catalog.target')}: {exercise.grupoMuscularPrimario}</p>
                  <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    ⓘ {t('catalog.tapForInfo')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {exercise.esPersonalizado && editingExerciseId !== exercise.id && (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          startEditExercise(exercise.id)
                        }}
                        className="rounded-md border border-slate-300 px-3 py-2 text-xs"
                      >
                        {t('catalog.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          void deleteCustomExercise(exercise.id)
                        }}
                        className="rounded-md border border-slate-300 px-3 py-2 text-xs text-red-600"
                      >
                        {t('catalog.delete')}
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder={t('catalog.namePlaceholder')}
                  />
                  <input
                    value={editGrupoMuscular}
                    onChange={(event) => setEditGrupoMuscular(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder={t('catalog.musclePlaceholder')}
                  />
                  <input
                    value={editEquipo}
                    onChange={(event) => setEditEquipo(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder={t('catalog.equipmentPlaceholder')}
                  />
                  <select
                    value={editNivel}
                    onChange={(event) => setEditNivel(event.target.value as 'basico' | 'intermedio' | 'avanzado')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                  >
                    <option value="basico">{t('catalog.levelBasic')}</option>
                    <option value="intermedio">{t('catalog.levelIntermediate')}</option>
                    <option value="avanzado">{t('catalog.levelAdvanced')}</option>
                  </select>
                  <textarea
                    value={editInstrucciones}
                    onChange={(event) => setEditInstrucciones(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
                    placeholder={t('catalog.instructionsPlaceholder')}
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        void saveExerciseEdits()
                      }}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                    >
                      {t('catalog.save')}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        cancelEditExercise()
                      }}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                    >
                      {t('catalog.cancel')}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('catalog.createCustomTitle')}</h2>
        <form onSubmit={onCreateCustom} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            {...form.register('nombre')}
            placeholder={t('catalog.namePlaceholder')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <input
            {...form.register('grupoMuscularPrimario')}
            placeholder={t('catalog.musclePlaceholder')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <input
            {...form.register('equipoNecesario')}
            placeholder={t('catalog.equipmentPlaceholder')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          />
          <select
            {...form.register('nivelDificultad')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:text-sm"
          >
            <option value="basico">{t('catalog.levelBasic')}</option>
            <option value="intermedio">{t('catalog.levelIntermediate')}</option>
            <option value="avanzado">{t('catalog.levelAdvanced')}</option>
          </select>
          <textarea
            {...form.register('instrucciones')}
            placeholder={t('catalog.instructionsPlaceholder')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 md:col-span-2 md:text-sm"
          />
          <button type="submit" className="rounded-lg bg-gym-primary px-4 py-3 text-sm font-semibold text-white md:col-span-2">
            {t('catalog.saveExercise')}
          </button>
        </form>
      </section>
    </div>
  )
}