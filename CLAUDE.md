# VitaRoot · Instrucciones para Claude Code

## Qué es esto

App personal de tracking de salud, local-only, sin IA. Stack: Vue 3 + Vite + TS + Tailwind (web), Node + Fastify + Drizzle + SQLite (api), monorepo pnpm.

## Regla de oro: lee SOLO lo necesario

No leas los 6 docs cada sesión. Usa este router:

| Si la tarea es... | Lee esto |
|---|---|
| Empezar sprint nuevo | `docs/06-plan-implementacion.md` § del sprint correspondiente |
| Implementar una user story | `docs/02-especificacion-funcional.md` § de esa US |
| Crear componente UI | `docs/quick-reference/design-tokens.md` |
| Crear nueva tabla | `docs/05-modelo-de-datos.md` § de esa tabla |
| Endpoint nuevo | `docs/quick-reference/api-conventions.md` + `docs/04-arquitectura-tecnica.md` § "anatomía de un módulo" |
| Decisión técnica nueva | `docs/04-arquitectura-tecnica.md` § ADRs relevantes |
| Estás perdido sobre el proyecto | `docs/01-vision-y-principios.md` § 1-6 únicamente |

**Antes de leer un doc completo**, abre `docs/00-index.md` y busca la sección específica.

## Reglas de código no negociables

Las reglas detalladas están en `docs/quick-reference/coding-rules.md`. Resumen:

- TypeScript estricto, cero `any`
- Validación con Zod en bordes
- Naming: kebab-case archivos, PascalCase componentes, `use*` composables
- Cero estilos inline (excepto valores dinámicos)
- Solo tokens del sistema de diseño, nunca colores/espacios hardcoded
- Iconos solo desde `lucide-vue-next`
- Sin servicios externos (local-only)

## Workflow obligatorio

1. **Una tarea a la vez.** Si te piden "implementa el Sprint 2", responde: "¿empezamos por la tarea T2.1?"
2. **Lee solo lo necesario** según el router de arriba
3. **Antes de codear**, di en 3 bullets qué vas a hacer y espera OK
4. **Después de codear**:
   - Resume cambios en 5 bullets máximo
   - Lista archivos modificados/creados
   - Ejecuta `pnpm typecheck` y `pnpm lint`
   - **Espera review antes de commit**

## Si no estás seguro

Pregunta. No improvises. No "rellenes" código.

## Si surge decisión técnica nueva

No la tomes tú solo. Propón en `.ai-context/decisions-log.md` y espera confirmación.

## Commits

`<tipo>(<scope>): <descripción>` — tipos: feat, fix, refactor, chore, docs, test, style, perf

## Anti-patterns prohibidos

- `any` en TS
- Colores/espacios/durations hardcoded
- Componentes Vue > 200 líneas
- Funciones > 50 líneas
- Endpoints sin validación Zod
- Fetch suelto en componentes (usar composables/stores)
- Lógica de dominio en frontend
