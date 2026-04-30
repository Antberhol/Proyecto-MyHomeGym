import { useTranslation } from 'react-i18next'

export type PrType = 'peso_maximo' | 'volumen_total' | 'reps_mismo_peso' | 'volumen_serie'

export interface PRFeedItemProps {
  type: PrType
  exerciseName: string
  value: number
  unit?: string
  dateIso: string
  previousValue?: number | null
}

function iconForType(type: PrType): string {
  switch (type) {
    case 'peso_maximo':
      return '🏆'
    case 'volumen_total':
      return '📊'
    case 'reps_mismo_peso':
      return '🔁'
    case 'volumen_serie':
      return '💪'
    default:
      return '🏆'
  }
}

export function PRFeedItem({ type, exerciseName, value, unit, dateIso, previousValue }: PRFeedItemProps) {
  const { t, i18n } = useTranslation()

  const dateLabel = new Date(dateIso).toLocaleDateString(i18n.language)
  const improvementPct =
    typeof previousValue === 'number' && previousValue > 0
      ? Math.round(((value - previousValue) / previousValue) * 100)
      : null

  const isPositive = typeof improvementPct === 'number' ? improvementPct >= 0 : true

  return (
    <div className="bg-gym-card border border-gym-border rounded-xl p-4 flex items-start gap-3">
      <div className="mt-0.5 text-xl">{iconForType(type)}</div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-gym-text-bright font-medium truncate">{exerciseName}</div>
            <div className="mt-1 inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/30">
                {t(`progress.prTypes.${type}`)}
              </span>
              <span className="text-gym-yellow font-display text-2xl tracking-wide">
                {value.toLocaleString()} {unit ?? ''}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-gym-text-dim text-xs">{dateLabel}</div>
            {typeof improvementPct === 'number' && (
              <div className={`mt-1 text-xs ${isPositive ? 'text-gym-success' : 'text-gym-danger'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(improvementPct)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
