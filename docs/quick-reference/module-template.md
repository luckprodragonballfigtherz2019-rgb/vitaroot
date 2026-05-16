# Module Template · Quick Reference

> Plantilla para crear un módulo nuevo en backend. Sigue esta estructura siempre.

## Estructura de archivos

Para módulo `<nombre>` (ejemplo: `gym`, `meals`, `health`):

```
apps/api/src/modules/<nombre>/
├── <nombre>.routes.ts        Endpoints HTTP + schemas Zod
├── <nombre>.service.ts       Lógica de aplicación (use cases)
├── <nombre>.repository.ts    Acceso a BD con Drizzle
└── <nombre>.domain.ts        Funciones puras (cálculos, reglas)
```

## Plantilla: routes.ts

```typescript
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { NewWorkoutSchema, WorkoutSchema } from '@vitaroot/shared'
import { z } from 'zod'

export const gymRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/workouts', {
    schema: {
      querystring: z.object({
        limit: z.coerce.number().int().positive().max(100).default(30),
        offset: z.coerce.number().int().nonnegative().default(0),
      }),
      response: { 200: z.array(WorkoutSchema) }
    },
    handler: async (req) => {
      return gymService.listRecent(req.query.limit, req.query.offset)
    }
  })

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

  // ... resto de endpoints
}
```

## Plantilla: service.ts

```typescript
import { GymRepository } from './gym.repository'
import { validateWorkoutHasContent, calculateVolume } from './gym.domain'
import type { NewWorkoutInput, Workout } from '@vitaroot/shared'

export class GymService {
  constructor(private repo: GymRepository) {}

  async createWorkout(input: NewWorkoutInput): Promise<Workout> {
    validateWorkoutHasContent(input)
    return this.repo.create(input)
  }

  async listRecent(limit: number, offset: number): Promise<Workout[]> {
    return this.repo.findRecent(limit, offset)
  }

  async getById(id: string): Promise<Workout> {
    const workout = await this.repo.findById(id)
    if (!workout) throw new ResourceNotFoundError('workout', id)
    return workout
  }
}

// Instancia singleton para uso en routes
export const gymService = new GymService(new GymRepository(db))
```

## Plantilla: repository.ts

```typescript
import { db } from '@/infrastructure/db'
import { workouts, exerciseEntries, sets } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'
import type { NewWorkoutInput, Workout } from '@vitaroot/shared'

export class GymRepository {
  constructor(private db: typeof db) {}

  async create(input: NewWorkoutInput): Promise<Workout> {
    return this.db.transaction(async (tx) => {
      const [workout] = await tx.insert(workouts).values({...}).returning()
      // insertar entries y sets vinculados
      return await this.findById(workout.id)
    })
  }

  async findById(id: string): Promise<Workout | null> {
    return this.db.query.workouts.findFirst({
      where: eq(workouts.id, id),
      with: {
        entries: {
          with: {
            exercise: true,
            sets: { orderBy: asc(sets.setNumber) }
          }
        }
      }
    })
  }

  async findRecent(limit: number, offset: number): Promise<Workout[]> {
    return this.db.query.workouts.findMany({
      orderBy: desc(workouts.date),
      limit,
      offset,
      with: { entries: { with: { exercise: true, sets: true } } }
    })
  }
}
```

## Plantilla: domain.ts (funciones puras)

```typescript
import type { Set, Workout, NewWorkoutInput } from '@vitaroot/shared'

export function calculateVolume(sets: Set[]): number {
  return sets
    .filter(s => !s.isWarmup)
    .reduce((acc, s) => acc + s.weight * s.reps, 0)
}

export function isWeightPR(set: Set, history: Set[]): boolean {
  if (history.length === 0) return false
  return set.weight > Math.max(...history.map(s => s.weight))
}

export function validateWorkoutHasContent(workout: NewWorkoutInput): void {
  if (workout.entries.length === 0) {
    throw new ValidationError('Workout must have at least one exercise')
  }
  if (workout.entries.some(e => e.sets.length === 0)) {
    throw new ValidationError('Each exercise must have at least one set')
  }
}
```

## Registrar el módulo en app.ts

```typescript
// apps/api/src/app.ts
import { gymRoutes } from './modules/gym/gym.routes'

export async function buildApp() {
  const fastify = Fastify({...})
  
  await fastify.register(gymRoutes, { prefix: '/api/v1' })
  // ... resto de módulos
  
  return fastify
}
```

## Tests del módulo

```
apps/api/tests/modules/<nombre>/
├── <nombre>.domain.test.ts      Tests de funciones puras
├── <nombre>.service.test.ts     Tests con mock de repo
└── <nombre>.routes.test.ts      Tests de integración con SQLite en memoria
```

## Checklist antes de cerrar un módulo

- [ ] Schemas Zod en `packages/shared`
- [ ] Tablas en `drizzle/schema.ts`
- [ ] Migración generada y aplicada
- [ ] `routes.ts` con validación Zod en cada endpoint
- [ ] `service.ts` sin queries SQL directas
- [ ] `repository.ts` único punto de acceso a BD
- [ ] `domain.ts` con funciones puras testeables
- [ ] Tests al menos del domain
- [ ] Plugin registrado en `app.ts`
- [ ] Cliente API en `apps/web/src/api/<nombre>.ts`
- [ ] Store de Pinia si hay estado compartido
