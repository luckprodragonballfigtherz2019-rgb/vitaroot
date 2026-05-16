# 04 · Arquitectura Técnica — VitaRoot

> **Versión 2.0** · Reescritura completa para proyecto local-only sin servicios externos.

---

## 📑 Índice

- [§1 Vista general](#1-vista-general)
- [§2 Decisiones de arquitectura (ADRs)](#2-decisiones-de-arquitectura-adrs)
- [§3 Estructura del monorepo](#3-estructura-del-monorepo)
- [§4 Frontend (Vue 3 + Vite)](#4-frontend-vue-3--vite)
- [§5 Backend (Fastify + Drizzle + SQLite)](#5-backend-fastify--drizzle--sqlite)
- [§6 Tipos compartidos](#6-tipos-compartidos)
- [§7 Comunicación frontend-backend](#7-comunicación-frontend-backend)
- [§8 Persistencia con SQLite](#8-persistencia-con-sqlite)
- [§9 Manejo de errores](#9-manejo-de-errores)
- [§10 Testing](#10-testing)
- [§11 Ejecución local](#11-ejecución-local)
- [§12 Guía para Claude Code](#12-guía-para-claude-code)

---

## §1 Vista general

### 1.1. Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO (TÚ)                            │
│                  (navegador en tu propio PC)                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP local
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND — Vue 3 + Vite + TypeScript                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Vue Router · Pinia · Tailwind · @vueuse/motion           │   │
│  │ http://localhost:5173 (dev) / :3000 (prod local)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ REST JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           BACKEND — Fastify + Drizzle + TypeScript               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PRESENTATION  Routes + Zod schemas                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  APPLICATION   Use cases / services                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  DOMAIN        Entidades + reglas puras                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  INFRASTRUCTURE  Drizzle ORM · sistema de ficheros       │   │
│  └──────────────────────────────────────────────────────────┘   │
│            http://localhost:3001                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │    data/vitaroot.db          │
                  │    SQLite (un archivo)       │
                  │    + data/backups/           │
                  └──────────────────────────────┘
```

### 1.2. Propiedades clave

1. **100% local.** Frontend, backend y BD corren en tu PC. Cero servicios externos.
2. **Mismo lenguaje en todo el stack.** TypeScript en front y back. Tipos compartidos vía paquete.
3. **Type-safe end-to-end.** Strict mode. Zero `any` (regla de lint).
4. **Modular.** Cada módulo (Gym, Comidas, Salud, Dashboard) vive en su propia carpeta tanto en frontend como backend.
5. **Sin Docker en dev.** Arrancas con `pnpm dev` y listo.
6. **BD portable.** Un archivo `.db` que copias, mueves, restauras.

---

## §2 Decisiones de arquitectura (ADRs)

### ADR-001 · Vue 3 + Vite (sin Nuxt)

**Contexto:** Framework de frontend.

**Decisión:** **Vue 3 + Vite + TypeScript + Vue Router (manual).**

**Razones:**
- Proyecto de aprendizaje: queremos entender qué hace cada cosa, no que un framework lo abstraiga
- Menos magia, más control
- Configuración explícita en `vite.config.ts` y `main.ts`
- Curva de aprendizaje más limpia para Vue

**Trade-offs aceptados:**
- Más boilerplate que Nuxt (routing manual, imports explícitos)
- Sin SSR (no lo necesitamos: app local)

**Consecuencias:**
- Tenemos que configurar manualmente: routing, plugins de Pinia, fuentes, Tailwind...
- Ganamos en comprensión del stack

---

### ADR-002 · Fastify para backend (sobre Express, Hono)

**Contexto:** Framework HTTP en Node.

**Decisión:** **Fastify.**

**Razones:**
- Más rápido y moderno que Express
- Integración nativa con TypeScript y Zod (`fastify-type-provider-zod`)
- Sistema de plugins limpio (cada módulo = un plugin)
- Logger pino integrado de calidad

---

### ADR-003 · Drizzle ORM (sobre Prisma)

**Contexto:** ORM para SQLite.

**Decisión:** **Drizzle ORM.**

**Razones (importantes):**
- **Mejor para SQLite que Prisma.** Más ligero, no genera cliente pesado.
- Sintaxis cercana al SQL real → aprendes SQL en el proceso
- TypeScript-first nativo
- Migraciones con `drizzle-kit` simples
- Sin "magia": ves exactamente la query que se ejecuta

**Trade-offs:**
- Menos popular que Prisma (menos tutoriales) — compensado por mejor docs oficiales
- Sintaxis más verbosa en queries complejas

**Alternativas descartadas:**
- *Prisma*: excelente pero diseñado pensando en Postgres. Su soporte SQLite es secundario.
- *better-sqlite3 puro*: demasiado bajo nivel, perderíamos type safety.

---

### ADR-004 · SQLite con `better-sqlite3`

**Contexto:** Driver de SQLite para Node.

**Decisión:** **`better-sqlite3`** como driver, vía Drizzle.

**Razones:**
- Síncrono (más simple mental model para single-user)
- Más rápido que `sqlite3` (async)
- API limpia
- Recomendado por Drizzle

---

### ADR-005 · Monorepo con pnpm workspaces

**Contexto:** Cómo gestionar el código compartido entre front y back.

**Decisión:** **Monorepo con pnpm workspaces.** Sin Turborepo, sin Nx.

**Razones:**
- pnpm es eficiente en disco y velocidad de instalación
- Workspaces nativos cubren el 100% de necesidades del proyecto
- Sin herramientas adicionales que aprender

**Estructura:**
```
vitaroot/
├── apps/
│   ├── web/         (Vue 3 + Vite)
│   └── api/         (Fastify)
├── packages/
│   └── shared/      (tipos Zod compartidos)
├── data/
│   ├── vitaroot.db
│   └── backups/
├── pnpm-workspace.yaml
└── package.json
```

---

### ADR-006 · REST plano (sin GraphQL, sin tRPC)

**Contexto:** Cómo se comunican frontend y backend.

**Decisión:** **REST + JSON.**

**Razones:**
- Lo más estándar y debugueable
- tRPC sería elegante pero acopla demasiado fuerte (queremos ver el contrato HTTP)
- Sin streaming necesario (no hay IA)
- Tipos compartidos vía `packages/shared` con Zod

**Pattern:**
- Backend define rutas con schemas Zod
- Mismos schemas se importan en el frontend para typear las llamadas
- Cliente HTTP simple basado en `fetch` tipado

---

### ADR-007 · Pinia para estado

**Decisión:** Pinia (recomendación oficial de Vue 3). Composition API nativa, TS-first.

---

### ADR-008 · Tailwind CSS con tokens custom

**Contexto:** Sistema de estilos.

**Decisión:** **Tailwind con tokens definidos en doc 03.** Componentes propios construidos sobre primitivas accesibles de **radix-vue** (estilos completamente custom).

**Razones:**
- Tailwind permite usar tokens del sistema de diseño directamente
- radix-vue aporta accesibilidad (focus management, ARIA, teclado) sin estilos
- Componentes propios = control total

---

### ADR-009 · TypeScript estricto desde el día 1

**Configuración:**
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- Lint: `@typescript-eslint/no-explicit-any: error`

**Excepciones controladas:**
- Tipos generados (Drizzle) pueden tener `any` internos
- Wrappers de librerías sin tipos: `unknown` con narrowing

---

### ADR-010 · Validación con Zod en los bordes

**Decisión:** Zod en TODOS los bordes externos. Inputs HTTP, variables de entorno, datos importados.

**Pattern:**
```typescript
const NewWorkoutSchema = z.object({
  date: z.coerce.date(),
  exercises: z.array(ExerciseEntrySchema).min(1),
})
type NewWorkoutInput = z.infer<typeof NewWorkoutSchema>
```

---

### ADR-011 · Sin Docker en desarrollo

**Decisión:** Levantar todo con `pnpm dev`. Sin Docker, sin Compose.

**Razones:**
- SQLite no necesita servidor
- Frontend y backend son procesos Node
- Cero setup adicional

**Docker se considera solo si:**
- En v2 quieres empaquetar la app como contenedor para correr en otro PC

---

### ADR-012 · Sin auth en v1

**Decisión:** **No hay autenticación en v1.** El backend escucha solo en `localhost` (`127.0.0.1`), no expuesto a la red.

**Razones:**
- Es tu PC, tu dato
- Cero fricción
- CORS configurado solo para `localhost:5173` (dev) y `localhost:3000` (prod local)

**Cuándo reintroducir auth:**
- Si en v2 quieres correrlo en LAN para acceder desde el móvil → password simple en env var

---

### ADR-013 · Sin frameworks de testing pesados; Vitest minimal

**Decisión:** Tests con **Vitest**. Sin Playwright en v1 (los e2e se hacen a mano).

**Política:**
- **Tests unitarios obligatorios** para: lógica de cálculo (PRs, volumen, agregados), schemas Zod críticos
- **Tests de integración** para: endpoints críticos con SQLite en memoria
- **No cobertura mínima**: la cobertura es resultado, no objetivo
- **Sin e2e automatizados en v1**: tú mismo eres el QA cuando uses la app

---

### ADR-014 · Migraciones versionadas con drizzle-kit

**Decisión:** Todas las migraciones generadas con `drizzle-kit generate` y commiteadas al repo. Aplicadas con `drizzle-kit migrate`.

**Regla:** **Nunca** editar manualmente la BD. Siempre vía migración.

---

### ADR-015 · Iconos solo desde Lucide

**Decisión:** `lucide-vue-next`. Sin SVGs custom (salvo logo VitaRoot y animación opcional de raíz).

---

### ADR-016 · Variables de entorno tipadas

**Decisión:** Schema Zod para todas las env vars. Si falta una crítica, el servidor **no arranca**.

```typescript
const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DB_PATH: z.string().default('./data/vitaroot.db'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})
export const env = EnvSchema.parse(process.env)
```

---

### ADR-017 · Logger pino con redacción

**Decisión:** Logs estructurados JSON con pino. En dev: legible con `pino-pretty`. En prod local: JSON puro a stdout + archivo opcional.

---

## §3 Estructura del monorepo

### 3.1. Árbol completo

```
vitaroot/
├── apps/
│   ├── web/                          # Frontend Vue 3
│   │   ├── src/
│   │   │   ├── main.ts               # Entry point
│   │   │   ├── App.vue
│   │   │   ├── router/               # Vue Router config
│   │   │   │   ├── index.ts
│   │   │   │   └── routes.ts
│   │   │   ├── views/                # Páginas (una por ruta)
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── gym/
│   │   │   │   │   ├── GymHistoryView.vue
│   │   │   │   │   ├── GymNewView.vue
│   │   │   │   │   └── GymDetailView.vue
│   │   │   │   ├── meals/
│   │   │   │   ├── health/
│   │   │   │   └── settings/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Button, Input, Card, Modal...
│   │   │   │   ├── layout/           # AppShell, Sidebar, TopBar
│   │   │   │   └── feature/
│   │   │   │       ├── gym/
│   │   │   │       ├── meals/
│   │   │   │       ├── health/
│   │   │   │       └── dashboard/
│   │   │   ├── composables/          # useToast, useShortcuts, useApi
│   │   │   ├── stores/               # Pinia: gym.ts, meals.ts, health.ts
│   │   │   ├── api/                  # Cliente HTTP tipado
│   │   │   │   ├── client.ts
│   │   │   │   ├── gym.ts
│   │   │   │   ├── meals.ts
│   │   │   │   ├── health.ts
│   │   │   │   └── system.ts
│   │   │   ├── styles/
│   │   │   │   ├── tokens.css
│   │   │   │   ├── typography.css
│   │   │   │   ├── reset.css
│   │   │   │   └── globals.css
│   │   │   ├── assets/
│   │   │   │   ├── fonts/
│   │   │   │   └── animations/
│   │   │   └── lib/
│   │   │       ├── dates.ts
│   │   │       └── format.ts
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # Backend Fastify
│       ├── src/
│       │   ├── server.ts             # Entry point
│       │   ├── app.ts                # Build app + plugins
│       │   ├── env.ts                # Validación env vars
│       │   │
│       │   ├── modules/              # ⭐ Módulos independientes
│       │   │   ├── gym/
│       │   │   │   ├── gym.routes.ts
│       │   │   │   ├── gym.service.ts
│       │   │   │   ├── gym.repository.ts
│       │   │   │   └── gym.domain.ts
│       │   │   ├── meals/
│       │   │   ├── health/
│       │   │   ├── dashboard/
│       │   │   └── system/           # Perfil, export, import
│       │   │
│       │   ├── infrastructure/
│       │   │   ├── db.ts             # Cliente Drizzle
│       │   │   └── backup.ts         # Sistema de backup automático
│       │   │
│       │   ├── plugins/              # Fastify plugins
│       │   │   ├── cors.ts
│       │   │   ├── error-handler.ts
│       │   │   └── logging.ts
│       │   │
│       │   └── lib/
│       │       ├── result.ts
│       │       └── dates.ts
│       │
│       ├── drizzle/                  # Schema + migraciones
│       │   ├── schema.ts             # Definición de tablas
│       │   └── migrations/           # SQL generado
│       │
│       ├── tests/
│       ├── drizzle.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                       # Tipos Zod compartidos
│       ├── src/
│       │   ├── index.ts
│       │   └── schemas/
│       │       ├── gym.ts            # WorkoutSchema, SetSchema, etc.
│       │       ├── meal.ts
│       │       ├── health.ts
│       │       └── system.ts
│       ├── tsconfig.json
│       └── package.json
│
├── data/                             # ⭐ Datos del usuario (gitignored)
│   ├── vitaroot.db                   # BD principal
│   └── backups/                      # Backups automáticos
│       └── vitaroot-2025-01-15.db
│
├── docs/                             # Esta documentación
│
├── scripts/
│   ├── dev.sh                        # Arrancar dev
│   ├── build.sh                      # Build de producción local
│   └── seed.ts                       # Cargar ~50 ejercicios iniciales
│
├── .gitignore                        # Incluye data/*.db, data/backups/
├── README.md
├── pnpm-workspace.yaml
├── package.json                      # Scripts root
└── tsconfig.base.json
```

### 3.2. Scripts root (package.json)

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "build": "pnpm -r build",
    "start": "pnpm --filter api start",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "db:generate": "pnpm --filter api db:generate",
    "db:migrate": "pnpm --filter api db:migrate",
    "db:seed": "pnpm --filter api db:seed",
    "db:studio": "pnpm --filter api db:studio"
  }
}
```

---

## §4 Frontend (Vue 3 + Vite)

### 4.1. Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build | Vite |
| Lenguaje | TypeScript (strict) |
| Routing | Vue Router 4 |
| Estado | Pinia |
| Estilos | Tailwind CSS + CSS variables (tokens) |
| Componentes UI | Custom sobre radix-vue (accesibilidad) |
| Iconos | lucide-vue-next |
| Animación | Vue Transition + @vueuse/motion |
| HTTP | fetch nativo con wrapper tipado |
| Validación | Zod (importado desde `@vitaroot/shared`) |

### 4.2. Capas

```
VIEWS (rutas) → COMPONENTS → COMPOSABLES → STORES → API CLIENT → BACKEND
                     ↓                       ↓
                 LIB UTILS              SHARED SCHEMAS
```

- **Views**: páginas asociadas a rutas. Sin lógica de negocio.
- **Components/feature**: composiciones específicas (`WorkoutCard.vue`, `SetInput.vue`).
- **Components/ui**: componentes base genéricos.
- **Composables**: lógica reutilizable (`useWorkouts()`, `useShortcuts()`, `useToast()`).
- **Stores (Pinia)**: estado global, caché optimista, sincronización.
- **API client**: wrappers tipados sobre `fetch`, validados con schemas Zod.

### 4.3. Patrón optimista

```typescript
// En una store o composable
async function saveSet(set: NewSetInput) {
  // 1. Actualiza UI inmediatamente con ID temporal
  const tempId = generateTempId()
  workoutsStore.addSetOptimistic({ ...set, id: tempId })
  
  try {
    // 2. Envía al backend
    const saved = await api.gym.addSet(set)
    // 3. Confirma con datos reales
    workoutsStore.confirmSet(tempId, saved)
  } catch (error) {
    // 4. Revierte si falla
    workoutsStore.revertSet(tempId)
    toast.error('No se pudo guardar el set')
  }
}
```

### 4.4. Reglas de organización

- **Una vista = un archivo en `views/`**. Si crece >200 líneas, descomponer en components.
- **Lógica de fetch en composables**, no en components.
- **Stores solo para estado compartido** entre páginas.
- **Atajos de teclado centralizados** vía `useShortcuts(handlers)`.

### 4.5. Vite config

- Alias: `@/` → `src/`, `@shared/` → `packages/shared/src/`
- Proxy en dev: `/api` → `http://localhost:3001`
- HMR activo
- Build output: `apps/web/dist/`

---

## §5 Backend (Fastify + Drizzle + SQLite)

### 5.1. Stack

| Capa | Tecnología |
|---|---|
| Framework HTTP | Fastify 4 |
| Lenguaje | TypeScript (strict) |
| ORM | Drizzle |
| BD | SQLite (vía better-sqlite3) |
| Validación | Zod + fastify-type-provider-zod |
| Logger | pino |
| Testing | Vitest |

### 5.2. Capas (Arquitectura limpia simplificada)

```
┌──────────────────────────────────────────────┐
│  PRESENTATION                                │
│  Routes + Schemas Zod                        │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  APPLICATION                                 │
│  Services / Use Cases                        │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│  DOMAIN                                      │
│  Reglas puras (PR, cálculos)                 │
└──────────────────────────────────────────────┘
                 ↑
                 │ usa
┌────────────────┴─────────────────────────────┐
│  INFRASTRUCTURE                              │
│  Drizzle · Backup · Filesystem               │
└──────────────────────────────────────────────┘
```

### 5.3. Anatomía de un módulo

Ejemplo `apps/api/src/modules/gym/`:

```typescript
// gym.routes.ts — endpoints HTTP
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { WorkoutSchema, NewWorkoutSchema } from '@vitaroot/shared'

export const gymRoutes: FastifyPluginAsyncZod = async (fastify) => {
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
}

// gym.service.ts — lógica de aplicación
export class GymService {
  constructor(private repo: GymRepository) {}
  
  async createWorkout(input: NewWorkoutInput): Promise<Workout> {
    const workout = buildWorkout(input)
    return this.repo.save(workout)
  }
  
  async findRecent(limit: number): Promise<Workout[]> {
    return this.repo.findRecent(limit)
  }
}

// gym.repository.ts — acceso a datos con Drizzle
import { db } from '../../infrastructure/db'
import { workouts, exerciseEntries, sets } from '../../../drizzle/schema'

export class GymRepository {
  async save(input: NewWorkoutInput): Promise<Workout> {
    return db.transaction(async (tx) => {
      const [workout] = await tx.insert(workouts).values({...}).returning()
      // insertar exerciseEntries y sets vinculados
      return workout
    })
  }
}

// gym.domain.ts — reglas puras testeables
export function isNewPR(set: Set, history: Set[]): boolean {
  return set.weight > Math.max(...history.map(s => s.weight))
}

export function calculateVolume(sets: Set[]): number {
  return sets.reduce((acc, s) => acc + s.weight * s.reps, 0)
}
```

### 5.4. Plugins Fastify

- **`cors.ts`**: permite solo `http://localhost:5173` y `http://localhost:3000`
- **`error-handler.ts`**: convierte errores conocidos en HTTP correctos
- **`logging.ts`**: pino con campos sensibles redactados

### 5.5. Servir frontend desde Fastify (prod local)

En producción local, Fastify sirve también el `dist/` del frontend:

```typescript
import fastifyStatic from '@fastify/static'

if (env.NODE_ENV === 'production') {
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../../web/dist'),
  })
}
```

Así, en producción local, abres `http://localhost:3001` y obtienes la app completa.

---

## §6 Tipos compartidos

### 6.1. `packages/shared`

Aquí vive **la única fuente de verdad** de los modelos. Tanto frontend como backend importan desde aquí.

```typescript
// packages/shared/src/schemas/gym.ts
import { z } from 'zod'

export const SetSchema = z.object({
  id: z.string().uuid(),
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  rpe: z.number().min(1).max(10).optional(),
})

export const NewSetSchema = SetSchema.omit({ id: true })

export const ExerciseEntrySchema = z.object({
  id: z.string().uuid(),
  exerciseId: z.string().uuid(),
  exerciseName: z.string(),
  order: z.number().int().nonnegative(),
  sets: z.array(SetSchema).min(1),
})

export const WorkoutSchema = z.object({
  id: z.string().uuid(),
  date: z.coerce.date(),
  notes: z.string().optional(),
  durationMin: z.number().int().nonnegative().optional(),
  entries: z.array(ExerciseEntrySchema).min(1),
})

export const NewWorkoutSchema = WorkoutSchema.omit({ id: true }).extend({
  entries: z.array(ExerciseEntrySchema.omit({ id: true })).min(1),
})

export type Set = z.infer<typeof SetSchema>
export type ExerciseEntry = z.infer<typeof ExerciseEntrySchema>
export type Workout = z.infer<typeof WorkoutSchema>
export type NewWorkoutInput = z.infer<typeof NewWorkoutSchema>
```

### 6.2. Regla de oro

> **Si un tipo cruza la frontera frontend-backend, vive en `packages/shared`.**

---

## §7 Comunicación frontend-backend

### 7.1. REST estándar

```
GET    /api/v1/workouts                  Lista paginada
POST   /api/v1/workouts                  Crear
GET    /api/v1/workouts/:id              Detalle
PATCH  /api/v1/workouts/:id              Actualizar
DELETE /api/v1/workouts/:id              Eliminar

GET    /api/v1/exercises                 Catálogo de ejercicios
POST   /api/v1/exercises
PATCH  /api/v1/exercises/:id

GET    /api/v1/meals?date=2025-01-15
POST   /api/v1/meals
PATCH  /api/v1/meals/:id

GET    /api/v1/saved-meals
POST   /api/v1/saved-meals

GET    /api/v1/health/water?date=...
POST   /api/v1/health/water
GET    /api/v1/health/sleep?from=...&to=...
POST   /api/v1/health/sleep
GET    /api/v1/health/weight?from=...&to=...
POST   /api/v1/health/weight
GET    /api/v1/health/mood?from=...&to=...
POST   /api/v1/health/mood

GET    /api/v1/dashboard/today
GET    /api/v1/dashboard/week

POST   /api/v1/system/export
POST   /api/v1/system/import
GET    /api/v1/system/profile
PATCH  /api/v1/system/profile
```

### 7.2. Convenciones

- Versionado vía URL: `/api/v1/`
- Recursos en plural
- Status codes: 200 (ok), 201 (created), 204 (no content), 400 (validation), 404 (not found), 500 (server)
- Errores con shape consistente:
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [...] } }
```

### 7.3. Cliente HTTP tipado

```typescript
// apps/web/src/api/client.ts
const API_BASE = '/api/v1'

async function request<T>(path: string, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new ApiError(res.status, await res.text())
  const data = await res.json()
  return schema ? schema.parse(data) : data
}

// apps/web/src/api/gym.ts
import { WorkoutSchema, NewWorkoutSchema, type Workout, type NewWorkoutInput } from '@vitaroot/shared'

export const gymApi = {
  async createWorkout(input: NewWorkoutInput): Promise<Workout> {
    return request('/workouts', {
      method: 'POST',
      body: JSON.stringify(input),
    }, WorkoutSchema)
  },
  
  async listRecent(limit = 30): Promise<Workout[]> {
    return request(`/workouts?limit=${limit}`, {}, z.array(WorkoutSchema))
  },
}
```

---

## §8 Persistencia con SQLite

### 8.1. Schema con Drizzle

Ejemplo `apps/api/drizzle/schema.ts`:

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group').notNull(),
  secondaryMuscles: text('secondary_muscles', { mode: 'json' }).$type<string[]>().default([]),
  notes: text('notes'),
  archived: integer('archived', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
  durationMin: integer('duration_min'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const exerciseEntries = sqliteTable('exercise_entries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  order: integer('order').notNull(),
})

export const sets = sqliteTable('sets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  exerciseEntryId: text('exercise_entry_id').notNull().references(() => exerciseEntries.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: real('weight').notNull(),
  rpe: real('rpe'),
})

// ... resto de tablas: meals, savedMeals, water, sleep, weight, mood, profile
```

> El **modelo de datos completo** está en el documento 05.

### 8.2. Migraciones

```bash
# Generar migración tras cambiar schema.ts
pnpm db:generate

# Aplicar migraciones
pnpm db:migrate
```

### 8.3. Backups

Sistema automático en `apps/api/src/infrastructure/backup.ts`:
- Cron interno (setInterval) configurable
- Copia `data/vitaroot.db` a `data/backups/vitaroot-YYYY-MM-DD.db`
- Mantiene últimos N backups (rotación)
- Configurable via `SystemProfile.backupSettings` en BD

### 8.4. Importación/exportación

- **Export**: dump completo a JSON estructurado por módulo
- **Import**: lee JSON, valida con Zod, inserta en BD con verificación de duplicados

---

## §9 Manejo de errores

### 9.1. Jerarquía en el dominio

```typescript
export class DomainError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
    public details?: unknown,
  ) { super(message) }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super('RESOURCE_NOT_FOUND', `${resource} ${id} not found`, 404)
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_FAILED', message, 400, details)
  }
}
```

### 9.2. Plugin `error-handler`

Convierte `DomainError` → respuesta HTTP coherente. Errores Zod → 400 con detalles. Errores no controlados → log + 500 genérico.

### 9.3. Frontend

- Toast con mensaje user-friendly
- Errores de validación inline en el formulario
- Retry exponencial (max 3) solo en GETs
- Mensajes claros: "No se pudo guardar el workout, inténtalo de nuevo"

---

## §10 Testing

### 10.1. Filosofía

- **Test lo que tiene riesgo de romper en silencio**: cálculos, agregaciones, transformaciones
- **No test lo que TypeScript ya verifica**
- **No buscamos cobertura**, buscamos confianza en código crítico

### 10.2. Qué se testea SÍ

- Funciones puras de dominio (`isNewPR`, `calculateVolume`, agregaciones de macros)
- Schemas Zod críticos (con casos válidos e inválidos)
- Repositorios con SQLite en memoria
- Endpoints clave (crear workout, registrar comida)

### 10.3. Qué NO se testea

- Componentes UI presentacionales puros
- Lógica trivial cubierta por TypeScript
- Hooks visuales (animaciones)

### 10.4. Stack

- **Vitest** para todo
- **better-sqlite3 en memoria** (`:memory:`) para tests de repositorio

---

## §11 Ejecución local

### 11.1. Setup inicial

```bash
# Clonar
git clone <repo> vitaroot
cd vitaroot

# Instalar dependencias
pnpm install

# Crear archivo de BD vacío + migrar + seed
pnpm db:migrate
pnpm db:seed   # Carga los ~50 ejercicios iniciales

# Arrancar dev (frontend y backend en paralelo)
pnpm dev
```

Abre `http://localhost:5173` y tienes la app.

### 11.2. Build de producción local

```bash
# Build de ambos
pnpm build

# Arrancar producción (Fastify sirve frontend + API)
pnpm start

# Abrir http://localhost:3001
```

### 11.3. Scripts útiles

```bash
pnpm db:studio       # Drizzle Studio: ver/editar BD en GUI
pnpm db:generate     # Generar migración tras cambiar schema
pnpm db:migrate      # Aplicar migraciones
pnpm db:seed         # Re-cargar seed (cuidado, puede duplicar)
pnpm lint            # Lint en todo el monorepo
pnpm typecheck       # TypeScript check
pnpm test            # Tests
```

### 11.4. Estructura de archivos de datos

```
vitaroot/
└── data/
    ├── vitaroot.db          # Tu BD principal (gitignored)
    └── backups/
        ├── vitaroot-2025-01-15.db
        ├── vitaroot-2025-01-22.db
        └── ...
```

---

## §12 Guía para Claude Code

### 12.1. Convenciones de naming

- **Archivos:** kebab-case (`gym.routes.ts`, `workout-card.vue`)
- **Componentes Vue:** PascalCase en imports y templates (`WorkoutCard`)
- **Composables:** `use<Algo>` siempre (`useWorkouts`)
- **Tipos:** PascalCase
- **Funciones/variables:** camelCase
- **Constantes:** UPPER_SNAKE_CASE

### 12.2. Reglas no negociables

- **Cero `any`.** Usar `unknown` + narrowing si hace falta.
- **Validación Zod en todos los inputs externos.** Sin excepciones.
- **No queries SQL desde rutas/services.** Solo en repositorios.
- **No mezclar lógica de dominio con persistencia.** Las funciones puras viven en `domain.ts`.
- **Cada función pública con JSDoc** explicando qué hace.
- **Imports absolutos** desde `@/` (web) o `~/` (api).
- **Atajos de teclado** registrados vía `useShortcuts`, no scattered.

### 12.3. Plantilla de commit

```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional]

[footer opcional con refs a ADRs]
```

Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`.

Ejemplos:
- `feat(gym): añadir endpoint POST /workouts`
- `fix(meals): corregir cálculo de macros agregadas`
- `docs(arch): añadir ADR-018 sobre validación de imports`

### 12.4. Cuándo escribir un nuevo ADR

Cualquier decisión que cumpla alguna de:
- Afecta a más de un módulo
- Sería costosa de revertir
- Tiene alternativas no obviamente peores
- El "porqué" se va a olvidar en 3 meses

### 12.5. Definition of Done de una feature

Una feature no se considera completa hasta que:

- ✅ Los criterios de aceptación del doc 02 se cumplen
- ✅ TypeScript compila sin errores ni warnings
- ✅ Lint pasa
- ✅ Tests unitarios pasan (si aplican)
- ✅ La UI sigue el sistema de diseño del doc 03
- ✅ Hay manejo de error y loading states
- ✅ Funciona en desktop a 1280×720, 1440×900 y 1920×1080
- ✅ Documentación inline donde sea no obvio
- ✅ Commit con mensaje claro

---

## §13 Estado del documento

- **Versión:** 2.0 — reescritura completa para stack local-only
- **Estado:** Propuesto, pendiente validación
- **Próxima revisión:** al finalizar Sprint 1, por si surge algún ajuste con código real

---

## Próximo documento

**`05-modelo-de-datos.md`** — schema completo de BD con todas las tablas, campos, relaciones, índices.
