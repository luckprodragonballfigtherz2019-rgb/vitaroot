import { and, eq, like, or, asc, type SQL } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { exercises, type Exercise } from '../../../drizzle/schema'

/**
 * Repositorio del catálogo de ejercicios.
 */
export const exercisesRepository = {
  /**
   * Lista todos los ejercicios ordenados alfabéticamente.
   * Acepta filtros opcionales por búsqueda en nombre y por grupo muscular.
   */
  async findAll(filters?: {
    search?: string
    muscle?: string
  }): Promise<Exercise[]> {
    const conditions: SQL[] = []

    if (filters?.search) {
      const term = `%${filters.search}%`
      const searchCondition = or(like(exercises.name, term), like(exercises.equipment, term))
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    if (filters?.muscle) {
      conditions.push(eq(exercises.primaryMuscle, filters.muscle))
    }

    const baseQuery = db.select().from(exercises)

    if (conditions.length === 0) {
      return baseQuery.orderBy(asc(exercises.name))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)
    return baseQuery.where(whereClause).orderBy(asc(exercises.name))
  },

  async findById(id: string): Promise<Exercise | null> {
    const rows = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1)
    return rows[0] ?? null
  },

  async findByName(name: string): Promise<Exercise | null> {
    const rows = await db.select().from(exercises).where(eq(exercises.name, name)).limit(1)
    return rows[0] ?? null
  },
}
