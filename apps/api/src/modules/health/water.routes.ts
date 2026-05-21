import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NewWaterLogSchema, WaterLogSchema } from '@vitaroot/shared'
import { waterService } from './water.service'
import { NotFoundError } from '../../lib/errors'

/**
 * Endpoints del módulo health/water.
 * Prefijo aplicado en app.ts: /api/v1/health/water
 */
export const waterRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // POST /api/v1/health/water — añadir vaso
  fastify.post(
    '/',
    {
      schema: {
        body: NewWaterLogSchema,
        response: { 201: WaterLogSchema },
      },
    },
    async (request, reply) => {
      const log = await waterService.addLog(request.body)
      return reply.code(201).send(log)
    },
  )

  // GET /api/v1/health/water?date=YYYY-MM-DD — registros del día
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
        response: {
          200: z.object({
            logs: z.array(WaterLogSchema),
            totalMl: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const { date } = request.query
      const from = new Date(`${date}T00:00:00`)
      const to = new Date(`${date}T23:59:59.999`)

      const logs = await waterService.listByDateRange(from, to)
      const totalMl = await waterService.sumByDateRange(from, to)

      return { logs, totalMl }
    },
  )

  // GET /api/v1/health/water/range?from=...&to=... — rango libre
  fastify.get(
    '/range',
    {
      schema: {
        querystring: z.object({
          from: z.coerce.date(),
          to: z.coerce.date(),
        }),
        response: { 200: z.array(WaterLogSchema) },
      },
    },
    async (request) => {
      const { from, to } = request.query
      return waterService.listByDateRange(from, to)
    },
  )

  // DELETE /api/v1/health/water/:id — eliminar registro
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
      const deleted = await waterService.deleteLog(request.params.id)
      if (!deleted) {
        throw new NotFoundError('Water log')
      }
      return reply.code(204).send()
    },
  )
}
