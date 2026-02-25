import { useMemo, useState } from 'react'
import { BottomSheet } from '../ui/BottomSheet'
import { NumberStepper } from '../ui/NumberStepper'
import { calculatePlateDistribution } from '../../utils/plateCalculator'

interface PlateCalculatorModalProps {
    isOpen: boolean
    onClose: () => void
    initialTargetWeight?: number
}

function plateColor(weight: number): string {
    if (weight >= 25) return 'bg-red-600'
    if (weight >= 20) return 'bg-blue-600'
    if (weight >= 15) return 'bg-yellow-500'
    if (weight >= 10) return 'bg-green-600'
    if (weight >= 5) return 'bg-slate-700'
    return 'bg-slate-400'
}

function plateHeight(weight: number): number {
    if (weight >= 25) return 72
    if (weight >= 20) return 64
    if (weight >= 15) return 58
    if (weight >= 10) return 52
    if (weight >= 5) return 46
    return 40
}

export function PlateCalculatorModal({ isOpen, onClose, initialTargetWeight = 100 }: PlateCalculatorModalProps) {
    const [targetWeight, setTargetWeight] = useState(initialTargetWeight)
    const [barWeight, setBarWeight] = useState(20)

    const result = useMemo(
        () => calculatePlateDistribution(targetWeight, barWeight),
        [barWeight, targetWeight],
    )

    const leftSide = result.perSide.slice().reverse()
    const rightSide = result.perSide

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Calculadora de discos">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <NumberStepper label="Peso objetivo (kg)" value={targetWeight} onChange={setTargetWeight} step={2.5} min={0} decimals={2} />
                    <NumberStepper label="Peso barra (kg)" value={barWeight} onChange={setBarWeight} step={2.5} min={0} decimals={2} />
                </div>

                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="text-sm font-semibold">Resultado</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                        Carga total armada: <span className="font-semibold">{result.totalLoaded.toFixed(2)} kg</span>
                    </p>
                    {!result.isExact && (
                        <p className="text-xs text-amber-600 dark:text-amber-300">
                            Diferencia con objetivo: {result.remainder.toFixed(2)} kg
                        </p>
                    )}
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                        Por lado: {result.perSide.length > 0 ? result.perSide.join(' + ') : 'sin discos'}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                    <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Visualización de barra</p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="flex items-end gap-1">
                            {leftSide.map((plate, index) => (
                                <div
                                    key={`left-${plate}-${index}`}
                                    className={`w-5 rounded-t-sm ${plateColor(plate)}`}
                                    style={{ height: `${plateHeight(plate)}px` }}
                                    aria-label={`Disco izquierdo ${plate}kg`}
                                />
                            ))}
                        </div>

                        <div className="h-3 w-56 rounded bg-slate-700 dark:bg-slate-300" />

                        <div className="flex items-end gap-1">
                            {rightSide.map((plate, index) => (
                                <div
                                    key={`right-${plate}-${index}`}
                                    className={`w-5 rounded-t-sm ${plateColor(plate)}`}
                                    style={{ height: `${plateHeight(plate)}px` }}
                                    aria-label={`Disco derecho ${plate}kg`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}
