import type { Exercise, NewExerciseInput } from '@vitaroot/shared'
import { NewExerciseSchema } from '@vitaroot/shared'
import { exercisesRepository } from './exercises.repository'
import { ApiError, NotFoundError } from '../../lib/errors'
import { db } from '../../infrastructure/db'
import { exercises } from '../../../drizzle/schema'

/**
 * Servicio del catálogo de ejercicios.
 */
export const exercisesService = {
  async list(filters?: {
    search?: string
    muscle?: string
  }): Promise<Exercise[]> {
    const rows = await exercisesRepository.findAll(filters)
    return rows.map(mapDbToApi)
  },

  async getById(id: string): Promise<Exercise> {
    const row = await exercisesRepository.findById(id)
    if (!row) {
      throw new NotFoundError('Exercise')
    }
    return mapDbToApi(row)
  },

  /**
   * Crea un ejercicio custom del usuario.
   * Falla si ya existe uno con el mismo nombre.
   */
  async createCustom(input: NewExerciseInput): Promise<Exercise> {
    const parsed = NewExerciseSchema.parse(input)

    const existing = await exercisesRepository.findByName(parsed.name)
    if (existing) {
      throw new ApiError(409, 'CONFLICT', `Ya existe un ejercicio con el nombre "${parsed.name}"`)
    }

    const inserted = await db
      .insert(exercises)
      .values({
        name: parsed.name,
        category: parsed.category,
        primaryMuscle: parsed.primaryMuscle,
        secondaryMuscles: parsed.secondaryMuscles,
        equipment: parsed.equipment ?? null,
        notes: parsed.notes ?? null,
        isCustom: true,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to insert exercise')
    }
    return mapDbToApi(created)
  },
}

function mapDbToApi(row: {
  id: string
  name: string
  category: 'compound' | 'isolation' | 'cardio' | 'bodyweight' | 'stretching'
  primaryMuscle: string
  secondaryMuscles: string[]
  equipment: string | null
  notes: string | null
  isCustom: boolean
  createdAt: Date
}): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    primaryMuscle: row.primaryMuscle as Exercise['primaryMuscle'],
    secondaryMuscles: row.secondaryMuscles as Exercise['secondaryMuscles'],
    equipment: row.equipment,
    notes: row.notes,
    isCustom: row.isCustom,
    createdAt: row.createdAt,
  }
}
