# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.3_
**Tareas completadas:** T1.1, T1.2
**Tareas pendientes del sprint:** T1.3, T1.4, T1.5, T1.6, T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `chore(shared): setup paquete de tipos compartidos`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.3: setup de `apps/api` con Fastify. Crear el backend con endpoint `GET /health` básico que responda JSON, sin tocar BD todavía (eso es T1.4).

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.2 completada: paquete @vitaroot/shared con estructura lista para schemas Zod.
- Workflow actual: asistente pasa código, usuario pega en VS Code. Funciona bien.
- Limpieza de packages/shared al cambiar de herramienta (de OpenCode a asistente directo).
- Aviso: tsconfig de packages/shared NO usa "baseUrl" porque TypeScript 5.5+ lo deprecó con moduleResolution: Bundler.