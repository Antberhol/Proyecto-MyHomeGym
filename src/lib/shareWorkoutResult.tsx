import { createRoot } from 'react-dom/client'
import { WorkoutShareCard, type WorkoutShareData } from '../components/share/WorkoutShareCard'

async function waitForPaint() {
    await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve())
        })
    })
}

async function blobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob)
            } else {
                reject(new Error('No se pudo generar la imagen del resumen.'))
            }
        }, 'image/png')
    })
}

export async function shareWorkoutResult(data: WorkoutShareData): Promise<'shared' | 'downloaded'> {
    const mountNode = document.createElement('div')
    mountNode.style.position = 'fixed'
    mountNode.style.left = '-10000px'
    mountNode.style.top = '0'
    mountNode.style.width = '360px'
    mountNode.style.height = '640px'
    mountNode.style.pointerEvents = 'none'

    document.body.appendChild(mountNode)

    const root = createRoot(mountNode)
    root.render(<WorkoutShareCard data={data} />)

    try {
        await waitForPaint()

        const html2canvasModule = await import('html2canvas')
        const html2canvas = html2canvasModule.default

        const canvas = await html2canvas(mountNode, {
            useCORS: true,
            backgroundColor: null,
            scale: 2,
        })

        const blob = await blobFromCanvas(canvas)
        const file = new File([blob], 'myhomegym-workout.png', { type: 'image/png' })

        if (
            navigator.share
            && (typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file] }))
        ) {
            await navigator.share({
                files: [file],
                title: 'MyHomeGym · Resultado de entreno',
                text: 'Mi sesión de hoy en MyHomeGym 💪',
            })
            return 'shared'
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'myhomegym-workout.png'
        link.click()
        URL.revokeObjectURL(url)

        return 'downloaded'
    } finally {
        root.unmount()
        mountNode.remove()
    }
}
