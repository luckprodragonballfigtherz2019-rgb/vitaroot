# Coding Rules · Quick Reference

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`
- **Cero `any`.** Usa `unknown` + narrowing.
- Tipos compartidos en `packages/shared`, nunca duplicar.
- Validación Zod en TODOS los bordes externos (HTTP, env, localStorage).

## Naming

| Tipo | Estilo | Ejemplo |
|---|---|---|
| Archivos | kebab-case | `gym.routes.ts`, `workout-card.vue` |
| Componentes Vue | PascalCase | `WorkoutCard` |
| Composables | `use<Algo>` | `useWorkouts`, `useShortcuts` |
| Tipos | PascalCase | `Workout`, `NewWorkoutInput` |
| Funciones/vars | camelCase | `calculateVolume`, `recentWorkouts` |
| Constantes | UPPER_SNAKE_CASE | `MUSCLE_GROUPS`, `MAX_SETS` |

## Imports

- Absolutos siempre: `@/` (web), `~/` (api)
- Desde shared: `@vitaroot/shared`
- Sin imports relativos profundos (`../../../`)

## Arquitectura

### Backend — capas

```
Routes (HTTP)  →  Service (lógica)  →  Repository (BD)
                       ↓
                   Domain (lógica pura, testeable)
```

Reglas:
- **NO** queries SQL fuera de repositories
- **NO** lógica de dominio fuera de `*.domain.ts`
- **NO** HTTP-specific code fuera de routes

### Frontend — capas

```
Views (rutas)  →  Components  →  Composables  →  Stores  →  API client
```

Reglas:
- **NO** fetch directo en componentes (usar composables/stores)
- **NO** lógica de dominio en frontend (cálculos van en backend)
- Estado compartido en stores, estado local en componentes

## Componentes Vue

- Si > 200 líneas de template, descomponer
- Composition API + `<script setup lang="ts">` siempre
- Props con `defineProps<{}>()` tipados
- Emits con `defineEmits<{}>()` tipados
- Sin estilos inline excepto valores dinámicos (`style="transform: translateX(${x}px)"`)

## Funciones

- Si > 50 líneas, refactorizar
- Funciones puras siempre que se pueda
- Side effects explícitos (no escondidos en getters)

## Validación

```typescript
// Schema en packages/shared
export const NewWorkoutSchema = z.object({
  date: z.coerce.date(),
  exercises: z.array(...).min(1),
})

// Backend: validar en route
fastify.post('/workouts', {
  schema: { body: NewWorkoutSchema },
  handler: async (req) => { /* req.body ya tipado */ }
})

// Frontend: validar respuesta
const data = await request('/workouts', { method: 'POST', body }, WorkoutSchema)
```

## Manejo de errores

```typescript
// Backend: errores de dominio
throw new ResourceNotFoundError('workout', id)

// Frontend: toast + recovery
try {
  await api.gym.create(...)
  toast.success('Workout guardado')
} catch (err) {
  toast.error(getErrorMessage(err))
}
```

## Atajos de teclado

- Registrar siempre vía `useShortcuts(handlers)`, nunca scattered
- Documentar en pantalla cuando relevante

## Commits

```
<tipo>(<scope>): <descripción>
```

Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`

Ejemplos:
- `feat(gym): añadir endpoint POST /workouts`
- `fix(health): corregir cálculo de horas dormidas`
- `refactor(api): extraer lógica de PRs a domain.ts`

## Anti-patterns prohibidos

❌ `any` en TS  
❌ Estilos inline (excepto dinámicos)  
❌ Colores/espacios/duraciones hardcoded  
❌ Fetch suelto en componentes  
❌ Lógica de dominio en frontend  
❌ Componentes Vue > 200 líneas  
❌ Funciones > 50 líneas  
❌ Endpoints sin Zod  
❌ Llamadas a servicios externos (estamos local-only)  
❌ `// TODO` sin issue/decisión asociada  

## Definition of Done (por tarea)

- ✅ TypeScript compila sin errores ni warnings
- ✅ Lint pasa
- ✅ Tests escritos si lógica de dominio o crítica
- ✅ UI sigue el sistema de diseño
- ✅ Loading + error states
- ✅ Funciona en 1280×720 y 1920×1080
- ✅ Probado manualmente
- ✅ Commit con mensaje claro
