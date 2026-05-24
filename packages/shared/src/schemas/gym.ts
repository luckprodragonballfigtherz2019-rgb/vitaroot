import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════
// EXERCISE (catálogo)
// ═══════════════════════════════════════════════════════════════

export const ExerciseCategorySchema = z.enum([
  'compound',
  'isolation',
  'cardio',
  'bodyweight',
  'stretching',
])
export type ExerciseCategory = z.output<typeof ExerciseCategorySchema>

export const MuscleGroupSchema = z.enum([
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'core',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'fullbody',
])
export type MuscleGroup = z.output<typeof MuscleGroupSchema>

export const ExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(80),
  category: ExerciseCategorySchema,
  primaryMuscle: MuscleGroupSchema,
  secondaryMuscles: z.array(MuscleGroupSchema),
  equipment: z.string().max(40).nullable(),
  notes: z.string().max(500).nullable(),
  isCustom: z.boolean(),
  createdAt: z.coerce.date(),
})

export const NewExerciseSchema = z.object({
  name: z.string().min(1).max(80),
  category: ExerciseCategorySchema,
  primaryMuscle: MuscleGroupSchema,
  secondaryMuscles: z.array(MuscleGroupSchema).default([]),
  equipment: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
})

export type Exercise = z.output<typeof ExerciseSchema>
export type NewExerciseInput = z.input<typeof NewExerciseSchema>

// ═══════════════════════════════════════════════════════════════
// SET
// ═══════════════════════════════════════════════════════════════

export const SetTypeSchema = z.enum(['normal', 'warmup', 'dropset', 'failure'])
export type SetType = z.output<typeof SetTypeSchema>

export const SetSchema = z.object({
  id: z.string().uuid(),
  exerciseInstanceId: z.string().uuid(),
  order: z.number().int().nonnegative(),
  type: SetTypeSchema.default('normal'),
  weightKg: z.number().nonnegative().lt(1000).nullable(),
  reps: z.number().int().nonnegative().nullable(),
  durationSec: z.number().int().nonnegative().nullable(),
  distanceM: z.number().int().nonnegative().nullable(),
  completed: z.boolean(),
  restSec: z.number().int().nonnegative().nullable(),
  notes: z.string().max(200).nullable(),
})

export const NewSetSchema = z.object({
  exerciseInstanceId: z.string().uuid(),
  type: SetTypeSchema.default('normal'),
  weightKg: z.number().nonnegative().lt(1000).optional(),
  reps: z.number().int().nonnegative().optional(),
  durationSec: z.number().int().nonnegative().optional(),
  distanceM: z.number().int().nonnegative().optional(),
  completed: z.boolean().default(false),
  restSec: z.number().int().nonnegative().optional(),
  notes: z.string().max(200).optional(),
})

export const UpdateSetSchema = NewSetSchema.partial().omit({
  exerciseInstanceId: true,
})

export type Set = z.output<typeof SetSchema>
export type NewSetInput = z.input<typeof NewSetSchema>
export type UpdateSetInput = z.input<typeof UpdateSetSchema>

// ═══════════════════════════════════════════════════════════════
// EXERCISE INSTANCE
// ═══════════════════════════════════════════════════════════════

export const ExerciseInstanceSchema = z.object({
  id: z.string().uuid(),
  workoutId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  order: z.number().int().nonnegative(),
  notes: z.string().max(500).nullable(),
})

export const ExerciseInstanceDetailSchema = ExerciseInstanceSchema.extend({
  exercise: ExerciseSchema,
  sets: z.array(SetSchema),
})

export const NewExerciseInstanceSchema = z.object({
  exerciseId: z.string().uuid(),
  notes: z.string().max(500).optional(),
})

export type ExerciseInstance = z.output<typeof ExerciseInstanceSchema>
export type ExerciseInstanceDetail = z.output<typeof ExerciseInstanceDetailSchema>
export type NewExerciseInstanceInput = z.input<typeof NewExerciseInstanceSchema>

// ═══════════════════════════════════════════════════════════════
// WORKOUT
// ═══════════════════════════════════════════════════════════════

export const WorkoutStatusSchema = z.enum(['active', 'finished', 'discarded'])
export type WorkoutStatus = z.output<typeof WorkoutStatusSchema>

export const WorkoutSchema = z.object({
  id: z.string().uuid(),
  startedAt: z.coerce.date(),
  finishedAt: z.coerce.date().nullable(),
  durationMin: z.number().int().nonnegative().nullable(),
  status: WorkoutStatusSchema,
  name: z.string().max(100).nullable(),
  notes: z.string().max(1000).nullable(),
  totalVolumeKg: z.number().nonnegative().nullable(),
  createdAt: z.coerce.date(),
})

export const WorkoutDetailSchema = WorkoutSchema.extend({
  exercises: z.array(ExerciseInstanceDetailSchema),
})

export const StartWorkoutSchema = z.object({
  name: z.string().max(100).optional(),
})

export const FinishWorkoutSchema = z.object({
  notes: z.string().max(1000).optional(),
})

export type Workout = z.output<typeof WorkoutSchema>
export type WorkoutDetail = z.output<typeof WorkoutDetailSchema>
export type StartWorkoutInput = z.input<typeof StartWorkoutSchema>
export type FinishWorkoutInput = z.input<typeof FinishWorkoutSchema>

// ═══════════════════════════════════════════════════════════════
// LOG WORKOUT (registrar workout completo a posteriori)
// ═══════════════════════════════════════════════════════════════

export const LogWorkoutSetSchema = z.object({
  type: SetTypeSchema.default('normal'),
  weightKg: z.number().nonnegative().lt(1000).optional(),
  reps: z.number().int().nonnegative().optional(),
  durationSec: z.number().int().nonnegative().optional(),
  distanceM: z.number().int().nonnegative().optional(),
  restSec: z.number().int().nonnegative().optional(),
  notes: z.string().max(200).optional(),
})

export const LogWorkoutExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  notes: z.string().max(500).optional(),
  sets: z.array(LogWorkoutSetSchema).min(1, 'Cada ejercicio debe tener al menos 1 set'),
})

export const LogWorkoutSchema = z.object({
  startedAt: z.coerce.date(),
  durationMin: z.number().int().positive().optional(),
  name: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  exercises: z.array(LogWorkoutExerciseSchema).min(1, 'Añade al menos 1 ejercicio'),
})

export type LogWorkoutSetInput = z.input<typeof LogWorkoutSetSchema>
export type LogWorkoutExerciseInput = z.input<typeof LogWorkoutExerciseSchema>
export type LogWorkoutInput = z.input<typeof LogWorkoutSchema>
