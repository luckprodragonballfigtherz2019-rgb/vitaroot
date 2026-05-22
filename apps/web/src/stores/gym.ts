import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  Exercise,
  Workout,
  WorkoutDetail,
  Set,
} from '@vitaroot/shared'
import {
  listExercises,
  getLastSet,
  getPr,
  startWorkout,
  getActiveWorkout,
  finishWorkout,
  discardWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  addSet,
  updateSet,
  deleteSet,
  listWorkouts,
  type MuscleGroup,
  type StartWorkoutInput,
  type FinishWorkoutInput,
  type NewSetInput,
  type UpdateSetInput,
} from '@/api/gym'

/**
 * Store del módulo Gym.
 *
 * Estado principal:
 * - catalog: lista de ejercicios del catálogo
 * - activeWorkout: el workout activo con sus ejercicios y sets
 * - history: workouts finalizados (para listado)
 */
export const useGymStore = defineStore('gym', () => {
  // ── State ────────────────────────────────────────────────
  const catalog = ref<Exercise[]>([])
  const catalogLoaded = ref(false)

  const activeWorkout = ref<WorkoutDetail | null>(null)
  const activeWorkoutLoaded = ref(false)

  const history = ref<Workout[]>([])
  const historyLoaded = ref(false)

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ──────────────────────────────────────────────
  const hasActiveWorkout = computed(() => activeWorkout.value !== null)

  const totalSetsCompleted = computed(() => {
    if (!activeWorkout.value) return 0
    return activeWorkout.value.exercises.reduce(
      (sum, inst) => sum + inst.sets.filter((s) => s.completed).length,
      0,
    )
  })

  const currentVolumeKg = computed(() => {
    if (!activeWorkout.value) return 0
    let total = 0
    for (const inst of activeWorkout.value.exercises) {
      for (const s of inst.sets) {
        if (s.completed && s.weightKg !== null && s.reps !== null) {
          total += s.weightKg * s.reps
        }
      }
    }
    return total
  })

  // ── Actions: CATALOG ─────────────────────────────────────
  async function loadCatalog(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      catalog.value = await listExercises()
      catalogLoaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando catálogo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchCatalog(filters: { search?: string; muscle?: MuscleGroup }): Promise<Exercise[]> {
    return listExercises(filters)
  }

  async function fetchLastSet(exerciseId: string): Promise<Set | null> {
    return getLastSet(exerciseId)
  }

  async function fetchPr(exerciseId: string): Promise<Set | null> {
    return getPr(exerciseId)
  }

  // ── Actions: ACTIVE WORKOUT ─────────────────────────────
  async function loadActiveWorkout(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      activeWorkout.value = await getActiveWorkout()
      activeWorkoutLoaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando workout'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function startNewWorkout(input: StartWorkoutInput): Promise<Workout> {
    const created = await startWorkout(input)
    // Tras crearlo, recargamos como detail (con relaciones vacías)
    await loadActiveWorkout()
    return created
  }

  async function finishCurrentWorkout(input: FinishWorkoutInput): Promise<Workout> {
    if (!activeWorkout.value) {
      throw new Error('No hay workout activo para finalizar')
    }
    const finished = await finishWorkout(activeWorkout.value.id, input)
    activeWorkout.value = null
    activeWorkoutLoaded.value = false
    // Invalidamos history para que la próxima vez se refresque
    historyLoaded.value = false
    return finished
  }

  async function discardCurrentWorkout(): Promise<void> {
    if (!activeWorkout.value) return
    await discardWorkout(activeWorkout.value.id)
    activeWorkout.value = null
  }

  async function addExercise(exerciseId: string, notes?: string): Promise<void> {
    if (!activeWorkout.value) {
      throw new Error('No hay workout activo')
    }
    await addExerciseToWorkout(activeWorkout.value.id, { exerciseId, notes })
    // Recargamos el workout entero para que llegue con la nueva instance + relaciones
    await loadActiveWorkout()
  }

  async function removeExerciseInstance(exerciseInstanceId: string): Promise<void> {
    await removeExerciseFromWorkout(exerciseInstanceId)
    if (activeWorkout.value) {
      activeWorkout.value = {
        ...activeWorkout.value,
        exercises: activeWorkout.value.exercises.filter((e) => e.id !== exerciseInstanceId),
      }
    }
  }

  // ── Actions: SETS ───────────────────────────────────────
  async function addSetToInstance(input: NewSetInput): Promise<Set> {
    const created = await addSet(input)
    if (activeWorkout.value) {
      activeWorkout.value = {
        ...activeWorkout.value,
        exercises: activeWorkout.value.exercises.map((inst) =>
          inst.id === input.exerciseInstanceId
            ? { ...inst, sets: [...inst.sets, created] }
            : inst,
        ),
      }
    }
    return created
  }

  async function patchSet(id: string, input: UpdateSetInput): Promise<Set> {
    const updated = await updateSet(id, input)
    if (activeWorkout.value) {
      activeWorkout.value = {
        ...activeWorkout.value,
        exercises: activeWorkout.value.exercises.map((inst) => ({
          ...inst,
          sets: inst.sets.map((s) => (s.id === id ? updated : s)),
        })),
      }
    }
    return updated
  }

  async function removeSet(id: string): Promise<void> {
    await deleteSet(id)
    if (activeWorkout.value) {
      activeWorkout.value = {
        ...activeWorkout.value,
        exercises: activeWorkout.value.exercises.map((inst) => ({
          ...inst,
          sets: inst.sets.filter((s) => s.id !== id),
        })),
      }
    }
  }

  // ── Actions: HISTORY ────────────────────────────────────
  async function loadHistory(limit = 30): Promise<void> {
    loading.value = true
    error.value = null
    try {
      history.value = await listWorkouts(limit)
      historyLoaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando histórico'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    catalog,
    catalogLoaded,
    activeWorkout,
    activeWorkoutLoaded,
    history,
    historyLoaded,
    loading,
    error,

    // Getters
    hasActiveWorkout,
    totalSetsCompleted,
    currentVolumeKg,

    // Actions
    loadCatalog,
    searchCatalog,
    fetchLastSet,
    fetchPr,
    loadActiveWorkout,
    startNewWorkout,
    finishCurrentWorkout,
    discardCurrentWorkout,
    addExercise,
    removeExerciseInstance,
    addSetToInstance,
    patchSet,
    removeSet,
    loadHistory,
  }
})
