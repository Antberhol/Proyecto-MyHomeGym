import Dexie, { type Table } from 'dexie'
import type {
  BodyMeasurement,
  Exercise,
  PerformedExercise,
  PersonalRecord,
  RegisteredTraining,
  Routine,
  RoutineExercise,
  SyncEntityType,
  SyncQueueItem,
  UserProfile,
} from '../types/models'

class GymDatabase extends Dexie {
  private userProfile!: Table<UserProfile, string>
  private ejerciciosCatalogo!: Table<Exercise, string>
  private rutinas!: Table<Routine, string>
  private rutinaEjercicios!: Table<RoutineExercise, string>
  private entrenamientosRegistrados!: Table<RegisteredTraining, string>
  private ejerciciosRealizados!: Table<PerformedExercise, string>
  private medidasCorporalesHistorico!: Table<BodyMeasurement, string>
  private prs!: Table<PersonalRecord, string>
  private pendingSyncQueue!: Table<SyncQueueItem, string>

  constructor() {
    super('gym_offline_db')
    this.version(1).stores({
      userProfile: 'id, nombre, updatedAt',
      ejerciciosCatalogo: 'id, nombre, grupoMuscularPrimario, nivelDificultad, equipoNecesario, esPersonalizado, updatedAt',
      rutinas: 'id, nombre, activa, updatedAt',
      rutinaEjercicios: 'id, rutinaId, ejercicioId, orden',
      entrenamientosRegistrados: 'id, rutinaId, fecha, completado',
      ejerciciosRealizados: 'id, entrenamientoId, ejercicioId, fecha, [ejercicioId+fecha]',
      medidasCorporalesHistorico: 'id, fechaRegistro',
      prs: 'id, ejercicioId, tipo, fecha',
    })

    this.version(2).stores({
      userProfile: 'id, nombre, updatedAt',
      ejerciciosCatalogo: 'id, nombre, grupoMuscularPrimario, nivelDificultad, equipoNecesario, esPersonalizado, updatedAt',
      rutinas: 'id, nombre, activa, updatedAt',
      rutinaEjercicios: 'id, rutinaId, ejercicioId, orden, rpe',
      entrenamientosRegistrados: 'id, rutinaId, fecha, completado',
      ejerciciosRealizados: 'id, entrenamientoId, ejercicioId, fecha, rpe, [ejercicioId+fecha]',
      medidasCorporalesHistorico: 'id, fechaRegistro',
      prs: 'id, ejercicioId, tipo, fecha',
    })

    this.version(3).stores({
      userProfile: 'id, nombre, updatedAt',
      ejerciciosCatalogo: 'id, nombre, grupoMuscularPrimario, nivelDificultad, equipoNecesario, esPersonalizado, updatedAt',
      rutinas: 'id, nombre, activa, updatedAt',
      rutinaEjercicios: 'id, rutinaId, ejercicioId, orden, rpe',
      entrenamientosRegistrados: 'id, rutinaId, fecha, completado',
      ejerciciosRealizados: 'id, entrenamientoId, ejercicioId, fecha, rpe, [ejercicioId+fecha]',
      medidasCorporalesHistorico: 'id, fechaRegistro',
      prs: 'id, ejercicioId, tipo, fecha',
    })

    this.version(4).stores({
      userProfile: 'id, nombre, updatedAt, isSynced, ownerUid',
      ejerciciosCatalogo: 'id, nombre, grupoMuscularPrimario, nivelDificultad, equipoNecesario, esPersonalizado, updatedAt, isSynced, ownerUid',
      rutinas: 'id, nombre, activa, updatedAt, isSynced, ownerUid',
      rutinaEjercicios: 'id, rutinaId, ejercicioId, orden, rpe, updatedAt, isSynced, ownerUid',
      entrenamientosRegistrados: 'id, rutinaId, fecha, completado, updatedAt, isSynced, ownerUid',
      ejerciciosRealizados: 'id, entrenamientoId, ejercicioId, fecha, rpe, updatedAt, isSynced, ownerUid, [ejercicioId+fecha]',
      medidasCorporalesHistorico: 'id, fechaRegistro, updatedAt, isSynced, ownerUid',
      prs: 'id, ejercicioId, tipo, fecha, updatedAt, isSynced, ownerUid',
      pendingSyncQueue: 'id, entityType, entityId, status, createdAt',
    })
  }

  getAllRoutines() {
    return this.rutinas.toArray()
  }

  addRoutine(routine: Routine) {
    return this.rutinas.add({
      ...routine,
      updatedAt: routine.updatedAt ?? new Date().toISOString(),
      isSynced: routine.isSynced ?? false,
    })
  }

  updateRoutine(routineId: string, changes: Partial<Routine>) {
    return this.rutinas.update(routineId, changes)
  }

  deleteRoutine(routineId: string) {
    return this.rutinas.delete(routineId)
  }

  bulkAddRoutines(items: Routine[]) {
    return this.rutinas.bulkAdd(items)
  }

  clearRoutines() {
    return this.rutinas.clear()
  }

  getAllRoutineExercises() {
    return this.rutinaEjercicios.toArray()
  }

  getRoutineExercisesByRoutineId(routineId: string) {
    return this.rutinaEjercicios.where('rutinaId').equals(routineId).toArray()
  }

  bulkAddRoutineExercises(items: RoutineExercise[]) {
    return this.rutinaEjercicios.bulkAdd(items)
  }

  updateRoutineExercise(routineExerciseId: string, changes: Partial<RoutineExercise>) {
    return this.rutinaEjercicios.update(routineExerciseId, changes)
  }

  deleteRoutineExercise(routineExerciseId: string) {
    return this.rutinaEjercicios.delete(routineExerciseId)
  }

  clearRoutineExercises() {
    return this.rutinaEjercicios.clear()
  }

  async deleteRoutineAndLinkedExercises(routineId: string) {
    await this.transaction('rw', this.rutinas, this.rutinaEjercicios, async () => {
      await this.rutinas.delete(routineId)
      const linkedExercises = await this.rutinaEjercicios.where('rutinaId').equals(routineId).toArray()
      await Promise.all(linkedExercises.map((item) => this.rutinaEjercicios.delete(item.id)))
    })
  }

  async swapRoutineExerciseOrders(
    currentId: string,
    currentOrder: number,
    targetId: string,
    targetOrder: number,
  ) {
    await this.transaction('rw', this.rutinaEjercicios, async () => {
      await this.rutinaEjercicios.update(currentId, { orden: targetOrder })
      await this.rutinaEjercicios.update(targetId, { orden: currentOrder })
    })
  }

  async reorderRoutineExercises(items: Array<{ id: string; orden: number }>) {
    await this.transaction('rw', this.rutinaEjercicios, async () => {
      await Promise.all(items.map((item) => this.rutinaEjercicios.update(item.id, { orden: item.orden })))
    })
  }

  getAllExercisesCatalog() {
    return this.ejerciciosCatalogo.toArray()
  }

  getExerciseById(exerciseId: string) {
    return this.ejerciciosCatalogo.get(exerciseId)
  }

  getExercisesCount() {
    return this.ejerciciosCatalogo.count()
  }

  addExercise(exercise: Exercise) {
    return this.ejerciciosCatalogo.add({
      ...exercise,
      updatedAt: exercise.updatedAt ?? new Date().toISOString(),
      isSynced: exercise.isSynced ?? false,
    })
  }

  updateExercise(exerciseId: string, changes: Partial<Exercise>) {
    return this.ejerciciosCatalogo.update(exerciseId, changes)
  }

  deleteExercise(exerciseId: string) {
    return this.ejerciciosCatalogo.delete(exerciseId)
  }

  bulkAddExercises(items: Exercise[]) {
    return this.ejerciciosCatalogo.bulkAdd(items)
  }

  clearExercises() {
    return this.ejerciciosCatalogo.clear()
  }

  getAllPerformedExercises() {
    return this.ejerciciosRealizados.toArray()
  }

  getPerformedExercisesSince(sinceIso: string) {
    return this.ejerciciosRealizados.where('fecha').aboveOrEqual(sinceIso).toArray()
  }

  bulkAddPerformedExercises(items: PerformedExercise[]) {
    return this.ejerciciosRealizados.bulkAdd(items)
  }

  clearPerformedExercises() {
    return this.ejerciciosRealizados.clear()
  }

  getAllTrainings() {
    return this.entrenamientosRegistrados.toArray()
  }

  getTrainingsBeforeOrEqual(maxDateIso: string) {
    return this.entrenamientosRegistrados.where('fecha').belowOrEqual(maxDateIso).toArray()
  }

  bulkAddTrainings(items: RegisteredTraining[]) {
    return this.entrenamientosRegistrados.bulkAdd(items)
  }

  clearTrainings() {
    return this.entrenamientosRegistrados.clear()
  }

  getFirstUserProfile() {
    return this.userProfile.toCollection().first()
  }

  getAllUserProfiles() {
    return this.userProfile.toArray()
  }

  putUserProfile(profile: UserProfile) {
    return this.userProfile.put(profile)
  }

  clearUserProfiles() {
    return this.userProfile.clear()
  }

  bulkAddUserProfiles(items: UserProfile[]) {
    return this.userProfile.bulkAdd(items)
  }

  addBodyMeasurement(measurement: BodyMeasurement) {
    return this.medidasCorporalesHistorico.add({
      ...measurement,
      updatedAt: measurement.updatedAt ?? measurement.fechaRegistro,
      isSynced: measurement.isSynced ?? false,
    })
  }

  getAllBodyMeasurements() {
    return this.medidasCorporalesHistorico.toArray()
  }

  deleteBodyMeasurement(measurementId: string) {
    return this.medidasCorporalesHistorico.delete(measurementId)
  }

  clearBodyMeasurements() {
    return this.medidasCorporalesHistorico.clear()
  }

  bulkAddBodyMeasurements(items: BodyMeasurement[]) {
    return this.medidasCorporalesHistorico.bulkAdd(items)
  }

  getAllPersonalRecords() {
    return this.prs.toArray()
  }

  getPersonalRecordsByExercise(exerciseId: string) {
    return this.prs.where('ejercicioId').equals(exerciseId).toArray()
  }

  addPersonalRecord(record: PersonalRecord) {
    return this.prs.add({
      ...record,
      updatedAt: record.updatedAt ?? record.fecha,
      isSynced: record.isSynced ?? false,
    })
  }

  enqueueSyncOperation(input: {
    entityType: SyncEntityType
    entityId: string
    payload: string
  }) {
    const now = new Date().toISOString()

    return this.pendingSyncQueue.put({
      id: crypto.randomUUID(),
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload,
      createdAt: now,
      status: 'pending',
      retryCount: 0,
    })
  }

  getPendingSyncOperations() {
    return this.pendingSyncQueue.where('status').equals('pending').sortBy('createdAt')
  }

  async markSyncOperationDone(id: string) {
    await this.pendingSyncQueue.delete(id)
  }

  async markSyncOperationFailed(id: string, errorMessage: string) {
    const item = await this.pendingSyncQueue.get(id)
    if (!item) return

    await this.pendingSyncQueue.put({
      ...item,
      status: 'pending',
      retryCount: item.retryCount + 1,
      lastError: errorMessage,
    })
  }

  async updateTrainingSyncState(trainingId: string, isSynced: boolean, syncedAtIso: string) {
    await this.entrenamientosRegistrados.update(trainingId, {
      isSynced,
      lastSyncedAt: syncedAtIso,
    })

    const linkedSets = await this.ejerciciosRealizados.where('entrenamientoId').equals(trainingId).toArray()
    await Promise.all(
      linkedSets.map((item) =>
        this.ejerciciosRealizados.update(item.id, {
          isSynced,
          lastSyncedAt: syncedAtIso,
        }),
      ),
    )
  }

  clearPersonalRecords() {
    return this.prs.clear()
  }

  bulkAddPersonalRecords(items: PersonalRecord[]) {
    return this.prs.bulkAdd(items)
  }

  async clearAllData() {
    await this.transaction(
      'rw',
      [
        this.userProfile,
        this.ejerciciosCatalogo,
        this.rutinas,
        this.rutinaEjercicios,
        this.entrenamientosRegistrados,
        this.ejerciciosRealizados,
        this.medidasCorporalesHistorico,
        this.prs,
        this.pendingSyncQueue,
      ],
      async () => {
        await Promise.all([
          this.userProfile.clear(),
          this.ejerciciosCatalogo.clear(),
          this.rutinas.clear(),
          this.rutinaEjercicios.clear(),
          this.entrenamientosRegistrados.clear(),
          this.ejerciciosRealizados.clear(),
          this.medidasCorporalesHistorico.clear(),
          this.prs.clear(),
          this.pendingSyncQueue.clear(),
        ])
      },
    )
  }

  async replaceAllData(payload: {
    userProfile: UserProfile[]
    ejerciciosCatalogo: Exercise[]
    rutinas: Routine[]
    rutinaEjercicios: RoutineExercise[]
    entrenamientosRegistrados: RegisteredTraining[]
    ejerciciosRealizados: PerformedExercise[]
    medidasCorporalesHistorico: BodyMeasurement[]
    prs: PersonalRecord[]
  }) {
    await this.transaction(
      'rw',
      [
        this.userProfile,
        this.ejerciciosCatalogo,
        this.rutinas,
        this.rutinaEjercicios,
        this.entrenamientosRegistrados,
        this.ejerciciosRealizados,
        this.medidasCorporalesHistorico,
        this.prs,
        this.pendingSyncQueue,
      ],
      async () => {
        await Promise.all([
          this.userProfile.clear(),
          this.ejerciciosCatalogo.clear(),
          this.rutinas.clear(),
          this.rutinaEjercicios.clear(),
          this.entrenamientosRegistrados.clear(),
          this.ejerciciosRealizados.clear(),
          this.medidasCorporalesHistorico.clear(),
          this.prs.clear(),
          this.pendingSyncQueue.clear(),
        ])

        if (payload.userProfile.length > 0) await this.userProfile.bulkAdd(payload.userProfile)
        if (payload.ejerciciosCatalogo.length > 0) await this.ejerciciosCatalogo.bulkAdd(payload.ejerciciosCatalogo)
        if (payload.rutinas.length > 0) await this.rutinas.bulkAdd(payload.rutinas)
        if (payload.rutinaEjercicios.length > 0) await this.rutinaEjercicios.bulkAdd(payload.rutinaEjercicios)
        if (payload.entrenamientosRegistrados.length > 0) await this.entrenamientosRegistrados.bulkAdd(payload.entrenamientosRegistrados)
        if (payload.ejerciciosRealizados.length > 0) await this.ejerciciosRealizados.bulkAdd(payload.ejerciciosRealizados)
        if (payload.medidasCorporalesHistorico.length > 0) await this.medidasCorporalesHistorico.bulkAdd(payload.medidasCorporalesHistorico)
        if (payload.prs.length > 0) await this.prs.bulkAdd(payload.prs)
      },
    )
  }

  async exportAllData() {
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
      this.userProfile.toArray(),
      this.ejerciciosCatalogo.toArray(),
      this.rutinas.toArray(),
      this.rutinaEjercicios.toArray(),
      this.entrenamientosRegistrados.toArray(),
      this.ejerciciosRealizados.toArray(),
      this.medidasCorporalesHistorico.toArray(),
      this.prs.toArray(),
    ])

    return {
      userProfile,
      ejerciciosCatalogo,
      rutinas,
      rutinaEjercicios,
      entrenamientosRegistrados,
      ejerciciosRealizados,
      medidasCorporalesHistorico,
      prs,
    }
  }

  async saveCompletedTraining(training: RegisteredTraining, performed: PerformedExercise[]) {
    const now = new Date().toISOString()
    const normalizedTraining: RegisteredTraining = {
      ...training,
      updatedAt: training.updatedAt ?? now,
      isSynced: false,
    }
    const normalizedPerformed = performed.map((item) => ({
      ...item,
      updatedAt: item.updatedAt ?? now,
      isSynced: false,
    }))

    await this.transaction('rw', this.entrenamientosRegistrados, this.ejerciciosRealizados, async () => {
      await this.entrenamientosRegistrados.add(normalizedTraining)
      if (normalizedPerformed.length > 0) {
        await this.ejerciciosRealizados.bulkAdd(normalizedPerformed)
      }
    })
  }
}

export const db = new GymDatabase()