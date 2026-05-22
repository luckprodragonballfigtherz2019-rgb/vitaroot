import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ═══════════════════════════════════════════════════════════════
// PROFILE (singleton)
// ═══════════════════════════════════════════════════════════════

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  birthdate: integer('birthdate', { mode: 'timestamp' }),
  heightCm: real('height_cm'),
  units: text('units', { enum: ['metric', 'imperial'] })
    .notNull()
    .default('metric'),
  macroTargets: text('macro_targets', { mode: 'json' }).$type<{
    kcal?: number
    proteinG?: number
    carbsG?: number
    fatG?: number
  }>(),
  waterSettings: text('water_settings', { mode: 'json' })
    .$type<{
      glassSizeMl: number
      dailyGoalMl: number
    }>()
    .notNull()
    .default(sql`'{"glassSizeMl":250,"dailyGoalMl":2000}'`),
  backupSettings: text('backup_settings', { mode: 'json' })
    .$type<{
      enabled: boolean
      intervalDays: number
      keepLastN: number
    }>()
    .notNull()
    .default(sql`'{"enabled":true,"intervalDays":7,"keepLastN":10}'`),
  theme: text('theme', { enum: ['auto', 'light', 'dark'] })
    .notNull()
    .default('auto'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert

// ═══════════════════════════════════════════════════════════════
// HEALTH — water, sleep, weight, mood
// ═══════════════════════════════════════════════════════════════

export const waterLogs = sqliteTable(
  'water_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
    amountMl: integer('amount_ml').notNull(),
    source: text('source', { enum: ['manual', 'wearable', 'import'] })
      .notNull()
      .default('manual'),
  },
  (t) => ({
    occurredIdx: index('idx_water_occurred').on(t.occurredAt),
  }),
)

export const sleepLogs = sqliteTable(
  'sleep_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    bedtime: integer('bedtime', { mode: 'timestamp' }).notNull(),
    wakeTime: integer('wake_time', { mode: 'timestamp' }).notNull(),
    durationMin: integer('duration_min').notNull(),
    quality: integer('quality'),
    notes: text('notes'),
    meta: text('meta', { mode: 'json' }).$type<{
      deepSleepMin?: number
      remSleepMin?: number
      awakenings?: number
    }>(),
    source: text('source', { enum: ['manual', 'wearable', 'import'] })
      .notNull()
      .default('manual'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    bedtimeIdx: index('idx_sleep_bedtime').on(t.bedtime),
    bedtimeUnique: uniqueIndex('idx_sleep_bedtime_unique').on(t.bedtime),
  }),
)

export const weightLogs = sqliteTable(
  'weight_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
    weightKg: real('weight_kg').notNull(),
    notes: text('notes'),
    meta: text('meta', { mode: 'json' }).$type<{
      fastedState?: boolean
      afterTraining?: boolean
      bodyFatPct?: number
    }>(),
    source: text('source', { enum: ['manual', 'wearable', 'import'] })
      .notNull()
      .default('manual'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    occurredIdx: index('idx_weight_occurred').on(t.occurredAt),
  }),
)

export const moodLogs = sqliteTable(
  'mood_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    date: text('date').notNull(),
    score: integer('score').notNull(),
    notes: text('notes'),
    meta: text('meta', { mode: 'json' }).$type<{
      energy?: number
      stress?: number
    }>(),
    source: text('source', { enum: ['manual', 'wearable', 'import'] })
      .notNull()
      .default('manual'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    dateUnique: uniqueIndex('idx_mood_date_unique').on(t.date),
  }),
)

export type WaterLog = typeof waterLogs.$inferSelect
export type NewWaterLog = typeof waterLogs.$inferInsert
export type SleepLog = typeof sleepLogs.$inferSelect
export type NewSleepLog = typeof sleepLogs.$inferInsert
export type WeightLog = typeof weightLogs.$inferSelect
export type NewWeightLog = typeof weightLogs.$inferInsert
export type MoodLog = typeof moodLogs.$inferSelect
export type NewMoodLog = typeof moodLogs.$inferInsert

// ═══════════════════════════════════════════════════════════════
// GYM — exercises, workouts, exercise_instances, sets
// ═══════════════════════════════════════════════════════════════

export const exercises = sqliteTable(
  'exercises',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    category: text('category', {
      enum: ['compound', 'isolation', 'cardio', 'bodyweight', 'stretching'],
    }).notNull(),
    primaryMuscle: text('primary_muscle').notNull(),
    secondaryMuscles: text('secondary_muscles', { mode: 'json' })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    equipment: text('equipment'),
    notes: text('notes'),
    isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    nameUnique: uniqueIndex('idx_exercises_name_unique').on(t.name),
    primaryMuscleIdx: index('idx_exercises_primary_muscle').on(t.primaryMuscle),
  }),
)

export const workouts = sqliteTable(
  'workouts',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    finishedAt: integer('finished_at', { mode: 'timestamp' }),
    durationMin: integer('duration_min'),
    status: text('status', { enum: ['active', 'finished', 'discarded'] })
      .notNull()
      .default('active'),
    name: text('name'),
    notes: text('notes'),
    totalVolumeKg: real('total_volume_kg'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    startedAtIdx: index('idx_workouts_started_at').on(t.startedAt),
    statusIdx: index('idx_workouts_status').on(t.status),
  }),
)

export const exerciseInstances = sqliteTable(
  'exercise_instances',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    workoutId: text('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(),
    notes: text('notes'),
  },
  (t) => ({
    workoutIdx: index('idx_exinstances_workout').on(t.workoutId),
  }),
)

export const sets = sqliteTable(
  'sets',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    exerciseInstanceId: text('exercise_instance_id')
      .notNull()
      .references(() => exerciseInstances.id, { onDelete: 'cascade' }),
    order: integer('order').notNull(),
    type: text('type', { enum: ['normal', 'warmup', 'dropset', 'failure'] })
      .notNull()
      .default('normal'),
    weightKg: real('weight_kg'),
    reps: integer('reps'),
    durationSec: integer('duration_sec'),
    completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
    restSec: integer('rest_sec'),
    notes: text('notes'),
  },
  (t) => ({
    exinstanceIdx: index('idx_sets_exinstance').on(t.exerciseInstanceId),
  }),
)

export type Exercise = typeof exercises.$inferSelect
export type NewExercise = typeof exercises.$inferInsert
export type Workout = typeof workouts.$inferSelect
export type NewWorkout = typeof workouts.$inferInsert
export type ExerciseInstance = typeof exerciseInstances.$inferSelect
export type NewExerciseInstance = typeof exerciseInstances.$inferInsert
export type Set = typeof sets.$inferSelect
export type NewSet = typeof sets.$inferInsert
