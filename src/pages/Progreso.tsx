import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BodyDiagramSvg } from '../components/body/BodyDiagramSvg'
import type { MuscleLevel } from '../components/body/types'
import { HeroStatsBar } from '../components/stats/HeroStatsBar'
import { PRFeedItem } from '../components/stats/PRFeedItem'
import { StrengthProgressChart } from '../components/stats/StrengthProgressChart'
import { WeeklyVolumeChart } from '../components/stats/WeeklyVolumeChart'
import { progressRepository } from '../repositories/progressRepository'
import { estimateOneRmEpley } from '../utils/calculations'

type TabKey = 'resumen' | 'fuerza' | 'cuerpo' | 'prs'

type PrType = 'peso_maximo' | 'volumen_total' | 'reps_mismo_peso' | 'volumen_serie'

type WeekStats = {
  daysTrained: number
  weeklyVolume: number
  weeklySets: number
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 Sun ... 6 Sat
  const diff = (day === 0 ? -6 : 1) - day // Monday as start
  d.setDate(d.getDate() + diff)
  return d
}

function endOfWeek(date: Date): Date {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 7)
  return d
}

function toIsoDateKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function getIsoWeekNumber(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { year: d.getUTCFullYear(), week }
}

function levelFromVolume(volume: number): MuscleLevel {
  if (volume < 2000) return 'basico'
  if (volume < 6000) return 'medio'
  if (volume < 12000) return 'avanzado'
  return 'experto'
}

function MetricCard({ icon, label, value, unit, trend }: { icon: string; label: string; value: string | number; unit?: string; trend?: number | null }) {
  return (
    <div className="bg-gym-card border border-gym-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-gym-text-muted text-xs uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-gym-yellow font-display text-3xl tracking-wide">{value}</span>
        {unit && <span className="text-gym-text-dim text-sm">{unit}</span>}
      </div>
      {typeof trend === 'number' && (
        <span className={`text-xs ${trend > 0 ? 'text-gym-success' : 'text-gym-danger'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% 
        </span>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gym-card border border-gym-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-gym-text-dim text-xs mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-gym-yellow font-bold text-sm">
          {Number(p.value ?? 0).toLocaleString()} {p.name === 'peso' ? 'kg' : ''}
        </p>
      ))}
    </div>
  )
}

export function ProgresoPage() {
  const { t, i18n } = useTranslation()

  const measurements = useLiveQuery(() => progressRepository.listBodyMeasurements(), []) ?? []
  const trainings = useLiveQuery(() => progressRepository.listTrainings(), []) ?? []
  const performedExercises = useLiveQuery(() => progressRepository.listPerformedExercises(), []) ?? []
  const exercises = useLiveQuery(() => progressRepository.listExercises(), []) ?? []
  const prs = useLiveQuery(() => progressRepository.listPersonalRecords(), []) ?? []

  const [tab, setTab] = useState<TabKey>('resumen')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')
  const [prFilter, setPrFilter] = useState<'all' | PrType>('all')

  const numberLocale = i18n.language.toLowerCase().startsWith('es') ? 'es-ES' : 'en-US'

  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises])

  const currentWeight = useMemo(() => {
    const sorted = measurements
      .slice()
      .sort((a, b) => +new Date(a.fechaRegistro) - +new Date(b.fechaRegistro))
    return sorted.length > 0 ? sorted[sorted.length - 1].pesoCorporal : null
  }, [measurements])

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

  const weekStats = useMemo<WeekStats>(() => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    const days = new Set<string>()
    let weeklyVolume = 0
    trainings.forEach((training) => {
      const d = new Date(training.fecha)
      if (d >= weekStart && d < weekEnd) {
        weeklyVolume += training.volumenTotal
        days.add(toIsoDateKey(d))
      }
    })

    const weeklySets = performedExercises.reduce((acc, entry) => {
      const d = new Date(entry.fecha)
      if (d >= weekStart && d < weekEnd) return acc + 1
      return acc
    }, 0)

    return {
      daysTrained: days.size,
      weeklyVolume,
      weeklySets,
    }
  }, [performedExercises, trainings])

  const weeklyVolumeChartData = useMemo(() => {
    const map = new Map<string, number>()
    trainings.forEach((training) => {
      const d = new Date(training.fecha)
      const wk = getIsoWeekNumber(d)
      const key = `${wk.year}-W${wk.week}`
      map.set(key, (map.get(key) ?? 0) + training.volumenTotal)
    })

    const now = new Date()
    const currentWk = getIsoWeekNumber(now)
    const data = [] as Array<{ label: string; volumen: number; isCurrent?: boolean }>

    for (let i = 11; i >= 0; i -= 1) {
      const cursor = new Date(now)
      cursor.setDate(cursor.getDate() - i * 7)
      const wk = getIsoWeekNumber(cursor)
      const key = `${wk.year}-W${wk.week}`
      const isCurrent = wk.year === currentWk.year && wk.week === currentWk.week
      const label = isCurrent ? t('progress.weekLabel.currentShort') : `W${wk.week}`
      data.push({ label, volumen: map.get(key) ?? 0, isCurrent })
    }

    return data
  }, [t, trainings])

  const topOneRm = useMemo(() => {
    let best: { exercise: string; value: number } | null = null

    performedExercises.forEach((entry) => {
      const exercise = exerciseById.get(entry.ejercicioId)
      if (!exercise) return

      const oneRm = estimateOneRmEpley(entry.pesoUtilizado, entry.repeticionesRealizadas)
      if (!Number.isFinite(oneRm) || oneRm <= 0) return

      if (!best || oneRm > best.value) {
        best = { exercise: exercise.nombre, value: Math.round(oneRm) }
      }
    })

    return best
  }, [exerciseById, performedExercises])

  // ---- Summary: muscle distribution (last 30 days) ----
  const diagramMuscleVolume = useMemo(() => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    const acc: Record<string, number> = {}

    const normalizeGroup = (group: string): string => {
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
      if (['abdominales', 'abdomen', 'abs', 'core'].includes(normalized)) return 'core'
      if (['oblicuos', 'oblicuo', 'oblique', 'obliques'].includes(normalized)) return 'oblicuos'
      if (['pectoral', 'pectorales', 'pecho'].includes(normalized)) return 'pecho'
      if (['deltoides', 'hombro', 'hombros'].includes(normalized)) return 'hombros'

      return normalized
    }

    const addVolume = (group: string, volume: number) => {
      const key = normalizeGroup(group)
      acc[key] = (acc[key] ?? 0) + volume
    }

    performedExercises.forEach((entry) => {
      const date = new Date(entry.fecha)
      if (date < monthAgo) return

      const exercise = exerciseById.get(entry.ejercicioId)
      if (!exercise) return

      const setVolume = entry.pesoUtilizado * entry.repeticionesRealizadas
      addVolume(exercise.grupoMuscularPrimario, setVolume)
      exercise.gruposMuscularesSecundarios.forEach((secondary) => addVolume(secondary, setVolume * 0.35))
    })

    return acc
  }, [exerciseById, performedExercises])

  const levelByMuscle = useMemo(() => {
    const keys = [
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
    ]

    return keys.reduce<Record<string, { volume: number; level: MuscleLevel }>>((acc, key) => {
      const volume = diagramMuscleVolume[key] ?? 0
      acc[key] = { volume, level: levelFromVolume(volume) }
      return acc
    }, {})
  }, [diagramMuscleVolume])

  // ---- Strength: selector + 1RM series ----
  const strengthExerciseOptions = useMemo(() => {
    const ids = new Set(performedExercises.map((e) => e.ejercicioId))
    return exercises
      .filter((e) => ids.has(e.id))
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [exercises, performedExercises])

  const effectiveSelectedExerciseId = selectedExerciseId || strengthExerciseOptions[0]?.id || ''

  const oneRmSeries = useMemo(() => {
    if (!effectiveSelectedExerciseId) return []

    const byDay = new Map<string, { oneRm: number; weight: number }>()

    performedExercises
      .filter((e) => e.ejercicioId === effectiveSelectedExerciseId)
      .forEach((entry) => {
        const dayKey = toIsoDateKey(new Date(entry.fecha))
        const oneRm = estimateOneRmEpley(entry.pesoUtilizado, entry.repeticionesRealizadas)
        if (!Number.isFinite(oneRm) || oneRm <= 0) return

        const current = byDay.get(dayKey)
        if (!current || oneRm > current.oneRm) {
          byDay.set(dayKey, { oneRm: Math.round(oneRm), weight: entry.pesoUtilizado })
        }
      })

    return Array.from(byDay.entries())
      .sort((a, b) => +new Date(a[0]) - +new Date(b[0]))
      .slice(-24)
      .map(([dayKey, v]) => ({
        label: new Date(`${dayKey}T00:00:00`).toLocaleDateString(numberLocale, { month: 'short', day: 'numeric' }),
        oneRm: v.oneRm,
        weight: v.weight,
      }))
  }, [effectiveSelectedExerciseId, numberLocale, performedExercises])

  const topPesoMaximoPrs = useMemo(() => {
    const items = prs
      .filter((pr) => pr.tipo === 'peso_maximo')
      .slice()
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)

    return items.map((pr) => ({
      id: pr.id,
      value: pr.valor,
      exerciseName: exerciseById.get(pr.ejercicioId)?.nombre ?? t('progress.unknownExercise'),
    }))
  }, [exerciseById, prs, t])

  const oneRmComparison = useMemo(() => {
    if (!effectiveSelectedExerciseId) return { recent: null as number | null, baseline: null as number | null }

    const now = new Date()
    const since30 = new Date(now)
    since30.setDate(since30.getDate() - 30)

    const since60 = new Date(now)
    since60.setDate(since60.getDate() - 60)

    let recent = 0
    let baseline = 0

    performedExercises
      .filter((e) => e.ejercicioId === effectiveSelectedExerciseId)
      .forEach((entry) => {
        const d = new Date(entry.fecha)
        const oneRm = estimateOneRmEpley(entry.pesoUtilizado, entry.repeticionesRealizadas)
        if (!Number.isFinite(oneRm) || oneRm <= 0) return

        if (d >= since30) {
          recent = Math.max(recent, oneRm)
        } else if (d >= since60 && d < since30) {
          baseline = Math.max(baseline, oneRm)
        }
      })

    return {
      recent: recent > 0 ? Math.round(recent) : null,
      baseline: baseline > 0 ? Math.round(baseline) : null,
    }
  }, [effectiveSelectedExerciseId, performedExercises])

  // ---- Body tab data ----
  const bodyLast90Days = useMemo(() => {
    const since = new Date()
    since.setDate(since.getDate() - 90)

    return measurements
      .filter((m) => new Date(m.fechaRegistro) >= since)
      .slice()
      .sort((a, b) => +new Date(a.fechaRegistro) - +new Date(b.fechaRegistro))
      .map((m) => ({
        label: new Date(m.fechaRegistro).toLocaleDateString(numberLocale, { month: 'short', day: 'numeric' }),
        peso: m.pesoCorporal,
        imc: m.imc,
      }))
  }, [measurements, numberLocale])

  const latestMeasurement = useMemo(() => {
    const sorted = measurements
      .slice()
      .sort((a, b) => +new Date(a.fechaRegistro) - +new Date(b.fechaRegistro))
    return sorted.length > 0 ? sorted[sorted.length - 1] : null
  }, [measurements])

  // ---- PR feed ----
  const filteredPrFeed = useMemo(() => {
    const items = prs
      .slice()
      .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))

    return items.filter((pr) => (prFilter === 'all' ? true : pr.tipo === prFilter))
  }, [prFilter, prs])

  const previousPrValueById = useMemo(() => {
    const sorted = prs
      .slice()
      .sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))

    const lastByKey = new Map<string, number>()
    const previousById = new Map<string, number | null>()

    sorted.forEach((pr) => {
      const key = `${pr.ejercicioId}|${pr.tipo}`
      previousById.set(pr.id, lastByKey.get(key) ?? null)
      lastByKey.set(key, pr.valor)
    })

    return previousById
  }, [prs])

  return (
    <div className="-mx-4 sm:mx-0">
      <HeroStatsBar
        streak={currentStreak}
        totalWorkouts={trainings.length}
        weeklyVolume={Math.round(weekStats.weeklyVolume)}
        currentWeight={currentWeight}
        topOneRm={topOneRm}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display tracking-wider uppercase text-gym-yellow text-3xl">{t('progress.title')}</h1>
        </div>

        <div className="mt-4 border-b border-gym-border flex gap-4">
          {([
            { key: 'resumen', label: t('progress.tabs.summary') },
            { key: 'fuerza', label: t('progress.tabs.strength') },
            { key: 'cuerpo', label: t('progress.tabs.body') },
            { key: 'prs', label: t('progress.tabs.prs') },
          ] as Array<{ key: TabKey; label: string }>).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`pb-3 text-sm font-semibold transition ${tab === item.key
                ? 'text-gym-yellow border-b-2 border-gym-yellow'
                : 'text-gym-text-dim hover:text-gym-text-bright'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'resumen' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricCard icon="📅" label={t('progress.summary.daysTrained')} value={weekStats.daysTrained} unit={t('progress.units.days')} />
              <MetricCard icon="🏋️" label={t('progress.summary.weeklyVolume')} value={Math.round(weekStats.weeklyVolume).toLocaleString(numberLocale)} unit="kg" />
              <MetricCard icon="✅" label={t('progress.summary.weeklySets')} value={weekStats.weeklySets} unit={t('progress.units.sets')} />
            </div>

            <WeeklyVolumeChart data={weeklyVolumeChartData} />

            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <div className="mb-3">
                <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.muscleDistribution.title')}</h3>
                <p className="text-gym-text-dim text-xs">{t('progress.muscleDistribution.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gym-card-2 border border-gym-border rounded-xl p-3">
                  <BodyDiagramSvg
                    view="frontal"
                    levelByMuscle={levelByMuscle}
                    selectedGroup={selectedGroup}
                    onSelectGroup={(group) => setSelectedGroup((prev) => (prev === group ? null : group))}
                  />
                </div>
                <div className="bg-gym-card-2 border border-gym-border rounded-xl p-3">
                  <BodyDiagramSvg
                    view="posterior"
                    levelByMuscle={levelByMuscle}
                    selectedGroup={selectedGroup}
                    onSelectGroup={(group) => setSelectedGroup((prev) => (prev === group ? null : group))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'fuerza' && (
          <div className="mt-6 space-y-6">
            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <label className="text-gym-text-muted text-xs uppercase tracking-wider">{t('progress.strength.exerciseSelector')}</label>
              <select
                className="mt-2 w-full rounded-lg border border-gym-border bg-gym-card-2 px-3 py-2 text-gym-text-bright"
                value={effectiveSelectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
              >
                {strengthExerciseOptions.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.nombre}
                  </option>
                ))}
              </select>
            </div>

            <StrengthProgressChart data={oneRmSeries} />

            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.strength.topPrs')}</h3>
              <div className="mt-3 space-y-2">
                {topPesoMaximoPrs.length === 0 ? (
                  <div className="text-gym-text-dim text-sm">{t('progress.strength.noPrs')}</div>
                ) : (
                  topPesoMaximoPrs.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between bg-gym-card-2 border border-gym-border rounded-lg px-3 py-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                        <span className="text-gym-text-bright truncate">{item.exerciseName}</span>
                      </div>
                      <span className="text-gym-yellow font-display text-2xl tracking-wide">{item.value.toLocaleString(numberLocale)} kg</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.strength.comparisonTitle')}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-gym-card-2 border border-gym-border rounded-xl p-4">
                  <div className="text-gym-text-muted text-xs uppercase tracking-wider">{t('progress.strength.recent')}</div>
                  <div className="mt-1 text-gym-yellow font-display text-3xl tracking-wide">
                    {oneRmComparison.recent ? `${oneRmComparison.recent.toLocaleString(numberLocale)} kg` : t('progress.hero.noData')}
                  </div>
                </div>
                <div className="bg-gym-card-2 border border-gym-border rounded-xl p-4">
                  <div className="text-gym-text-muted text-xs uppercase tracking-wider">{t('progress.strength.thirtyDaysAgo')}</div>
                  <div className="mt-1 text-gym-yellow font-display text-3xl tracking-wide">
                    {oneRmComparison.baseline ? `${oneRmComparison.baseline.toLocaleString(numberLocale)} kg` : t('progress.hero.noData')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'cuerpo' && (
          <div className="mt-6 space-y-6">
            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.body.weight90d')}</h3>
              <div className="mt-3 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyLast90Days}>
                    <defs>
                      <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F5C518" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#F5C518" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                    <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="peso" stroke="none" fill="url(#weightArea)" />
                    <Line stroke="#F5C518" strokeWidth={2} dataKey="peso" dot={{ fill: '#F5C518', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.body.bmi')}</h3>
              <div className="mt-3 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyLast90Days}>
                    <defs>
                      <linearGradient id="bmiArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F5C518" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#F5C518" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                    <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="imc" stroke="none" fill="url(#bmiArea)" />
                    <Line stroke="#F5C518" strokeWidth={2} dataKey="imc" dot={{ fill: '#F5C518', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gym-card border border-gym-border rounded-xl p-4">
              <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.body.measurements')}</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <MetricCard icon="📏" label={t('progress.body.waist')} value={latestMeasurement?.cintura ?? t('progress.hero.noData')} unit="cm" />
                <MetricCard icon="📏" label={t('progress.body.chest')} value={latestMeasurement?.pecho ?? t('progress.hero.noData')} unit="cm" />
                <MetricCard icon="📏" label={t('progress.body.leg')} value={latestMeasurement?.diametroPierna ?? t('progress.hero.noData')} unit="cm" />
                <MetricCard icon="📏" label={t('progress.body.biceps')} value={latestMeasurement?.biceps ?? t('progress.hero.noData')} unit="cm" />
                <MetricCard icon="📏" label={t('progress.body.shoulders')} value={latestMeasurement?.hombros ?? t('progress.hero.noData')} unit="cm" />
                <MetricCard icon="📏" label={t('progress.body.calf')} value={latestMeasurement?.pantorrilla ?? t('progress.hero.noData')} unit="cm" />
              </div>
            </div>
          </div>
        )}

        {tab === 'prs' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {([
                { key: 'all', label: t('progress.prFilter.all') },
                { key: 'peso_maximo', label: t('progress.prFilter.weight') },
                { key: 'volumen_total', label: t('progress.prFilter.volume') },
                { key: 'reps_mismo_peso', label: t('progress.prFilter.reps') },
              ] as Array<{ key: 'all' | PrType; label: string }>).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPrFilter(item.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border ${prFilter === item.key
                    ? 'border-gym-yellow text-gym-yellow bg-gym-yellow/10'
                    : 'border-gym-border text-gym-text-dim hover:text-gym-text-bright'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredPrFeed.length === 0 ? (
                <div className="bg-gym-card border border-gym-border rounded-xl p-6 text-gym-text-dim">
                  {t('progress.prFeed.empty')}
                </div>
              ) : (
                filteredPrFeed.map((pr) => (
                  <PRFeedItem
                    key={pr.id}
                    type={pr.tipo}
                    exerciseName={exerciseById.get(pr.ejercicioId)?.nombre ?? t('progress.unknownExercise')}
                    value={pr.valor}
                    unit={pr.tipo === 'peso_maximo' ? 'kg' : ''}
                    dateIso={pr.fecha}
                    previousValue={previousPrValueById.get(pr.id) ?? null}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
