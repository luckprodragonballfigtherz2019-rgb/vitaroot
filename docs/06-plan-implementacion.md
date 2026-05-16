# 06 · Plan de Implementación — VitaRoot

> **Versión 1.0** · Plan operativo. Sprints concretos, tareas en orden, criterios de "hecho". Este es el documento que tendrás abierto durante toda la construcción.

---

## 📑 Índice

- [§1 Cómo trabajar con este plan](#1-cómo-trabajar-con-este-plan)
- [§2 Vista general de sprints](#2-vista-general-de-sprints)
- [§3 Sprint 0 — Preparación previa](#3-sprint-0--preparación-previa)
- [§4 Sprint 1 — Cimientos](#4-sprint-1--cimientos)
- [§5 Sprint 2 — Módulo Salud](#5-sprint-2--módulo-salud)
- [§6 Sprint 3 — Módulo Gym (base)](#6-sprint-3--módulo-gym-base)
- [§7 Sprint 4 — Módulo Gym (progresión)](#7-sprint-4--módulo-gym-progresión)
- [§8 Sprint 5 — Módulo Comidas](#8-sprint-5--módulo-comidas)
- [§9 Sprint 6 — Dashboard semanal y tendencias](#9-sprint-6--dashboard-semanal-y-tendencias)
- [§10 Sprint 7 — Pulido y export/import](#10-sprint-7--pulido-y-exportimport)
- [§11 Definition of Done global](#11-definition-of-done-global)
- [§12 CLAUDE.md (instrucciones para Claude Code)](#12-claudemd-instrucciones-para-claude-code)

---

## §1 Cómo trabajar con este plan

### 1.1. Antes de empezar un sprint

1. Lee el sprint completo en este documento
2. Lee las user stories referenciadas en el documento 02
3. Confirma que las pre-condiciones del sprint se cumplen
4. Abre Claude Code en la raíz del repo

### 1.2. Cómo trabajar con Claude Code

**Patrón recomendado:**

```
1. Tú: "Vamos con el Sprint 2, tarea T2.1"
2. Claude Code: lee la tarea, hace preguntas si las tiene
3. Tú: respondes, Claude Code implementa
4. Revisas el código, pides ajustes
5. Cuando esté listo: commit
6. Siguiente tarea
```

**No le des a Claude Code "implementa todo el Sprint 2"** — pierde contexto, comete errores y se vuelve incontrolable. **Tarea a tarea.**

### 1.3. Qué pasa si una tarea es demasiado grande

Si Claude Code empieza a divagar o el código es confuso:
1. Para
2. Divide la tarea en sub-tareas más pequeñas
3. Actualiza este plan con la nueva división

### 1.4. Cuándo escribir un ADR nuevo

Si surge una decisión técnica no documentada que afecta a más de un módulo, antes de implementarla, añade un ADR al documento 04. **Decidir primero, codificar después.**

### 1.5. Tiempo estimado total

**10-14 semanas** trabajando 1-2 horas al día. Mucho más o menos según tu disponibilidad.

> No te ates a la estimación. Calidad > velocidad.

---

## §2 Vista general de sprints

| Sprint | Nombre | Duración aprox. | Entregable al final |
|---|---|---|---|
| 0 | Preparación previa | 3-7 días | Conocimientos básicos + entorno listo |
| 1 | Cimientos | 1-2 semanas | App vacía con sidebar y rutas navegables |
| 2 | Módulo Salud | 2 semanas | Puedes registrar agua, sueño, peso, ánimo |
| 3 | Módulo Gym (base) | 2-3 semanas | Puedes registrar y revisar workouts |
| 4 | Módulo Gym (progresión) | 1-2 semanas | Ves gráficas de progresión y PRs |
| 5 | Módulo Comidas | 1-2 semanas | Puedes registrar comidas con macros |
| 6 | Dashboard semanal y tendencias | 1-2 semanas | Ves tendencias semanales/mensuales |
| 7 | Pulido y export/import | 1-2 semanas | App lista para uso diario real |

### Después del Sprint 7: V1 está lista

A partir de ahí, **vives con la app**. Si surgen mejoras concretas, vuelves a iterar. Las features de v2 (rutinas, backup automático más completo, etc.) se atacan cuando te apetezca y según lo que la realidad te pida.

---

## §3 Sprint 0 — Preparación previa

> **Objetivo:** llegar al Sprint 1 con conocimientos básicos y el entorno funcionando.

### 3.1. Conocimientos a tener mínimos

Si ya los dominas, salta este sprint.

#### TypeScript básico
- Tipos primitivos, interfaces, types, generics básicos
- `as const`, narrowing, `unknown` vs `any`
- Module imports/exports

Recurso: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) (1-2 días leyéndolo y haciendo ejercicios).

#### Vue 3 Composition API
- `ref` y `reactive`
- `computed` y `watch`
- Ciclo de vida (`onMounted`, `onUnmounted`)
- Props, emits, slots
- Directivas (`v-if`, `v-for`, `v-model`)
- Single File Components

Recurso: [tutorial oficial de Vue](https://vuejs.org/tutorial/). Hazlo entero (es corto y excelente).

#### Vue Router básico
- Definir rutas
- `router-link`, `router-view`
- Navegación programática (`useRouter`, `useRoute`)

#### Pinia básico
- Qué es un store
- `defineStore` con Composition API

#### Tailwind CSS
- Clases utilitarias
- Responsive prefixes (`md:`, `lg:`)
- Custom config con tokens

#### Node.js + Fastify básico
- Cómo arrancar un server
- Rutas y handlers
- Middleware/plugins concept

#### SQLite + SQL básico
- SELECT, INSERT, UPDATE, DELETE
- JOINs
- WHERE, GROUP BY, ORDER BY

### 3.2. Entorno de desarrollo

#### T0.1 · Instalar herramientas

- [ ] **Node.js 20+** (LTS): `node --version` → ≥ 20.x
- [ ] **pnpm**: `npm install -g pnpm` → `pnpm --version` → ≥ 9.x
- [ ] **Git**: `git --version`
- [ ] **VSCode** o tu editor preferido (recomiendo VSCode por el ecosistema)
- [ ] **Claude Code**: instala según [docs.claude.com](https://docs.claude.com)

#### T0.2 · Extensiones de VSCode recomendadas

- Vue - Official (antes Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- SQLite Viewer (para abrir el `.db` y ver datos)

#### T0.3 · Cuenta de GitHub (opcional pero recomendado)

Aunque sea local, **commitea regularmente y haz push a un repo privado en GitHub**. Te protege de perder trabajo si algo le pasa al PC y te enseña Git en el proceso.

### 3.3. Pre-flight check

Antes de pasar al Sprint 1, verifica:
- [ ] Sabes crear un componente Vue básico con TypeScript
- [ ] Sabes hacer un fetch al backend desde Vue
- [ ] Has hecho `pnpm init` alguna vez y entiendes `package.json`
- [ ] Tienes Claude Code instalado y funcionando

---

## §4 Sprint 1 — Cimientos

> **Objetivo:** monorepo, frontend Vue vacío con sidebar y rutas, backend Fastify vacío, BD con migraciones aplicadas, todo conectado. Al final del sprint puedes navegar entre páginas (vacías) y ver respuesta de un endpoint health.

**Pre-condiciones:** Sprint 0 completo.

**Entregable visible:** abres `localhost:5173`, ves la sidebar con los 4 módulos, navegas entre páginas vacías. El backend en `localhost:3001/health` responde JSON.

### Tareas en orden

#### T1.1 · Setup monorepo

- [ ] Crear directorio `vitaroot/`
- [ ] `git init`
- [ ] Crear `pnpm-workspace.yaml` con `apps/*` y `packages/*`
- [ ] Crear `package.json` root con scripts (ver §3.2 del doc 04)
- [ ] Crear `.gitignore` (node_modules, dist, data/*.db, data/backups, .env)
- [ ] Crear `tsconfig.base.json` compartido
- [ ] Crear `README.md` mínimo con cómo arrancar
- [ ] Crear estructura de carpetas: `apps/`, `packages/`, `docs/`, `data/`, `scripts/`
- [ ] **Copiar los documentos `01..06.md` a `docs/`**

**Commit:** `chore: setup inicial del monorepo`

#### T1.2 · Setup `packages/shared`

- [ ] `apps/packages/shared/package.json` con dependencia de Zod
- [ ] `tsconfig.json` que extiende del base
- [ ] Estructura `src/schemas/` con archivos placeholder vacíos (gym.ts, meal.ts, health.ts, system.ts)
- [ ] `src/index.ts` que re-exporta todo

**Commit:** `chore(shared): setup paquete de tipos compartidos`

#### T1.3 · Setup `apps/api` con Fastify

- [ ] `pnpm init` en `apps/api/`
- [ ] Instalar: `fastify`, `@fastify/cors`, `fastify-type-provider-zod`, `zod`, `pino-pretty`, `dotenv`
- [ ] Instalar dev: `typescript`, `tsx`, `@types/node`, `vitest`
- [ ] `tsconfig.json` que extiende del base
- [ ] Crear `src/env.ts` con schema Zod de env vars
- [ ] Crear `src/app.ts` con función `buildApp()` que registra plugins y rutas
- [ ] Crear `src/server.ts` que importa app y arranca en puerto del env
- [ ] Crear plugin `src/plugins/error-handler.ts` con manejo básico de errores
- [ ] Crear plugin `src/plugins/cors.ts` con cors solo para localhost:5173
- [ ] Crear ruta `GET /health` que devuelve `{ status: 'ok', timestamp: ... }`
- [ ] Script `dev` con `tsx watch src/server.ts`
- [ ] Verificar: `pnpm dev:api` arranca y `curl localhost:3001/health` responde

**Commit:** `feat(api): setup fastify base con health check`

#### T1.4 · Setup Drizzle y SQLite

- [ ] Instalar en api: `drizzle-orm`, `better-sqlite3`
- [ ] Instalar dev: `drizzle-kit`, `@types/better-sqlite3`
- [ ] Crear `drizzle.config.ts` apuntando a `./drizzle/schema.ts` y `./drizzle/migrations/`
- [ ] Crear `drizzle/schema.ts` con **solo la tabla `profile`** (las demás vienen en cada sprint)
- [ ] Crear `src/infrastructure/db.ts` que exporta `db` (cliente Drizzle)
- [ ] Scripts en package.json: `db:generate`, `db:migrate`, `db:studio`
- [ ] Ejecutar `pnpm db:generate` → revisar SQL generado
- [ ] Ejecutar `pnpm db:migrate` → verificar que se crea `data/vitaroot.db`
- [ ] Verificar con `pnpm db:studio` que la tabla existe

**Commit:** `feat(api): setup drizzle + sqlite con tabla profile`

#### T1.5 · Setup `apps/web` con Vite + Vue 3 + TS

- [ ] `pnpm create vue@latest` en `apps/web/` con opciones: TypeScript SÍ, Router SÍ, Pinia SÍ, ESLint SÍ, Prettier SÍ, Tests NO (por ahora)
- [ ] Instalar adicionales: `tailwindcss`, `postcss`, `autoprefixer`, `@vueuse/core`, `@vueuse/motion`, `lucide-vue-next`, `@fontsource/eb-garamond`, `@fontsource/inter`, `@fontsource/jetbrains-mono`
- [ ] Instalar `@vitaroot/shared` desde workspace
- [ ] Inicializar Tailwind: `npx tailwindcss init -p`
- [ ] Configurar `tailwind.config.ts` con tokens de VitaRoot (extender del doc 03)
- [ ] Crear `src/styles/tokens.css` con CSS variables del doc 03
- [ ] Crear `src/styles/typography.css` con clases display-*, body-*, mono-*
- [ ] Crear `src/styles/reset.css` (modern-css-reset)
- [ ] Crear `src/styles/globals.css` que importa los anteriores + fonts
- [ ] Importar `globals.css` desde `main.ts`
- [ ] Crear configuración de Vite con proxy `/api → localhost:3001`
- [ ] Verificar: `pnpm dev:web` arranca y se ve la página por defecto

**Commit:** `feat(web): setup vue3 + vite + tailwind con tokens vitaroot`

#### T1.6 · Layout base: AppShell, Sidebar, TopBar

- [ ] Crear `src/components/layout/AppShell.vue` (contenedor sidebar + main)
- [ ] Crear `src/components/layout/Sidebar.vue` con:
  - Logo VitaRoot arriba
  - Lista de navegación: Hoy, Gym, Comidas, Salud
  - Separador
  - Perfil, Ajustes
  - Highlight del item activo (usar `useRoute()`)
- [ ] Crear `src/components/layout/TopBar.vue` con:
  - Buscador (placeholder, sin funcionalidad aún)
  - Botón de ajustes
- [ ] Crear `src/components/ui/Button.vue` con variantes primary/secondary/ghost/danger y sizes sm/md/lg/xl
- [ ] Aplicar tipografía con clase serif al logo
- [ ] Verificar visualmente con varios anchos de pantalla

**Commit:** `feat(web): layout base con sidebar y topbar`

#### T1.7 · Rutas y páginas vacías

- [ ] Configurar `src/router/index.ts` con rutas:
  - `/` → DashboardView
  - `/gym` → GymHistoryView
  - `/gym/new` → GymNewView
  - `/gym/:id` → GymDetailView
  - `/meals` → MealsView
  - `/health` → HealthView
  - `/profile` → ProfileView
  - `/settings` → SettingsView
- [ ] Crear cada vista con un placeholder mínimo: título + "Próximamente..."
- [ ] Verificar navegación entre rutas haciendo click en sidebar
- [ ] Animación de fade + translateY al cambiar de ruta (Vue Transition + @vueuse/motion)

**Commit:** `feat(web): rutas y páginas placeholder navegables`

#### T1.8 · Cliente HTTP tipado base

- [ ] Crear `src/api/client.ts` con función `request<T>()` tipada
- [ ] Crear `src/api/system.ts` con función `getHealth()`
- [ ] En `DashboardView.vue`, al montar: llamar `getHealth()` y mostrar el JSON resultante (provisional, para validar la conexión)
- [ ] Verificar: abre dashboard, ves la respuesta del backend

**Commit:** `feat(web): cliente http tipado y verificación end-to-end`

#### T1.9 · Composable de toast

- [ ] Crear `src/composables/useToast.ts` con función `toast.success()`, `toast.error()`, `toast.info()`
- [ ] Crear `src/components/ui/ToastContainer.vue` que muestra toasts activos top-right
- [ ] Animación de entrada (slide-in 250ms + fade) y salida
- [ ] Auto-dismiss tras 4s
- [ ] Montar `ToastContainer` en AppShell

**Commit:** `feat(web): sistema de toasts global`

#### T1.10 · Atajos de teclado base

- [ ] Crear `src/composables/useShortcuts.ts` que registra shortcuts globales
- [ ] Registrar al menos:
  - `Cmd/Ctrl + \` → toggle sidebar (colapsar/expandir)
  - `G luego H` → navegar a /
  - `G luego G` → navegar a /gym
  - `G luego C` → navegar a /meals
  - `G luego S` → navegar a /health
- [ ] Animar el colapso de sidebar (300ms ease-out-soft)

**Commit:** `feat(web): atajos de teclado base`

### Definition of Done del Sprint 1

- ✅ `pnpm dev` arranca frontend y backend en paralelo
- ✅ `localhost:5173` muestra layout con sidebar
- ✅ Navegación entre páginas funciona con animaciones
- ✅ El dashboard llama al backend y muestra el resultado
- ✅ Toasts funcionan
- ✅ Atajos de teclado básicos funcionan
- ✅ El código compila sin warnings de TS
- ✅ Lint pasa
- ✅ Has hecho commits descriptivos

---

## §5 Sprint 2 — Módulo Salud

> **Objetivo:** primer módulo funcional. Registras y consultas las 4 métricas de salud (agua, sueño, peso, ánimo). Validas la arquitectura completa con el módulo más simple.

**Pre-condiciones:** Sprint 1 completo.

**Entregable visible:** abres la app, registras un vaso de agua, registras peso de hoy, registras sueño de anoche, registras ánimo. Todo se persiste y al recargar sigue ahí.

### Tareas en orden

#### T2.1 · Schemas Zod compartidos (`packages/shared`)

- [ ] Crear `schemas/system.ts` con `ProfileSchema`, `MacroTargetsSchema`, `WaterSettingsSchema`
- [ ] Crear `schemas/health.ts` con:
  - `WaterLogSchema`, `NewWaterLogSchema`
  - `SleepLogSchema`, `NewSleepLogSchema`
  - `WeightLogSchema`, `NewWeightLogSchema`
  - `MoodLogSchema`, `NewMoodLogSchema`
- [ ] Exportar tipos derivados (`type WaterLog = z.infer<...>`)

**Commit:** `feat(shared): schemas zod del módulo salud y sistema`

#### T2.2 · Tablas de salud en Drizzle schema

- [ ] Añadir a `drizzle/schema.ts`: `waterLogs`, `sleepLogs`, `weightLogs`, `moodLogs` (copia del doc 05)
- [ ] Añadir índices: `idx_water_occurred`, `idx_sleep_bedtime`, `idx_weight_occurred`, `idx_mood_date_unique`
- [ ] `pnpm db:generate` → revisar SQL
- [ ] `pnpm db:migrate` → aplicar
- [ ] Verificar tablas con `pnpm db:studio`

**Commit:** `feat(db): tablas del módulo salud`

#### T2.3 · Módulo `system` en backend (perfil)

- [ ] Crear `src/modules/system/system.repository.ts` con `getProfile()` y `updateProfile()`
- [ ] Crear `src/modules/system/system.service.ts` que envuelve el repo
- [ ] Crear `src/modules/system/system.routes.ts` con:
  - `GET /api/v1/system/profile`
  - `PATCH /api/v1/system/profile`
- [ ] Registrar el plugin en `app.ts`
- [ ] Crear seed inicial mínimo: si no hay profile, crear uno con nombre por defecto
- [ ] Probar con curl o REST client

**Commit:** `feat(api): módulo system con CRUD de profile`

#### T2.4 · Módulo `health/water` en backend

- [ ] Crear `src/modules/health/water.repository.ts` con: `add()`, `findByDateRange()`, `delete()`, `sumByDay()`
- [ ] Crear `src/modules/health/water.service.ts`
- [ ] Crear rutas:
  - `POST /api/v1/health/water` — añadir vaso
  - `GET /api/v1/health/water?date=YYYY-MM-DD` — vasos del día
  - `GET /api/v1/health/water/range?from=...&to=...` — rango
  - `DELETE /api/v1/health/water/:id`
- [ ] Tests unitarios del service con SQLite en memoria

**Commit:** `feat(api): endpoints de agua`

#### T2.5 · Módulo `health/sleep`, `health/weight`, `health/mood` en backend

Mismo patrón que agua para cada uno:

- [ ] Repository, service, routes, tests
- [ ] Endpoints REST estándar (GET, POST, PATCH, DELETE)
- [ ] **Mood:** validar constraint único por día (devolver 409 si ya existe, con opción upsert)

**Commit:** `feat(api): endpoints de sueño, peso, ánimo`

#### T2.6 · Cliente API frontend para salud

- [ ] Crear `src/api/health.ts` con funciones tipadas para todos los endpoints
- [ ] Cada función valida la respuesta con su schema Zod

**Commit:** `feat(web): cliente api del módulo salud`

#### T2.7 · Store de Pinia para salud

- [ ] Crear `src/stores/health.ts` con state para water, sleep, weight, mood
- [ ] Actions con patrón optimista (ver §4.3 doc 04)
- [ ] Getters: `todayWaterTotal`, `lastWeight`, `lastSleep`, `todayMood`

**Commit:** `feat(web): store de salud con patrón optimista`

#### T2.8 · Componentes UI base extra

Necesarios para los formularios de salud:

- [ ] `src/components/ui/Input.vue` — input con label arriba, border-bottom only
- [ ] `src/components/ui/NumericInput.vue` — input numérico grande para peso/vasos
- [ ] `src/components/ui/Modal.vue` — modal con animación scale + fade, cerrar con Escape
- [ ] `src/components/ui/StarRating.vue` — selector 1-5 estrellas/iconos para calidad de sueño y ánimo
- [ ] `src/components/ui/Card.vue` — card con variantes flat/soft/elevated

**Commit:** `feat(web): componentes ui base para formularios`

#### T2.9 · Vista "Salud" con widgets de las 4 métricas

- [ ] Reemplazar `HealthView.vue` placeholder con la vista del doc 03 §5.7
- [ ] 4 cards en grid 2×2 con resumen actual de cada métrica
- [ ] Click en "+ vaso" añade un vaso (acción rápida)
- [ ] Click en "registrar peso/sueño/ánimo" abre modal con formulario
- [ ] Cargar datos al montar la vista

**Commit:** `feat(web): vista salud con widgets de las 4 métricas`

#### T2.10 · Formularios de registro

- [ ] `src/components/feature/health/SleepLogForm.vue` con bedtime, wakeTime, quality, notes
- [ ] `src/components/feature/health/WeightLogForm.vue` con weightKg, occurredAt, notes (pre-rellena con último peso)
- [ ] `src/components/feature/health/MoodLogForm.vue` con score 1-5 y notes (≤140 chars)
- [ ] Validación inline con Zod
- [ ] Botón Guardar con atajo Cmd+S
- [ ] Toast de éxito al guardar

**Commit:** `feat(web): formularios de registro de salud`

#### T2.11 · Vista perfil con configuración de salud

- [ ] Reemplazar `ProfileView.vue` placeholder
- [ ] Sección "Mi perfil": nombre, edad, altura, unidades
- [ ] Sección "Agua": tamaño vaso, objetivo diario
- [ ] Sección "Tema": claro/oscuro/auto

**Commit:** `feat(web): vista perfil con configuración`

#### T2.12 · Dashboard básico con salud

- [ ] Reemplazar `DashboardView.vue` placeholder con versión básica:
  - Saludo personalizado (consultar profile)
  - Botones de acción rápida: + vaso, + comida (deshabilitado), + entreno (deshabilitado)
  - Resumen de las 4 métricas con datos de hoy
- [ ] Cargar todo al montar
- [ ] Animación de entrada coreografiada (saludo → botones → resumen, stagger)

**Commit:** `feat(web): dashboard básico con datos de salud`

### Definition of Done del Sprint 2

- ✅ Las 4 métricas de salud se registran y persisten correctamente
- ✅ El dashboard muestra el estado de hoy
- ✅ Los formularios validan con Zod (front + back)
- ✅ Los toasts confirman acciones
- ✅ Hay tests unitarios al menos del service de agua
- ✅ Lint y typecheck pasan
- ✅ La estética sigue el sistema de diseño
- ✅ Puedes usar la app durante 1 semana para registrar tus métricas de salud reales

---

## §6 Sprint 3 — Módulo Gym (base)

> **Objetivo:** registras y consultas workouts. CRUD completo de ejercicios y entrenamientos.

**Pre-condiciones:** Sprint 2 completo.

**Entregable visible:** registras un workout (varios ejercicios con varios sets cada uno), lo ves en el histórico, puedes editarlo y eliminarlo. Catálogo de ejercicios funcional.

### Tareas en orden

#### T3.1 · Schemas Zod del módulo Gym

- [ ] `schemas/gym.ts` con todos los schemas del doc 05 §4.2
- [ ] Schemas para inputs (`NewWorkout`, `NewSet`...) y outputs (`Workout` completo)
- [ ] Exportar tipos

**Commit:** `feat(shared): schemas zod del módulo gym`

#### T3.2 · Tablas de Gym en Drizzle

- [ ] Añadir `exercises`, `workouts`, `exerciseEntries`, `sets`, `workoutTemplates`
- [ ] Añadir todas las relaciones de `relations()`
- [ ] Añadir índices: `idx_workouts_date`, `idx_exercise_entries_workout`, `idx_sets_entry`, `idx_exercises_muscle`, etc.
- [ ] Generar y aplicar migración

**Commit:** `feat(db): tablas del módulo gym`

#### T3.3 · Seed de ejercicios

- [ ] Crear `src/scripts/seed.ts` con los ~50 ejercicios del doc 05 §8.1
- [ ] Script idempotente (no duplica si ya existen)
- [ ] Añadir `db:seed` al package.json
- [ ] Ejecutar y verificar en Studio

**Commit:** `feat(db): seed de catálogo de ejercicios`

#### T3.4 · Módulo `gym/exercises` en backend

- [ ] Repository, service, routes para catálogo de ejercicios
- [ ] Endpoints:
  - `GET /api/v1/exercises?muscle=chest&archived=false`
  - `POST /api/v1/exercises`
  - `PATCH /api/v1/exercises/:id`
  - `DELETE /api/v1/exercises/:id` (soft delete: marca `archived: true`)
- [ ] Validar unicidad de nombre

**Commit:** `feat(api): endpoints de catálogo de ejercicios`

#### T3.5 · Módulo `gym/workouts` en backend

- [ ] Repository con transacción para guardar workout + entries + sets atómicamente
- [ ] Service con cálculo de duración, validación de contenido (no vacíos)
- [ ] Endpoints:
  - `GET /api/v1/workouts?limit=30&offset=0`
  - `GET /api/v1/workouts/:id` (con entries y sets cargados)
  - `POST /api/v1/workouts`
  - `PATCH /api/v1/workouts/:id` (replace completo de entries/sets)
  - `DELETE /api/v1/workouts/:id` (cascade)
- [ ] Tests unitarios del cálculo de volumen y validación

**Commit:** `feat(api): endpoints de workouts`

#### T3.6 · Cliente API y store de Gym en frontend

- [ ] `src/api/gym.ts` con todas las funciones
- [ ] `src/stores/gym.ts` con state, getters, actions

**Commit:** `feat(web): cliente api y store de gym`

#### T3.7 · Componentes UI extra

- [ ] `src/components/ui/Select.vue` — selector con búsqueda fuzzy y teclado (↑↓ Enter)
- [ ] `src/components/ui/ListItem.vue` — fila para listas largas (separadores finos)
- [ ] `src/components/ui/EmptyState.vue` — estado vacío con ilustración y CTA

**Commit:** `feat(web): componentes ui adicionales`

#### T3.8 · Vista "Catálogo de ejercicios"

- [ ] Pantalla dentro de `/gym/exercises` (añadir ruta)
- [ ] Lista con filtros por grupo muscular
- [ ] Botón "+ Ejercicio" → modal de creación
- [ ] Click en ejercicio → modal de edición
- [ ] Botón eliminar con confirmación (modal "¿estás seguro?")

**Commit:** `feat(web): catálogo de ejercicios`

#### T3.9 · Vista "Gym — Histórico"

- [ ] Reemplazar `GymHistoryView.vue` placeholder
- [ ] Lista de workouts agrupados por semana
- [ ] Cada item con: fecha, día semana, ejercicios principales, volumen
- [ ] Buscador y filtros
- [ ] Botón "+ Nuevo workout" arriba a la derecha
- [ ] Scroll infinito o paginación 30 en 30

**Commit:** `feat(web): vista histórico de gym`

#### T3.10 · Vista "Nuevo workout"

⭐ **La más importante de toda la app.** Tiene que ser excelente.

- [ ] Reemplazar `GymNewView.vue` placeholder
- [ ] Estructura del doc 03 §5.3:
  - Timer opcional arriba
  - Lista de ejercicios añadidos, cada uno con tabla de sets
  - Auto-rellenado del siguiente set con valores anteriores
  - Selector de ejercicio con typeahead
  - Atajos: `Enter` = + set, `Tab+N` = + ejercicio, `Cmd+S` = guardar
  - Borrador auto-guardado en localStorage cada 5s
- [ ] Componentes: `ExerciseSelector.vue`, `SetInput.vue`, `WorkoutForm.vue`
- [ ] Validación: workout debe tener ≥1 ejercicio con ≥1 set
- [ ] Al guardar: toast + redirect a histórico

**Commit:** `feat(web): formulario de nuevo workout`

#### T3.11 · Vista "Detalle de workout"

- [ ] Reemplazar `GymDetailView.vue` placeholder
- [ ] Mostrar todos los ejercicios y sets en formato lectura
- [ ] Botón "Editar" → reusa `WorkoutForm.vue` en modo edición
- [ ] Botón "Eliminar" con confirmación

**Commit:** `feat(web): vista detalle de workout`

#### T3.12 · Dashboard con módulo Gym

- [ ] Botón "+ Entreno" del dashboard ahora navega a `/gym/new`
- [ ] Si hay workout de hoy, mostrarlo en una sección del dashboard

**Commit:** `feat(web): integrar gym en dashboard`

### Definition of Done del Sprint 3

- ✅ Puedes registrar un workout completo en menos de 2 minutos
- ✅ Auto-rellenado y atajos de teclado funcionan
- ✅ Borrador no se pierde si recargas accidentalmente
- ✅ Histórico carga rápido
- ✅ Catálogo de ejercicios completo
- ✅ Sigues el sistema de diseño
- ✅ Lint y typecheck pasan
- ✅ Usas la app durante 1 semana para registrar tus workouts reales

---

## §7 Sprint 4 — Módulo Gym (progresión)

> **Objetivo:** ves gráficas de progresión por ejercicio y récords personales destacados.

**Pre-condiciones:** Sprint 3 completo, idealmente con al menos 1-2 semanas de workouts registrados (los datos reales hacen mucho mejor el desarrollo y testing de gráficas).

**Entregable visible:** desde el catálogo, click en un ejercicio te lleva a su ficha con gráficas de progresión de peso máximo y volumen, tabla de últimas sesiones, badges de PRs.

### Tareas en orden

#### T4.1 · Lógica de dominio: cálculo de PRs

- [ ] Crear `src/modules/gym/gym.domain.ts` (lógica pura)
- [ ] Funciones puras testeables:
  - `isWeightPR(set, history): boolean`
  - `isVolumePR(workout, history): boolean`
  - `isRepsPR(set, history, weight): boolean`
  - `calculateExerciseProgression(sets): ProgressionPoint[]`
- [ ] Tests unitarios exhaustivos

**Commit:** `feat(gym): lógica de cálculo de PRs y progresión`

#### T4.2 · Endpoints de progresión

- [ ] `GET /api/v1/exercises/:id/progression?from=...&to=...`
  - Devuelve: array de `{ date, maxWeight, totalVolume, totalReps, isPR }`
- [ ] `GET /api/v1/exercises/:id/prs`
  - Devuelve: récords actuales (peso, volumen, reps)
- [ ] Tests de integración

**Commit:** `feat(api): endpoints de progresión y PRs`

#### T4.3 · Detectar PRs al guardar workouts

- [ ] Modificar `gym.service.ts` `createWorkout`: tras guardar, detectar nuevos PRs y devolverlos en la respuesta
- [ ] Frontend muestra toast especial cuando se bate un PR

**Commit:** `feat(gym): detección automática de PRs al guardar`

#### T4.4 · Librería de gráficas

- [ ] Decidir librería: **Chart.js** (más simple) o **D3** (más control). Recomiendo Chart.js para v1.
- [ ] Instalar: `chart.js` y `vue-chartjs`
- [ ] Crear wrapper `src/components/ui/LineChart.vue` con estilos VitaRoot (ejes finos, colores moss, sin grid pesado)

**Commit:** `feat(web): wrapper de gráfica de líneas`

#### T4.5 · Vista "Detalle de ejercicio"

- [ ] Nueva ruta `/gym/exercises/:id`
- [ ] Tabs: Detalle · Histórico · Progresión
- [ ] Tab Detalle: info del ejercicio, PRs actuales con badges
- [ ] Tab Histórico: lista de sesiones donde apareció este ejercicio
- [ ] Tab Progresión: gráficas de peso y volumen + selector temporal

**Commit:** `feat(web): vista detalle de ejercicio con progresión`

#### T4.6 · Badge de PR

- [ ] Componente `src/components/feature/gym/PRBadge.vue` con badge dorado (ochre) animado
- [ ] Pulse-glow 3 veces al aparecer
- [ ] Sección "Mis PRs" en `/gym` con listado

**Commit:** `feat(gym): badges de PR con animación`

### Definition of Done del Sprint 4

- ✅ Cuando guardas un set que es PR, lo sabes
- ✅ Las gráficas son legibles y bonitas
- ✅ Las animaciones son discretas (no party mode)
- ✅ Lint y typecheck pasan
- ✅ Tests unitarios de PRs cubren casos edge (empate, primer registro, etc.)

---

## §8 Sprint 5 — Módulo Comidas

> **Objetivo:** registras comidas con macros aproximadas, las reutilizas como "comidas guardadas", ves resumen diario.

**Pre-condiciones:** Sprint 4 completo.

**Entregable visible:** registras una comida, la marcas como guardada, mañana la añades en 2 clics, ves total de macros del día.

### Tareas en orden

#### T5.1 · Schemas y tablas

- [ ] Schemas en `shared/schemas/meal.ts`
- [ ] Tablas `meals`, `savedMeals` en Drizzle
- [ ] Migración

**Commit:** `feat(db,shared): módulo comidas`

#### T5.2 · Módulo `meals` en backend

- [ ] Repository, service, routes para `meals` y `savedMeals`
- [ ] Endpoints estándar CRUD
- [ ] Endpoint especial: `POST /api/v1/saved-meals/:id/use` — registra un `meal` a partir de un `savedMeal`, incrementa `times_used`
- [ ] Endpoint: `GET /api/v1/meals/today-summary` — totales del día
- [ ] Tests

**Commit:** `feat(api): endpoints de comidas`

#### T5.3 · Cliente API y store

- [ ] `src/api/meals.ts`
- [ ] `src/stores/meals.ts`

**Commit:** `feat(web): cliente y store de comidas`

#### T5.4 · Vista "Comidas — Hoy"

- [ ] Reemplazar `MealsView.vue` placeholder
- [ ] Estructura del doc 03 §5.4
- [ ] Sección macros del día (con barras si hay objetivos en perfil)
- [ ] Lista de comidas de hoy con horario
- [ ] Sección "Comidas guardadas" con búsqueda
- [ ] Click en comida guardada → modal pidiendo solo tipo de ingesta y hora

**Commit:** `feat(web): vista comidas hoy`

#### T5.5 · Formulario "Nueva comida"

- [ ] Modal con campos: nombre (con autocomplete de saved_meals), tipo, hora, kcal, P, C, G
- [ ] Checkbox "Guardar también como comida frecuente"
- [ ] Validación con Zod
- [ ] Atajo Cmd+S

**Commit:** `feat(web): formulario nueva comida`

#### T5.6 · Vista "Comidas guardadas"

- [ ] Ruta `/meals/saved`
- [ ] Lista con favoritas arriba, ordenadas por times_used
- [ ] Editar/eliminar
- [ ] Toggle favorita

**Commit:** `feat(web): gestión de comidas guardadas`

#### T5.7 · Objetivos de macros en perfil

- [ ] Sección en `ProfileView.vue` para definir objetivos diarios
- [ ] Si están definidos, en vista de comidas mostrar barras de progreso

**Commit:** `feat(web): objetivos de macros opcionales`

#### T5.8 · Histórico de comidas

- [ ] Ruta `/meals/history` con días navegables
- [ ] Selector de mes
- [ ] Click en día → comidas de ese día

**Commit:** `feat(web): histórico de comidas`

#### T5.9 · Dashboard integra comidas

- [ ] Botón "+ Comida" del dashboard navega a vista comidas
- [ ] Widget de macros del día en el dashboard

**Commit:** `feat(web): integrar comidas en dashboard`

### Definition of Done del Sprint 5

- ✅ Registrar una comida nueva: < 30 segundos
- ✅ Reutilizar una comida guardada: < 10 segundos
- ✅ Ves tus macros del día en el dashboard
- ✅ Si has definido objetivos, barras de progreso aparecen
- ✅ Lint y typecheck pasan
- ✅ Usas la app 1 semana registrando tus comidas reales

---

## §9 Sprint 6 — Dashboard semanal y tendencias

> **Objetivo:** vistas agregadas semanales y mensuales que conectan todos los módulos. Es donde empiezas a sacar valor real de tener todos los datos juntos.

**Pre-condiciones:** Sprint 5 completo, idealmente con al menos 2 semanas de datos en todos los módulos.

**Entregable visible:** abres "Esta semana", ves resumen agregado de gym + comidas + salud. Comparativa con semana anterior. Tendencias de los últimos 30 días.

### Tareas en orden

#### T6.1 · Endpoints de dashboard

- [ ] `GET /api/v1/dashboard/today` — todo lo necesario para vista Hoy en una sola llamada
- [ ] `GET /api/v1/dashboard/week?date=...` — agregados semanales
- [ ] `GET /api/v1/dashboard/trends?metric=weight&from=...&to=...` — para mini-gráficas
- [ ] Tests

**Commit:** `feat(api): endpoints de dashboard agregados`

#### T6.2 · Vista "Esta semana"

- [ ] Tab "Semana" en `DashboardView.vue` (o ruta separada `/week`)
- [ ] Resumen: workouts hechos, kcal media, sueño medio, agua media, ánimo medio, peso inicio/fin
- [ ] Comparativa numérica con semana anterior (subió/bajó con flechas)
- [ ] Gráficas semanales agregadas

**Commit:** `feat(web): vista revisión semanal`

#### T6.3 · Vista "Tendencias de salud"

- [ ] Ruta `/health/trends`
- [ ] 4 mini-gráficas: peso, sueño, agua, ánimo (últimos 30 días default)
- [ ] Click en una → vista detalle con rango configurable
- [ ] Estadísticas: media, mín, máx, tendencia

**Commit:** `feat(web): tendencias de salud`

#### T6.4 · Personalización del dashboard (opcional)

Si te apetece y tienes ganas:

- [ ] Modo edición en dashboard con drag & drop
- [ ] Ocultar widgets de módulos que no usas

**Commit:** `feat(web): personalización del dashboard`

### Definition of Done del Sprint 6

- ✅ La vista semanal carga rápido (< 500ms)
- ✅ Comparativas con semana anterior son claras
- ✅ Las gráficas siguen la estética VitaRoot
- ✅ Lint y typecheck pasan

---

## §10 Sprint 7 — Pulido y export/import

> **Objetivo:** v1 acabada. Export/import funcional. Backup automático. Pulido visual y de microinteracciones. App lista para usar a diario sin reservas.

**Pre-condiciones:** Sprint 6 completo.

**Entregable visible:** todo lo anterior + puedes exportar/importar datos, hay backup automático cada 7 días, todas las animaciones están pulidas, hay modo oscuro funcional.

### Tareas en orden

#### T7.1 · Export de datos

- [ ] `POST /api/v1/system/export` — genera ZIP con JSON por módulo + CSV agregado
- [ ] Frontend: botón "Exportar todo" en ajustes con descarga del ZIP

**Commit:** `feat(system): export de datos a json y csv`

#### T7.2 · Import de datos

- [ ] `POST /api/v1/system/import` — recibe ZIP, valida con Zod, inserta con cuidado de duplicados
- [ ] Frontend: botón "Importar backup" con file picker
- [ ] Confirmación antes de aplicar
- [ ] Tests con datos válidos e inválidos

**Commit:** `feat(system): import de datos`

#### T7.3 · Backup automático

- [ ] `src/infrastructure/backup.ts` con función `runBackup()`
- [ ] Setup setInterval al arrancar el server según `profile.backupSettings`
- [ ] Copia `data/vitaroot.db` a `data/backups/vitaroot-YYYY-MM-DD.db`
- [ ] Rotación: mantener últimos N
- [ ] Config en ajustes: enabled, intervalDays, keepLastN

**Commit:** `feat(system): backup automático configurable`

#### T7.4 · Plantillas de rutinas (US-GYM-06)

- [ ] CRUD de workout templates
- [ ] Botón "Empezar desde plantilla" en `/gym/new`
- [ ] Pre-rellena ejercicios con sets vacíos

**Commit:** `feat(gym): plantillas de rutinas`

#### T7.5 · Modo oscuro

- [ ] Implementar paleta oscura del doc 03 §2.2
- [ ] Toggle en perfil: auto/claro/oscuro
- [ ] Persistir preferencia
- [ ] Verificar TODAS las pantallas y componentes en modo oscuro

**Commit:** `feat(ui): modo oscuro completo`

#### T7.6 · Pulido visual general

- [ ] Revisar TODAS las pantallas con checklist:
  - Espaciado generoso (calma japonesa)
  - Animaciones de entrada coreografiadas
  - Skeletons en cargas
  - Empty states con copy bonito
  - Errores user-friendly
- [ ] Pulir cualquier detalle que chirríe

**Commit:** `style: pulido visual general`

#### T7.7 · Microinteracciones finales

- [ ] Pull to refresh
- [ ] Vibración háptica donde aplique (web vibration API)
- [ ] Confirmaciones con animación de check
- [ ] Loading de IA reemplazado por "raíz creciendo" cuando hay carga lenta
- [ ] Sonido sutil opcional al guardar (toggle en perfil, off por defecto)

**Commit:** `feat(ui): microinteracciones pulidas`

#### T7.8 · Accesibilidad

- [ ] Auditar con DevTools accessibility checker
- [ ] Aria-labels en iconos sin texto
- [ ] Focus visible en todo elemento interactivo
- [ ] Contraste verificado en modo claro y oscuro
- [ ] Tab order correcto

**Commit:** `a11y: auditoría completa`

#### T7.9 · README final

- [ ] README con: qué es VitaRoot, screenshot, cómo correr, stack
- [ ] Sección "decisiones técnicas" linkeando a docs
- [ ] Sección de gracias / créditos

**Commit:** `docs: readme final`

### Definition of Done del Sprint 7 (= V1)

- ✅ Puedes exportar e importar tus datos
- ✅ Backup automático funciona
- ✅ Modo oscuro completo
- ✅ Todas las pantallas pulidas visualmente
- ✅ Accesibilidad básica cubierta
- ✅ README presentable
- ✅ La usas todos los días y te alegras de abrirla
- ✅ Has dejado de usar Strong / MyFitnessPal / libreta

🎉 **V1 lista.**

---

## §11 Definition of Done global

Aplicable a cualquier tarea de cualquier sprint. Una tarea no está completa hasta que:

- ✅ Implementa los criterios de aceptación del doc 02
- ✅ TypeScript compila sin errores ni warnings
- ✅ Lint pasa sin errores
- ✅ Tests escritos (si la tarea lo requería)
- ✅ La UI sigue el sistema de diseño del doc 03
- ✅ Hay manejo de errores y loading states
- ✅ Funciona en desktop a 1280×720, 1440×900 y 1920×1080
- ✅ Atajos de teclado registrados si aplica
- ✅ Animaciones cuidadas si aplica
- ✅ Documentación inline donde sea no obvio
- ✅ Commit con mensaje claro siguiendo convención del doc 04
- ✅ Has probado tú mismo la feature (no solo "compila")

---

## §12 CLAUDE.md (instrucciones para Claude Code)

Este es el archivo más importante del repo. Va en la **raíz del proyecto**. Claude Code lo lee al iniciar cada sesión.

> **Crea este archivo al principio del Sprint 1 (tarea T1.1).** Contenido a copiar tal cual:

```markdown
# VitaRoot · Instrucciones para Claude Code

Eres el desarrollador de VitaRoot. Antes de cualquier acción, lee este archivo entero.

## Qué es VitaRoot

App personal de tracking de salud (gym + comidas + salud), local-only, sin servicios externos. Sin IA. Stack: Vue 3 + Vite + TypeScript en frontend, Node.js + Fastify + Drizzle + SQLite en backend.

## Documentación que DEBES leer antes de implementar

Cuando el usuario te pida implementar algo:

1. **Siempre lee primero** `docs/01-vision-y-principios.md` (al menos las secciones de principios)
2. Para tareas funcionales: `docs/02-especificacion-funcional.md` (busca la US referenciada)
3. Para UI: `docs/03-diseno-ux-ui.md` (sistema de diseño)
4. Para decisiones técnicas: `docs/04-arquitectura-tecnica.md` (ADRs)
5. Para BD: `docs/05-modelo-de-datos.md`
6. Para plan de trabajo: `docs/06-plan-implementacion.md` (busca la tarea referenciada)

**No improvises.** Si algo no está documentado, pregunta antes de inventar.

## Reglas no negociables

### Estilo de código

- TypeScript estricto. **Cero `any`**. Usa `unknown` + narrowing.
- Validación con Zod en todos los inputs externos.
- Imports absolutos: `@/` (web) o desde `@vitaroot/shared`.
- Naming:
  - Archivos: kebab-case (`gym.routes.ts`, `workout-card.vue`)
  - Componentes Vue: PascalCase (`WorkoutCard`)
  - Composables: `use<Algo>` (`useWorkouts`)
  - Constantes: UPPER_SNAKE_CASE

### Arquitectura

- Backend: capas Presentation → Application → Domain → Infrastructure.
- **No queries SQL fuera de repositories.**
- **No lógica de dominio fuera de `*.domain.ts`.**
- Frontend: Views → Components → Composables → Stores → API.
- Tipos compartidos en `packages/shared`, nunca duplicar.

### UI

- Sigue el sistema de diseño de `docs/03-diseno-ux-ui.md`.
- Solo usa tokens definidos (colores, espacios, radios, duraciones).
- **Si necesitas un valor nuevo**, pregunta antes de inventarlo.
- Iconos: solo desde `lucide-vue-next`.
- Mobile-aware pero **desktop-first**.
- Estética: calma japonesa. Silencio visual. Animaciones generosas.

### Workflow

- Tarea a tarea, no sprint entero de golpe.
- Al acabar una tarea: lint + typecheck + commit con mensaje siguiendo convención.
- Si una decisión técnica afecta a varios módulos: para, propón un ADR nuevo, espera aprobación.

### Commits

Formato:
```
<tipo>(<scope>): <descripción>

[cuerpo opcional]
```

Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`.

Ejemplos:
- `feat(gym): añadir endpoint POST /workouts`
- `fix(health): corregir cálculo de horas dormidas con cambio de día`

## Anti-patterns prohibidos

- ❌ `any` en TypeScript
- ❌ Estilos inline (excepto valores dinámicos: `style="transform: translateX(${x}px)"`)
- ❌ Hardcodear colores/espacios/durations (siempre tokens)
- ❌ Llamadas fetch sueltas en componentes (usar composables/stores)
- ❌ Reproducir lógica de dominio en frontend (calcular PRs, etc.) — eso vive en backend
- ❌ Componentes Vue > 200 líneas (descomponer)
- ❌ Funciones > 50 líneas (refactorizar)
- ❌ Endpoints sin validación Zod
- ❌ Servicios externos (estamos local-only)

## Si no estás seguro

Pregunta. Mejor 2 minutos de aclaración que 2 horas de refactor.

## Cuando termines una tarea

1. Run `pnpm typecheck` y `pnpm lint` en el workspace afectado
2. Resume qué cambios hiciste en máximo 5 bullet points
3. Espera review del usuario antes de hacer commit
```

### 12.1. Cómo usar `CLAUDE.md`

Al abrir Claude Code en el directorio del proyecto, el archivo se lee automáticamente. Cuando empieces una sesión, di simplemente:

> "Vamos con la tarea T2.3 del Sprint 2. Lee la documentación necesaria y empezamos."

Y Claude Code sabrá:
- Leer doc 02 para entender la US
- Leer doc 04 para la arquitectura
- Leer doc 05 para el schema
- Seguir las reglas del CLAUDE.md
- No improvisar

### 12.2. Iterar el CLAUDE.md

Si durante el desarrollo notas que Claude Code repite los mismos errores, **añade reglas al CLAUDE.md**. Es un documento vivo.

---

## §13 Estado del documento

- **Versión:** 1.0
- **Estado:** Propuesto, pendiente validación
- **Próxima revisión:** después del Sprint 1 (ajustes con código real)

---

## Fin del paquete de diseño 🌱

Si estás leyendo esto, tienes los 6 documentos que componen el diseño completo de VitaRoot:

1. ✅ `01-vision-y-principios.md`
2. ✅ `02-especificacion-funcional.md`
3. ✅ `03-diseno-ux-ui.md`
4. ✅ `04-arquitectura-tecnica.md`
5. ✅ `05-modelo-de-datos.md`
6. ✅ `06-plan-implementacion.md`

**Está todo lo que necesitas.** Ahora abres Claude Code, le señalas la carpeta `docs/` con `CLAUDE.md` en la raíz, le dices *"vamos con la tarea T1.1 del Sprint 1"*, y arranca la construcción.

Que vaya bien. La estás haciendo bien.
