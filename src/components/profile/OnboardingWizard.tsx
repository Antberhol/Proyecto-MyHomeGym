import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '../design-system/Button'
import { Card } from '../design-system/Card'
import { Input } from '../design-system/Input'
import { profileRepository } from '../../repositories/profileRepository'
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
  const { t } = useTranslation()
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
  const imcStatusKey =
    imcStatus.label === 'Bajo peso'
      ? 'underweight'
      : imcStatus.label === 'Normal'
        ? 'normal'
        : imcStatus.label === 'Sobrepeso'
          ? 'overweight'
          : 'obesity'
  const localizedImcStatus = t(`imcStatus.${imcStatusKey}`, { defaultValue: imcStatus.label })
  const errors = form.formState.errors

  const onSubmit = form.handleSubmit(async (data) => {
    const now = new Date().toISOString()
    const profileId = crypto.randomUUID()
    const calculatedImc = calculateImc(data.pesoCorporal, data.altura)

    await profileRepository.upsertProfile({
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

    await profileRepository.createBodyMeasurement({
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
      <form onSubmit={onSubmit} className="w-full max-w-xl">
        <Card className="space-y-4">
          <h1 className="text-2xl font-bold">{t('onboarding.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{t('onboarding.subtitle')}</p>

          {step === 1 && (
            <>
              <Input
                {...form.register('nombre')}
                label={t('onboarding.nameLabel')}
                placeholder={t('onboarding.namePlaceholder')}
                error={errors.nombre?.message}
              />

              <Input
                type="number"
                step="0.1"
                {...form.register('pesoCorporal')}
                label={t('onboarding.weightLabel')}
                error={errors.pesoCorporal?.message}
              />

              <Input
                type="number"
                {...form.register('altura')}
                label={t('onboarding.heightLabel')}
                error={errors.altura?.message}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                type="number"
                {...form.register('cintura')}
                label={t('onboarding.waistLabel')}
                error={errors.cintura?.message}
              />

              <Input
                type="number"
                {...form.register('pecho')}
                label={t('onboarding.chestLabel')}
                error={errors.pecho?.message}
              />

              <Input
                type="number"
                {...form.register('diametroPierna')}
                label={t('onboarding.legLabel')}
                error={errors.diametroPierna?.message}
              />
            </>
          )}

          {step === 3 && (
            <Card className="rounded-lg p-4">
              <h2 className="text-lg font-semibold">{t('onboarding.estimatedImcTitle')}</h2>
              <p className="text-3xl font-bold">{imc}</p>
              <p className={`text-sm font-medium ${imcStatus.color}`}>{localizedImcStatus}</p>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
            >
              {t('onboarding.back')}
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))}>
                {t('onboarding.next')}
              </Button>
            ) : (
              <Button type="submit">{t('onboarding.start')}</Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  )
}