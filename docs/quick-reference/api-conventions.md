# API Conventions · Quick Reference

## URLs

- Versionado: `/api/v1/`
- Recursos en plural: `/workouts`, `/meals`, `/exercises`
- Sub-recursos: `/exercises/:id/progression`
- Filtros vía query string: `/workouts?from=...&to=...`

## Métodos HTTP

| Método | Uso |
|---|---|
| GET | Lectura |
| POST | Crear |
| PATCH | Actualizar parcial |
| PUT | Reemplazar completo (raro, evitar) |
| DELETE | Eliminar |

## Status codes

| Code | Cuándo |
|---|---|
| 200 | OK con body |
| 201 | Created (POST exitoso) |
| 204 | No content (DELETE exitoso) |
| 400 | Validación falla |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: unique violado) |
| 500 | Error de servidor |

## Shape de respuesta

### Éxito
```json
{ "id": "...", "date": "...", ... }   // objeto directo
{ "data": [...], "pagination": {...} } // si paginado
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Mensaje user-friendly",
    "details": [...]  // opcional, para validación Zod
  }
}
```

## Validación

Toda ruta tiene schema Zod:

```typescript
fastify.post('/workouts', {
  schema: {
    body: NewWorkoutSchema,
    response: { 201: WorkoutSchema }
  },
  handler: async (req, reply) => {
    const workout = await gymService.createWorkout(req.body)
    return reply.code(201).send(workout)
  }
})
```

## Endpoints estándar por recurso

Para cada recurso CRUD:

```
GET    /api/v1/<recurso>              listar (con filtros opcionales)
GET    /api/v1/<recurso>/:id          detalle
POST   /api/v1/<recurso>              crear
PATCH  /api/v1/<recurso>/:id          actualizar parcial
DELETE /api/v1/<recurso>/:id          eliminar
```

## Paginación

```
GET /api/v1/workouts?limit=30&offset=0
```

Respuesta:
```json
{
  "data": [...],
  "pagination": {
    "total": 142,
    "limit": 30,
    "offset": 0
  }
}
```

## Filtros temporales

Siempre usar `from` y `to` en ISO 8601 o YYYY-MM-DD:

```
GET /api/v1/weight-logs?from=2025-01-01&to=2025-01-31
```

## CORS

Solo `localhost:5173` y `localhost:3000` (dev y prod local).

## Rate limiting

Sin límite estricto (single user), pero registrar requests para detectar bucles.

## Headers requeridos

- `Content-Type: application/json` en requests con body
- Sin auth en v1 (local-only)

## Versionado de cambios

- Cambios breaking → nueva versión `/api/v2/`
- Cambios aditivos → mismo versión, nueva ruta
- Deprecaciones → header `Sunset` y aviso

## Patrones específicos

### Resources anidados
```
GET /api/v1/workouts/:id/exercise-entries
GET /api/v1/exercises/:id/progression
```

### Acciones especiales (verbos)
```
POST /api/v1/saved-meals/:id/use     (registra uso, incrementa contador)
POST /api/v1/system/export           (genera ZIP)
POST /api/v1/system/import           (recibe ZIP)
```
