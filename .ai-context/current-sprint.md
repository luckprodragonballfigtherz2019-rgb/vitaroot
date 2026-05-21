# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.8_
**Tareas completadas:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7
**Tareas pendientes del sprint:** T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(web): rutas y páginas placeholder con animación de transición`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.8: cliente HTTP tipado base. Crear `apps/web/src/api/client.ts` con función `request<T>()` que valida respuestas con Zod, y `apps/web/src/api/system.ts` con `getHealth()`. Verificar end-to-end: el DashboardView llama al backend y muestra la respuesta.

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.7 completada: 7 vistas placeholder + router con 8 rutas + transición page (fade + translateY 250ms).
- Patrón usado: PlaceholderView.vue reutilizable que recibe props (module, title, description).
- Ruta /gym/:id colocada DESPUÉS de /gym/new para no capturar 'new' como id.
- Transición usa <RouterView v-slot="{ Component }"> con <Transition mode="out-in">.