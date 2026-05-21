import Fastify, { type FastifyInstance } from 'fastify'
import { env } from './env'
import { registerCors } from './plugins/cors'
import { registerErrorHandler } from './plugins/error-handler'

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

  // Plugins globales
  await registerCors(fastify)
  await registerErrorHandler(fastify)

  // Rutas bajo el prefijo /api/v1
  await fastify.register(
    async (api) => {
      api.get('/health', async () => {
        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          env: env.NODE_ENV,
        }
      })
    },
    { prefix: '/api/v1' },
  )

  return fastify
}
