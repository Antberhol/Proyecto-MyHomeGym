import { db } from '../lib/db'
import type { BodyMeasurement, UnitSystem, UserProfile } from '../types/models'

export const profileRepository = {
    async getProfile(): Promise<UserProfile | undefined> {
        return db.getFirstUserProfile()
    },

    async updateProfile(input: {
        nombre: string
        pesoCorporal: number
        altura: number
    }): Promise<UserProfile | undefined> {
        const currentProfile = await db.getFirstUserProfile()
        if (!currentProfile) {
            return undefined
        }

        const alturaMetros = input.altura / 100
        const imc = alturaMetros > 0 ? input.pesoCorporal / (alturaMetros * alturaMetros) : currentProfile.imc

        const updatedProfile: UserProfile = {
            ...currentProfile,
            nombre: input.nombre.trim() || undefined,
            pesoCorporal: input.pesoCorporal,
            altura: input.altura,
            imc,
            updatedAt: new Date().toISOString(),
            isSynced: false,
        }

        await db.putUserProfile(updatedProfile)
        return updatedProfile
    },

    async updateUnitSystem(unitSystem: UnitSystem): Promise<UserProfile | undefined> {
        const currentProfile = await db.getFirstUserProfile()
        if (!currentProfile) {
            return undefined
        }

        const updatedProfile: UserProfile = {
            ...currentProfile,
            unitSystem,
            updatedAt: new Date().toISOString(),
            isSynced: false,
        }

        await db.putUserProfile(updatedProfile)
        return updatedProfile
    },

    async upsertProfile(profile: UserProfile): Promise<string> {
        return db.putUserProfile(profile)
    },

    async createBodyMeasurement(measurement: BodyMeasurement): Promise<string> {
        const id = await db.addBodyMeasurement({
            ...measurement,
            isSynced: false,
            updatedAt: measurement.updatedAt ?? measurement.fechaRegistro,
        })

        await db.enqueueSyncOperation({
            entityType: 'bodyMeasurement',
            entityId: id,
            payload: '{}',
        })

        return id
    },
}
