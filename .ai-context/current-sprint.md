# Current Sprint · Contexto activo

## Sprint actual

**Sprint 1:** ✅ COMPLETADO (T1.1 a T1.10)
**Sprint 2:** ✅ COMPLETADO (T2.1 a T2.12)
**Próximo:** Sprint 3 — Módulo Gym (parte 1)

## Estado del proyecto

**Último commit:** `feat(web): dashboard con resumen de salud y saludo dinámico`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Lo que tiene VitaRoot ahora mismo

### Backend
- Fastify + Drizzle + SQLite funcionando en :3001
- Endpoints: GET /api/v1/health (status), /system/profile (GET, PATCH), /health/water (4 ops), /health/sleep (3 ops), /health/weight (4 ops incluyendo /latest), /health/mood (4 ops con upsert por fecha)
- Validación Zod en todos los bordes (body, params, query, response)
- Manejo de errores consistente con ApiError + NotFoundError
- 5 tablas: profile (singleton), water_logs, sleep_logs, weight_logs, mood_logs

### Frontend
- Vue 3 + Vite + Tailwind con tokens VitaRoot
- 8 rutas con transiciones page (fade + translateY)
- AppShell con Sidebar colapsable (Ctrl+B) y TopBar
- Atajos teclado: G+H, G+G, G+C, G+S, Ctrl+B
- Sistema de toasts global con TransitionGroup
- Cliente HTTP tipado con request<S extends z.ZodTypeAny>
- Store Pinia useHealthStore con updates optimistas
- Composables: useToast, useSidebar, useShortcuts, useProfile
- Componentes UI: Button, Input, NumericInput, Modal, StarRating, Card, ToastContainer
- Vistas funcionales: Dashboard (con saludo + resumen), Health (grid 4 widgets), Profile (config completa)
- Formularios: SleepLogForm, WeightLogForm, MoodLogForm con validación y submit

## Próxima acción concreta

Empezar Sprint 3: módulo Gym (parte 1). Tareas T3.1 a T3.10. Primer hito: registrar un workout completo con ejercicios, sets, peso, reps.

Empezar por T3.1: schemas Zod de gym (Workout, Exercise, Set, ExerciseInstance).

## Decisiones pendientes

- ninguna

## Bloqueadores

- PC de casa: tiene archivos viejos sin commitear de la primera vez que trabajamos ahí (App.vue, tsconfig.json, Button.vue, AppShell.vue, Sidebar.vue, TopBar.vue). Al volver allí, hacer `git stash --include-untracked` o `git restore .` + `git clean -fd` para limpiar antes del próximo pull. NO afecta al trabajo desde el PC del cole.

## Notas técnicas del Sprint 2

### Convenciones Zod
- Para datos del backend: usar `z.output<>` (defaults aplicados, campos obligatorios)
- Para inputs al backend: usar `z.input<>` (defaults opcionales)
- Función `request` usa genérico `<S extends z.ZodTypeAny>` con return `z.output<S>`

### Patrones aplicados
- Singleton de módulo para state compartido (composables): variable declarada fuera del export
- mapDbToApi en cada service para desacoplar BD de API pública
- Updates optimistas en Pinia: modificar state localmente tras POST exitoso
- Upsert con `onConflictDoUpdate` para mood (PUT en lugar de POST)
- Pre-rellenado inteligente en formularios (último peso, ánimo del día)
- isDirty computed para desactivar botón Guardar sin cambios

### Lecciones aprendidas
- PowerShell se come el carácter `<` en here-strings TS con generics. Arreglar manual en VS Code.
- PowerShell + curl es alias de Invoke-WebRequest. Usar Invoke-RestMethod para tests.
- PowerShell con caracteres UTF-8 (í, á, ñ) calcula Content-Length mal. Probar con texto ASCII.
- VS Code muestra error fantasma "No inputs were found" hasta crear el primer archivo TS.
- En Vue, `maxlength="X"` envía string. Usar `:maxlength="X"` para enviar número.
- pnpm pide approve-builds para esbuild, better-sqlite3, vue-demi: Espacio → Enter → y → Enter.
- Ctrl+\ falla en teclado ES + Chrome. Usar Ctrl+B (estándar Notion/Slack).
- Crear carpetas (api, composables, stores) en cada PC: PowerShell no las crea automáticamente al hacer Out-File.