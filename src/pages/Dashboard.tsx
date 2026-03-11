import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { StreakBadge } from '../components/StreakBadge'
import { MuscleHeatmap } from '../components/body/MuscleHeatmap'
import { MuscleDistributionChart } from '../components/MuscleDistributionChart'
import { useStreaks } from '../hooks/useStreaks'
import { useWeeklyMuscleAnalytics } from '../hooks/useWeeklyMuscleAnalytics'
import { progressRepository } from '../repositories/progressRepository'
import { formatWorkoutToCSV, formatWorkoutToText, type TrainingData } from '../utils/clipboard'

const WEEKDAY_CODES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export function DashboardPage() {
  const { t } = useTranslation()
  const streaks = useStreaks()
  const weeklyMuscleAnalytics = useWeeklyMuscleAnalytics()
  const trainings = useLiveQuery(() => progressRepository.listTrainings(), []) ?? []
  const routines = useLiveQuery(() => progressRepository.listRoutines(), []) ?? []
  const prs = useLiveQuery(() => progressRepository.listPersonalRecords(), []) ?? []
  const exercises = useLiveQuery(() => progressRepository.listExercises(), []) ?? []
  const routineExercises = useLiveQuery(() => progressRepository.listRoutineExercises(), []) ?? []
  const performedExercises = useLiveQuery(() => progressRepository.listPerformedExercises(), []) ?? []

  const weekTrainings = trainings.filter((training) => {
    const trainingDate = new Date(training.fecha)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return trainingDate >= weekAgo
  })

  const totalVolume = weekTrainings.reduce((acc, item) => acc + item.volumenTotal, 0)
  const totalMinutes = weekTrainings.reduce((acc, item) => acc + item.duracionMinutos, 0)
  const totalTrainings = trainings.length
  const totalVolumeAllTime = trainings.reduce((acc, item) => acc + item.volumenTotal, 0)

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

  const buildTrainingData = (trainingId: string): TrainingData | null => {
    const training = trainings.find((item) => item.id === trainingId)
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

  return (
    <div className="space-y-6">
      <header className="mobile-sticky-header sticky top-0 z-10 bg-white/80 pb-3 pt-4 backdrop-blur-md dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
          <StreakBadge
            dayStreak={streaks.currentDayStreak}
            weekStreak={streaks.currentWeekStreak}
            totalTrainings={streaks.totalTrainings}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <article
            key={card.id}
            className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-gym-cardDark ${card.accentClass}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${card.iconWrapClass}`}>
                <span aria-hidden>{card.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{card.label}</p>
                <p className="mt-0.5 text-2xl font-bold leading-tight">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{card.context}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('dashboard.recentSessions.title')}</h2>
        {trainings.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">{t('dashboard.recentSessions.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {trainings
              .slice()
              .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
              .slice(0, 5)
              .map((training) => (
                <li key={training.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span>{new Date(training.fecha).toLocaleString()}</span>
                    <span>{training.duracionMinutos} {t('dashboard.common.minAbbrev')}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{t('dashboard.recentSessions.volumeLabel', { volume: training.volumenTotal })}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
                      onClick={() => void copyWorkout(training.id, 'text')}
                    >
                      {t('dashboard.recentSessions.copyWhatsapp')}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
                      onClick={() => void copyWorkout(training.id, 'csv')}
                    >
                      {t('dashboard.recentSessions.copyExcel')}
                    </button>
                  </div>
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