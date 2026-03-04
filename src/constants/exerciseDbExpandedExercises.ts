export interface ExpandedExerciseSeed {
  id: string
  nombre: string
  descripcion: string
  grupoMuscularPrimario: string
  gruposMuscularesSecundarios: string[]
  nivelDificultad: 'basico' | 'intermedio' | 'avanzado'
  equipoNecesario: string
  imagenUrl: string
  exerciseDbId: string
  exerciseDbName: string
  exerciseDbAliases: string[]
  instrucciones: string
  esPersonalizado: false
}

export const exerciseDbExpandedExercises: ExpandedExerciseSeed[] = [
  {
    "id": "db-VPPtusI",
    "nombre": "Inverted Row Bent Knees",
    "descripcion": "ExerciseDB inverted row bent knees.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/VPPtusI.gif",
    "exerciseDbId": "VPPtusI",
    "exerciseDbName": "inverted row bent knees",
    "exerciseDbAliases": [
      "inverted row bent knees"
    ],
    "instrucciones": "Set up a bar at waist height and lie underneath it.\nGrab the bar with an overhand grip, slightly wider than shoulder-width apart.\nPosition your body so that your heels are on the ground and your body is straight.\nPull your chest up towards the bar by squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower your body back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-8d8qJQI",
    "nombre": "Barbell Reverse Grip Incline Bench Row",
    "descripcion": "ExerciseDB barbell reverse grip incline bench row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/8d8qJQI.gif",
    "exerciseDbId": "8d8qJQI",
    "exerciseDbName": "barbell reverse grip incline bench row",
    "exerciseDbAliases": [
      "barbell reverse grip incline bench row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nSit on the bench facing the backrest with your chest against it.\nGrab the barbell with a reverse grip (palms facing down) and hands slightly wider than shoulder-width apart.\nKeep your back straight and core engaged.\nPull the barbell towards your upper abdomen, squeezing your shoulder blades together.\nPause for a moment at the top of the movement.\nSlowly lower the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-JGKowMS",
    "nombre": "Smith Narrow Row",
    "descripcion": "ExerciseDB smith narrow row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "rear deltoids"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/JGKowMS.gif",
    "exerciseDbId": "JGKowMS",
    "exerciseDbName": "smith narrow row",
    "exerciseDbAliases": [
      "smith narrow row"
    ],
    "instrucciones": "Adjust the seat height and position yourself on the machine with your feet flat on the floor.\nGrasp the handles with an overhand grip, slightly narrower than shoulder-width apart.\nKeep your back straight and your chest up as you pull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-dmgMp3n",
    "nombre": "Barbell Incline Row",
    "descripcion": "ExerciseDB barbell incline row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/dmgMp3n.gif",
    "exerciseDbId": "dmgMp3n",
    "exerciseDbName": "barbell incline row",
    "exerciseDbAliases": [
      "barbell incline row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nLie face down on the bench with your chest against the pad and your feet flat on the ground.\nGrasp the barbell with an overhand grip, slightly wider than shoulder-width apart.\nKeep your back straight and your core engaged.\nPull the barbell towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZqNOWQ6",
    "nombre": "Lever Reverse Grip Vertical Row",
    "descripcion": "ExerciseDB lever reverse grip vertical row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/ZqNOWQ6.gif",
    "exerciseDbId": "ZqNOWQ6",
    "exerciseDbName": "lever reverse grip vertical row",
    "exerciseDbAliases": [
      "lever reverse grip vertical row"
    ],
    "instrucciones": "Adjust the seat height and footplate position to ensure proper alignment.\nSit on the machine with your chest against the pad and your feet flat on the footplate.\nGrasp the handles with an underhand grip, palms facing up.\nKeep your back straight and engage your core.\nPull the handles towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-w2oRpuH",
    "nombre": "Lever Alternating Narrow Grip Seated Row",
    "descripcion": "ExerciseDB lever alternating narrow grip seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/w2oRpuH.gif",
    "exerciseDbId": "w2oRpuH",
    "exerciseDbName": "lever alternating narrow grip seated row",
    "exerciseDbAliases": [
      "lever alternating narrow grip seated row"
    ],
    "instrucciones": "Adjust the seat height and footplate position to ensure proper alignment.\nSit on the machine with your back straight and feet flat on the footplate.\nGrasp the handles with a narrow grip, palms facing each other.\nKeep your chest up and shoulders back throughout the exercise.\nPull one handle towards your torso while keeping the other handle stationary.\nSqueeze your shoulder blades together at the end of the movement.\nSlowly return the handle to the starting position and repeat with the other side.\nContinue alternating sides for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-zYmNaoY",
    "nombre": "Elevator",
    "descripcion": "ExerciseDB elevator.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "trapezius"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/zYmNaoY.gif",
    "exerciseDbId": "zYmNaoY",
    "exerciseDbName": "elevator",
    "exerciseDbAliases": [
      "elevator"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and your knees slightly bent.\nPlace your hands on your hips or cross them in front of your chest.\nKeeping your back straight, slowly bend forward at the waist, lowering your upper body towards the ground.\nPause for a moment at the bottom, then slowly raise your upper body back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-C0MA9bC",
    "nombre": "Dumbbell One Arm Bent-over Row",
    "descripcion": "ExerciseDB dumbbell one arm bent-over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/C0MA9bC.gif",
    "exerciseDbId": "C0MA9bC",
    "exerciseDbName": "dumbbell one arm bent-over row",
    "exerciseDbAliases": [
      "dumbbell one arm bent-over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a dumbbell in one hand with your palm facing your body.\nBend your knees slightly and hinge forward at the hips, keeping your back straight and your core engaged.\nLet the dumbbell hang straight down towards the floor, with your arm fully extended.\nPull the dumbbell up towards your chest, keeping your elbow close to your body and squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-UFGF6gk",
    "nombre": "Cable Rope Crossover Seated Row",
    "descripcion": "ExerciseDB cable rope crossover seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/UFGF6gk.gif",
    "exerciseDbId": "UFGF6gk",
    "exerciseDbName": "cable rope crossover seated row",
    "exerciseDbAliases": [
      "cable rope crossover seated row"
    ],
    "instrucciones": "Sit on the rowing machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the cable ropes with an overhand grip, palms facing each other.\nLean back slightly, keeping your back straight and your core engaged.\nPull the cable ropes towards your chest, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-c8oybX6",
    "nombre": "Cable Rope Elevated Seated Row",
    "descripcion": "ExerciseDB cable rope elevated seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/c8oybX6.gif",
    "exerciseDbId": "c8oybX6",
    "exerciseDbName": "cable rope elevated seated row",
    "exerciseDbAliases": [
      "cable rope elevated seated row"
    ],
    "instrucciones": "Sit on the elevated seat facing the cable machine.\nGrab the cable rope handles with an overhand grip, palms facing each other.\nKeep your back straight and lean slightly back, maintaining a slight bend in your knees.\nPull the cable towards your body by retracting your shoulder blades and squeezing your back muscles.\nPause for a moment at the fully contracted position.\nSlowly release the tension and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-b9kqlBy",
    "nombre": "Kettlebell Alternating Renegade Row",
    "descripcion": "ExerciseDB kettlebell alternating renegade row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "core",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "kettlebell",
    "imagenUrl": "https://static.exercisedb.dev/media/b9kqlBy.gif",
    "exerciseDbId": "b9kqlBy",
    "exerciseDbName": "kettlebell alternating renegade row",
    "exerciseDbAliases": [
      "kettlebell alternating renegade row"
    ],
    "instrucciones": "Start in a high plank position with your hands gripping the kettlebells and your feet hip-width apart.\nEngage your core and keep your body in a straight line from head to heels.\nPull one kettlebell up towards your chest, keeping your elbow close to your body.\nLower the kettlebell back down to the starting position and repeat with the other arm.\nContinue alternating arms for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-WrYPP2g",
    "nombre": "Cable One Arm Straight Back High Row (kneeling)",
    "descripcion": "ExerciseDB cable one arm straight back high row (kneeling).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/WrYPP2g.gif",
    "exerciseDbId": "WrYPP2g",
    "exerciseDbName": "cable one arm straight back high row (kneeling)",
    "exerciseDbAliases": [
      "cable one arm straight back high row (kneeling)"
    ],
    "instrucciones": "Attach a handle to a cable machine at waist height.\nKneel down facing the cable machine and grab the handle with one hand.\nKeep your back straight and your core engaged.\nPull the handle towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top of the movement.\nSlowly release the handle back to the starting position.\nRepeat for the desired number of repetitions.\nSwitch sides and repeat the exercise with the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-km0sQC0",
    "nombre": "Band One Arm Standing Low Row",
    "descripcion": "ExerciseDB band one arm standing low row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "band",
    "imagenUrl": "https://static.exercisedb.dev/media/km0sQC0.gif",
    "exerciseDbId": "km0sQC0",
    "exerciseDbName": "band one arm standing low row",
    "exerciseDbAliases": [
      "band one arm standing low row"
    ],
    "instrucciones": "Attach the band to a stable anchor point at waist height.\nStand facing the anchor point with your feet shoulder-width apart.\nHold the band with one hand, palm facing inward, and step back to create tension in the band.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nPull the band towards your waist, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the band back to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-Ca76jUE",
    "nombre": "Kettlebell Alternating Row",
    "descripcion": "ExerciseDB kettlebell alternating row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "kettlebell",
    "imagenUrl": "https://static.exercisedb.dev/media/Ca76jUE.gif",
    "exerciseDbId": "Ca76jUE",
    "exerciseDbName": "kettlebell alternating row",
    "exerciseDbAliases": [
      "kettlebell alternating row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a kettlebell in each hand with your palms facing your body.\nBend forward at the hips, keeping your back straight and your core engaged.\nPull one kettlebell up towards your chest, keeping your elbow close to your body and squeezing your shoulder blades together.\nLower the kettlebell back down to the starting position and repeat with the other arm.\nContinue alternating arms for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZX9UZmj",
    "nombre": "Smith Bent Over Row",
    "descripcion": "ExerciseDB smith bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/ZX9UZmj.gif",
    "exerciseDbId": "ZX9UZmj",
    "exerciseDbName": "smith bent over row",
    "exerciseDbAliases": [
      "smith bent over row"
    ],
    "instrucciones": "Set up the smith machine with the bar at hip height.\nStand facing the bar with your feet shoulder-width apart.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the bar with an overhand grip, hands slightly wider than shoulder-width apart.\nPull the bar towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the bar back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-xbkPfaw",
    "nombre": "Bodyweight Standing One Arm Row",
    "descripcion": "ExerciseDB bodyweight standing one arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/xbkPfaw.gif",
    "exerciseDbId": "xbkPfaw",
    "exerciseDbName": "bodyweight standing one arm row",
    "exerciseDbAliases": [
      "bodyweight standing one arm row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a dumbbell in one hand.\nBend forward at the hips, keeping your back straight and your core engaged.\nLet the dumbbell hang straight down in front of you, with your arm fully extended.\nPull the dumbbell up towards your chest, keeping your elbow close to your body.\nSqueeze your shoulder blades together at the top of the movement.\nLower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-bKWbrTA",
    "nombre": "One Arm Towel Row",
    "descripcion": "ExerciseDB one arm towel row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/bKWbrTA.gif",
    "exerciseDbId": "bKWbrTA",
    "exerciseDbName": "one arm towel row",
    "exerciseDbAliases": [
      "one arm towel row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a towel with one hand.\nBend forward at the waist, keeping your back straight and your core engaged.\nExtend your arm fully, allowing the towel to hang in front of you.\nPull the towel towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the towel back to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-XUUD0Fs",
    "nombre": "Dumbbell Lying Rear Delt Row",
    "descripcion": "ExerciseDB dumbbell lying rear delt row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "biceps"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/XUUD0Fs.gif",
    "exerciseDbId": "XUUD0Fs",
    "exerciseDbName": "dumbbell lying rear delt row",
    "exerciseDbAliases": [
      "dumbbell lying rear delt row"
    ],
    "instrucciones": "Lie face down on a flat bench with a dumbbell in each hand, palms facing inwards.\nExtend your arms straight down towards the floor, keeping a slight bend in your elbows.\nEngaging your back muscles, lift the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Fhdtwf3",
    "nombre": "Lever One Arm Bent Over Row",
    "descripcion": "ExerciseDB lever one arm bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/Fhdtwf3.gif",
    "exerciseDbId": "Fhdtwf3",
    "exerciseDbName": "lever one arm bent over row",
    "exerciseDbAliases": [
      "lever one arm bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a barbell with an overhand grip.\nBend forward at the hips, keeping your back straight and your head up.\nLet the barbell hang in front of you with your arms fully extended.\nPull the barbell up towards your chest, keeping your elbows close to your body.\nSqueeze your shoulder blades together at the top of the movement.\nLower the barbell back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-PNtsX17",
    "nombre": "Cable Reverse-grip Straight Back Seated High Row",
    "descripcion": "ExerciseDB cable reverse-grip straight back seated high row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/PNtsX17.gif",
    "exerciseDbId": "PNtsX17",
    "exerciseDbName": "cable reverse-grip straight back seated high row",
    "exerciseDbAliases": [
      "cable reverse-grip straight back seated high row"
    ],
    "instrucciones": "Sit on the seat facing the cable machine with your feet flat on the floor.\nGrasp the cable attachment with an underhand grip, palms facing up, and your hands shoulder-width apart.\nKeep your back straight and lean slightly forward from your hips.\nPull the cable towards your torso by retracting your shoulder blades and squeezing your back muscles.\nPause for a moment at the peak of the contraction, then slowly release the cable back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-OmQ8w0p",
    "nombre": "Cable Palm Rotational Row",
    "descripcion": "ExerciseDB cable palm rotational row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/OmQ8w0p.gif",
    "exerciseDbId": "OmQ8w0p",
    "exerciseDbName": "cable palm rotational row",
    "exerciseDbAliases": [
      "cable palm rotational row"
    ],
    "instrucciones": "Attach a handle to a cable machine at waist height.\nStand facing the machine with your feet shoulder-width apart.\nGrasp the handle with an overhand grip, palms facing down.\nStep back to create tension on the cable, keeping your back straight and knees slightly bent.\nPull the handle towards your body, rotating your palms to face upwards as you do so.\nSqueeze your shoulder blades together at the end of the movement.\nSlowly release the handle back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-7vG5o25",
    "nombre": "Dumbbell Incline Row",
    "descripcion": "ExerciseDB dumbbell incline row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/7vG5o25.gif",
    "exerciseDbId": "7vG5o25",
    "exerciseDbName": "dumbbell incline row",
    "exerciseDbAliases": [
      "dumbbell incline row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nGrab a dumbbell in each hand and sit on the bench with your chest against the incline.\nExtend your arms fully, allowing the dumbbells to hang straight down from your shoulders.\nPull the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-hvV79Si",
    "nombre": "Cable Low Seated Row",
    "descripcion": "ExerciseDB cable low seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/hvV79Si.gif",
    "exerciseDbId": "hvV79Si",
    "exerciseDbName": "cable low seated row",
    "exerciseDbAliases": [
      "cable low seated row"
    ],
    "instrucciones": "Sit on the machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with an overhand grip, palms facing down.\nKeep your back straight and lean slightly forward, maintaining a slight bend in your elbows.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wf24o8S",
    "nombre": "Kettlebell Two Arm Row",
    "descripcion": "ExerciseDB kettlebell two arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "kettlebell",
    "imagenUrl": "https://static.exercisedb.dev/media/wf24o8S.gif",
    "exerciseDbId": "wf24o8S",
    "exerciseDbName": "kettlebell two arm row",
    "exerciseDbAliases": [
      "kettlebell two arm row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a kettlebell in each hand with your palms facing your body.\nBend forward at the hips, keeping your back straight and your core engaged.\nPull the kettlebells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the kettlebells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-BReCuOn",
    "nombre": "Bodyweight Squatting Row (with Towel)",
    "descripcion": "ExerciseDB bodyweight squatting row (with towel).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/BReCuOn.gif",
    "exerciseDbId": "BReCuOn",
    "exerciseDbName": "bodyweight squatting row (with towel)",
    "exerciseDbAliases": [
      "bodyweight squatting row (with towel)"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a towel in front of you with your palms facing down.\nBend your knees and lower your body into a squat position, keeping your back straight and your chest up.\nAs you lower into the squat, simultaneously pull the towel towards your chest, squeezing your shoulder blades together.\nPause for a moment at the bottom of the squat, then slowly return to the starting position while extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-oROuvrX",
    "nombre": "Lever Unilateral Row",
    "descripcion": "ExerciseDB lever unilateral row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/oROuvrX.gif",
    "exerciseDbId": "oROuvrX",
    "exerciseDbName": "lever unilateral row",
    "exerciseDbAliases": [
      "lever unilateral row"
    ],
    "instrucciones": "Adjust the seat height and position yourself facing the machine.\nGrasp the handles with an overhand grip and keep your back straight.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-bZGHsAZ",
    "nombre": "Inverted Row",
    "descripcion": "ExerciseDB inverted row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/bZGHsAZ.gif",
    "exerciseDbId": "bZGHsAZ",
    "exerciseDbName": "inverted row",
    "exerciseDbAliases": [
      "inverted row"
    ],
    "instrucciones": "Set up a bar at waist height or use a suspension trainer.\nStand facing the bar or suspension trainer, with your feet shoulder-width apart.\nGrab the bar or handles with an overhand grip, slightly wider than shoulder-width apart.\nLean back, keeping your body straight and your heels on the ground.\nPull your chest towards the bar or handles, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower yourself back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-uTv34oq",
    "nombre": "Bodyweight Standing Row (with Towel)",
    "descripcion": "ExerciseDB bodyweight standing row (with towel).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/uTv34oq.gif",
    "exerciseDbId": "uTv34oq",
    "exerciseDbName": "bodyweight standing row (with towel)",
    "exerciseDbAliases": [
      "bodyweight standing row (with towel)"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a towel in front of you with both hands.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nPull the towel towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-X6ytgYZ",
    "nombre": "Dumbbell Side Plank With Rear Fly",
    "descripcion": "ExerciseDB dumbbell side plank with rear fly.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/X6ytgYZ.gif",
    "exerciseDbId": "X6ytgYZ",
    "exerciseDbName": "dumbbell side plank with rear fly",
    "exerciseDbAliases": [
      "dumbbell side plank with rear fly"
    ],
    "instrucciones": "Start by lying on your side with your legs extended and stacked on top of each other.\nPlace your forearm on the ground directly below your shoulder, keeping your elbow bent at a 90-degree angle.\nHold a dumbbell in your top hand, with your arm extended straight down towards the ground.\nEngage your core and lift your hips off the ground, creating a straight line from your head to your heels.\nWhile maintaining the side plank position, lift the dumbbell up towards the ceiling, squeezing your shoulder blades together.\nLower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-G70mEAJ",
    "nombre": "Chin-ups (narrow Parallel Grip)",
    "descripcion": "ExerciseDB chin-ups (narrow parallel grip).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/G70mEAJ.gif",
    "exerciseDbId": "G70mEAJ",
    "exerciseDbName": "chin-ups (narrow parallel grip)",
    "exerciseDbAliases": [
      "chin-ups (narrow parallel grip)"
    ],
    "instrucciones": "Hang from a pull-up bar with a narrow parallel grip, palms facing towards you.\nEngage your back muscles and pull your body up towards the bar, keeping your elbows close to your body.\nContinue pulling until your chin is above the bar.\nPause for a moment at the top, then slowly lower your body back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-FVM1AUZ",
    "nombre": "Lever T-bar Reverse Grip Row",
    "descripcion": "ExerciseDB lever t-bar reverse grip row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/FVM1AUZ.gif",
    "exerciseDbId": "FVM1AUZ",
    "exerciseDbName": "lever t-bar reverse grip row",
    "exerciseDbAliases": [
      "lever t-bar reverse grip row"
    ],
    "instrucciones": "Adjust the seat height and position yourself on the machine with your chest against the pad and your feet flat on the floor.\nGrasp the handles with an overhand grip, slightly wider than shoulder-width apart.\nKeep your back straight and engage your core.\nPull the handles towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-JF8AkMX",
    "nombre": "Standing Archer",
    "descripcion": "ExerciseDB standing archer.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/JF8AkMX.gif",
    "exerciseDbId": "JF8AkMX",
    "exerciseDbName": "standing archer",
    "exerciseDbAliases": [
      "standing archer"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and your knees slightly bent.\nExtend your arms straight out in front of you at shoulder height, parallel to the ground.\nRotate your torso to the right, keeping your arms extended and your back straight.\nAs you rotate, extend your right arm forward and your left arm back, mimicking the motion of drawing a bowstring.\nHold the position for a moment, then return to the starting position.\nRepeat the motion, this time rotating your torso to the left and extending your left arm forward and your right arm back.\nContinue alternating sides for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-BJ0Hz5L",
    "nombre": "Dumbbell Bent Over Row",
    "descripcion": "ExerciseDB dumbbell bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/BJ0Hz5L.gif",
    "exerciseDbId": "BJ0Hz5L",
    "exerciseDbName": "dumbbell bent over row",
    "exerciseDbAliases": [
      "dumbbell bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a dumbbell in each hand with your palms facing your body.\nBend forward at the hips, keeping your back straight and your core engaged.\nLet your arms hang straight down towards the floor, with your elbows slightly bent.\nPull the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-SzX3uzM",
    "nombre": "Barbell Reverse Grip Bent Over Row",
    "descripcion": "ExerciseDB barbell reverse grip bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/SzX3uzM.gif",
    "exerciseDbId": "SzX3uzM",
    "exerciseDbName": "barbell reverse grip bent over row",
    "exerciseDbAliases": [
      "barbell reverse grip bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold a barbell with an overhand grip, palms facing down, and hands slightly wider than shoulder-width apart.\nBend forward at the hips, keeping your back straight and chest up, until your torso is almost parallel to the floor.\nPull the barbell towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-9pQSkH8",
    "nombre": "Dumbbell Reverse Grip Incline Bench Two Arm Row",
    "descripcion": "ExerciseDB dumbbell reverse grip incline bench two arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/9pQSkH8.gif",
    "exerciseDbId": "9pQSkH8",
    "exerciseDbName": "dumbbell reverse grip incline bench two arm row",
    "exerciseDbAliases": [
      "dumbbell reverse grip incline bench two arm row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nSit on the bench with your chest against the backrest and your feet flat on the ground.\nHold a dumbbell in each hand with an underhand grip.\nLean forward and let your arms hang straight down, fully extended.\nPull the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-R5swFnc",
    "nombre": "Cambered Bar Lying Row",
    "descripcion": "ExerciseDB cambered bar lying row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/R5swFnc.gif",
    "exerciseDbId": "R5swFnc",
    "exerciseDbName": "cambered bar lying row",
    "exerciseDbAliases": [
      "cambered bar lying row"
    ],
    "instrucciones": "Set up a barbell on the floor and lie face down on a bench with your chest just off the edge.\nReach down and grab the barbell with an overhand grip, slightly wider than shoulder-width apart.\nWith your legs straight and feet on the ground, lift the barbell off the floor by extending your arms.\nPull the barbell towards your chest, squeezing your shoulder blades together.\nLower the barbell back down to the starting position and repeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wd4ds3s",
    "nombre": "Bodyweight Standing Row",
    "descripcion": "ExerciseDB bodyweight standing row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/wd4ds3s.gif",
    "exerciseDbId": "wd4ds3s",
    "exerciseDbName": "bodyweight standing row",
    "exerciseDbAliases": [
      "bodyweight standing row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nGrasp a bar or handles with an overhand grip, palms facing down.\nKeep your back straight and core engaged.\nPull the bar or handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the top of the movement.\nSlowly release and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-eZyBC3j",
    "nombre": "Barbell Bent Over Row",
    "descripcion": "ExerciseDB barbell bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/eZyBC3j.gif",
    "exerciseDbId": "eZyBC3j",
    "exerciseDbName": "barbell bent over row",
    "exerciseDbAliases": [
      "barbell bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nBend forward at the hips while keeping your back straight and chest up.\nGrasp the barbell with an overhand grip, hands slightly wider than shoulder-width apart.\nPull the barbell towards your lower chest by retracting your shoulder blades and squeezing your back muscles.\nPause for a moment at the top, then slowly lower the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-JOZhu2h",
    "nombre": "Cable Standing Twist Row (v-bar)",
    "descripcion": "ExerciseDB cable standing twist row (v-bar).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/JOZhu2h.gif",
    "exerciseDbId": "JOZhu2h",
    "exerciseDbName": "cable standing twist row (v-bar)",
    "exerciseDbAliases": [
      "cable standing twist row (v-bar)"
    ],
    "instrucciones": "Attach a v-bar attachment to a cable machine at chest height.\nStand facing the cable machine with your feet shoulder-width apart.\nGrasp the v-bar with an overhand grip, palms facing down.\nTake a step back to create tension in the cable.\nKeep your back straight and core engaged throughout the exercise.\nPull the v-bar towards your torso by retracting your shoulder blades and bending your elbows.\nAs you pull, twist your torso to one side, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, feeling the contraction in your upper back.\nSlowly release the tension and return to the starting position, untwisting your torso.\nRepeat the movement for the desired number of repetitions, alternating the twisting direction with each rep.",
    "esPersonalizado": false
  },
  {
    "id": "db-3xK09Sk",
    "nombre": "Bodyweight Squatting Row",
    "descripcion": "ExerciseDB bodyweight squatting row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/3xK09Sk.gif",
    "exerciseDbId": "3xK09Sk",
    "exerciseDbName": "bodyweight squatting row",
    "exerciseDbAliases": [
      "bodyweight squatting row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding onto a sturdy object or suspension trainer with your arms extended.\nLower your body into a squat position, keeping your back straight and your knees behind your toes.\nFrom the squat position, pull your body up towards the object or suspension trainer, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower your body back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-aaxA3cm",
    "nombre": "Smith Reverse Grip Bent Over Row",
    "descripcion": "ExerciseDB smith reverse grip bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/aaxA3cm.gif",
    "exerciseDbId": "aaxA3cm",
    "exerciseDbName": "smith reverse grip bent over row",
    "exerciseDbAliases": [
      "smith reverse grip bent over row"
    ],
    "instrucciones": "Set up the smith machine with the bar at hip height.\nStand facing the bar with your feet shoulder-width apart.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the bar with an underhand grip, hands shoulder-width apart.\nPull the bar towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the bar back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Q4DSJPC",
    "nombre": "Smith One Arm Row",
    "descripcion": "ExerciseDB smith one arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/Q4DSJPC.gif",
    "exerciseDbId": "Q4DSJPC",
    "exerciseDbName": "smith one arm row",
    "exerciseDbAliases": [
      "smith one arm row"
    ],
    "instrucciones": "Adjust the height of the smith machine bar to waist level.\nStand facing the smith machine with your feet shoulder-width apart.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the bar with one hand using an overhand grip, with your palm facing down.\nKeep your elbow close to your body and pull the bar towards your waist, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly lower the bar back to the starting position.\nRepeat for the desired number of repetitions, then switch to the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-uX3sUBz",
    "nombre": "Inverted Row V. 2",
    "descripcion": "ExerciseDB inverted row v. 2.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/uX3sUBz.gif",
    "exerciseDbId": "uX3sUBz",
    "exerciseDbName": "inverted row v. 2",
    "exerciseDbAliases": [
      "inverted row v. 2"
    ],
    "instrucciones": "Set up a bar at waist height on a Smith machine or use a suspension trainer.\nStand facing the bar or suspension trainer and grab it with an overhand grip, hands shoulder-width apart.\nWalk your feet forward, leaning back until your body is at a slight angle.\nKeep your body straight and pull your chest up towards the bar or handles, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower yourself back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-aaXr7ld",
    "nombre": "Lever T Bar Row",
    "descripcion": "ExerciseDB lever t bar row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/aaXr7ld.gif",
    "exerciseDbId": "aaXr7ld",
    "exerciseDbName": "lever t bar row",
    "exerciseDbAliases": [
      "lever t bar row"
    ],
    "instrucciones": "Adjust the seat height and footplate position to ensure proper alignment.\nSit on the machine with your chest against the pad and your feet flat on the footplate.\nGrasp the handles with an overhand grip, slightly wider than shoulder-width apart.\nKeep your back straight and engage your core.\nPull the handles towards your torso, squeezing your shoulder blades together.\nPause for a moment at the peak contraction, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wt6rwjk",
    "nombre": "Dumbbell Palm Rotational Bent Over Row",
    "descripcion": "ExerciseDB dumbbell palm rotational bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/wt6rwjk.gif",
    "exerciseDbId": "wt6rwjk",
    "exerciseDbName": "dumbbell palm rotational bent over row",
    "exerciseDbAliases": [
      "dumbbell palm rotational bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a dumbbell in each hand with an overhand grip.\nBend forward at the hips, keeping your back straight and your knees slightly bent.\nLet your arms hang straight down, palms facing your body.\nEngage your core and pull the dumbbells up towards your chest, keeping your elbows close to your body.\nAs you pull the dumbbells up, rotate your palms so they face away from your body.\nSqueeze your shoulder blades together at the top of the movement.\nSlowly lower the dumbbells back down to the starting position, rotating your palms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-BgljGjd",
    "nombre": "Lever Reverse T-bar Row",
    "descripcion": "ExerciseDB lever reverse t-bar row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/BgljGjd.gif",
    "exerciseDbId": "BgljGjd",
    "exerciseDbName": "lever reverse t-bar row",
    "exerciseDbAliases": [
      "lever reverse t-bar row"
    ],
    "instrucciones": "Adjust the seat height and footplate position on the leverage machine.\nSit on the machine with your chest against the pad and your feet flat on the footplate.\nGrasp the handles with an overhand grip, slightly wider than shoulder-width apart.\nKeep your back straight and engage your core.\nPull the handles towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release and extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-nZZZy9m",
    "nombre": "Lever High Row",
    "descripcion": "ExerciseDB lever high row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "rear deltoids"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/nZZZy9m.gif",
    "exerciseDbId": "nZZZy9m",
    "exerciseDbName": "lever high row",
    "exerciseDbAliases": [
      "lever high row"
    ],
    "instrucciones": "Adjust the seat height and foot platform to a comfortable position.\nSit on the machine with your chest against the pad and your feet flat on the foot platform.\nGrasp the handles with an overhand grip, slightly wider than shoulder-width apart.\nKeep your back straight and engage your core.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-v2DfH14",
    "nombre": "Bodyweight Standing Close-grip One Arm Row",
    "descripcion": "ExerciseDB bodyweight standing close-grip one arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/v2DfH14.gif",
    "exerciseDbId": "v2DfH14",
    "exerciseDbName": "bodyweight standing close-grip one arm row",
    "exerciseDbAliases": [
      "bodyweight standing close-grip one arm row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a dumbbell in one hand with a neutral grip.\nBend forward at the hips, keeping your back straight and your core engaged.\nPull the dumbbell up towards your chest, keeping your elbow close to your body and squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-veXwo0D",
    "nombre": "Cable Floor Seated Wide-grip Row",
    "descripcion": "ExerciseDB cable floor seated wide-grip row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/veXwo0D.gif",
    "exerciseDbId": "veXwo0D",
    "exerciseDbName": "cable floor seated wide-grip row",
    "exerciseDbAliases": [
      "cable floor seated wide-grip row"
    ],
    "instrucciones": "Sit on the floor with your legs extended and your back straight.\nAttach a cable handle to a low pulley and position the cable machine behind you.\nGrasp the handle with a wide overhand grip, palms facing down.\nLean back slightly, keeping your back straight and your chest lifted.\nPull the handle towards your waist, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the handle back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-fUBheHs",
    "nombre": "Cable Seated Row",
    "descripcion": "ExerciseDB cable seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/fUBheHs.gif",
    "exerciseDbId": "fUBheHs",
    "exerciseDbName": "cable seated row",
    "exerciseDbAliases": [
      "cable seated row"
    ],
    "instrucciones": "Sit on the cable row machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with an overhand grip, keeping your back straight and your shoulders relaxed.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-4f8RXP8",
    "nombre": "Cable Standing Row (v-bar)",
    "descripcion": "ExerciseDB cable standing row (v-bar).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/4f8RXP8.gif",
    "exerciseDbId": "4f8RXP8",
    "exerciseDbName": "cable standing row (v-bar)",
    "exerciseDbAliases": [
      "cable standing row (v-bar)"
    ],
    "instrucciones": "Stand facing the cable machine with your feet shoulder-width apart.\nGrasp the v-bar attachment with an overhand grip, palms facing down.\nKeep your back straight and your core engaged.\nPull the v-bar towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-vpp9Ku2",
    "nombre": "Cable Seated One Arm Alternate Row",
    "descripcion": "ExerciseDB cable seated one arm alternate row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/vpp9Ku2.gif",
    "exerciseDbId": "vpp9Ku2",
    "exerciseDbName": "cable seated one arm alternate row",
    "exerciseDbAliases": [
      "cable seated one arm alternate row"
    ],
    "instrucciones": "Sit on a bench facing a cable machine with your feet flat on the ground and knees slightly bent.\nGrasp the handle with one hand and keep your arm fully extended in front of you.\nPull the handle towards your body, retracting your shoulder blade and keeping your elbow close to your side.\nPause for a moment at the top of the movement, squeezing your back muscles.\nSlowly release the handle back to the starting position.\nRepeat with the other arm.\nAlternate between arms for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-tig3PXb",
    "nombre": "Bodyweight Standing Close-grip Row",
    "descripcion": "ExerciseDB bodyweight standing close-grip row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/tig3PXb.gif",
    "exerciseDbId": "tig3PXb",
    "exerciseDbName": "bodyweight standing close-grip row",
    "exerciseDbAliases": [
      "bodyweight standing close-grip row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nBend forward at the waist, keeping your back straight and your core engaged.\nExtend your arms straight in front of you, gripping the bar or handles with a close grip.\nPull the bar or handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-GaSzzuh",
    "nombre": "Back Lever",
    "descripcion": "ExerciseDB back lever.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/GaSzzuh.gif",
    "exerciseDbId": "GaSzzuh",
    "exerciseDbName": "back lever",
    "exerciseDbAliases": [
      "back lever"
    ],
    "instrucciones": "Start by hanging from a pull-up bar with an overhand grip, hands slightly wider than shoulder-width apart.\nEngage your core and pull your shoulder blades down and back.\nBend your knees and tuck them towards your chest.\nSlowly lift your legs up, keeping them straight, until your body is parallel to the ground.\nHold this position for a few seconds, then slowly lower your legs back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-PQStVXH",
    "nombre": "Cable Upper Row",
    "descripcion": "ExerciseDB cable upper row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/PQStVXH.gif",
    "exerciseDbId": "PQStVXH",
    "exerciseDbName": "cable upper row",
    "exerciseDbAliases": [
      "cable upper row"
    ],
    "instrucciones": "Attach a straight bar to a cable machine at chest height.\nStand facing the machine with your feet shoulder-width apart.\nGrasp the bar with an overhand grip, hands slightly wider than shoulder-width apart.\nKeep your back straight and your core engaged.\nPull the bar towards your upper chest, squeezing your shoulder blades together.\nPause for a moment at the top of the movement.\nSlowly release the bar back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-qcY50ZD",
    "nombre": "Cable Seated Wide-grip Row",
    "descripcion": "ExerciseDB cable seated wide-grip row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/qcY50ZD.gif",
    "exerciseDbId": "qcY50ZD",
    "exerciseDbName": "cable seated wide-grip row",
    "exerciseDbAliases": [
      "cable seated wide-grip row"
    ],
    "instrucciones": "Sit on the cable row machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handle with a wide overhand grip, palms facing down.\nKeep your back straight and lean slightly forward from the hips.\nPull the handle towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the peak of the contraction.\nSlowly release the handle back to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-GSDioYu",
    "nombre": "Upper Back Stretch",
    "descripcion": "ExerciseDB upper back stretch.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/GSDioYu.gif",
    "exerciseDbId": "GSDioYu",
    "exerciseDbName": "upper back stretch",
    "exerciseDbAliases": [
      "upper back stretch"
    ],
    "instrucciones": "Stand up straight with your feet shoulder-width apart.\nExtend your arms straight in front of you, parallel to the ground.\nInterlace your fingers and rotate your palms away from your body.\nSlowly raise your arms overhead, keeping them straight and parallel to each other.\nAs you raise your arms, squeeze your shoulder blades together.\nHold the stretch for 15-30 seconds, then release and repeat.",
    "esPersonalizado": false
  },
  {
    "id": "db-MgKwAAo",
    "nombre": "Cable Rope Extension Incline Bench Row",
    "descripcion": "ExerciseDB cable rope extension incline bench row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/MgKwAAo.gif",
    "exerciseDbId": "MgKwAAo",
    "exerciseDbName": "cable rope extension incline bench row",
    "exerciseDbAliases": [
      "cable rope extension incline bench row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle and attach a cable machine to the low pulley.\nAttach a rope handle to the cable machine and sit on the incline bench facing the machine.\nGrab the rope handle with an overhand grip and lean forward, keeping your back straight.\nExtend your arms fully, pulling the rope towards your upper chest while keeping your elbows close to your body.\nSqueeze your shoulder blades together at the end of the movement.\nSlowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-O4oIqQD",
    "nombre": "Bodyweight Standing One Arm Row (with Towel)",
    "descripcion": "ExerciseDB bodyweight standing one arm row (with towel).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/O4oIqQD.gif",
    "exerciseDbId": "O4oIqQD",
    "exerciseDbName": "bodyweight standing one arm row (with towel)",
    "exerciseDbAliases": [
      "bodyweight standing one arm row (with towel)"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a towel with one hand.\nBend forward at the hips, keeping your back straight and your core engaged.\nPull the towel towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the towel back to the starting position.\nRepeat for the desired number of repetitions, then switch to the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZIViNh1",
    "nombre": "Dumbbell Reverse Grip Incline Bench One Arm Row",
    "descripcion": "ExerciseDB dumbbell reverse grip incline bench one arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/ZIViNh1.gif",
    "exerciseDbId": "ZIViNh1",
    "exerciseDbName": "dumbbell reverse grip incline bench one arm row",
    "exerciseDbAliases": [
      "dumbbell reverse grip incline bench one arm row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nPlace a dumbbell on the floor next to the bench.\nStand facing the bench with your feet shoulder-width apart.\nBend at the waist and place your left knee and left hand on the bench for support.\nPick up the dumbbell with your right hand using a reverse grip (palm facing down).\nKeep your back straight and your core engaged.\nPull the dumbbell up towards your chest, keeping your elbow close to your body.\nSqueeze your back muscles at the top of the movement.\nLower the dumbbell back down to the starting position in a controlled manner.\nRepeat for the desired number of repetitions.\nSwitch sides and repeat the exercise with your left arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-hbY9wqG",
    "nombre": "Front Lever Reps",
    "descripcion": "ExerciseDB front lever reps.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "core",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/hbY9wqG.gif",
    "exerciseDbId": "hbY9wqG",
    "exerciseDbName": "front lever reps",
    "exerciseDbAliases": [
      "front lever reps"
    ],
    "instrucciones": "Hang from a pull-up bar with an overhand grip, palms facing away from you.\nEngage your core and pull your shoulder blades down and back.\nKeeping your body straight, lift your legs up until they are parallel to the ground.\nHold this position for as long as you can, aiming for 10-20 seconds.\nSlowly lower your legs back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-yaAxcQr",
    "nombre": "Rope Climb",
    "descripcion": "ExerciseDB rope climb.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "forearms",
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "rope",
    "imagenUrl": "https://static.exercisedb.dev/media/yaAxcQr.gif",
    "exerciseDbId": "yaAxcQr",
    "exerciseDbName": "rope climb",
    "exerciseDbAliases": [
      "rope climb"
    ],
    "instrucciones": "Stand facing the rope with your feet shoulder-width apart.\nGrab the rope with both hands, palms facing towards you.\nBend your knees slightly and engage your core.\nBegin pulling yourself up the rope by alternating hand-over-hand movements.\nUse your legs to assist in the upward movement.\nContinue climbing until you reach the desired height or the top of the rope.\nTo descend, reverse the hand-over-hand movement while controlling your descent.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-4OaumBr",
    "nombre": "Suspended Row",
    "descripcion": "ExerciseDB suspended row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/4OaumBr.gif",
    "exerciseDbId": "4OaumBr",
    "exerciseDbName": "suspended row",
    "exerciseDbAliases": [
      "suspended row"
    ],
    "instrucciones": "Set up a suspension trainer at an appropriate height.\nStand facing the anchor point with your feet shoulder-width apart.\nHold the handles with an overhand grip, palms facing each other.\nLean back, keeping your body straight and your heels on the ground.\nPull your chest towards the handles, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower yourself back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-r0z6xzQ",
    "nombre": "Barbell Pendlay Row",
    "descripcion": "ExerciseDB barbell pendlay row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/r0z6xzQ.gif",
    "exerciseDbId": "r0z6xzQ",
    "exerciseDbName": "barbell pendlay row",
    "exerciseDbAliases": [
      "barbell pendlay row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and your knees slightly bent.\nBend forward at the hips, keeping your back straight and your chest up.\nGrasp the barbell with an overhand grip, slightly wider than shoulder-width apart.\nPull the barbell towards your upper abdomen, squeezing your shoulder blades together.\nLower the barbell back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Jsgsc27",
    "nombre": "Barbell One Arm Bent Over Row",
    "descripcion": "ExerciseDB barbell one arm bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/Jsgsc27.gif",
    "exerciseDbId": "Jsgsc27",
    "exerciseDbName": "barbell one arm bent over row",
    "exerciseDbAliases": [
      "barbell one arm bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a barbell with one hand using an overhand grip.\nBend forward at the hips, keeping your back straight and your head in a neutral position.\nPull the barbell up towards your chest, keeping your elbow close to your body and squeezing your shoulder blades together.\nLower the barbell back down to the starting position in a controlled manner.\nRepeat for the desired number of repetitions, then switch to the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-OIFMAp1",
    "nombre": "Lever One Arm Lateral High Row",
    "descripcion": "ExerciseDB lever one arm lateral high row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/OIFMAp1.gif",
    "exerciseDbId": "OIFMAp1",
    "exerciseDbName": "lever one arm lateral high row",
    "exerciseDbAliases": [
      "lever one arm lateral high row"
    ],
    "instrucciones": "Adjust the seat height and position yourself facing the machine.\nGrasp the handle with one hand and keep your back straight.\nPull the handle towards your body, keeping your elbow close to your side.\nSqueeze your back muscles at the top of the movement.\nSlowly release the handle back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-MSfvriJ",
    "nombre": "Skin The Cat",
    "descripcion": "ExerciseDB skin the cat.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/MSfvriJ.gif",
    "exerciseDbId": "MSfvriJ",
    "exerciseDbName": "skin the cat",
    "exerciseDbAliases": [
      "skin the cat"
    ],
    "instrucciones": "Start by hanging from a bar with your arms fully extended and your body relaxed.\nEngage your core and lift your legs up, bringing your knees towards your chest.\nContinue to lift your legs up and over your head, allowing your body to pass through the arms.\nOnce your legs are fully extended over your head, begin to lower them back down towards the starting position.\nAs you lower your legs, allow your body to pass back through the arms until you are hanging with your arms fully extended again.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Mxa7Cr8",
    "nombre": "Inverted Row On Bench",
    "descripcion": "ExerciseDB inverted row on bench.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/Mxa7Cr8.gif",
    "exerciseDbId": "Mxa7Cr8",
    "exerciseDbName": "inverted row on bench",
    "exerciseDbAliases": [
      "inverted row on bench"
    ],
    "instrucciones": "Set up a bench at a height that allows your body to hang freely underneath it.\nLie face up on the ground with your head towards the bench.\nReach up and grab the bench with an overhand grip, slightly wider than shoulder-width apart.\nPosition your body so that your heels are on the ground and your arms are fully extended.\nEngage your core and squeeze your shoulder blades together as you pull your chest up towards the bench.\nPause for a moment at the top of the movement, then slowly lower your body back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-kesXOpB",
    "nombre": "Cable Decline Seated Wide-grip Row",
    "descripcion": "ExerciseDB cable decline seated wide-grip row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/kesXOpB.gif",
    "exerciseDbId": "kesXOpB",
    "exerciseDbName": "cable decline seated wide-grip row",
    "exerciseDbAliases": [
      "cable decline seated wide-grip row"
    ],
    "instrucciones": "Sit on the decline bench facing the cable machine with your feet securely placed on the footrests.\nGrasp the cable attachment with a wide overhand grip, palms facing down.\nLean back slightly, keeping your back straight and your core engaged.\nPull the cable towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the peak of the contraction, then slowly release the cable back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-oHg8eop",
    "nombre": "Medicine Ball Overhead Slam",
    "descripcion": "ExerciseDB medicine ball overhead slam.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "medicine ball",
    "imagenUrl": "https://static.exercisedb.dev/media/oHg8eop.gif",
    "exerciseDbId": "oHg8eop",
    "exerciseDbName": "medicine ball overhead slam",
    "exerciseDbAliases": [
      "medicine ball overhead slam"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a medicine ball with both hands above your head.\nEngage your core and keep your back straight.\nBend your knees slightly and forcefully slam the medicine ball down to the ground in front of you.\nAs you slam the ball down, use your entire body to generate power, including your shoulders and core.\nCatch the ball on the bounce and repeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-g9AsZ8P",
    "nombre": "Kettlebell One Arm Row",
    "descripcion": "ExerciseDB kettlebell one arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "kettlebell",
    "imagenUrl": "https://static.exercisedb.dev/media/g9AsZ8P.gif",
    "exerciseDbId": "g9AsZ8P",
    "exerciseDbName": "kettlebell one arm row",
    "exerciseDbAliases": [
      "kettlebell one arm row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a kettlebell in one hand with an overhand grip.\nBend your knees slightly and hinge forward at the hips, keeping your back straight and your core engaged.\nPull the kettlebell up towards your chest, keeping your elbow close to your body and squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the kettlebell back down to the starting position.\nRepeat for the desired number of repetitions, then switch sides and repeat with the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZSJNetl",
    "nombre": "Cable High Row (kneeling)",
    "descripcion": "ExerciseDB cable high row (kneeling).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/ZSJNetl.gif",
    "exerciseDbId": "ZSJNetl",
    "exerciseDbName": "cable high row (kneeling)",
    "exerciseDbAliases": [
      "cable high row (kneeling)"
    ],
    "instrucciones": "Attach a straight bar to a cable machine at chest height.\nKneel down in front of the cable machine and grab the bar with an overhand grip, hands shoulder-width apart.\nSit back on your heels, keeping your back straight and your core engaged.\nPull the bar towards your upper abdomen, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the bar back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-PbzNu7c",
    "nombre": "Dumbbell Incline Y-raise",
    "descripcion": "ExerciseDB dumbbell incline y-raise.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "rear deltoids"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/PbzNu7c.gif",
    "exerciseDbId": "PbzNu7c",
    "exerciseDbName": "dumbbell incline y-raise",
    "exerciseDbAliases": [
      "dumbbell incline y-raise"
    ],
    "instrucciones": "Set an incline bench to a 45-degree angle and sit on it with a dumbbell in each hand, palms facing inwards.\nLean forward slightly and let your arms hang straight down, keeping a slight bend in your elbows.\nRaise your arms out to the sides and up in a Y shape until they are parallel to the ground.\nPause for a moment at the top, then slowly lower your arms back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-LuBEORI",
    "nombre": "Lever Bent-over Row With V-bar",
    "descripcion": "ExerciseDB lever bent-over row with v-bar.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/LuBEORI.gif",
    "exerciseDbId": "LuBEORI",
    "exerciseDbName": "lever bent-over row with v-bar",
    "exerciseDbAliases": [
      "lever bent-over row with v-bar"
    ],
    "instrucciones": "Adjust the seat height and position yourself facing the machine.\nGrasp the v-bar with an overhand grip, keeping your back straight and your knees slightly bent.\nPull the v-bar towards your abdomen, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the weight back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-EIsE3u8",
    "nombre": "Cable One Arm Bent Over Row",
    "descripcion": "ExerciseDB cable one arm bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/EIsE3u8.gif",
    "exerciseDbId": "EIsE3u8",
    "exerciseDbName": "cable one arm bent over row",
    "exerciseDbAliases": [
      "cable one arm bent over row"
    ],
    "instrucciones": "Stand facing a cable machine with your feet shoulder-width apart.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the cable handle with one hand, palm facing inward, and extend your arm fully.\nPull the cable handle towards your body, keeping your elbow close to your side, until your hand reaches your lower chest.\nPause for a moment, then slowly extend your arm back to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-jdiExfW",
    "nombre": "Inverted Row With Straps",
    "descripcion": "ExerciseDB inverted row with straps.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/jdiExfW.gif",
    "exerciseDbId": "jdiExfW",
    "exerciseDbName": "inverted row with straps",
    "exerciseDbAliases": [
      "inverted row with straps"
    ],
    "instrucciones": "Set up a suspension trainer or straps at chest height.\nStand facing the anchor point and grab the handles with an overhand grip.\nWalk your feet forward, leaning back until your body is at an angle.\nKeep your body straight and engage your core.\nPull your chest towards the handles, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower yourself back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wbUYILZ",
    "nombre": "Elbow Lift - Reverse Push-up",
    "descripcion": "ExerciseDB elbow lift - reverse push-up.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "triceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/wbUYILZ.gif",
    "exerciseDbId": "wbUYILZ",
    "exerciseDbName": "elbow lift - reverse push-up",
    "exerciseDbAliases": [
      "elbow lift - reverse push-up"
    ],
    "instrucciones": "Start by lying face down on the ground with your legs extended and your hands placed directly under your shoulders.\nEngage your core and press through your palms to lift your upper body off the ground, keeping your elbows close to your sides.\nPause at the top for a moment, squeezing your upper back muscles.\nSlowly lower your body back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-7I6LNUG",
    "nombre": "Lever Seated Row",
    "descripcion": "ExerciseDB lever seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/7I6LNUG.gif",
    "exerciseDbId": "7I6LNUG",
    "exerciseDbName": "lever seated row",
    "exerciseDbAliases": [
      "lever seated row"
    ],
    "instrucciones": "Adjust the seat height and footrests to a comfortable position.\nSit on the machine with your chest against the pad and your feet on the footrests.\nGrasp the handles with an overhand grip, shoulder-width apart.\nKeep your back straight and your core engaged.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement.\nSlowly release the handles and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-yaMIo4D",
    "nombre": "Cable Incline Bench Row",
    "descripcion": "ExerciseDB cable incline bench row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "rear deltoids"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/yaMIo4D.gif",
    "exerciseDbId": "yaMIo4D",
    "exerciseDbName": "cable incline bench row",
    "exerciseDbAliases": [
      "cable incline bench row"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle and attach a cable handle to the low pulley.\nSit on the bench facing the cable machine with your feet flat on the floor and your knees slightly bent.\nGrasp the cable handle with an overhand grip and extend your arms fully in front of you.\nLean forward from your hips while keeping your back straight and your core engaged.\nPull the cable handle towards your chest by retracting your shoulder blades and bending your elbows.\nSqueeze your back muscles at the top of the movement, then slowly extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-X3cqyXz",
    "nombre": "Lever Bent Over Row",
    "descripcion": "ExerciseDB lever bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/X3cqyXz.gif",
    "exerciseDbId": "X3cqyXz",
    "exerciseDbName": "lever bent over row",
    "exerciseDbAliases": [
      "lever bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold the barbell with an overhand grip, hands slightly wider than shoulder-width apart.\nBend forward at the hips, keeping your back straight and chest up.\nPull the barbell towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-IGjKj1v",
    "nombre": "Lever Narrow Grip Seated Row",
    "descripcion": "ExerciseDB lever narrow grip seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/IGjKj1v.gif",
    "exerciseDbId": "IGjKj1v",
    "exerciseDbName": "lever narrow grip seated row",
    "exerciseDbAliases": [
      "lever narrow grip seated row"
    ],
    "instrucciones": "Adjust the seat height and footrests to ensure proper form.\nSit on the machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with a narrow grip, palms facing each other.\nKeep your back straight and lean slightly forward.\nPull the handles towards your torso, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement.\nSlowly release the handles and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Nu7jqFE",
    "nombre": "Resistance Band Seated Straight Back Row",
    "descripcion": "ExerciseDB resistance band seated straight back row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "resistance band",
    "imagenUrl": "https://static.exercisedb.dev/media/Nu7jqFE.gif",
    "exerciseDbId": "Nu7jqFE",
    "exerciseDbName": "resistance band seated straight back row",
    "exerciseDbAliases": [
      "resistance band seated straight back row"
    ],
    "instrucciones": "Sit on the floor with your legs extended and loop the resistance band around your feet.\nHold the ends of the resistance band with your hands, palms facing each other.\nKeep your back straight and lean slightly back, engaging your core.\nPull the resistance band towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-bLyQokI",
    "nombre": "London Bridge",
    "descripcion": "ExerciseDB london bridge.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "rope",
    "imagenUrl": "https://static.exercisedb.dev/media/bLyQokI.gif",
    "exerciseDbId": "bLyQokI",
    "exerciseDbName": "london bridge",
    "exerciseDbAliases": [
      "london bridge"
    ],
    "instrucciones": "Attach the rope to a high anchor point.\nStand facing away from the anchor point with your feet shoulder-width apart.\nGrasp the rope with an overhand grip, palms facing down.\nLean forward slightly, keeping your back straight and core engaged.\nPull the rope towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-G8dXpNG",
    "nombre": "Ez Bar Reverse Grip Bent Over Row",
    "descripcion": "ExerciseDB ez bar reverse grip bent over row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/G8dXpNG.gif",
    "exerciseDbId": "G8dXpNG",
    "exerciseDbName": "ez bar reverse grip bent over row",
    "exerciseDbAliases": [
      "ez bar reverse grip bent over row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold the ez barbell with an underhand grip, palms facing up, and hands shoulder-width apart.\nBend forward at the hips, keeping your back straight and chest up, until your torso is almost parallel to the floor.\nPull the ez barbell towards your lower chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the ez barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-DKBwJrL",
    "nombre": "Band One Arm Twisting Seated Row",
    "descripcion": "ExerciseDB band one arm twisting seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "band",
    "imagenUrl": "https://static.exercisedb.dev/media/DKBwJrL.gif",
    "exerciseDbId": "DKBwJrL",
    "exerciseDbName": "band one arm twisting seated row",
    "exerciseDbAliases": [
      "band one arm twisting seated row"
    ],
    "instrucciones": "Sit on a bench or chair with your feet flat on the ground and your back straight.\nHold the band with one hand and extend your arm fully in front of you.\nKeeping your back straight, pull the band towards your body by bending your elbow and squeezing your shoulder blades together.\nAt the same time, twist your torso towards the side of the pulling arm.\nPause for a moment at the top, then slowly release the tension in the band and return to the starting position.\nRepeat for the desired number of repetitions, then switch to the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-SJqRxOt",
    "nombre": "Cable Rope Seated Row",
    "descripcion": "ExerciseDB cable rope seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/SJqRxOt.gif",
    "exerciseDbId": "SJqRxOt",
    "exerciseDbName": "cable rope seated row",
    "exerciseDbAliases": [
      "cable rope seated row"
    ],
    "instrucciones": "Sit on the rowing machine with your feet flat on the footrests and knees slightly bent.\nGrasp the cable ropes with an overhand grip, palms facing each other.\nKeep your back straight and lean slightly forward, maintaining a slight bend in your elbows.\nPull the cable ropes towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the tension and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Tq6gbK6",
    "nombre": "Cable Straight Back Seated Row",
    "descripcion": "ExerciseDB cable straight back seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/Tq6gbK6.gif",
    "exerciseDbId": "Tq6gbK6",
    "exerciseDbName": "cable straight back seated row",
    "exerciseDbAliases": [
      "cable straight back seated row"
    ],
    "instrucciones": "Sit on the cable row machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the cable handles with an overhand grip, palms facing down.\nKeep your back straight and lean slightly forward from the hips.\nPull the cable handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Nh3mvOO",
    "nombre": "Dumbbell Reverse Grip Row (female)",
    "descripcion": "ExerciseDB dumbbell reverse grip row (female).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/Nh3mvOO.gif",
    "exerciseDbId": "Nh3mvOO",
    "exerciseDbName": "dumbbell reverse grip row (female)",
    "exerciseDbAliases": [
      "dumbbell reverse grip row (female)"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold a dumbbell in each hand with an overhand grip, palms facing your body.\nBend forward at the waist, keeping your back straight and your core engaged.\nLet your arms hang straight down, fully extended, with a slight bend in your elbows.\nPull the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-WM6TvvW",
    "nombre": "Cable Low Seated Row Controlled",
    "descripcion": "ExerciseDB cable low seated row controlled.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/WM6TvvW.gif",
    "exerciseDbId": "WM6TvvW",
    "exerciseDbName": "cable low seated row controlled",
    "exerciseDbAliases": [
      "cable low seated row controlled"
    ],
    "instrucciones": "Sit on the machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with an overhand grip, palms facing down.\nKeep your back straight and lean slightly forward, maintaining a slight bend in your elbows. Maintain controlled form throughout.\nPull the handles towards your body, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-N6dZN2I",
    "nombre": "Side Cable High Row (kneeling)",
    "descripcion": "ExerciseDB side cable high row (kneeling).",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/N6dZN2I.gif",
    "exerciseDbId": "N6dZN2I",
    "exerciseDbName": "side cable high row (kneeling)",
    "exerciseDbAliases": [
      "side cable high row (kneeling)"
    ],
    "instrucciones": "Attach a straight bar to a cable machine at chest height.\nKneel down in front of the cable machine and grab the bar with an overhand grip, hands shoulder-width apart.\nSit back on your heels, keeping your back straight and your core engaged.\nPull the bar towards your upper abdomen, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the bar back to the starting position.\nRepeat for the desired number of repetitions. Maintain side form throughout.",
    "esPersonalizado": false
  },
  {
    "id": "db-u3UuCZu",
    "nombre": "Intense Kettlebell Two Arm Row",
    "descripcion": "ExerciseDB intense kettlebell two arm row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "kettlebell",
    "imagenUrl": "https://static.exercisedb.dev/media/u3UuCZu.gif",
    "exerciseDbId": "u3UuCZu",
    "exerciseDbName": "intense kettlebell two arm row",
    "exerciseDbAliases": [
      "intense kettlebell two arm row"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, knees slightly bent, and hold a kettlebell in each hand with your palms facing your body.\nBend forward at the hips, keeping your back straight and your core engaged.\nPull the kettlebells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the kettlebells back down to the starting position.\nRepeat for the desired number of repetitions. Maintain intense form throughout.",
    "esPersonalizado": false
  },
  {
    "id": "db-KWyEjtI",
    "nombre": "Precision Style Lever Bent-over Row With V-bar",
    "descripcion": "ExerciseDB precision style lever bent-over row with v-bar.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/KWyEjtI.gif",
    "exerciseDbId": "KWyEjtI",
    "exerciseDbName": "precision style lever bent-over row with v-bar",
    "exerciseDbAliases": [
      "precision style lever bent-over row with v-bar"
    ],
    "instrucciones": "Adjust the seat height and position yourself facing the machine.\nGrasp the v-bar with an overhand grip, keeping your back straight and your knees slightly bent.\nPull the v-bar towards your abdomen, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the weight back to the starting position. Emphasize precision control.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-pgIdT6i",
    "nombre": "Band One Arm Standing Low Row - Lateral Variation",
    "descripcion": "ExerciseDB band one arm standing low row - lateral variation.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "band",
    "imagenUrl": "https://static.exercisedb.dev/media/pgIdT6i.gif",
    "exerciseDbId": "pgIdT6i",
    "exerciseDbName": "band one arm standing low row - lateral variation",
    "exerciseDbAliases": [
      "band one arm standing low row - lateral variation"
    ],
    "instrucciones": "Attach the band to a stable anchor point at waist height.\nStand facing the anchor point with your feet shoulder-width apart.\nHold the band with one hand, palm facing inward, and step back to create tension in the band.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nPull the band towards your waist, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly release the band back to the starting position.\nRepeat for the desired number of repetitions, then switch sides. Emphasize lateral control.",
    "esPersonalizado": false
  },
  {
    "id": "db-dAJscVq",
    "nombre": "Cable Incline Bench Row - Elite Variation",
    "descripcion": "ExerciseDB cable incline bench row - elite variation.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "rear deltoids"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/dAJscVq.gif",
    "exerciseDbId": "dAJscVq",
    "exerciseDbName": "cable incline bench row - elite variation",
    "exerciseDbAliases": [
      "cable incline bench row - elite variation"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle and attach a cable handle to the low pulley.\nSit on the bench facing the cable machine with your feet flat on the floor and your knees slightly bent.\nGrasp the cable handle with an overhand grip and extend your arms fully in front of you. Perform with elite intensity.\nLean forward from your hips while keeping your back straight and your core engaged.\nPull the cable handle towards your chest by retracting your shoulder blades and bending your elbows.\nSqueeze your back muscles at the top of the movement, then slowly extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-9fCHfSc",
    "nombre": "Pointed Cable Palm Rotational Row",
    "descripcion": "ExerciseDB pointed cable palm rotational row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/9fCHfSc.gif",
    "exerciseDbId": "9fCHfSc",
    "exerciseDbName": "pointed cable palm rotational row",
    "exerciseDbAliases": [
      "pointed cable palm rotational row"
    ],
    "instrucciones": "Attach a handle to a cable machine at waist height.\nStand facing the machine with your feet shoulder-width apart.\nGrasp the handle with an overhand grip, palms facing down.\nStep back to create tension on the cable, keeping your back straight and knees slightly bent. Emphasize pointed control.\nPull the handle towards your body, rotating your palms to face upwards as you do so.\nSqueeze your shoulder blades together at the end of the movement.\nSlowly release the handle back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-1u36hhy",
    "nombre": "Stability Lever Narrow Grip Seated Row",
    "descripcion": "ExerciseDB stability lever narrow grip seated row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/1u36hhy.gif",
    "exerciseDbId": "1u36hhy",
    "exerciseDbName": "stability lever narrow grip seated row",
    "exerciseDbAliases": [
      "stability lever narrow grip seated row"
    ],
    "instrucciones": "Adjust the seat height and footrests to ensure proper form.\nSit on the machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with a narrow grip, palms facing each other.\nKeep your back straight and lean slightly forward.\nPull the handles towards your torso, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement.\nSlowly release the handles and return to the starting position. Focus on stability movement.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-w44vFvP",
    "nombre": "Smith One Arm Row Linear",
    "descripcion": "ExerciseDB smith one arm row linear.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/w44vFvP.gif",
    "exerciseDbId": "w44vFvP",
    "exerciseDbName": "smith one arm row linear",
    "exerciseDbAliases": [
      "smith one arm row linear"
    ],
    "instrucciones": "Adjust the height of the smith machine bar to waist level.\nStand facing the smith machine with your feet shoulder-width apart. Emphasize linear control.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the bar with one hand using an overhand grip, with your palm facing down.\nKeep your elbow close to your body and pull the bar towards your waist, squeezing your shoulder blades together.\nPause for a moment at the top of the movement, then slowly lower the bar back to the starting position.\nRepeat for the desired number of repetitions, then switch to the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-A3P4O0R",
    "nombre": "Cable Seated Row With Reverse",
    "descripcion": "ExerciseDB cable seated row with reverse.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/A3P4O0R.gif",
    "exerciseDbId": "A3P4O0R",
    "exerciseDbName": "cable seated row with reverse",
    "exerciseDbAliases": [
      "cable seated row with reverse"
    ],
    "instrucciones": "Sit on the cable row machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with an overhand grip, keeping your back straight and your shoulders relaxed.\nPull the handles towards your body, squeezing your shoulder blades together. Focus on reverse movement.\nPause for a moment at the peak of the movement, then slowly release the handles back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-5lE7XRz",
    "nombre": "Smith Bent Over Row With Declined",
    "descripcion": "ExerciseDB smith bent over row with declined.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/5lE7XRz.gif",
    "exerciseDbId": "5lE7XRz",
    "exerciseDbName": "smith bent over row with declined",
    "exerciseDbAliases": [
      "smith bent over row with declined"
    ],
    "instrucciones": "Set up the smith machine with the bar at hip height.\nStand facing the bar with your feet shoulder-width apart.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nGrasp the bar with an overhand grip, hands slightly wider than shoulder-width apart.\nPull the bar towards your lower chest, squeezing your shoulder blades together. Perform with declined intensity.\nPause for a moment at the top, then slowly lower the bar back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-KQfySvS",
    "nombre": "Dumbbell Reverse Grip Row (female) Hold",
    "descripcion": "ExerciseDB dumbbell reverse grip row (female) hold.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/KQfySvS.gif",
    "exerciseDbId": "KQfySvS",
    "exerciseDbName": "dumbbell reverse grip row (female) hold",
    "exerciseDbAliases": [
      "dumbbell reverse grip row (female) hold"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold a dumbbell in each hand with an overhand grip, palms facing your body. Perform with hold intensity.\nBend forward at the waist, keeping your back straight and your core engaged.\nLet your arms hang straight down, fully extended, with a slight bend in your elbows.\nPull the dumbbells up towards your chest, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-iCPqbki",
    "nombre": "Lever Narrow Grip Seated Row - Strength Variation",
    "descripcion": "ExerciseDB lever narrow grip seated row - strength variation.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/iCPqbki.gif",
    "exerciseDbId": "iCPqbki",
    "exerciseDbName": "lever narrow grip seated row - strength variation",
    "exerciseDbAliases": [
      "lever narrow grip seated row - strength variation"
    ],
    "instrucciones": "Adjust the seat height and footrests to ensure proper form.\nSit on the machine with your feet flat on the footrests and your knees slightly bent.\nGrasp the handles with a narrow grip, palms facing each other.\nKeep your back straight and lean slightly forward.\nPull the handles towards your torso, squeezing your shoulder blades together.\nPause for a moment at the peak of the movement. Maintain strength form throughout.\nSlowly release the handles and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-1YUWDNZ",
    "nombre": "Extended Style Inverted Row",
    "descripcion": "ExerciseDB extended style inverted row.",
    "grupoMuscularPrimario": "upper back",
    "gruposMuscularesSecundarios": [
      "biceps",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/1YUWDNZ.gif",
    "exerciseDbId": "1YUWDNZ",
    "exerciseDbName": "extended style inverted row",
    "exerciseDbAliases": [
      "extended style inverted row"
    ],
    "instrucciones": "Set up a bar at waist height or use a suspension trainer.\nStand facing the bar or suspension trainer, with your feet shoulder-width apart.\nGrab the bar or handles with an overhand grip, slightly wider than shoulder-width apart.\nLean back, keeping your body straight and your heels on the ground.\nPull your chest towards the bar or handles, squeezing your shoulder blades together.\nPause for a moment at the top, then slowly lower yourself back to the starting position.\nRepeat for the desired number of repetitions. Perform with extended intensity.",
    "esPersonalizado": false
  },
  {
    "id": "db-LMGXZn8",
    "nombre": "Barbell Decline Close Grip To Skull Press",
    "descripcion": "ExerciseDB barbell decline close grip to skull press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/LMGXZn8.gif",
    "exerciseDbId": "LMGXZn8",
    "exerciseDbName": "barbell decline close grip to skull press",
    "exerciseDbAliases": [
      "barbell decline close grip to skull press"
    ],
    "instrucciones": "Lie on a decline bench with your head lower than your feet and hold a barbell with a close grip.\nLower the barbell towards your forehead by bending your elbows, keeping your upper arms stationary.\nPause for a moment, then extend your arms to press the barbell back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-x6KpKpq",
    "nombre": "Close-grip Push-up",
    "descripcion": "ExerciseDB close-grip push-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/x6KpKpq.gif",
    "exerciseDbId": "x6KpKpq",
    "exerciseDbName": "close-grip push-up",
    "exerciseDbAliases": [
      "close-grip push-up"
    ],
    "instrucciones": "Start in a high plank position with your hands placed close together, directly under your shoulders.\nEngage your core and lower your body towards the ground, keeping your elbows close to your sides.\nPush through your palms to extend your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-obe5LMq",
    "nombre": "Band Side Triceps Extension",
    "descripcion": "ExerciseDB band side triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "band",
    "imagenUrl": "https://static.exercisedb.dev/media/obe5LMq.gif",
    "exerciseDbId": "obe5LMq",
    "exerciseDbName": "band side triceps extension",
    "exerciseDbAliases": [
      "band side triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold the band with both hands, palms facing down.\nExtend your arms straight out to the sides, keeping them parallel to the ground.\nSlowly bend your elbows and bring your hands towards your shoulders, keeping your upper arms still.\nPause for a moment, then slowly extend your arms back out to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-qRZ5S1N",
    "nombre": "Cable One Arm Tricep Pushdown",
    "descripcion": "ExerciseDB cable one arm tricep pushdown.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/qRZ5S1N.gif",
    "exerciseDbId": "qRZ5S1N",
    "exerciseDbName": "cable one arm tricep pushdown",
    "exerciseDbAliases": [
      "cable one arm tricep pushdown"
    ],
    "instrucciones": "Stand facing a cable machine with a straight bar attachment at chest height.\nGrasp the bar with an overhand grip and step back to create tension in the cable.\nPosition your feet shoulder-width apart and slightly bend your knees.\nKeep your back straight and core engaged throughout the exercise.\nStart with your arm fully extended and perpendicular to the floor.\nKeeping your upper arm stationary, exhale and push the bar down until your arm is fully extended.\nPause for a moment, then inhale and slowly return to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-XooAdhl",
    "nombre": "Handstand",
    "descripcion": "ExerciseDB handstand.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/XooAdhl.gif",
    "exerciseDbId": "XooAdhl",
    "exerciseDbName": "handstand",
    "exerciseDbAliases": [
      "handstand"
    ],
    "instrucciones": "Find an open space with enough room to perform a handstand.\nPlace your hands on the ground shoulder-width apart, fingers pointing forward.\nKick your legs up towards the wall, using your core and shoulders to maintain balance.\nOnce in a handstand position, engage your triceps to support your body weight.\nHold the handstand for as long as you can maintain balance.\nTo come down, slowly lower your legs back to the ground.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-iaapw0g",
    "nombre": "Ez Barbell Seated Triceps Extension",
    "descripcion": "ExerciseDB ez barbell seated triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/iaapw0g.gif",
    "exerciseDbId": "iaapw0g",
    "exerciseDbName": "ez barbell seated triceps extension",
    "exerciseDbAliases": [
      "ez barbell seated triceps extension"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold the ez barbell with an overhand grip, hands shoulder-width apart.\nRaise the barbell overhead, fully extending your arms.\nKeeping your upper arms stationary, lower the barbell behind your head by bending your elbows.\nPause for a moment, then raise the barbell back to the starting position by extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-WcHl7ru",
    "nombre": "Smith Close-grip Bench Press",
    "descripcion": "ExerciseDB smith close-grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/WcHl7ru.gif",
    "exerciseDbId": "WcHl7ru",
    "exerciseDbName": "smith close-grip bench press",
    "exerciseDbAliases": [
      "smith close-grip bench press"
    ],
    "instrucciones": "Adjust the seat height and position yourself on the bench with your feet flat on the ground.\nGrasp the barbell with a close grip, slightly narrower than shoulder-width apart.\nLower the barbell towards your chest, keeping your elbows close to your body.\nPause for a moment at the bottom, then push the barbell back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-uxJcFUU",
    "nombre": "Cable Lying Triceps Extension V. 2",
    "descripcion": "ExerciseDB cable lying triceps extension v. 2.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/uxJcFUU.gif",
    "exerciseDbId": "uxJcFUU",
    "exerciseDbName": "cable lying triceps extension v. 2",
    "exerciseDbAliases": [
      "cable lying triceps extension v. 2"
    ],
    "instrucciones": "Attach a rope handle to a low pulley cable machine.\nLie down on a flat bench facing up, with your head towards the cable machine.\nGrasp the rope handle with both hands, palms facing each other, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the rope handle towards your forehead by bending your elbows.\nPause for a moment at the bottom, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-U3ffHlY",
    "nombre": "Cable Rope Lying On Floor Tricep Extension",
    "descripcion": "ExerciseDB cable rope lying on floor tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/U3ffHlY.gif",
    "exerciseDbId": "U3ffHlY",
    "exerciseDbName": "cable rope lying on floor tricep extension",
    "exerciseDbAliases": [
      "cable rope lying on floor tricep extension"
    ],
    "instrucciones": "Attach a rope to a cable machine and set it to the lowest position.\nLie on the floor facing up, with your head towards the cable machine.\nHold the rope with both hands, palms facing each other, and extend your arms straight up towards the ceiling.\nKeep your upper arms stationary and slowly lower the rope towards your forehead, bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Gchi5Tr",
    "nombre": "Cable Alternate Triceps Extension",
    "descripcion": "ExerciseDB cable alternate triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/Gchi5Tr.gif",
    "exerciseDbId": "Gchi5Tr",
    "exerciseDbName": "cable alternate triceps extension",
    "exerciseDbAliases": [
      "cable alternate triceps extension"
    ],
    "instrucciones": "Stand facing the cable machine with your feet shoulder-width apart.\nHold the cable handle with your right hand and bring your arm up so that your upper arm is parallel to the ground and your elbow is bent at a 90-degree angle.\nKeep your upper arm stationary and extend your forearm backward, fully straightening your arm.\nPause for a moment, then slowly return to the starting position.\nRepeat with your left arm.\nContinue alternating arms for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-NN8nSNT",
    "nombre": "Cable Rope High Pulley Overhead Tricep Extension",
    "descripcion": "ExerciseDB cable rope high pulley overhead tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/NN8nSNT.gif",
    "exerciseDbId": "NN8nSNT",
    "exerciseDbName": "cable rope high pulley overhead tricep extension",
    "exerciseDbAliases": [
      "cable rope high pulley overhead tricep extension"
    ],
    "instrucciones": "Attach a rope to a high pulley and adjust the weight accordingly.\nStand facing away from the pulley machine with your feet shoulder-width apart.\nGrasp the rope with both hands, palms facing down, and bring your hands above your head.\nKeep your upper arms close to your head and perpendicular to the floor.\nSlowly lower the rope behind your head by bending your elbows.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-jDnrkar",
    "nombre": "Dumbbell Incline One Arm Hammer Press On Exercise Ball",
    "descripcion": "ExerciseDB dumbbell incline one arm hammer press on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "chest"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/jDnrkar.gif",
    "exerciseDbId": "jDnrkar",
    "exerciseDbName": "dumbbell incline one arm hammer press on exercise ball",
    "exerciseDbAliases": [
      "dumbbell incline one arm hammer press on exercise ball"
    ],
    "instrucciones": "Sit on an exercise ball with a dumbbell in one hand.\nWalk your feet forward and roll your body down until your head, neck, and upper back are supported on the ball.\nHold the dumbbell with your palm facing inward and your elbow bent at a 90-degree angle.\nPress the dumbbell up towards the ceiling, straightening your arm.\nLower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-s0HKO2I",
    "nombre": "Bodyweight Kneeling Triceps Extension",
    "descripcion": "ExerciseDB bodyweight kneeling triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "chest"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/s0HKO2I.gif",
    "exerciseDbId": "s0HKO2I",
    "exerciseDbName": "bodyweight kneeling triceps extension",
    "exerciseDbAliases": [
      "bodyweight kneeling triceps extension"
    ],
    "instrucciones": "Kneel down on the ground with your knees hip-width apart.\nPlace your hands on the ground in front of you, shoulder-width apart, fingers pointing forward.\nExtend your legs straight behind you, balancing on your toes and hands, forming a straight line from head to heels.\nBend your elbows and lower your upper body towards the ground, keeping your elbows close to your sides.\nPause for a moment at the bottom, then push through your hands to straighten your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-gAwDzB3",
    "nombre": "Cable Triceps Pushdown (v-bar)",
    "descripcion": "ExerciseDB cable triceps pushdown (v-bar).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/gAwDzB3.gif",
    "exerciseDbId": "gAwDzB3",
    "exerciseDbName": "cable triceps pushdown (v-bar)",
    "exerciseDbAliases": [
      "cable triceps pushdown (v-bar)"
    ],
    "instrucciones": "Attach a v-bar attachment to the cable machine at the highest setting.\nStand facing the cable machine with your feet shoulder-width apart.\nGrasp the v-bar with an overhand grip, palms facing down, and your hands shoulder-width apart.\nKeep your elbows close to your sides and your upper arms stationary throughout the exercise.\nEngage your triceps and exhale as you push the v-bar down until your arms are fully extended.\nPause for a moment at the bottom of the movement, squeezing your triceps.\nInhale as you slowly return the v-bar to the starting position, maintaining control.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-HEJ6DIX",
    "nombre": "Cable Kickback",
    "descripcion": "ExerciseDB cable kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/HEJ6DIX.gif",
    "exerciseDbId": "HEJ6DIX",
    "exerciseDbName": "cable kickback",
    "exerciseDbAliases": [
      "cable kickback"
    ],
    "instrucciones": "Stand facing a cable machine with your feet shoulder-width apart.\nHold the cable handle with your right hand and step back to create tension in the cable.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nKeep your upper arm close to your body and your elbow bent at a 90-degree angle.\nExtend your forearm backward, straightening your arm fully.\nPause for a moment, then slowly return to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-cAvTaSg",
    "nombre": "Dumbbell Kickbacks On Exercise Ball",
    "descripcion": "ExerciseDB dumbbell kickbacks on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "back"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/cAvTaSg.gif",
    "exerciseDbId": "cAvTaSg",
    "exerciseDbName": "dumbbell kickbacks on exercise ball",
    "exerciseDbAliases": [
      "dumbbell kickbacks on exercise ball"
    ],
    "instrucciones": "Sit on an exercise ball with your feet flat on the ground and your back straight.\nHold a dumbbell in each hand with your palms facing inwards and your arms bent at a 90-degree angle.\nExtend your arms straight back, squeezing your triceps at the top of the movement.\nPause for a moment, then slowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-zZlORz6",
    "nombre": "Dumbbell Lying One Arm Supinated Triceps Extension",
    "descripcion": "ExerciseDB dumbbell lying one arm supinated triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/zZlORz6.gif",
    "exerciseDbId": "zZlORz6",
    "exerciseDbName": "dumbbell lying one arm supinated triceps extension",
    "exerciseDbAliases": [
      "dumbbell lying one arm supinated triceps extension"
    ],
    "instrucciones": "Lie flat on a bench with your back and head supported, and your feet flat on the ground.\nHold a dumbbell in one hand with an underhand grip, and extend your arm straight up above your shoulder.\nKeeping your upper arm stationary, slowly lower the dumbbell behind your head by bending your elbow.\nPause for a moment at the bottom, then extend your arm back up to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-J60bN17",
    "nombre": "Assisted Triceps Dip (kneeling)",
    "descripcion": "ExerciseDB assisted triceps dip (kneeling).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/J60bN17.gif",
    "exerciseDbId": "J60bN17",
    "exerciseDbName": "assisted triceps dip (kneeling)",
    "exerciseDbAliases": [
      "assisted triceps dip (kneeling)"
    ],
    "instrucciones": "Adjust the machine to your desired weight and height.\nKneel down on the pad facing the machine, with your hands gripping the handles.\nLower your body by bending your elbows, keeping your back straight and close to the machine.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-z6TAHoT",
    "nombre": "Dumbbell Twisting Bench Press",
    "descripcion": "ExerciseDB dumbbell twisting bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/z6TAHoT.gif",
    "exerciseDbId": "z6TAHoT",
    "exerciseDbName": "dumbbell twisting bench press",
    "exerciseDbAliases": [
      "dumbbell twisting bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nHold a dumbbell in each hand with an overhand grip, palms facing away from you.\nExtend your arms straight up over your chest, keeping a slight bend in your elbows.\nLower the dumbbells down towards your chest, keeping your elbows close to your body.\nAs you lower the dumbbells, twist your wrists so that your palms face towards you at the bottom of the movement.\nPause for a moment at the bottom, then reverse the movement by pressing the dumbbells back up to the starting position.\nAs you press the dumbbells up, twist your wrists back to the starting position with palms facing away from you.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Wgbn9qo",
    "nombre": "Triceps Dip (between Benches)",
    "descripcion": "ExerciseDB triceps dip (between benches).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/Wgbn9qo.gif",
    "exerciseDbId": "Wgbn9qo",
    "exerciseDbName": "triceps dip (between benches)",
    "exerciseDbAliases": [
      "triceps dip (between benches)"
    ],
    "instrucciones": "Sit on a bench with your hands gripping the edge of the bench, fingers pointing forward.\nSlide your butt off the bench, supporting your weight with your hands.\nBend your elbows and lower your body towards the ground, keeping your back close to the bench.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-RxayqAZ",
    "nombre": "Dumbbell Close-grip Press",
    "descripcion": "ExerciseDB dumbbell close-grip press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/RxayqAZ.gif",
    "exerciseDbId": "RxayqAZ",
    "exerciseDbName": "dumbbell close-grip press",
    "exerciseDbAliases": [
      "dumbbell close-grip press"
    ],
    "instrucciones": "Sit on a flat bench with a dumbbell in each hand, resting on your thighs.\nUsing your thighs to help raise the dumbbells, lift the dumbbells one at a time so that you can hold them in front of you at shoulder width.\nOnce at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.\nAs you breathe in, slowly lower the dumbbells to your side until they are about level with your chest.\nAs you exhale, use your triceps to lift the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-LkoAWAE",
    "nombre": "Elbow Dips",
    "descripcion": "ExerciseDB elbow dips.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/LkoAWAE.gif",
    "exerciseDbId": "LkoAWAE",
    "exerciseDbName": "elbow dips",
    "exerciseDbAliases": [
      "elbow dips"
    ],
    "instrucciones": "Sit on the edge of a bench or chair with your hands gripping the edge next to your hips.\nSlide your hips forward off the bench and straighten your legs, keeping your heels on the ground.\nBend your elbows and lower your body towards the ground, keeping your back close to the bench.\nPause for a moment at the bottom, then push through your hands to straighten your arms and lift your body back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-da4cXST",
    "nombre": "Ez-bar Close-grip Bench Press",
    "descripcion": "ExerciseDB ez-bar close-grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/da4cXST.gif",
    "exerciseDbId": "da4cXST",
    "exerciseDbName": "ez-bar close-grip bench press",
    "exerciseDbAliases": [
      "ez-bar close-grip bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the ez barbell with a close grip, hands shoulder-width apart, palms facing forward.\nLift the barbell off the rack and hold it directly above your chest with your arms fully extended.\nSlowly lower the barbell towards your chest, keeping your elbows close to your body.\nPause for a moment when the barbell touches your chest.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-bndCa3Q",
    "nombre": "Barbell Pin Presses",
    "descripcion": "ExerciseDB barbell pin presses.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/bndCa3Q.gif",
    "exerciseDbId": "bndCa3Q",
    "exerciseDbName": "barbell pin presses",
    "exerciseDbAliases": [
      "barbell pin presses"
    ],
    "instrucciones": "Set up a barbell on a power rack at chest height.\nStand facing the barbell and position yourself underneath it, with your feet shoulder-width apart.\nGrip the barbell with an overhand grip, slightly wider than shoulder-width apart.\nLift the barbell off the rack and hold it directly above your chest, with your arms fully extended.\nLower the barbell down towards your chest, keeping your elbows tucked in close to your body.\nPause for a moment when the barbell touches your chest.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-2IxROQ1",
    "nombre": "Cable Overhead Triceps Extension (rope Attachment)",
    "descripcion": "ExerciseDB cable overhead triceps extension (rope attachment).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/2IxROQ1.gif",
    "exerciseDbId": "2IxROQ1",
    "exerciseDbName": "cable overhead triceps extension (rope attachment)",
    "exerciseDbAliases": [
      "cable overhead triceps extension (rope attachment)"
    ],
    "instrucciones": "Attach a rope to a cable machine at a high position.\nStand facing away from the machine with your feet shoulder-width apart.\nGrasp the rope with both hands, palms facing each other, and bring your hands above your head.\nKeep your upper arms close to your head and your elbows pointing forward.\nSlowly lower the rope behind your head by bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wOLmCXc",
    "nombre": "Dumbbell Tricep Kickback With Stork Stance",
    "descripcion": "ExerciseDB dumbbell tricep kickback with stork stance.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/wOLmCXc.gif",
    "exerciseDbId": "wOLmCXc",
    "exerciseDbName": "dumbbell tricep kickback with stork stance",
    "exerciseDbAliases": [
      "dumbbell tricep kickback with stork stance"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in your right hand.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nBring your right elbow up to your side, keeping it bent at a 90-degree angle.\nExtend your right arm straight back, squeezing your triceps.\nPause for a moment, then slowly lower the dumbbell back to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-wkgnGfb",
    "nombre": "Dumbbell Incline Hammer Press On Exercise Ball",
    "descripcion": "ExerciseDB dumbbell incline hammer press on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/wkgnGfb.gif",
    "exerciseDbId": "wkgnGfb",
    "exerciseDbName": "dumbbell incline hammer press on exercise ball",
    "exerciseDbAliases": [
      "dumbbell incline hammer press on exercise ball"
    ],
    "instrucciones": "Sit on an exercise ball with a dumbbell in each hand, palms facing each other.\nWalk your feet forward and roll your body down the ball until your head, neck, and upper back are supported on the ball.\nHold the dumbbells at shoulder level, elbows bent and pointing out to the sides.\nPress the dumbbells up and slightly inward, keeping your palms facing each other.\nExtend your arms fully, squeezing your triceps at the top of the movement.\nSlowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-uOV3Itw",
    "nombre": "Triceps Stretch",
    "descripcion": "ExerciseDB triceps stretch.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/uOV3Itw.gif",
    "exerciseDbId": "uOV3Itw",
    "exerciseDbName": "triceps stretch",
    "exerciseDbAliases": [
      "triceps stretch"
    ],
    "instrucciones": "Stand or sit upright with your back straight.\nExtend one arm overhead, bending it at the elbow.\nPlace your opposite hand on the bent elbow and gently pull it towards your head.\nHold the stretch for 15-30 seconds, feeling a gentle stretch in your triceps.\nRelease the stretch and repeat on the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-L2V5Nan",
    "nombre": "Dumbbell Lying Extension (across Face)",
    "descripcion": "ExerciseDB dumbbell lying extension (across face).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/L2V5Nan.gif",
    "exerciseDbId": "L2V5Nan",
    "exerciseDbName": "dumbbell lying extension (across face)",
    "exerciseDbAliases": [
      "dumbbell lying extension (across face)"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold a dumbbell with both hands and extend your arms straight up above your chest, palms facing each other.\nKeeping your upper arms stationary, slowly lower the dumbbell in an arc behind your head until your forearms are parallel to the ground.\nPause for a moment, then contract your triceps to bring the dumbbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-vtusOWT",
    "nombre": "Barbell One Arm Floor Press",
    "descripcion": "ExerciseDB barbell one arm floor press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/vtusOWT.gif",
    "exerciseDbId": "vtusOWT",
    "exerciseDbName": "barbell one arm floor press",
    "exerciseDbAliases": [
      "barbell one arm floor press"
    ],
    "instrucciones": "Lie flat on your back on the floor with your knees bent and feet flat on the ground.\nHold the barbell with one hand, palm facing up, and extend your arm straight up over your chest.\nSlowly lower the barbell towards your chest, keeping your elbow close to your body.\nPause for a moment at the bottom, then push the barbell back up to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-bZq4bwK",
    "nombre": "Weighted Tricep Dips",
    "descripcion": "ExerciseDB weighted tricep dips.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "weighted",
    "imagenUrl": "https://static.exercisedb.dev/media/bZq4bwK.gif",
    "exerciseDbId": "bZq4bwK",
    "exerciseDbName": "weighted tricep dips",
    "exerciseDbAliases": [
      "weighted tricep dips"
    ],
    "instrucciones": "Sit on the edge of a bench or chair with your hands gripping the edge next to your hips.\nSlide your butt off the front of the bench with your legs extended in front of you.\nKeep your back close to the bench and your elbows slightly bent.\nLower your body by bending your elbows until your upper arms are parallel to the floor.\nPush yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-VjYliFZ",
    "nombre": "Cable Reverse-grip Pushdown",
    "descripcion": "ExerciseDB cable reverse-grip pushdown.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/VjYliFZ.gif",
    "exerciseDbId": "VjYliFZ",
    "exerciseDbName": "cable reverse-grip pushdown",
    "exerciseDbAliases": [
      "cable reverse-grip pushdown"
    ],
    "instrucciones": "Attach a straight bar to a high pulley cable machine.\nStand facing the machine with your feet shoulder-width apart.\nGrasp the bar with an underhand grip, palms facing up, and your hands shoulder-width apart.\nKeep your elbows close to your sides and your upper arms stationary throughout the exercise.\nUsing your triceps, push the bar down until your arms are fully extended and your triceps are contracted.\nPause for a moment, then slowly return the bar to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-1YB40kg",
    "nombre": "Incline Close-grip Push-up",
    "descripcion": "ExerciseDB incline close-grip push-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/1YB40kg.gif",
    "exerciseDbId": "1YB40kg",
    "exerciseDbName": "incline close-grip push-up",
    "exerciseDbAliases": [
      "incline close-grip push-up"
    ],
    "instrucciones": "Place your hands on an elevated surface, such as a bench or step, slightly wider than shoulder-width apart.\nExtend your legs behind you, resting on the balls of your feet, with your body forming a straight line from head to heels.\nLower your chest towards the elevated surface by bending your elbows, keeping them close to your sides.\nPause for a moment at the bottom, then push yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-JhYSVwT",
    "nombre": "Dumbbell Seated Bench Extension",
    "descripcion": "ExerciseDB dumbbell seated bench extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/JhYSVwT.gif",
    "exerciseDbId": "JhYSVwT",
    "exerciseDbName": "dumbbell seated bench extension",
    "exerciseDbAliases": [
      "dumbbell seated bench extension"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold a dumbbell with both hands and extend your arms straight up above your head.\nSlowly lower the dumbbell behind your head, keeping your elbows close to your ears.\nPause for a moment, then raise the dumbbell back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-i11JWU7",
    "nombre": "Cable Standing Reverse Grip One Arm Overhead Tricep Extension",
    "descripcion": "ExerciseDB cable standing reverse grip one arm overhead tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/i11JWU7.gif",
    "exerciseDbId": "i11JWU7",
    "exerciseDbName": "cable standing reverse grip one arm overhead tricep extension",
    "exerciseDbAliases": [
      "cable standing reverse grip one arm overhead tricep extension"
    ],
    "instrucciones": "Stand facing away from the cable machine with your feet shoulder-width apart.\nHold the cable handle with an underhand grip and extend your arm overhead, keeping your elbow close to your head.\nKeep your upper arm stationary and slowly lower the cable handle behind your head by bending your elbow.\nPause for a moment at the bottom, then extend your arm back to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-4cWjYEN",
    "nombre": "Narrow Push-up On Exercise Ball",
    "descripcion": "ExerciseDB narrow push-up on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "stability ball",
    "imagenUrl": "https://static.exercisedb.dev/media/4cWjYEN.gif",
    "exerciseDbId": "4cWjYEN",
    "exerciseDbName": "narrow push-up on exercise ball",
    "exerciseDbAliases": [
      "narrow push-up on exercise ball"
    ],
    "instrucciones": "Place the stability ball on the ground and position yourself in a push-up position with your hands on the ball, slightly narrower than shoulder-width apart.\nEngage your core and keep your body in a straight line from head to toe.\nLower your chest towards the ball by bending your elbows, keeping them close to your body.\nPause for a moment at the bottom, then push yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-zd4P4B2",
    "nombre": "Stalder Press",
    "descripcion": "ExerciseDB stalder press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/zd4P4B2.gif",
    "exerciseDbId": "zd4P4B2",
    "exerciseDbName": "stalder press",
    "exerciseDbAliases": [
      "stalder press"
    ],
    "instrucciones": "Start by standing with your feet shoulder-width apart and your arms extended overhead.\nBend your knees slightly and engage your core.\nLower your body down into a squat position while keeping your arms extended overhead.\nAs you squat down, press your arms down towards the ground, engaging your triceps.\nPause for a moment at the bottom of the squat, then push through your heels to stand back up while simultaneously raising your arms back overhead.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Z5YStHW",
    "nombre": "Overhead Triceps Stretch",
    "descripcion": "ExerciseDB overhead triceps stretch.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/Z5YStHW.gif",
    "exerciseDbId": "Z5YStHW",
    "exerciseDbName": "overhead triceps stretch",
    "exerciseDbAliases": [
      "overhead triceps stretch"
    ],
    "instrucciones": "Stand or sit upright with your feet shoulder-width apart.\nExtend one arm overhead, bending at the elbow so that your hand reaches towards the opposite shoulder blade.\nWith your other hand, gently pull the elbow of the extended arm towards the opposite side of your head, feeling a stretch in your triceps.\nHold the stretch for 15-30 seconds, then release.\nRepeat on the other side.",
    "esPersonalizado": false
  },
  {
    "id": "db-v3vLFW0",
    "nombre": "Close-grip Push-up (on Knees)",
    "descripcion": "ExerciseDB close-grip push-up (on knees).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/v3vLFW0.gif",
    "exerciseDbId": "v3vLFW0",
    "exerciseDbName": "close-grip push-up (on knees)",
    "exerciseDbAliases": [
      "close-grip push-up (on knees)"
    ],
    "instrucciones": "Start by getting on your hands and knees, with your hands shoulder-width apart and your knees hip-width apart.\nLower your upper body towards the ground by bending your elbows, keeping them close to your sides.\nPause for a moment when your chest is just above the ground.\nPush through your palms to straighten your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-3ZflifB",
    "nombre": "Cable Pushdown",
    "descripcion": "ExerciseDB cable pushdown.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/3ZflifB.gif",
    "exerciseDbId": "3ZflifB",
    "exerciseDbName": "cable pushdown",
    "exerciseDbAliases": [
      "cable pushdown"
    ],
    "instrucciones": "Attach a straight bar to a high pulley cable machine.\nStand facing the machine with your feet shoulder-width apart and a slight bend in your knees.\nGrasp the bar with an overhand grip, hands shoulder-width apart.\nKeep your elbows close to your sides and your upper arms stationary.\nExhale and push the bar down until your elbows are fully extended.\nPause for a moment, then inhale and slowly return the bar to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-4Jt8QsQ",
    "nombre": "Push-up On Lower Arms",
    "descripcion": "ExerciseDB push-up on lower arms.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/4Jt8QsQ.gif",
    "exerciseDbId": "4Jt8QsQ",
    "exerciseDbName": "push-up on lower arms",
    "exerciseDbAliases": [
      "push-up on lower arms"
    ],
    "instrucciones": "Start in a plank position with your forearms on the ground and elbows directly below your shoulders.\nEngage your core and keep your body in a straight line from head to toe.\nLower your chest towards the ground by bending your elbows, keeping them close to your body.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-U7D9Fx3",
    "nombre": "Dumbbell Incline Two Arm Extension",
    "descripcion": "ExerciseDB dumbbell incline two arm extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/U7D9Fx3.gif",
    "exerciseDbId": "U7D9Fx3",
    "exerciseDbName": "dumbbell incline two arm extension",
    "exerciseDbAliases": [
      "dumbbell incline two arm extension"
    ],
    "instrucciones": "Sit on an incline bench with a dumbbell in each hand, resting on your thighs.\nSlowly lie back on the bench, keeping the dumbbells close to your chest.\nOnce you are fully lying down, extend your arms straight up towards the ceiling, keeping your elbows slightly bent.\nPause for a moment at the top, then slowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-mpKZGWz",
    "nombre": "Dumbbell Lying Triceps Extension",
    "descripcion": "ExerciseDB dumbbell lying triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/mpKZGWz.gif",
    "exerciseDbId": "mpKZGWz",
    "exerciseDbName": "dumbbell lying triceps extension",
    "exerciseDbAliases": [
      "dumbbell lying triceps extension"
    ],
    "instrucciones": "Lie flat on a bench with a dumbbell in each hand, palms facing each other.\nExtend your arms straight up over your chest, keeping your elbows close to your body.\nLower the dumbbells down towards your forehead, bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-CJwa0vD",
    "nombre": "Dumbbell Standing Bent Over One Arm Triceps Extension",
    "descripcion": "ExerciseDB dumbbell standing bent over one arm triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "back"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/CJwa0vD.gif",
    "exerciseDbId": "CJwa0vD",
    "exerciseDbName": "dumbbell standing bent over one arm triceps extension",
    "exerciseDbAliases": [
      "dumbbell standing bent over one arm triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in one hand.\nBend forward at the waist, keeping your back straight and parallel to the ground.\nExtend your arm straight back, keeping your elbow close to your body.\nSlowly lower the dumbbell back to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-iZop9xO",
    "nombre": "Barbell Lying Triceps Extension",
    "descripcion": "ExerciseDB barbell lying triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/iZop9xO.gif",
    "exerciseDbId": "iZop9xO",
    "exerciseDbName": "barbell lying triceps extension",
    "exerciseDbAliases": [
      "barbell lying triceps extension"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold the barbell with an overhand grip, hands shoulder-width apart, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the barbell towards your forehead by bending your elbows.\nPause for a moment at the bottom, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-D5yqP2p",
    "nombre": "Lever Overhand Triceps Dip",
    "descripcion": "ExerciseDB lever overhand triceps dip.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/D5yqP2p.gif",
    "exerciseDbId": "D5yqP2p",
    "exerciseDbName": "lever overhand triceps dip",
    "exerciseDbAliases": [
      "lever overhand triceps dip"
    ],
    "instrucciones": "Adjust the machine to the appropriate height and secure your body in position.\nGrasp the handles with an overhand grip and position your body so that your arms are fully extended.\nLower your body by bending your elbows, keeping your upper arms close to your sides.\nContinue lowering until your upper arms are parallel to the floor.\nPause for a moment, then push yourself back up to the starting position by extending your elbows.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-EcaV7aL",
    "nombre": "Barbell Lying Close-grip Press",
    "descripcion": "ExerciseDB barbell lying close-grip press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/EcaV7aL.gif",
    "exerciseDbId": "EcaV7aL",
    "exerciseDbName": "barbell lying close-grip press",
    "exerciseDbAliases": [
      "barbell lying close-grip press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the barbell with a close grip, hands shoulder-width apart, palms facing towards your feet.\nLift the barbell off the rack and hold it directly above your chest with your arms fully extended.\nSlowly lower the barbell towards your chest, keeping your elbows close to your body.\nPause for a moment when the barbell touches your chest, then push it back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-W6PxUkg",
    "nombre": "Dumbbell Kickback",
    "descripcion": "ExerciseDB dumbbell kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/W6PxUkg.gif",
    "exerciseDbId": "W6PxUkg",
    "exerciseDbName": "dumbbell kickback",
    "exerciseDbAliases": [
      "dumbbell kickback"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in each hand.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nBring your upper arms close to your sides, with your elbows bent at a 90-degree angle.\nExtend your arms straight back, squeezing your triceps at the top of the movement.\nPause for a moment, then slowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wpbD28t",
    "nombre": "Side Push-up",
    "descripcion": "ExerciseDB side push-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "chest",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/wpbD28t.gif",
    "exerciseDbId": "wpbD28t",
    "exerciseDbName": "side push-up",
    "exerciseDbAliases": [
      "side push-up"
    ],
    "instrucciones": "Start by lying on your side with your legs extended and stacked on top of each other.\nPlace your bottom hand on the ground directly under your shoulder, fingers pointing forward.\nPress through your bottom hand to lift your body off the ground, keeping your legs straight and your core engaged.\nExtend your top arm straight up towards the ceiling, creating a straight line from your head to your heels.\nLower your body back down to the starting position with control.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-OTgkHwR",
    "nombre": "Dumbbell Decline Triceps Extension",
    "descripcion": "ExerciseDB dumbbell decline triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/OTgkHwR.gif",
    "exerciseDbId": "OTgkHwR",
    "exerciseDbName": "dumbbell decline triceps extension",
    "exerciseDbAliases": [
      "dumbbell decline triceps extension"
    ],
    "instrucciones": "Lie on a decline bench with your head lower than your feet and hold a dumbbell in each hand, palms facing each other.\nExtend your arms fully, keeping your elbows close to your head.\nLower the dumbbells slowly behind your head, bending your elbows.\nPause for a moment, then raise the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-1xHyxys",
    "nombre": "Cable High Pulley Overhead Tricep Extension",
    "descripcion": "ExerciseDB cable high pulley overhead tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/1xHyxys.gif",
    "exerciseDbId": "1xHyxys",
    "exerciseDbName": "cable high pulley overhead tricep extension",
    "exerciseDbAliases": [
      "cable high pulley overhead tricep extension"
    ],
    "instrucciones": "Attach a rope to a high pulley and stand facing away from the machine.\nGrasp the rope with both hands and extend your arms overhead.\nKeep your elbows close to your head and your upper arms stationary.\nSlowly lower the rope behind your head by bending your elbows.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-OVIKwsd",
    "nombre": "Dumbbell Incline Triceps Extension",
    "descripcion": "ExerciseDB dumbbell incline triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/OVIKwsd.gif",
    "exerciseDbId": "OVIKwsd",
    "exerciseDbName": "dumbbell incline triceps extension",
    "exerciseDbAliases": [
      "dumbbell incline triceps extension"
    ],
    "instrucciones": "Sit on an incline bench with a dumbbell in each hand, palms facing inwards.\nExtend your arms fully overhead, keeping your elbows close to your head.\nLower the dumbbells behind your head by bending your elbows, keeping your upper arms stationary.\nPause for a moment, then raise the dumbbells back to the starting position by extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Hx1WC8I",
    "nombre": "Cable Incline Triceps Extension",
    "descripcion": "ExerciseDB cable incline triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/Hx1WC8I.gif",
    "exerciseDbId": "Hx1WC8I",
    "exerciseDbName": "cable incline triceps extension",
    "exerciseDbAliases": [
      "cable incline triceps extension"
    ],
    "instrucciones": "Adjust the cable machine to a low pulley position.\nAttach a straight bar to the cable.\nStand facing away from the machine with your feet shoulder-width apart.\nGrasp the bar with an overhand grip and extend your arms straight overhead.\nLean forward slightly, keeping your back straight and core engaged.\nBend your elbows and lower the bar behind your head, keeping your upper arms close to your ears.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-4ievMJ9",
    "nombre": "Dumbbell Seated Bent Over Triceps Extension",
    "descripcion": "ExerciseDB dumbbell seated bent over triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "back"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/4ievMJ9.gif",
    "exerciseDbId": "4ievMJ9",
    "exerciseDbName": "dumbbell seated bent over triceps extension",
    "exerciseDbAliases": [
      "dumbbell seated bent over triceps extension"
    ],
    "instrucciones": "Sit on a bench with your feet flat on the ground and hold a dumbbell in each hand.\nBend forward at the waist, keeping your back straight and your head up.\nExtend your arms straight back, keeping your elbows close to your head.\nPause for a moment, then slowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-yg8Totb",
    "nombre": "Barbell Lying Back Of The Head Tricep Extension",
    "descripcion": "ExerciseDB barbell lying back of the head tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/yg8Totb.gif",
    "exerciseDbId": "yg8Totb",
    "exerciseDbName": "barbell lying back of the head tricep extension",
    "exerciseDbAliases": [
      "barbell lying back of the head tricep extension"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold a barbell with an overhand grip, hands shoulder-width apart, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the barbell behind your head by bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-eOCOwIR",
    "nombre": "Dumbbell Lying Elbow Press",
    "descripcion": "ExerciseDB dumbbell lying elbow press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/eOCOwIR.gif",
    "exerciseDbId": "eOCOwIR",
    "exerciseDbName": "dumbbell lying elbow press",
    "exerciseDbAliases": [
      "dumbbell lying elbow press"
    ],
    "instrucciones": "Lie flat on a bench with a dumbbell in each hand, palms facing each other and arms extended straight up over your chest.\nLower the dumbbells towards your shoulders by bending your elbows, keeping your upper arms stationary.\nPause for a moment at the bottom, then press the dumbbells back up to the starting position by extending your elbows.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-gtO1ErP",
    "nombre": "Weighted Three Bench Dips",
    "descripcion": "ExerciseDB weighted three bench dips.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "weighted",
    "imagenUrl": "https://static.exercisedb.dev/media/gtO1ErP.gif",
    "exerciseDbId": "gtO1ErP",
    "exerciseDbName": "weighted three bench dips",
    "exerciseDbAliases": [
      "weighted three bench dips"
    ],
    "instrucciones": "Sit on the edge of a bench with your hands gripping the edge, fingers pointing forward.\nWalk your feet forward, sliding your butt off the bench and supporting your weight with your arms.\nLower your body by bending your elbows, keeping your back close to the bench.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-pP8wP2P",
    "nombre": "Dumbbell Neutral Grip Bench Press",
    "descripcion": "ExerciseDB dumbbell neutral grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/pP8wP2P.gif",
    "exerciseDbId": "pP8wP2P",
    "exerciseDbName": "dumbbell neutral grip bench press",
    "exerciseDbAliases": [
      "dumbbell neutral grip bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nHold a dumbbell in each hand with a neutral grip (palms facing each other) and your arms extended straight up over your chest.\nSlowly lower the dumbbells down towards your chest, keeping your elbows close to your body.\nPause for a moment at the bottom, then push the dumbbells back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-HJ63mSO",
    "nombre": "Barbell Lying Close-grip Triceps Extension",
    "descripcion": "ExerciseDB barbell lying close-grip triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/HJ63mSO.gif",
    "exerciseDbId": "HJ63mSO",
    "exerciseDbName": "barbell lying close-grip triceps extension",
    "exerciseDbAliases": [
      "barbell lying close-grip triceps extension"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nGrasp the barbell with a close grip, hands shoulder-width apart, palms facing up.\nExtend your arms fully, lifting the barbell above your chest.\nKeeping your upper arms stationary, slowly lower the barbell towards your forehead by bending your elbows.\nPause for a moment at the bottom, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-CQHoDm0",
    "nombre": "Ez Barbell Decline Triceps Extension",
    "descripcion": "ExerciseDB ez barbell decline triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/CQHoDm0.gif",
    "exerciseDbId": "CQHoDm0",
    "exerciseDbName": "ez barbell decline triceps extension",
    "exerciseDbAliases": [
      "ez barbell decline triceps extension"
    ],
    "instrucciones": "Lie on a decline bench with your head lower than your feet and your feet secured.\nHold the ez barbell with an overhand grip, hands shoulder-width apart.\nExtend your arms fully, keeping your elbows close to your head.\nLower the barbell slowly towards your forehead, bending your elbows.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-VQ3sNCn",
    "nombre": "Dumbbell Seated One Arm Kickback",
    "descripcion": "ExerciseDB dumbbell seated one arm kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/VQ3sNCn.gif",
    "exerciseDbId": "VQ3sNCn",
    "exerciseDbName": "dumbbell seated one arm kickback",
    "exerciseDbAliases": [
      "dumbbell seated one arm kickback"
    ],
    "instrucciones": "Sit on a bench with your feet flat on the ground and hold a dumbbell in one hand.\nBend your torso forward at the waist, keeping your back straight and parallel to the ground.\nExtend your arm straight back, keeping your elbow close to your body.\nPause for a moment at the top, then slowly lower the dumbbell back to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-6CKUx7o",
    "nombre": "Ez Bar Lying Close Grip Triceps Extension Behind Head",
    "descripcion": "ExerciseDB ez bar lying close grip triceps extension behind head.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/6CKUx7o.gif",
    "exerciseDbId": "6CKUx7o",
    "exerciseDbName": "ez bar lying close grip triceps extension behind head",
    "exerciseDbAliases": [
      "ez bar lying close grip triceps extension behind head"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold the ez barbell with a close grip, palms facing up, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the barbell behind your head by bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ufaxB52",
    "nombre": "Band Close-grip Push-up",
    "descripcion": "ExerciseDB band close-grip push-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "band",
    "imagenUrl": "https://static.exercisedb.dev/media/ufaxB52.gif",
    "exerciseDbId": "ufaxB52",
    "exerciseDbName": "band close-grip push-up",
    "exerciseDbAliases": [
      "band close-grip push-up"
    ],
    "instrucciones": "Place a band around your upper arms, just above the elbows.\nAssume a push-up position with your hands directly under your shoulders and your body in a straight line from head to heels.\nBend your elbows and lower your chest towards the ground, keeping your elbows close to your sides.\nPush through your palms to extend your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-bpJL2Qs",
    "nombre": "Dumbbell Pronate-grip Triceps Extension",
    "descripcion": "ExerciseDB dumbbell pronate-grip triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/bpJL2Qs.gif",
    "exerciseDbId": "bpJL2Qs",
    "exerciseDbName": "dumbbell pronate-grip triceps extension",
    "exerciseDbAliases": [
      "dumbbell pronate-grip triceps extension"
    ],
    "instrucciones": "Sit on a bench or chair with your back straight and feet flat on the ground.\nHold a dumbbell with both hands, palms facing down, and extend your arms straight up overhead.\nKeeping your upper arms close to your head and elbows pointing forward, slowly lower the dumbbell behind your head by bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-K1vlode",
    "nombre": "Weighted Triceps Dip On High Parallel Bars",
    "descripcion": "ExerciseDB weighted triceps dip on high parallel bars.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "weighted",
    "imagenUrl": "https://static.exercisedb.dev/media/K1vlode.gif",
    "exerciseDbId": "K1vlode",
    "exerciseDbName": "weighted triceps dip on high parallel bars",
    "exerciseDbAliases": [
      "weighted triceps dip on high parallel bars"
    ],
    "instrucciones": "Position yourself between two parallel bars with your hands gripping the bars and your arms fully extended.\nBend your elbows and lower your body until your upper arms are parallel to the ground.\nPause for a moment, then push through your palms to straighten your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-DQ0cqkT",
    "nombre": "Three Bench Dip",
    "descripcion": "ExerciseDB three bench dip.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/DQ0cqkT.gif",
    "exerciseDbId": "DQ0cqkT",
    "exerciseDbName": "three bench dip",
    "exerciseDbAliases": [
      "three bench dip"
    ],
    "instrucciones": "Sit on a bench with your hands gripping the edge, fingers pointing forward.\nSlide your butt off the bench, supporting your weight with your hands.\nBend your elbows and lower your body until your upper arms are parallel to the ground.\nPush yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ezTvXcr",
    "nombre": "Ring Dips",
    "descripcion": "ExerciseDB ring dips.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/ezTvXcr.gif",
    "exerciseDbId": "ezTvXcr",
    "exerciseDbName": "ring dips",
    "exerciseDbAliases": [
      "ring dips"
    ],
    "instrucciones": "Start by hanging from the rings with your arms fully extended and your body straight.\nLower your body by bending your elbows until your shoulders are below your elbows.\nPush yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-s5PdDyY",
    "nombre": "Dumbbell Tate Press",
    "descripcion": "ExerciseDB dumbbell tate press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/s5PdDyY.gif",
    "exerciseDbId": "s5PdDyY",
    "exerciseDbName": "dumbbell tate press",
    "exerciseDbAliases": [
      "dumbbell tate press"
    ],
    "instrucciones": "Sit on a flat bench with a dumbbell in each hand, palms facing each other.\nRaise the dumbbells to shoulder height, then rotate your wrists so that your palms are facing away from you.\nPress the dumbbells up until your arms are fully extended, then lower them back down to shoulder height.\nRotate your wrists back to the starting position and repeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-RrLske5",
    "nombre": "Bench Dip (knees Bent)",
    "descripcion": "ExerciseDB bench dip (knees bent).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/RrLske5.gif",
    "exerciseDbId": "RrLske5",
    "exerciseDbName": "bench dip (knees bent)",
    "exerciseDbAliases": [
      "bench dip (knees bent)"
    ],
    "instrucciones": "Sit on the edge of a bench or chair with your hands gripping the edge next to your hips.\nSlide your butt off the bench and straighten your legs in front of you, keeping your heels on the ground.\nBend your elbows and lower your body towards the ground, keeping your back close to the bench.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-dZl9Q27",
    "nombre": "Barbell Standing Overhead Triceps Extension",
    "descripcion": "ExerciseDB barbell standing overhead triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/dZl9Q27.gif",
    "exerciseDbId": "dZl9Q27",
    "exerciseDbName": "barbell standing overhead triceps extension",
    "exerciseDbAliases": [
      "barbell standing overhead triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a barbell with an overhand grip.\nRaise the barbell overhead, fully extending your arms.\nKeeping your upper arms close to your head, slowly lower the barbell behind your head by bending your elbows.\nPause for a moment, then raise the barbell back to the starting position by extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZujAdR9",
    "nombre": "Cable Rope Incline Tricep Extension",
    "descripcion": "ExerciseDB cable rope incline tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/ZujAdR9.gif",
    "exerciseDbId": "ZujAdR9",
    "exerciseDbName": "cable rope incline tricep extension",
    "exerciseDbAliases": [
      "cable rope incline tricep extension"
    ],
    "instrucciones": "Attach a rope to a high pulley and adjust the incline bench to a comfortable angle.\nStand facing away from the pulley with your feet shoulder-width apart.\nGrasp the rope with an overhand grip and extend your arms straight overhead.\nKeep your elbows close to your head and your upper arms stationary throughout the exercise.\nLower the rope behind your head by bending your elbows until your forearms touch your biceps.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-o8aOcrz",
    "nombre": "Smith Machine Incline Tricep Extension",
    "descripcion": "ExerciseDB smith machine incline tricep extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/o8aOcrz.gif",
    "exerciseDbId": "o8aOcrz",
    "exerciseDbName": "smith machine incline tricep extension",
    "exerciseDbAliases": [
      "smith machine incline tricep extension"
    ],
    "instrucciones": "Adjust the seat of the smith machine so that the bar is at shoulder height.\nSit on the bench with your back against the pad and your feet flat on the ground.\nGrasp the bar with an overhand grip, slightly wider than shoulder-width apart.\nExtend your arms fully, lifting the bar off the rack and holding it directly above your chest.\nLower the bar slowly towards your forehead, keeping your elbows close to your head.\nPause for a moment at the bottom, then push the bar back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wu5LXwz",
    "nombre": "Olympic Barbell Triceps Extension",
    "descripcion": "ExerciseDB olympic barbell triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "olympic barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/wu5LXwz.gif",
    "exerciseDbId": "wu5LXwz",
    "exerciseDbName": "olympic barbell triceps extension",
    "exerciseDbAliases": [
      "olympic barbell triceps extension"
    ],
    "instrucciones": "Start by standing with your feet shoulder-width apart and holding the barbell with an overhand grip.\nRaise the barbell above your head, fully extending your arms.\nKeeping your upper arms close to your head, slowly lower the barbell behind your head by bending your elbows.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-VYmYxK5",
    "nombre": "Dumbbell One Arm Hammer Press On Exercise Ball",
    "descripcion": "ExerciseDB dumbbell one arm hammer press on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "chest"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/VYmYxK5.gif",
    "exerciseDbId": "VYmYxK5",
    "exerciseDbName": "dumbbell one arm hammer press on exercise ball",
    "exerciseDbAliases": [
      "dumbbell one arm hammer press on exercise ball"
    ],
    "instrucciones": "Sit on an exercise ball with your feet flat on the ground and your back straight.\nHold a dumbbell in one hand with your palm facing inwards and your elbow bent at a 90-degree angle.\nPlace your other hand on your hip for stability.\nPress the dumbbell upwards, extending your arm fully.\nPause for a moment at the top, then slowly lower the dumbbell back to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-kont8Ut",
    "nombre": "Dumbbell Seated Triceps Extension",
    "descripcion": "ExerciseDB dumbbell seated triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/kont8Ut.gif",
    "exerciseDbId": "kont8Ut",
    "exerciseDbName": "dumbbell seated triceps extension",
    "exerciseDbAliases": [
      "dumbbell seated triceps extension"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold a dumbbell with both hands and extend your arms straight up overhead.\nBend your elbows and lower the dumbbell behind your head, keeping your upper arms close to your ears.\nPause for a moment, then straighten your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-PdmaD0N",
    "nombre": "Dumbbell Standing Triceps Extension",
    "descripcion": "ExerciseDB dumbbell standing triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/PdmaD0N.gif",
    "exerciseDbId": "PdmaD0N",
    "exerciseDbName": "dumbbell standing triceps extension",
    "exerciseDbAliases": [
      "dumbbell standing triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in one hand.\nRaise the dumbbell overhead, keeping your arm straight.\nBend your elbow and lower the dumbbell behind your head, keeping your upper arm stationary.\nExtend your arm back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-NfP83rA",
    "nombre": "Dumbbell Lying Alternate Extension",
    "descripcion": "ExerciseDB dumbbell lying alternate extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/NfP83rA.gif",
    "exerciseDbId": "NfP83rA",
    "exerciseDbName": "dumbbell lying alternate extension",
    "exerciseDbAliases": [
      "dumbbell lying alternate extension"
    ],
    "instrucciones": "Lie flat on a bench with a dumbbell in each hand, palms facing each other.\nExtend your arms straight up over your chest, keeping a slight bend in your elbows.\nLower one dumbbell down towards your head, bending at the elbow, while keeping the other arm extended.\nPause for a moment at the bottom, then raise the dumbbell back up to the starting position.\nRepeat with the other arm, alternating sides for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-VuoerH0",
    "nombre": "Triceps Dip (bench Leg)",
    "descripcion": "ExerciseDB triceps dip (bench leg).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/VuoerH0.gif",
    "exerciseDbId": "VuoerH0",
    "exerciseDbName": "triceps dip (bench leg)",
    "exerciseDbAliases": [
      "triceps dip (bench leg)"
    ],
    "instrucciones": "Sit on the edge of a bench with your hands gripping the edge, fingers pointing forward.\nWalk your feet forward, sliding your butt off the bench, and straighten your arms.\nBend your elbows and lower your body towards the ground, keeping your back close to the bench.\nPush through your palms to straighten your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Al3tP0D",
    "nombre": "Medicine Ball Supine Chest Throw",
    "descripcion": "ExerciseDB medicine ball supine chest throw.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "medicine ball",
    "imagenUrl": "https://static.exercisedb.dev/media/Al3tP0D.gif",
    "exerciseDbId": "Al3tP0D",
    "exerciseDbName": "medicine ball supine chest throw",
    "exerciseDbAliases": [
      "medicine ball supine chest throw"
    ],
    "instrucciones": "Lie flat on your back on a bench with your knees bent and feet flat on the ground.\nHold the medicine ball with both hands, extending your arms straight up above your chest.\nLower the medicine ball towards your chest, keeping your elbows close to your body.\nExplosively push the medicine ball upwards, extending your arms fully and throwing the ball as high as possible.\nCatch the medicine ball and repeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-OxJk1fg",
    "nombre": "Cable Triceps Pushdown (v-bar) (with Arm Blaster)",
    "descripcion": "ExerciseDB cable triceps pushdown (v-bar) (with arm blaster).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/OxJk1fg.gif",
    "exerciseDbId": "OxJk1fg",
    "exerciseDbName": "cable triceps pushdown (v-bar) (with arm blaster)",
    "exerciseDbAliases": [
      "cable triceps pushdown (v-bar) (with arm blaster)"
    ],
    "instrucciones": "Attach a v-bar attachment to the cable machine at the highest setting.\nStand facing the cable machine with your feet shoulder-width apart.\nGrasp the v-bar with an overhand grip, palms facing down, and your hands shoulder-width apart.\nKeep your elbows close to your sides and your upper arms stationary throughout the exercise.\nEngage your triceps and exhale as you push the v-bar down until your arms are fully extended.\nPause for a moment at the bottom of the movement, squeezing your triceps.\nInhale as you slowly return the v-bar to the starting position, maintaining control.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-J6Dx1Mu",
    "nombre": "Barbell Close-grip Bench Press",
    "descripcion": "ExerciseDB barbell close-grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/J6Dx1Mu.gif",
    "exerciseDbId": "J6Dx1Mu",
    "exerciseDbName": "barbell close-grip bench press",
    "exerciseDbAliases": [
      "barbell close-grip bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the barbell with a close grip, slightly narrower than shoulder-width apart.\nUnrack the barbell and lower it slowly towards your chest, keeping your elbows close to your body.\nPause for a moment when the barbell touches your chest.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-7HcfMBP",
    "nombre": "Assisted Standing Triceps Extension (with Towel)",
    "descripcion": "ExerciseDB assisted standing triceps extension (with towel).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "assisted",
    "imagenUrl": "https://static.exercisedb.dev/media/7HcfMBP.gif",
    "exerciseDbId": "7HcfMBP",
    "exerciseDbName": "assisted standing triceps extension (with towel)",
    "exerciseDbAliases": [
      "assisted standing triceps extension (with towel)"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a towel with both hands behind your head.\nKeep your elbows close to your ears and your upper arms stationary.\nSlowly extend your forearms upward, squeezing your triceps at the top.\nPause for a moment, then slowly lower the towel back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-kprile3",
    "nombre": "Exercise Ball Dip",
    "descripcion": "ExerciseDB exercise ball dip.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "stability ball",
    "imagenUrl": "https://static.exercisedb.dev/media/kprile3.gif",
    "exerciseDbId": "kprile3",
    "exerciseDbName": "exercise ball dip",
    "exerciseDbAliases": [
      "exercise ball dip"
    ],
    "instrucciones": "Sit on the stability ball with your feet flat on the ground and your knees bent at a 90-degree angle.\nPlace your hands on the ball beside your hips, fingers pointing forward.\nEngage your triceps and push through your hands to lift your body off the ball, straightening your arms.\nLower your body back down by bending your elbows, keeping them close to your sides.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-4CBIBOM",
    "nombre": "Barbell Seated Close Grip Behind Neck Triceps Extension",
    "descripcion": "ExerciseDB barbell seated close grip behind neck triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/4CBIBOM.gif",
    "exerciseDbId": "4CBIBOM",
    "exerciseDbName": "barbell seated close grip behind neck triceps extension",
    "exerciseDbAliases": [
      "barbell seated close grip behind neck triceps extension"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold the barbell with a close grip behind your neck, palms facing forward.\nKeep your elbows close to your head and slowly lower the barbell towards the back of your head.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-7aVz15j",
    "nombre": "Triceps Dips Floor",
    "descripcion": "ExerciseDB triceps dips floor.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/7aVz15j.gif",
    "exerciseDbId": "7aVz15j",
    "exerciseDbName": "triceps dips floor",
    "exerciseDbAliases": [
      "triceps dips floor"
    ],
    "instrucciones": "Sit on the edge of a chair or bench with your hands next to your hips, fingers pointing forward.\nSlide your butt off the front of the chair with your legs extended in front of you.\nStraighten your arms, keeping a little bend in your elbows to keep tension on your triceps and off your elbow joints.\nSlowly bend your elbows to lower your body toward the floor until your elbows are at about a 90-degree angle.\nOnce you reach the bottom of the movement, press down into the chair to straighten your elbows, returning to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-8K7m2SS",
    "nombre": "Medicine Ball Close Grip Push Up",
    "descripcion": "ExerciseDB medicine ball close grip push up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "medicine ball",
    "imagenUrl": "https://static.exercisedb.dev/media/8K7m2SS.gif",
    "exerciseDbId": "8K7m2SS",
    "exerciseDbName": "medicine ball close grip push up",
    "exerciseDbAliases": [
      "medicine ball close grip push up"
    ],
    "instrucciones": "Start in a high plank position with your hands on the medicine ball, shoulder-width apart.\nLower your body towards the ground by bending your elbows, keeping them close to your sides.\nPush back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-KyLtiLT",
    "nombre": "Ez Barbell Incline Triceps Extension",
    "descripcion": "ExerciseDB ez barbell incline triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/KyLtiLT.gif",
    "exerciseDbId": "KyLtiLT",
    "exerciseDbName": "ez barbell incline triceps extension",
    "exerciseDbAliases": [
      "ez barbell incline triceps extension"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nSit on the bench with your back against the pad and hold the ez barbell with an overhand grip.\nExtend your arms fully overhead, keeping your elbows close to your head.\nLower the barbell behind your head by bending your elbows, keeping your upper arms stationary.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-sYCcnon",
    "nombre": "Cable Standing One Arm Triceps Extension",
    "descripcion": "ExerciseDB cable standing one arm triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/sYCcnon.gif",
    "exerciseDbId": "sYCcnon",
    "exerciseDbName": "cable standing one arm triceps extension",
    "exerciseDbAliases": [
      "cable standing one arm triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, facing the cable machine.\nHold the cable handle with your right hand, palm facing down, and position your arm so that it is fully extended and parallel to the ground.\nKeep your elbow stationary and close to your body.\nSlowly bend your elbow, lowering the cable handle towards the back of your head.\nPause for a moment at the bottom of the movement, then extend your arm back to the starting position.\nRepeat for the desired number of repetitions, then switch sides and perform the exercise with your left arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-hnOYgH3",
    "nombre": "Ez Barbell Jm Bench Press",
    "descripcion": "ExerciseDB ez barbell jm bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/hnOYgH3.gif",
    "exerciseDbId": "hnOYgH3",
    "exerciseDbName": "ez barbell jm bench press",
    "exerciseDbAliases": [
      "ez barbell jm bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the ez barbell with an overhand grip, slightly wider than shoulder-width apart.\nLower the barbell to your chest, keeping your elbows tucked in close to your body.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-EMpUwRI",
    "nombre": "Barbell Lying Extension",
    "descripcion": "ExerciseDB barbell lying extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/EMpUwRI.gif",
    "exerciseDbId": "EMpUwRI",
    "exerciseDbName": "barbell lying extension",
    "exerciseDbAliases": [
      "barbell lying extension"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold the barbell with an overhand grip, hands shoulder-width apart, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the barbell towards your forehead by bending your elbows.\nPause for a moment, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-dU605di",
    "nombre": "Cable Pushdown (with Rope Attachment)",
    "descripcion": "ExerciseDB cable pushdown (with rope attachment).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/dU605di.gif",
    "exerciseDbId": "dU605di",
    "exerciseDbName": "cable pushdown (with rope attachment)",
    "exerciseDbAliases": [
      "cable pushdown (with rope attachment)"
    ],
    "instrucciones": "Attach a rope attachment to a high pulley on a cable machine.\nStand facing the machine with your feet shoulder-width apart and a slight bend in your knees.\nGrasp the rope with an overhand grip, palms facing each other.\nKeep your elbows close to your sides and your upper arms stationary throughout the exercise.\nExhale and push the rope downward by extending your elbows until your arms are fully extended.\nPause for a moment, then inhale and slowly return to the starting position by allowing your elbows to flex.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-vvNjDJS",
    "nombre": "Cable Two Arm Tricep Kickback",
    "descripcion": "ExerciseDB cable two arm tricep kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/vvNjDJS.gif",
    "exerciseDbId": "vvNjDJS",
    "exerciseDbName": "cable two arm tricep kickback",
    "exerciseDbAliases": [
      "cable two arm tricep kickback"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and knees slightly bent.\nHold the cable handle in each hand with your palms facing inwards and your arms bent at a 90-degree angle.\nKeeping your upper arms stationary, extend your forearms backwards until your arms are fully extended.\nPause for a moment, then slowly return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-U6G2gk9",
    "nombre": "Body-up",
    "descripcion": "ExerciseDB body-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/U6G2gk9.gif",
    "exerciseDbId": "U6G2gk9",
    "exerciseDbName": "body-up",
    "exerciseDbAliases": [
      "body-up"
    ],
    "instrucciones": "Start by placing your hands on a raised surface, such as a bench or parallel bars, with your palms facing down and fingers pointing forward.\nExtend your legs out in front of you, keeping your heels on the ground and your body straight.\nLower your body by bending your elbows, keeping them close to your sides, until your upper arms are parallel to the ground.\nPause for a moment, then push through your palms to straighten your arms and lift your body back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Db7eEgw",
    "nombre": "Cable Concentration Extension (on Knee)",
    "descripcion": "ExerciseDB cable concentration extension (on knee).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/Db7eEgw.gif",
    "exerciseDbId": "Db7eEgw",
    "exerciseDbName": "cable concentration extension (on knee)",
    "exerciseDbAliases": [
      "cable concentration extension (on knee)"
    ],
    "instrucciones": "Sit on a bench or chair with your knees bent and feet flat on the ground.\nHold the cable handle with your right hand and place your elbow on the inside of your right knee.\nExtend your arm fully, keeping your elbow stationary and close to your knee.\nPause for a moment at the top, then slowly lower your arm back to the starting position.\nRepeat for the desired number of repetitions, then switch sides.",
    "esPersonalizado": false
  },
  {
    "id": "db-yRLPCLu",
    "nombre": "Barbell Reverse Grip Skullcrusher",
    "descripcion": "ExerciseDB barbell reverse grip skullcrusher.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/yRLPCLu.gif",
    "exerciseDbId": "yRLPCLu",
    "exerciseDbName": "barbell reverse grip skullcrusher",
    "exerciseDbAliases": [
      "barbell reverse grip skullcrusher"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold the barbell with a reverse grip, palms facing towards your face, and your hands shoulder-width apart.\nExtend your arms straight up over your chest, keeping your elbows in and your wrists straight.\nSlowly lower the barbell towards your forehead by bending your elbows, keeping your upper arms stationary.\nPause for a moment at the bottom, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-7ePTw4B",
    "nombre": "Exercise Ball Seated Triceps Stretch",
    "descripcion": "ExerciseDB exercise ball seated triceps stretch.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "stability ball",
    "imagenUrl": "https://static.exercisedb.dev/media/7ePTw4B.gif",
    "exerciseDbId": "7ePTw4B",
    "exerciseDbName": "exercise ball seated triceps stretch",
    "exerciseDbAliases": [
      "exercise ball seated triceps stretch"
    ],
    "instrucciones": "Sit on a stability ball with your feet flat on the ground and your back straight.\nHold a dumbbell in one hand and extend your arm straight up above your head.\nBend your elbow and lower the dumbbell behind your head, keeping your upper arm close to your ear.\nHold the stretch for a few seconds, then return to the starting position.\nRepeat with the other arm.",
    "esPersonalizado": false
  },
  {
    "id": "db-XalXcvM",
    "nombre": "Dumbbell Forward Lunge Triceps Extension",
    "descripcion": "ExerciseDB dumbbell forward lunge triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "core"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/XalXcvM.gif",
    "exerciseDbId": "XalXcvM",
    "exerciseDbName": "dumbbell forward lunge triceps extension",
    "exerciseDbAliases": [
      "dumbbell forward lunge triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a dumbbell in each hand.\nTake a step forward with your right foot, lowering your body into a lunge position.\nKeep your back straight and your chest up.\nExtend your arms straight overhead, keeping your elbows close to your ears.\nLower the dumbbells behind your head by bending your elbows.\nPause for a moment, then straighten your arms to return to the starting position.\nRepeat the movement for the desired number of repetitions, then switch legs and repeat.",
    "esPersonalizado": false
  },
  {
    "id": "db-3T12T87",
    "nombre": "Dumbbell Standing Bent Over Two Arm Triceps Extension",
    "descripcion": "ExerciseDB dumbbell standing bent over two arm triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "back"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/3T12T87.gif",
    "exerciseDbId": "3T12T87",
    "exerciseDbName": "dumbbell standing bent over two arm triceps extension",
    "exerciseDbAliases": [
      "dumbbell standing bent over two arm triceps extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in each hand.\nBend forward at the waist, keeping your back straight and your knees slightly bent.\nExtend your arms straight back, keeping your elbows close to your body.\nSlowly lower the dumbbells back down to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-wyaqzOS",
    "nombre": "Dumbbell Lying One Arm Pronated Triceps Extension",
    "descripcion": "ExerciseDB dumbbell lying one arm pronated triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/wyaqzOS.gif",
    "exerciseDbId": "wyaqzOS",
    "exerciseDbName": "dumbbell lying one arm pronated triceps extension",
    "exerciseDbAliases": [
      "dumbbell lying one arm pronated triceps extension"
    ],
    "instrucciones": "Lie flat on a bench with your back and head supported, and your feet flat on the ground.\nHold a dumbbell in one hand with your palm facing down, and extend your arm straight up above your shoulder.\nKeeping your upper arm stationary, slowly lower the dumbbell behind your head by bending your elbow.\nPause for a moment at the bottom, then extend your arm back up to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-KZXAtKQ",
    "nombre": "Push-up Close-grip Off Dumbbell",
    "descripcion": "ExerciseDB push-up close-grip off dumbbell.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/KZXAtKQ.gif",
    "exerciseDbId": "KZXAtKQ",
    "exerciseDbName": "push-up close-grip off dumbbell",
    "exerciseDbAliases": [
      "push-up close-grip off dumbbell"
    ],
    "instrucciones": "Start in a push-up position with your hands placed close together, directly under your shoulders.\nHold a dumbbell in each hand, resting them on the ground.\nLower your body towards the ground by bending your elbows, keeping them close to your sides.\nPush through your palms to extend your arms and return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-BCUR88E",
    "nombre": "Dumbbell Standing One Arm Extension",
    "descripcion": "ExerciseDB dumbbell standing one arm extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/BCUR88E.gif",
    "exerciseDbId": "BCUR88E",
    "exerciseDbName": "dumbbell standing one arm extension",
    "exerciseDbAliases": [
      "dumbbell standing one arm extension"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a dumbbell in one hand.\nRaise the dumbbell overhead, fully extending your arm.\nKeep your upper arm close to your head and perpendicular to the ground.\nSlowly lower the dumbbell behind your head, bending your elbow.\nPause for a moment, then raise the dumbbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-UmpPAAe",
    "nombre": "Dumbbell Standing Kickback",
    "descripcion": "ExerciseDB dumbbell standing kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/UmpPAAe.gif",
    "exerciseDbId": "UmpPAAe",
    "exerciseDbName": "dumbbell standing kickback",
    "exerciseDbAliases": [
      "dumbbell standing kickback"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold a dumbbell in each hand.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nExtend your arms straight back, squeezing your triceps at the top of the movement.\nPause for a moment, then slowly lower the dumbbells back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ZsiqXYa",
    "nombre": "Barbell Jm Bench Press",
    "descripcion": "ExerciseDB barbell jm bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/ZsiqXYa.gif",
    "exerciseDbId": "ZsiqXYa",
    "exerciseDbName": "barbell jm bench press",
    "exerciseDbAliases": [
      "barbell jm bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the barbell with an overhand grip, slightly wider than shoulder-width apart.\nLower the barbell to your chest, keeping your elbows tucked in close to your body.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-Gi2BXfK",
    "nombre": "Dumbbell Standing Alternating Tricep Kickback",
    "descripcion": "ExerciseDB dumbbell standing alternating tricep kickback.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/Gi2BXfK.gif",
    "exerciseDbId": "Gi2BXfK",
    "exerciseDbName": "dumbbell standing alternating tricep kickback",
    "exerciseDbAliases": [
      "dumbbell standing alternating tricep kickback"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart, holding a dumbbell in each hand.\nBend your knees slightly and hinge forward at the hips, keeping your back straight.\nExtend your arms straight back, keeping your elbows close to your body.\nPause for a moment at the top, then slowly lower the dumbbells back to the starting position.\nRepeat with the other arm, alternating sides with each repetition.",
    "esPersonalizado": false
  },
  {
    "id": "db-Ser9eQp",
    "nombre": "Lever Triceps Extension",
    "descripcion": "ExerciseDB lever triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "leverage machine",
    "imagenUrl": "https://static.exercisedb.dev/media/Ser9eQp.gif",
    "exerciseDbId": "Ser9eQp",
    "exerciseDbName": "lever triceps extension",
    "exerciseDbAliases": [
      "lever triceps extension"
    ],
    "instrucciones": "Adjust the seat height and position yourself on the machine with your back against the pad.\nGrasp the handles with an overhand grip and fully extend your arms in front of you.\nKeeping your upper arms stationary, slowly lower the handles towards your forehead by bending your elbows.\nPause for a moment at the bottom, then push the handles back up to the starting position by extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-MU9HnE7",
    "nombre": "Weighted Bench Dip",
    "descripcion": "ExerciseDB weighted bench dip.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "weighted",
    "imagenUrl": "https://static.exercisedb.dev/media/MU9HnE7.gif",
    "exerciseDbId": "MU9HnE7",
    "exerciseDbName": "weighted bench dip",
    "exerciseDbAliases": [
      "weighted bench dip"
    ],
    "instrucciones": "Sit on a bench with your hands gripping the edge, fingers pointing forward.\nSlide your butt off the bench, supporting your weight with your hands.\nLower your body by bending your elbows until your upper arms are parallel to the floor.\nPush yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ziFKQXP",
    "nombre": "Dumbbell One Arm French Press On Exercise Ball",
    "descripcion": "ExerciseDB dumbbell one arm french press on exercise ball.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/ziFKQXP.gif",
    "exerciseDbId": "ziFKQXP",
    "exerciseDbName": "dumbbell one arm french press on exercise ball",
    "exerciseDbAliases": [
      "dumbbell one arm french press on exercise ball"
    ],
    "instrucciones": "Sit on an exercise ball with your feet flat on the ground and your back straight.\nHold a dumbbell in one hand with your palm facing up and your elbow bent at a 90-degree angle.\nExtend your arm straight up towards the ceiling, keeping your elbow stationary.\nSlowly lower the dumbbell back down to the starting position.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-641mIfk",
    "nombre": "Barbell Incline Reverse-grip Press",
    "descripcion": "ExerciseDB barbell incline reverse-grip press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/641mIfk.gif",
    "exerciseDbId": "641mIfk",
    "exerciseDbName": "barbell incline reverse-grip press",
    "exerciseDbAliases": [
      "barbell incline reverse-grip press"
    ],
    "instrucciones": "Set up an incline bench at a 45-degree angle.\nLie back on the bench and grasp the barbell with a reverse grip, hands slightly wider than shoulder-width apart.\nUnrack the barbell and lower it towards your upper chest, keeping your elbows tucked in.\nPause for a moment at the bottom, then push the barbell back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-9RT8oQW",
    "nombre": "Bench Dip On Floor",
    "descripcion": "ExerciseDB bench dip on floor.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/9RT8oQW.gif",
    "exerciseDbId": "9RT8oQW",
    "exerciseDbName": "bench dip on floor",
    "exerciseDbAliases": [
      "bench dip on floor"
    ],
    "instrucciones": "Sit on the edge of a bench or chair with your hands gripping the edge, fingers pointing forward.\nSlide your butt off the bench, supporting your weight with your hands.\nLower your body by bending your elbows until your upper arms are parallel to the floor.\nPush yourself back up to the starting position by straightening your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-nAuHPcD",
    "nombre": "Dumbbell One Arm Triceps Extension (on Bench)",
    "descripcion": "ExerciseDB dumbbell one arm triceps extension (on bench).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "dumbbell",
    "imagenUrl": "https://static.exercisedb.dev/media/nAuHPcD.gif",
    "exerciseDbId": "nAuHPcD",
    "exerciseDbName": "dumbbell one arm triceps extension (on bench)",
    "exerciseDbAliases": [
      "dumbbell one arm triceps extension (on bench)"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold a dumbbell in one hand and place your other hand on the bench for support.\nRaise the dumbbell overhead, keeping your upper arm close to your head and your elbow pointing forward.\nLower the dumbbell behind your head by bending your elbow, keeping your upper arm stationary.\nExtend your arm back up to the starting position, fully straightening your elbow.\nRepeat for the desired number of repetitions, then switch arms.",
    "esPersonalizado": false
  },
  {
    "id": "db-YqJw82s",
    "nombre": "Barbell Reverse Close-grip Bench Press",
    "descripcion": "ExerciseDB barbell reverse close-grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/YqJw82s.gif",
    "exerciseDbId": "YqJw82s",
    "exerciseDbName": "barbell reverse close-grip bench press",
    "exerciseDbAliases": [
      "barbell reverse close-grip bench press"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.\nGrasp the barbell with a reverse grip, hands shoulder-width apart.\nLift the barbell off the rack and hold it directly above your chest with your arms fully extended.\nSlowly lower the barbell down towards your chest, keeping your elbows close to your body.\nPause for a moment when the barbell is just above your chest.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-yB9SvIF",
    "nombre": "Smith Machine Decline Close Grip Bench Press",
    "descripcion": "ExerciseDB smith machine decline close grip bench press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "smith machine",
    "imagenUrl": "https://static.exercisedb.dev/media/yB9SvIF.gif",
    "exerciseDbId": "yB9SvIF",
    "exerciseDbName": "smith machine decline close grip bench press",
    "exerciseDbAliases": [
      "smith machine decline close grip bench press"
    ],
    "instrucciones": "Adjust the bench on the smith machine to a decline position.\nLie down on the bench with your feet firmly planted on the ground.\nGrasp the barbell with a close grip, slightly narrower than shoulder-width apart.\nUnrack the barbell and lower it slowly towards your chest, keeping your elbows close to your body.\nPause for a moment when the barbell is just above your chest.\nPush the barbell back up to the starting position, fully extending your arms.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-ThKP69G",
    "nombre": "Cable Reverse Grip Triceps Pushdown (sz-bar) (with Arm Blaster)",
    "descripcion": "ExerciseDB cable reverse grip triceps pushdown (sz-bar) (with arm blaster).",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "cable",
    "imagenUrl": "https://static.exercisedb.dev/media/ThKP69G.gif",
    "exerciseDbId": "ThKP69G",
    "exerciseDbName": "cable reverse grip triceps pushdown (sz-bar) (with arm blaster)",
    "exerciseDbAliases": [
      "cable reverse grip triceps pushdown (sz-bar) (with arm blaster)"
    ],
    "instrucciones": "Attach a straight bar to the cable machine at the highest setting.\nStand facing the cable machine with your feet shoulder-width apart.\nGrasp the bar with an underhand grip, palms facing up, and your hands shoulder-width apart.\nKeep your elbows close to your sides and your upper arms stationary throughout the exercise.\nEngage your triceps and slowly push the bar down until your arms are fully extended.\nPause for a moment at the bottom, then slowly return the bar to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-h8LFzo9",
    "nombre": "Barbell Lying Triceps Extension Skull Crusher",
    "descripcion": "ExerciseDB barbell lying triceps extension skull crusher.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/h8LFzo9.gif",
    "exerciseDbId": "h8LFzo9",
    "exerciseDbName": "barbell lying triceps extension skull crusher",
    "exerciseDbAliases": [
      "barbell lying triceps extension skull crusher"
    ],
    "instrucciones": "Lie flat on a bench with your feet flat on the ground and your head at the end of the bench.\nHold the barbell with an overhand grip, hands shoulder-width apart, and extend your arms straight up over your chest.\nKeeping your upper arms stationary, slowly lower the barbell towards your forehead by bending your elbows.\nPause for a moment when the barbell is just above your forehead, then extend your arms back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-soIB2rj",
    "nombre": "Diamond Push-up",
    "descripcion": "ExerciseDB diamond push-up.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "chest",
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "body weight",
    "imagenUrl": "https://static.exercisedb.dev/media/soIB2rj.gif",
    "exerciseDbId": "soIB2rj",
    "exerciseDbName": "diamond push-up",
    "exerciseDbAliases": [
      "diamond push-up"
    ],
    "instrucciones": "Start in a high plank position with your hands close together, forming a diamond shape with your thumbs and index fingers.\nKeep your body in a straight line from head to toe, engaging your core and glutes.\nLower your chest towards the diamond shape formed by your hands, keeping your elbows close to your body.\nPause for a moment at the bottom, then push yourself back up to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-5uFK1xr",
    "nombre": "Barbell Seated Overhead Triceps Extension",
    "descripcion": "ExerciseDB barbell seated overhead triceps extension.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/5uFK1xr.gif",
    "exerciseDbId": "5uFK1xr",
    "exerciseDbName": "barbell seated overhead triceps extension",
    "exerciseDbAliases": [
      "barbell seated overhead triceps extension"
    ],
    "instrucciones": "Sit on a bench with your back straight and feet flat on the ground.\nHold a barbell with an overhand grip, hands shoulder-width apart, and raise it overhead.\nLower the barbell behind your head by bending your elbows, keeping your upper arms close to your head.\nPause for a moment, then extend your arms to raise the barbell back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-1cTf2Ux",
    "nombre": "Ez Bar Standing French Press",
    "descripcion": "ExerciseDB ez bar standing french press.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "ez barbell",
    "imagenUrl": "https://static.exercisedb.dev/media/1cTf2Ux.gif",
    "exerciseDbId": "1cTf2Ux",
    "exerciseDbName": "ez bar standing french press",
    "exerciseDbAliases": [
      "ez bar standing french press"
    ],
    "instrucciones": "Stand with your feet shoulder-width apart and hold the ez barbell with an overhand grip.\nRaise the barbell above your head, fully extending your arms.\nKeeping your upper arms close to your head, slowly lower the barbell behind your head by bending your elbows.\nPause for a moment, then extend your arms back to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  },
  {
    "id": "db-vpQaQkH",
    "nombre": "Ski Ergometer",
    "descripcion": "ExerciseDB ski ergometer.",
    "grupoMuscularPrimario": "triceps",
    "gruposMuscularesSecundarios": [
      "shoulders",
      "forearms"
    ],
    "nivelDificultad": "intermedio",
    "equipoNecesario": "skierg machine",
    "imagenUrl": "https://static.exercisedb.dev/media/vpQaQkH.gif",
    "exerciseDbId": "vpQaQkH",
    "exerciseDbName": "ski ergometer",
    "exerciseDbAliases": [
      "ski ergometer"
    ],
    "instrucciones": "Adjust the seat height and footrests to a comfortable position.\nGrasp the handles with an overhand grip, palms facing down.\nSit up straight with your feet flat on the footrests.\nExtend your arms straight out in front of you, keeping your elbows slightly bent.\nEngage your triceps and push the handles down towards your thighs.\nPause for a moment at the bottom, then slowly return to the starting position.\nRepeat for the desired number of repetitions.",
    "esPersonalizado": false
  }
]
