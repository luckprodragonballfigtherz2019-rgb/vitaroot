# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 ✅ **COMPLETADO**
**Próximo:** Sprint 2 - Módulo Salud

## Sprint 1 completo

**Todas las tareas hechas:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(web): atajos de teclado y colapso de sidebar`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próximo sprint: Sprint 2 - Módulo Salud

Tareas pendientes T2.1 a T2.12. Primer módulo funcional. Registrar y consultar las 4 métricas de salud (agua, sueño, peso, ánimo). Validar la arquitectura completa con el módulo más simple antes de los más complejos.

Empezar por T2.1: schemas Zod compartidos del módulo salud y sistema.

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas del Sprint 1

### Lecciones aprendidas

- Workflow asistente-pasa-código + usuario-pega funciona muy bien. Más educativo y predecible que dejar a IA codear sola.
- Mover proyecto fuera de OneDrive es CRÍTICO. Documents/ está sincronizado y causa problemas.
- Cada PC necesita: `pnpm install`, `pnpm db:migrate` y `gh auth login` con cuenta personal.
- TypeScript moderno (5.5+) requiere `rootDir` explícito en tsconfig.
- PowerShell se come el carácter '<' en here-strings con TS generics. Arreglar en VS Code después.
- En backend, todas las rutas viven bajo el prefijo `/api/v1` (registradas con `fastify.register` y `prefix`).
- `Cmd/Ctrl+\` falla en teclados ES y Chrome. Usar `Cmd/Ctrl+B` para toggle sidebar (estándar Notion/Slack).
- Patrón composable con estado compartido: variable declarada fuera del export = singleton de módulo.

### Decisiones técnicas clave

- DB path se calcula con `fileURLToPath(import.meta.url)` en lugar de `process.cwd()` para que funcione desde cualquier directorio de ejecución.
- ToastContainer usa `pointer-events-none` en contenedor + `pointer-events-auto` en cada toast (no bloquea clicks fuera).
- Atajos de teclado ignoran inputs/textareas/contenteditable automáticamente.
- Transiciones de página con `<Transition mode="out-in">` para evitar solapamiento.

### Estado de archivos clave

- `apps/api/`: server + db.ts con ruta absoluta + tabla profile + 1 migración aplicada
- `apps/web/`: Vue 3 + Vite + Tailwind con tokens + 8 vistas + cliente HTTP + toasts + shortcuts
- `packages/shared/`: estructura lista, schemas pendientes (Sprint 2+)
- `data/vitaroot.db`: BD local con tabla profile vacía