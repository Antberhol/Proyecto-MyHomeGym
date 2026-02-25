import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
    const [closed, setClosed] = useState(false)
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW()

    if (!needRefresh || closed) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-gym-cardDark">
            <p className="text-sm font-medium">Nueva versión disponible</p>
            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        void updateServiceWorker(true)
                    }}
                    className="rounded-lg bg-gym-primary px-3 py-2 text-xs font-semibold text-white"
                >
                    Actualizar
                </button>
                <button
                    type="button"
                    onClick={() => setClosed(true)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}
