import { Calculator, Share2 } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import { WorkoutShareCard } from '../components/share/WorkoutShareCard'
import { PlateCalculatorModal } from '../components/tools/PlateCalculatorModal'
import { RoutineSelector } from '../components/workout/RoutineSelector'
import { ActiveExerciseCard } from '../components/workout/ActiveExerciseCard'
import { RestTimerOverlay } from '../components/workout/RestTimerOverlay'
import { WorkoutControls } from '../components/workout/WorkoutControls'
import { useActiveWorkoutController } from '../hooks/useActiveWorkoutController'

export function EntrenarPage() {
  const {
    form,
    view,
    routines,
    exercises,
    selectedRoutineExercises,
    activeRoutineExercise,
    activeExerciseIndex,
    previousSessionByExercise,
    activeExerciseHistory,
    activeExerciseSuggestedWeight,
    activeExercisePrTarget,
    freeExerciseId,
    freeSeriesCount,
    freeExercisesDraft,
    trainingSummary,
    lastSavedMessage,
    sharePreviewData,
    sessionSeconds,
    sessionRunning,
    restSeconds,
    formatClock,
    isPlateCalculatorOpen,
    startRoutine,
    startFreeTraining,
    exitToSelection,
    applySessionTimeToDuration,
    toggleSessionRunning,
    startRestTimer,
    setRestSeconds,
    onSubmit,
    onShareSummary,
    getSetValue,
    updateSetData,
    applySuggestedWeight,
    setActiveExerciseIndex,
    setFreeExerciseId,
    setFreeSeriesCount,
    addFreeExerciseDraft,
    addFreeSet,
    removeFreeExerciseDraft,
    removeFreeSet,
    updateFreeSetData,
    openPlateCalculator,
    closePlateCalculator,
  } = useActiveWorkoutController()

  if (view === 'selection') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Entrenar</h1>
        <RoutineSelector
          routines={routines}
          onStartRoutine={startRoutine}
          onStartFree={startFreeTraining}
        />
      </div>
    )
  }

  if (view === 'summary' && trainingSummary) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Resumen de entrenamiento</h1>

        {lastSavedMessage && (
          <p className="rounded-lg bg-white p-3 text-sm text-slate-700 shadow dark:bg-gym-cardDark dark:text-slate-200">{lastSavedMessage}</p>
        )}

        <div className="w-full space-y-4 rounded-xl bg-white p-5 shadow-xl dark:bg-gym-cardDark">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Resumen de entrenamiento</h2>
            <button
              type="button"
              onClick={() => {
                void onShareSummary()
              }}
              className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs"
            >
              <Share2 size={14} /> Compartir
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              Duración: <span className="font-semibold">{trainingSummary.durationMinutes} min</span>
            </div>
            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              Volumen: <span className="font-semibold">{trainingSummary.totalVolume.toFixed(0)} kg</span>
            </div>
            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              Series: <span className="font-semibold">{trainingSummary.setCount}</span>
            </div>
            <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              PRs nuevos: <span className="font-semibold">{trainingSummary.prsCreated}</span>
            </div>
          </div>

          {sharePreviewData && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Vista previa para compartir</h3>
              <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-900">
                <div className="relative h-[320px] w-[180px] overflow-hidden rounded-2xl">
                  <div className="absolute left-0 top-0 origin-top-left scale-50">
                    <WorkoutShareCard data={sharePreviewData} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">Desglose por ejercicio</h3>
            {trainingSummary.byExercise.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">No hubo series registradas para mostrar desglose.</p>
            ) : (
              <div className="h-56">
                <Virtuoso
                  data={trainingSummary.byExercise}
                  itemContent={(_, item) => (
                    <div className="mb-2 flex items-center justify-between rounded border border-slate-200 p-2 text-sm dark:border-slate-700">
                      <span>{item.name}</span>
                      <span>{item.sets} series · {item.volume.toFixed(0)} kg</span>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={exitToSelection}
            className="h-11 w-full rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Finalizar y Salir
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Registrar entrenamiento</h1>
        <button
          type="button"
          onClick={openPlateCalculator}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium dark:border-slate-600"
        >
          <Calculator size={16} />
          Calculadora de discos
        </button>
      </div>

      <WorkoutControls
        sessionSeconds={sessionSeconds}
        sessionRunning={sessionRunning}
        restSeconds={restSeconds}
        formatClock={formatClock}
        onToggleSession={toggleSessionRunning}
        onApplySessionDuration={applySessionTimeToDuration}
        onStartRest={startRestTimer}
        onResetRest={() => setRestSeconds(0)}
        onFinishWorkout={() => {
          void onSubmit()
        }}
        onDiscardWorkout={() => {
          const shouldDiscard = window.confirm(
            '¿Seguro que quieres descartar este entrenamiento? Se perderán los datos no guardados.',
          )

          if (!shouldDiscard) return
          exitToSelection()
        }}
      />

      <RestTimerOverlay restSeconds={restSeconds} formatClock={formatClock} />

      <PlateCalculatorModal
        isOpen={isPlateCalculatorOpen}
        onClose={closePlateCalculator}
        initialTargetWeight={activeExerciseSuggestedWeight ?? 100}
      />

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow dark:bg-gym-cardDark md:grid-cols-2">
        <select {...form.register('rutinaId')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900">
          <option value="">Entreno libre</option>
          {routines.map((routine) => (
            <option key={routine.id} value={routine.id}>
              {routine.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          {...form.register('duracionMinutos')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder="Duración (min)"
        />

        {selectedRoutineExercises.length === 0 && freeExercisesDraft.length === 0 && (
          <input
            type="number"
            {...form.register('volumenTotalManual')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Volumen total manual (kg)"
          />
        )}

        <input
          {...form.register('notas')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder="Notas"
        />

        {selectedRoutineExercises.length > 0 && (
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 md:col-span-2 dark:border-slate-700">
            <h2 className="text-base font-semibold">Entrenamiento guiado por rutina</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Campos autocompletados con el último registro de cada ejercicio. Puedes editarlos libremente.
            </p>
            <ActiveExerciseCard
              activeRoutineExercise={activeRoutineExercise}
              activeExerciseIndex={activeExerciseIndex}
              totalExercises={selectedRoutineExercises.length}
              previousSessionByExercise={previousSessionByExercise}
              activeExerciseHistory={activeExerciseHistory}
              activeExerciseSuggestedWeight={activeExerciseSuggestedWeight}
              activeExercisePrTarget={activeExercisePrTarget}
              onPrevious={() => setActiveExerciseIndex((current) => Math.max(0, current - 1))}
              onNext={() => setActiveExerciseIndex((current) => Math.min(selectedRoutineExercises.length - 1, current + 1))}
              onApplySuggestedWeight={applySuggestedWeight}
              onStartRestTimer={startRestTimer}
              getSetValue={getSetValue}
              updateSetData={updateSetData}
            />
          </div>
        )}

        {selectedRoutineExercises.length === 0 && (
          <div className="space-y-3 rounded-lg border border-slate-200 p-3 md:col-span-2 dark:border-slate-700">
            <h2 className="text-base font-semibold">Registro detallado (entreno libre)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Añade ejercicios y registra cada serie con repeticiones y peso. Si no registras series, puedes usar el volumen manual.
            </p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <select
                value={freeExerciseId}
                onChange={(event) => setFreeExerciseId(event.target.value)}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 md:col-span-2"
              >
                <option value="">Selecciona ejercicio</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={freeSeriesCount}
                onChange={(event) => setFreeSeriesCount(Math.max(1, Number(event.target.value) || 1))}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                placeholder="Series"
              />
              <button
                type="button"
                onClick={addFreeExerciseDraft}
                className="rounded border border-slate-300 px-2 py-1 text-xs"
              >
                Añadir ejercicio
              </button>
            </div>

            <div className="space-y-3">
              {freeExercisesDraft.map((draft) => {
                const exerciseName = exercises.find((exercise) => exercise.id === draft.ejercicioId)?.nombre || 'Ejercicio'
                return (
                  <div key={draft.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{exerciseName}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addFreeSet(draft.id)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px]"
                        >
                          + Serie
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFreeExerciseDraft(draft.id)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px] text-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {draft.sets.map((set, setIndex) => (
                        <div key={`${draft.id}-${setIndex + 1}`} className="rounded bg-slate-50 p-2 dark:bg-slate-800">
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-xs font-medium">Serie {setIndex + 1}</p>
                            <button
                              type="button"
                              onClick={() => removeFreeSet(draft.id, setIndex)}
                              className="text-[11px] text-red-600"
                            >
                              borrar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={set.reps === 0 ? '' : set.reps}
                              onChange={(event) => updateFreeSetData(draft.id, setIndex, 'reps', event.target.value)}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                              placeholder="Reps"
                            />
                            <input
                              type="number"
                              step="0.5"
                              value={set.peso === 0 ? '' : set.peso}
                              onChange={(event) => updateFreeSetData(draft.id, setIndex, 'peso', event.target.value)}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
                              placeholder="Peso"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {freeExercisesDraft.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-300">No has añadido ejercicios al registro libre.</p>
              )}
            </div>
          </div>
        )}

        <button type="submit" className="rounded-lg bg-gym-primary px-4 py-2 text-sm font-semibold text-white md:col-span-2">
          Guardar entrenamiento
        </button>
      </form>
    </div>
  )
}
