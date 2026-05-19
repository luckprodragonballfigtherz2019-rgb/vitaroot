import { z } from 'zod'
import { config } from 'dotenv'

// Carga variables del archivo .env (si existe)
config()

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_PATH: z.string().default('./data/vitaroot.db'),
})

const parseResult = EnvSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Variables de entorno inválidas:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parseResult.data
export type Env = z.infer<typeof EnvSchema>