import { useLiveQuery } from 'dexie-react-hooks'
import { StreakBadge } from '../components/StreakBadge'
import { MuscleHeatmap } from '../components/body/MuscleHeatmap'
import { MuscleDistributionChart } from '../components/MuscleDistributionChart'
import { useStreaks } from '../hooks/useStreaks'
import { useWeeklyMuscleAnalytics } from '../hooks/useWeeklyMuscleAnalytics'
import { progressRepository } from '../repositories/progressRepository'
import { formatWorkoutToCSV, formatWorkoutToText, type TrainingData } from '../utils/clipboard'

const weekDaysEs = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export function DashboardPage() {
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
    { id: 'first', label: 'Primera sesión completada', unlocked: totalTrainings >= 1 },
    { id: 'streak5', label: '5 entrenamientos totales', unlocked: totalTrainings >= 5 },
    { id: 'streak20', label: '20 entrenamientos totales', unlocked: totalTrainings >= 20 },
    { id: 'vol10k', label: '10.000 kg acumulados', unlocked: totalVolumeAllTime >= 10_000 },
    { id: 'vol50k', label: '50.000 kg acumulados', unlocked: totalVolumeAllTime >= 50_000 },
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
      const name = exerciseById.get(entry.ejercicioId) ?? 'Ejercicio'
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
    if (exerciseId === 'GLOBAL') return 'Sesión global'
    return exercises.find((item) => item.id === exerciseId)?.nombre || 'Ejercicio'
  }

  const today = new Date()
  const todayName = weekDaysEs[today.getDay()]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <StreakBadge
          dayStreak={streaks.currentDayStreak}
          weekStreak={streaks.currentWeekStreak}
          totalTrainings={streaks.totalTrainings}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <p className="text-sm text-slate-500 dark:text-slate-300">Entrenamientos (7d)</p>
          <p className="text-2xl font-bold">{weekTrainings.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <p className="text-sm text-slate-500 dark:text-slate-300">Minutos entrenados</p>
          <p className="text-2xl font-bold">{totalMinutes}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <p className="text-sm text-slate-500 dark:text-slate-300">Volumen total (7d)</p>
          <p className="text-2xl font-bold">{totalVolume.toFixed(0)} kg</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <p className="text-sm text-slate-500 dark:text-slate-300">Rutinas</p>
          <p className="text-2xl font-bold">{routines.length}</p>
        </div>
      </div>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Sesiones recientes</h2>
        {trainings.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">Aún no hay entrenamientos registrados.</p>
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
                    <span>{training.duracionMinutos} min</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Volumen: {training.volumenTotal} kg</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
                      onClick={() => void copyWorkout(training.id, 'text')}
                    >
                      Copiar para WhatsApp
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
                      onClick={() => void copyWorkout(training.id, 'csv')}
                    >
                      Copiar para Excel
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Plan inteligente de hoy</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Día actual: <span className="font-medium capitalize">{todayName}</span>
        </p>
        {recommendedRoutine ? (
          <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="font-semibold">Rutina recomendada: {recommendedRoutine.routine.nombre}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Cobertura de grupos prioritarios: {recommendedRoutine.coverage} ejercicio(s)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Grupos a priorizar esta semana: {weakMuscles.length > 0 ? weakMuscles.join(' y ') : 'sin datos suficientes'}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            No hay rutinas activas planificadas para hoy. Activa o crea una rutina para recibir recomendación automática.
          </p>
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Récords personales recientes</h2>
        {recentPrs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">Aún no hay PRs registrados.</p>
        ) : (
          <ul className="space-y-2">
            {recentPrs.map((pr) => (
              <li key={pr.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{resolvePrExerciseName(pr.ejercicioId)}</span>
                  <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {pr.tipo}: {pr.valor.toFixed(1)} {pr.detalle ? `· ${pr.detalle}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <MuscleDistributionChart />

      <MuscleHeatmap muscleAnalytics={weeklyMuscleAnalytics} />

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">Logros y medallas</h2>
        <ul className="space-y-2">
          {achievements.map((achievement) => (
            <li key={achievement.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="text-sm">{achievement.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${achievement.unlocked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {achievement.unlocked ? 'Desbloqueado' : 'Pendiente'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}