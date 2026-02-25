import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { db } from './db'

function toCsvValue(value: unknown): string {
    const text = String(value ?? '')
    const escaped = text.replace(/"/g, '""')
    return `"${escaped}"`
}

interface ExportData {
    version: string
    exportedAt: string
    userProfile: unknown[]
    ejerciciosCatalogo: unknown[]
    rutinas: unknown[]
    rutinaEjercicios: unknown[]
    entrenamientosRegistrados: unknown[]
    ejerciciosRealizados: unknown[]
    medidasCorporalesHistorico: unknown[]
    prs: unknown[]
}

export async function exportAllDataJson(): Promise<void> {
    const snapshot = await db.exportAllData()

    const exportData: ExportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        userProfile: snapshot.userProfile,
        ejerciciosCatalogo: snapshot.ejerciciosCatalogo,
        rutinas: snapshot.rutinas,
        rutinaEjercicios: snapshot.rutinaEjercicios,
        entrenamientosRegistrados: snapshot.entrenamientosRegistrados,
        ejerciciosRealizados: snapshot.ejerciciosRealizados,
        medidasCorporalesHistorico: snapshot.medidasCorporalesHistorico,
        prs: snapshot.prs,
    }

    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `myhomegym-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
}

export async function importAllDataJson(file: File): Promise<{ imported: number; skipped: number }> {
    const content = await file.text()
    const data = JSON.parse(content) as ExportData

    if (!data.version || !data.exportedAt) {
        throw new Error('Formato de archivo inválido')
    }

    let imported = 0
    let skipped = 0

    if (Array.isArray(data.userProfile) && data.userProfile.length > 0) {
        await db.clearUserProfiles()
        await db.bulkAddUserProfiles(data.userProfile as never[])
        imported += data.userProfile.length
    }

    if (Array.isArray(data.ejerciciosCatalogo)) {
        const existingIds = new Set((await db.getAllExercisesCatalog()).map((item) => item.id))
        const customExercises = (data.ejerciciosCatalogo as { id: string; esPersonalizado?: boolean }[])
            .filter((item) => item.esPersonalizado && !existingIds.has(item.id))
        if (customExercises.length > 0) {
            await db.bulkAddExercises(customExercises as never[])
            imported += customExercises.length
        }
        skipped += data.ejerciciosCatalogo.length - customExercises.length
    }

    if (Array.isArray(data.rutinas)) {
        const existingIds = new Set((await db.getAllRoutines()).map((item) => item.id))
        const newItems = (data.rutinas as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddRoutines(newItems as never[])
            imported += newItems.length
        }
        skipped += data.rutinas.length - newItems.length
    }

    if (Array.isArray(data.rutinaEjercicios)) {
        const existingIds = new Set((await db.getAllRoutineExercises()).map((item) => item.id))
        const newItems = (data.rutinaEjercicios as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddRoutineExercises(newItems as never[])
            imported += newItems.length
        }
        skipped += data.rutinaEjercicios.length - newItems.length
    }

    if (Array.isArray(data.entrenamientosRegistrados)) {
        const existingIds = new Set((await db.getAllTrainings()).map((item) => item.id))
        const newItems = (data.entrenamientosRegistrados as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddTrainings(newItems as never[])
            imported += newItems.length
        }
        skipped += data.entrenamientosRegistrados.length - newItems.length
    }

    if (Array.isArray(data.ejerciciosRealizados)) {
        const existingIds = new Set((await db.getAllPerformedExercises()).map((item) => item.id))
        const newItems = (data.ejerciciosRealizados as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddPerformedExercises(newItems as never[])
            imported += newItems.length
        }
        skipped += data.ejerciciosRealizados.length - newItems.length
    }

    if (Array.isArray(data.medidasCorporalesHistorico)) {
        const existingIds = new Set((await db.getAllBodyMeasurements()).map((item) => item.id))
        const newItems = (data.medidasCorporalesHistorico as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddBodyMeasurements(newItems as never[])
            imported += newItems.length
        }
        skipped += data.medidasCorporalesHistorico.length - newItems.length
    }

    if (Array.isArray(data.prs)) {
        const existingIds = new Set((await db.getAllPersonalRecords()).map((item) => item.id))
        const newItems = (data.prs as { id: string }[]).filter((item) => !existingIds.has(item.id))
        if (newItems.length > 0) {
            await db.bulkAddPersonalRecords(newItems as never[])
            imported += newItems.length
        }
        skipped += data.prs.length - newItems.length
    }

    return { imported, skipped }
}

export async function exportTrainingsCsv(): Promise<void> {
    const trainings = await db.getAllTrainings()
    const rows = [
        ['id', 'rutinaId', 'fecha', 'duracionMinutos', 'volumenTotal', 'completado', 'notas'],
        ...trainings.map((training) => [
            training.id,
            training.rutinaId ?? '',
            training.fecha,
            training.duracionMinutos,
            training.volumenTotal,
            training.completado,
            training.notas ?? '',
        ]),
    ]

    const csv = rows.map((row) => row.map(toCsvValue).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `myhomegym-trainings-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

function parseCsvLine(line: string): string[] {
    const values: string[] = []
    let current = ''
    let insideQuotes = false

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index]

        if (char === '"') {
            const next = line[index + 1]
            if (insideQuotes && next === '"') {
                current += '"'
                index += 1
            } else {
                insideQuotes = !insideQuotes
            }
            continue
        }

        if (char === ',' && !insideQuotes) {
            values.push(current)
            current = ''
            continue
        }

        current += char
    }

    values.push(current)
    return values
}

export async function importTrainingsCsv(file: File): Promise<number> {
    const content = await file.text()
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)

    if (lines.length <= 1) {
        return 0
    }

    const rows = lines.slice(1).map(parseCsvLine)

    const parsed = rows
        .map((columns) => {
            const [id, rutinaId, fecha, duracionMinutos, volumenTotal, completado, notas] = columns

            if (!id || !fecha) return null

            return {
                id,
                rutinaId: rutinaId || undefined,
                fecha,
                duracionMinutos: Number(duracionMinutos || 0),
                volumenTotal: Number(volumenTotal || 0),
                completado: String(completado).toLowerCase() === 'true',
                notas: notas || undefined,
            }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

    if (parsed.length === 0) {
        return 0
    }

    const existingIds = new Set((await db.getAllTrainings()).map((item) => item.id))
    const newRows = parsed.filter((item) => !existingIds.has(item.id))

    if (newRows.length > 0) {
        await db.bulkAddTrainings(newRows)
    }

    return newRows.length
}

export async function exportSummaryPdf(): Promise<void> {
    const profile = (await db.getAllUserProfiles())[0]
    const trainings = await db.getAllTrainings()
    const prs = await db.getAllPersonalRecords()
    const measurements = await db.getAllBodyMeasurements()
    const exercises = await db.getAllExercisesCatalog()
    const routines = await db.getAllRoutines()

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20

    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen de Entrenamiento', pageWidth / 2, yPos, { align: 'center' })
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado el ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Profile section
    if (profile) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Perfil', 14, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const profileData = [
            ['Nombre', profile.nombre || 'Sin nombre'],
            ['Peso', `${profile.pesoCorporal} kg`],
            ['Altura', `${profile.altura} cm`],
            ['IMC', profile.imc.toFixed(2)],
        ]
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: profileData,
            theme: 'plain',
            styles: { fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
        })
        yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    }

    // Stats summary
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Estadísticas generales', 14, yPos)
    yPos += 8

    const totalVolume = trainings.reduce((sum, t) => sum + (t.volumenTotal || 0), 0)
    const totalMinutes = trainings.reduce((sum, t) => sum + (t.duracionMinutos || 0), 0)
    const exercisePrs = prs.filter((pr) => pr.ejercicioId !== 'GLOBAL')

    const statsData = [
        ['Total de entrenamientos', String(trainings.length)],
        ['Tiempo total', `${Math.round(totalMinutes / 60)} horas`],
        ['Volumen total', `${totalVolume.toLocaleString()} kg`],
        ['PRs alcanzados', String(exercisePrs.length)],
        ['Rutinas activas', String(routines.filter((r) => r.activa).length)],
    ]
    autoTable(doc, {
        startY: yPos,
        head: [],
        body: statsData,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    })
    yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // Recent trainings
    if (trainings.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Últimos entrenamientos', 14, yPos)
        yPos += 8

        const recentTrainings = trainings
            .slice()
            .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
            .slice(0, 10)

        const trainingRows = recentTrainings.map((t) => [
            new Date(t.fecha).toLocaleDateString(),
            `${t.duracionMinutos} min`,
            `${t.volumenTotal.toLocaleString()} kg`,
            t.notas || '-',
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['Fecha', 'Duración', 'Volumen', 'Notas']],
            body: trainingRows,
            theme: 'striped',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [230, 57, 70] },
        })
        yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    }

    // Personal records
    if (exercisePrs.length > 0) {
        if (yPos > 240) {
            doc.addPage()
            yPos = 20
        }

        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Récords personales', 14, yPos)
        yPos += 8

        const exerciseMap = new Map(exercises.map((e) => [e.id, e.nombre]))

        const prRows = exercisePrs
            .slice()
            .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
            .slice(0, 15)
            .map((pr) => [
                exerciseMap.get(pr.ejercicioId) || 'Ejercicio',
                pr.tipo.replace('_', ' '),
                String(pr.valor),
                new Date(pr.fecha).toLocaleDateString(),
            ])

        autoTable(doc, {
            startY: yPos,
            head: [['Ejercicio', 'Tipo', 'Valor', 'Fecha']],
            body: prRows,
            theme: 'striped',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [230, 57, 70] },
        })
        yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    }

    // Body measurements
    if (measurements.length > 0) {
        if (yPos > 200) {
            doc.addPage()
            yPos = 20
        }

        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Historial de medidas', 14, yPos)
        yPos += 8

        const measurementRows = measurements
            .slice()
            .sort((a, b) => +new Date(b.fechaRegistro) - +new Date(a.fechaRegistro))
            .slice(0, 10)
            .map((m) => [
                new Date(m.fechaRegistro).toLocaleDateString(),
                `${m.pesoCorporal} kg`,
                m.imc.toFixed(2),
                m.cintura ? `${m.cintura} cm` : '-',
                m.pecho ? `${m.pecho} cm` : '-',
            ])

        autoTable(doc, {
            startY: yPos,
            head: [['Fecha', 'Peso', 'IMC', 'Cintura', 'Pecho']],
            body: measurementRows,
            theme: 'striped',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [230, 57, 70] },
        })
    }

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(
            `MyHomeGym - Página ${i} de ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' },
        )
    }

    doc.save(`myhomegym-summary-${new Date().toISOString().slice(0, 10)}.pdf`)
}
