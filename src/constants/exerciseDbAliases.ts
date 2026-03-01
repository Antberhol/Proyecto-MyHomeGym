const exerciseDbAliases: Record<string, string[]> = {
    'press de banca': ['barbell bench press', 'bench press', 'flat barbell bench press'],
    'press inclinado con mancuernas': ['incline dumbbell press', 'incline db press'],
    'press declinado': ['decline bench press', 'decline barbell bench press'],
    'aperturas con mancuernas': ['dumbbell fly', 'dumbbell chest fly'],
    'cruce de poleas': ['cable crossover', 'cable fly', 'cable chest fly'],
    'press de pecho en maquina': ['machine chest press', 'chest press machine'],
    flexiones: ['push up', 'push ups', 'bodyweight push up'],
    'fondos en paralelas': ['parallel bar dip', 'chest dip', 'dips'],
    dominadas: ['pull up', 'pull ups', 'chin up'],
    'jalon al pecho': ['lat pulldown', 'cable lat pulldown', 'wide grip lat pulldown'],
    'jalon al pecho con agarre estrecho': ['close grip lat pulldown', 'narrow grip lat pulldown'],
    'pulldown con agarre estrecho': ['close grip lat pulldown', 'narrow grip lat pulldown'],
    'remo con barra': ['barbell bent over row', 'barbell row', 'bent over row'],
    'remo con mancuerna': ['one arm dumbbell row', 'single arm dumbbell row'],
    'remo en polea baja': ['seated cable row', 'low cable row'],
    'remo pecho apoyado': ['chest supported row', 'incline dumbbell row'],
    'face pull': ['face pull', 'rope face pull', 'cable face pull', 'band face pull', 'banded face pull'],
    'peso muerto': ['deadlift', 'barbell deadlift', 'conventional deadlift'],
    'peso muerto rumano': ['romanian deadlift', 'rdl', 'barbell romanian deadlift', 'dumbbell romanian deadlift'],
    'peso muerto a una pierna': ['single leg deadlift', 'single leg romanian deadlift'],
    'encogimientos de trapecio': ['dumbbell shrug', 'barbell shrug', 'shrug'],
    'sentadilla trasera': ['barbell back squat', 'back squat'],
    'sentadilla frontal': ['front squat', 'barbell front squat'],
    'sentadilla en multipower': ['smith machine squat', 'smith squat'],
    'prensa de piernas': ['leg press', 'machine leg press'],
    'zancadas caminando': ['walking lunge', 'walking lunges'],
    'sentadilla bulgara': ['bulgarian split squat', 'rear foot elevated split squat'],
    'hip thrust': ['barbell hip thrust', 'hip thrust', 'glute bridge', 'barbell glute bridge'],
    'extension de cuadriceps': ['leg extension', 'machine leg extension'],
    'curl femoral': ['hamstring curl', 'lying leg curl', 'leg curl'],
    'elevacion de gemelos': ['standing calf raise', 'calf raise', 'seated calf raise'],
    'press militar': ['military press', 'barbell shoulder press', 'overhead press'],
    'press arnold': ['arnold press', 'dumbbell arnold press'],
    'press de hombros con mancuernas sentado': ['seated dumbbell shoulder press', 'seated dumbbell press'],
    'elevaciones laterales': ['lateral raise', 'dumbbell lateral raise', 'cable lateral raise'],
    'elevaciones frontales': ['front raise', 'dumbbell front raise'],
    pajaros: ['rear delt fly', 'reverse fly', 'rear delt raise'],
    'remo al menton': ['upright row', 'barbell upright row', 'cable upright row'],
    'press hombro en maquina': ['machine shoulder press', 'shoulder press machine'],
    'press cerrado': ['close grip bench press', 'close grip barbell bench press'],
    'curl de biceps con barra': ['barbell curl', 'standing barbell curl'],
    'curl de biceps con barra z': ['ez bar curl', 'ez bar biceps curl'],
    'curl alterno con mancuernas': ['alternating dumbbell curl', 'alternating db curl'],
    'curl martillo': ['hammer curl', 'dumbbell hammer curl'],
    'curl martillo con mancuernas': ['dumbbell hammer curl', 'hammer curl'],
    'curl martillo en polea con cuerda': ['cable hammer curl', 'rope hammer curl'],
    'curl en banco scott': ['preacher curl', 'ez bar preacher curl'],
    'curl en polea': ['cable curl', 'standing cable curl'],
    'curl de biceps en polea baja': ['low cable curl', 'cable curl'],
    'curl bayesiano en polea': ['bayesian curl', 'bayesian cable curl'],
    'curl concentrado': ['concentration curl', 'dumbbell concentration curl', 'seated concentration curl'],
    'press frances': ['lying triceps extension', 'skull crusher', 'barbell skull crusher'],
    'press frances con mancuerna a una mano': ['one arm dumbbell triceps extension', 'single arm overhead tricep extension'],
    'extension de triceps en polea': ['tricep pushdown', 'cable triceps pushdown'],
    'extension de triceps en polea con barra': ['straight bar tricep pushdown', 'tricep pushdown', 'cable triceps pushdown'],
    'fondos en banco': ['bench dip', 'bench dips'],
    'patada de triceps': ['triceps kickback', 'dumbbell triceps kickback'],
    'extension overhead con mancuerna': ['overhead tricep extension', 'dumbbell overhead triceps extension'],
    'extension de triceps con cuerda': ['rope tricep pushdown', 'rope triceps pushdown'],
    'extension de triceps en polea con cuerda': ['rope tricep pushdown', 'rope triceps pushdown'],
    'extension overhead de triceps en polea con cuerda': ['overhead rope tricep extension', 'cable overhead tricep extension'],
    'plancha frontal': ['plank', 'forearm plank'],
    'plancha lateral': ['side plank'],
    'crunch abdominal': ['crunch', 'abdominal crunch'],
    'ab wheel rollout': ['ab wheel rollout', 'ab wheel'],
    'elevacion de piernas': ['hanging leg raise', 'leg raise', 'hanging knee raise'],
    'mountain climbers': ['mountain climber'],
    'russian twist': ['russian twist'],
    'dead bug': ['dead bug'],
    'hollow hold': ['hollow hold'],
    'crunch en polea': ['cable crunch', 'kneeling cable crunch'],
}

const tokenVariantMap: Record<string, string[]> = {
    barra: ['barbell'],
    barbell: ['barra'],
    'barra z': ['ez bar'],
    ez: ['ez', 'easy'],
    mancuernas: ['dumbbell', 'dumbbells', 'db'],
    mancuerna: ['dumbbell', 'db'],
    dumbbell: ['mancuerna', 'mancuernas'],
    dumbbells: ['mancuernas'],
    polea: ['cable'],
    cable: ['polea'],
    cuerda: ['rope'],
    rope: ['cuerda'],
    maquina: ['machine'],
    machine: ['maquina'],
    multipower: ['smith', 'smith machine'],
    smith: ['multipower'],
    banda: ['band', 'resistance', 'resistance band'],
    band: ['banda'],
    elastica: ['resistance', 'band'],
    banco: ['bench'],
    bench: ['banco'],
    sentado: ['seated'],
    seated: ['sentado'],
    pie: ['standing'],
    standing: ['de pie'],
}

const phraseVariantMap: Record<string, string[]> = {
    ' con mancuernas': [' with dumbbell', ' with dumbbells', ' dumbbell'],
    ' con mancuerna': [' with dumbbell', ' dumbbell'],
    ' con barra': [' with barbell', ' barbell'],
    ' con barra z': [' with ez bar', ' ez bar'],
    ' en polea': [' on cable', ' cable'],
    ' en maquina': [' machine', ' on machine'],
    ' en multipower': [' smith machine', ' smith'],
    ' con cuerda': [' rope', ' with rope'],
    ' con banda': [' resistance band', ' band'],
    ' con banda elastica': [' resistance band', ' band'],
    ' a una mano': [' single arm', ' one arm', ' unilateral'],
    ' unilateral': [' single arm', ' one arm'],
    ' a una pierna': [' single leg', ' unilateral'],
    ' agarre estrecho': [' close grip', ' narrow grip'],
    ' agarre ancho': [' wide grip'],
    ' de pie': [' standing'],
    ' sentado': [' seated'],
}

const MAX_QUERY_CANDIDATES = 24

export function normalizeExerciseName(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
}

export function getExerciseDbQueryCandidates(exerciseName: string) {
    const normalized = normalizeExerciseName(exerciseName)
    const aliasCandidates = exerciseDbAliases[normalized] ?? []

    const prioritizedSeeds: string[] = []
    const addSeed = (value: string) => {
        const normalizedSeed = normalizeExerciseName(value)
        if (!normalizedSeed || prioritizedSeeds.includes(normalizedSeed)) {
            return
        }
        prioritizedSeeds.push(normalizedSeed)
    }

    for (const alias of aliasCandidates) {
        addSeed(alias)
    }
    addSeed(normalized)

    const noStopWords = normalized
        .replace(/\b(de|con|en|al|del|la|el|los|las)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    if (noStopWords.length >= 4) {
        addSeed(noStopWords)
    }

    const candidates: string[] = []
    const seen = new Set<string>()
    const addCandidate = (value: string) => {
        const normalizedCandidate = normalizeExerciseName(value)
        if (!normalizedCandidate || seen.has(normalizedCandidate)) {
            return
        }

        seen.add(normalizedCandidate)
        candidates.push(normalizedCandidate)
    }

    for (const seed of prioritizedSeeds) {
        for (const variant of expandCandidateVariants(seed)) {
            addCandidate(variant)
            if (candidates.length >= MAX_QUERY_CANDIDATES) {
                return candidates
            }
        }
    }

    return candidates
}

function expandCandidateVariants(value: string) {
    const normalizedSeed = normalizeExerciseName(value)
    if (!normalizedSeed) {
        return []
    }

    const variants = new Set<string>([normalizedSeed])
    const queue: string[] = [normalizedSeed]

    const addVariant = (candidate: string) => {
        const normalizedCandidate = normalizeExerciseName(candidate)
        if (!normalizedCandidate || variants.has(normalizedCandidate) || variants.size >= 120) {
            return
        }

        variants.add(normalizedCandidate)
        queue.push(normalizedCandidate)
    }

    while (queue.length > 0 && variants.size < 120) {
        const current = queue.shift()!

        for (const [phrase, replacements] of Object.entries(phraseVariantMap)) {
            if (!current.includes(phrase)) {
                continue
            }

            for (const replacement of replacements) {
                addVariant(current.replace(phrase, replacement))
            }
        }

        const tokens = current.split(' ')
        for (let index = 0; index < tokens.length; index += 1) {
            const token = tokens[index]
            const alternatives = tokenVariantMap[token]
            if (!alternatives || alternatives.length === 0) {
                continue
            }

            for (const alternative of alternatives) {
                const nextTokens = [...tokens]
                nextTokens[index] = alternative
                addVariant(nextTokens.join(' '))
            }
        }
    }

    return Array.from(variants)
}

export function getPreferredExerciseDbName(exerciseName: string) {
    const normalized = normalizeExerciseName(exerciseName)
    const aliasCandidates = exerciseDbAliases[normalized] ?? []

    if (aliasCandidates.length > 0) {
        return aliasCandidates[0]
    }

    return undefined
}

export function getExerciseDbAliasesForName(exerciseName: string) {
    const normalized = normalizeExerciseName(exerciseName)
    return exerciseDbAliases[normalized] ?? []
}
