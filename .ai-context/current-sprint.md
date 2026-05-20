# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.5_
**Tareas completadas:** T1.1, T1.2, T1.3, T1.4
**Tareas pendientes del sprint:** T1.5, T1.6, T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(api): setup drizzle + sqlite con tabla profile`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.5: setup de `apps/web` con Vue 3 + Vite + TypeScript. Crear el frontend con Tailwind, configurar tokens de VitaRoot del doc 03, fuentes self-hosted (EB Garamond + Inter + JetBrains Mono).

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.4 completada: Drizzle + SQLite funcionando con tabla profile.
- Decisión técnica importante: db.ts calcula la ruta de la BD con fileURLToPath en lugar de process.cwd() para que sea independiente de quién ejecute el comando. Lo dejamos documentado para futuras refs.
- Lecciones del PC del cole:
  - Cada PC necesita su `pnpm install` (las dependencias no van a Git)
  - Cada PC necesita su `gh auth login` con la cuenta personal
  - `gh auth status` para verificar
- `.gitignore` actualizado: ahora `data/` se ignora completa (incluyendo .db, .db-shm, .db-wal) con excepción de `.gitkeep`.
- Aprendido: `journal_mode = WAL` crea archivos `.db-shm` y `.db-wal` auxiliares.