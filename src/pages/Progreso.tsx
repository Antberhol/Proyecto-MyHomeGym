import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BodyDiagramSvg } from '../components/body/BodyDiagramSvg'
import type { MuscleLevel } from '../components/body/types'
import { progressRepository } from '../repositories/progressRepository'
import { calculateWorkoutVolume, estimateCaloriesBurned, estimateOneRmEpley } from '../utils/calculations'

const TRACKED_GROUPS = [
  'pecho',
  'hombros',
  'biceps',
  'triceps',
  'antebrazo',
  'core',
  'oblicuos',
  'trapecio',
  'espalda-alta',
  'espalda-baja',
  'cuadriceps',
  'isquiotibial',
  'gluteo',
  'gemelo',
  'aductor',
  'abductor',
] as const

const GROUP_LABELS: Record<string, string> = {
  pecho: 'Pecho',
  hombros: 'Hombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  antebrazo: 'Antebrazo',
  core: 'Core',
  oblicuos: 'Oblicuos',
  trapecio: 'Trapecio',
  'espalda-alta': 'Espalda alta',
  'espalda-baja': 'Espalda baja',
  cuadriceps: 'Cuádriceps',
  isquiotibial: 'Isquiotibial',
  gluteo: 'Glúteo',
  gemelo: 'Gemelo',
  aductor: 'Aductor',
  abductor: 'Abductor',
}

function levelFromVolume(volume: number): MuscleLevel {
  if (volume < 2000) return 'basico'
  if (volume < 6000) return 'medio'
  if (volume < 12000) return 'avanzado'
  return 'experto'
}

function normalizeGroup(group: string): string {
  const normalized = group
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

  if (['biceps', 'bicep'].includes(normalized)) return 'biceps'
  if (['triceps', 'tricep'].includes(normalized)) return 'triceps'
  if (['antebrazo', 'antebrazos', 'forearm'].includes(normalized)) return 'antebrazo'
  if (['dorsales', 'dorsal', 'espalda alta', 'upper back', 'upper-back'].includes(normalized)) return 'espalda-alta'
  if (['lumbar', 'lumbares', 'espalda baja', 'lower back', 'lower-back'].includes(normalized)) return 'espalda-baja'
  if (['trapecio', 'trapecios', 'trapezio'].includes(normalized)) return 'trapecio'
  if (['isquios', 'isquiotibial', 'isquiotibiales', 'femorales', 'hamstring'].includes(normalized)) return 'isquiotibial'
  if (['gemelo', 'gemelos', 'pantorrilla', 'pantorrillas', 'calves'].includes(normalized)) return 'gemelo'
  if (['gluteos', 'gluteo', 'gluteo mayor', 'gluteo medio', 'gluteus'].includes(normalized)) return 'gluteo'
  if (['cuadriceps', 'quadriceps'].includes(normalized)) return 'cuadriceps'
  if (['abductor', 'abductores', 'abductors'].includes(normalized)) return 'abductor'
  if (['aductor', 'aductores', 'adductor'].includes(normalized)) return 'aductor'
  if (['espalda'].includes(normalized)) return 'espalda'
  if (['pierna', 'piernas'].includes(normalized)) return 'piernas'
  if (['brazo', 'brazos'].includes(normalized)) return 'brazos'
  if (['abdominales', 'abdomen', 'abs', 'core'].includes(normalized)) return 'core'
  if (['oblicuos', 'oblicuo', 'oblique', 'obliques'].includes(normalized)) return 'oblicuos'
  if (['pectoral', 'pectorales', 'pecho'].includes(normalized)) return 'pecho'
  if (['deltoides', 'hombro', 'hombros'].includes(normalized)) return 'hombros'

  return normalized
}

function groupShares(group: string): Array<{ key: string; ratio: number }> {
  if (TRACKED_GROUPS.includes(group as (typeof TRACKED_GROUPS)[number])) {
    return [{ key: group, ratio: 1 }]
  }

  if (group === 'espalda') {
    return [
      { key: 'espalda-alta', ratio: 0.45 },
      { key: 'trapecio', ratio: 0.3 },
      { key: 'espalda-baja', ratio: 0.25 },
    ]
  }

  if (group === 'piernas') {
    return [
      { key: 'cuadriceps', ratio: 0.35 },
      { key: 'isquiotibial', ratio: 0.25 },
      { key: 'gluteo', ratio: 0.2 },
      { key: 'gemelo', ratio: 0.2 },
    ]
  }

  if (group === 'brazos') {
    return [
      { key: 'biceps', ratio: 0.4 },
      { key: 'triceps', ratio: 0.4 },
      { key: 'antebrazo', ratio: 0.2 },
    ]
  }

  return []
}

function addVolumeByGroup(acc: Record<string, number>, rawGroup: string, volume: number) {
  const normalized = normalizeGroup(rawGroup)
  const targets = groupShares(normalized)

  targets.forEach(({ key, ratio }) => {
    acc[key] = (acc[key] ?? 0) + volume * ratio
  })
}

function repsFromText(reps: string): number {
  const rangeMatch = reps.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    return (Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2
  }
  const singleMatch = reps.match(/(\d+)/)
  if (singleMatch) return Number(singleMatch[1])
  return 10
}

function buildHeatmapData(trainingDates: string[]) {
  const map = new Map<string, number>()
  trainingDates.forEach((date) => {
    const key = new Date(date).toISOString().slice(0, 10)
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  const days = Array.from({ length: 70 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (69 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      count: map.get(key) ?? 0,
      label: date.toLocaleDateString(),
    }
  })

  return days
}

function heatmapColor(count: number): string {
  if (count === 0) return 'bg-slate-200 dark:bg-slate-700'
  if (count === 1) return 'bg-green-200 dark:bg-green-700'
  if (count === 2) return 'bg-green-400 dark:bg-green-600'
  return 'bg-green-600 dark:bg-green-500'
}

export function ProgresoPage() {
  const { t, i18n } = useTranslation()
  const measurements = useLiveQuery(() => progressRepository.listBodyMeasurements(), []) ?? []
  const trainings = useLiveQuery(() => progressRepository.listTrainings(), []) ?? []
  const performedExercises = useLiveQuery(() => progressRepository.listPerformedExercises(), []) ?? []
  const exercises = useLiveQuery(() => progressRepository.listExercises(), []) ?? []
  const routines = useLiveQuery(() => progressRepository.listRoutines(), []) ?? []
  const routineExercises = useLiveQuery(() => progressRepository.listRoutineExercises(), []) ?? []
  const prs = useLiveQuery(() => progressRepository.listPersonalRecords(), []) ?? []
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [oneRmPeso, setOneRmPeso] = useState(60)
  const [oneRmReps, setOneRmReps] = useState(8)
  const [volSeries, setVolSeries] = useState(4)
  const [volReps, setVolReps] = useState(10)
  const [volPeso, setVolPeso] = useState(60)
  const [calWeight, setCalWeight] = useState(75)
  const [calMinutes, setCalMinutes] = useState(60)
  const [calMet, setCalMet] = useState(6)
  const [volumeRange, setVolumeRange] = useState<'weekly' | 'monthly'>('weekly')
  const numberLocale = i18n.language.toLowerCase().startsWith('es') ? 'es-ES' : 'en-US'

  const bodyData = measurements
    .slice()
    .sort((a, b) => +new Date(a.fechaRegistro) - +new Date(b.fechaRegistro))
    .map((item) => ({
      fecha: new Date(item.fechaRegistro).toLocaleDateString(),
      peso: item.pesoCorporal,
      imc: item.imc,
    }))

  const volumeData = useMemo(() => {
    const sorted = trainings
      .slice()
      .sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))

    const now = new Date()
    const since = new Date(now)
    since.setDate(now.getDate() - (volumeRange === 'weekly' ? 7 : 30))

    return sorted
      .filter((item) => new Date(item.fecha) >= since)
      .map((item) => ({
        fecha: new Date(item.fecha).toLocaleDateString(),
        volumen: item.volumenTotal,
      }))
  }, [trainings, volumeRange])

  const volumeAxisMax = useMemo(() => {
    const maxVolume = volumeData.reduce((max, item) => Math.max(max, item.volumen), 0)
    const roundedMax = Math.ceil(maxVolume / 1000) * 1000
    return Math.max(10_000, roundedMax)
  }, [volumeData])

  const heatmapData = useMemo(() => buildHeatmapData(trainings.map((item) => item.fecha)), [trainings])
  const oneRm = estimateOneRmEpley(oneRmPeso, oneRmReps)
  const volumeEstimate = calculateWorkoutVolume(volSeries, volReps, volPeso)
  const caloriesEstimate = estimateCaloriesBurned(calWeight, calMinutes, calMet)

  const currentStreak = useMemo(() => {
    if (trainings.length === 0) return 0

    const trainedDays = new Set(
      trainings.map((training) => {
        const date = new Date(training.fecha)
        date.setHours(0, 0, 0, 0)
        return date.toISOString().slice(0, 10)
      }),
    )

    let streak = 0
    const cursor = new Date()
    cursor.setHours(0, 0, 0, 0)

    while (trainedDays.has(cursor.toISOString().slice(0, 10))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  }, [trainings])

  const muscleRecommendations = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const exerciseToMuscle = new Map(exercises.map((exercise) => [exercise.id, exercise.grupoMuscularPrimario]))

    const volumeByMuscle = performedExercises.reduce<Record<string, number>>((acc, set) => {
      if (new Date(set.fecha) < thirtyDaysAgo) return acc

      const muscle = exerciseToMuscle.get(set.ejercicioId)
      if (!muscle) return acc

      acc[muscle] = (acc[muscle] ?? 0) + set.pesoUtilizado * set.repeticionesRealizadas
      return acc
    }, {})

    const sorted = Object.entries(volumeByMuscle).sort((a, b) => a[1] - b[1])

    return {
      low: sorted.slice(0, 2),
      high: sorted.slice(-2).reverse(),
    }
  }, [exercises, performedExercises])

  const recentMuscleVolume = useMemo(() => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]))

    return performedExercises.reduce<Record<string, number>>((acc, entry) => {
      const entryDate = new Date(entry.fecha)
      if (entryDate < monthAgo) return acc

      const exercise = exerciseById.get(entry.ejercicioId)
      if (!exercise) return acc

      const setVolume = entry.repeticionesRealizadas * entry.pesoUtilizado
      addVolumeByGroup(acc, exercise.grupoMuscularPrimario, setVolume)

      exercise.gruposMuscularesSecundarios.forEach((secondary) => {
        addVolumeByGroup(acc, secondary, setVolume * 0.35)
      })

      return acc
    }, {})
  }, [exercises, performedExercises])

  const estimatedMuscleVolume = useMemo(() => {
    const activeRoutineIds = new Set(routines.filter((routine) => routine.activa).map((routine) => routine.id))
    const routinesToUse = activeRoutineIds.size > 0
      ? routineExercises.filter((item) => activeRoutineIds.has(item.rutinaId))
      : routineExercises

    const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]))

    return routinesToUse.reduce<Record<string, number>>((acc, routineExercise) => {
      const exercise = exerciseById.get(routineExercise.ejercicioId)
      if (!exercise) return acc

      const estimatedSetVolume = repsFromText(routineExercise.repeticiones) * Math.max(1, routineExercise.pesoSugerido ?? 20)
      const estimatedExerciseVolume = estimatedSetVolume * Math.max(1, routineExercise.series)
      addVolumeByGroup(acc, exercise.grupoMuscularPrimario, estimatedExerciseVolume)

      exercise.gruposMuscularesSecundarios.forEach((secondary) => {
        addVolumeByGroup(acc, secondary, estimatedExerciseVolume * 0.35)
      })

      return acc
    }, {})
  }, [exercises, routineExercises, routines])

  const hasRecentTrainingData = useMemo(() => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    return performedExercises.some((entry) => new Date(entry.fecha) >= monthAgo)
  }, [performedExercises])

  const diagramMuscleVolume = hasRecentTrainingData ? recentMuscleVolume : estimatedMuscleVolume

  const exerciseNameById = useMemo(() => {
    return new Map(exercises.map((exercise) => [exercise.id, exercise.nombre]))
  }, [exercises])

  const prByType = useMemo(() => {
    const exercisePrs = prs.filter((pr) => pr.ejercicioId !== 'GLOBAL')
    const byType = {
      peso_maximo: exercisePrs.filter((pr) => pr.tipo === 'peso_maximo').sort((a, b) => b.valor - a.valor).slice(0, 5),
      volumen_serie: exercisePrs.filter((pr) => pr.tipo === 'volumen_serie').sort((a, b) => b.valor - a.valor).slice(0, 5),
      reps_mismo_peso: exercisePrs.filter((pr) => pr.tipo === 'reps_mismo_peso').sort((a, b) => b.valor - a.valor).slice(0, 5),
      volumen_total: prs.filter((pr) => pr.tipo === 'volumen_total').sort((a, b) => b.valor - a.valor).slice(0, 5),
    }
    return byType
  }, [prs])

  const recentPrs = useMemo(() => {
    return prs
      .slice()
      .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
      .slice(0, 12)
  }, [prs])

  const resolvePrExerciseName = (exerciseId: string) => {
    if (exerciseId === 'GLOBAL') return t('dashboard.prs.globalSession')
    return exerciseNameById.get(exerciseId) ?? t('dashboard.common.exercise')
  }

  const groupLabel = (group: string) => {
    return t(`progress.muscleLabels.${group}`, {
      defaultValue: GROUP_LABELS[group] ?? group,
    })
  }

  const levelByMuscle = useMemo(() => {
    return TRACKED_GROUPS.reduce<Record<string, { volume: number; level: MuscleLevel }>>((acc, muscle) => {
      const volume = diagramMuscleVolume[muscle] ?? 0
      acc[muscle] = { volume, level: levelFromVolume(volume) }
      return acc
    }, {})
  }, [diagramMuscleVolume])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('progress.title')}</h1>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.weightImc')}</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bodyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line dataKey="peso" stroke="#E63946" strokeWidth={2} dot={false} />
              <Line dataKey="imc" stroke="#1D3557" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t('progress.sections.volumePerSession')}</h2>
          <div className="inline-flex rounded-lg border border-slate-300 p-1 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setVolumeRange('weekly')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${volumeRange === 'weekly' ? 'bg-gym-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {t('progress.range.weekly')}
            </button>
            <button
              type="button"
              onClick={() => setVolumeRange('monthly')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${volumeRange === 'monthly' ? 'bg-gym-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {t('progress.range.monthly')}
            </button>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 10 }}
                minTickGap={10}
                interval={volumeRange === 'weekly' ? 0 : 2}
              />
              <YAxis
                domain={[0, volumeAxisMax]}
                tickFormatter={(value) => `${Number(value).toLocaleString(numberLocale)}`}
              />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString(numberLocale)} kg`, t('progress.tooltip.volumeLabel')]} />
              <Bar dataKey="volumen" fill="#06D6A0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
          {t('progress.scaleNote')}
        </p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.heatmapFrequency')}</h2>
        <div className="grid grid-cols-10 gap-1 sm:grid-cols-14">
          {heatmapData.map((cell) => (
            <div
              key={cell.key}
              title={t('progress.heatmap.cellTitle', { date: cell.label, count: cell.count })}
              className={`h-4 w-4 rounded ${heatmapColor(cell.count)}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">{t('progress.heatmap.darkerLegend')}</p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.oneRmCalculator')}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="number"
            value={oneRmPeso}
            onChange={(event) => setOneRmPeso(Number(event.target.value) || 0)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder={t('progress.placeholders.weightKg')}
          />
          <input
            type="number"
            value={oneRmReps}
            onChange={(event) => setOneRmReps(Number(event.target.value) || 1)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder={t('progress.placeholders.repetitions')}
          />
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
            {t('progress.oneRmEstimated')}: <span className="font-semibold">{oneRm.toFixed(1)} kg</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.sessionCalculators')}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-sm font-semibold">{t('progress.estimatedVolume')}</p>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={volSeries}
                onChange={(event) => setVolSeries(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('training.setsPlaceholder')}
              />
              <input
                type="number"
                value={volReps}
                onChange={(event) => setVolReps(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('training.repsPlaceholder')}
              />
              <input
                type="number"
                value={volPeso}
                onChange={(event) => setVolPeso(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('training.weightPlaceholder')}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t('progress.labels.volume')}: <span className="font-semibold">{volumeEstimate.toFixed(1)} kg</span></p>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-sm font-semibold">{t('progress.estimatedCalories')}</p>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={calWeight}
                onChange={(event) => setCalWeight(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('progress.placeholders.weightKgCompact')}
              />
              <input
                type="number"
                value={calMinutes}
                onChange={(event) => setCalMinutes(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('progress.placeholders.minutes')}
              />
              <input
                type="number"
                step="0.5"
                value={calMet}
                onChange={(event) => setCalMet(Number(event.target.value) || 0)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder={t('progress.placeholders.met')}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t('progress.labels.calories')}: <span className="font-semibold">{caloriesEstimate.toFixed(1)} kcal</span></p>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.consistencyRecommendations')}</h2>

        <div className="mb-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-300">{t('progress.currentStreak')}</p>
          <p className="text-2xl font-bold">{t('progress.dayCount', { count: currentStreak })}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.groupsToPrioritize30d')}</p>
            {muscleRecommendations.low.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {muscleRecommendations.low.map(([muscle, volume]) => (
                  <li key={muscle} className="flex items-center justify-between">
                    <span className="capitalize">{groupLabel(muscle)}</span>
                    <span>{volume.toFixed(0)} kg</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t('progress.insufficientData')}</p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.mostWorked30d')}</p>
            {muscleRecommendations.high.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {muscleRecommendations.high.map(([muscle, volume]) => (
                  <li key={muscle} className="flex items-center justify-between">
                    <span className="capitalize">{groupLabel(muscle)}</span>
                    <span>{volume.toFixed(0)} kg</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t('progress.insufficientData')}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t('progress.sections.bodyDiagram')}</h2>
        </div>

        <p className="mb-3 text-xs text-slate-500 dark:text-slate-300">
          {t('progress.bodyDiagram.sourceLabel')}: {hasRecentTrainingData ? t('progress.bodyDiagram.sourceReal') : t('progress.bodyDiagram.sourceEstimated')}.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">{t('progress.bodyDiagram.front')}</p>
            <BodyDiagramSvg
              view="frontal"
              levelByMuscle={levelByMuscle}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
            />
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300">{t('progress.bodyDiagram.back')}</p>
            <BodyDiagramSvg
              view="posterior"
              levelByMuscle={levelByMuscle}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
            />
          </div>

          <div className="space-y-3 xl:col-span-2">
            <h3 className="text-base font-semibold">{t('progress.bodyDiagram.detailByGroup')}</h3>
            {selectedGroup ? (
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="font-medium">{groupLabel(selectedGroup)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t('progress.labels.volume')}: {(levelByMuscle[selectedGroup]?.volume ?? 0).toFixed(0)} kg
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t('progress.bodyDiagram.levelLabel')}: {t(`progress.bodyDiagram.levelValues.${levelByMuscle[selectedGroup]?.level ?? 'basico'}`)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">{t('progress.bodyDiagram.selectPrompt')}</p>
            )}

            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#dbeafe' }} /> {t('progress.bodyDiagram.levelValues.basico')}</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#93c5fd' }} /> {t('progress.bodyDiagram.levelValues.medio')}</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#3b82f6' }} /> {t('progress.bodyDiagram.levelValues.avanzado')}</span>
              <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: '#1d4ed8' }} /> {t('progress.bodyDiagram.levelValues.experto')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.prPanel')}</h2>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.pr.topMaxWeight')}</p>
            {prByType.peso_maximo.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-300">{t('progress.pr.emptyMaxWeight')}</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {prByType.peso_maximo.map((pr) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    <span>{pr.valor.toFixed(1)} kg</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.pr.topVolumePerSet')}</p>
            {prByType.volumen_serie.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-300">{t('progress.pr.emptyVolumePerSet')}</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {prByType.volumen_serie.map((pr) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    <span>{pr.valor.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.pr.topRepsSameWeight')}</p>
            {prByType.reps_mismo_peso.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-300">{t('progress.pr.emptyRepetitions')}</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {prByType.reps_mismo_peso.map((pr) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    <span>{pr.valor.toFixed(0)} {t('training.repsPlaceholder').toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold">{t('progress.pr.topTotalSessionVolume')}</p>
            {prByType.volumen_total.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-300">{t('progress.pr.emptyTotalVolume')}</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {prByType.volumen_total.map((pr) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                    <span>{pr.valor.toFixed(0)} kg</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="mb-2 text-sm font-semibold">{t('progress.pr.recentHistory')}</p>
          {recentPrs.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-300">{t('progress.pr.emptyRecent')}</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {recentPrs.map((pr) => (
                <li key={pr.id} className="rounded border border-slate-200 p-2 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resolvePrExerciseName(pr.ejercicioId)}</span>
                    <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {pr.tipo}: {pr.valor.toFixed(1)} {pr.detalle ? `· ${pr.detalle}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}