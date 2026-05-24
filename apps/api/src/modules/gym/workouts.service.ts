import {
  LogWorkoutSchema,
  StartWorkoutSchema,
  FinishWorkoutSchema,
  NewExerciseInstanceSchema,
  NewSetSchema,
  UpdateSetSchema,
  type LogWorkoutInput,
  type Workout,
  type WorkoutDetail,
  type ExerciseInstance,
  type Set,
  type StartWorkoutInput,
  type FinishWorkoutInput,
  type NewExerciseInstanceInput,
  type NewSetInput,
  type UpdateSetInput,
} from '@vitaroot/shared'
import { workoutsRepository } from './workouts.repository'
import { ApiError, NotFoundError } from '../../lib/errors'

/**
 * Servicio del módulo workouts.
 */
export const workoutsService = {
  /**
   * Inicia un nuevo workout. Falla si ya hay uno activo.
   */
  async start(input: StartWorkoutInput): Promise<Workout> {
    const existing = await workoutsRepository.findActive()
    if (existing) {
      throw new ApiError(409, 'WORKOUT_ALREADY_ACTIVE', 'Ya tienes un workout activo. Termínalo o descártalo antes de empezar otro.')
    }

    const parsed = StartWorkoutSchema.parse(input)
    return workoutsRepository.startWorkout({ name: parsed.name })
  },

  /**
   * Devuelve el workout activo con sus ejercicios y sets, o null si no hay.
   */
  async getActive(): Promise<WorkoutDetail | null> {
    const w = await workoutsRepository.findActive()
    if (!w) return null
    return mapWithRelations(w)
  },

  /**
   * Devuelve un workout por id (con relaciones).
   */
  async getById(id: string): Promise<WorkoutDetail> {
    const workout = await workoutsRepository.findByIdWithRelations(id)
    if (!workout) {
      throw new NotFoundError('Workout')
    }
    return mapWithRelations(workout)
  },

  /**
   * Lista los workouts finalizados, más recientes primero.
   */
  async listFinished(limit = 30): Promise<Workout[]> {
    return workoutsRepository.listFinished(limit)
  },

  /**
   * Finaliza el workout. Calcula volumen total y duración.
   */
  async finish(id: string, input: FinishWorkoutInput): Promise<Workout> {
    const workout = await workoutsRepository.findByIdWithRelations(id)
    if (!workout) {
      throw new NotFoundError('Workout')
    }
    if (workout.status !== 'active') {
      throw new ApiError(409, 'WORKOUT_NOT_ACTIVE', 'El workout no está activo')
    }

    const parsed = FinishWorkoutSchema.parse(input)
    const totalVolumeKg = await workoutsRepository.calculateTotalVolume(id)
    const durationMin = Math.max(1, Math.round((Date.now() - workout.startedAt.getTime()) / 60000))

    return workoutsRepository.finishWorkout({
      id,
      notes: parsed.notes,
      totalVolumeKg,
      durationMin,
    })
  },

  /**
   * Descarta el workout (status='discarded').
   */
  async discard(id: string): Promise<void> {
    const ok = await workoutsRepository.discardWorkout(id)
    if (!ok) {
      throw new NotFoundError('Workout')
    }
  },

  // ── EXERCISE INSTANCES ──────────────────────────────────────

  async addExercise(workoutId: string, input: NewExerciseInstanceInput): Promise<ExerciseInstance> {
    const workout = await workoutsRepository.findByIdWithRelations(workoutId)
    if (!workout) {
      throw new NotFoundError('Workout')
    }
    if (workout.status !== 'active') {
      throw new ApiError(409, 'WORKOUT_NOT_ACTIVE', 'Solo puedes añadir ejercicios a un workout activo')
    }

    const parsed = NewExerciseInstanceSchema.parse(input)
    return workoutsRepository.addExerciseInstance({
      workoutId,
      exerciseId: parsed.exerciseId,
      notes: parsed.notes,
    })
  },

  async removeExercise(id: string): Promise<void> {
    const ok = await workoutsRepository.deleteExerciseInstance(id)
    if (!ok) {
      throw new NotFoundError('Exercise instance')
    }
  },

  // ── SETS ───────────────────────────────────────────────────

  async addSet(input: NewSetInput): Promise<Set> {
    const parsed = NewSetSchema.parse(input)
    return workoutsRepository.addSet({
      exerciseInstanceId: parsed.exerciseInstanceId,
      type: parsed.type,
      weightKg: parsed.weightKg,
      reps: parsed.reps,
      durationSec: parsed.durationSec,
      completed: parsed.completed,
      restSec: parsed.restSec,
      notes: parsed.notes,
    })
  },

  async updateSet(id: string, input: UpdateSetInput): Promise<Set> {
    const parsed = UpdateSetSchema.parse(input)
    const updated = await workoutsRepository.updateSet({
      id,
      type: parsed.type,
      weightKg: parsed.weightKg,
      reps: parsed.reps,
      durationSec: parsed.durationSec,
      completed: parsed.completed,
      restSec: parsed.restSec,
      notes: parsed.notes,
    })
    if (!updated) {
      throw new NotFoundError('Set')
    }
    return updated
  },

  async deleteSet(id: string): Promise<void> {
    const ok = await workoutsRepository.deleteSet(id)
    if (!ok) {
      throw new NotFoundError('Set')
    }
  },
  /**
   * Registra un workout completo a posteriori, en una sola operación.
   * Crea el workout en estado 'finished' con todos sus ejercicios y sets.
   * Todos los sets se marcan como completed=true automáticamente.
   */
  async logCompleted(input: LogWorkoutInput): Promise<Workout> {
    const parsed = LogWorkoutSchema.parse(input)

    // 1) Crea el workout directamente en estado 'finished'
    const workoutId = await workoutsRepository.createCompletedWorkout({
      startedAt: parsed.startedAt,
      durationMin: parsed.durationMin ?? null,
      name: parsed.name ?? null,
      notes: parsed.notes ?? null,
    })

    // 2) Crea cada ejercicio con sus sets
    for (let i = 0; i < parsed.exercises.length; i++) {
      const ex = parsed.exercises[i]
      if (!ex) continue

      const instance = await workoutsRepository.addExerciseInstance({
        workoutId,
        exerciseId: ex.exerciseId,
        notes: ex.notes,
      })

      for (const s of ex.sets) {
        await workoutsRepository.addSet({
          exerciseInstanceId: instance.id,
          type: s.type,
          weightKg: s.weightKg,
          reps: s.reps,
          durationSec: s.durationSec,
          completed: true,
          restSec: s.restSec,
          notes: s.notes,
        })
      }
    }

    // 3) Calcula el volumen total y actualiza el workout
    const totalVolumeKg = await workoutsRepository.calculateTotalVolume(workoutId)
    return workoutsRepository.updateWorkoutMeta({
      id: workoutId,
      totalVolumeKg,
    })
  },
}

/**
 * Convierte el tipo del repository (que tiene "exercise" como objeto del catálogo)
 * al tipo público WorkoutDetail (igual estructura).
 */
function mapWithRelations(
  w: Awaited<ReturnType<typeof workoutsRepository.findByIdWithRelations>> & object,
): WorkoutDetail {
  return {
    id: w.id,
    startedAt: w.startedAt,
    finishedAt: w.finishedAt,
    durationMin: w.durationMin,
    status: w.status,
    name: w.name,
    notes: w.notes,
    totalVolumeKg: w.totalVolumeKg,
    createdAt: w.createdAt,
    exercises: w.exercises.map((inst) => ({
      id: inst.id,
      workoutId: inst.workoutId,
      exerciseId: inst.exerciseId,
      order: inst.order,
      notes: inst.notes,
      exercise: {
        id: inst.exercise.id,
        name: inst.exercise.name,
        category: inst.exercise.category,
        primaryMuscle: inst.exercise.primaryMuscle as WorkoutDetail['exercises'][0]['exercise']['primaryMuscle'],
        secondaryMuscles: inst.exercise.secondaryMuscles as WorkoutDetail['exercises'][0]['exercise']['secondaryMuscles'],
        equipment: inst.exercise.equipment,
        notes: inst.exercise.notes,
        isCustom: inst.exercise.isCustom,
        createdAt: inst.exercise.createdAt,
      },
      sets: inst.sets.map((s) => ({
        id: s.id,
        exerciseInstanceId: s.exerciseInstanceId,
        order: s.order,
        type: s.type,
        weightKg: s.weightKg,
        reps: s.reps,
        durationSec: s.durationSec,
        completed: s.completed,
        restSec: s.restSec,
        notes: s.notes,
      })),
    })),
  }
}
