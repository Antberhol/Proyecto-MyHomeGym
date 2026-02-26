import { defaultExercises } from '../constants/defaultExercises'
import {
  getExerciseDbAliasesForName,
  getExerciseDbQueryCandidates,
  getPreferredExerciseDbName,
} from '../constants/exerciseDbAliases'
import { db } from './db'

export async function bootstrapDatabase(): Promise<void> {
  const exerciseCount = await db.getExercisesCount()
  const now = new Date().toISOString()

  if (exerciseCount > 0) {
    const existing = await db.getAllExercisesCatalog()

    await Promise.all(
      existing.map(async (exercise) => {
        const preferredName = getPreferredExerciseDbName(exercise.nombre) ?? getExerciseDbQueryCandidates(exercise.nombre)[0]
        const aliases = getExerciseDbAliasesForName(exercise.nombre)

        const nextName = exercise.exerciseDbName ?? preferredName
        const nextAliases =
          exercise.exerciseDbAliases && exercise.exerciseDbAliases.length > 0
            ? exercise.exerciseDbAliases
            : aliases

        if (!nextName && nextAliases.length === 0) {
          return
        }

        const hasNameChange = Boolean(nextName && nextName !== exercise.exerciseDbName)
        const hasAliasesChange =
          nextAliases.length > 0 &&
          JSON.stringify(nextAliases) !== JSON.stringify(exercise.exerciseDbAliases ?? [])

        if (!hasNameChange && !hasAliasesChange) {
          return
        }

        await db.updateExercise(exercise.id, {
          exerciseDbName: nextName,
          exerciseDbAliases: nextAliases.length > 0 ? nextAliases : undefined,
          updatedAt: new Date().toISOString(),
        })
      }),
    )

    return
  }

  await db.bulkAddExercises(
    defaultExercises.map((exercise) => ({
      ...(() => {
        const preferredName = getPreferredExerciseDbName(exercise.nombre) ?? getExerciseDbQueryCandidates(exercise.nombre)[0]
        const aliases = getExerciseDbAliasesForName(exercise.nombre)
        return {
          exerciseDbName: preferredName,
          exerciseDbAliases: aliases.length > 0 ? aliases : undefined,
        }
      })(),
      id: exercise.id,
      nombre: exercise.nombre,
      descripcion: `Ejercicio base para ${exercise.grupoMuscularPrimario}.`,
      grupoMuscularPrimario: exercise.grupoMuscularPrimario,
      gruposMuscularesSecundarios: [],
      nivelDificultad: 'intermedio' as const,
      equipoNecesario: exercise.equipoNecesario,
      imagenUrl: exercise.imagenUrl,
      instrucciones: 'Mantén técnica controlada y progresión gradual de carga.',
      esPersonalizado: false,
      createdAt: now,
      updatedAt: now,
    })),
  )
}