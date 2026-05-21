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
