import { defaultExercises } from '../constants/defaultExercises'
import { getExerciseIllustrationUrl } from '../utils/exerciseIllustration'
import { db } from './db'

export async function bootstrapDatabase(): Promise<void> {
  const exerciseCount = await db.getExercisesCount()
  if (exerciseCount > 0) return

  const now = new Date().toISOString()
  await db.bulkAddExercises(
    defaultExercises.map((exercise) => ({
      id: exercise.id,
      nombre: exercise.nombre,
      descripcion: `Ejercicio base para ${exercise.grupoMuscularPrimario}.`,
      grupoMuscularPrimario: exercise.grupoMuscularPrimario,
      gruposMuscularesSecundarios: [],
      nivelDificultad: 'intermedio' as const,
      equipoNecesario: exercise.equipoNecesario,
      imagenUrl: exercise.imagenUrl ?? getExerciseIllustrationUrl(exercise),
      instrucciones: 'Mantén técnica controlada y progresión gradual de carga.',
      esPersonalizado: false,
      createdAt: now,
      updatedAt: now,
    })),
  )
}