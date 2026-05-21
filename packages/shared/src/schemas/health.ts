import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════
// Common
// ═══════════════════════════════════════════════════════════════

export const DataSourceSchema = z.enum(['manual', 'wearable', 'import'])
export type DataSource = z.infer<typeof DataSourceSchema>

// ═══════════════════════════════════════════════════════════════
// WATER
// ═══════════════════════════════════════════════════════════════

export const WaterLogSchema = z.object({
  id: z.string().uuid(),
  occurredAt: z.coerce.date(),
  amountMl: z.number().int().positive().max(5000),
  source: DataSourceSchema.default('manual'),
})

export const NewWaterLogSchema = WaterLogSchema.omit({
  id: true,
  source: true,
}).extend({
  occurredAt: z.coerce.date().optional(),
})

export type WaterLog = z.infer<typeof WaterLogSchema>
export type NewWaterLogInput = z.infer<typeof NewWaterLogSchema>

// ═══════════════════════════════════════════════════════════════
// SLEEP
// ═══════════════════════════════════════════════════════════════

export const SleepMetaSchema = z.object({
  deepSleepMin: z.number().int().nonnegative().optional(),
  remSleepMin: z.number().int().nonnegative().optional(),
  awakenings: z.number().int().nonnegative().optional(),
})

export const SleepLogSchema = z.object({
  id: z.string().uuid(),
  bedtime: z.coerce.date(),
  wakeTime: z.coerce.date(),
  durationMin: z.number().int().positive(),
  quality: z.number().int().min(1).max(5).nullable(),
  notes: z.string().max(500).nullable(),
  meta: SleepMetaSchema.nullable(),
  source: DataSourceSchema.default('manual'),
  createdAt: z.coerce.date(),
})

export const NewSleepLogSchema = z
  .object({
    bedtime: z.coerce.date(),
    wakeTime: z.coerce.date(),
    quality: z.number().int().min(1).max(5).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.wakeTime > data.bedtime, {
    message: 'La hora de despertar debe ser posterior a la de acostarse',
    path: ['wakeTime'],
  })

export type SleepMeta = z.infer<typeof SleepMetaSchema>
export type SleepLog = z.infer<typeof SleepLogSchema>
export type NewSleepLogInput = z.infer<typeof NewSleepLogSchema>

// ═══════════════════════════════════════════════════════════════
// WEIGHT
// ═══════════════════════════════════════════════════════════════

export const WeightMetaSchema = z.object({
  fastedState: z.boolean().optional(),
  afterTraining: z.boolean().optional(),
  bodyFatPct: z.number().min(0).max(100).optional(),
})

export const WeightLogSchema = z.object({
  id: z.string().uuid(),
  occurredAt: z.coerce.date(),
  weightKg: z.number().positive().lt(1000),
  notes: z.string().max(500).nullable(),
  meta: WeightMetaSchema.nullable(),
  source: DataSourceSchema.default('manual'),
  createdAt: z.coerce.date(),
})

export const NewWeightLogSchema = z.object({
  occurredAt: z.coerce.date().optional(),
  weightKg: z.number().positive().lt(1000),
  notes: z.string().max(500).optional(),
  meta: WeightMetaSchema.optional(),
})

export type WeightMeta = z.infer<typeof WeightMetaSchema>
export type WeightLog = z.infer<typeof WeightLogSchema>
export type NewWeightLogInput = z.infer<typeof NewWeightLogSchema>

// ═══════════════════════════════════════════════════════════════
// MOOD
// ═══════════════════════════════════════════════════════════════

export const MoodMetaSchema = z.object({
  energy: z.number().int().min(1).max(5).optional(),
  stress: z.number().int().min(1).max(5).optional(),
})

export const MoodLogSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
  score: z.number().int().min(1).max(5),
  notes: z.string().max(140).nullable(),
  meta: MoodMetaSchema.nullable(),
  source: DataSourceSchema.default('manual'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const NewMoodLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
  score: z.number().int().min(1).max(5),
  notes: z.string().max(140).optional(),
  meta: MoodMetaSchema.optional(),
})

export type MoodMeta = z.infer<typeof MoodMetaSchema>
export type MoodLog = z.infer<typeof MoodLogSchema>
export type NewMoodLogInput = z.infer<typeof NewMoodLogSchema>
