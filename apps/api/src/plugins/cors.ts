import type { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

/**
 * Plugin de CORS.
 * Solo permite peticiones desde el frontend local (Vite dev server y build local).
 */
export async function registerCors(fastify: FastifyInstance): Promise<void> {
  await fastify.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
}