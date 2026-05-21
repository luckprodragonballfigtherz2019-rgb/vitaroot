import { z } from 'zod'
import { request } from './client'

const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  env: z.enum(['development', 'production', 'test']),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>

/**
 * Llama al endpoint /health del backend.
 * Valida la respuesta con Zod.
 */
export async function getHealth(): Promise<HealthResponse> {
  return request('/health', HealthResponseSchema, { method: 'GET' })
}
