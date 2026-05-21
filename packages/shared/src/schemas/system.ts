import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════
// Schemas para configuración del perfil
// ═══════════════════════════════════════════════════════════════

export const MacroTargetsSchema = z.object({
  kcal: z.number().int().positive().optional(),
  proteinG: z.number().int().nonnegative().optional(),
  carbsG: z.number().int().nonnegative().optional(),
  fatG: z.number().int().nonnegative().optional(),
})

export const WaterSettingsSchema = z.object({
  glassSizeMl: z.number().int().positive().default(250),
  dailyGoalMl: z.number().int().positive().default(2000),
})

export const BackupSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  intervalDays: z.number().int().positive().default(7),
  keepLastN: z.number().int().positive().default(10),
})

// ═══════════════════════════════════════════════════════════════
// Schema del perfil (singleton: solo hay 1 fila)
// ═══════════════════════════════════════════════════════════════

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(60),
  birthdate: z.coerce.date().nullable(),
  heightCm: z.number().positive().lt(300).nullable(),
  units: z.enum(['metric', 'imperial']).default('metric'),
  macroTargets: MacroTargetsSchema.nullable(),
  waterSettings: WaterSettingsSchema,
  backupSettings: BackupSettingsSchema,
  theme: z.enum(['auto', 'light', 'dark']).default('auto'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

// Schema para actualizar el perfil (todos los campos opcionales excepto id)
export const UpdateProfileSchema = ProfileSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Tipos derivados
export type MacroTargets = z.infer<typeof MacroTargetsSchema>
export type WaterSettings = z.infer<typeof WaterSettingsSchema>
export type BackupSettings = z.infer<typeof BackupSettingsSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
