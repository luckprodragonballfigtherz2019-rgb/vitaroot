import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NewSleepLogSchema, SleepLogSchema } from '@vitaroot/shared'
import { sleepService } from './sleep.service'
import { NotFoundError } from '../../lib/errors'

/**
 * Endpoints del módulo health/sleep.
 * Prefijo aplicado en app.ts: /api/v1/health/sleep
 */
export const sleepRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // POST /api/v1/health/sleep — registrar sueño
  fastify.post(
    '/',
    {
      schema: {
        body: NewSleepLogSchema,
        response: { 201: SleepLogSchema },
      },
    },
    async (request, reply) => {
      const log = await sleepService.addLog(request.body)
      return reply.code(201).send(log)
    },
  )

  // GET /api/v1/health/sleep?from=...&to=... — rango
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          from: z.coerce.date().optional(),
          to: z.coerce.date().optional(),
          limit: z.coerce.number().int().positive().max(100).optional(),
        }),
        response: { 200: z.array(SleepLogSchema) },
      },
    },
    async (request) => {
      const { from, to, limit } = request.query

      // Si hay rango, lo usamos. Si no, devolvemos los últimos N (default 30).
      if (from && to) {
        return sleepService.listByDateRange(from, to)
      }
      return sleepService.listLast(limit ?? 30)
    },
  )

  // DELETE /api/v1/health/sleep/:id
  fastify.delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const deleted = await sleepService.deleteLog(request.params.id)
      if (!deleted) {
        throw new NotFoundError('Sleep log')
      }
      return reply.code(204).send()
    },
  )
}
