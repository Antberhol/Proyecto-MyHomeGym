export const DEFAULT_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25] as const

export interface PlateCalculatorResult {
    perSide: number[]
    totalTarget: number
    barWeight: number
    totalLoaded: number
    remainder: number
    isExact: boolean
}

export function calculatePlateDistribution(
    targetWeight: number,
    barWeight = 20,
    availablePlates: readonly number[] = DEFAULT_PLATES,
): PlateCalculatorResult {
    const safeTarget = Math.max(0, Number(targetWeight) || 0)
    const safeBar = Math.max(0, Number(barWeight) || 0)
    const sorted = [...availablePlates].filter((item) => item > 0).sort((a, b) => b - a)

    if (safeTarget <= safeBar || sorted.length === 0) {
        return {
            perSide: [],
            totalTarget: safeTarget,
            barWeight: safeBar,
            totalLoaded: safeBar,
            remainder: Number((safeTarget - safeBar).toFixed(2)),
            isExact: Math.abs(safeTarget - safeBar) < 0.01,
        }
    }

    let perSideRemaining = Number((((safeTarget - safeBar) / 2)).toFixed(4))
    const perSide: number[] = []

    for (const plate of sorted) {
        while (perSideRemaining + 1e-9 >= plate) {
            perSide.push(plate)
            perSideRemaining = Number((perSideRemaining - plate).toFixed(4))
        }
    }

    const totalLoaded = safeBar + perSide.reduce((sum, plate) => sum + plate * 2, 0)
    const remainder = Number((safeTarget - totalLoaded).toFixed(2))

    return {
        perSide,
        totalTarget: safeTarget,
        barWeight: safeBar,
        totalLoaded: Number(totalLoaded.toFixed(2)),
        remainder,
        isExact: Math.abs(remainder) < 0.01,
    }
}
