import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { db } from '../../lib/db'
import { calculateImc, classifyImc } from '../../utils/calculations'

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
  z.number().min(1).max(500).optional(),
)

const profileSchema = z.object({
  nombre: z.string().max(60).optional().or(z.literal('')),
  pesoCorporal: z.coerce.number().min(1).max(500),
  altura: z.coerce.number().min(80).max(250),
  cintura: optionalNumber,
  pecho: optionalNumber,
  diametroPierna: optionalNumber,
})

type ProfileFormInput = z.input<typeof profileSchema>
type ProfileFormOutput = z.output<typeof profileSchema>

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const form = useForm<ProfileFormInput, undefined, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: '',
      pesoCorporal: 70,
      altura: 170,
    },
  })

  const values = form.watch()
  const pesoCorporal = Number(values.pesoCorporal ?? 0)
  const altura = Number(values.altura ?? 0)
  const imc = calculateImc(pesoCorporal, altura)
  const imcStatus = classifyImc(imc)

  const onSubmit = form.handleSubmit(async (data) => {
    const now = new Date().toISOString()
    const profileId = crypto.randomUUID()
    const calculatedImc = calculateImc(data.pesoCorporal, data.altura)

    await db.userProfile.put({
      id: profileId,
      nombre: data.nombre || undefined,
      pesoCorporal: data.pesoCorporal,
      altura: data.altura,
      cintura: data.cintura,
      pecho: data.pecho,
      diametroPierna: data.diametroPierna,
      imc: calculatedImc,
      createdAt: now,
      updatedAt: now,
    })

    await db.medidasCorporalesHistorico.add({
      id: crypto.randomUUID(),
      pesoCorporal: data.pesoCorporal,
      cintura: data.cintura,
      pecho: data.pecho,
      diametroPierna: data.diametroPierna,
      imc: calculatedImc,
      fechaRegistro: now,
    })
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gym-bgLight p-4 dark:bg-gym-bgDark">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-lg dark:bg-gym-cardDark"
      >
        <h1 className="text-2xl font-bold">Bienvenido a Proyecto Hevy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Configuración inicial offline</p>

        {step === 1 && (
          <>
            <label className="block text-sm font-medium">Nombre (opcional)</label>
            <input
              {...form.register('nombre')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              placeholder="¿Cómo quieres que te llamemos?"
            />

            <label className="block text-sm font-medium">Peso corporal (kg)</label>
            <input
              type="number"
              step="0.1"
              {...form.register('pesoCorporal')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />

            <label className="block text-sm font-medium">Altura (cm)</label>
            <input
              type="number"
              {...form.register('altura')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm font-medium">Cintura (cm, opcional)</label>
            <input
              type="number"
              {...form.register('cintura')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />

            <label className="block text-sm font-medium">Pecho (cm, opcional)</label>
            <input
              type="number"
              {...form.register('pecho')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />

            <label className="block text-sm font-medium">Pierna (cm, opcional)</label>
            <input
              type="number"
              {...form.register('diametroPierna')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </>
        )}

        {step === 3 && (
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold">Tu IMC estimado</h2>
            <p className="text-3xl font-bold">{imc}</p>
            <p className={`text-sm font-medium ${imcStatus.color}`}>{imcStatus.label}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Atrás
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(3, current + 1))}
              className="rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Siguiente
            </button>
          ) : (
            <button type="submit" className="rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white">
              Empezar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}