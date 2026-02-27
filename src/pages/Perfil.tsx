import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buildBackupPayload, downloadBackup, importBackupFile } from '../lib/backup'
import { profileRepository } from '../repositories/profileRepository'
import { useUiStore } from '../stores/ui-store'
import { classifyImc } from '../utils/calculations'

export function PerfilPage() {
    const { t } = useTranslation()
    const profile = useLiveQuery(() => profileRepository.getProfile(), [])
    const theme = useUiStore((state) => state.theme)
    const setTheme = useUiStore((state) => state.setTheme)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [backupStatus, setBackupStatus] = useState('')

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
                <h2 className="mb-3 text-lg font-semibold">{t('profile.currentData')}</h2>
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
