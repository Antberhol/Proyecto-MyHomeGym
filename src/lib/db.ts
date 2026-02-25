import Dexie, { type Table } from 'dexie'
import type {
  BodyMeasurement,
  Exercise,
  PerformedExercise,
  PersonalRecord,
  RegisteredTraining,
  Routine,
  RoutineExercise,
  UserProfile,
} from '../types/models'

class GymDatabase extends Dexie {
  userProfile!: Table<UserProfile, string>
  ejerciciosCatalogo!: Table<Exercise, string>
  rutinas!: Table<Routine, string>
  rutinaEjercicios!: Table<RoutineExercise, string>
  entrenamientosRegistrados!: Table<RegisteredTraining, string>
  ejerciciosRealizados!: Table<PerformedExercise, string>
  medidasCorporalesHistorico!: Table<BodyMeasurement, string>
  prs!: Table<PersonalRecord, string>

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
  }
}

export const db = new GymDatabase()