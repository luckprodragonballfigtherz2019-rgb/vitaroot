import { z } from 'zod'
import {
  NewWaterLogSchema,
  WaterLogSchema,
  NewSleepLogSchema,
  SleepLogSchema,
  NewWeightLogSchema,
  WeightLogSchema,
  NewMoodLogSchema,
  MoodLogSchema,
  type WaterLog,
  type SleepLog,
  type WeightLog,
  type MoodLog,
} from '@vitaroot/shared'
import { request } from './client'

// ═══════════════════════════════════════════════════════════════
// Tipos de entrada (inputs del frontend al backend)
// Usamos z.input<> porque tienen defaults opcionales
// ═══════════════════════════════════════════════════════════════

export type NewWaterLogInput = z.input<typeof NewWaterLogSchema>
export type NewSleepLogInput = z.input<typeof NewSleepLogSchema>
export type NewWeightLogInput = z.input<typeof NewWeightLogSchema>
export type NewMoodLogInput = z.input<typeof NewMoodLogSchema>

// ═══════════════════════════════════════════════════════════════
// WATER
// ═══════════════════════════════════════════════════════════════

const WaterDayResponseSchema = z.object({
  logs: z.array(WaterLogSchema),
  totalMl: z.number(),
})

export type WaterDayResponse = z.output<typeof WaterDayResponseSchema>

export async function addWaterLog(input: NewWaterLogInput): Promise<WaterLog> {
  const validated = NewWaterLogSchema.parse(input)
  return request('/health/water', WaterLogSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

export async function getWaterByDay(date: string): Promise<WaterDayResponse> {
  return request(`/health/water?date=${encodeURIComponent(date)}`, WaterDayResponseSchema, {
    method: 'GET',
  })
}

export async function deleteWaterLog(id: string): Promise<void> {
  await request(`/health/water/${id}`, undefined, { method: 'DELETE' })
}

// ═══════════════════════════════════════════════════════════════
// SLEEP
// ═══════════════════════════════════════════════════════════════

export async function addSleepLog(input: NewSleepLogInput): Promise<SleepLog> {
  const validated = NewSleepLogSchema.parse(input)
  return request('/health/sleep', SleepLogSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

export async function listSleepLast(limit = 30): Promise<SleepLog[]> {
  return request(`/health/sleep?limit=${limit}`, z.array(SleepLogSchema), {
    method: 'GET',
  })
}

export async function deleteSleepLog(id: string): Promise<void> {
  await request(`/health/sleep/${id}`, undefined, { method: 'DELETE' })
}

// ═══════════════════════════════════════════════════════════════
// WEIGHT
// ═══════════════════════════════════════════════════════════════

export async function addWeightLog(input: NewWeightLogInput): Promise<WeightLog> {
  const validated = NewWeightLogSchema.parse(input)
  return request('/health/weight', WeightLogSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

export async function getLatestWeight(): Promise<WeightLog | null> {
  return request('/health/weight/latest', z.union([WeightLogSchema, z.null()]), {
    method: 'GET',
  })
}

export async function listWeightLast(limit = 30): Promise<WeightLog[]> {
  return request(`/health/weight?limit=${limit}`, z.array(WeightLogSchema), {
    method: 'GET',
  })
}

export async function deleteWeightLog(id: string): Promise<void> {
  await request(`/health/weight/${id}`, undefined, { method: 'DELETE' })
}

// ═══════════════════════════════════════════════════════════════
// MOOD
// ═══════════════════════════════════════════════════════════════

export async function saveMoodLog(input: NewMoodLogInput): Promise<MoodLog> {
  const validated = NewMoodLogSchema.parse(input)
  return request('/health/mood', MoodLogSchema, {
    method: 'PUT',
    body: JSON.stringify(validated),
  })
}

export async function getMoodByDate(date: string): Promise<MoodLog | null> {
  return request(
    `/health/mood/${encodeURIComponent(date)}`,
    z.union([MoodLogSchema, z.null()]),
    { method: 'GET' },
  )
}

export async function listMoodLast(limit = 30): Promise<MoodLog[]> {
  return request(`/health/mood?limit=${limit}`, z.array(MoodLogSchema), {
    method: 'GET',
  })
}

export async function deleteMoodByDate(date: string): Promise<void> {
  await request(`/health/mood/${encodeURIComponent(date)}`, undefined, { method: 'DELETE' })
}
