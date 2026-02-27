import { Cloud, CloudOff, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSyncStore } from '../../stores/sync-store'

export function SyncStatusIndicator() {
    const { t } = useTranslation()
    const status = useSyncStore((state) => state.status)
    const pendingChanges = useSyncStore((state) => state.pendingChanges)
    const lastError = useSyncStore((state) => state.lastError)

    if (status === 'idle') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300">
                <Cloud size={14} />
                {t('sync.noCloud')}
            </span>
        )
    }

    if (status === 'offline') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300">
                <CloudOff size={14} />
                {t('sync.offline')}{pendingChanges > 0 ? ` (${pendingChanges})` : ''}
            </span>
        )
    }

    if (status === 'syncing') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300">
                <LoaderCircle size={14} className="animate-spin" />
                {t('sync.syncing')}
            </span>
        )
    }

    if (status === 'error') {
        return (
            <span
                className="inline-flex items-center gap-1 rounded-full border border-red-300 px-2 py-1 text-xs text-red-700 dark:border-red-700 dark:text-red-300"
                title={lastError}
            >
                <CloudOff size={14} />
                {lastError ?? t('sync.error')}
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-1 text-xs text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
            <Cloud size={14} />
            {t('sync.synced')}
        </span>
    )
}
