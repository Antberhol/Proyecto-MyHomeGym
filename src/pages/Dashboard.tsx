import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StreakBadge } from '../components/StreakBadge'
import { MuscleHeatmap } from '../components/body/MuscleHeatmap'
import { MuscleDistributionChart } from '../components/MuscleDistributionChart'
import { WorkoutFeedItem } from '../components/stats/WorkoutFeedItem'
import { useStreaks } from '../hooks/useStreaks'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { db } from '../lib/db'
import { useWeeklyMuscleAnalytics } from '../hooks/useWeeklyMuscleAnalytics'
import { progressRepository } from '../repositories/progressRepository'
import { formatWorkoutToCSV, formatWorkoutToText, type TrainingData } from '../utils/clipboard'

const WEEKDAY_CODES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [setDraftById, setSetDraftById] = useState<Record<string, { reps: string; weight: string }>>({})
  const streaks = useStreaks()
  const workoutStats = useWorkoutStats()
  const weeklyMuscleAnalytics = useWeeklyMuscleAnalytics()
  const recentTrainings = useLiveQuery(() => progressRepository.listTrainingsRecent(90), []) ?? []
  const recentWorkoutBundles = useLiveQuery(() => progressRepository.listRecentWorkouts(5), []) ?? []
  const totalTrainings = useLiveQuery(() => progressRepository.countTrainings(), []) ?? 0
  const totalVolumeAllTime = useLiveQuery(() => progressRepository.sumTrainingVolumeAllTime(), []) ?? 0
  const routines = useLiveQuery(() => progressRepository.listRoutines(), []) ?? []
  const prs = useLiveQuery(() => progressRepository.listPersonalRecords(), []) ?? []
  const exercises = useLiveQuery(() => progressRepository.listExercises(), []) ?? []
  const routineExercises = useLiveQuery(() => progressRepository.listRoutineExercises(), []) ?? []
  const performedExercises = useLiveQuery(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 90)
    return progressRepository.listPerformedExercisesSince(cutoff.toISOString())
  }, []) ?? []

  const weekTrainings = recentTrainings.filter((training) => {
    const trainingDate = new Date(training.fecha)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return trainingDate >= weekAgo
  })

  const totalVolume = weekTrainings.reduce((acc, item) => acc + item.volumenTotal, 0)
  const totalMinutes = weekTrainings.reduce((acc, item) => acc + item.duracionMinutos, 0)


  const achievements = [
    { id: 'first', label: t('dashboard.achievements.firstSession'), unlocked: totalTrainings >= 1 },
    { id: 'streak5', label: t('dashboard.achievements.totalTrainings5'), unlocked: totalTrainings >= 5 },
    { id: 'streak20', label: t('dashboard.achievements.totalTrainings20'), unlocked: totalTrainings >= 20 },
    { id: 'vol10k', label: t('dashboard.achievements.totalVolume10k'), unlocked: totalVolumeAllTime >= 10_000 },
    { id: 'vol50k', label: t('dashboard.achievements.totalVolume50k'), unlocked: totalVolumeAllTime >= 50_000 },
  ]
  const recentPrs = prs
    .slice()
    .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
    .slice(0, 5)

  const prsCountByDate = useMemo(() => {
    const grouped = new Map<string, number>()
    for (const pr of prs) {
      grouped.set(pr.fecha, (grouped.get(pr.fecha) ?? 0) + 1)
    }
    return grouped
  }, [prs])

  const exerciseNameById = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise.nombre])),
    [exercises],
  )

  const buildTrainingData = (trainingId: string): TrainingData | null => {
    const training = recentTrainings.find((item) => item.id === trainingId)
    if (!training) return null

    const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise.nombre]))
    const sets = performedExercises
      .filter((entry) => entry.entrenamientoId === trainingId)
      .sort((a, b) => a.serieNumero - b.serieNumero)

    const grouped = new Map<string, { name: string; sets: Array<{ reps: number; weight: number }> }>()

    for (const entry of sets) {
      const name = exerciseById.get(entry.ejercicioId) ?? t('dashboard.common.exercise')
      const current = grouped.get(entry.ejercicioId)
      const setData = { reps: entry.repeticionesRealizadas, weight: entry.pesoUtilizado }

      if (current) {
        current.sets.push(setData)
      } else {
        grouped.set(entry.ejercicioId, { name, sets: [setData] })
      }
    }

    return {
      id: training.id,
      date: training.fecha,
      routineName: routines.find((routine) => routine.id === training.rutinaId)?.nombre,
      durationMinutes: training.duracionMinutos,
      totalVolumeKg: training.volumenTotal,
      exercises: Array.from(grouped.values()),
    }
  }

  const copyWorkout = async (trainingId: string, format: 'text' | 'csv') => {
    const training = buildTrainingData(trainingId)
    if (!training || !navigator.clipboard) return

    const payload = format === 'text' ? formatWorkoutToText(training) : formatWorkoutToCSV(training)
    await navigator.clipboard.writeText(payload)
  }

  const resolvePrExerciseName = (exerciseId: string) => {
    if (exerciseId === 'GLOBAL') return t('dashboard.prs.globalSession')
    return exercises.find((item) => item.id === exerciseId)?.nombre || t('dashboard.common.exercise')
  }

  const getSetDraft = (setId: string, reps: number, weight: number) => {
    return setDraftById[setId] ?? { reps: String(reps), weight: String(weight) }
  }

  const updateSetDraftField = (setId: string, field: 'reps' | 'weight', value: string) => {
    setSetDraftById((current) => {
      const currentDraft = current[setId] ?? { reps: '', weight: '' }
      return {
        ...current,
        [setId]: {
          ...currentDraft,
          [field]: value,
        },
      }
    })
  }

  const persistPerformedExercise = async (params: {
    setId: string
    currentReps: number
    currentWeight: number
  }) => {
    const draft = setDraftById[params.setId]
    if (!draft) return

    const parsedReps = Number(draft.reps)
    const parsedWeight = Number(draft.weight)

    const nextReps = Number.isFinite(parsedReps) ? Math.max(0, parsedReps) : params.currentReps
    const nextWeight = Number.isFinite(parsedWeight) ? Math.max(0, parsedWeight) : params.currentWeight

    await db.updatePerformedExercise(params.setId, {
      repeticionesRealizadas: nextReps,
      pesoUtilizado: nextWeight,
      updatedAt: new Date().toISOString(),
    })
  }

  const recalculateTrainingVolume = async (trainingId: string) => {
    const sessionSets = performedExercises.filter((item) => item.entrenamientoId === trainingId)
    const newVolume = sessionSets.reduce((acc, item) => {
      const draft = setDraftById[item.id]
      const draftReps = Number(draft?.reps)
      const draftWeight = Number(draft?.weight)

      const reps = Number.isFinite(draftReps) ? Math.max(0, draftReps) : item.repeticionesRealizadas
      const weight = Number.isFinite(draftWeight) ? Math.max(0, draftWeight) : item.pesoUtilizado

      return acc + reps * weight
    }, 0)

    await db.updateTraining(trainingId, {
      volumenTotal: newVolume,
      updatedAt: new Date().toISOString(),
    })
  }

  const today = new Date()
  const todayName = t(`dashboard.weekdayLookup.${WEEKDAY_CODES[today.getDay()]}`)
  const todayLabel = t(`dashboard.weekdays.${todayName}`)

  const weakMuscles = (() => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    const exerciseToMuscle = new Map(exercises.map((exercise) => [exercise.id, exercise.grupoMuscularPrimario]))
    const volumeByMuscle = performedExercises.reduce<Record<string, number>>((acc, entry) => {
      if (new Date(entry.fecha) < monthAgo) return acc

      const muscle = exerciseToMuscle.get(entry.ejercicioId)
      if (!muscle) return acc

      acc[muscle] = (acc[muscle] ?? 0) + entry.repeticionesRealizadas * entry.pesoUtilizado
      return acc
    }, {})

    const groups = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core']
    return groups
      .map((muscle) => ({ muscle, volume: volumeByMuscle[muscle] ?? 0 }))
      .sort((a, b) => a.volume - b.volume)
      .slice(0, 2)
      .map((item) => item.muscle)
  })()

  const todayActiveRoutines = routines.filter(
    (routine) => routine.activa && routine.diasSemana.map((day) => day.toLowerCase()).includes(todayName),
  )

  const weakMusclesLabel =
    weakMuscles.length > 0
      ? weakMuscles.map((muscle) => t(`muscleGroups.${muscle}`, { defaultValue: muscle })).join(` ${t('dashboard.common.and')} `)
      : t('dashboard.smartPlan.insufficientData')

  const recommendedRoutine = (() => {
    if (todayActiveRoutines.length === 0) return null

    const weakSet = new Set(weakMuscles)
    const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]))

    const scored = todayActiveRoutines.map((routine) => {
      const linked = routineExercises.filter((item) => item.rutinaId === routine.id)
      const coverage = linked.reduce((score, item) => {
        const exercise = exerciseMap.get(item.ejercicioId)
        if (!exercise) return score
        return weakSet.has(exercise.grupoMuscularPrimario) ? score + 1 : score
      }, 0)

      return {
        routine,
        coverage,
        exerciseCount: linked.length,
      }
    })

    scored.sort((a, b) => b.coverage - a.coverage || b.exerciseCount - a.exerciseCount)
    return scored[0]
  })()

  const statsCards = [
    {
      id: 'trainings',
      label: t('dashboard.stats.trainings7d'),
      value: weekTrainings.length,
      context: t('dashboard.stats.context.thisWeek'),
      accentClass: 'border-l-sky-500',
      iconWrapClass: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
      icon: '🏋️',
    },
    {
      id: 'minutes',
      label: t('dashboard.stats.trainedMinutes'),
      value: totalMinutes,
      context: t('dashboard.stats.context.thisWeek'),
      accentClass: 'border-l-violet-500',
      iconWrapClass: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
      icon: '⏱️',
    },
    {
      id: 'volume',
      label: t('dashboard.stats.totalVolume7d'),
      value: `${totalVolume.toFixed(0)} kg`,
      context: t('dashboard.stats.context.thisWeek'),
      accentClass: 'border-l-emerald-500',
      iconWrapClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
      icon: '📈',
    },
    {
      id: 'routines',
      label: t('dashboard.stats.routines'),
      value: routines.length,
      context: t('dashboard.stats.context.totalAvailable'),
      accentClass: 'border-l-orange-500',
      iconWrapClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
      icon: '🗂️',
    },
  ]

  const feedVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <header className="mobile-sticky-header sticky top-0 z-10 bg-gym-bg-dark border-b border-gym-border pb-3 pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl text-gym-text-bright tracking-wider">{t('dashboard.greeting', { day: todayLabel })}</h1>
              <p className="text-gym-text-dim text-sm">{t('dashboard.subtitle')}</p>
            </div>

            <div className="hidden sm:block">
              <StreakBadge
                dayStreak={streaks.currentDayStreak}
                weekStreak={streaks.currentWeekStreak}
                totalTrainings={streaks.totalTrainings}
              />
            </div>
          </div>

          <div className="bg-gym-card border border-gym-yellow rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="text-gym-text-muted text-xs uppercase tracking-wider">{t('dashboard.streak.title')}</div>
                <div className="text-gym-yellow font-display text-3xl tracking-wide">{streaks.currentDayStreak} {t('dashboard.streak.days')}</div>
                <div className="text-gym-text-dim text-xs">{t('dashboard.streak.week', { count: streaks.currentWeekStreak })}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gym-text-muted text-xs uppercase tracking-wider">{t('dashboard.streak.total')}</div>
              <div className="text-gym-yellow font-display text-2xl tracking-wide">{streaks.totalTrainings.toLocaleString()}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/entrenar')}
            className="w-full bg-gym-yellow text-black font-display text-xl tracking-widest uppercase rounded-xl py-3 hover:bg-gym-yellow-light active:scale-[0.99] transition-all"
          >
            {t('dashboard.startWorkout')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <article
            key={card.id}
            className="rounded-2xl border border-gym-border bg-gym-card p-4 transition hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/30">
                <span aria-hidden>{card.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gym-text-muted">{card.label}</p>
                <p className="mt-0.5 text-2xl font-bold leading-tight text-gym-yellow">{card.value}</p>
                <p className="mt-1 text-xs text-gym-text-dim">{card.context}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-gym-border bg-gym-card p-4">
          <div className="text-xs uppercase tracking-wider text-gym-text-muted">{t('dashboard.stats.totalSessions')}</div>
          <div className="mt-1 font-display text-3xl tracking-wide text-gym-yellow">{workoutStats.totalWorkouts.toLocaleString()}</div>
        </article>
        <article className="rounded-xl border border-gym-border bg-gym-card p-4">
          <div className="text-xs uppercase tracking-wider text-gym-text-muted">{t('dashboard.stats.totalSetsWeek')}</div>
          <div className="mt-1 font-display text-3xl tracking-wide text-gym-yellow">{workoutStats.totalSetsThisWeek.toLocaleString()}</div>
        </article>
        <article className="rounded-xl border border-gym-border bg-gym-card p-4">
          <div className="text-xs uppercase tracking-wider text-gym-text-muted">{t('dashboard.stats.avgDuration30d')}</div>
          <div className="mt-1 font-display text-3xl tracking-wide text-gym-yellow">{workoutStats.avgDurationMinutes.toLocaleString()} {t('dashboard.common.minAbbrev')}</div>
        </article>
      </div>

      <section className="rounded-xl bg-gym-card border border-gym-border p-4">
        <h2 className="mb-3 font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('dashboard.activityFeed.title')}</h2>
        {recentWorkoutBundles.length === 0 ? (
          <p className="text-sm text-gym-text-dim">{t('dashboard.activityFeed.empty')}</p>
        ) : (
          <motion.div variants={feedVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-3">
            {recentWorkoutBundles.map((bundle) => (
              <motion.div key={bundle.training.id} variants={itemVariants}>
                <WorkoutFeedItem
                  training={bundle.training}
                  exercises={bundle.exercises}
                  exerciseCatalog={exercises}
                  prsCount={prsCountByDate.get(bundle.training.fecha) ?? 0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="rounded-xl bg-gym-card border border-gym-border p-4">
        <h2 className="mb-3 font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('dashboard.recentSessions.title')}</h2>
        {recentTrainings.length === 0 ? (
          <p className="text-sm text-gym-text-dim">{t('dashboard.recentSessions.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {recentTrainings
              .slice()
              .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
              .slice(0, 5)
              .map((training) => (
                <li key={training.id} className="rounded-xl border border-gym-border bg-gym-card-2 p-3">
                  <div className="flex items-center justify-between text-sm text-gym-text-base">
                    <span className="text-gym-text-dim">{new Date(training.fecha).toLocaleString()}</span>
                    <span className="text-gym-yellow font-semibold">{training.duracionMinutos} {t('dashboard.common.minAbbrev')}</span>
                  </div>
                  <p className="text-xs text-gym-text-dim">{t('dashboard.recentSessions.volumeLabel', { volume: training.volumenTotal })}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-gym-yellow text-gym-yellow px-2.5 py-1.5 text-xs font-medium hover:bg-gym-yellow/10"
                      onClick={() => void copyWorkout(training.id, 'text')}
                    >
                      {t('dashboard.recentSessions.copyWhatsapp')}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-gym-yellow text-gym-yellow px-2.5 py-1.5 text-xs font-medium hover:bg-gym-yellow/10"
                      onClick={() => void copyWorkout(training.id, 'csv')}
                    >
                      {t('dashboard.recentSessions.copyExcel')}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-gym-border text-gym-text-base px-2.5 py-1.5 text-xs font-medium hover:bg-gym-card"
                      onClick={() => {
                        setExpandedSessionId((current) => (current === training.id ? null : training.id))
                      }}
                    >
                      {t('dashboard.recentSessions.editSets')}
                    </button>
                  </div>

                  {expandedSessionId === training.id ? (
                    <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                          {t('dashboard.recentSessions.editorTitle')}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            void recalculateTrainingVolume(training.id)
                          }}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
                        >
                          {t('dashboard.recentSessions.recalculateVolume')}
                        </button>
                      </div>

                      {performedExercises.filter((item) => item.entrenamientoId === training.id).length === 0 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-300">
                          {t('dashboard.recentSessions.editorEmpty')}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {performedExercises
                            .filter((item) => item.entrenamientoId === training.id)
                            .sort((a, b) => {
                              if (a.ejercicioId === b.ejercicioId) {
                                return a.serieNumero - b.serieNumero
                              }
                              return a.ejercicioId.localeCompare(b.ejercicioId)
                            })
                            .map((set) => {
                              const draft = getSetDraft(set.id, set.repeticionesRealizadas, set.pesoUtilizado)
                              return (
                                <div key={set.id} className="grid grid-cols-1 gap-2 rounded-md border border-slate-200 p-2 dark:border-slate-700 md:grid-cols-4">
                                  <p className="text-xs font-medium">
                                    {(exerciseNameById.get(set.ejercicioId) ?? t('dashboard.common.exercise'))}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-300">
                                    {t('dashboard.recentSessions.seriesNumber', { number: set.serieNumero })}
                                  </p>
                                  <input
                                    type="number"
                                    min={0}
                                    value={draft.reps}
                                    onChange={(event) => updateSetDraftField(set.id, 'reps', event.target.value)}
                                    onBlur={() => {
                                      void persistPerformedExercise({
                                        setId: set.id,
                                        currentReps: set.repeticionesRealizadas,
                                        currentWeight: set.pesoUtilizado,
                                      })
                                    }}
                                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                                    placeholder={t('training.repsPlaceholder')}
                                  />
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={draft.weight}
                                    onChange={(event) => updateSetDraftField(set.id, 'weight', event.target.value)}
                                    onBlur={() => {
                                      void persistPerformedExercise({
                                        setId: set.id,
                                        currentReps: set.repeticionesRealizadas,
                                        currentWeight: set.pesoUtilizado,
                                      })
                                    }}
                                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                                    placeholder={t('training.weightPlaceholder')}
                                  />
                                </div>
                              )
                            })}
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('dashboard.smartPlan.title')}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {t('dashboard.smartPlan.currentDay')}: <span className="font-medium capitalize">{todayLabel}</span>
        </p>
        {recommendedRoutine ? (
          <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="font-semibold">{t('dashboard.smartPlan.recommendedRoutine', { name: recommendedRoutine.routine.nombre })}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('dashboard.smartPlan.priorityCoverage', { coverage: recommendedRoutine.coverage })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {t('dashboard.smartPlan.priorityGroups', { groups: weakMusclesLabel })}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            {t('dashboard.smartPlan.noRoutineForToday')}
          </p>
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('dashboard.prs.title')}</h2>
        {recentPrs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">{t('dashboard.prs.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {recentPrs.map((pr) => (
              <li key={pr.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{resolvePrExerciseName(pr.ejercicioId)}</span>
                  <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {t(`progress.pr.type.${pr.tipo}`, { defaultValue: pr.tipo })}: {pr.valor.toFixed(1)} {pr.detalle ? `· ${pr.detalle}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <MuscleDistributionChart />

      <MuscleHeatmap muscleAnalytics={weeklyMuscleAnalytics} />

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('dashboard.achievements.title')}</h2>
        <ul className="space-y-2">
          {achievements.map((achievement) => (
            <li key={achievement.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="text-sm">{achievement.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${achievement.unlocked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {achievement.unlocked ? t('dashboard.achievements.unlocked') : t('dashboard.achievements.pending')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}