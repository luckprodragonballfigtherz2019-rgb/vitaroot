# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.4_
**Tareas completadas:** T1.1, T1.2, T1.3
**Tareas pendientes del sprint:** T1.4, T1.5, T1.6, T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(api): setup fastify base con health check`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.4: setup de Drizzle ORM y SQLite. Crear `drizzle.config.ts`, schema inicial con tabla `profile`, generar y aplicar primera migración. Verificar con `drizzle-kit studio`.

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.3 completada: backend Fastify corriendo en http://localhost:3001/health.
- El servidor escucha solo en 127.0.0.1 (coherente con local-only).
- pnpm pidió aprobar builds de esbuild: aceptado.
- Workflow asistente-pasa-código + usuario-pega funciona muy bien.
- Sesión productiva: 3 tareas en una sesión.