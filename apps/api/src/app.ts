import Fastify, { type FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { registerCors } from './plugins/cors'
import { registerErrorHandler } from './plugins/error-handler'
import { systemRoutes } from './modules/system/system.routes'

/**
 * Construye y configura una instancia de Fastify.
 * No la arranca: eso lo hace server.ts.
 */
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

  // Conecta Fastify con Zod para validación + serialización tipadas
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  // Plugins globales
  await registerCors(fastify)
  await registerErrorHandler(fastify)

  // Rutas bajo el prefijo /api/v1
  await fastify.register(
    async (api) => {
      // Health check
      api.get('/health', async () => {
        return {
          status: 'ok' as const,
          timestamp: new Date().toISOString(),
          env: env.NODE_ENV,
        }
      })

      // Módulo system bajo /api/v1/system
      await api.register(systemRoutes, { prefix: '/system' })
    },
    { prefix: '/api/v1' },
  )

  return fastify
}
