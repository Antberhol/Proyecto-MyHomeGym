export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        throw new Error('Este navegador no soporta notificaciones.')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
}

export function sendLocalNotification(title: string, body: string): void {
    if (!('Notification' in window)) {
        throw new Error('Este navegador no soporta notificaciones.')
    }

    if (Notification.permission !== 'granted') {
        throw new Error('Permiso de notificaciones no concedido.')
    }

    new Notification(title, { body })
}

export function scheduleRestTimerNotification(seconds: number): number | null {
    if (!('Notification' in window)) return null
    if (Notification.permission !== 'granted') return null
    if (seconds <= 0) return null

    return window.setTimeout(() => {
        try {
            sendLocalNotification('MyHomeGym', '¡Descanso terminado! Siguiente serie.')
        } catch {
            // ignore
        }
    }, seconds * 1000)
}

export function scheduleStreakWarning(streakDays: number, hour: number): void {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    if (streakDays < 3) return

    const now = new Date()
    const target = new Date(now)
    target.setHours(hour, 0, 0, 0)

    if (now > target) {
        return
    }

    const delay = target.getTime() - now.getTime()
    window.setTimeout(() => {
        try {
            sendLocalNotification(
                'MyHomeGym 🔥',
                `¡Tu racha de ${streakDays} días está en peligro! Entrena hoy para mantenerla.`,
            )
        } catch {
            // ignore
        }
    }, delay)
}
