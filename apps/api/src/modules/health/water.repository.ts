import { and, eq, gte, lte, desc, sql } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { waterLogs, type WaterLog } from '../../../drizzle/schema'

/**
 * Repositorio del módulo health/water.
 */
export const waterRepository = {
  /**
   * Inserta un registro de agua.
   * Si no se pasa occurredAt, usa "ahora".
   */
  async add(input: { occurredAt?: Date; amountMl: number }): Promise<WaterLog> {
    const inserted = await db
      .insert(waterLogs)
      .values({
        occurredAt: input.occurredAt ?? new Date(),
        amountMl: input.amountMl,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to insert water log')
    }
    return created
  },

  /**
   * Lista los registros entre dos fechas, más recientes primero.
   */
  async findByDateRange(from: Date, to: Date): Promise<WaterLog[]> {
    return db
      .select()
      .from(waterLogs)
      .where(and(gte(waterLogs.occurredAt, from), lte(waterLogs.occurredAt, to)))
      .orderBy(desc(waterLogs.occurredAt))
  },

  /**
   * Elimina un registro por id. Devuelve true si se borró algo.
   */
  async deleteById(id: string): Promise<boolean> {
    const deleted = await db
      .delete(waterLogs)
      .where(eq(waterLogs.id, id))
      .returning({ id: waterLogs.id })
    return deleted.length > 0
  },

  /**
   * Suma total de ml entre dos fechas.
   * Devuelve 0 si no hay registros.
   */
  async sumByDateRange(from: Date, to: Date): Promise<number> {
    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(${waterLogs.amountMl}), 0)`,
      })
      .from(waterLogs)
      .where(and(gte(waterLogs.occurredAt, from), lte(waterLogs.occurredAt, to)))

    return result[0]?.total ?? 0
  },
}
