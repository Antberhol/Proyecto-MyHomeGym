const exerciseDbAliases: Record<string, string[]> = {
    'press de banca': ['barbell bench press', 'bench press'],
    'press inclinado con mancuernas': ['incline dumbbell press', 'incline db press'],
    'press declinado con barra': ['decline bench press', 'decline barbell bench press'],
    'aperturas con mancuernas': ['dumbbell fly', 'dumbbell chest fly', 'flat bench dumbbell fly'],
    'cruce de poleas': ['cable crossover', 'cable fly', 'cable chest fly'],
    'press de pecho en maquina': ['machine chest press', 'chest press machine'],
    flexiones: ['push up', 'push-up', 'push ups'],
    'pullover con mancuerna': ['dumbbell pullover', 'straight arm pullover', 'lying dumbbell pullover'],
    'press de banca con pausa': ['pause bench press', 'bench press pause'],
    'press de banca con mancuernas alterno': ['alternating dumbbell bench press', 'dumbbell bench press alternate'],
    'press de banca en multipower': ['smith machine bench press', 'smith bench press'],
    'aperturas en peck-deck': ['pec deck fly', 'pec deck', 'machine fly', 'chest fly machine'],
    'aperturas inversas en peck-deck': ['reverse pec deck', 'reverse fly machine', 'pec deck rear delt fly'],
    'press inclinado en maquina': ['incline machine chest press', 'machine incline press'],
    'press de pecho con mancuernas neutras': ['neutral grip dumbbell bench press', 'hammer grip dumbbell press'],
    'push up diamante': ['diamond push up', 'close grip push up', 'triangle push up'],
    'cruce de poleas alto-bajo': ['high to low cable fly', 'high cable crossover'],
    'cruce de poleas bajo-alto': ['low to high cable fly', 'low cable crossover'],
    'press jm': ['jm press', 'jm barbell press'],
    'fondos en paralelas': ['parallel bar dip', 'chest dip', 'tricep dip'],

    dominadas: ['pull up', 'pull-up', 'chin up', 'wide grip pull up'],
    'dominadas supinas': ['chin up', 'supinated pull up', 'underhand pull up'],
    'dominadas asistidas': ['assisted pull up', 'machine assisted pull up'],
    'jalon al pecho': ['lat pulldown', 'cable lat pulldown', 'wide grip lat pulldown'],
    'jalon tras nuca': ['behind neck lat pulldown', 'lat pulldown behind neck'],
    'jalon al pecho con agarre estrecho': ['close grip lat pulldown', 'narrow grip lat pulldown'],
    'pulldown con agarre estrecho': ['close grip lat pulldown', 'narrow grip lat pulldown'],
    'pulldown brazos rectos': ['straight arm pulldown', 'straight arm lat pulldown', 'cable straight arm pulldown'],
    'pullover en polea': ['cable pullover', 'straight arm cable pulldown'],
    'pullover en maquina': ['machine pullover', 'leverage machine pullover'],
    'remo con barra': ['barbell bent over row', 'barbell row', 'bent over barbell row'],
    'remo con mancuerna a una mano': ['one arm dumbbell row', 'single arm dumbbell row', 'dumbbell row'],
    'remo en polea baja': ['seated cable row', 'cable seated row', 'low pulley row'],
    'remo pecho apoyado': ['chest supported row', 'incline dumbbell row', 'chest supported dumbbell row'],
    'remo t-bar': ['t bar row', 't-bar row', 'barbell t bar row'],
    'remo pendlay': ['pendlay row', 'barbell pendlay row'],
    'remo invertido en barra': ['inverted row', 'body weight row', 'australian pull up'],
    'remo en maquina convergente': ['machine row', 'leverage seated row', 'seated machine row'],
    'remo en anillas': ['ring row', 'trx row', 'suspension row'],
    'remo renegado': ['renegade row', 'dumbbell renegade row', 'plank dumbbell row'],
    'remo unilateral en cable': ['single arm cable row', 'one arm cable row'],
    'remo en punta con mancuerna': ['meadows row', 'corner barbell row', 'landmine row'],
    'serrucho en banco': ['single arm dumbbell row', 'one arm bench supported row'],
    'face pull': ['face pull', 'rope face pull', 'cable face pull'],
    'peso muerto convencional': ['deadlift', 'barbell deadlift', 'conventional deadlift'],
    'peso muerto': ['deadlift', 'barbell deadlift', 'conventional deadlift'],
    'peso muerto rumano': ['romanian deadlift', 'rdl', 'barbell romanian deadlift'],
    'peso muerto sumo': ['sumo deadlift', 'sumo barbell deadlift'],
    'peso muerto a una pierna': ['single leg deadlift', 'single leg romanian deadlift', 'one leg deadlift'],
    'peso muerto trap bar': ['trap bar deadlift', 'hex bar deadlift'],
    'encogimientos de trapecio': ['dumbbell shrug', 'barbell shrug', 'shrug'],

    'sentadilla trasera': ['barbell back squat', 'back squat', 'squat'],
    'sentadilla frontal': ['front squat', 'barbell front squat'],
    'sentadilla en multipower': ['smith machine squat', 'smith squat'],
    'sentadilla goblet': ['goblet squat', 'dumbbell goblet squat', 'kettlebell goblet squat'],
    'sentadilla overhead': ['overhead squat', 'barbell overhead squat'],
    'sissy squat': ['sissy squat'],
    'hack squat': ['hack squat', 'barbell hack squat', 'machine hack squat'],
    'split squat': ['split squat', 'dumbbell split squat', 'barbell split squat'],
    bulgaras: ['bulgarian split squat', 'rear foot elevated split squat'],
    'zancadas caminando': ['walking lunge', 'dumbbell walking lunge', 'barbell walking lunge'],
    'step up': ['step up', 'barbell step up', 'dumbbell step up', 'box step up'],
    'prensa de piernas': ['leg press', 'machine leg press', '45 degree leg press'],
    'prensa horizontal': ['horizontal leg press', 'machine horizontal leg press'],
    'press de piernas unilateral': ['single leg press', 'one leg press machine'],
    'extension de cuadriceps': ['leg extension', 'machine leg extension', 'seated leg extension'],
    'curl femoral tumbado': ['lying leg curl', 'machine lying leg curl', 'hamstring curl'],
    'elevacion de gemelos de pie': ['standing calf raise', 'calf raise', 'barbell calf raise'],
    'elevacion de gemelos sentado': ['seated calf raise', 'machine seated calf raise'],
    'elevacion de talones en prensa': ['leg press calf raise', 'calf press on leg press'],
    'hip thrust': ['barbell hip thrust', 'hip thrust', 'glute bridge barbell'],
    'puente de gluteos': ['glute bridge', 'bodyweight glute bridge', 'hip bridge'],
    'elevacion de cadera en banco': ['hip thrust dumbbell', 'dumbbell hip thrust', 'elevated hip thrust'],
    'buenos dias': ['good morning', 'barbell good morning'],
    'buenos dias con mancuerna': ['dumbbell good morning', 'good morning dumbbell'],
    'good morning en maquina': ['machine good morning', 'lever good morning'],
    'abduccion en maquina': ['machine hip abduction', 'seated hip abduction', 'abductor machine'],
    'adduccion en maquina': ['machine hip adduction', 'seated hip adduction', 'adductor machine'],
    thruster: ['barbell thruster', 'dumbbell thruster', 'squat to overhead press', 'squat to press'],

    'press militar': ['overhead press', 'barbell overhead press', 'military press'],
    'press arnold': ['arnold press', 'dumbbell arnold press', 'arnold dumbbell press'],
    'press de hombros con mancuernas sentado': ['seated dumbbell shoulder press', 'seated dumbbell press'],
    'press de hombros con mancuernas': ['dumbbell shoulder press', 'seated dumbbell press'],
    'press de hombro en maquina': ['machine shoulder press', 'shoulder press machine', 'seated machine shoulder press'],
    'press push press': ['push press', 'barbell push press'],
    'press landmine unilateral': ['landmine press', 'single arm landmine press', 'unilateral landmine press'],
    'landmine press': ['landmine press', 'barbell landmine press'],
    'press cubano': ['cuban press', 'cuban rotation', 'dumbbell cuban press'],
    'elevaciones laterales': ['lateral raise', 'dumbbell lateral raise', 'standing dumbbell lateral raise'],
    'elevacion lateral en polea': ['cable lateral raise', 'single arm cable lateral raise'],
    'elevaciones laterales en cable': ['cable lateral raise', 'single arm cable lateral raise'],
    'elevacion frontal': ['front raise', 'dumbbell front raise', 'barbell front raise'],
    pajaros: ['reverse fly', 'bent over lateral raise', 'dumbbell rear delt fly'],
    'pajaros con mancuernas': ['rear delt fly', 'dumbbell rear delt fly', 'bent over dumbbell reverse fly'],
    'remo al menton': ['upright row', 'barbell upright row', 'cable upright row', 'dumbbell upright row'],
    'y-raise en banco inclinado': ['incline y raise', 'incline dumbbell y raise', 'incline prone y raise'],

    'curl de biceps con barra': ['barbell curl', 'ez bar curl', 'barbell bicep curl'],
    'curl predicador': ['preacher curl', 'ez bar preacher curl', 'barbell preacher curl'],
    'curl de biceps en banco predicador': ['preacher curl', 'barbell preacher curl', 'ez bar preacher curl'],
    'curl araña': ['spider curl', 'bench spider curl'],
    'curl inclinado con mancuernas': ['incline dumbbell curl', 'incline curl', 'incline bicep curl'],
    'curl inclinado': ['incline dumbbell curl', 'incline curl'],
    'curl en banco inclinado alterno': ['alternating incline dumbbell curl', 'incline alternating curl'],
    'curl martillo': ['hammer curl', 'dumbbell hammer curl', 'neutral grip curl'],
    'curl en polea baja': ['cable curl', 'low cable curl', 'cable bicep curl'],
    'curl inverso': ['reverse curl', 'barbell reverse curl', 'reverse grip curl'],
    'curl spider': ['spider curl', 'incline spider curl', 'barbell spider curl'],
    'curl concentrado': ['concentration curl', 'dumbbell concentration curl'],
    'curl de biceps con barra z': ['ez bar curl', 'ez bar biceps curl'],
    'curl alterno con mancuernas': ['alternating dumbbell curl', 'alternating db curl'],
    'curl martillo con mancuernas': ['dumbbell hammer curl', 'hammer curl'],
    'curl martillo en polea con cuerda': ['cable hammer curl', 'rope hammer curl'],
    'curl en banco scott': ['preacher curl', 'ez bar preacher curl'],
    'curl en polea': ['cable curl', 'standing cable curl'],
    'curl de biceps en polea baja': ['low cable curl', 'cable curl'],
    'curl bayesiano en polea': ['bayesian curl', 'bayesian cable curl'],

    'extension francesa': ['skull crusher', 'ez bar skull crusher', 'lying tricep extension'],
    'press frances': ['skull crusher', 'barbell skull crusher', 'lying triceps extension', 'ez bar skull crusher'],
    'press cerrado': ['close grip bench press', 'close grip barbell bench press'],
    'press de triceps con cuerda': ['rope tricep pushdown', 'rope triceps pushdown', 'cable rope tricep extension'],
    'extension de triceps con polea': ['tricep pushdown', 'cable tricep pushdown', 'rope pushdown'],
    'extension de triceps en polea': ['tricep pushdown', 'cable triceps pushdown', 'cable pushdown'],
    'extension de triceps por encima de la cabeza': [
        'overhead tricep extension',
        'dumbbell overhead tricep extension',
        'cable overhead tricep extension',
    ],
    'kickback de triceps': ['tricep kickback', 'dumbbell tricep kickback'],
    'patada de triceps': ['triceps kickback', 'dumbbell triceps kickback', 'cable kickback'],
    'fondos en banco': ['bench dip', 'bench dips', 'tricep bench dip'],
    'dips en banco': ['bench dip', 'tricep bench dip'],
    'press frances con mancuerna a una mano': ['one arm dumbbell triceps extension', 'single arm overhead tricep extension'],
    'extension de triceps en polea con barra': ['straight bar tricep pushdown', 'tricep pushdown', 'cable triceps pushdown'],
    'extension de triceps con cuerda': ['rope tricep pushdown', 'rope triceps pushdown'],
    'extension de triceps en polea con cuerda': ['rope tricep pushdown', 'rope triceps pushdown'],
    'extension overhead de triceps en polea con cuerda': ['overhead rope tricep extension', 'cable overhead tricep extension'],

    crunch: ['crunch', 'ab crunch', 'floor crunch'],
    plancha: ['plank', 'front plank', 'full plank'],
    'plancha frontal': ['plank', 'forearm plank', 'abdominal plank'],
    'plancha lateral': ['side plank', 'side forearm plank'],
    'plancha con peso': ['weighted plank', 'plate weighted plank'],
    'plancha con desplazamiento': ['plank walk', 'plank shoulder tap', 'moving plank'],
    'plancha con toque de hombros': ['plank shoulder tap', 'shoulder tap plank'],
    'crunch abdominal': ['crunch', 'abdominal crunch', 'basic crunch'],
    'crunch en polea': ['cable crunch', 'kneeling cable crunch'],
    'crunch bicicleta': ['bicycle crunch', 'bike crunch'],
    'sit up': ['sit up', 'sit-up', 'full sit up'],
    'elevaciones de piernas colgado': ['hanging leg raise', 'hanging knee raise', 'leg raise'],
    'rueda abdominal': ['ab wheel rollout', 'ab roller rollout', 'wheel rollout'],
    'elevacion de piernas tumbado': ['leg raise', 'lying leg raise', 'flat bench leg raise'],
    'dragon flag': ['dragon flag', 'body weight dragon flag'],
    'ab wheel de rodillas': ['ab wheel rollout', 'ab roller rollout', 'kneeling ab wheel rollout'],
    'pallof press': ['pallof press', 'cable pallof press', 'anti rotation press'],
    'russian twist': ['russian twist', 'weighted russian twist'],
    'hollow body hold': ['hollow body hold', 'hollow hold', 'hollow body rock'],
    'bird dog': ['bird dog', 'quadruped bird dog'],
    'dead bug': ['dead bug', 'dead bug exercise'],
    'mountain climbers': ['mountain climber', 'mountain climbers', 'running plank'],
    'woodchopper en polea': ['cable wood chop', 'cable woodchop', 'cable chop'],
    'paseo del oso': ['bear crawl', 'bear crawl forward'],
    'toes to bar': ['toes to bar', 'toe to bar', 'hanging toes to bar'],

    'farmer walk': ['farmer walk', 'farmer carry', 'dumbbell farmer walk'],
    'farmer walk unilateral': ['single arm farmer walk', 'unilateral farmer carry', 'suitcase carry'],
    'paseo del granjero pesado': ['farmer walk', 'heavy farmer carry', 'trap bar carry'],
    'swing con kettlebell': ['kettlebell swing', 'two handed kettlebell swing'],
    'turkish get-up': ['turkish get up', 'kettlebell turkish get up', 'get up'],
    'clean and press': ['clean and press', 'barbell clean and press', 'power clean and press'],
    'push press con mancuernas': ['dumbbell push press', 'alternating dumbbell push press'],
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

    for (const simplifiedCandidate of getSimplifiedQueryCandidates(normalized)) {
        addSeed(simplifiedCandidate)
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

function getSimplifiedQueryCandidates(normalizedName: string): string[] {
    if (!normalizedName) {
        return []
    }

    const simplified = normalizedName
        .replace(/\b(con|en)\s+(mancuerna|mancuernas|barra|barra z|maquina|multipower|polea|cuerda|banda elastica|banda)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const candidates = new Set<string>()

    if (simplified && simplified !== normalizedName) {
        candidates.add(simplified)
    }

    const simplifiedTokens = simplified.split(' ').filter((token) => token.length > 2)
    if (simplifiedTokens.length > 0) {
        candidates.add(simplifiedTokens[0])
    }

    if (simplified.includes('curl') || normalizedName.includes('curl')) {
        candidates.add('curl')
        candidates.add('bicep curl')
    }

    if (simplified.includes('press') || normalizedName.includes('press')) {
        candidates.add('press')
    }

    return Array.from(candidates)
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
