import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker(): void {
    if (!('serviceWorker' in navigator)) return

    registerSW({
        immediate: true,
        onOfflineReady() {
            console.info('MyHomeGym listo para uso offline.')
        },
        onNeedRefresh() {
            console.info('Nueva versión disponible. Recarga para actualizar.')
        },
    })
}
