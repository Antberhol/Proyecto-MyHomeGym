# Documento Global de Requisitos Funcionales y Criterios de Aceptacion

## Proyecto
MyHomeGym

## Objetivo
Definir estandares de calidad, funcionalidad y experiencia de usuario para todos los modulos clave de la aplicacion, garantizando una herramienta de fitness robusta, offline-first y altamente interactiva.

## 1. Modulo de Autenticacion y Perfil

### Requisitos Funcionales (FR)
- FR-1.01: El sistema debe permitir la autenticacion de usuarios mediante Google Auth.
- FR-1.02: El sistema debe mantener la sesion persistente a traves de recargas de la pagina.
- FR-1.03: Los usuarios nuevos deben pasar por un asistente de configuracion inicial (Onboarding Wizard) para definir preferencias y datos base.

### Pruebas de Aceptacion (AC)

#### AC-1.1: Inicio de sesion exitoso
- Dado que un usuario no autenticado hace clic en "Iniciar sesion con Google".
- Cuando completa el flujo de OAuth exitosamente.
- Entonces debe ser redirigido al Dashboard.
- Y su estado global de autenticacion debe marcarse como activo.

#### AC-1.2: Persistencia de sesion
- Dado que un usuario esta logueado en la aplicacion.
- Cuando el usuario cierra y vuelve a abrir la pestana del navegador.
- Entonces el sistema debe autologuearlo sin pedir credenciales de nuevo.

## 2. Modulo de Gestion de Rutinas

### Requisitos Funcionales (FR)
- FR-2.01: Los usuarios deben poder crear, editar y eliminar rutinas personalizadas.
- FR-2.02: El sistema debe permitir reordenar los ejercicios dentro de una rutina mediante arrastrar y soltar (Drag and Drop).
- FR-2.03: El sistema debe permitir deslizar para eliminar (Swipe to Delete) ejercicios de una lista.

### Pruebas de Aceptacion (AC)

#### AC-2.1: Reordenamiento de ejercicios
- Dado que un usuario edita una rutina con al menos dos ejercicios.
- Cuando mantiene presionado el icono de arrastre del Ejercicio B y lo mueve sobre el Ejercicio A.
- Entonces el orden en la UI debe actualizarse inmediatamente.
- Y el nuevo orden debe persistir al guardar la rutina.

#### AC-2.2: Deslizar para eliminar
- Dado que el usuario visualiza la lista de ejercicios en su rutina.
- Cuando desliza un elemento de la lista hacia la izquierda.
- Entonces debe aparecer un boton de confirmacion o de borrado.
- Y al confirmar, el ejercicio debe desaparecer de la lista temporalmente hasta guardar cambios.

## 3. Modulo de Ejecucion del Entrenamiento (Workout)

### Requisitos Funcionales (FR)
- FR-3.01: El usuario debe poder iniciar una sesion de entrenamiento basada en una rutina existente o crear una en blanco.
- FR-3.02: El sistema debe registrar repeticiones, peso y calcular automaticamente el 1RM estimado.
- FR-3.03: Al completar una serie, el sistema debe iniciar automaticamente un temporizador de descanso (Rest Timer Overlay) configurable por el usuario con Audio Feedback (pitidos).

### Pruebas de Aceptacion (AC)

#### AC-3.1: Registro de serie y disparo de descanso
- Dado que el usuario esta en un entrenamiento activo.
- Cuando marca una serie como completada introduciendo 10 repeticiones y 50kg.
- Entonces la serie se marca visualmente como terminada (ej. color verde).
- Y el temporizador de descanso superpuesto debe iniciar la cuenta regresiva automaticamente.

#### AC-3.2: Persistencia de entrenamiento en curso
- Dado que el usuario tiene un entrenamiento activo a la mitad (hook usePersistedWorkoutSession).
- Cuando la aplicacion se cierra accidentalmente o el navegador se recarga.
- Entonces al volver a abrir la app, el sistema debe recuperar el estado exacto del entrenamiento activo y ofrecer continuar donde lo dejo.

## 4. Modulo de Progreso y Estadisticas (Dashboard)

### Requisitos Funcionales (FR)
- FR-4.01: El Dashboard debe mostrar las rachas de entrenamiento activo (Streak Badge).
- FR-4.02: El sistema debe generar un mapa de calor muscular (Muscle Heatmap / Body Diagram) basado en el volumen semanal levantado por grupo muscular.
- FR-4.03: La aplicacion debe ofrecer una calculadora de discos (Plate Calculator) como herramienta rapida.

### Pruebas de Aceptacion (AC)

#### AC-4.1: Actualizacion del mapa de calor
- Dado que el usuario completa un entrenamiento enfocado en Pecho y Triceps.
- Cuando navega de vuelta al Diagrama Corporal.
- Entonces las zonas pectorales y de triceps en el SVG (BodyDiagramSvg) deben iluminarse con una intensidad mayor (rojo/naranja) que el resto del cuerpo.

#### AC-4.2: Calculadora de discos
- Dado que el usuario abre el modal de Plate Calculator.
- Y establece el peso objetivo en 100kg y la barra en 20kg.
- Cuando el sistema calcula.
- Entonces debe mostrar visualmente exactamente cuantos discos de 20kg, 10kg, etc., necesita poner a cada lado de la barra.

## 5. Modulo de Sincronizacion y Modo Offline (PWA)

### Requisitos Funcionales (FR)
- FR-5.01: La aplicacion debe ser completamente funcional sin conexion a internet (modo offline).
- FR-5.02: Todos los datos locales (IndexedDB/Storage) deben sincronizarse automaticamente con Firebase cuando el dispositivo recupere la conexion.
- FR-5.03: El sistema debe notificar al usuario el estado de la sincronizacion (Sync Status Indicator).

### Pruebas de Aceptacion (AC)

#### AC-5.1: Entrenamiento completado en modo offline
- Dado que el dispositivo del usuario esta en Modo Avion.
- Cuando el usuario finaliza un entrenamiento y lo guarda.
- Entonces el entrenamiento se guarda en la base de datos local del navegador.
- Y el indicador de sincronizacion muestra el icono pendiente de sincronizar.

#### AC-5.2: Recuperacion de conexion y sincronizacion
- Dado que existen datos locales pendientes de subida.
- Cuando el dispositivo se vuelve a conectar a internet (evento online).
- Entonces el SyncService debe inyectar los datos en Firebase silenciosamente en segundo plano.
- Y el indicador debe cambiar a sincronizado/verde.

## 6. Modulo de Medios y Catalogo (Imagenes y GIFs)

### Requisitos Funcionales (FR)
- FR-6.01: El 100% de los ejercicios en el catalogo debe mostrar un GIF valido o un fallback generico estandarizado.
- FR-6.02: Las imagenes del catalogo deben cargarse perezosamente (Lazy Loading).

### Pruebas de Aceptacion (AC)

#### AC-6.1: Resiliencia de imagenes rotas
- Dado que la URL de un GIF en el catalogo arroja un error 404.
- Cuando se dispara el evento onError en el componente.
- Entonces el sistema oculta el error e inyecta dinamicamente el Default Fallback GIF.

## 7. Modulo de Internacionalizacion (i18n)

### Requisitos Funcionales (FR)
- FR-7.01: La aplicacion debe soportar multiples idiomas (actualmente ES y EN).
- FR-7.02: El cambio de idioma debe reflejarse instantaneamente en toda la aplicacion sin necesidad de recargar la pagina.

### Pruebas de Aceptacion (AC)

#### AC-7.1: Cambio de idioma en tiempo real
- Dado que la aplicacion esta en espanol.
- Cuando el usuario selecciona English en la pantalla de Configuracion.
- Entonces los textos de navegacion, botones y etiquetas deben cambiar a ingles inmediatamente mediante el LanguageContext.

