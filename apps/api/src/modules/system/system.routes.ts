import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { ProfileSchema, UpdateProfileSchema } from '@vitaroot/shared'
import { systemService } from './system.service'

/**
 * Endpoints del módulo system.
 *
 * Prefijo aplicado en app.ts: /api/v1/system
 */
export const systemRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // GET /api/v1/system/profile
  fastify.get(
    '/profile',
    {
      schema: {
        response: { 200: ProfileSchema },
      },
    },
    async () => {
      return systemService.getOrCreateProfile()
    },
  )

  // PATCH /api/v1/system/profile
  fastify.patch(
    '/profile',
    {
      schema: {
        body: UpdateProfileSchema,
        response: { 200: ProfileSchema },
      },
    },
    async (request) => {
      return systemService.updateProfile(request.body)
    },
  )
}
