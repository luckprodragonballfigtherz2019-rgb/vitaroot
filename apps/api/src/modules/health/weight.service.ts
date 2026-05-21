import type { WeightLog, NewWeightLogInput } from '@vitaroot/shared'
import { weightRepository } from './weight.repository'

/**
 * Servicio del módulo health/weight.
 */
export const weightService = {
  async addLog(input: NewWeightLogInput): Promise<WeightLog> {
    const created = await weightRepository.add({
      occurredAt: input.occurredAt ?? new Date(),
      weightKg: input.weightKg,
      notes: input.notes,
      meta: input.meta,
    })
    return mapDbToApi(created)
  },

  async listByDateRange(from: Date, to: Date): Promise<WeightLog[]> {
    const rows = await weightRepository.findByDateRange(from, to)
    return rows.map(mapDbToApi)
  },

  async listLast(limit: number): Promise<WeightLog[]> {
    const rows = await weightRepository.findLast(limit)
    return rows.map(mapDbToApi)
  },

  async getMostRecent(): Promise<WeightLog | null> {
    const row = await weightRepository.findMostRecent()
    return row ? mapDbToApi(row) : null
  },

  async deleteLog(id: string): Promise<boolean> {
    return weightRepository.deleteById(id)
  },
}

function mapDbToApi(row: {
  id: string
  occurredAt: Date
  weightKg: number
  notes: string | null
  meta: { fastedState?: boolean; afterTraining?: boolean; bodyFatPct?: number } | null
  source: 'manual' | 'wearable' | 'import'
  createdAt: Date
}): WeightLog {
  return {
    id: row.id,
    occurredAt: row.occurredAt,
    weightKg: row.weightKg,
    notes: row.notes,
    meta: row.meta,
    source: row.source,
    createdAt: row.createdAt,
  }
}
