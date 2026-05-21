import { z } from 'zod'
import { ProfileSchema, UpdateProfileSchema, type Profile } from '@vitaroot/shared'
import { request } from './client'

const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  env: z.enum(['development', 'production', 'test']),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>

/**
 * Tipo del input para actualizar perfil.
 * z.input<> usa los tipos de entrada (con defaults opcionales).
 */
export type UpdateProfileInput = z.input<typeof UpdateProfileSchema>

/**
 * Llama al endpoint /health del backend.
 */
export async function getHealth(): Promise<HealthResponse> {
  return request('/health', HealthResponseSchema, { method: 'GET' })
}

/**
 * Obtiene el perfil del usuario.
 * Si no existe, el backend lo autocrea.
 */
export async function getProfile(): Promise<Profile> {
  return request('/system/profile', ProfileSchema, { method: 'GET' })
}

/**
 * Actualiza el perfil con los campos del patch.
 */
export async function updateProfile(patch: UpdateProfileInput): Promise<Profile> {
  // Validar input antes de enviarlo (defensa en profundidad)
  const validated = UpdateProfileSchema.parse(patch)

  return request('/system/profile', ProfileSchema, {
    method: 'PATCH',
    body: JSON.stringify(validated),
  })
}
