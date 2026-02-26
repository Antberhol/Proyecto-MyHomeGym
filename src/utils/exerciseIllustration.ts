interface ExerciseIllustrationInput {
    nombre: string
    grupoMuscularPrimario?: string
    equipoNecesario?: string
}

const groupPalette: Record<string, { start: string; end: string }> = {
    pecho: { start: '#EF4444', end: '#FB7185' },
    espalda: { start: '#3B82F6', end: '#60A5FA' },
    piernas: { start: '#10B981', end: '#34D399' },
    hombros: { start: '#F59E0B', end: '#FBBF24' },
    biceps: { start: '#8B5CF6', end: '#A78BFA' },
    triceps: { start: '#EC4899', end: '#F472B6' },
    core: { start: '#14B8A6', end: '#2DD4BF' },
}

function escapeXml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
}

function movementCue(nombre: string) {
    const normalized = nombre.toLowerCase()

    if (/(press|flexiones|fondos)/.test(normalized)) return 'Patrón de empuje'
    if (/(remo|jalón|dominadas|face pull|encogimientos)/.test(normalized)) return 'Patrón de tirón'
    if (/(sentadilla|prensa|zancadas|búlgara|bulgara)/.test(normalized)) return 'Patrón de sentadilla'
    if (/(peso muerto|rumano|hip thrust)/.test(normalized)) return 'Patrón de bisagra'
    if (/(curl|bíceps|biceps)/.test(normalized)) return 'Flexión de codo'
    if (/(tríceps|triceps|extensión|extension|press francés|press frances|patada)/.test(normalized)) {
        return 'Extensión de codo'
    }
    if (/(plancha|crunch|ab wheel|elevación de piernas|elevacion de piernas|twist|dead bug|hollow)/.test(normalized)) {
        return 'Control de core'
    }
    if (/(hombro|elevaciones|arnold|pájaros|pajaros|mentón|menton)/.test(normalized)) return 'Trabajo de hombro'

    return 'Técnica controlada'
}

export function getExerciseIllustrationUrl(input: ExerciseIllustrationInput) {
    const group = input.grupoMuscularPrimario?.toLowerCase() ?? 'general'
    const palette = groupPalette[group] ?? { start: '#334155', end: '#64748B' }
    const title = escapeXml(input.nombre)
    const cue = escapeXml(movementCue(input.nombre))
    const equipment = escapeXml(input.equipoNecesario?.trim() || 'Sin equipo')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.start}"/>
      <stop offset="100%" stop-color="${palette.end}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" rx="28" fill="url(#g)"/>
  <circle cx="120" cy="108" r="34" fill="rgba(255,255,255,0.25)"/>
  <rect x="95" y="146" width="52" height="95" rx="20" fill="rgba(255,255,255,0.25)"/>
  <rect x="64" y="155" width="28" height="14" rx="7" fill="rgba(255,255,255,0.25)"/>
  <rect x="148" y="155" width="28" height="14" rx="7" fill="rgba(255,255,255,0.25)"/>
  <rect x="103" y="246" width="15" height="74" rx="7" fill="rgba(255,255,255,0.25)"/>
  <rect x="124" y="246" width="15" height="74" rx="7" fill="rgba(255,255,255,0.25)"/>
  <text x="198" y="134" fill="white" font-size="36" font-family="Inter,Segoe UI,Arial,sans-serif" font-weight="700">${title}</text>
  <text x="198" y="186" fill="rgba(255,255,255,0.95)" font-size="24" font-family="Inter,Segoe UI,Arial,sans-serif">${cue}</text>
  <text x="198" y="230" fill="rgba(255,255,255,0.92)" font-size="20" font-family="Inter,Segoe UI,Arial,sans-serif">Equipo: ${equipment}</text>
</svg>`

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
