export function LoadingSpinner() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gym-bgLight dark:bg-gym-bgDark">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow dark:bg-gym-cardDark">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-gym-primary" />
                <p className="text-sm text-slate-600 dark:text-slate-200">Cargando...</p>
            </div>
        </div>
    )
}
