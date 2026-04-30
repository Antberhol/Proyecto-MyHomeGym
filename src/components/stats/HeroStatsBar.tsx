import { useTranslation } from 'react-i18next'

interface HeroStatsBarProps {
  streak: number
  totalWorkouts: number
  weeklyVolume: number
  currentWeight: number | null
  topOneRm: { exercise: string; value: number } | null
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gym-card border border-gym-border rounded-xl p-3">
      <div className="text-gym-text-muted text-[10px] uppercase tracking-wider">{label}</div>
      <div className="mt-1 font-display tracking-wider text-gym-yellow text-3xl leading-none">{value}</div>
    </div>
  )
}

export function HeroStatsBar({ streak, totalWorkouts, weeklyVolume, currentWeight, topOneRm }: HeroStatsBarProps) {
  const { t } = useTranslation()

  const formattedWeeklyVolume = `${weeklyVolume.toLocaleString()} kg`
  const formattedWeight = typeof currentWeight === 'number' ? `${currentWeight.toLocaleString()} kg` : t('progress.hero.noData')
  const formattedTopOneRm = topOneRm ? `${topOneRm.value.toLocaleString()} kg` : t('progress.hero.noData')

  return (
    <div className="sticky top-0 z-20 bg-gym-black/95 backdrop-blur border-b border-gym-border">
      <div className="mx-auto max-w-[1100px] px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <StatTile label={t('progress.hero.streak')} value={`${streak} 🔥`} />
          <StatTile label={t('progress.hero.totalWorkouts')} value={totalWorkouts.toLocaleString()} />
          <StatTile label={t('progress.hero.weeklyVolume')} value={formattedWeeklyVolume} />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <StatTile label={t('progress.hero.currentWeight')} value={formattedWeight} />
          <div className="bg-gym-card border border-gym-border rounded-xl p-3">
            <div className="text-gym-text-muted text-[10px] uppercase tracking-wider">{t('progress.hero.topOneRm')}</div>
            <div className="mt-1 font-display tracking-wider text-gym-yellow text-3xl leading-none">{formattedTopOneRm}</div>
            <div className="mt-1 text-gym-text-dim text-xs truncate">{topOneRm?.exercise ?? t('progress.hero.noData')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
