import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Area, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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
  pecho: 'Chest',
  hombros: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  antebrazo: 'Forearm',
  core: 'Core',
  oblicuos: 'Obliques',
  trapecio: 'Trapezius',
  'espalda-alta': 'Upper back',
  'espalda-baja': 'Lower back',
  cuadriceps: 'Quadriceps',
  isquiotibial: 'Hamstring',
  gluteo: 'Glute',
  gemelo: 'Calf',
  aductor: 'Adductor',
  abductor: 'Abductor',
}

const CHART_AXIS_TICK = { fill: 'currentColor', fontSize: 11 }
const PR_TYPE_BADGE_CLASSES: Record<string, string> = {
  peso_maximo: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  volumen_serie: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  reps_mismo_peso: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  volumen_total: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
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

function buildHeatmapMonthGroups(cells: Array<{ key: string }>, locale: string) {
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' })
  const groups: Array<{ key: string; label: string; span: number }> = []

  for (const cell of cells) {
    const date = new Date(`${cell.key}T00:00:00`)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const label = monthFormatter.format(date)
    const last = groups[groups.length - 1]

    if (last && last.key === key) {
      last.span += 1
      continue
    }

    groups.push({ key, label, span: 1 })
  }

  return groups
}

function podiumEmoji(index: number): string {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return '🏅'
}

function isRecentPrEntry(dateIso: string): boolean {
  const now = Date.now()
  const entryTime = new Date(dateIso).getTime()
  return Number.isFinite(entryTime) && now - entryTime <= 7 * 24 * 60 * 60 * 1000
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
  const [copiedPrId, setCopiedPrId] = useState<string | null>(null)
  const numberLocale = i18n.language.toLowerCase().startsWith('es') ? 'es-ES' : 'en-US'

  const sortedMeasurements = useMemo(
    () =>
      measurements
        .slice()
        .sort((a, b) => +new Date(a.fechaRegistro) - +new Date(b.fechaRegistro)),
    [measurements],
  )

  const bodyData = sortedMeasurements.map((item) => ({
    fecha: new Date(item.fechaRegistro).toLocaleDateString(),
    peso: item.pesoCorporal,
    imc: item.imc,
  }))

  const cinturaData = useMemo(
    () => buildOptionalMeasurementSeries(sortedMeasurements, 'cintura'),
    [sortedMeasurements],
  )

  const pechoData = useMemo(
    () => buildOptionalMeasurementSeries(sortedMeasurements, 'pecho'),
    [sortedMeasurements],
  )

  const diametroPiernaData = useMemo(
    () => buildOptionalMeasurementSeries(sortedMeasurements, 'diametroPierna'),
    [sortedMeasurements],
  )

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
  const heatmapMonthGroups = useMemo(() => buildHeatmapMonthGroups(heatmapData, numberLocale), [heatmapData, numberLocale])
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

  const sharePrRecord = async (params: {
    id: string
    exerciseId: string
    tipo: string
    valor: number
  }) => {
    const shareText = t('progress.sharePr.text', {
      exerciseName: resolvePrExerciseName(params.exerciseId),
      type: t(`progress.pr.type.${params.tipo}`, { defaultValue: params.tipo }),
      value: params.valor.toFixed(1),
    })

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ text: shareText })
      return
    }

    if (!navigator.clipboard?.writeText) {
      return
    }

    await navigator.clipboard.writeText(shareText)
    setCopiedPrId(params.id)

    window.setTimeout(() => {
      setCopiedPrId((current) => (current === params.id ? null : current))
    }, 2000)
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

  const formatKg = (value: number, digits = 0) => `${Number(value).toLocaleString(numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits })} kg`

  const renderLineTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-xl">
        <p className="mb-2 font-semibold text-slate-200">{label}</p>
        <ul className="space-y-1">
          {payload.map((entry: any) => (
            <li key={entry.name} className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}</span>
              </span>
              <span className="font-semibold">{Number(entry.value ?? 0).toLocaleString(numberLocale, { maximumFractionDigits: 1 })}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderVolumeTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-xl">
        <p className="font-semibold text-slate-200">{t('progress.tooltip.date')}: {label}</p>
        <p className="mt-1 text-slate-100">
          {t('progress.tooltip.volumeLabel')}: <span className="font-semibold">{formatKg(Number(payload[0].value ?? 0), 0)}</span>
        </p>
      </div>
    )
  }

  const optionalMeasurementCharts = [
    {
      id: 'cintura',
      title: t('progress.charts.cintura'),
      data: cinturaData,
      color: '#f97316',
      gradientId: 'cinturaAreaGradient',
    },
    {
      id: 'pecho',
      title: t('progress.charts.pecho'),
      data: pechoData,
      color: '#8b5cf6',
      gradientId: 'pechoAreaGradient',
    },
    {
      id: 'pierna',
      title: t('progress.charts.pierna'),
      data: diametroPiernaData,
      color: '#14b8a6',
      gradientId: 'piernaAreaGradient',
    },
  ].filter((chart) => chart.data.length >= 2)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('progress.title')}</h1>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.weightImc')}</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bodyData}>
              <defs>
                <linearGradient id="weightAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="imcAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="fecha" tick={CHART_AXIS_TICK} minTickGap={10} />
              <YAxis tick={CHART_AXIS_TICK} />
              <Tooltip content={renderLineTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                formatter={(value, entry) => <span style={{ color: (entry as { color?: string }).color }}>{value}</span>}
              />
              <Area type="monotone" dataKey="peso" stroke="none" fill="url(#weightAreaGradient)" />
              <Area type="monotone" dataKey="imc" stroke="none" fill="url(#imcAreaGradient)" />
              <Line
                type="monotone"
                name={t('progress.legend.weight')}
                dataKey="peso"
                stroke="#ef4444"
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 5, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name={t('progress.legend.imc')}
                dataKey="imc"
                stroke="#3b82f6"
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 5, fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {optionalMeasurementCharts.map((chart) => (
        <section key={chart.id} className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
          <h2 className="mb-3 text-lg font-semibold">{chart.title}</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data}>
                <defs>
                  <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.color} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={chart.color} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="fecha" tick={CHART_AXIS_TICK} minTickGap={10} />
                <YAxis tick={CHART_AXIS_TICK} />
                <Tooltip content={renderLineTooltip} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                  formatter={(value, entry) => <span style={{ color: (entry as { color?: string }).color }}>{value}</span>}
                />
                <Area type="monotone" dataKey="valor" stroke="none" fill={`url(#${chart.gradientId})`} />
                <Line
                  type="monotone"
                  name={chart.title}
                  dataKey="valor"
                  stroke={chart.color}
                  strokeWidth={2.25}
                  dot={false}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: chart.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ))}

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
              <defs>
                <linearGradient id="volumeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis
                dataKey="fecha"
                tick={CHART_AXIS_TICK}
                minTickGap={10}
                interval={volumeRange === 'weekly' ? 0 : 2}
              />
              <YAxis
                domain={[0, volumeAxisMax]}
                tick={CHART_AXIS_TICK}
                tickFormatter={(value) => `${Number(value).toLocaleString(numberLocale)}`}
              />
              <Tooltip content={renderVolumeTooltip} />
              <Bar
                dataKey="volumen"
                fill="url(#volumeBarGradient)"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={850}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
          {t('progress.scaleNote')}
        </p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
        <h2 className="mb-3 text-lg font-semibold">{t('progress.sections.heatmapFrequency')}</h2>
        <div className="overflow-x-auto pb-1">
          <div className="min-w-max space-y-2">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${heatmapData.length}, minmax(0, 1.25rem))` }}
            >
              {heatmapMonthGroups.map((month) => (
                <div
                  key={month.key}
                  style={{ gridColumn: `span ${month.span}` }}
                  className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300"
                >
                  {month.label}
                </div>
              ))}
            </div>

            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${heatmapData.length}, minmax(0, 1.25rem))` }}
            >
              {heatmapData.map((cell) => (
                <div
                  key={cell.key}
                  title={t('progress.heatmap.cellTitle', { date: cell.label, count: cell.count })}
                  className={`h-5 w-5 rounded ${heatmapColor(cell.count)}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-slate-200 dark:bg-slate-700" />
            {t('progress.heatmap.legend.none')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-green-200 dark:bg-green-700" />
            {t('progress.heatmap.legend.low')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-green-400 dark:bg-green-600" />
            {t('progress.heatmap.legend.moderate')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-green-600 dark:bg-green-500" />
            {t('progress.heatmap.legend.high')}
          </span>
        </div>
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
                {prByType.peso_maximo.map((pr, index) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <span>{podiumEmoji(index)}</span>
                      <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    </span>
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
                {prByType.volumen_serie.map((pr, index) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <span>{podiumEmoji(index)}</span>
                      <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    </span>
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
                {prByType.reps_mismo_peso.map((pr, index) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <span>{podiumEmoji(index)}</span>
                      <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    </span>
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
                {prByType.volumen_total.map((pr, index) => (
                  <li key={pr.id} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <span>{podiumEmoji(index)}</span>
                      <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                    </span>
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
              {recentPrs.map((pr, index) => (
                <li key={pr.id} className="rounded border border-slate-200 p-2 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span>{podiumEmoji(index)}</span>
                      <span>{resolvePrExerciseName(pr.ejercicioId)}</span>
                    </span>
                    <div className="inline-flex items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PR_TYPE_BADGE_CLASSES[pr.tipo] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>
                        {t(`progress.pr.type.${pr.tipo}`, { defaultValue: pr.tipo })}
                      </span>
                      {isRecentPrEntry(pr.fecha) ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          {t('progress.pr.newBadge')}
                        </span>
                      ) : null}
                      <span>{new Date(pr.fecha).toLocaleDateString()}</span>
                      <button
                        type="button"
                        onClick={() => {
                          void sharePrRecord({
                            id: pr.id,
                            exerciseId: pr.ejercicioId,
                            tipo: pr.tipo,
                            valor: pr.valor,
                          })
                        }}
                        className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-[10px] font-semibold"
                        title={t('progress.sharePr.button')}
                      >
                        <Share2 size={12} />
                        <span>{t('progress.sharePr.button')}</span>
                      </button>
                      {copiedPrId === pr.id ? (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {t('progress.sharePr.copied')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {t(`progress.pr.type.${pr.tipo}`, { defaultValue: pr.tipo })}: {pr.valor.toFixed(1)} {pr.detalle ? `· ${pr.detalle}` : ''}
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

function buildOptionalMeasurementSeries(
  measurements: Array<{ fechaRegistro: string; cintura?: number; pecho?: number; diametroPierna?: number }>,
  field: 'cintura' | 'pecho' | 'diametroPierna',
) {
  return measurements
    .filter((item) => item[field] != null)
    .map((item) => ({
      fecha: new Date(item.fechaRegistro).toLocaleDateString(),
      valor: Number(item[field]),
    }))
}
