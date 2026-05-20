import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { resolve, dirname } from 'node:path'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { env } from '../env'
import * as schema from '../../drizzle/schema'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Sube 4 niveles desde apps/api/src/infrastructure/ hasta la raíz del monorepo
const monorepoRoot = resolve(__dirname, '../../../..')
const dbPath = resolve(monorepoRoot, env.DB_PATH)

mkdirSync(dirname(dbPath), { recursive: true })

const sqlite = new Database(dbPath)

sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
export { sqlite }
