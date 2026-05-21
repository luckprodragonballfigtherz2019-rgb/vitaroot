# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.9_
**Tareas completadas:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7, T1.8
**Tareas pendientes del sprint:** T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(web): cliente http tipado y verificación end-to-end`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.9: composable useToast con ToastContainer. Sistema de notificaciones global (success/error/info), animación slide-in desde top-right, auto-dismiss tras 4s, montado en AppShell.

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.8 completada: cliente HTTP tipado funcionando, frontend hablando con backend.
- Cambio importante: TODAS las rutas del backend ahora viven bajo el prefijo /api/v1 (registradas con fastify.register dentro de un bloque con prefix). Convención consistente con doc 04 §7.
- Validación Zod end-to-end: el frontend valida que la respuesta cumple HealthResponseSchema antes de usarla.
- Patrón cliente HTTP: función genérica request<T>(path, schema?, options?). Si pasas schema, valida. Si no, confía en TypeScript.
- ApiError captura status 0 (network error), status real (404, 500, etc) y detalles del body.