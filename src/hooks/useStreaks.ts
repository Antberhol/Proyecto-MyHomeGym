import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { sendLocalNotification } from '../lib/notifications'
import { progressRepository } from '../repositories/progressRepository'

export interface StreaksData {
    currentDayStreak: number
    currentWeekStreak: number
    totalTrainings: number
    lastTrainingDate: string | null
}

interface StreaksComputedData extends StreaksData {
    trainedToday: boolean
}

const EMPTY_STREAKS: StreaksData = {
    currentDayStreak: 0,
    currentWeekStreak: 0,
    totalTrainings: 0,
    lastTrainingDate: null,
}

const STREAK_WARNING_STORAGE_KEY = 'lastStreakWarningDate'

function toLocalDateKey(value: string): string {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function fromLocalDateKey(key: string): Date {
    const [year, month, day] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

function shiftDays(key: string, days: number): string {
    const date = fromLocalDateKey(key)
    date.setDate(date.getDate() + days)
    return toLocalDateKey(date.toISOString())
}

function startOfWeek(date: Date): Date {
    const copy = new Date(date)
    copy.setHours(0, 0, 0, 0)
    const day = (copy.getDay() + 6) % 7
    copy.setDate(copy.getDate() - day)
    return copy
}

function toWeekKey(dateValue: string): string {
    const date = startOfWeek(new Date(dateValue))
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-W${month}-${day}`
}

function shiftWeekKey(weekKey: string, weeks: number): string {
    const [, rawDate] = weekKey.split('W')
    const [month, day] = rawDate.split('-').map(Number)
    const year = Number(weekKey.slice(0, 4))
    const base = new Date(year, month - 1, day)
    base.setDate(base.getDate() + weeks * 7)
    return toWeekKey(base.toISOString())
}

function computeDayStreak(dateKeys: Set<string>): number {
    if (dateKeys.size === 0) return 0

    const today = toLocalDateKey(new Date().toISOString())
    const yesterday = shiftDays(today, -1)

    const anchor = dateKeys.has(today) ? today : dateKeys.has(yesterday) ? yesterday : null
    if (!anchor) return 0

    let streak = 0
    let cursor = anchor

    while (dateKeys.has(cursor)) {
        streak += 1
        cursor = shiftDays(cursor, -1)
    }

    return streak
}

function computeWeekStreak(weekKeys: Set<string>): number {
    if (weekKeys.size === 0) return 0

    const currentWeek = toWeekKey(new Date().toISOString())
    const previousWeek = shiftWeekKey(currentWeek, -1)

    const anchor = weekKeys.has(currentWeek) ? currentWeek : weekKeys.has(previousWeek) ? previousWeek : null
    if (!anchor) return 0

    let streak = 0
    let cursor = anchor

    while (weekKeys.has(cursor)) {
        streak += 1
        cursor = shiftWeekKey(cursor, -1)
    }

    return streak
}

export function useStreaks(): StreaksData {
    const data = useLiveQuery<StreaksComputedData>(async () => {
        const filteredTrainings = await progressRepository.listTrainingsUntil(new Date().toISOString())

        if (filteredTrainings.length === 0) {
            return {
                ...EMPTY_STREAKS,
                trainedToday: false,
            }
        }

        const dayKeys = new Set(filteredTrainings.map((item) => toLocalDateKey(item.fecha)))
        const weekKeys = new Set(filteredTrainings.map((item) => toWeekKey(item.fecha)))
        const todayKey = toLocalDateKey(new Date().toISOString())

        const latest = filteredTrainings.reduce((acc, item) => (item.fecha > acc ? item.fecha : acc), filteredTrainings[0].fecha)

        return {
            currentDayStreak: computeDayStreak(dayKeys),
            currentWeekStreak: computeWeekStreak(weekKeys),
            totalTrainings: filteredTrainings.length,
            lastTrainingDate: latest,
            trainedToday: dayKeys.has(todayKey),
        }
    }, [])

    useEffect(() => {
        if (!data) return
        if (typeof window === 'undefined') return
        if (!('Notification' in window)) return
        if (Notification.permission !== 'granted') return

        if (data.currentDayStreak < 3 || data.trainedToday) return

        const now = new Date()
        if (now.getHours() < 19) return

        const todayKey = toLocalDateKey(now.toISOString())
        if (window.localStorage.getItem(STREAK_WARNING_STORAGE_KEY) === todayKey) {
            return
        }

        try {
            sendLocalNotification(
                'MyHomeGym 🔥',
                `¡Tu racha de ${data.currentDayStreak} días está en peligro! Entrena hoy para mantenerla.`,
            )
            window.localStorage.setItem(STREAK_WARNING_STORAGE_KEY, todayKey)
        } catch {
            // Ignore runtime notification errors; permission and API availability are checked above.
        }
    }, [data])

    if (!data) return EMPTY_STREAKS

    return {
        currentDayStreak: data.currentDayStreak,
        currentWeekStreak: data.currentWeekStreak,
        totalTrainings: data.totalTrainings,
        lastTrainingDate: data.lastTrainingDate,
    }
}
