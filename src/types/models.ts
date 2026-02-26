export type DifficultyLevel = 'basico' | 'intermedio' | 'avanzado'
export type DevelopmentLevel = 'basico' | 'medio' | 'avanzado' | 'experto'
export type ThemePreference = 'light' | 'dark' | 'system'

export type SyncEntityType = 'training'
export type SyncQueueStatus = 'pending' | 'failed'

export interface SyncMetadata {
  updatedAt?: string
  isSynced?: boolean
  lastSyncedAt?: string
  ownerUid?: string
}

export interface SyncQueueItem {
  id: string
  entityType: SyncEntityType
  entityId: string
  payload: string
  createdAt: string
  status: SyncQueueStatus
  retryCount: number
  lastError?: string
}

export interface UserProfile extends SyncMetadata {
  id: string
  nombre?: string
  pesoCorporal: number
  altura: number
  cintura?: number
  pecho?: number
  diametroPierna?: number
  imc: number
  createdAt: string
  updatedAt: string
}

export interface Exercise extends SyncMetadata {
  id: string
  nombre: string
  descripcion: string
  grupoMuscularPrimario: string
  gruposMuscularesSecundarios: string[]
  nivelDificultad: DifficultyLevel
  equipoNecesario: string
  imagenUrl?: string
  exerciseDbId?: string
  exerciseDbName?: string
  exerciseDbAliases?: string[]
  instrucciones: string
  esPersonalizado: boolean
  createdAt: string
  updatedAt: string
}

export interface Routine extends SyncMetadata {
  id: string
  nombre: string
  descripcion?: string
  diasSemana: string[]
  activa: boolean
  color: string
  createdAt: string
  updatedAt: string
}

export interface RoutineExercise extends SyncMetadata {
  id: string
  rutinaId: string
  ejercicioId: string
  orden: number
  series: number
  repeticiones: string
  pesoSugerido?: number
  descansoSegundos: number
  rpe?: number
  notas?: string
}

export interface RegisteredTraining extends SyncMetadata {
  id: string
  rutinaId?: string
  fecha: string
  duracionMinutos: number
  notas?: string
  completado: boolean
  volumenTotal: number
}

export interface PerformedExercise extends SyncMetadata {
  id: string
  entrenamientoId: string
  ejercicioId: string
  serieNumero: number
  repeticionesRealizadas: number
  pesoUtilizado: number
  rpe?: number
  fecha: string
}

export interface BodyMeasurement extends SyncMetadata {
  id: string
  pesoCorporal: number
  cintura?: number
  pecho?: number
  diametroPierna?: number
  imc: number
  fechaRegistro: string
}

export interface PersonalRecord extends SyncMetadata {
  id: string
  ejercicioId: string
  tipo: 'peso_maximo' | 'volumen_serie' | 'volumen_total' | 'reps_mismo_peso'
  valor: number
  fecha: string
  detalle: string
}