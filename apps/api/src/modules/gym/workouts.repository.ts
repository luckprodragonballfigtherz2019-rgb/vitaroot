import { and, desc, eq, asc } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import {
  workouts,
  exerciseInstances,
  sets,
  exercises,
  type Workout,
  type ExerciseInstance,
  type Set,
  type Exercise,
} from '../../../drizzle/schema'

/**
 * Repositorio de workouts.
 *
 * Maneja workouts, sus ejercicios (exercise_instances) y sus sets.
 */

export interface WorkoutWithRelations extends Workout {
  exercises: Array<
    ExerciseInstance & {
      exercise: Exercise
      sets: Set[]
    }
  >
}

export const workoutsRepository = {
  /**
   * Devuelve el workout activo (status='active') o null si no hay.
   * Solo puede haber UN workout activo por la lógica de negocio.
   */
  async findActive(): Promise<WorkoutWithRelations | null> {
    const activeRows = await db
      .select()
      .from(workouts)
      .where(eq(workouts.status, 'active'))
      .limit(1)

    const active = activeRows[0]
    if (!active) return null

    return this.findByIdWithRelations(active.id)
  },

  /**
   * Carga un workout con todos sus ejercicios, sus exercise definitions, y sus sets.
   */
  async findByIdWithRelations(id: string): Promise<WorkoutWithRelations | null> {
    const workoutRows = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1)
    const workout = workoutRows[0]
    if (!workout) return null

    const instances = await db
      .select()
      .from(exerciseInstances)
      .where(eq(exerciseInstances.workoutId, id))
      .orderBy(asc(exerciseInstances.order))

    const enriched = await Promise.all(
      instances.map(async (inst) => {
        const exRows = await db
          .select()
          .from(exercises)
          .where(eq(exercises.id, inst.exerciseId))
          .limit(1)
        const exercise = exRows[0]
        if (!exercise) {
          throw new Error(`Exercise ${inst.exerciseId} not found for instance ${inst.id}`)
        }

        const setRows = await db
          .select()
          .from(sets)
          .where(eq(sets.exerciseInstanceId, inst.id))
          .orderBy(asc(sets.order))

        return { ...inst, exercise, sets: setRows }
      }),
    )

    return { ...workout, exercises: enriched }
  },

  async listFinished(limit: number): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .where(eq(workouts.status, 'finished'))
      .orderBy(desc(workouts.startedAt))
      .limit(limit)
  },

  /**
   * Crea un workout en estado 'active'.
   */
  async startWorkout(input: { name?: string }): Promise<Workout> {
    const inserted = await db
      .insert(workouts)
      .values({
        startedAt: new Date(),
        status: 'active',
        name: input.name ?? null,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to start workout')
    }
    return created
  },

  /**
   * Marca un workout como finalizado y calcula su volumen total.
   */
  async finishWorkout(input: {
    id: string
    notes?: string
    totalVolumeKg: number
    durationMin: number
  }): Promise<Workout> {
    const updated = await db
      .update(workouts)
      .set({
        status: 'finished',
        finishedAt: new Date(),
        durationMin: input.durationMin,
        totalVolumeKg: input.totalVolumeKg,
        notes: input.notes ?? null,
      })
      .where(eq(workouts.id, input.id))
      .returning()

    const result = updated[0]
    if (!result) {
      throw new Error('Workout not found')
    }
    return result
  },

  async discardWorkout(id: string): Promise<boolean> {
    const deleted = await db
      .update(workouts)
      .set({ status: 'discarded' })
      .where(eq(workouts.id, id))
      .returning({ id: workouts.id })
    return deleted.length > 0
  },

  /**
   * Añade un ejercicio (instance) al workout.
   * El order se calcula automáticamente como el siguiente disponible.
   */
  async addExerciseInstance(input: {
    workoutId: string
    exerciseId: string
    notes?: string
  }): Promise<ExerciseInstance> {
    const existing = await db
      .select()
      .from(exerciseInstances)
      .where(eq(exerciseInstances.workoutId, input.workoutId))

    const nextOrder = existing.length

    const inserted = await db
      .insert(exerciseInstances)
      .values({
        workoutId: input.workoutId,
        exerciseId: input.exerciseId,
        order: nextOrder,
        notes: input.notes ?? null,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to add exercise instance')
    }
    return created
  },

  async deleteExerciseInstance(id: string): Promise<boolean> {
    const deleted = await db
      .delete(exerciseInstances)
      .where(eq(exerciseInstances.id, id))
      .returning({ id: exerciseInstances.id })
    return deleted.length > 0
  },

  /**
   * Añade un set a un exercise instance.
   * El order se calcula automáticamente.
   */
  async addSet(input: {
    exerciseInstanceId: string
    type?: 'normal' | 'warmup' | 'dropset' | 'failure'
    weightKg?: number
    reps?: number
    durationSec?: number
    completed?: boolean
    restSec?: number
    notes?: string
  }): Promise<Set> {
    const existing = await db
      .select()
      .from(sets)
      .where(eq(sets.exerciseInstanceId, input.exerciseInstanceId))

    const nextOrder = existing.length

    const inserted = await db
      .insert(sets)
      .values({
        exerciseInstanceId: input.exerciseInstanceId,
        order: nextOrder,
        type: input.type ?? 'normal',
        weightKg: input.weightKg ?? null,
        reps: input.reps ?? null,
        durationSec: input.durationSec ?? null,
        completed: input.completed ?? false,
        restSec: input.restSec ?? null,
        notes: input.notes ?? null,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to add set')
    }
    return created
  },

  async updateSet(input: {
    id: string
    type?: 'normal' | 'warmup' | 'dropset' | 'failure'
    weightKg?: number
    reps?: number
    durationSec?: number
    completed?: boolean
    restSec?: number
    notes?: string
  }): Promise<Set | null> {
    const { id, ...rest } = input
    const patch: Record<string, unknown> = {}
    if (rest.type !== undefined) patch.type = rest.type
    if (rest.weightKg !== undefined) patch.weightKg = rest.weightKg
    if (rest.reps !== undefined) patch.reps = rest.reps
    if (rest.durationSec !== undefined) patch.durationSec = rest.durationSec
    if (rest.completed !== undefined) patch.completed = rest.completed
    if (rest.restSec !== undefined) patch.restSec = rest.restSec
    if (rest.notes !== undefined) patch.notes = rest.notes

    const updated = await db.update(sets).set(patch).where(eq(sets.id, id)).returning()
    return updated[0] ?? null
  },

  async deleteSet(id: string): Promise<boolean> {
    const deleted = await db
      .delete(sets)
      .where(eq(sets.id, id))
      .returning({ id: sets.id })
    return deleted.length > 0
  },

  /**
   * Suma el volumen (weightKg * reps) de todos los sets completados
   * de un workout. Sets sin peso o sin reps no cuentan.
   */
  async calculateTotalVolume(workoutId: string): Promise<number> {
    const allSets = await db
      .select({
        weightKg: sets.weightKg,
        reps: sets.reps,
        completed: sets.completed,
      })
      .from(sets)
      .innerJoin(exerciseInstances, eq(exerciseInstances.id, sets.exerciseInstanceId))
      .where(and(eq(exerciseInstances.workoutId, workoutId), eq(sets.completed, true)))

    let total = 0
    for (const s of allSets) {
      if (s.weightKg !== null && s.reps !== null) {
        total += s.weightKg * s.reps
      }
    }
    return total
  },
  /**
   * Devuelve el último set de un ejercicio del catálogo (en cualquier workout finalizado).
   * Útil para mostrar "última vez: 80kg × 8" al elegir un ejercicio.
   */
  async findLastSetOfExercise(exerciseId: string): Promise<Set | null> {
    const rows = await db
      .select({
        id: sets.id,
        exerciseInstanceId: sets.exerciseInstanceId,
        order: sets.order,
        type: sets.type,
        weightKg: sets.weightKg,
        reps: sets.reps,
        durationSec: sets.durationSec,
        completed: sets.completed,
        restSec: sets.restSec,
        notes: sets.notes,
      })
      .from(sets)
      .innerJoin(exerciseInstances, eq(exerciseInstances.id, sets.exerciseInstanceId))
      .innerJoin(workouts, eq(workouts.id, exerciseInstances.workoutId))
      .where(
        and(
          eq(exerciseInstances.exerciseId, exerciseId),
          eq(workouts.status, 'finished'),
          eq(sets.completed, true),
        ),
      )
      .orderBy(desc(workouts.startedAt))
      .limit(1)

    return rows[0] ?? null
  },

  /**
   * Devuelve el "PR" (mejor set) de un ejercicio.
   * Definición: el set completado con mayor weightKg × reps de un workout finalizado.
   */
  async findPrOfExercise(exerciseId: string): Promise<Set | null> {
    const rows = await db
      .select({
        id: sets.id,
        exerciseInstanceId: sets.exerciseInstanceId,
        order: sets.order,
        type: sets.type,
        weightKg: sets.weightKg,
        reps: sets.reps,
        durationSec: sets.durationSec,
        completed: sets.completed,
        restSec: sets.restSec,
        notes: sets.notes,
      })
      .from(sets)
      .innerJoin(exerciseInstances, eq(exerciseInstances.id, sets.exerciseInstanceId))
      .innerJoin(workouts, eq(workouts.id, exerciseInstances.workoutId))
      .where(
        and(
          eq(exerciseInstances.exerciseId, exerciseId),
          eq(workouts.status, 'finished'),
          eq(sets.completed, true),
        ),
      )

    let best: typeof rows[number] | null = null
    let bestVolume = -1
    for (const s of rows) {
      if (s.weightKg !== null && s.reps !== null) {
        const volume = s.weightKg * s.reps
        if (volume > bestVolume) {
          bestVolume = volume
          best = s
        }
      }
    }

    return best
  },
}
