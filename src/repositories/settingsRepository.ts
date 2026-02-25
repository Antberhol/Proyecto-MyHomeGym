import { db } from '../lib/db'

export const settingsRepository = {
    async clearAllData(): Promise<void> {
        await db.clearAllData()
    },
}
