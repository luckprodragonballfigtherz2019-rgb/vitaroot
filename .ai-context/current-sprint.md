# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.2_
**Tareas completadas:** T1.1
**Tareas pendientes del sprint:** T1.2, T1.3, T1.4, T1.5, T1.6, T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `chore: setup inicial del monorepo`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.2: setup de `packages/shared`. Crear el paquete TypeScript compartido con dependencia de Zod y estructura inicial de schemas vacíos (gym.ts, meal.ts, health.ts, system.ts).

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.1 completada con éxito.
- Decidido usar OpenCode + Gemini en lugar de Claude Code por error de conexión.
- Workflow actual: el asistente genera el código y el usuario lo implementa manualmente, sin pasar por OpenCode. Más predecible y educativo.
- Archivos creados: pnpm-workspace.yaml, package.json raíz, tsconfig.base.json, README.md, carpetas apps/, packages/, scripts/ con .gitkeep.