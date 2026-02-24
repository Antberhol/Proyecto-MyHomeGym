export function calculateImc(pesoKg: number, alturaCm: number): number {
  const alturaM = alturaCm / 100
  if (alturaM <= 0) return 0
  return Number((pesoKg / (alturaM * alturaM)).toFixed(2))
}

export function classifyImc(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Bajo peso', color: 'text-sky-500' }
  if (imc < 25) return { label: 'Normal', color: 'text-green-500' }
  if (imc < 30) return { label: 'Sobrepeso', color: 'text-amber-500' }
  return { label: 'Obesidad', color: 'text-orange-500' }
}

export function calculateSetVolume(peso: number, reps: number): number {
  return Number((peso * reps).toFixed(2))
}

export function estimateOneRmEpley(peso: number, reps: number): number {
  return Number((peso * (1 + reps / 30)).toFixed(2))
}

export function calculateWorkoutVolume(series: number, reps: number, peso: number): number {
  return Number((Math.max(0, series) * Math.max(0, reps) * Math.max(0, peso)).toFixed(2))
}

export function estimateCaloriesBurned(weightKg: number, minutes: number, met = 6): number {
  const hours = Math.max(0, minutes) / 60
  const calories = Math.max(0, met) * Math.max(0, weightKg) * hours
  return Number(calories.toFixed(2))
}