import { and, eq, gte, lte, desc } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { weightLogs, type WeightLog } from '../../../drizzle/schema'

/**
 * Repositorio del módulo health/weight.
 */
export const weightRepository = {
  async add(input: {
    occurredAt: Date
    weightKg: number
    notes?: string
    meta?: { fastedState?: boolean; afterTraining?: boolean; bodyFatPct?: number }
  }): Promise<WeightLog> {
    const inserted = await db
      .insert(weightLogs)
      .values({
        occurredAt: input.occurredAt,
        weightKg: input.weightKg,
        notes: input.notes ?? null,
        meta: input.meta ?? null,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to insert weight log')
    }
    return created
  },

  async findByDateRange(from: Date, to: Date): Promise<WeightLog[]> {
    return db
      .select()
      .from(weightLogs)
      .where(and(gte(weightLogs.occurredAt, from), lte(weightLogs.occurredAt, to)))
      .orderBy(desc(weightLogs.occurredAt))
  },

  async findLast(limit: number): Promise<WeightLog[]> {
    return db.select().from(weightLogs).orderBy(desc(weightLogs.occurredAt)).limit(limit)
  },

  async findMostRecent(): Promise<WeightLog | null> {
    const rows = await db
      .select()
      .from(weightLogs)
      .orderBy(desc(weightLogs.occurredAt))
      .limit(1)
    return rows[0] ?? null
  },

  async deleteById(id: string): Promise<boolean> {
    const deleted = await db
      .delete(weightLogs)
      .where(eq(weightLogs.id, id))
      .returning({ id: weightLogs.id })
    return deleted.length > 0
  },
}
