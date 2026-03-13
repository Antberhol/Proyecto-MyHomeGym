import { defaultExercises } from '../constants/defaultExercises'
import {
  getExerciseDbAliasesForName,
  getExerciseDbQueryCandidates,
  getPreferredExerciseDbName,
} from '../constants/exerciseDbAliases'
import { db } from './db'

function buildDefaultExerciseRecord(
  exercise: (typeof defaultExercises)[number],
  now: string,
) {
  const aliasCandidates = getExerciseDbAliasesForName(exercise.nombre)
  const mergedAliases = Array.from(
    new Set([...(exercise.exerciseDbAliases ?? []), ...aliasCandidates]),
  )
  const preferredName =
    exercise.exerciseDbName ??
    getPreferredExerciseDbName(exercise.nombre) ??
    getExerciseDbQueryCandidates(exercise.nombre)[0] ??
    mergedAliases[0]

  return {
    id: exercise.id,
    nombre: exercise.nombre,
    descripcion: exercise.descripcion ?? `Ejercicio base para ${exercise.grupoMuscularPrimario}.`,
    grupoMuscularPrimario: exercise.grupoMuscularPrimario,
    gruposMuscularesSecundarios: exercise.gruposMuscularesSecundarios ?? [],
    nivelDificultad: exercise.nivelDificultad ?? ('intermedio' as const),
    equipoNecesario: exercise.equipoNecesario,
    imagenUrl: exercise.imagenUrl,
    exerciseDbId: exercise.exerciseDbId,
    exerciseDbName: preferredName,
    exerciseDbAliases: mergedAliases.length > 0 ? mergedAliases : undefined,
    instrucciones:
      exercise.instrucciones ?? 'Mantén técnica controlada y progresión gradual de carga.',
    esPersonalizado: false,
    createdAt: now,
    updatedAt: now,
  }
}

async function insertMissingDefaultExercises(now: string) {
  const existing = await db.getAllExercisesCatalog()
  const existingIds = new Set(existing.map((exercise) => exercise.id))
  const missingDefaults = defaultExercises
    .filter((exercise) => !existingIds.has(exercise.id))
    .map((exercise) => buildDefaultExerciseRecord(exercise, now))

  if (missingDefaults.length > 0) {
    await db.bulkAddExercises(missingDefaults)
  }
}

export async function resyncExerciseGifMappings() {
  return {
    skipped: false,
    reason: 'ok' as const,
    scanned: 0,
    updated: 0,
  }
}

export async function bootstrapDatabase(): Promise<void> {
  const exerciseCount = await db.getExercisesCount()
  const now = new Date().toISOString()
  const defaultExerciseById = new Map(defaultExercises.map((exercise) => [exercise.id, exercise]))

  if (exerciseCount > 0) {
    const existing = await db.getAllExercisesCatalog()

    await Promise.all(
      existing.map(async (exercise) => {
        const defaultSeed = defaultExerciseById.get(exercise.id)
        const preferredName =
          defaultSeed?.exerciseDbName ??
          getPreferredExerciseDbName(exercise.nombre) ??
          getExerciseDbQueryCandidates(exercise.nombre)[0]
        const aliases = Array.from(
          new Set([
            ...(defaultSeed?.exerciseDbAliases ?? []),
            ...getExerciseDbAliasesForName(exercise.nombre),
          ]),
        )

        const nextName = exercise.exerciseDbName ?? preferredName
        const nextExerciseDbId = exercise.exerciseDbId ?? defaultSeed?.exerciseDbId
        const nextAliases =
          exercise.exerciseDbAliases && exercise.exerciseDbAliases.length > 0
            ? exercise.exerciseDbAliases
            : aliases
        const nextDisplayName =
          defaultSeed && !exercise.esPersonalizado ? defaultSeed.nombre : exercise.nombre
        const nextDescription =
          defaultSeed && !exercise.esPersonalizado
            ? defaultSeed.descripcion ?? exercise.descripcion
            : exercise.descripcion
        const nextPrimaryMuscle =
          defaultSeed && !exercise.esPersonalizado
            ? defaultSeed.grupoMuscularPrimario
            : exercise.grupoMuscularPrimario
        const nextSecondaryMuscles =
          defaultSeed && !exercise.esPersonalizado
            ? defaultSeed.gruposMuscularesSecundarios ?? []
            : exercise.gruposMuscularesSecundarios
        const nextDifficulty =
          defaultSeed && !exercise.esPersonalizado
            ? defaultSeed.nivelDificultad ?? exercise.nivelDificultad
            : exercise.nivelDificultad
        const nextEquipment =
          defaultSeed && !exercise.esPersonalizado ? defaultSeed.equipoNecesario : exercise.equipoNecesario
        const nextImageUrl =
          exercise.imagenUrl ?? (defaultSeed && !exercise.esPersonalizado ? defaultSeed.imagenUrl : undefined)
        const nextInstructions =
          !exercise.instrucciones?.trim() && defaultSeed?.instrucciones
            ? defaultSeed.instrucciones
            : exercise.instrucciones

        if (!nextName && nextAliases.length === 0 && !nextExerciseDbId && !nextImageUrl) {
          return
        }

        const hasNameChange = Boolean(nextName && nextName !== exercise.exerciseDbName)
        const hasExerciseDbIdChange = Boolean(nextExerciseDbId && nextExerciseDbId !== exercise.exerciseDbId)
        const hasAliasesChange =
          nextAliases.length > 0 &&
          JSON.stringify(nextAliases) !== JSON.stringify(exercise.exerciseDbAliases ?? [])
        const hasDisplayNameChange = nextDisplayName !== exercise.nombre
        const hasDescriptionChange = nextDescription !== exercise.descripcion
        const hasPrimaryMuscleChange = nextPrimaryMuscle !== exercise.grupoMuscularPrimario
        const hasSecondaryMusclesChange =
          JSON.stringify(nextSecondaryMuscles) !== JSON.stringify(exercise.gruposMuscularesSecundarios)
        const hasDifficultyChange = nextDifficulty !== exercise.nivelDificultad
        const hasEquipmentChange = nextEquipment !== exercise.equipoNecesario
        const hasImageUrlChange = Boolean(nextImageUrl && nextImageUrl !== exercise.imagenUrl)
        const hasInstructionsChange = nextInstructions !== exercise.instrucciones

        if (
          !hasNameChange &&
          !hasExerciseDbIdChange &&
          !hasAliasesChange &&
          !hasDisplayNameChange &&
          !hasDescriptionChange &&
          !hasPrimaryMuscleChange &&
          !hasSecondaryMusclesChange &&
          !hasDifficultyChange &&
          !hasEquipmentChange &&
          !hasImageUrlChange &&
          !hasInstructionsChange
        ) {
          return
        }

        await db.updateExercise(exercise.id, {
          nombre: nextDisplayName,
          descripcion: nextDescription,
          grupoMuscularPrimario: nextPrimaryMuscle,
          gruposMuscularesSecundarios: nextSecondaryMuscles,
          nivelDificultad: nextDifficulty,
          equipoNecesario: nextEquipment,
          exerciseDbId: nextExerciseDbId,
          exerciseDbName: nextName,
          exerciseDbAliases: nextAliases.length > 0 ? nextAliases : undefined,
          imagenUrl: nextImageUrl,
          instrucciones: nextInstructions,
          updatedAt: new Date().toISOString(),
        })
      }),
    )

    await insertMissingDefaultExercises(now)

    return
  }

  await db.bulkAddExercises(
    defaultExercises.map((exercise) => buildDefaultExerciseRecord(exercise, now)),
  )
}