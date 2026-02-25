export interface TrainingSetData {
    reps: number
    weight: number
}

export interface TrainingExerciseData {
    name: string
    sets: TrainingSetData[]
}

export interface TrainingData {
    id: string
    date: string
    routineName?: string
    durationMinutes: number
    totalVolumeKg: number
    exercises: TrainingExerciseData[]
}

function formatDateLabel(dateIso: string): string {
    const date = new Date(dateIso)
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
    })
}

export function formatWorkoutToText(training: TrainingData): string {
    const title = training.routineName || 'Entrenamiento'
    const heading = `💪 ${title} - ${formatDateLabel(training.date)}`

    const lines = training.exercises.map((exercise) => {
        const setsText = exercise.sets.map((set) => `${set.weight}x${set.reps}`).join(', ')
        return `- ${exercise.name}: ${setsText}`
    })

    return [
        heading,
        ...lines,
        '',
        `⏱️ Duración: ${training.durationMinutes} min`,
        `🏋️ Volumen total: ${training.totalVolumeKg.toFixed(0)} kg`,
    ].join('\n')
}

function escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replaceAll('"', '""')}"`
    }
    return value
}

export function formatWorkoutToCSV(training: TrainingData): string {
    const rows: string[] = ['Fecha,Rutina,Ejercicio,Serie,Peso,Repeticiones,DuracionMin,VolumenTotalKg']
    const date = new Date(training.date).toISOString()
    const routine = training.routineName || 'Entrenamiento'

    for (const exercise of training.exercises) {
        exercise.sets.forEach((set, index) => {
            rows.push(
                [
                    date,
                    escapeCsv(routine),
                    escapeCsv(exercise.name),
                    String(index + 1),
                    String(set.weight),
                    String(set.reps),
                    String(training.durationMinutes),
                    String(Number(training.totalVolumeKg.toFixed(2))),
                ].join(','),
            )
        })
    }

    return rows.join('\n')
}