import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db, sqlite } from '../infrastructure/db'

/**
 * Aplica las migraciones pendientes a la BD.
 *
 * Uso: pnpm db:migrate
 *
 * Las migraciones se generan con `pnpm db:generate` y viven en
 * apps/api/drizzle/migrations/. Este script las aplica en orden.
 */
function main(): void {
  console.log('🔄 Aplicando migraciones...')

  try {
    migrate(db, { migrationsFolder: './drizzle/migrations' })
    console.log('✅ Migraciones aplicadas correctamente')
  } catch (error) {
    console.error('❌ Error al aplicar migraciones:', error)
    process.exit(1)
  } finally {
    sqlite.close()
  }
}

main()
