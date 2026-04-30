import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'

export interface WeeklyVolumePoint {
    label: string
    volumen: number
    isCurrent?: boolean
}

type TooltipPayloadItem = {
    value?: number | string
}

interface CustomTooltipProps {
    active?: boolean
    payload?: TooltipPayloadItem[]
    label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null

    const value = Number(payload[0]?.value ?? 0)

    return (
        <div className="bg-gym-card border border-gym-border rounded-lg px-3 py-2 shadow-xl">
            <p className="text-gym-text-dim text-xs mb-1">{label}</p>
            <p className="text-gym-yellow font-bold text-sm">{value.toLocaleString()} kg</p>
        </div>
    )
}

interface WeeklyVolumeChartProps {
    data: WeeklyVolumePoint[]
}

export function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
    const { t } = useTranslation()

    if (data.length === 0) {
        return (
            <div className="bg-gym-card border border-gym-border rounded-xl p-4 text-gym-text-dim text-sm">
                {t('progress.weeklyVolume.empty')}
            </div>
        )
    }

    return (
        <div className="bg-gym-card border border-gym-border rounded-xl p-4">
            <div className="mb-3">
                <h3 className="font-display tracking-wider uppercase text-gym-text-bright text-lg">{t('progress.weeklyVolume.title')}</h3>
                <p className="text-gym-text-dim text-xs">{t('progress.weeklyVolume.subtitle')}</p>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                        <XAxis dataKey="label" tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                        <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={{ stroke: '#2A2A2A' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,197,24,0.05)' }} />
                        <Bar dataKey="volumen" fill="#F5C518" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isCurrent ? '#FFD93D' : '#F5C518'}
                                    fillOpacity={entry.isCurrent ? 1 : 0.6}
                                    stroke={entry.isCurrent ? '#F5C518' : undefined}
                                    strokeWidth={entry.isCurrent ? 1 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
