import { eq } from 'drizzle-orm'
import { db } from '../../infrastructure/db'
import { profile, type Profile } from '../../../drizzle/schema'

const PROFILE_ID = 'profile-singleton'

/**
 * Repositorio del módulo system.
 *
 * Como solo hay UN usuario, el perfil es un singleton con id fijo.
 * Las operaciones siempre actúan sobre PROFILE_ID.
 */
export const systemRepository = {
  /**
   * Devuelve el perfil. Si no existe, devuelve null.
   */
  async getProfile(): Promise<Profile | null> {
    const rows = await db.select().from(profile).where(eq(profile.id, PROFILE_ID)).limit(1)
    return rows[0] ?? null
  },

  /**
   * Crea el perfil singleton con valores por defecto.
   * Solo se llama una vez (al primer arranque).
   */
  async createDefaultProfile(name: string): Promise<Profile> {
    const inserted = await db
      .insert(profile)
      .values({
        id: PROFILE_ID,
        name,
      })
      .returning()

    const created = inserted[0]
    if (!created) {
      throw new Error('Failed to create default profile')
    }
    return created
  },

  /**
   * Actualiza el perfil. Solo los campos que vienen en el patch.
   */
  async updateProfile(patch: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<Profile> {
    const updated = await db
      .update(profile)
      .set({
        ...patch,
        updatedAt: new Date(),
      })
      .where(eq(profile.id, PROFILE_ID))
      .returning()

    const result = updated[0]
    if (!result) {
      throw new Error('Profile not found')
    }
    return result
  },
}
