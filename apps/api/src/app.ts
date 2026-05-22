import Fastify, { type FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { registerCors } from './plugins/cors'
import { registerErrorHandler } from './plugins/error-handler'
import { systemRoutes } from './modules/system/system.routes'
import { waterRoutes } from './modules/health/water.routes'
import { sleepRoutes } from './modules/health/sleep.routes'
import { weightRoutes } from './modules/health/weight.routes'
import { moodRoutes } from './modules/health/mood.routes'
import { exercisesRoutes } from './modules/gym/exercises.routes'
import { workoutsRoutes } from './modules/gym/workouts.routes'

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger:
      env.NODE_ENV === 'development'
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
              },
            },
          }
        : true,
  })

  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await registerCors(fastify)
  await registerErrorHandler(fastify)

  await fastify.register(
    async (api) => {
      api.get('/health', async () => {
        return {
          status: 'ok' as const,
          timestamp: new Date().toISOString(),
          env: env.NODE_ENV,
        }
      })

      await api.register(systemRoutes, { prefix: '/system' })

      await api.register(
        async (health) => {
          await health.register(waterRoutes, { prefix: '/water' })
          await health.register(sleepRoutes, { prefix: '/sleep' })
          await health.register(weightRoutes, { prefix: '/weight' })
          await health.register(moodRoutes, { prefix: '/mood' })
        },
        { prefix: '/health' },
      )

      await api.register(
        async (gym) => {
          await gym.register(exercisesRoutes, { prefix: '/exercises' })
          await gym.register(workoutsRoutes, { prefix: '/workouts' })
        },
        { prefix: '/gym' },
      )
    },
    { prefix: '/api/v1' },
  )

  return fastify
}
