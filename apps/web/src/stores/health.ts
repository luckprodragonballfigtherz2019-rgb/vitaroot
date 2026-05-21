import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { WaterLog, SleepLog, WeightLog, MoodLog } from '@vitaroot/shared'
import {
  addWaterLog,
  getWaterByDay,
  deleteWaterLog,
  addSleepLog,
  listSleepLast,
  deleteSleepLog,
  addWeightLog,
  getLatestWeight,
  listWeightLast,
  deleteWeightLog,
  saveMoodLog,
  getMoodByDate,
  listMoodLast,
  deleteMoodByDate,
  type NewWaterLogInput,
  type NewSleepLogInput,
  type NewWeightLogInput,
  type NewMoodLogInput,
} from '@/api/health'

/**
 * Store del módulo Salud.
 *
 * State: cachea las 4 métricas para evitar refetch innecesarios.
 * Actions: llaman al backend y actualizan el state.
 * Getters: derivados útiles (total agua hoy, último peso, etc.).
 */
export const useHealthStore = defineStore('health', () => {
  // ── State ────────────────────────────────────────────────
  const waterLogs = ref<WaterLog[]>([])
  const waterTotalMl = ref(0)
  const waterDateLoaded = ref<string | null>(null)

  const sleepLogs = ref<SleepLog[]>([])
  const weightLogs = ref<WeightLog[]>([])
  const latestWeight = ref<WeightLog | null>(null)
  const moodLogs = ref<MoodLog[]>([])
  const moodByDate = ref<Record<string, MoodLog | null>>({})

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Helpers ──────────────────────────────────────────────
  function todayISODate(): string {
    return new Date().toISOString().split('T')[0] ?? ''
  }

  // ── Actions: WATER ───────────────────────────────────────
  async function loadWaterForToday(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const today = todayISODate()
      const data = await getWaterByDay(today)
      waterLogs.value = data.logs
      waterTotalMl.value = data.totalMl
      waterDateLoaded.value = today
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando agua'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addWater(input: NewWaterLogInput): Promise<WaterLog> {
    const created = await addWaterLog(input)
    waterLogs.value = [created, ...waterLogs.value]
    waterTotalMl.value += created.amountMl
    return created
  }

  async function removeWater(id: string): Promise<void> {
    const log = waterLogs.value.find((l) => l.id === id)
    if (!log) return
    await deleteWaterLog(id)
    waterLogs.value = waterLogs.value.filter((l) => l.id !== id)
    waterTotalMl.value -= log.amountMl
  }

  // ── Actions: SLEEP ───────────────────────────────────────
  async function loadSleepLast(limit = 30): Promise<void> {
    loading.value = true
    error.value = null
    try {
      sleepLogs.value = await listSleepLast(limit)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando sueño'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addSleep(input: NewSleepLogInput): Promise<SleepLog> {
    const created = await addSleepLog(input)
    sleepLogs.value = [created, ...sleepLogs.value]
    return created
  }

  async function removeSleep(id: string): Promise<void> {
    await deleteSleepLog(id)
    sleepLogs.value = sleepLogs.value.filter((l) => l.id !== id)
  }

  // ── Actions: WEIGHT ──────────────────────────────────────
  async function loadWeightLatest(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      latestWeight.value = await getLatestWeight()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando peso'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadWeightLast(limit = 30): Promise<void> {
    loading.value = true
    error.value = null
    try {
      weightLogs.value = await listWeightLast(limit)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando peso'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addWeight(input: NewWeightLogInput): Promise<WeightLog> {
    const created = await addWeightLog(input)
    weightLogs.value = [created, ...weightLogs.value]
    if (!latestWeight.value || created.occurredAt > latestWeight.value.occurredAt) {
      latestWeight.value = created
    }
    return created
  }

  async function removeWeight(id: string): Promise<void> {
    await deleteWeightLog(id)
    weightLogs.value = weightLogs.value.filter((l) => l.id !== id)
    if (latestWeight.value?.id === id) {
      latestWeight.value = weightLogs.value[0] ?? null
    }
  }

  // ── Actions: MOOD ────────────────────────────────────────
  async function loadMoodForToday(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const today = todayISODate()
      const mood = await getMoodByDate(today)
      moodByDate.value[today] = mood
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando ánimo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMoodLast(limit = 30): Promise<void> {
    loading.value = true
    error.value = null
    try {
      moodLogs.value = await listMoodLast(limit)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando ánimo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveMood(input: NewMoodLogInput): Promise<MoodLog> {
    const saved = await saveMoodLog(input)
    moodByDate.value[saved.date] = saved
    const existingIdx = moodLogs.value.findIndex((m) => m.date === saved.date)
    if (existingIdx >= 0) {
      moodLogs.value[existingIdx] = saved
    } else {
      moodLogs.value = [saved, ...moodLogs.value]
    }
    return saved
  }

  async function removeMood(date: string): Promise<void> {
    await deleteMoodByDate(date)
    moodByDate.value[date] = null
    moodLogs.value = moodLogs.value.filter((m) => m.date !== date)
  }

  // ── Getters ──────────────────────────────────────────────
  const todayMood = computed(() => moodByDate.value[todayISODate()] ?? null)
  const todayWaterTotal = computed(() => waterTotalMl.value)
  const lastSleep = computed(() => sleepLogs.value[0] ?? null)

  return {
    // State (readonly desde fuera, Pinia lo expone como ref)
    waterLogs,
    waterTotalMl,
    waterDateLoaded,
    sleepLogs,
    weightLogs,
    latestWeight,
    moodLogs,
    moodByDate,
    loading,
    error,

    // Getters
    todayMood,
    todayWaterTotal,
    lastSleep,

    // Actions
    loadWaterForToday,
    addWater,
    removeWater,
    loadSleepLast,
    addSleep,
    removeSleep,
    loadWeightLatest,
    loadWeightLast,
    addWeight,
    removeWeight,
    loadMoodForToday,
    loadMoodLast,
    saveMood,
    removeMood,
  }
})
