import { db } from '../lib/db'
import type { BodyMeasurement, UserProfile } from '../types/models'

export const profileRepository = {
    async getProfile(): Promise<UserProfile | undefined> {
        return db.getFirstUserProfile()
    },

    async upsertProfile(profile: UserProfile): Promise<string> {
        return db.putUserProfile(profile)
    },

    async createBodyMeasurement(measurement: BodyMeasurement): Promise<string> {
        return db.addBodyMeasurement(measurement)
    },
}
