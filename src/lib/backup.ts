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
    const [
        userProfile,
        ejerciciosCatalogo,
        rutinas,
        rutinaEjercicios,
        entrenamientosRegistrados,
        ejerciciosRealizados,
        medidasCorporalesHistorico,
        prs,
    ] = await Promise.all([
        db.userProfile.toArray(),
        db.ejerciciosCatalogo.toArray(),
        db.rutinas.toArray(),
        db.rutinaEjercicios.toArray(),
        db.entrenamientosRegistrados.toArray(),
        db.ejerciciosRealizados.toArray(),
        db.medidasCorporalesHistorico.toArray(),
        db.prs.toArray(),
    ])

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            userProfile,
            ejerciciosCatalogo,
            rutinas,
            rutinaEjercicios,
            entrenamientosRegistrados,
            ejerciciosRealizados,
            medidasCorporalesHistorico,
            prs,
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

    await db.transaction(
        'rw',
        [
            db.userProfile,
            db.ejerciciosCatalogo,
            db.rutinas,
            db.rutinaEjercicios,
            db.entrenamientosRegistrados,
            db.ejerciciosRealizados,
            db.medidasCorporalesHistorico,
            db.prs,
        ],
        async () => {
            await Promise.all([
                db.userProfile.clear(),
                db.ejerciciosCatalogo.clear(),
                db.rutinas.clear(),
                db.rutinaEjercicios.clear(),
                db.entrenamientosRegistrados.clear(),
                db.ejerciciosRealizados.clear(),
                db.medidasCorporalesHistorico.clear(),
                db.prs.clear(),
            ])

            if (payload.data.userProfile.length > 0) await db.userProfile.bulkAdd(payload.data.userProfile as never[])
            if (payload.data.ejerciciosCatalogo.length > 0) await db.ejerciciosCatalogo.bulkAdd(payload.data.ejerciciosCatalogo as never[])
            if (payload.data.rutinas.length > 0) await db.rutinas.bulkAdd(payload.data.rutinas as never[])
            if (payload.data.rutinaEjercicios.length > 0) await db.rutinaEjercicios.bulkAdd(payload.data.rutinaEjercicios as never[])
            if (payload.data.entrenamientosRegistrados.length > 0) {
                await db.entrenamientosRegistrados.bulkAdd(payload.data.entrenamientosRegistrados as never[])
            }
            if (payload.data.ejerciciosRealizados.length > 0) {
                await db.ejerciciosRealizados.bulkAdd(payload.data.ejerciciosRealizados as never[])
            }
            if (payload.data.medidasCorporalesHistorico.length > 0) {
                await db.medidasCorporalesHistorico.bulkAdd(payload.data.medidasCorporalesHistorico as never[])
            }
            if (payload.data.prs.length > 0) await db.prs.bulkAdd(payload.data.prs as never[])
        },
    )
}
