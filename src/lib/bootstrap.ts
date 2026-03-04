import { defaultExercises } from '../constants/defaultExercises'
import {
  getExerciseDbAliasesForName,
  getExerciseDbQueryCandidates,
  getPreferredExerciseDbName,
  normalizeExerciseName,
} from '../constants/exerciseDbAliases'
import { db } from './db'

const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'

function buildExerciseDbRequestInit(apiKey: string): RequestInit {
  return {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': EXERCISE_DB_RAPIDAPI_HOST,
    },
  }
}

interface ExerciseDbLookupItem {
  id?: string
  name?: string
}

interface ExerciseDbBackfillResult {
  scanned: number
  updated: number
}

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

function selectBestExerciseDbMatch(items: ExerciseDbLookupItem[], rawCandidate: string) {
  if (items.length === 0) {
    return null
  }

  const normalizedCandidate = normalizeExerciseName(rawCandidate)
  const exact = items.find((item) => normalizeExerciseName(item.name ?? '') === normalizedCandidate)
  if (exact?.id) {
    return exact
  }

  const partial = items.find((item) => {
    const normalizedName = normalizeExerciseName(item.name ?? '')
    return normalizedName.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedName)
  })

  if (partial?.id) {
    return partial
  }

  return items.find((item) => Boolean(item.id)) ?? null
}

async function resolveExerciseDbMatchByCandidates(
  candidates: string[],
  apiKey: string,
): Promise<ExerciseDbLookupItem | null> {
  for (const candidate of candidates) {
    const response = await fetch(
      `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(candidate)}`,
      buildExerciseDbRequestInit(apiKey),
    )

    if (!response.ok) {
      continue
    }

    const payload = (await response.json()) as ExerciseDbLookupItem[]
    if (!Array.isArray(payload) || payload.length === 0) {
      continue
    }

    const best = selectBestExerciseDbMatch(payload, candidate)
    if (best?.id) {
      return best
    }
  }

  return null
}

async function backfillExerciseDbIds(apiKey: string): Promise<ExerciseDbBackfillResult> {
  const existing = await db.getAllExercisesCatalog()
  let scanned = 0
  let updated = 0

  for (const exercise of existing) {
    if (exercise.exerciseDbId?.trim()) {
      continue
    }

    scanned += 1

    const candidates = [
      ...(exercise.exerciseDbName ? [exercise.exerciseDbName] : []),
      ...(exercise.exerciseDbAliases ?? []),
      ...getExerciseDbQueryCandidates(exercise.nombre),
    ]

    const uniqueCandidates = Array.from(new Set(candidates.map((value) => normalizeExerciseName(value)).filter(Boolean)))
    if (uniqueCandidates.length === 0) {
      continue
    }

    try {
      const resolved = await resolveExerciseDbMatchByCandidates(uniqueCandidates, apiKey)
      if (!resolved?.id) {
        continue
      }

      await db.updateExercise(exercise.id, {
        exerciseDbId: resolved.id,
        exerciseDbName: exercise.exerciseDbName ?? resolved.name,
        updatedAt: new Date().toISOString(),
      })
      updated += 1
    } catch {
      continue
    }
  }

  return { scanned, updated }
}

export async function resyncExerciseGifMappings() {
  const exerciseDbApiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
  if (!exerciseDbApiKey) {
    return {
      skipped: true,
      reason: 'missing_api_key' as const,
      scanned: 0,
      updated: 0,
    }
  }

  const result = await backfillExerciseDbIds(exerciseDbApiKey)
  return {
    skipped: false,
    reason: 'ok' as const,
    ...result,
  }
}

export async function bootstrapDatabase(): Promise<void> {
  const exerciseCount = await db.getExercisesCount()
  const now = new Date().toISOString()
  const exerciseDbApiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
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

    if (exerciseDbApiKey) {
      await backfillExerciseDbIds(exerciseDbApiKey)
    }

    return
  }

  await db.bulkAddExercises(
    defaultExercises.map((exercise) => buildDefaultExerciseRecord(exercise, now)),
  )

  if (exerciseDbApiKey) {
    await backfillExerciseDbIds(exerciseDbApiKey)
  }
}