import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buildBackupPayload, downloadBackup, importBackupFile } from '../lib/backup'
import { db } from '../lib/db'
import { profileRepository } from '../repositories/profileRepository'
import { progressRepository } from '../repositories/progressRepository'
import { useUiStore } from '../stores/ui-store'
import { classifyImc } from '../utils/calculations'

type StatusState = {
    type: 'success' | 'error'
    message: string
} | null

function calculateImcFromMetrics(pesoCorporal: number, alturaCm: number): number {
    const alturaMetros = alturaCm / 100
    if (!Number.isFinite(pesoCorporal) || !Number.isFinite(alturaMetros) || alturaMetros <= 0) {
        return 0
    }

    return pesoCorporal / (alturaMetros * alturaMetros)
}

function parseOptionalNumber(value: string): number | undefined | null {
    const normalized = value.trim()
    if (!normalized) {
        return undefined
    }

    const parsed = Number(normalized)
    if (!Number.isFinite(parsed)) {
        return null
    }

    return parsed
}

export function PerfilPage() {
    const { t } = useTranslation()
    const profile = useLiveQuery(() => profileRepository.getProfile(), [])
    const measurements = useLiveQuery(() => progressRepository.listBodyMeasurements(), []) ?? []
    const theme = useUiStore((state) => state.theme)
    const setTheme = useUiStore((state) => state.setTheme)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [backupStatus, setBackupStatus] = useState('')
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [editNombre, setEditNombre] = useState('')
    const [editPesoCorporal, setEditPesoCorporal] = useState('')
    const [editAltura, setEditAltura] = useState('')
    const [profileStatus, setProfileStatus] = useState<StatusState>(null)
    const [measurementPesoCorporal, setMeasurementPesoCorporal] = useState('')
    const [measurementCintura, setMeasurementCintura] = useState('')
    const [measurementPecho, setMeasurementPecho] = useState('')
    const [measurementDiametroPierna, setMeasurementDiametroPierna] = useState('')
    const [measurementStatus, setMeasurementStatus] = useState<StatusState>(null)

    const handleExport = async () => {
        const payload = await buildBackupPayload()
        downloadBackup(payload)
        setBackupStatus(t('profile.backupExportedAt', { date: new Date(payload.exportedAt).toLocaleString() }))
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            await importBackupFile(file)
            setBackupStatus(t('profile.backupImported'))
            window.setTimeout(() => {
                window.location.reload()
            }, 500)
        } catch (error) {
            setBackupStatus(error instanceof Error ? error.message : t('profile.backupImportError'))
        } finally {
            event.target.value = ''
        }
    }

    const sortedMeasurements = useMemo(
        () =>
            measurements
                .slice()
                .sort((a, b) => +new Date(b.fechaRegistro) - +new Date(a.fechaRegistro)),
        [measurements],
    )

    const toggleEditProfile = () => {
        if (!profile) {
            return
        }

        if (isEditingProfile) {
            setIsEditingProfile(false)
            return
        }

        setEditNombre(profile.nombre ?? '')
        setEditPesoCorporal(String(profile.pesoCorporal))
        setEditAltura(String(profile.altura))
        setProfileStatus(null)
        setIsEditingProfile(true)
    }

    const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const pesoCorporal = Number(editPesoCorporal)
        const altura = Number(editAltura)
        if (!Number.isFinite(pesoCorporal) || pesoCorporal <= 0 || !Number.isFinite(altura) || altura <= 0) {
            setProfileStatus({
                type: 'error',
                message: t('measurements.profile.invalidData'),
            })
            return
        }

        try {
            await profileRepository.updateProfile({
                nombre: editNombre,
                pesoCorporal,
                altura,
            })

            setProfileStatus({
                type: 'success',
                message: t('measurements.profile.savedSuccessfully'),
            })
            setIsEditingProfile(false)
        } catch {
            setProfileStatus({
                type: 'error',
                message: t('measurements.profile.saveFailed'),
            })
        }
    }

    const handleRegisterMeasurement = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!profile) {
            return
        }

        const pesoCorporal = Number(measurementPesoCorporal)
        if (!Number.isFinite(pesoCorporal) || pesoCorporal <= 0) {
            setMeasurementStatus({
                type: 'error',
                message: t('measurements.form.invalidWeight'),
            })
            return
        }

        const cintura = parseOptionalNumber(measurementCintura)
        const pecho = parseOptionalNumber(measurementPecho)
        const diametroPierna = parseOptionalNumber(measurementDiametroPierna)
        if (cintura === null || pecho === null || diametroPierna === null) {
            setMeasurementStatus({
                type: 'error',
                message: t('measurements.form.invalidOptionalValues'),
            })
            return
        }

        try {
            const calculatedImc = calculateImcFromMetrics(pesoCorporal, profile.altura)

            await db.addBodyMeasurement({
                id: crypto.randomUUID(),
                pesoCorporal,
                cintura,
                pecho,
                diametroPierna,
                imc: calculatedImc,
                fechaRegistro: new Date().toISOString(),
            })

            setMeasurementPesoCorporal('')
            setMeasurementCintura('')
            setMeasurementPecho('')
            setMeasurementDiametroPierna('')
            setMeasurementStatus({
                type: 'success',
                message: t('measurements.form.savedSuccessfully'),
            })
        } catch {
            setMeasurementStatus({
                type: 'error',
                message: t('measurements.form.saveFailed'),
            })
        }
    }

    const handleDeleteMeasurement = async (measurementId: string) => {
        try {
            await db.deleteBodyMeasurement(measurementId)
            setMeasurementStatus({
                type: 'success',
                message: t('measurements.history.deletedSuccessfully'),
            })
        } catch {
            setMeasurementStatus({
                type: 'error',
                message: t('measurements.history.deleteFailed'),
            })
        }
    }

    if (!profile) {
        return (
            <div className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{t('profile.notFound')}</p>
            </div>
        )
    }

    const imcStatus = classifyImc(profile.imc)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('profile.title')}</h1>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">{t('profile.currentData')}</h2>
                    <button
                        type="button"
                        onClick={toggleEditProfile}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        {t('measurements.profile.editButton')}
                    </button>
                </div>

                {profileStatus ? (
                    <p className={`mb-3 text-sm ${profileStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                        {profileStatus.message}
                    </p>
                ) : null}

                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-300">{t('profile.name')}</dt>
                        <dd className="font-medium">{profile.nombre || t('profile.noName')}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-300">{t('profile.weight')}</dt>
                        <dd className="font-medium">{profile.pesoCorporal} kg</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-300">{t('profile.height')}</dt>
                        <dd className="font-medium">{profile.altura} cm</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-slate-500 dark:text-slate-300">{t('profile.imc')}</dt>
                        <dd className="font-medium">
                            {profile.imc.toFixed(1)} <span className={imcStatus.color}>({imcStatus.label})</span>
                        </dd>
                    </div>
                </dl>

                {isEditingProfile ? (
                    <form className="mt-4 space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" onSubmit={handleSaveProfile}>
                        <h3 className="text-sm font-semibold">{t('measurements.profile.formTitle')}</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <label className="space-y-1 text-sm">
                                <span className="text-slate-500 dark:text-slate-300">{t('measurements.profile.fields.nombre')}</span>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={(event) => setEditNombre(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                />
                            </label>
                            <label className="space-y-1 text-sm">
                                <span className="text-slate-500 dark:text-slate-300">{t('measurements.profile.fields.pesoCorporal')}</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.1"
                                    required
                                    value={editPesoCorporal}
                                    onChange={(event) => setEditPesoCorporal(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                />
                            </label>
                            <label className="space-y-1 text-sm">
                                <span className="text-slate-500 dark:text-slate-300">{t('measurements.profile.fields.altura')}</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.1"
                                    required
                                    value={editAltura}
                                    onChange={(event) => setEditAltura(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                                />
                            </label>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
                                {t('measurements.profile.saveButton')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                            >
                                {t('measurements.profile.cancelButton')}
                            </button>
                        </div>
                    </form>
                ) : null}
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-3 text-lg font-semibold">{t('measurements.form.sectionTitle')}</h2>

                <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleRegisterMeasurement}>
                    <label className="space-y-1 text-sm">
                        <span className="text-slate-500 dark:text-slate-300">{t('measurements.form.fields.pesoCorporal')}</span>
                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            required
                            value={measurementPesoCorporal}
                            onChange={(event) => setMeasurementPesoCorporal(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        <span className="text-slate-500 dark:text-slate-300">{t('measurements.form.fields.cintura')}</span>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={measurementCintura}
                            onChange={(event) => setMeasurementCintura(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        <span className="text-slate-500 dark:text-slate-300">{t('measurements.form.fields.pecho')}</span>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={measurementPecho}
                            onChange={(event) => setMeasurementPecho(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                        />
                    </label>

                    <label className="space-y-1 text-sm">
                        <span className="text-slate-500 dark:text-slate-300">{t('measurements.form.fields.diametroPierna')}</span>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={measurementDiametroPierna}
                            onChange={(event) => setMeasurementDiametroPierna(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                        />
                    </label>

                    <div className="md:col-span-2">
                        <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
                            {t('measurements.form.submitButton')}
                        </button>
                    </div>
                </form>

                {measurementStatus ? (
                    <p className={`mt-3 text-sm ${measurementStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                        {measurementStatus.message}
                    </p>
                ) : null}

                <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold">{t('measurements.history.title')}</h3>

                    {sortedMeasurements.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-300">{t('measurements.history.empty')}</p>
                    ) : (
                        <div className="max-h-80 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full text-sm">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.fecha')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.peso')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.imc')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.cintura')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.pecho')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.pierna')}</th>
                                        <th className="px-3 py-2 text-left font-semibold">{t('measurements.history.columns.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMeasurements.map((measurement) => (
                                        <tr key={measurement.id} className="border-t border-slate-100 dark:border-slate-700">
                                            <td className="px-3 py-2">{new Date(measurement.fechaRegistro).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">{measurement.pesoCorporal.toFixed(1)} kg</td>
                                            <td className="px-3 py-2">{measurement.imc.toFixed(1)}</td>
                                            <td className="px-3 py-2">{measurement.cintura != null ? `${measurement.cintura.toFixed(1)} cm` : t('measurements.history.emptyValue')}</td>
                                            <td className="px-3 py-2">{measurement.pecho != null ? `${measurement.pecho.toFixed(1)} cm` : t('measurements.history.emptyValue')}</td>
                                            <td className="px-3 py-2">{measurement.diametroPierna != null ? `${measurement.diametroPierna.toFixed(1)} cm` : t('measurements.history.emptyValue')}</td>
                                            <td className="px-3 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => void handleDeleteMeasurement(measurement.id)}
                                                    className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-600"
                                                >
                                                    {t('measurements.history.deleteButton')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-3 text-lg font-semibold">{t('profile.appearance')}</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${theme === 'light' ? 'border-gym-primary text-gym-primary' : 'border-slate-300'
                            }`}
                    >
                        <Sun size={16} /> {t('profile.themeLight')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${theme === 'dark' ? 'border-gym-primary text-gym-primary' : 'border-slate-300'
                            }`}
                    >
                        <Moon size={16} /> {t('profile.themeDark')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme('system')}
                        className={`rounded-lg border px-3 py-2 text-sm ${theme === 'system' ? 'border-gym-primary text-gym-primary' : 'border-slate-300'
                            }`}
                    >
                        {t('profile.themeSystem')}
                    </button>
                </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-3 text-lg font-semibold">{t('profile.localData')}</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    {t('profile.localDataDescription')}
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => void handleExport()}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        {t('profile.exportBackup')}
                    </button>
                    <button
                        type="button"
                        onClick={handleImportClick}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        {t('profile.importBackup')}
                    </button>
                    <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
                </div>
                {backupStatus && <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">{backupStatus}</p>}
            </section>
        </div>
    )
}
