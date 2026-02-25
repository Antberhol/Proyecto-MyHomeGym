import { db } from './db'
import { z } from 'zod'

const backupPayloadSchema = z.object({
    version: z.number().int().min(1),
    exportedAt: z.string().datetime(),
    data: z.object({
        userProfile: z.array(z.record(z.string(), z.unknown())),
        ejerciciosCatalogo: z.array(z.record(z.string(), z.unknown())),
        rutinas: z.array(z.record(z.string(), z.unknown())),
        rutinaEjercicios: z.array(z.record(z.string(), z.unknown())),
        entrenamientosRegistrados: z.array(z.record(z.string(), z.unknown())),
        ejerciciosRealizados: z.array(z.record(z.string(), z.unknown())),
        medidasCorporalesHistorico: z.array(z.record(z.string(), z.unknown())),
        prs: z.array(z.record(z.string(), z.unknown())),
    }),
})

interface BackupPayload {
    version: number
    exportedAt: string
    data: {
        userProfile: unknown[]
        ejerciciosCatalogo: unknown[]
        rutinas: unknown[]
        rutinaEjercicios: unknown[]
        entrenamientosRegistrados: unknown[]
        ejerciciosRealizados: unknown[]
        medidasCorporalesHistorico: unknown[]
        prs: unknown[]
    }
}

export async function buildBackupPayload(): Promise<BackupPayload> {
    const data = await db.exportAllData()

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            userProfile: data.userProfile,
            ejerciciosCatalogo: data.ejerciciosCatalogo,
            rutinas: data.rutinas,
            rutinaEjercicios: data.rutinaEjercicios,
            entrenamientosRegistrados: data.entrenamientosRegistrados,
            ejerciciosRealizados: data.ejerciciosRealizados,
            medidasCorporalesHistorico: data.medidasCorporalesHistorico,
            prs: data.prs,
        },
    }
}

export function downloadBackup(payload: BackupPayload): void {
    const fileName = `hevy-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
}

export async function importBackupFile(file: File): Promise<void> {
    const content = await file.text()
    const unknownPayload = JSON.parse(content) as unknown
    const parsedPayload = backupPayloadSchema.safeParse(unknownPayload)

    if (!parsedPayload.success) {
        throw new Error('Archivo de respaldo inválido o con estructura incorrecta.')
    }

    const payload: BackupPayload = parsedPayload.data

    await db.replaceAllData({
        userProfile: payload.data.userProfile as never[],
        ejerciciosCatalogo: payload.data.ejerciciosCatalogo as never[],
        rutinas: payload.data.rutinas as never[],
        rutinaEjercicios: payload.data.rutinaEjercicios as never[],
        entrenamientosRegistrados: payload.data.entrenamientosRegistrados as never[],
        ejerciciosRealizados: payload.data.ejerciciosRealizados as never[],
        medidasCorporalesHistorico: payload.data.medidasCorporalesHistorico as never[],
        prs: payload.data.prs as never[],
    })
}
