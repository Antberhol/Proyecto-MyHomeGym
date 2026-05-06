import { db } from '../lib/db'
import type { NotificationSettings } from '../types/models'

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    streakWarningEnabled: true,
    streakWarningHour: 19,
    restTimerNotificationEnabled: true,
}

export const settingsRepository = {
    async clearAllData(): Promise<void> {
        await db.clearAllData()
    },

    async getNotificationSettings(): Promise<NotificationSettings> {
        const stored = await db.getNotificationSettings()
        if (!stored) {
            return DEFAULT_NOTIFICATION_SETTINGS
        }
        return {
            streakWarningEnabled: stored.streakWarningEnabled ?? DEFAULT_NOTIFICATION_SETTINGS.streakWarningEnabled,
            streakWarningHour: stored.streakWarningHour ?? DEFAULT_NOTIFICATION_SETTINGS.streakWarningHour,
            restTimerNotificationEnabled: stored.restTimerNotificationEnabled ?? DEFAULT_NOTIFICATION_SETTINGS.restTimerNotificationEnabled,
        }
    },

    async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
        await db.saveNotificationSettings(settings)
    },
}
