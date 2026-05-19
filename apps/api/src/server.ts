import { buildApp } from './app'
import { env } from './env'

async function start(): Promise<void> {
  try {
    const app = await buildApp()

    await app.listen({
      port: env.PORT,
      host: '127.0.0.1', // Solo escucha en localhost, no en la red
    })

    app.log.info(`🌱 VitaRoot API corriendo en http://localhost:${env.PORT}`)
  } catch (error) {
    console.error('❌ Error arrancando el servidor:', error)
    process.exit(1)
  }
}

void start()