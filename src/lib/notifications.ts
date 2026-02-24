export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        throw new Error('Este navegador no soporta notificaciones.')
    }

    return Notification.requestPermission()
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
