import { describe, expect, it } from 'vitest'
import {
    calculateImc,
    calculateSetVolume,
    calculateWorkoutVolume,
    classifyImc,
    estimateCaloriesBurned,
    estimateOneRmEpley,
} from '../../src/utils/calculations'

describe('calculations utils', () => {
    describe('calculateImc', () => {
        it('returns expected value for normal BMI', () => {
            expect(calculateImc(70, 170)).toBeCloseTo(24.22, 2)
        })

        it('returns 0 for zero or negative height', () => {
            expect(calculateImc(70, 0)).toBe(0)
            expect(calculateImc(70, -10)).toBe(0)
        })

        it('handles decimal weight', () => {
            expect(calculateImc(70.5, 175)).toBeCloseTo(23.02, 2)
        })
    })

    describe('classifyImc', () => {
        it('classifies underweight', () => {
            const result = classifyImc(17)
            expect(result.label).toBe('Bajo peso')
        })

        it('classifies normal weight', () => {
            const result = classifyImc(22)
            expect(result.label).toBe('Normal')
        })

        it('classifies overweight', () => {
            const result = classifyImc(27)
            expect(result.label).toBe('Sobrepeso')
        })

        it('classifies obesity', () => {
            const result = classifyImc(32)
            expect(result.label).toBe('Obesidad')
        })
    })

    describe('calculateSetVolume', () => {
        it('multiplies weight and reps', () => {
            expect(calculateSetVolume(80, 8)).toBe(640)
        })

        it('handles decimal weight', () => {
            expect(calculateSetVolume(82.5, 10)).toBe(825)
        })

        it('handles zero values', () => {
            expect(calculateSetVolume(0, 8)).toBe(0)
            expect(calculateSetVolume(80, 0)).toBe(0)
        })
    })

    describe('estimateOneRmEpley', () => {
        it('estimates one rep max using Epley formula', () => {
            expect(estimateOneRmEpley(100, 5)).toBeCloseTo(116.67, 2)
        })

        it('returns same weight for 1 rep', () => {
            expect(estimateOneRmEpley(100, 0)).toBe(100)
        })

        it('handles heavy weight low rep scenario', () => {
            expect(estimateOneRmEpley(140, 3)).toBeCloseTo(154, 0)
        })
    })

    describe('calculateWorkoutVolume', () => {
        it('multiplies series, reps and weight', () => {
            expect(calculateWorkoutVolume(4, 10, 60)).toBe(2400)
        })

        it('handles zero series', () => {
            expect(calculateWorkoutVolume(0, 10, 60)).toBe(0)
        })

        it('treats negative values as zero', () => {
            expect(calculateWorkoutVolume(-4, 10, 60)).toBe(0)
        })
    })

    describe('estimateCaloriesBurned', () => {
        it('returns kcal estimate with default MET', () => {
            expect(estimateCaloriesBurned(75, 60, 6)).toBe(450)
        })

        it('handles short workout', () => {
            expect(estimateCaloriesBurned(70, 30, 6)).toBe(210)
        })

        it('returns zero for zero minutes', () => {
            expect(estimateCaloriesBurned(75, 0, 6)).toBe(0)
        })

        it('treats negative minutes as zero', () => {
            expect(estimateCaloriesBurned(75, -30, 6)).toBe(0)
        })
    })
})
