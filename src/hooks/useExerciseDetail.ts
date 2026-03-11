import { useEffect, useMemo, useState } from 'react'
import { getExerciseDbQueryCandidates, normalizeExerciseName } from '../constants/exerciseDbAliases'
import i18n from '../i18n'
import { exerciseRepository } from '../repositories/exerciseRepository'

export interface ExerciseDetailData {
    gifUrl: string
    target: string
    equipment: string
    instructions: string[]
    secondaryMuscles: string[]
}

export interface ExerciseDetailDebugInfo {
    source: 'id' | 'candidate' | 'cache' | 'none'
    resolvedExerciseDbId?: string
    resolvedExerciseDbName?: string
    usedCandidate?: string
    candidatesTried: string[]
    gifValidated: boolean
    lastError?: string
}

interface ExerciseDbItem {
    id?: string
    name?: string
    gifUrl?: string
    target?: string
    equipment?: string
    instructions?: string[]
    secondaryMuscles?: string[]
}

interface UseExerciseDetailResult {
    data: ExerciseDetailData | null
    isLoading: boolean
    isTranslatingInstructions: boolean
    notFound: boolean
    debug: ExerciseDetailDebugInfo
}

interface UseExerciseDetailOptions {
    exerciseId?: string
    exerciseDbId?: string
    exerciseDbName?: string
    exerciseDbAliases?: string[]
    fallbackInstructions?: string
    fallbackGifUrl?: string
}

interface CachedDetailEntry {
    data: ExerciseDetailData | null
    notFound: boolean
    debug: ExerciseDetailDebugInfo
}

const detailCache = new Map<string, CachedDetailEntry>()
const gifUrlCache = new Map<string, string>()
const translatedInstructionCache = new Map<string, string>()
const INSTRUCTION_TRANSLATION_CACHE_VERSION = 'es-local-v5'
const EXERCISE_DB_RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com'

function buildExerciseDbRequestInit(apiKey: string, signal?: AbortSignal): RequestInit {
    return {
        signal,
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': EXERCISE_DB_RAPIDAPI_HOST,
        },
    }
}

async function persistResolvedExerciseDbLink(input: {
    exerciseId?: string
    currentExerciseDbId?: string
    currentExerciseDbName?: string
    resolvedExerciseDbId?: string
    resolvedExerciseDbName?: string
    resolvedByCandidate: boolean
}): Promise<void> {
    if (!input.resolvedByCandidate) {
        return
    }

    const exerciseId = input.exerciseId?.trim()
    if (!exerciseId) {
        return
    }

    if (input.currentExerciseDbId?.trim() && input.currentExerciseDbName?.trim()) {
        return
    }

    const resolvedExerciseDbId = input.resolvedExerciseDbId?.trim()
    const resolvedExerciseDbName = input.resolvedExerciseDbName?.trim()
    if (!resolvedExerciseDbId || !resolvedExerciseDbName) {
        return
    }

    try {
        await exerciseRepository.updateExercise(exerciseId, {
            exerciseDbId: resolvedExerciseDbId,
            exerciseDbName: resolvedExerciseDbName,
        })
    } catch {
        // Keep detail rendering resilient when local persistence fails.
    }
}

function stripStepPrefix(step: string) {
    return step
        .replace(/^step\s*:?\s*\d+\s*/i, '')
        .replace(/^\d+[).:-]?\s*/, '')
        .trim()
}

function parseFallbackInstructions(value?: string): string[] {
    const normalized = value?.trim()
    if (!normalized) {
        return []
    }

    const byLine = normalized
        .split(/\r?\n/)
        .map((line) => stripStepPrefix(line.trim()))
        .filter(Boolean)

    if (byLine.length > 1) {
        return byLine
    }

    return [stripStepPrefix(normalized)]
}

const spanishInstructionSignalPattern =
    /\b(el|la|los|las|de|del|con|manten|mantén|evita|controla|sube|baja|repite|sin|hombros|cadera|espalda|rodillas|agarra|sujeta|colócate|colocate|siéntate|sientate|túmbate|tumbate|posición|posicion|inicial|pausa|luego|hacia|pecho|cuerpo|brazos|codos)\b/i

const englishInstructionSignalPattern =
    /\b(the|a|an|and|or|with|without|your|you|for|from|to|of|in|on|at|by|then|while|when|this|that|these|those|keep|maintain|perform|pull|push|lower|raise|pause|repeat|continue|switch|stand|sit|lie|walk|step|grab|grasp|bench|grip|starting|position|shoulder|body|chest|feet|knee|floor|ground|back|arms|elbows)\b/i

function hasSpanishInstructionSignals(text: string): boolean {
    if (/[áéíóúñ¿¡]/i.test(text)) {
        return true
    }

    return spanishInstructionSignalPattern.test(text.toLowerCase())
}

function hasEnglishInstructionSignals(text: string): boolean {
    const normalized = text.toLowerCase()
    return englishInstructionSignalPattern.test(normalized) || countLikelyEnglishWords(normalized) > 0
}

function isMixedInstruction(text: string): boolean {
    return hasSpanishInstructionSignals(text) && hasEnglishInstructionSignals(text)
}

function shouldRetryMixedInstruction(text: string): boolean {
    return isMixedInstruction(text) && countLikelyEnglishWords(text) > 2
}

function detectInstructionLanguage(text: string): 'es' | 'en' {
    const hasSpanishSignals = hasSpanishInstructionSignals(text)
    const hasEnglishSignals = hasEnglishInstructionSignals(text)

    if (hasSpanishSignals && !hasEnglishSignals) {
        return 'es'
    }

    if (hasEnglishSignals && !hasSpanishSignals) {
        return 'en'
    }

    return hasSpanishSignals ? 'es' : 'en'
}

function applyTextReplacements(value: string, replacements: Array<[RegExp, string]>): string {
    let translated = value

    for (const [pattern, replacement] of replacements) {
        translated = translated.replace(pattern, replacement)
    }

    return translated
}

function applyWordTranslations(value: string, dictionary: Record<string, string>): string {
    return value.replace(/\b[a-z][a-z'-]*\b/gi, (word) => dictionary[word.toLowerCase()] ?? word)
}

const spanishLeadReplacements: Array<[RegExp, string]> = [
    [/^set up\b/i, 'Prepara'],
    [/^stand with\b/i, 'Ponte de pie con'],
    [/^stand facing\b/i, 'Ponte frente a'],
    [/^stand\b/i, 'Ponte de pie'],
    [/^sit on\b/i, 'Siéntate en'],
    [/^sit\b/i, 'Siéntate'],
    [/^lie face down\b/i, 'Túmbate boca abajo'],
    [/^lie face up\b/i, 'Túmbate boca arriba'],
    [/^lie flat\b/i, 'Túmbate'],
    [/^lie\b/i, 'Túmbate'],
    [/^start in\b/i, 'Comienza en'],
    [/^start by\b/i, 'Comienza'],
    [/^attach\b/i, 'Coloca'],
    [/^adjust\b/i, 'Ajusta'],
    [/^grasp\b/i, 'Sujeta'],
    [/^grab\b/i, 'Agarra'],
    [/^keep\b/i, 'Mantén'],
    [/^engage\b/i, 'Activa'],
    [/^pull\b/i, 'Tira'],
    [/^push\b/i, 'Empuja'],
    [/^lower\b/i, 'Baja'],
    [/^raise\b/i, 'Eleva'],
    [/^pause\b/i, 'Haz una pausa'],
    [/^repeat\b/i, 'Repite'],
    [/^continue\b/i, 'Continúa'],
    [/^switch\b/i, 'Cambia'],
    [/^hold\b/i, 'Mantén'],
    [/^inhale\b/i, 'Inhala'],
    [/^exhale\b/i, 'Exhala'],
]

const englishToSpanishFragmentReplacements: Array<[RegExp, string]> = [
    [/\blie underneath it\b/gi, 'colócate debajo de ella'],
    [/\bwalk your feet forward\b/gi, 'camina con los pies hacia delante'],
    [/\bstep back\b/gi, 'da un paso atrás'],
    [/\bsit back on your heels\b/gi, 'siéntate sobre los talones'],
    [/\blean slightly forward\b/gi, 'inclínate ligeramente hacia delante'],
    [/\blean slightly back\b/gi, 'inclínate ligeramente hacia atrás'],
    [/\bbend your knees slightly\b/gi, 'flexiona ligeramente las rodillas'],
    [/\bbend forward at the hips\b/gi, 'inclínate hacia delante desde la cadera'],
    [/\bkeeping your elbows close to your body\b/gi, 'manteniendo los codos cerca del cuerpo'],
    [/\bkeeping your elbows close to your sides\b/gi, 'manteniendo los codos pegados al costado'],
    [/\bkeeping your elbows close to your head\b/gi, 'manteniendo los codos cerca de la cabeza'],
    [/\bkeeping your upper arms stationary\b/gi, 'manteniendo los brazos superiores estables'],
    [/\bkeeping your upper arm stationary\b/gi, 'manteniendo el brazo superior estable'],
    [/\bkeeping your body straight\b/gi, 'manteniendo el cuerpo recto'],
    [/\bkeeping your body in a straight line from head to heels\b/gi, 'manteniendo el cuerpo en línea recta de cabeza a talones'],
    [/\bthroughout the exercise\b/gi, 'durante todo el ejercicio'],
    [/\bcontinue alternating sides\b/gi, 'continúa alternando lados'],
    [/\bfor each rep\b/gi, 'en cada repetición'],
    [/\bslightly wider than shoulder-width apart\b/gi, 'ligeramente más abierto que la anchura de los hombros'],
    [/\bslightly narrower than shoulder-width apart\b/gi, 'ligeramente más cerrado que la anchura de los hombros'],
    [/\bshoulder-width apart\b/gi, 'a la anchura de los hombros'],
    [/\bhip-width apart\b/gi, 'a la anchura de la cadera'],
    [/\bfeet shoulder-width apart\b/gi, 'pies a la anchura de los hombros'],
    [/\bfeet flat on the ground\b/gi, 'pies apoyados en el suelo'],
    [/\bfeet flat on the floor\b/gi, 'pies apoyados en el suelo'],
    [/\bkeeping your back straight\b/gi, 'manteniendo la espalda recta'],
    [/\bkeep your back straight\b/gi, 'mantén la espalda recta'],
    [/\bkeeping your core engaged\b/gi, 'manteniendo el core activado'],
    [/\bkeep your core engaged\b/gi, 'mantén el core activado'],
    [/\bknees slightly bent\b/gi, 'rodillas ligeramente flexionadas'],
    [/\bslight bend in your knees\b/gi, 'ligera flexión de rodillas'],
    [/\bpalms facing down\b/gi, 'palmas hacia abajo'],
    [/\bpalms facing up\b/gi, 'palmas hacia arriba'],
    [/\bpalms facing each other\b/gi, 'palmas enfrentadas'],
    [/\bslightly bent\b/gi, 'ligeramente flexionados'],
    [/\bfully extended\b/gi, 'completamente extendidos'],
    [/\boverhand grip\b/gi, 'agarre prono'],
    [/\bunderhand grip\b/gi, 'agarre supino'],
    [/\bneutral grip\b/gi, 'agarre neutro'],
    [/\bsqueeze your shoulder blades together\b/gi, 'junta las escápulas al final'],
    [/\bshoulder blades together\b/gi, 'escápulas juntas'],
    [/\bshoulder blades\b/gi, 'escápulas'],
    [/\bcore\b/gi, 'core'],
    [/\bto create tension\b/gi, 'para crear tensión'],
    [/\bat waist height\b/gi, 'a la altura de la cintura'],
    [/\bat chest height\b/gi, 'a la altura del pecho'],
    [/\bat shoulder height\b/gi, 'a la altura de los hombros'],
    [/\b45-degree angle\b/gi, 'ángulo de 45 grados'],
    [/\b90-degree angle\b/gi, 'ángulo de 90 grados'],
    [/\btowards your chest\b/gi, 'hacia el pecho'],
    [/\btowards your body\b/gi, 'hacia el cuerpo'],
    [/\btowards your torso\b/gi, 'hacia el torso'],
    [/\btowards your waist\b/gi, 'hacia la cintura'],
    [/\btowards your upper abdomen\b/gi, 'hacia el abdomen superior'],
    [/\btowards your lower chest\b/gi, 'hacia el pecho bajo'],
    [/\bback to the starting position\b/gi, 'de vuelta a la posición inicial'],
    [/\bto the starting position\b/gi, 'a la posición inicial'],
    [/\bstarting position\b/gi, 'posición inicial'],
    [/\bfor the desired number of repetitions\b/gi, 'durante el número de repeticiones deseado'],
    [/\bdesired number of repetitions\b/gi, 'número de repeticiones deseado'],
    [/\bpause for a moment at the top\b/gi, 'haz una pausa breve arriba'],
    [/\bpause for a moment at the bottom\b/gi, 'haz una pausa breve abajo'],
    [/\bpause for a moment\b/gi, 'haz una pausa breve'],
    [/\bfor a moment\b/gi, 'brevemente'],
    [/\bslowly lower\b/gi, 'baja lentamente'],
    [/\bslowly return\b/gi, 'vuelve lentamente'],
    [/\bslowly release\b/gi, 'libera lentamente'],
    [/\bslowly extend\b/gi, 'extiende lentamente'],
    [/\bslowly bend\b/gi, 'flexiona lentamente'],
    [/\bslowly\b/gi, 'lentamente'],
    [/\bwhile keeping\b/gi, 'manteniendo'],
    [/\bkeeping\b/gi, 'manteniendo'],
    [/\bby bending\b/gi, 'flexionando'],
    [/\bby extending\b/gi, 'extendiendo'],
    [/\bswitch sides\b/gi, 'cambia de lado'],
    [/\bthen switch sides\b/gi, 'luego cambia de lado'],
    [/\brepeat with the other arm\b/gi, 'repite con el otro brazo'],
    [/\bthen switch to the other arm\b/gi, 'luego cambia al otro brazo'],
    [/\bupper arms\b/gi, 'brazos superiores'],
    [/\blower arms\b/gi, 'antebrazos'],
    [/\bexercise ball\b/gi, 'fitball'],
    [/\bstability ball\b/gi, 'fitball'],
    [/\bcable machine\b/gi, 'máquina de poleas'],
    [/\bsmith machine\b/gi, 'máquina Smith'],
    [/\bpull-up bar\b/gi, 'barra de dominadas'],
    [/\bbodyweight\b/gi, 'peso corporal'],
    [/\bbench\b/gi, 'banco'],
    [/\bbarbell\b/gi, 'barra'],
    [/\bdumbbell\b/gi, 'mancuerna'],
    [/\bdumbbells\b/gi, 'mancuernas'],
    [/\bv-bar\b/gi, 'barra en V'],
    [/\bhigh pulley\b/gi, 'polea alta'],
    [/\blow pulley\b/gi, 'polea baja'],
    [/\boverhead\b/gi, 'por encima de la cabeza'],
    [/\bsuspension trainer\b/gi, 'entrenador en suspensión'],
    [/\banchor point\b/gi, 'punto de anclaje'],
    [/\bfootrests\b/gi, 'apoyapiés'],
    [/\bfootplate\b/gi, 'plataforma para los pies'],
    [/\bseat height\b/gi, 'altura del asiento'],
    [/\bstraight line\b/gi, 'línea recta'],
    [/\bparallel to the ground\b/gi, 'paralelo al suelo'],
    [/\bparallel to the floor\b/gi, 'paralelo al suelo'],
    [/\bcable\b/gi, 'cable'],
    [/\brow\b/gi, 'remo'],
    [/\bbody weight\b/gi, 'peso corporal'],
    [/\belbows\b/gi, 'codos'],
    [/\bshoulders\b/gi, 'hombros'],
    [/\bchest\b/gi, 'pecho'],
    [/\bback\b/gi, 'espalda'],
]

const englishToSpanishWordMap: Record<string, string> = {
    the: 'el',
    a: 'un',
    an: 'un',
    and: 'y',
    or: 'o',
    as: 'como',
    with: 'con',
    without: 'sin',
    your: 'tus',
    yourself: 'tu cuerpo',
    you: 'tú',
    to: 'a',
    from: 'desde',
    of: 'de',
    on: 'sobre',
    in: 'en',
    at: 'a',
    for: 'para',
    by: 'mediante',
    then: 'luego',
    while: 'mientras',
    when: 'cuando',
    until: 'hasta',
    into: 'en',
    out: 'hacia fuera',
    over: 'sobre',
    under: 'debajo',
    above: 'arriba',
    behind: 'detrás',
    through: 'a través de',
    throughout: 'durante todo',
    than: 'que',
    are: 'están',
    is: 'está',
    it: 'ello',
    them: 'ellos',
    that: 'que',
    both: 'ambos',
    each: 'cada',
    one: 'un',
    two: 'dos',
    other: 'otro',
    right: 'derecho',
    left: 'izquierdo',
    set: 'ajusta',
    towards: 'hacia',
    stand: 'ponte',
    sit: 'siéntate',
    lie: 'túmbate',
    walk: 'camina',
    step: 'paso',
    start: 'comienza',
    attach: 'coloca',
    adjust: 'ajusta',
    grab: 'agarra',
    grasp: 'sujeta',
    place: 'coloca',
    keep: 'mantén',
    engage: 'activa',
    pull: 'tira',
    push: 'empuja',
    lower: 'baja',
    raise: 'eleva',
    lift: 'eleva',
    pause: 'pausa',
    repeat: 'repite',
    continue: 'continúa',
    switch: 'cambia',
    return: 'vuelve',
    release: 'libera',
    extend: 'extiende',
    extending: 'extendiendo',
    bend: 'flexiona',
    bending: 'flexionando',
    straighten: 'estira',
    straightening: 'estirando',
    lean: 'inclina',
    hinge: 'inclina',
    rotate: 'rota',
    bring: 'lleva',
    create: 'crea',
    use: 'usa',
    using: 'usando',
    ensure: 'asegura',
    maintaining: 'manteniendo',
    retracting: 'retrayendo',
    squeezing: 'apretando',
    squeeze: 'aprieta',
    keeping: 'manteniendo',
    holding: 'sujetando',
    gripping: 'agarrando',
    facing: 'frente a',
    apart: 'separados',
    pointing: 'apuntando',
    pressed: 'presionada',
    slide: 'desliza',
    hold: 'mantén',
    inhale: 'inhala',
    exhale: 'exhala',
    feet: 'pies',
    foot: 'pie',
    footrests: 'apoyapiés',
    footplate: 'plataforma para los pies',
    knee: 'rodilla',
    knees: 'rodillas',
    hip: 'cadera',
    hips: 'caderas',
    waist: 'cintura',
    torso: 'torso',
    core: 'core',
    chest: 'pecho',
    shoulder: 'hombro',
    shoulders: 'hombros',
    'shoulder-width': 'anchura de hombros',
    elbow: 'codo',
    elbows: 'codos',
    arm: 'brazo',
    arms: 'brazos',
    hand: 'mano',
    hands: 'manos',
    palm: 'palma',
    palms: 'palmas',
    blades: 'escápulas',
    triceps: 'tríceps',
    biceps: 'bíceps',
    forearms: 'antebrazos',
    head: 'cabeza',
    body: 'cuerpo',
    heels: 'talones',
    toes: 'punta de los pies',
    machine: 'máquina',
    smith: 'smith',
    seat: 'asiento',
    handle: 'agarre',
    handles: 'agarres',
    grip: 'agarre',
    overhand: 'prono',
    underhand: 'supino',
    neutral: 'neutro',
    close: 'cerca',
    wider: 'más ancho',
    together: 'juntas',
    rope: 'cuerda',
    cable: 'cable',
    pulley: 'polea',
    bar: 'barra',
    barbell: 'barra',
    dumbbell: 'mancuerna',
    dumbbells: 'mancuernas',
    kettlebell: 'pesa rusa',
    medicine: 'medicinal',
    ball: 'balón',
    exercise: 'ejercicio',
    suspension: 'suspensión',
    trainer: 'entrenador',
    band: 'banda',
    towel: 'toalla',
    attachment: 'acople',
    'v-bar': 'barra en v',
    incline: 'inclinado',
    overhead: 'sobre la cabeza',
    reverse: 'invertido',
    weight: 'peso',
    ez: 'ez',
    plank: 'plancha',
    abdomen: 'abdomen',
    forehead: 'frente',
    ceiling: 'techo',
    against: 'contra',
    away: 'alejándote',
    off: 'desde',
    just: 'justo',
    up: 'arriba',
    down: 'abajo',
    floor: 'suelo',
    ground: 'suelo',
    straight: 'recta',
    parallel: 'paralelo',
    flat: 'apoyados',
    bent: 'flexionados',
    slightly: 'ligeramente',
    slight: 'ligera',
    slowly: 'lentamente',
    fully: 'completamente',
    extended: 'extendidos',
    top: 'arriba',
    bottom: 'abajo',
    side: 'lado',
    sides: 'lados',
    front: 'frente',
    line: 'línea',
    angle: 'ángulo',
    degree: 'grados',
    height: 'altura',
    peak: 'pico',
    tension: 'tensión',
    control: 'control',
    form: 'forma',
    movement: 'movimiento',
    stationary: 'estables',
    upper: 'superiores',
    face: 'cara',
    high: 'alto',
    low: 'bajo',
    anchor: 'anclaje',
    point: 'punto',
    squat: 'sentadilla',
    alternating: 'alternando',
    stretch: 'estiramiento',
    inwards: 'hacia dentro',
    let: 'deja',
    legs: 'piernas',
    butt: 'glúteos',
    desired: 'deseado',
    number: 'número',
    repetitions: 'repeticiones',
    position: 'posición',
    starting: 'inicial',
}

const englishResidualWordMap: Record<string, string> = {
    back: 'espalda',
    moment: 'momento',
    bench: 'banco',
    forward: 'hacia delante',
    engaged: 'activado',
    edge: 'borde',
    so: 'así',
    hang: 'cuelga',
    fingers: 'dedos',
    end: 'final',
    directly: 'directamente',
    pad: 'almohadilla',
    muscles: 'músculos',
    press: 'empuje',
    chair: 'silla',
    proper: 'correcta',
    seconds: 'segundos',
    maintain: 'mantén',
    perform: 'realiza',
    wrists: 'muñecas',
    rack: 'soporte',
    narrower: 'más estrecho',
    narrow: 'estrecho',
    kettlebells: 'pesas rusas',
    kneel: 'arrodíllate',
    inward: 'hacia dentro',
    contraction: 'contracción',
    next: 'siguiente',
    once: 'una vez',
    decline: 'declinado',
    stability: 'estabilidad',
    supporting: 'apoyando',
    ears: 'orejas',
    lowering: 'bajando',
    ropes: 'cuerdas',
    allowing: 'permitiendo',
    engaging: 'activando',
    rotating: 'rotando',
    upwards: 'hacia arriba',
    lying: 'tumbado',
    pulling: 'tirando',
    this: 'este',
    reach: 'alcanza',
    twist: 'gira',
    level: 'nivel',
    they: 'ellos',
    comfortable: 'cómodo',
    row: 'remo',
    hanging: 'colgando',
    placed: 'colocado',
    emphasize: 'enfatiza',
    intensity: 'intensidad',
    supported: 'apoyado',
    resting: 'apoyando',
    thighs: 'muslos',
    touches: 'toca',
    tucked: 'metidos',
    underneath: 'debajo',
    alignment: 'alineación',
    elevated: 'elevado',
    'hip-width': 'anchura de cadera',
    forearm: 'antebrazo',
    below: 'debajo',
    'pull-up': 'dominada',
    time: 'tiempo',
    feeling: 'sensación',
    wide: 'ancho',
    relaxed: 'relajado',
    support: 'soporte',
    controlled: 'controlado',
    can: 'puede',
    shape: 'forma',
    resistance: 'resistencia',
    perpendicular: 'perpendicular',
    handstand: 'parada de manos',
    neck: 'cuello',
    forming: 'formando',
    highest: 'más alto',
    setting: 'configuración',
    opposite: 'opuesto',
    surface: 'superficie',
    'push-up': 'flexión',
    toe: 'punta',
    bars: 'barras',
    unrack: 'desencaja',
    backrest: 'respaldo',
    rowing: 'remo',
    contracted: 'contraído',
    stable: 'estable',
    do: 'haz',
    simultaneously: 'simultáneamente',
    stacked: 'apilados',
    creating: 'creando',
    motion: 'movimiento',
    almost: 'casi',
    take: 'toma',
    object: 'objeto',
    leaning: 'inclinando',
    platform: 'plataforma',
    blade: 'escápula',
    between: 'entre',
    few: 'pocos',
    manner: 'manera',
    long: 'largo',
    begin: 'empieza',
    'hand-over-hand': 'mano sobre mano',
    upward: 'hacia arriba',
    appropriate: 'adecuado',
    pass: 'pasa',
    slam: 'golpea',
    power: 'potencia',
    catch: 'atrapa',
    reaches: 'alcanza',
    around: 'alrededor',
    focus: 'enfoca',
    balance: 'equilibrio',
    backward: 'hacia atrás',
    roll: 'rueda',
    width: 'anchura',
    about: 'aproximadamente',
    upright: 'erguido',
    gently: 'suavemente',
    such: 'tal',
    standing: 'de pie',
    sliding: 'deslizando',
    lifting: 'levantando',
    diamond: 'diamante',
    chin: 'barbilla',
    toward: 'hacia',
    returning: 'volviendo',
    downward: 'hacia abajo',
    flex: 'flexiona',
    backwards: 'hacia atrás',
    placing: 'colocando',
    raised: 'elevado',
    inside: 'dentro',
    ear: 'oreja',
    lunge: 'zancada',
    repetition: 'repetición',
    firmly: 'firmemente',
    cross: 'cruza',
    mimicking: 'imitando',
    drawing: 'dibujando',
    bowstring: 'cuerda de arco',
    untwisting: 'desenroscando',
    twisting: 'girando',
    direction: 'dirección',
    rep: 'repetición',
    onto: 'sobre',
    sturdy: 'firme',
    leverage: 'apalancamiento',
    lifted: 'elevado',
    alternate: 'alterna',
    tuck: 'recoge',
    interlace: 'entrelaza',
    pick: 'toma',
    aiming: 'apuntando',
    movements: 'movimientos',
    assist: 'asiste',
    climbing: 'trepando',
    descend: 'desciende',
    controlling: 'controlando',
    descent: 'descenso',
    bringing: 'llevando',
    allow: 'permite',
    again: 'de nuevo',
    allows: 'permite',
    freely: 'libremente',
    securely: 'con seguridad',
    forcefully: 'con fuerza',
    entire: 'completo',
    generate: 'genera',
    including: 'incluyendo',
    bounce: 'rebota',
    straps: 'correas',
    loop: 'bucle',
    ends: 'extremos',
    same: 'mismo',
    intense: 'intenso',
    precision: 'precisión',
    lateral: 'lateral',
    elite: 'élite',
    pointed: 'apuntado',
    linear: 'lineal',
    declined: 'declinado',
    strength: 'fuerza',
    still: 'aún',
    find: 'encuentra',
    open: 'abre',
    space: 'espacio',
    enough: 'suficiente',
    room: 'espacio',
    kick: 'patea',
    wall: 'pared',
    come: 'ven',
    lowest: 'más bajo',
    accordingly: 'en consecuencia',
    balancing: 'equilibrando',
    pressing: 'presionando',
    help: 'ayuda',
    will: 'va a',
    be: 'estar',
    breathe: 'respira',
    gentle: 'suave',
    arc: 'arco',
    contract: 'contrae',
    balls: 'balones',
    raising: 'elevando',
    getting: 'obteniendo',
    secure: 'asegura',
    secured: 'asegurado',
    assume: 'adopta',
    rings: 'anillas',
    touch: 'toca',
    explosively: 'de forma explosiva',
    throwing: 'lanzando',
    possible: 'posible',
    beside: 'junto a',
    little: 'poco',
    joints: 'articulaciones',
    planted: 'apoyados',
    thumbs: 'pulgares',
    index: 'índice',
    glutes: 'glúteos',
    formed: 'formado',
}

const nonEnglishLoanwordSet = new Set(['core', 'smith', 'ez'])

const englishInstructionLexicon = new Set([
    ...Object.keys(englishToSpanishWordMap),
    ...Object.keys(englishResidualWordMap),
])

const englishInstructionStopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'to',
    'of',
    'in',
    'on',
    'at',
    'for',
    'from',
    'by',
    'with',
    'without',
    'your',
    'you',
    'then',
    'while',
])

const spanishPrecisionReplacements: Array<[RegExp, string]> = [
    [/\bhaz una pausa breve\b/gi, 'haz una pausa de 1 segundo'],
    [/\blentamente\b/gi, 'de forma controlada'],
    [/\bmanteniendo el core activado\b/gi, 'manteniendo el abdomen firme'],
    [/\bmantén el core activado\b/gi, 'mantén el abdomen firme'],
    [/\bmanteniendo la espalda recta\b/gi, 'manteniendo la espalda neutra'],
    [/\bmantén la espalda recta\b/gi, 'mantén la espalda neutra'],
    [/\bmanteniendo el cuerpo recto\b/gi, 'manteniendo el cuerpo alineado'],
    [/\bde vuelta a la posición inicial\b/gi, 'vuelve a la posición inicial con control'],
    [/\bdurante el número de repeticiones deseado\b/gi, 'durante las repeticiones objetivo'],
]

function normalizeInstructionText(value: string): string {
    return value
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        .trim()
}

function countLikelyEnglishWords(value: string): number {
    const tokens = value.toLowerCase().match(/\b[a-z][a-z'-]*\b/g) ?? []

    return tokens.reduce((count, token) => {
        if (token === 'a' || nonEnglishLoanwordSet.has(token)) {
            return count
        }

        if (englishInstructionLexicon.has(token) || englishInstructionSignalPattern.test(token)) {
            return count + 1
        }

        return count
    }, 0)
}

function applySpanishDictionaryPass(value: string): string {
    let translated = applyTextReplacements(value, englishToSpanishFragmentReplacements)
    translated = applyWordTranslations(translated, englishToSpanishWordMap)
    translated = applyWordTranslations(translated, englishResidualWordMap)
    return translated
}

function removeResidualEnglishWords(value: string): string {
    const cleaned = value.replace(/\b[a-z][a-z'-]*\b/gi, (word) => {
        const lower = word.toLowerCase()

        if (nonEnglishLoanwordSet.has(lower)) {
            return word
        }

        const translated = englishToSpanishWordMap[lower] ?? englishResidualWordMap[lower]
        if (translated) {
            return translated
        }

        if (englishInstructionLexicon.has(lower) || englishInstructionStopWords.has(lower)) {
            return ''
        }

        return word
    })

    return normalizeInstructionText(cleaned)
}

function refineSpanishInstructionText(value: string): string {
    let refined = normalizeInstructionText(value)
    if (!refined) {
        return ''
    }

    refined = applyTextReplacements(refined, spanishPrecisionReplacements)
    refined = normalizeInstructionText(refined)

    if (!/[.!?]$/.test(refined)) {
        refined = `${refined}.`
    }

    return refined.charAt(0).toUpperCase() + refined.slice(1)
}

function buildSpanishFallbackInstruction(sourceText: string): string {
    const lower = sourceText.toLowerCase()

    if (/\b(row|remo|pull|curl|pulldown|chin-up|chin up|dominada)\b/.test(lower)) {
        return 'Tira con control hacia el torso, mantén el pecho alto y junta las escápulas al final.'
    }

    if (/\b(press|push|empuja|fondo|dip|extensi[oó]n)\b/.test(lower)) {
        return 'Empuja con control, estabiliza el tronco y extiende sin bloquear bruscamente los codos.'
    }

    if (/\b(sentadilla|squat|zancada|lunge|deadlift|peso muerto|hinge)\b/.test(lower)) {
        return 'Desciende con la espalda neutra, mantén la cadera alineada y sube de forma estable.'
    }

    if (/\b(raise|elevaci[oó]n|fly|apertura|lateral)\b/.test(lower)) {
        return 'Eleva hasta el rango útil sin balanceo y desciende de forma controlada en cada repetición.'
    }

    if (/\b(plancha|plank|hold|isom[eé]trico)\b/.test(lower)) {
        return 'Mantén el abdomen firme, glúteos activos y respiración constante durante todo el esfuerzo.'
    }

    return 'Realiza cada repetición con control, activa el core y evita balanceos para mantener la técnica.'
}

function buildEnglishFallbackInstruction(sourceText: string): string {
    const lower = sourceText.toLowerCase()

    if (/\b(row|remo|pull|curl|pulldown|chin-up|chin up|dominada)\b/.test(lower)) {
        return 'Pull under control toward your torso, keep your chest up, and squeeze your shoulder blades at the end.'
    }

    if (/\b(press|push|empuja|fondo|dip|extensi[oó]n)\b/.test(lower)) {
        return 'Press under control, brace your trunk, and extend without aggressively locking your elbows.'
    }

    if (/\b(sentadilla|squat|zancada|lunge|deadlift|peso muerto|hinge)\b/.test(lower)) {
        return 'Lower with a neutral spine, keep your hips aligned, and stand up with stable control.'
    }

    if (/\b(raise|elevaci[oó]n|fly|apertura|lateral)\b/.test(lower)) {
        return 'Raise through a useful range without swinging and lower with controlled tempo each rep.'
    }

    if (/\b(plancha|plank|hold|isom[eé]trico)\b/.test(lower)) {
        return 'Keep your core braced, glutes active, and breathing steady throughout the hold.'
    }

    return 'Perform each rep with control, keep your core braced, and avoid momentum.'
}

function dedupeInstructionSteps(instructions: string[]): string[] {
    const seen = new Set<string>()
    const deduped: string[] = []

    for (const instruction of instructions) {
        const normalized = normalizeInstructionText(instruction)
        if (!normalized) {
            continue
        }

        const key = normalized.toLowerCase()
        if (seen.has(key)) {
            continue
        }

        seen.add(key)
        deduped.push(normalized)
    }

    return deduped
}

function cleanSpanishInstructionText(value: string): string {
    let normalized = normalizeInstructionText(value)

    if (!normalized) {
        return ''
    }

    if (hasEnglishInstructionSignals(normalized)) {
        normalized = normalizeInstructionText(applySpanishDictionaryPass(normalized))
    }

    // Retry once when there is still substantial English residue after the first pass.
    if (shouldRetryMixedInstruction(normalized)) {
        normalized = normalizeInstructionText(applySpanishDictionaryPass(normalized))
    }

    if (hasEnglishInstructionSignals(normalized)) {
        normalized = removeResidualEnglishWords(normalized)
    }

    normalized = refineSpanishInstructionText(normalized)

    if (!normalized) {
        return buildSpanishFallbackInstruction(value)
    }

    if (countLikelyEnglishWords(normalized) > 4) {
        return buildSpanishFallbackInstruction(value)
    }

    return normalized
}

function translateEnglishInstructionToSpanish(text: string): string {
    const trimmed = text.trim()
    if (!trimmed) {
        return text
    }

    if (detectInstructionLanguage(trimmed) === 'es' && !isMixedInstruction(trimmed)) {
        return trimmed
    }

    let translated = trimmed

    for (const [pattern, replacement] of spanishLeadReplacements) {
        if (pattern.test(translated)) {
            translated = translated.replace(pattern, replacement)
            break
        }
    }

    translated = applySpanishDictionaryPass(translated)

    translated = cleanSpanishInstructionText(translated)

    if (!translated) {
        return buildSpanishFallbackInstruction(trimmed)
    }

    return translated
}

function shouldTranslateInstructions(instructions: string[], language: 'es' | 'en') {
    return instructions.some(
        (instruction) =>
            detectInstructionLanguage(instruction) !== language || isMixedInstruction(instruction),
    )
}

async function translateInstruction(
    text: string,
    sourceLanguage: 'es' | 'en',
    targetLanguage: 'es' | 'en',
    signal: AbortSignal,
): Promise<string> {
    const normalizedText = text.trim()
    if (!normalizedText) {
        return text
    }

    if (signal.aborted) {
        return normalizedText
    }

    if (sourceLanguage === targetLanguage && !isMixedInstruction(normalizedText)) {
        return normalizedText
    }

    const cacheKey = `${sourceLanguage}|${targetLanguage}|${normalizedText}`
    const cached = translatedInstructionCache.get(cacheKey)
    if (cached) {
        return cached
    }

    let translated = normalizedText

    if (targetLanguage === 'es') {
        translated = translateEnglishInstructionToSpanish(normalizedText)
    }

    if (targetLanguage === 'en') {
        translated =
            sourceLanguage === 'en' && !isMixedInstruction(normalizedText)
                ? normalizedText
                : buildEnglishFallbackInstruction(normalizedText)
    }

    translatedInstructionCache.set(cacheKey, translated)
    return translated
}

async function maybeTranslateInstructions(
    instructions: string[],
    language: 'es' | 'en',
    signal: AbortSignal,
): Promise<string[]> {
    if (instructions.length === 0) {
        return instructions
    }

    const translated = await Promise.all(
        instructions.map((instruction) =>
            translateInstruction(
                instruction,
                detectInstructionLanguage(instruction),
                language,
                signal,
            ),
        ),
    )

    const deduped = dedupeInstructionSteps(translated)

    if (language === 'es') {
        return deduped.map((instruction) => cleanSpanishInstructionText(instruction))
    }

    return deduped
}

function buildExerciseGifUrl(exerciseId: string, apiKey: string): string {
    return `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${encodeURIComponent(exerciseId)}&rapidapi-key=${encodeURIComponent(apiKey)}`
}

function normalizeGifUrl(url: string): string {
    const normalized = url.trim()
    if (!normalized) {
        return ''
    }

    return normalized.replace(/^http:\/\//i, 'https://')
}

function resolveExerciseGifUrl(item: ExerciseDbItem, apiKey?: string): string {
    if (item.id && apiKey) {
        const cached = gifUrlCache.get(item.id)
        if (cached) {
            return cached
        }

        const resolved = buildExerciseGifUrl(item.id, apiKey)
        gifUrlCache.set(item.id, resolved)
        return resolved
    }

    if (item.gifUrl?.trim()) {
        return normalizeGifUrl(item.gifUrl)
    }

    return ''
}

function selectBestMatch(items: ExerciseDbItem[], exerciseName: string): ExerciseDbItem | null {
    if (items.length === 0) {
        return null
    }

    const normalizedName = normalizeExerciseName(exerciseName)
    const exact = items.find((item) => normalizeExerciseName(item.name ?? '') === normalizedName)
    if (exact) {
        return exact
    }

    const candidateTokens = tokenizeForMatch(exerciseName)
    if (candidateTokens.length === 0) {
        return null
    }

    const strongTokenMatch = items.find((item) => {
        const itemTokens = new Set(tokenizeForMatch(item.name ?? ''))
        if (itemTokens.size === 0) {
            return false
        }

        return candidateTokens.every((token) => itemTokens.has(token))
    })

    return strongTokenMatch ?? null
}

function tokenizeForMatch(value: string): string[] {
    return normalizeExerciseName(value)
        .split(' ')
        .filter((token) => token.length > 2)
}

function buildQueryCandidates(exerciseName: string, options?: UseExerciseDetailOptions): string[] {
    const candidates = new Set<string>()

    if (options?.exerciseDbName?.trim()) {
        candidates.add(normalizeExerciseName(options.exerciseDbName))
    }

    for (const alias of options?.exerciseDbAliases ?? []) {
        if (alias.trim()) {
            candidates.add(normalizeExerciseName(alias))
        }
    }

    for (const candidate of getExerciseDbQueryCandidates(exerciseName)) {
        candidates.add(candidate)
    }

    return Array.from(candidates)
}

async function searchExerciseByCandidates(
    candidates: string[],
    apiKey: string,
    signal: AbortSignal,
): Promise<{ item: ExerciseDbItem; usedCandidate: string } | null> {
    for (const candidate of candidates) {
        const response = await fetch(
            `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(candidate)}`,
            buildExerciseDbRequestInit(apiKey, signal),
        )

        if (!response.ok) {
            continue
        }

        const payload = (await response.json()) as ExerciseDbItem[]
        if (!Array.isArray(payload) || payload.length === 0) {
            continue
        }

        const best = selectBestMatch(payload, candidate)
        if (best?.id) {
            return { item: best, usedCandidate: candidate }
        }
    }

    return null
}

async function searchExerciseById(exerciseDbId: string, apiKey: string, signal: AbortSignal): Promise<ExerciseDbItem | null> {
    const response = await fetch(
        `https://${EXERCISE_DB_RAPIDAPI_HOST}/exercises/exercise/${encodeURIComponent(exerciseDbId)}`,
        buildExerciseDbRequestInit(apiKey, signal),
    )

    if (!response.ok) {
        return null
    }

    const payload = (await response.json()) as ExerciseDbItem
    if (!payload?.id) {
        return null
    }

    return payload
}

export function useExerciseDetail(exerciseName: string, options?: UseExerciseDetailOptions): UseExerciseDetailResult {
    const normalizedName = useMemo(() => normalizeExerciseName(exerciseName), [exerciseName])
    const currentLanguage = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en'
    const apiKey = import.meta.env.VITE_EXERCISEDB_API_KEY
    const exerciseId = options?.exerciseId
    const exerciseDbId = options?.exerciseDbId
    const exerciseDbName = options?.exerciseDbName
    const exerciseDbAliases = options?.exerciseDbAliases
    const fallbackInstructionsValue = options?.fallbackInstructions
    const fallbackGifUrl = normalizeGifUrl(options?.fallbackGifUrl ?? '')
    const fallbackInstructionSignature = normalizeExerciseName(fallbackInstructionsValue ?? '')
    const aliasSignature = (exerciseDbAliases ?? []).join('|')
    const cacheKey = `${INSTRUCTION_TRANSLATION_CACHE_VERSION}|${normalizedName}|${exerciseDbId ?? ''}|${exerciseDbName ?? ''}|${aliasSignature}|${currentLanguage}|${fallbackGifUrl}|${fallbackInstructionSignature}`
    const cached = normalizedName ? detailCache.get(cacheKey) : undefined
    const shouldFetch = Boolean(normalizedName && cached === undefined)
    const [state, setState] = useState<UseExerciseDetailResult>({
        data: null,
        isLoading: false,
        isTranslatingInstructions: false,
        notFound: false,
        debug: {
            source: 'none',
            candidatesTried: [],
            gifValidated: false,
        },
    })

    useEffect(() => {
        if (!shouldFetch) {
            return
        }

        const controller = new AbortController()

        const run = async () => {
            const candidates = buildQueryCandidates(exerciseName, {
                exerciseDbId,
                exerciseDbName,
                exerciseDbAliases,
            })
            const fallbackInstructions = parseFallbackInstructions(fallbackInstructionsValue)
                .map((instruction) => stripStepPrefix(instruction))
                .filter(Boolean)
            const resolvedFallbackGifUrl =
                fallbackGifUrl || (apiKey && exerciseDbId?.trim() ? buildExerciseGifUrl(exerciseDbId, apiKey) : '')

            setState({
                data: null,
                isLoading: true,
                isTranslatingInstructions: false,
                notFound: false,
                debug: {
                    source: 'none',
                    candidatesTried: candidates,
                    gifValidated: false,
                },
            })

            try {
                const byId = apiKey && exerciseDbId?.trim()
                    ? await searchExerciseById(exerciseDbId, apiKey, controller.signal)
                    : null
                let byCandidate: { item: ExerciseDbItem; usedCandidate: string } | null = null

                if (!byId && apiKey) {
                    byCandidate = await searchExerciseByCandidates(candidates, apiKey, controller.signal)
                }

                const bestMatch = byId ?? byCandidate?.item ?? null
                const resolvedByCandidate = !byId && Boolean(byCandidate?.item.id)

                await persistResolvedExerciseDbLink({
                    exerciseId,
                    currentExerciseDbId: exerciseDbId,
                    currentExerciseDbName: exerciseDbName,
                    resolvedExerciseDbId: byCandidate?.item.id,
                    resolvedExerciseDbName: byCandidate?.item.name,
                    resolvedByCandidate,
                })

                if (!bestMatch) {
                    if (resolvedFallbackGifUrl || fallbackInstructions.length > 0) {
                        const needsFallbackTranslation =
                            fallbackInstructions.length > 0 &&
                            shouldTranslateInstructions(fallbackInstructions, currentLanguage)

                        if (needsFallbackTranslation) {
                            setState({
                                data: {
                                    gifUrl: resolvedFallbackGifUrl,
                                    target: '',
                                    equipment: '',
                                    instructions: fallbackInstructions,
                                    secondaryMuscles: [],
                                },
                                isLoading: false,
                                isTranslatingInstructions: true,
                                notFound: false,
                                debug: {
                                    source: exerciseDbId ? 'id' : 'none',
                                    resolvedExerciseDbId: exerciseDbId,
                                    candidatesTried: candidates,
                                    gifValidated: Boolean(resolvedFallbackGifUrl),
                                },
                            })
                        }

                        const translatedFallbackInstructions = needsFallbackTranslation
                            ? await maybeTranslateInstructions(fallbackInstructions, currentLanguage, controller.signal)
                            : fallbackInstructions

                        const fallbackData: ExerciseDetailData = {
                            gifUrl: resolvedFallbackGifUrl,
                            target: '',
                            equipment: '',
                            instructions: translatedFallbackInstructions,
                            secondaryMuscles: [],
                        }

                        const fallbackEntry: CachedDetailEntry = {
                            data: fallbackData,
                            notFound: false,
                            debug: {
                                source: exerciseDbId ? 'id' : 'none',
                                resolvedExerciseDbId: exerciseDbId,
                                candidatesTried: candidates,
                                gifValidated: Boolean(resolvedFallbackGifUrl),
                            },
                        }

                        detailCache.set(cacheKey, fallbackEntry)
                        setState({
                            data: fallbackData,
                            isLoading: false,
                            isTranslatingInstructions: false,
                            notFound: false,
                            debug: fallbackEntry.debug,
                        })
                        return
                    }

                    const notFoundEntry: CachedDetailEntry = {
                        data: null,
                        notFound: true,
                        debug: {
                            source: 'none',
                            candidatesTried: candidates,
                            gifValidated: false,
                        },
                    }
                    detailCache.set(cacheKey, notFoundEntry)
                    setState({ data: null, isLoading: false, isTranslatingInstructions: false, notFound: true, debug: notFoundEntry.debug })
                    return
                }

                const rawInstructions = Array.isArray(bestMatch.instructions)
                    ? bestMatch.instructions.map((instruction) => stripStepPrefix(instruction)).filter(Boolean)
                    : []
                const instructionSource = rawInstructions.length > 0 ? rawInstructions : fallbackInstructions
                const detailData: ExerciseDetailData = {
                    gifUrl: resolveExerciseGifUrl(bestMatch, apiKey) || resolvedFallbackGifUrl,
                    target: bestMatch.target ?? '',
                    equipment: bestMatch.equipment ?? '',
                    instructions: instructionSource,
                    secondaryMuscles: Array.isArray(bestMatch.secondaryMuscles) ? bestMatch.secondaryMuscles : [],
                }

                const needsTranslation =
                    instructionSource.length > 0 &&
                    shouldTranslateInstructions(instructionSource, currentLanguage)

                if (needsTranslation) {
                    setState({
                        data: detailData,
                        isLoading: false,
                        isTranslatingInstructions: true,
                        notFound: false,
                        debug: {
                            source: byId || bestMatch.id ? 'id' : 'candidate',
                            resolvedExerciseDbId: bestMatch.id,
                            resolvedExerciseDbName: bestMatch.name,
                            usedCandidate: byCandidate?.usedCandidate,
                            candidatesTried: candidates,
                            gifValidated: Boolean(detailData.gifUrl),
                            lastError: detailData.gifUrl ? undefined : 'gif_fetch_failed',
                        },
                    })

                    detailData.instructions = await maybeTranslateInstructions(
                        instructionSource,
                        currentLanguage,
                        controller.signal,
                    )
                }

                const successEntry: CachedDetailEntry = {
                    data: detailData,
                    notFound: false,
                    debug: {
                        source: byId || bestMatch.id ? 'id' : 'candidate',
                        resolvedExerciseDbId: bestMatch.id,
                        resolvedExerciseDbName: bestMatch.name,
                        usedCandidate: byCandidate?.usedCandidate,
                        candidatesTried: candidates,
                        gifValidated: Boolean(detailData.gifUrl),
                        lastError: detailData.gifUrl ? undefined : 'gif_fetch_failed',
                    },
                }

                detailCache.set(cacheKey, successEntry)
                setState({ data: detailData, isLoading: false, isTranslatingInstructions: false, notFound: false, debug: successEntry.debug })
            } catch {
                if (!controller.signal.aborted) {
                    if (resolvedFallbackGifUrl || fallbackInstructions.length > 0) {
                        const translatedFallbackInstructions = await maybeTranslateInstructions(
                            fallbackInstructions,
                            currentLanguage,
                            controller.signal,
                        )
                        const fallbackData: ExerciseDetailData = {
                            gifUrl: resolvedFallbackGifUrl,
                            target: '',
                            equipment: '',
                            instructions: translatedFallbackInstructions,
                            secondaryMuscles: [],
                        }

                        const fallbackEntry: CachedDetailEntry = {
                            data: fallbackData,
                            notFound: false,
                            debug: {
                                source: exerciseDbId ? 'id' : 'none',
                                resolvedExerciseDbId: exerciseDbId,
                                candidatesTried: candidates,
                                gifValidated: Boolean(resolvedFallbackGifUrl),
                                lastError: 'request_failed',
                            },
                        }

                        detailCache.set(cacheKey, fallbackEntry)
                        setState({ data: fallbackData, isLoading: false, isTranslatingInstructions: false, notFound: false, debug: fallbackEntry.debug })
                        return
                    }

                    const errorEntry: CachedDetailEntry = {
                        data: null,
                        notFound: true,
                        debug: {
                            source: 'none',
                            candidatesTried: buildQueryCandidates(exerciseName, {
                                exerciseDbId,
                                exerciseDbName,
                                exerciseDbAliases,
                            }),
                            gifValidated: false,
                            lastError: 'request_failed',
                        },
                    }
                    detailCache.set(cacheKey, errorEntry)
                    setState({ data: null, isLoading: false, isTranslatingInstructions: false, notFound: true, debug: errorEntry.debug })
                }
            }
        }

        void run()

        return () => {
            controller.abort()
        }
    }, [
        aliasSignature,
        apiKey,
        cacheKey,
        currentLanguage,
        exerciseId,
        exerciseDbAliases,
        exerciseDbId,
        exerciseDbName,
        exerciseName,
        fallbackGifUrl,
        fallbackInstructionsValue,
        normalizedName,
        shouldFetch,
    ])

    if (!normalizedName) {
        return {
            data: null,
            isLoading: false,
            isTranslatingInstructions: false,
            notFound: false,
            debug: {
                source: 'none',
                candidatesTried: [],
                gifValidated: false,
                lastError: undefined,
            },
        }
    }

    if (cached !== undefined) {
        return {
            data: cached.data,
            isLoading: false,
            isTranslatingInstructions: false,
            notFound: cached.notFound,
            debug: {
                ...cached.debug,
                source: 'cache',
            },
        }
    }

    return state
}
