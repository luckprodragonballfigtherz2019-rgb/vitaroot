import type { SleepLog, NewSleepLogInput } from '@vitaroot/shared'
import { sleepRepository } from './sleep.repository'

/**
 * Servicio del módulo health/sleep.
 */
export const sleepService = {
  /**
   * Registra una noche de sueño.
   * Calcula durationMin automáticamente a partir de bedtime y wakeTime.
   */
  async addLog(input: NewSleepLogInput): Promise<SleepLog> {
    const durationMin = Math.round(
      (input.wakeTime.getTime() - input.bedtime.getTime()) / 60000,
    )

    const created = await sleepRepository.add({
      bedtime: input.bedtime,
      wakeTime: input.wakeTime,
      durationMin,
      quality: input.quality,
      notes: input.notes,
    })

    return mapDbToApi(created)
  },

  async listByDateRange(from: Date, to: Date): Promise<SleepLog[]> {
    const rows = await sleepRepository.findByDateRange(from, to)
    return rows.map(mapDbToApi)
  },

  async listLast(limit: number): Promise<SleepLog[]> {
    const rows = await sleepRepository.findLast(limit)
    return rows.map(mapDbToApi)
  },

  async deleteLog(id: string): Promise<boolean> {
    return sleepRepository.deleteById(id)
  },
}

function mapDbToApi(row: {
  id: string
  bedtime: Date
  wakeTime: Date
  durationMin: number
  quality: number | null
  notes: string | null
  meta: { deepSleepMin?: number; remSleepMin?: number; awakenings?: number } | null
  source: 'manual' | 'wearable' | 'import'
  createdAt: Date
}): SleepLog {
  return {
    id: row.id,
    bedtime: row.bedtime,
    wakeTime: row.wakeTime,
    durationMin: row.durationMin,
    quality: row.quality,
    notes: row.notes,
    meta: row.meta,
    source: row.source,
    createdAt: row.createdAt,
  }
}
