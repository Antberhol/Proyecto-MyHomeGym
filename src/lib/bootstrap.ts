import { seedExercises } from '../constants/exercises'
import { db } from './db'

export async function bootstrapDatabase(): Promise<void> {
  const exerciseCount = await db.ejerciciosCatalogo.count()
  if (exerciseCount > 0) return

  const now = new Date().toISOString()
  await db.ejerciciosCatalogo.bulkAdd(
    seedExercises.map((exercise) => ({
      ...exercise,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    })),
  )
}