import type { WaterLog, NewWaterLogInput } from '@vitaroot/shared'
import { waterRepository } from './water.repository'

/**
 * Servicio del módulo health/water.
 */
export const waterService = {
  async addLog(input: NewWaterLogInput): Promise<WaterLog> {
    const created = await waterRepository.add({
      occurredAt: input.occurredAt,
      amountMl: input.amountMl,
    })
    return mapDbToApi(created)
  },

  async listByDateRange(from: Date, to: Date): Promise<WaterLog[]> {
    const rows = await waterRepository.findByDateRange(from, to)
    return rows.map(mapDbToApi)
  },

  async deleteLog(id: string): Promise<boolean> {
    return waterRepository.deleteById(id)
  },

  /**
   * Total acumulado de ml en un rango.
   */
  async sumByDateRange(from: Date, to: Date): Promise<number> {
    return waterRepository.sumByDateRange(from, to)
  },
}

function mapDbToApi(row: {
  id: string
  occurredAt: Date
  amountMl: number
  source: 'manual' | 'wearable' | 'import'
}): WaterLog {
  return {
    id: row.id,
    occurredAt: row.occurredAt,
    amountMl: row.amountMl,
    source: row.source,
  }
}
