import type { MoodLog, NewMoodLogInput } from '@vitaroot/shared'
import { moodRepository } from './mood.repository'

/**
 * Servicio del módulo health/mood.
 */
export const moodService = {
  /**
   * Upsert por fecha. Solo 1 registro por día.
   */
  async saveLog(input: NewMoodLogInput): Promise<MoodLog> {
    const saved = await moodRepository.upsert({
      date: input.date,
      score: input.score,
      notes: input.notes,
      meta: input.meta,
    })
    return mapDbToApi(saved)
  },

  async getByDate(date: string): Promise<MoodLog | null> {
    const row = await moodRepository.findByDate(date)
    return row ? mapDbToApi(row) : null
  },

  async listByDateRange(fromDate: string, toDate: string): Promise<MoodLog[]> {
    const rows = await moodRepository.findByDateRange(fromDate, toDate)
    return rows.map(mapDbToApi)
  },

  async listLast(limit: number): Promise<MoodLog[]> {
    const rows = await moodRepository.findLast(limit)
    return rows.map(mapDbToApi)
  },

  async deleteByDate(date: string): Promise<boolean> {
    return moodRepository.deleteByDate(date)
  },
}

function mapDbToApi(row: {
  id: string
  date: string
  score: number
  notes: string | null
  meta: { energy?: number; stress?: number } | null
  source: 'manual' | 'wearable' | 'import'
  createdAt: Date
  updatedAt: Date
}): MoodLog {
  return {
    id: row.id,
    date: row.date,
    score: row.score,
    notes: row.notes,
    meta: row.meta,
    source: row.source,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
