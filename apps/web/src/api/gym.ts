import { z } from 'zod'
import {
  ExerciseSchema,
  NewExerciseSchema,
  MuscleGroupSchema,
  WorkoutSchema,
  WorkoutDetailSchema,
  ExerciseInstanceSchema,
  SetSchema,
  StartWorkoutSchema,
  FinishWorkoutSchema,
  NewExerciseInstanceSchema,
  NewSetSchema,
  UpdateSetSchema,
  LogWorkoutSchema,
  type Exercise,
  type Workout,
  type WorkoutDetail,
  type ExerciseInstance,
  type Set,
} from '@vitaroot/shared'
import { request } from './client'

// ═══════════════════════════════════════════════════════════════
// Tipos de input
// ═══════════════════════════════════════════════════════════════

export type NewExerciseInput = z.input<typeof NewExerciseSchema>
export type StartWorkoutInput = z.input<typeof StartWorkoutSchema>
export type FinishWorkoutInput = z.input<typeof FinishWorkoutSchema>
export type NewExerciseInstanceInput = z.input<typeof NewExerciseInstanceSchema>
export type NewSetInput = z.input<typeof NewSetSchema>
export type UpdateSetInput = z.input<typeof UpdateSetSchema>
export type LogWorkoutInput = z.input<typeof LogWorkoutSchema>

export type MuscleGroup = z.input<typeof MuscleGroupSchema>

// ═══════════════════════════════════════════════════════════════
// EXERCISES (catálogo)
// ═══════════════════════════════════════════════════════════════

export async function listExercises(filters?: {
  search?: string
  muscle?: MuscleGroup
}): Promise<Exercise[]> {
  const qs = new URLSearchParams()
  if (filters?.search) qs.set('search', filters.search)
  if (filters?.muscle) qs.set('muscle', filters.muscle)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  return request(`/gym/exercises${suffix}`, z.array(ExerciseSchema), { method: 'GET' })
}

export async function getExercise(id: string): Promise<Exercise> {
  return request(`/gym/exercises/${id}`, ExerciseSchema, { method: 'GET' })
}

export async function getLastSet(exerciseId: string): Promise<Set | null> {
  return request(`/gym/exercises/${exerciseId}/last-set`, z.union([SetSchema, z.null()]), {
    method: 'GET',
  })
}

export async function getPr(exerciseId: string): Promise<Set | null> {
  return request(`/gym/exercises/${exerciseId}/pr`, z.union([SetSchema, z.null()]), {
    method: 'GET',
  })
}

export async function createCustomExercise(input: NewExerciseInput): Promise<Exercise> {
  const validated = NewExerciseSchema.parse(input)
  return request('/gym/exercises', ExerciseSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

// ═══════════════════════════════════════════════════════════════
// WORKOUTS
// ═══════════════════════════════════════════════════════════════

export async function startWorkout(input: StartWorkoutInput): Promise<Workout> {
  const validated = StartWorkoutSchema.parse(input)
  return request('/gym/workouts', WorkoutSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

export async function getActiveWorkout(): Promise<WorkoutDetail | null> {
  return request(
    '/gym/workouts/active',
    z.union([WorkoutDetailSchema, z.null()]),
    { method: 'GET' },
  )
}

export async function getWorkout(id: string): Promise<WorkoutDetail> {
  return request(`/gym/workouts/${id}`, WorkoutDetailSchema, { method: 'GET' })
}

export async function listWorkouts(limit = 30): Promise<Workout[]> {
  return request(`/gym/workouts?limit=${limit}`, z.array(WorkoutSchema), { method: 'GET' })
}

export async function finishWorkout(id: string, input: FinishWorkoutInput): Promise<Workout> {
  const validated = FinishWorkoutSchema.parse(input)
  return request(`/gym/workouts/${id}/finish`, WorkoutSchema, {
    method: 'PATCH',
    body: JSON.stringify(validated),
  })
}

export async function discardWorkout(id: string): Promise<void> {
  await request(`/gym/workouts/${id}`, undefined, { method: 'DELETE' })
}

// ═══════════════════════════════════════════════════════════════
// EXERCISE INSTANCES (dentro del workout activo)
// ═══════════════════════════════════════════════════════════════

export async function addExerciseToWorkout(
  workoutId: string,
  input: NewExerciseInstanceInput,
): Promise<ExerciseInstance> {
  const validated = NewExerciseInstanceSchema.parse(input)
  return request(
    `/gym/workouts/${workoutId}/exercises`,
    ExerciseInstanceSchema,
    {
      method: 'POST',
      body: JSON.stringify(validated),
    },
  )
}

export async function removeExerciseFromWorkout(exerciseInstanceId: string): Promise<void> {
  await request(`/gym/workouts/exercise-instances/${exerciseInstanceId}`, undefined, {
    method: 'DELETE',
  })
}

// ═══════════════════════════════════════════════════════════════
// SETS
// ═══════════════════════════════════════════════════════════════

export async function addSet(input: NewSetInput): Promise<Set> {
  const validated = NewSetSchema.parse(input)
  return request('/gym/workouts/sets', SetSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}

export async function updateSet(id: string, input: UpdateSetInput): Promise<Set> {
  const validated = UpdateSetSchema.parse(input)
  return request(`/gym/workouts/sets/${id}`, SetSchema, {
    method: 'PATCH',
    body: JSON.stringify(validated),
  })
}

export async function deleteSet(id: string): Promise<void> {
  await request(`/gym/workouts/sets/${id}`, undefined, { method: 'DELETE' })
}
// ═══════════════════════════════════════════════════════════════
// LOG WORKOUT (registrar a posteriori)
// ═══════════════════════════════════════════════════════════════

export async function logWorkout(input: LogWorkoutInput): Promise<Workout> {
  const validated = LogWorkoutSchema.parse(input)
  return request('/gym/workouts/log', WorkoutSchema, {
    method: 'POST',
    body: JSON.stringify(validated),
  })
}
