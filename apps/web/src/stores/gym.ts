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
  listWorkouts,
  logWorkout,
  getWorkout,
  discardWorkout,
  type MuscleGroup,
  type LogWorkoutInput,
} from '@/api/gym'

/**
 * Store del módulo Gym (enfoque "log a posteriori").
 *
 * Estado:
 * - catalog: lista de ejercicios del catálogo (cacheada)
 * - history: workouts finalizados (cacheada)
 */
export const useGymStore = defineStore('gym', () => {
  // ── State ────────────────────────────────────────────────
  const catalog = ref<Exercise[]>([])
  const catalogLoaded = ref(false)

  const history = ref<Workout[]>([])
  const historyLoaded = ref(false)

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ──────────────────────────────────────────────
  const recentWorkouts = computed(() => history.value.slice(0, 10))

  // ── Actions: CATALOG ─────────────────────────────────────
  async function loadCatalog(): Promise<void> {
    if (catalogLoaded.value) return
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

  async function fetchWorkout(id: string): Promise<WorkoutDetail> {
    return getWorkout(id)
  }

  // ── Actions: LOG ─────────────────────────────────────────
  async function logNewWorkout(input: LogWorkoutInput): Promise<Workout> {
    const created = await logWorkout(input)
    // Añade al inicio del histórico local (más reciente primero)
    history.value = [created, ...history.value]
    return created
  }

  async function removeWorkout(id: string): Promise<void> {
    await discardWorkout(id)
    history.value = history.value.filter((w) => w.id !== id)
  }

  return {
    // State
    catalog,
    catalogLoaded,
    history,
    historyLoaded,
    loading,
    error,

    // Getters
    recentWorkouts,

    // Actions
    loadCatalog,
    searchCatalog,
    fetchLastSet,
    fetchPr,
    loadHistory,
    fetchWorkout,
    logNewWorkout,
    removeWorkout,
  }
})
