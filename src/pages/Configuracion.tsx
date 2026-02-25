import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { exportAllDataJson, exportSummaryPdf, exportTrainingsCsv, importAllDataJson, importTrainingsCsv } from '../lib/export'
import { settingsRepository } from '../repositories/settingsRepository'
import { requestNotificationPermission, sendLocalNotification } from '../lib/notifications'

async function clearAllData() {
    await settingsRepository.clearAllData()
}

export function ConfiguracionPage() {
    const [statusMessage, setStatusMessage] = useState('')
    const importCsvInputRef = useRef<HTMLInputElement>(null)
    const importJsonInputRef = useRef<HTMLInputElement>(null)

    const handleClearData = async () => {
        const confirmed = window.confirm('¿Seguro que quieres borrar todos los datos locales de la app?')
        if (!confirmed) return

        await clearAllData()
        window.location.reload()
    }

    const handleEnableNotifications = async () => {
        try {
            const permission = await requestNotificationPermission()
            if (permission === 'granted') {
                setStatusMessage('Notificaciones habilitadas correctamente.')
            } else {
                setStatusMessage('Notificaciones no habilitadas. Revisa permisos del navegador.')
            }
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'No se pudo solicitar permisos.')
        }
    }

    const handleTestNotification = () => {
        try {
            sendLocalNotification('MyHomeGym', 'Recordatorio: registra tu entrenamiento de hoy 💪')
            setStatusMessage('Notificación de prueba enviada.')
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'No se pudo enviar notificación.')
        }
    }

    const handleExportCsv = async () => {
        await exportTrainingsCsv()
        setStatusMessage('CSV de entrenamientos exportado.')
    }

    const handleOpenImportCsv = () => {
        importCsvInputRef.current?.click()
    }

    const handleImportCsv = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const imported = await importTrainingsCsv(file)
            setStatusMessage(`Importación CSV completada. Nuevos entrenamientos añadidos: ${imported}.`)
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'No se pudo importar el CSV.')
        } finally {
            event.target.value = ''
        }
    }

    const handleExportJson = async () => {
        await exportAllDataJson()
        setStatusMessage('Backup JSON completo exportado.')
    }

    const handleOpenImportJson = () => {
        importJsonInputRef.current?.click()
    }

    const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const { imported, skipped } = await importAllDataJson(file)
            setStatusMessage(`Importación JSON completada. Registros añadidos: ${imported}, omitidos (duplicados): ${skipped}.`)
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'No se pudo importar el JSON.')
        } finally {
            event.target.value = ''
        }
    }

    const handleExportPdf = async () => {
        try {
            await exportSummaryPdf()
            setStatusMessage('Resumen PDF exportado correctamente.')
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'No se pudo generar el PDF.')
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Configuración</h1>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-2 text-lg font-semibold">Mantenimiento local</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    Herramientas para reiniciar la aplicación y gestionar datos offline.
                </p>

                <button
                    type="button"
                    onClick={() => void handleClearData()}
                    className="rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-600"
                >
                    Borrar todos los datos locales
                </button>
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-2 text-lg font-semibold">Notificaciones</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    Activa recordatorios locales para no perder constancia de entrenamientos.
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => void handleEnableNotifications()}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Habilitar notificaciones
                    </button>
                    <button
                        type="button"
                        onClick={handleTestNotification}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Enviar prueba
                    </button>
                </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-2 text-lg font-semibold">Backup completo (JSON)</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    Exporta e importa todos los datos de la app en formato JSON (rutinas, entrenamientos, PRs, medidas, etc.).
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => void handleExportJson()}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Exportar backup JSON
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenImportJson}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Importar backup JSON
                    </button>
                </div>
                <input
                    ref={importJsonInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportJson}
                />
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-2 text-lg font-semibold">Resumen PDF</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    Genera un PDF con el resumen de tu progreso: perfil, entrenamientos, PRs y medidas corporales.
                </p>
                <button
                    type="button"
                    onClick={() => void handleExportPdf()}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                    Generar resumen PDF
                </button>
            </section>

            <section className="rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark">
                <h2 className="mb-2 text-lg font-semibold">Exportación CSV</h2>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">
                    Exporta e importa entrenamientos en CSV para análisis externo.
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => void handleExportCsv()}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Exportar entrenamientos CSV
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenImportCsv}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                        Importar entrenamientos CSV
                    </button>
                </div>
                <input
                    ref={importCsvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleImportCsv}
                />
            </section>

            {statusMessage && (
                <p className="rounded-lg bg-white p-3 text-sm text-slate-700 shadow dark:bg-gym-cardDark dark:text-slate-200">
                    {statusMessage}
                </p>
            )}
        </div>
    )
}
