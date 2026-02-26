const exerciseDbAliases: Record<string, string[]> = {
    'press de banca': ['barbell bench press', 'bench press'],
    'press inclinado con mancuernas': ['incline dumbbell press'],
    'press declinado': ['decline bench press'],
    'aperturas con mancuernas': ['dumbbell fly'],
    'cruce de poleas': ['cable crossover'],
    'press de pecho en maquina': ['machine chest press'],
    flexiones: ['push up'],
    'fondos en paralelas': ['parallel bar dip', 'chest dip'],
    dominadas: ['pull up'],
    'jalon al pecho': ['lat pulldown'],
    'remo con barra': ['barbell bent over row'],
    'remo con mancuerna': ['one arm dumbbell row'],
    'remo en polea baja': ['seated cable row'],
    'face pull': ['face pull'],
    'peso muerto': ['deadlift'],
    'encogimientos de trapecio': ['dumbbell shrug'],
    'sentadilla trasera': ['barbell back squat'],
    'sentadilla frontal': ['front squat'],
    'prensa de piernas': ['leg press'],
    'zancadas caminando': ['walking lunge'],
    'sentadilla bulgara': ['bulgarian split squat'],
    'peso muerto rumano': ['romanian deadlift'],
    'hip thrust': ['barbell hip thrust', 'hip thrust'],
    'extension de cuadriceps': ['leg extension'],
    'curl femoral': ['hamstring curl', 'lying leg curl'],
    'elevacion de gemelos': ['standing calf raise', 'calf raise'],
    'press militar': ['military press', 'barbell shoulder press'],
    'press arnold': ['arnold press'],
    'elevaciones laterales': ['lateral raise'],
    'elevaciones frontales': ['front raise'],
    pajaros: ['rear delt fly', 'reverse fly'],
    'remo al menton': ['upright row'],
    'press hombro en maquina': ['machine shoulder press'],
    'curl de biceps con barra': ['barbell curl'],
    'curl alterno con mancuernas': ['alternating dumbbell curl'],
    'curl martillo': ['hammer curl'],
    'curl en banco scott': ['preacher curl'],
    'curl en polea': ['cable curl'],
    'curl concentrado': ['concentration curl'],
    'press frances': ['lying triceps extension', 'skull crusher'],
    'extension de triceps en polea': ['tricep pushdown', 'cable triceps pushdown'],
    'fondos en banco': ['bench dip'],
    'patada de triceps': ['triceps kickback'],
    'extension overhead con mancuerna': ['overhead tricep extension'],
    'extension de triceps con cuerda': ['rope tricep pushdown'],
    'plancha frontal': ['plank'],
    'plancha lateral': ['side plank'],
    'crunch abdominal': ['crunch'],
    'ab wheel rollout': ['ab wheel rollout'],
    'elevacion de piernas': ['hanging leg raise', 'leg raise'],
    'mountain climbers': ['mountain climber'],
    'russian twist': ['russian twist'],
    'dead bug': ['dead bug'],
    'hollow hold': ['hollow hold'],
    'crunch en polea': ['cable crunch'],
}

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

    const candidates = new Set<string>([...aliasCandidates, normalized])

    const noStopWords = normalized
        .replace(/\b(de|con|en|al|del|la|el|los|las)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    if (noStopWords.length >= 4) {
        candidates.add(noStopWords)
    }

    return Array.from(candidates).filter((value) => value.length > 0)
}
