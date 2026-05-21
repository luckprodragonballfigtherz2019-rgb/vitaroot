import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NewWeightLogSchema, WeightLogSchema } from '@vitaroot/shared'
import { weightService } from './weight.service'
import { NotFoundError } from '../../lib/errors'

/**
 * Endpoints del módulo health/weight.
 * Prefijo aplicado en app.ts: /api/v1/health/weight
 */
export const weightRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // POST /api/v1/health/weight — registrar peso
  fastify.post(
    '/',
    {
      schema: {
        body: NewWeightLogSchema,
        response: { 201: WeightLogSchema },
      },
    },
    async (request, reply) => {
      const log = await weightService.addLog(request.body)
      return reply.code(201).send(log)
    },
  )

  // GET /api/v1/health/weight/latest — último registro (para pre-rellenar formulario)
  fastify.get(
    '/latest',
    {
      schema: {
        response: { 200: z.union([WeightLogSchema, z.null()]) },
      },
    },
    async () => {
      return weightService.getMostRecent()
    },
  )

  // GET /api/v1/health/weight?from=...&to=... o ?limit=N
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          from: z.coerce.date().optional(),
          to: z.coerce.date().optional(),
          limit: z.coerce.number().int().positive().max(1000).optional(),
        }),
        response: { 200: z.array(WeightLogSchema) },
      },
    },
    async (request) => {
      const { from, to, limit } = request.query
      if (from && to) {
        return weightService.listByDateRange(from, to)
      }
      return weightService.listLast(limit ?? 30)
    },
  )

  // DELETE /api/v1/health/weight/:id
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
      const deleted = await weightService.deleteLog(request.params.id)
      if (!deleted) {
        throw new NotFoundError('Weight log')
      }
      return reply.code(204).send()
    },
  )
}
