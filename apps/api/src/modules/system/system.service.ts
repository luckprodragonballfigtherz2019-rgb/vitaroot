import { UpdateProfileSchema, type Profile, type UpdateProfileInput } from '@vitaroot/shared'
import { systemRepository } from './system.repository'

const DEFAULT_NAME = 'Pablo'

/**
 * Servicio del módulo system.
 *
 * Encapsula la lógica de aplicación: autocreación del perfil al primer
 * arranque, conversión de tipos entre BD (Drizzle) y API (Zod).
 */
export const systemService = {
  /**
   * Obtiene el perfil. Si es la primera vez (no existe), lo crea con
   * valores por defecto.
   */
  async getOrCreateProfile(): Promise<Profile> {
    let dbProfile = await systemRepository.getProfile()

    if (!dbProfile) {
      dbProfile = await systemRepository.createDefaultProfile(DEFAULT_NAME)
    }

    return mapDbToApi(dbProfile)
  },

  /**
   * Actualiza el perfil con los campos enviados en el patch.
   * Parsea el input para aplicar los defaults de Zod (campos obligatorios resueltos).
   */
  async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    // Parse aplica los defaults: el output tiene campos resueltos
    const parsed = UpdateProfileSchema.parse(input)

    const updated = await systemRepository.updateProfile(parsed)
    return mapDbToApi(updated)
  },
}

function mapDbToApi(p: NonNullable<Awaited<ReturnType<typeof systemRepository.getProfile>>>): Profile {
  return {
    id: p.id,
    name: p.name,
    birthdate: p.birthdate,
    heightCm: p.heightCm,
    units: p.units,
    macroTargets: p.macroTargets ?? null,
    waterSettings: p.waterSettings,
    backupSettings: p.backupSettings,
    theme: p.theme,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}
