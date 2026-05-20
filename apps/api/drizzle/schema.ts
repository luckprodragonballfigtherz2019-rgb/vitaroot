import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * Tabla PROFILE (singleton).
 *
 * Almacena el perfil del único usuario de la app.
 * Solo habrá UNA fila en esta tabla (id fijo "profile-singleton").
 *
 * Modelo de datos completo en docs/05-modelo-de-datos.md §4.1.
 */
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

// Tipos derivados para usar en el código
export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert