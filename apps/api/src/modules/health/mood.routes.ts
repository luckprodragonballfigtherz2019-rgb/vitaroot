import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NewMoodLogSchema, MoodLogSchema } from '@vitaroot/shared'
import { moodService } from './mood.service'
import { NotFoundError } from '../../lib/errors'

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'Formato debe ser YYYY-MM-DD',
})

/**
 * Endpoints del módulo health/mood.
 * Prefijo aplicado en app.ts: /api/v1/health/mood
 */
export const moodRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // PUT /api/v1/health/mood — upsert por fecha
  // Usamos PUT en lugar de POST porque es idempotente: la misma fecha
  // siempre actualiza el mismo registro.
  fastify.put(
    '/',
    {
      schema: {
        body: NewMoodLogSchema,
        response: { 200: MoodLogSchema },
      },
    },
    async (request) => {
      return moodService.saveLog(request.body)
    },
  )

  // GET /api/v1/health/mood/:date — registro de una fecha concreta
  fastify.get(
    '/:date',
    {
      schema: {
        params: z.object({
          date: DateStringSchema,
        }),
        response: { 200: z.union([MoodLogSchema, z.null()]) },
      },
    },
    async (request) => {
      return moodService.getByDate(request.params.date)
    },
  )

  // GET /api/v1/health/mood?from=...&to=... o ?limit=N
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          from: DateStringSchema.optional(),
          to: DateStringSchema.optional(),
          limit: z.coerce.number().int().positive().max(1000).optional(),
        }),
        response: { 200: z.array(MoodLogSchema) },
      },
    },
    async (request) => {
      const { from, to, limit } = request.query
      if (from && to) {
        return moodService.listByDateRange(from, to)
      }
      return moodService.listLast(limit ?? 30)
    },
  )

  // DELETE /api/v1/health/mood/:date
  fastify.delete(
    '/:date',
    {
      schema: {
        params: z.object({
          date: DateStringSchema,
        }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const deleted = await moodService.deleteByDate(request.params.date)
      if (!deleted) {
        throw new NotFoundError('Mood log')
      }
      return reply.code(204).send()
    },
  )
}
