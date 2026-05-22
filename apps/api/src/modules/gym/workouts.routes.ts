import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  WorkoutSchema,
  WorkoutDetailSchema,
  ExerciseInstanceSchema,
  SetSchema,
  StartWorkoutSchema,
  FinishWorkoutSchema,
  NewExerciseInstanceSchema,
  NewSetSchema,
  UpdateSetSchema,
} from '@vitaroot/shared'
import { workoutsService } from './workouts.service'

/**
 * Endpoints del módulo workouts.
 * Prefijo aplicado en app.ts: /api/v1/gym/workouts
 */
export const workoutsRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // ── WORKOUT ───────────────────────────────────────────────

  // POST /api/v1/gym/workouts — iniciar workout
  fastify.post(
    '/',
    {
      schema: {
        body: StartWorkoutSchema,
        response: { 201: WorkoutSchema },
      },
    },
    async (request, reply) => {
      const created = await workoutsService.start(request.body)
      return reply.code(201).send(created)
    },
  )

  // GET /api/v1/gym/workouts/active — workout activo (con relaciones)
  fastify.get(
    '/active',
    {
      schema: {
        response: { 200: z.union([WorkoutDetailSchema, z.null()]) },
      },
    },
    async () => {
      return workoutsService.getActive()
    },
  )

  // GET /api/v1/gym/workouts?limit=N — listado de finalizados
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          limit: z.coerce.number().int().positive().max(100).optional(),
        }),
        response: { 200: z.array(WorkoutSchema) },
      },
    },
    async (request) => {
      return workoutsService.listFinished(request.query.limit ?? 30)
    },
  )

  // GET /api/v1/gym/workouts/:id — workout concreto con relaciones
  fastify.get(
    '/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: WorkoutDetailSchema },
      },
    },
    async (request) => {
      return workoutsService.getById(request.params.id)
    },
  )

  // PATCH /api/v1/gym/workouts/:id/finish — finalizar
  fastify.patch(
    '/:id/finish',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: FinishWorkoutSchema,
        response: { 200: WorkoutSchema },
      },
    },
    async (request) => {
      return workoutsService.finish(request.params.id, request.body)
    },
  )

  // DELETE /api/v1/gym/workouts/:id — descartar
  fastify.delete(
    '/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      await workoutsService.discard(request.params.id)
      return reply.code(204).send()
    },
  )

  // ── EXERCISE INSTANCES ─────────────────────────────────────

  // POST /api/v1/gym/workouts/:id/exercises — añadir ejercicio
  fastify.post(
    '/:id/exercises',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: NewExerciseInstanceSchema,
        response: { 201: ExerciseInstanceSchema },
      },
    },
    async (request, reply) => {
      const created = await workoutsService.addExercise(request.params.id, request.body)
      return reply.code(201).send(created)
    },
  )

  // DELETE /api/v1/gym/exercise-instances/:id
  fastify.delete(
    '/exercise-instances/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      await workoutsService.removeExercise(request.params.id)
      return reply.code(204).send()
    },
  )

  // ── SETS ───────────────────────────────────────────────────

  // POST /api/v1/gym/sets
  fastify.post(
    '/sets',
    {
      schema: {
        body: NewSetSchema,
        response: { 201: SetSchema },
      },
    },
    async (request, reply) => {
      const created = await workoutsService.addSet(request.body)
      return reply.code(201).send(created)
    },
  )

  // PATCH /api/v1/gym/sets/:id
  fastify.patch(
    '/sets/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: UpdateSetSchema,
        response: { 200: SetSchema },
      },
    },
    async (request) => {
      return workoutsService.updateSet(request.params.id, request.body)
    },
  )

  // DELETE /api/v1/gym/sets/:id
  fastify.delete(
    '/sets/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      await workoutsService.deleteSet(request.params.id)
      return reply.code(204).send()
    },
  )
}
