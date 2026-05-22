import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  ExerciseSchema,
  NewExerciseSchema,
  MuscleGroupSchema,
  SetSchema,
} from '@vitaroot/shared'
import { exercisesService } from './exercises.service'
import { workoutsRepository } from './workouts.repository'

/**
 * Endpoints del catálogo de ejercicios.
 * Prefijo aplicado en app.ts: /api/v1/gym/exercises
 */
export const exercisesRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // GET /api/v1/gym/exercises?search=...&muscle=...
  fastify.get(
    '/',
    {
      schema: {
        querystring: z.object({
          search: z.string().max(80).optional(),
          muscle: MuscleGroupSchema.optional(),
        }),
        response: { 200: z.array(ExerciseSchema) },
      },
    },
    async (request) => {
      return exercisesService.list(request.query)
    },
  )

  // GET /api/v1/gym/exercises/:id
  fastify.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        response: { 200: ExerciseSchema },
      },
    },
    async (request) => {
      return exercisesService.getById(request.params.id)
    },
  )

  // GET /api/v1/gym/exercises/:id/last-set — último set registrado
  fastify.get(
    '/:id/last-set',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: z.union([SetSchema, z.null()]) },
      },
    },
    async (request) => {
      return workoutsRepository.findLastSetOfExercise(request.params.id)
    },
  )

  // GET /api/v1/gym/exercises/:id/pr — mejor set (PR)
  fastify.get(
    '/:id/pr',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: z.union([SetSchema, z.null()]) },
      },
    },
    async (request) => {
      return workoutsRepository.findPrOfExercise(request.params.id)
    },
  )

  // POST /api/v1/gym/exercises — crear ejercicio custom
  fastify.post(
    '/',
    {
      schema: {
        body: NewExerciseSchema,
        response: { 201: ExerciseSchema },
      },
    },
    async (request, reply) => {
      const created = await exercisesService.createCustom(request.body)
      return reply.code(201).send(created)
    },
  )
}
