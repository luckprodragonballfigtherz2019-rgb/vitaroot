import type { FastifyInstance } from 'fastify'

/**
 * Plugin que registra un handler global de errores.
 * Convierte errores en respuestas HTTP con shape consistente.
 *
 * Shape de error:
 * { error: { code: string, message: string, details?: unknown } }
 */
export async function registerErrorHandler(fastify: FastifyInstance): Promise<void> {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error)

    // Errores de validación de Zod
    if (error.validation) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Datos de entrada inválidos',
          details: error.validation,
        },
      })
    }

    // Errores con statusCode explícito (lanzados desde el código)
    const statusCode = error.statusCode ?? 500

    return reply.status(statusCode).send({
      error: {
        code: statusCode >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST',
        message: statusCode >= 500 ? 'Error interno del servidor' : error.message,
      },
    })
  })
}