import { and, eq, gte, lte, desc, sql } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { moodLogs, type MoodLog } from '../../../drizzle/schema'

/**
 * Repositorio del módulo health/mood.
 */
export const moodRepository = {
  /**
   * Upsert: si ya existe un registro con esa fecha, lo actualiza.
   * Si no, lo inserta. SQLite tiene ON CONFLICT DO UPDATE.
   */
  async upsert(input: {
    date: string
    score: number
    notes?: string
    meta?: { energy?: number; stress?: number }
  }): Promise<MoodLog> {
    const inserted = await db
      .insert(moodLogs)
      .values({
        date: input.date,
        score: input.score,
        notes: input.notes ?? null,
        meta: input.meta ?? null,
      })
      .onConflictDoUpdate({
        target: moodLogs.date,
        set: {
          score: input.score,
          notes: input.notes ?? null,
          meta: input.meta ?? null,
          updatedAt: sql`(unixepoch())`,
        },
      })
      .returning()

    const result = inserted[0]
    if (!result) {
      throw new Error('Failed to upsert mood log')
    }
    return result
  },

  async findByDate(date: string): Promise<MoodLog | null> {
    const rows = await db
      .select()
      .from(moodLogs)
      .where(eq(moodLogs.date, date))
      .limit(1)
    return rows[0] ?? null
  },

  async findByDateRange(fromDate: string, toDate: string): Promise<MoodLog[]> {
    // date es texto YYYY-MM-DD, comparación lexicográfica = cronológica
    return db
      .select()
      .from(moodLogs)
      .where(and(gte(moodLogs.date, fromDate), lte(moodLogs.date, toDate)))
      .orderBy(desc(moodLogs.date))
  },

  async findLast(limit: number): Promise<MoodLog[]> {
    return db.select().from(moodLogs).orderBy(desc(moodLogs.date)).limit(limit)
  },

  async deleteByDate(date: string): Promise<boolean> {
    const deleted = await db
      .delete(moodLogs)
      .where(eq(moodLogs.date, date))
      .returning({ id: moodLogs.id })
    return deleted.length > 0
  },
}
