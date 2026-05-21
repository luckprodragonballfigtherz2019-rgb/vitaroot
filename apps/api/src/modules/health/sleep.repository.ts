import { and, eq, gte, lte, desc } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { sleepLogs, type SleepLog } from '../../../drizzle/schema'

/**
 * Repositorio del módulo health/sleep.
 */
export const sleepRepository = {
  async add(input: {
    bedtime: Date
    wakeTime: Date
    durationMin: number
    quality?: number
    notes?: string
  }): Promise<SleepLog> {
    const inserted = await db
      .insert(sleepLogs)
      .values({
        bedtime: input.bedtime,
        wakeTime: input.wakeTime,
        durationMin: input.durationMin,
        quality: input.quality ?? null,
        notes: input.notes ?? null,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to insert sleep log')
    }
    return created
  },

  async findByDateRange(from: Date, to: Date): Promise<SleepLog[]> {
    return db
      .select()
      .from(sleepLogs)
      .where(and(gte(sleepLogs.bedtime, from), lte(sleepLogs.bedtime, to)))
      .orderBy(desc(sleepLogs.bedtime))
  },

  async findLast(limit: number): Promise<SleepLog[]> {
    return db.select().from(sleepLogs).orderBy(desc(sleepLogs.bedtime)).limit(limit)
  },

  async deleteById(id: string): Promise<boolean> {
    const deleted = await db
      .delete(sleepLogs)
      .where(eq(sleepLogs.id, id))
      .returning({ id: sleepLogs.id })
    return deleted.length > 0
  },
}
