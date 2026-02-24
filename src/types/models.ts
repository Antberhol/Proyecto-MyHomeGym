export type DifficultyLevel = 'basico' | 'intermedio' | 'avanzado'
export type DevelopmentLevel = 'basico' | 'medio' | 'avanzado' | 'experto'
export type ThemePreference = 'light' | 'dark' | 'system'

export interface UserProfile {
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

export interface Exercise {
  id: string
  nombre: string
  descripcion: string
  grupoMuscularPrimario: string
  gruposMuscularesSecundarios: string[]
  nivelDificultad: DifficultyLevel
  equipoNecesario: string
  imagenUrl?: string
  instrucciones: string
  esPersonalizado: boolean
  createdAt: string
  updatedAt: string
}

export interface Routine {
  id: string
  nombre: string
  descripcion?: string
  diasSemana: string[]
  activa: boolean
  color: string
  createdAt: string
  updatedAt: string
}

export interface RoutineExercise {
  id: string
  rutinaId: string
  ejercicioId: string
  orden: number
  series: number
  repeticiones: string
  pesoSugerido?: number
  descansoSegundos: number
  notas?: string
}

export interface RegisteredTraining {
  id: string
  rutinaId?: string
  fecha: string
  duracionMinutos: number
  notas?: string
  completado: boolean
  volumenTotal: number
}

export interface PerformedExercise {
  id: string
  entrenamientoId: string
  ejercicioId: string
  serieNumero: number
  repeticionesRealizadas: number
  pesoUtilizado: number
  fecha: string
}

export interface BodyMeasurement {
  id: string
  pesoCorporal: number
  cintura?: number
  pecho?: number
  diametroPierna?: number
  imc: number
  fechaRegistro: string
}

export interface PersonalRecord {
  id: string
  ejercicioId: string
  tipo: 'peso_maximo' | 'volumen_serie' | 'volumen_total' | 'reps_mismo_peso'
  valor: number
  fecha: string
  detalle: string
}