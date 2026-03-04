function normalizeSpace(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

function normalizeLookupKey(value: string): string {
    return normalizeSpace(value).toLowerCase()
}

const primaryMuscleMap: Record<string, string> = {
    'upper back': 'espalda',
    triceps: 'triceps',
}

const secondaryMuscleMap: Record<string, string> = {
    back: 'espalda',
    biceps: 'biceps',
    chest: 'pecho',
    core: 'core',
    forearms: 'antebrazos',
    'rear deltoids': 'deltoides posteriores',
    shoulders: 'hombros',
    trapezius: 'trapecio',
    triceps: 'triceps',
}

const equipmentMap: Record<string, string> = {
    assisted: 'maquina',
    band: 'banda',
    barbell: 'barra',
    'body weight': 'peso corporal',
    cable: 'cable',
    dumbbell: 'mancuernas',
    'ez barbell': 'barra z',
    kettlebell: 'kettlebell',
    'leverage machine': 'maquina',
    'medicine ball': 'accesorio',
    'olympic barbell': 'barra olimpica',
    'resistance band': 'banda',
    rope: 'cuerda',
    'skierg machine': 'maquina',
    'smith machine': 'maquina',
    'stability ball': 'accesorio',
    weighted: 'lastre',
}

const syntheticNamePrefixPatterns = [
    /^intense\s+/i,
    /^precision style\s+/i,
    /^pointed\s+/i,
    /^stability\s+/i,
    /^extended style\s+/i,
]

const syntheticNameSuffixPatterns = [
    /\s+-\s+elite variation$/i,
    /\s+-\s+lateral variation$/i,
    /\s+-\s+strength variation$/i,
    /\s+linear$/i,
    /\s+controlled$/i,
    /\s+with declined$/i,
    /\s+with reverse$/i,
    /\s+hold$/i,
]

const displayNameReplacements: Array<[RegExp, string]> = [
    [/\bsmith machine\b/gi, 'máquina smith'],
    [/\bleverage machine\b/gi, 'máquina'],
    [/\bez barbell\b/gi, 'barra z'],
    [/\bolympic barbell\b/gi, 'barra olímpica'],
    [/\bbarbell\b/gi, 'barra'],
    [/\bdumbbell\b/gi, 'mancuernas'],
    [/\bmedicine ball\b/gi, 'balón medicinal'],
    [/\bstability ball\b/gi, 'fitball'],
    [/\bexercise ball\b/gi, 'fitball'],
    [/\bkettlebell\b/gi, 'kettlebell'],
    [/\bbodyweight\b/gi, 'peso corporal'],
    [/\bbody weight\b/gi, 'peso corporal'],
    [/\bbench press\b/gi, 'press de banca'],
    [/\bpush-up\b/gi, 'flexiones'],
    [/\bdips?\b/gi, 'fondos'],
    [/\btricep(s)?\b/gi, 'tríceps'],
    [/\bextension\b/gi, 'extensión'],
    [/\bstretch\b/gi, 'estiramiento'],
    [/\bclose-grip\b/gi, 'agarre cerrado'],
    [/\bwide-grip\b/gi, 'agarre amplio'],
    [/\breverse-grip\b/gi, 'agarre invertido'],
    [/\breverse grip\b/gi, 'agarre invertido'],
    [/\bneutral grip\b/gi, 'agarre neutro'],
    [/\bone arm\b/gi, 'un brazo'],
    [/\btwo arm\b/gi, 'dos brazos'],
    [/\balternating\b/gi, 'alterno'],
    [/\bseated\b/gi, 'sentado'],
    [/\bstanding\b/gi, 'de pie'],
    [/\blying\b/gi, 'tumbado'],
    [/\bincline\b/gi, 'inclinado'],
    [/\bdecline\b/gi, 'declinado'],
    [/\boverhead\b/gi, 'sobre la cabeza'],
    [/\brow\b/gi, 'remo'],
    [/\bkickback\b/gi, 'patada'],
    [/\bbridge\b/gi, 'puente'],
    [/\bfloor\b/gi, 'suelo'],
    [/\bkneeling\b/gi, 'de rodillas'],
    [/\bbench\b/gi, 'banco'],
    [/\bwith\b/gi, 'con'],
    [/\band\b/gi, 'y'],
    [/\bon\b/gi, 'en'],
    [/\boff\b/gi, 'desde'],
    [/\bto\b/gi, 'a'],
]

function toTitleCase(value: string): string {
    return value
        .split(' ')
        .filter(Boolean)
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
        .join(' ')
}

function stripSyntheticNameNoise(value: string): string {
    let normalized = normalizeSpace(value)

    for (const pattern of syntheticNamePrefixPatterns) {
        normalized = normalized.replace(pattern, '')
    }

    for (const pattern of syntheticNameSuffixPatterns) {
        normalized = normalized.replace(pattern, '')
    }

    normalized = normalized
        .replace(/\s*\(female\)/gi, '')
        .replace(/\s*\(with arm blaster\)/gi, '')
        .replace(/\bv\.\s*(\d+)/gi, 'v$1')

    return normalizeSpace(normalized)
}

export function normalizePrimaryMuscleLabel(value: string): string {
    const key = normalizeLookupKey(value)
    return primaryMuscleMap[key] ?? key
}

export function normalizeSecondaryMuscleLabels(values: string[] = []): string[] {
    const normalized = values
        .map((value) => {
            const key = normalizeLookupKey(value)
            return secondaryMuscleMap[key] ?? key
        })
        .filter(Boolean)

    return Array.from(new Set(normalized))
}

export function normalizeEquipmentLabel(value: string): string {
    const key = normalizeLookupKey(value)
    return equipmentMap[key] ?? key
}

export function normalizeExerciseDisplayName(value: string): string {
    const withoutNoise = stripSyntheticNameNoise(value)

    if (!withoutNoise) {
        return value
    }

    let translated = withoutNoise

    for (const [pattern, replacement] of displayNameReplacements) {
        translated = translated.replace(pattern, replacement)
    }

    translated = translated
        .replace(/[()]/g, ' ')
        .replace(/[–—]/g, '-')
        .replace(/\s+-\s+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()

    return toTitleCase(translated || withoutNoise)
}

export function normalizeExerciseInstructions(value?: string): string | undefined {
    const normalized = value?.trim()
    if (!normalized) {
        return undefined
    }

    const cleanedLines = normalized
        .split(/\r?\n/)
        .map((line) =>
            line
                .replace(/(?:^|\s)(Maintain|Emphasize|Focus on|Perform with)\b[^.]*\./gi, '')
                .replace(/\s{2,}/g, ' ')
                .trim(),
        )
        .filter(Boolean)

    if (cleanedLines.length === 0) {
        return undefined
    }

    return cleanedLines.join('\n')
}

export function buildSpanishExerciseDescription(primaryMuscle: string): string {
    return `Ejercicio para ${primaryMuscle}.`
}
