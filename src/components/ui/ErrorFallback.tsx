import type { FallbackProps } from 'react-error-boundary'

async function clearCacheAndReload() {
    try {
        localStorage.clear()
        sessionStorage.clear()

        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations()
            await Promise.all(registrations.map((registration) => registration.unregister()))
        }
    } finally {
        window.location.reload()
    }
}

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    return (
        <div className="flex min-h-screen items-center justify-center bg-gym-bgLight p-4 dark:bg-gym-bgDark">
            <section className="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow dark:bg-gym-cardDark">
                <h1 className="text-lg font-semibold">Algo salió mal</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Se produjo un error inesperado. Puedes reintentar o limpiar caché para recuperar la app.
                </p>
                <p className="rounded-lg bg-slate-100 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {errorMessage}
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={resetErrorBoundary}
                        className="rounded-lg bg-gym-primary px-3 py-2 text-xs font-medium text-white"
                    >
                        Intentar de nuevo
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            void clearCacheAndReload()
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium dark:border-slate-600"
                    >
                        Borrar caché y recargar
                    </button>
                </div>
            </section>
        </div>
    )
}
