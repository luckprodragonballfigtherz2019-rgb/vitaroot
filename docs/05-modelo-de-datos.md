# 05 · Modelo de Datos — VitaRoot

> **Versión 1.0** · Schema completo de SQLite con Drizzle ORM. Tablas, campos, relaciones, índices y reglas de modelado.
> Este documento es la fuente de verdad de la estructura de datos. Cualquier cambio requiere migración generada con `drizzle-kit generate`.

---

## 📑 Índice

- [§1 Principios de modelado](#1-principios-de-modelado)
- [§2 Convenciones](#2-convenciones)
- [§3 Diagrama entidad-relación](#3-diagrama-entidad-relación)
- [§4 Schema completo por módulo](#4-schema-completo-por-módulo)
  - [§4.1 Sistema (perfil, configuración)](#41-sistema-perfil-configuración)
  - [§4.2 Módulo Gym](#42-módulo-gym)
  - [§4.3 Módulo Comidas](#43-módulo-comidas)
  - [§4.4 Módulo Salud](#44-módulo-salud)
- [§5 Índices](#5-índices)
- [§6 Restricciones y validaciones](#6-restricciones-y-validaciones)
- [§7 Decisiones de modelado (DDRs)](#7-decisiones-de-modelado-ddrs)
- [§8 Seed inicial](#8-seed-inicial)
- [§9 Estrategia de migraciones](#9-estrategia-de-migraciones)
- [§10 Archivo schema.ts completo](#10-archivo-schemats-completo)

---

## §1 Principios de modelado

### 1.1. Simple por defecto, JSON para flexibilidad
Tablas relacionales para todo lo que tiene estructura clara. Campos `meta` JSON solo para contexto extensible (notas variables, datos de wearables futuros).

### 1.2. Foreign keys con ON DELETE CASCADE donde tenga sentido
Si borras un workout, sus `exerciseEntries` y `sets` desaparecen con él. No hay datos huérfanos.

### 1.3. Soft delete solo donde se justifica
Por defecto borrado físico. Solo los ejercicios del catálogo tienen soft delete (`archived: boolean`) porque si los borras de verdad pierdes la integridad del histórico.

### 1.4. UUIDs como primary keys
Generados en aplicación (`crypto.randomUUID()`), no autoincrementales. Razones:
- Migración futura más fácil (si en v2 hay multi-device sync, no chocan)
- IDs no exponen volumen de datos
- Inmutables aunque cambies de BD

### 1.5. Timestamps Unix en INTEGER
SQLite no tiene tipo nativo de fecha. Usamos `INTEGER` con segundos Unix. Drizzle abstrae esto con `{ mode: 'timestamp' }`.

### 1.6. Booleans como INTEGER 0/1
SQLite no tiene boolean nativo. Drizzle abstrae con `{ mode: 'boolean' }`.

### 1.7. Campo `source` en registros de salud y gym
Aunque en v1 todo es manual, dejamos preparada la integración futura con wearables. Cada registro tiene `source: 'manual'` por defecto.

### 1.8. Campo `meta` JSON donde tenga sentido
Permite añadir contexto sin migrar BD. Ejemplo: `weight.meta = { fastedState: true, afterTraining: false }`.

---

## §2 Convenciones

### 2.1. Naming de tablas
- **snake_case** en BD (Drizzle lo gestiona)
- **camelCase** en TypeScript
- Plural: `workouts`, `meals`, `water_logs`
- Tablas de relación: nombre que describa la relación (`exercise_entries`, no `workouts_exercises`)

### 2.2. Naming de columnas
- **snake_case** en BD, **camelCase** en TS
- Primary key siempre `id`
- Foreign keys: `<entidad>_id` (e.g., `workout_id`, `exercise_id`)
- Timestamps: `created_at`, `updated_at`, `<accion>_at`

### 2.3. Tipos comunes
- `id`: `text('id').primaryKey()` con UUID
- Timestamps: `integer('xxx_at', { mode: 'timestamp' })`
- Booleans: `integer('xxx', { mode: 'boolean' })`
- Decimales (peso, macros): `real()` (SQLite REAL = double precision)
- JSON: `text('meta', { mode: 'json' }).$type<MyType>()`

### 2.4. Defaults
- `created_at`: `sql\`(unixepoch())\`` automático
- `id`: `$defaultFn(() => crypto.randomUUID())`
- Booleans: explícitos siempre

---

## §3 Diagrama entidad-relación

```
┌──────────────────┐
│     profile      │  (singleton: 1 sola fila)
│ ─────────────────│
│  id (uuid)       │
│  name            │
│  birthdate       │
│  height_cm       │
│  units           │
│  macro_targets   │ (JSON)
│  water_settings  │ (JSON)
│  backup_settings │ (JSON)
└──────────────────┘

┌══════════════════════════════════════════════════════════════════┐
║                          MÓDULO GYM                              ║
└══════════════════════════════════════════════════════════════════┘

┌──────────────────┐         ┌────────────────────┐
│   exercises      │         │     workouts       │
│ ─────────────────│         │ ───────────────────│
│  id              │         │  id                │
│  name            │         │  date              │
│  muscle_group    │         │  notes             │
│  secondary_      │         │  duration_min      │
│   muscles (JSON) │         │  source            │
│  notes           │         │  created_at        │
│  archived        │         └─────────┬──────────┘
│  created_at      │                   │ 1:N
└────────┬─────────┘                   │
         │ 1:N                         │
         │                  ┌──────────▼──────────┐
         │                  │  exercise_entries   │
         │                  │ ────────────────────│
         └──────────────────│  id                 │
                            │  workout_id (FK)    │
                            │  exercise_id (FK)   │
                            │  order              │
                            │  notes              │
                            └──────────┬──────────┘
                                       │ 1:N
                            ┌──────────▼──────────┐
                            │       sets          │
                            │ ────────────────────│
                            │  id                 │
                            │  exercise_entry_id  │
                            │  set_number         │
                            │  reps               │
                            │  weight             │
                            │  rpe (nullable)     │
                            │  is_warmup          │
                            └─────────────────────┘

┌──────────────────────┐
│  workout_templates   │
│ ─────────────────────│
│  id                  │
│  name                │
│  description         │
│  exercises (JSON)    │
│  created_at          │
└──────────────────────┘

┌══════════════════════════════════════════════════════════════════┐
║                       MÓDULO COMIDAS                             ║
└══════════════════════════════════════════════════════════════════┘

┌──────────────────────┐         ┌──────────────────────┐
│       meals          │         │    saved_meals       │
│ ─────────────────────│         │ ─────────────────────│
│  id                  │         │  id                  │
│  name                │         │  name                │
│  meal_type           │         │  default_meal_type   │
│  occurred_at         │         │  kcal                │
│  kcal                │         │  protein_g           │
│  protein_g           │         │  carbs_g             │
│  carbs_g             │         │  fat_g               │
│  fat_g               │         │  is_favorite         │
│  notes               │         │  times_used          │
│  saved_meal_id (FK?) │─ ─ ─ ─ ─│  created_at          │
│  source              │         └──────────────────────┘
│  created_at          │
└──────────────────────┘

┌══════════════════════════════════════════════════════════════════┐
║                       MÓDULO SALUD                               ║
└══════════════════════════════════════════════════════════════════┘

┌──────────────────────┐
│    water_logs        │
│ ─────────────────────│
│  id                  │
│  occurred_at         │
│  amount_ml           │
│  source              │
└──────────────────────┘

┌──────────────────────┐
│    sleep_logs        │
│ ─────────────────────│
│  id                  │
│  bedtime             │
│  wake_time           │
│  duration_min (calc) │
│  quality (1-5)       │
│  notes               │
│  meta (JSON)         │
│  source              │
└──────────────────────┘

┌──────────────────────┐
│    weight_logs       │
│ ─────────────────────│
│  id                  │
│  occurred_at         │
│  weight_kg           │
│  notes               │
│  meta (JSON)         │
│  source              │
└──────────────────────┘

┌──────────────────────┐
│    mood_logs         │
│ ─────────────────────│
│  id                  │
│  date (date only)    │
│  score (1-5)         │
│  notes               │
│  meta (JSON)         │
│  source              │
└──────────────────────┘
```

---

## §4 Schema completo por módulo

### §4.1 Sistema (perfil, configuración)

#### Tabla `profile`

Singleton. Solo hay una fila siempre (un único usuario).

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT | string | UUID, fijo (siempre el mismo) |
| `name` | TEXT NOT NULL | string | Tu nombre |
| `birthdate` | INTEGER (timestamp) | Date \| null | Fecha de nacimiento, opcional |
| `height_cm` | REAL | number \| null | Altura en cm |
| `units` | TEXT NOT NULL DEFAULT 'metric' | 'metric' \| 'imperial' | Sistema de unidades |
| `macro_targets` | TEXT (JSON) | MacroTargets \| null | Objetivos diarios opcionales |
| `water_settings` | TEXT (JSON) | WaterSettings | Tamaño vaso, objetivo |
| `backup_settings` | TEXT (JSON) | BackupSettings | Configuración backup automático |
| `theme` | TEXT DEFAULT 'auto' | 'auto' \| 'light' \| 'dark' | Tema visual |
| `created_at` | INTEGER (timestamp) | Date | |
| `updated_at` | INTEGER (timestamp) | Date | |

**Tipos JSON:**
```typescript
type MacroTargets = {
  kcal?: number
  proteinG?: number
  carbsG?: number
  fatG?: number
}

type WaterSettings = {
  glassSizeMl: number  // default: 250
  dailyGoalMl: number  // default: 2000
}

type BackupSettings = {
  enabled: boolean       // default: true
  intervalDays: number   // default: 7
  keepLastN: number      // default: 10
}
```

### §4.2 Módulo Gym

#### Tabla `exercises`

Catálogo de ejercicios del usuario.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `name` | TEXT NOT NULL | string | "Press banca", "Sentadilla"... |
| `muscle_group` | TEXT NOT NULL | MuscleGroup | Enum (ver abajo) |
| `secondary_muscles` | TEXT (JSON) | MuscleGroup[] | Músculos secundarios |
| `notes` | TEXT | string \| null | Notas técnicas |
| `archived` | INTEGER (boolean) DEFAULT 0 | boolean | Soft delete |
| `created_at` | INTEGER (timestamp) | Date | |

**Enum `MuscleGroup`** (constante TypeScript, no enum SQL):
```typescript
const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 
  'forearms', 'core', 'glutes', 'quads', 'hamstrings', 
  'calves', 'cardio', 'fullbody', 'other'
] as const
```

Etiquetas legibles en español viven en `packages/shared/src/labels.ts` (separación de datos y presentación).

**Constraint único:** `(name)` único. No puedes tener dos ejercicios llamados igual.

#### Tabla `workouts`

Una sesión de entrenamiento.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `date` | INTEGER (timestamp) NOT NULL | Date | Cuándo ocurrió |
| `notes` | TEXT | string \| null | Notas libres |
| `duration_min` | INTEGER | number \| null | Duración en minutos |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | manual / wearable / import |
| `created_at` | INTEGER (timestamp) | Date | |

**Enum `DataSource`:**
```typescript
const DATA_SOURCES = ['manual', 'wearable', 'import'] as const
```

#### Tabla `exercise_entries`

Un ejercicio dentro de un workout (con su orden).

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `workout_id` | TEXT FK NOT NULL | string | `workouts.id` ON DELETE CASCADE |
| `exercise_id` | TEXT FK NOT NULL | string | `exercises.id` RESTRICT |
| `order` | INTEGER NOT NULL | number | Orden dentro del workout |
| `notes` | TEXT | string \| null | Notas del ejercicio (e.g., "calentamiento ligero") |

**Constraint único:** `(workout_id, order)` único (no puede haber dos ejercicios con mismo orden en mismo workout).

#### Tabla `sets`

Una serie de un ejercicio.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `exercise_entry_id` | TEXT FK NOT NULL | string | `exercise_entries.id` ON DELETE CASCADE |
| `set_number` | INTEGER NOT NULL | number | Número de set (1, 2, 3...) |
| `reps` | INTEGER NOT NULL | number | Repeticiones |
| `weight` | REAL NOT NULL | number | Peso (kg o lb según units) |
| `rpe` | REAL | number \| null | Rate of Perceived Exertion (1-10) |
| `is_warmup` | INTEGER (boolean) DEFAULT 0 | boolean | Marcar series de calentamiento |

**Constraint único:** `(exercise_entry_id, set_number)` único.

**Check constraint:** `reps >= 0 AND weight >= 0 AND (rpe IS NULL OR (rpe >= 1 AND rpe <= 10))`.

#### Tabla `workout_templates`

Plantillas reutilizables de rutinas.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `name` | TEXT NOT NULL | string | "Día Push", "Día Pull"... |
| `description` | TEXT | string \| null | |
| `exercises` | TEXT (JSON) NOT NULL | TemplateExercise[] | Ver tipo abajo |
| `created_at` | INTEGER (timestamp) | Date | |
| `updated_at` | INTEGER (timestamp) | Date | |

```typescript
type TemplateExercise = {
  exerciseId: string
  order: number
  defaultSets: number   // sugerencia de cuántos sets
  defaultReps?: number  // opcional
  notes?: string
}
```

### §4.3 Módulo Comidas

#### Tabla `meals`

Una ingesta registrada.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `name` | TEXT NOT NULL | string | "Pollo con arroz y brócoli" |
| `meal_type` | TEXT NOT NULL | MealType | Enum |
| `occurred_at` | INTEGER (timestamp) NOT NULL | Date | Cuándo se comió |
| `kcal` | REAL | number \| null | Opcional |
| `protein_g` | REAL | number \| null | Opcional |
| `carbs_g` | REAL | number \| null | Opcional |
| `fat_g` | REAL | number \| null | Opcional |
| `notes` | TEXT | string \| null | |
| `saved_meal_id` | TEXT FK | string \| null | `saved_meals.id` ON DELETE SET NULL (referencia opcional) |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | |
| `created_at` | INTEGER (timestamp) | Date | |

**Enum `MealType`:**
```typescript
const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner', 'other'] as const
```

**Nota importante:** `saved_meal_id` es referencia "histórica". Si editas o eliminas una `saved_meal`, el `meal` que la usó **no cambia** (las macros están copiadas en el propio `meal`).

#### Tabla `saved_meals`

Comidas guardadas/favoritas para reutilizar rápido.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `name` | TEXT NOT NULL | string | Único entre `saved_meals` |
| `default_meal_type` | TEXT | MealType \| null | Tipo sugerido al añadir |
| `kcal` | REAL | number \| null | |
| `protein_g` | REAL | number \| null | |
| `carbs_g` | REAL | number \| null | |
| `fat_g` | REAL | number \| null | |
| `is_favorite` | INTEGER (boolean) DEFAULT 0 | boolean | Aparece primero en lista |
| `times_used` | INTEGER DEFAULT 0 | number | Contador de uso |
| `created_at` | INTEGER (timestamp) | Date | |
| `updated_at` | INTEGER (timestamp) | Date | |

**Constraint único:** `(name)` único.

### §4.4 Módulo Salud

#### Tabla `water_logs`

Cada incremento de agua es un registro independiente (permite editar/borrar entradas individuales).

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `occurred_at` | INTEGER (timestamp) NOT NULL | Date | Momento exacto |
| `amount_ml` | INTEGER NOT NULL | number | Cantidad en ml (default 250) |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | |

> **Decisión:** un registro por vaso, no un total diario. Más flexible (puedes borrar uno equivocado) y soporta importaciones de wearables futuras donde el dato viene granular.

#### Tabla `sleep_logs`

Una entrada por noche.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `bedtime` | INTEGER (timestamp) NOT NULL | Date | Hora de acostarse |
| `wake_time` | INTEGER (timestamp) NOT NULL | Date | Hora de despertar |
| `duration_min` | INTEGER NOT NULL | number | Calculado (wake_time - bedtime) en minutos |
| `quality` | INTEGER | number \| null | 1-5, opcional |
| `notes` | TEXT | string \| null | "me desperté 2 veces" |
| `meta` | TEXT (JSON) | SleepMeta \| null | Datos extra |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | |
| `created_at` | INTEGER (timestamp) | Date | |

```typescript
type SleepMeta = {
  deepSleepMin?: number      // si en v2 importas de wearable
  remSleepMin?: number
  awakenings?: number
}
```

**Check constraint:** `wake_time > bedtime AND (quality IS NULL OR (quality >= 1 AND quality <= 5))`.

**Constraint único:** `(bedtime)` — no puedes registrar dos sueños empezando exactamente al mismo segundo.

#### Tabla `weight_logs`

Registros de peso.

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `occurred_at` | INTEGER (timestamp) NOT NULL | Date | |
| `weight_kg` | REAL NOT NULL | number | Siempre en kg internamente (conversión en UI según `profile.units`) |
| `notes` | TEXT | string \| null | "antes de desayunar" |
| `meta` | TEXT (JSON) | WeightMeta \| null | |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | |
| `created_at` | INTEGER (timestamp) | Date | |

```typescript
type WeightMeta = {
  fastedState?: boolean
  afterTraining?: boolean
  bodyFatPct?: number      // para v2 si quieres tracking de %graso
}
```

**Check constraint:** `weight_kg > 0 AND weight_kg < 1000`.

#### Tabla `mood_logs`

Estado de ánimo diario. **Un registro por día** (date-only).

| Campo | Tipo SQLite | Tipo TS | Notas |
|---|---|---|---|
| `id` | TEXT PK | string | UUID |
| `date` | TEXT NOT NULL | string (YYYY-MM-DD) | Fecha en ISO, no timestamp |
| `score` | INTEGER NOT NULL | number | 1-5 |
| `notes` | TEXT | string \| null | ≤140 chars |
| `meta` | TEXT (JSON) | MoodMeta \| null | |
| `source` | TEXT NOT NULL DEFAULT 'manual' | DataSource | |
| `created_at` | INTEGER (timestamp) | Date | |
| `updated_at` | INTEGER (timestamp) | Date | |

```typescript
type MoodMeta = {
  energy?: number     // 1-5, opcional, para v2
  stress?: number     // 1-5, opcional, para v2
}
```

**Constraint único:** `(date)` único — un solo registro por día.

**Check constraint:** `score >= 1 AND score <= 5`.

> **Decisión:** ánimo usa `date` (texto YYYY-MM-DD) en vez de timestamp porque conceptualmente es "el día X" sin importar la hora. Esto simplifica el constraint de "1 por día".

---

## §5 Índices

Los índices que vamos a crear desde el día 1. Importante porque mejoran queries comunes y SQLite los aprovecha bien.

```sql
-- gym
CREATE INDEX idx_workouts_date ON workouts(date DESC);
CREATE INDEX idx_exercise_entries_workout ON exercise_entries(workout_id);
CREATE INDEX idx_sets_entry ON sets(exercise_entry_id);
CREATE INDEX idx_exercises_muscle ON exercises(muscle_group) WHERE archived = 0;

-- comidas
CREATE INDEX idx_meals_occurred ON meals(occurred_at DESC);
CREATE INDEX idx_meals_type_date ON meals(meal_type, occurred_at DESC);
CREATE INDEX idx_saved_meals_favorite ON saved_meals(is_favorite DESC, times_used DESC);

-- salud
CREATE INDEX idx_water_occurred ON water_logs(occurred_at DESC);
CREATE INDEX idx_sleep_bedtime ON sleep_logs(bedtime DESC);
CREATE INDEX idx_weight_occurred ON weight_logs(occurred_at DESC);
CREATE INDEX idx_mood_date ON mood_logs(date DESC);
```

**Queries que estos índices optimizan:**
- "Workouts del último mes" → `idx_workouts_date`
- "Comidas de hoy" → `idx_meals_occurred`
- "Comidas favoritas" → `idx_saved_meals_favorite`
- "Peso del último año" → `idx_weight_occurred`
- "Progresión de press banca" → joins via `idx_exercise_entries_workout` + `idx_sets_entry`

---

## §6 Restricciones y validaciones

### 6.1. Reglas en BD (check constraints + UNIQUE)
- Ya documentadas tabla por tabla arriba

### 6.2. Reglas en aplicación (Zod schemas)
Validaciones que SQLite no puede expresar bien (regex, lógica compuesta) viven en Zod, en `packages/shared`:

```typescript
export const SetSchema = z.object({
  id: z.string().uuid(),
  reps: z.number().int().min(0).max(1000),
  weight: z.number().min(0).max(10000),
  rpe: z.number().min(1).max(10).optional(),
  isWarmup: z.boolean().default(false),
})

export const WeightLogSchema = z.object({
  id: z.string().uuid(),
  occurredAt: z.coerce.date(),
  weightKg: z.number().positive().lt(1000),
  notes: z.string().max(500).optional(),
})

export const MoodLogSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  score: z.number().int().min(1).max(5),
  notes: z.string().max(140).optional(),
})
```

### 6.3. Reglas de dominio (en `module.domain.ts`)
Reglas más complejas que validan estado global:

```typescript
// Ejemplo: no puede haber 2 mood_logs el mismo día (BD ya lo asegura via unique)
// Ejemplo: workout sin al menos 1 exercise_entry con al menos 1 set debería rechazarse
export function validateWorkoutHasContent(workout: NewWorkoutInput): Result<void> {
  if (workout.entries.length === 0) return err('WORKOUT_EMPTY')
  if (workout.entries.some(e => e.sets.length === 0)) return err('EXERCISE_WITHOUT_SETS')
  return ok()
}
```

---

## §7 Decisiones de modelado (DDRs)

Mismo formato que ADRs pero para el modelo de datos.

### DDR-001 · Sets como tabla relacional, no JSON

**Contexto:** Cada workout tiene N ejercicios, cada ejercicio tiene N sets. Opción A: tablas relacionales. Opción B: JSON anidado en `workouts`.

**Decisión:** **Tablas relacionales (`workouts → exercise_entries → sets`).**

**Razones:**
- Queries del tipo "progresión de press banca" requieren joins. Con JSON tendrías que parsear cada workout entero.
- Índices funcionan mejor en columnas que en JSON.
- Cálculo de PRs es trivial con SQL.

**Trade-off:** más tablas, más joins. Pero el modelo se entiende mejor.

---

### DDR-002 · `weight_kg` siempre en kg, conversión en UI

**Contexto:** Soportar métrico/imperial.

**Decisión:** **BD siempre en kg.** El campo `profile.units` decide cómo se muestra y se convierte en UI.

**Razones:**
- Una sola "unidad canónica" simplifica queries (medias, mín/máx, gráficas)
- Cambiar unidades visualmente no requiere migrar datos
- Si en v2 importas wearables que vienen en lb, conviertes en el adaptador

---

### DDR-003 · Macros de `meals` se copian, no se referencian

**Contexto:** Cuando registras una comida desde una `saved_meal`, ¿guardamos solo el `saved_meal_id` o copiamos los valores?

**Decisión:** **Copiamos los valores** (`kcal`, `protein_g`, etc.) en el propio `meal`. El `saved_meal_id` se guarda solo como referencia histórica.

**Razones:**
- Si editas una `saved_meal` ("Pollo con arroz" antes era 600 kcal, ahora son 700), los registros pasados **no deben cambiar** retroactivamente.
- Si borras una `saved_meal`, los registros pasados siguen siendo válidos.

**Consecuencia:** ligera duplicación de datos. Aceptable.

---

### DDR-004 · `mood_logs` usa `date` (YYYY-MM-DD), no timestamp

**Contexto:** El ánimo es conceptualmente "del día", no "de un momento".

**Decisión:** Campo `date` como texto ISO (YYYY-MM-DD), `UNIQUE`.

**Razones:**
- Constraint "1 registro por día" es directo
- Queries por rango de fechas son fáciles (orden lexicográfico = orden cronológico en ISO)
- Sin problemas de zonas horarias (1 día = 1 string)

---

### DDR-005 · `water_logs` granular, no agregado diario

**Contexto:** Opción A: una fila por día con `total_ml`. Opción B: una fila por vaso/incremento.

**Decisión:** **Granular** (una fila por vaso).

**Razones:**
- Permite borrar un registro equivocado sin restar manualmente
- Permite ver "a qué hora bebes más"
- Compatible con import de wearables que vienen granulares
- El total diario se calcula con `SUM(amount_ml) WHERE date(occurred_at) = ?`

**Trade-off:** más filas en BD. Despreciable a tu escala.

---

### DDR-006 · `exercises.archived` (soft delete), `workouts` borrado físico

**Contexto:** Cuándo soft delete vs borrado real.

**Decisión:**
- **`exercises`**: soft delete (`archived: boolean`). Si lo borras de verdad, el histórico de workouts se rompe.
- **`workouts`**: borrado físico (con CASCADE a entries y sets). Si borras un workout, todo desaparece.
- **`saved_meals`**: borrado físico. La referencia desde `meals.saved_meal_id` se pone a NULL (ON DELETE SET NULL).
- **`meals`, `*_logs`**: borrado físico.

**Razón general:** mantener integridad histórica solo donde aporta valor.

---

### DDR-007 · `source` en lugar de booleans `is_manual`

**Contexto:** Marcar origen del dato.

**Decisión:** Campo `source: text` con enum extensible (`'manual' | 'wearable' | 'import'`) en lugar de booleans.

**Razones:**
- Permite añadir nuevas fuentes en v2 sin migrar
- Más expresivo: `'apple_health'`, `'garmin'` el día que se integren

---

### DDR-008 · No tabla de `users`

**Contexto:** Single user.

**Decisión:** **No hay tabla `users`.** Hay tabla `profile` singleton.

**Razones:**
- Cero `user_id` en todas las tablas → schemas más limpios
- Cero JOINs por usuario
- Si en v2 hay multi-user, la migración es: añadir tabla `users` + columna `user_id` en cada tabla. Migración real pero manejable.

---

### DDR-009 · Timestamps Unix (segundos), no ISO

**Contexto:** Cómo guardar fechas.

**Decisión:** `INTEGER` con segundos Unix.

**Razones:**
- Más compacto que texto ISO
- Comparaciones numéricas más rápidas que strings
- Drizzle abstrae con `{ mode: 'timestamp' }` y devuelve `Date`

**Excepción:** `mood_logs.date` que es solo fecha sin hora (ver DDR-004).

---

### DDR-010 · `workout_templates.exercises` como JSON

**Contexto:** Plantillas tienen lista de ejercicios sugeridos. ¿Tabla aparte o JSON?

**Decisión:** **JSON.**

**Razones:**
- Las plantillas son inmutables conceptualmente (cuando creas un workout desde una plantilla, copias)
- No necesitamos queries del tipo "qué plantillas usan press banca" en v1
- Si en v2 las necesitamos, migramos

---

## §8 Seed inicial

Script `apps/api/src/scripts/seed.ts` para pre-cargar datos al instalar:

### 8.1. Catálogo de ejercicios (~50)

```typescript
const SEED_EXERCISES = [
  // PECHO
  { name: 'Press banca', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'] },
  { name: 'Press inclinado con mancuernas', muscleGroup: 'chest', secondaryMuscles: ['shoulders'] },
  { name: 'Press declinado', muscleGroup: 'chest' },
  { name: 'Aperturas con mancuernas', muscleGroup: 'chest' },
  { name: 'Fondos en paralelas', muscleGroup: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Cruces en polea', muscleGroup: 'chest' },
  
  // ESPALDA
  { name: 'Dominadas', muscleGroup: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Jalón al pecho', muscleGroup: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Remo con barra', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'] },
  { name: 'Remo con mancuerna', muscleGroup: 'back' },
  { name: 'Remo sentado en polea', muscleGroup: 'back' },
  { name: 'Peso muerto', muscleGroup: 'back', secondaryMuscles: ['hamstrings', 'glutes'] },
  { name: 'Pull-over', muscleGroup: 'back', secondaryMuscles: ['chest'] },
  
  // HOMBROS
  { name: 'Press militar', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'] },
  { name: 'Press Arnold', muscleGroup: 'shoulders' },
  { name: 'Elevaciones laterales', muscleGroup: 'shoulders' },
  { name: 'Elevaciones frontales', muscleGroup: 'shoulders' },
  { name: 'Pájaros (rear delt)', muscleGroup: 'shoulders' },
  { name: 'Face pull', muscleGroup: 'shoulders' },
  
  // BÍCEPS
  { name: 'Curl con barra', muscleGroup: 'biceps' },
  { name: 'Curl con mancuernas', muscleGroup: 'biceps' },
  { name: 'Curl martillo', muscleGroup: 'biceps', secondaryMuscles: ['forearms'] },
  { name: 'Curl predicador', muscleGroup: 'biceps' },
  { name: 'Curl concentrado', muscleGroup: 'biceps' },
  
  // TRÍCEPS
  { name: 'Press francés', muscleGroup: 'triceps' },
  { name: 'Extensiones en polea', muscleGroup: 'triceps' },
  { name: 'Patada de tríceps', muscleGroup: 'triceps' },
  { name: 'Fondos en banco', muscleGroup: 'triceps' },
  { name: 'Press cerrado', muscleGroup: 'triceps', secondaryMuscles: ['chest'] },
  
  // PIERNA
  { name: 'Sentadilla con barra', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'] },
  { name: 'Sentadilla frontal', muscleGroup: 'quads' },
  { name: 'Prensa de piernas', muscleGroup: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Extensiones de cuádriceps', muscleGroup: 'quads' },
  { name: 'Zancadas', muscleGroup: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Hack squat', muscleGroup: 'quads' },
  { name: 'Peso muerto rumano', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes'] },
  { name: 'Curl femoral tumbado', muscleGroup: 'hamstrings' },
  { name: 'Curl femoral sentado', muscleGroup: 'hamstrings' },
  { name: 'Hip thrust', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'] },
  { name: 'Elevación de talones', muscleGroup: 'calves' },
  { name: 'Elevación de talones sentado', muscleGroup: 'calves' },
  
  // CORE
  { name: 'Plancha', muscleGroup: 'core' },
  { name: 'Crunch', muscleGroup: 'core' },
  { name: 'Elevaciones de piernas', muscleGroup: 'core' },
  { name: 'Rueda abdominal', muscleGroup: 'core' },
  { name: 'Russian twists', muscleGroup: 'core' },
  
  // CARDIO
  { name: 'Cinta de correr', muscleGroup: 'cardio' },
  { name: 'Bicicleta estática', muscleGroup: 'cardio' },
  { name: 'Elíptica', muscleGroup: 'cardio' },
  { name: 'Remo (máquina)', muscleGroup: 'cardio', secondaryMuscles: ['back'] },
]
```

### 8.2. Perfil inicial

```typescript
const SEED_PROFILE = {
  id: 'profile-singleton',
  name: 'Pablo',
  units: 'metric',
  theme: 'light',
  waterSettings: {
    glassSizeMl: 250,
    dailyGoalMl: 2000,
  },
  backupSettings: {
    enabled: true,
    intervalDays: 7,
    keepLastN: 10,
  },
}
```

### 8.3. Idempotencia del seed

El script debe ser idempotente: si lo ejecutas dos veces, no duplica nada. Pattern:

```typescript
async function seed() {
  // Profile: insert si no existe
  const existing = await db.select().from(profile).limit(1)
  if (existing.length === 0) {
    await db.insert(profile).values(SEED_PROFILE)
  }
  
  // Exercises: upsert por nombre
  for (const ex of SEED_EXERCISES) {
    await db.insert(exercises)
      .values(ex)
      .onConflictDoNothing({ target: exercises.name })
  }
}
```

---

## §9 Estrategia de migraciones

### 9.1. Workflow

1. Cambias `apps/api/drizzle/schema.ts`
2. Ejecutas `pnpm db:generate` → genera SQL migration en `drizzle/migrations/`
3. Revisas el SQL generado (importante)
4. Commiteas schema + migración
5. `pnpm db:migrate` aplica las migraciones pendientes

### 9.2. Reglas

- **Nunca** edites una migración ya aplicada
- **Siempre** revisa el SQL generado (drizzle-kit puede generar cosas no deseadas)
- **Cambios destructivos** (drop column, drop table) requieren migración manual con cuidado (en v1 con tus datos, no querrás perderlos)
- Nombrar migraciones de forma descriptiva: `0001_initial.sql`, `0002_add_workout_templates.sql`, etc.

### 9.3. Migraciones manuales cuando hace falta

Si necesitas algo que drizzle-kit no soporta bien (ej. añadir índice complejo, hacer rename de columna preservando datos), creas un archivo `.sql` manualmente en `drizzle/migrations/` y lo numeras correctamente.

### 9.4. Backup automático antes de migrar

El script de migración hace **backup de la BD antes de aplicar**:

```typescript
// Pseudocódigo en pnpm db:migrate
1. cp data/vitaroot.db data/backups/pre-migration-<timestamp>.db
2. Aplica migraciones
3. Si falla → restaura backup y lanza error
```

---

## §10 Archivo schema.ts completo

Este es el archivo `apps/api/drizzle/schema.ts` listo para usar con Drizzle. Comentado para que cuando vuelvas a él en 6 meses, entiendas cada decisión.

```typescript
import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

// ═══════════════════════════════════════════════════════════════
// PROFILE (singleton)
// ═══════════════════════════════════════════════════════════════

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  birthdate: integer('birthdate', { mode: 'timestamp' }),
  heightCm: real('height_cm'),
  units: text('units', { enum: ['metric', 'imperial'] }).notNull().default('metric'),
  macroTargets: text('macro_targets', { mode: 'json' }).$type<{
    kcal?: number
    proteinG?: number
    carbsG?: number
    fatG?: number
  }>(),
  waterSettings: text('water_settings', { mode: 'json' }).$type<{
    glassSizeMl: number
    dailyGoalMl: number
  }>().notNull().default(sql`'{"glassSizeMl":250,"dailyGoalMl":2000}'`),
  backupSettings: text('backup_settings', { mode: 'json' }).$type<{
    enabled: boolean
    intervalDays: number
    keepLastN: number
  }>().notNull().default(sql`'{"enabled":true,"intervalDays":7,"keepLastN":10}'`),
  theme: text('theme', { enum: ['auto', 'light', 'dark'] }).notNull().default('auto'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

// ═══════════════════════════════════════════════════════════════
// GYM — exercises, workouts, exercise_entries, sets, templates
// ═══════════════════════════════════════════════════════════════

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group').notNull(),
  secondaryMuscles: text('secondary_muscles', { mode: 'json' }).$type<string[]>().default([]),
  notes: text('notes'),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  nameUnique: uniqueIndex('idx_exercises_name_unique').on(t.name),
  muscleIdx: index('idx_exercises_muscle').on(t.muscleGroup),
}))

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
  durationMin: integer('duration_min'),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  dateIdx: index('idx_workouts_date').on(t.date),
}))

export const exerciseEntries = sqliteTable('exercise_entries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  notes: text('notes'),
}, (t) => ({
  workoutIdx: index('idx_exercise_entries_workout').on(t.workoutId),
  workoutOrderUnique: uniqueIndex('idx_entries_workout_order').on(t.workoutId, t.order),
}))

export const sets = sqliteTable('sets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  exerciseEntryId: text('exercise_entry_id').notNull().references(() => exerciseEntries.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  weight: real('weight').notNull(),
  rpe: real('rpe'),
  isWarmup: integer('is_warmup', { mode: 'boolean' }).notNull().default(false),
}, (t) => ({
  entryIdx: index('idx_sets_entry').on(t.exerciseEntryId),
  entryNumberUnique: uniqueIndex('idx_sets_entry_number').on(t.exerciseEntryId, t.setNumber),
}))

export const workoutTemplates = sqliteTable('workout_templates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  exercises: text('exercises', { mode: 'json' }).$type<Array<{
    exerciseId: string
    order: number
    defaultSets: number
    defaultReps?: number
    notes?: string
  }>>().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

// ═══════════════════════════════════════════════════════════════
// COMIDAS — meals, saved_meals
// ═══════════════════════════════════════════════════════════════

export const savedMeals = sqliteTable('saved_meals', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  defaultMealType: text('default_meal_type', {
    enum: ['breakfast', 'lunch', 'snack', 'dinner', 'other']
  }),
  kcal: real('kcal'),
  proteinG: real('protein_g'),
  carbsG: real('carbs_g'),
  fatG: real('fat_g'),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).notNull().default(false),
  timesUsed: integer('times_used').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  nameUnique: uniqueIndex('idx_saved_meals_name_unique').on(t.name),
  favoriteIdx: index('idx_saved_meals_favorite').on(t.isFavorite, t.timesUsed),
}))

export const meals = sqliteTable('meals', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  mealType: text('meal_type', {
    enum: ['breakfast', 'lunch', 'snack', 'dinner', 'other']
  }).notNull(),
  occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
  kcal: real('kcal'),
  proteinG: real('protein_g'),
  carbsG: real('carbs_g'),
  fatG: real('fat_g'),
  notes: text('notes'),
  savedMealId: text('saved_meal_id').references(() => savedMeals.id, { onDelete: 'set null' }),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  occurredIdx: index('idx_meals_occurred').on(t.occurredAt),
  typeOccurredIdx: index('idx_meals_type_date').on(t.mealType, t.occurredAt),
}))

// ═══════════════════════════════════════════════════════════════
// SALUD — water, sleep, weight, mood
// ═══════════════════════════════════════════════════════════════

export const waterLogs = sqliteTable('water_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
  amountMl: integer('amount_ml').notNull(),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
}, (t) => ({
  occurredIdx: index('idx_water_occurred').on(t.occurredAt),
}))

export const sleepLogs = sqliteTable('sleep_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  bedtime: integer('bedtime', { mode: 'timestamp' }).notNull(),
  wakeTime: integer('wake_time', { mode: 'timestamp' }).notNull(),
  durationMin: integer('duration_min').notNull(),
  quality: integer('quality'),
  notes: text('notes'),
  meta: text('meta', { mode: 'json' }).$type<{
    deepSleepMin?: number
    remSleepMin?: number
    awakenings?: number
  }>(),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  bedtimeIdx: index('idx_sleep_bedtime').on(t.bedtime),
  bedtimeUnique: uniqueIndex('idx_sleep_bedtime_unique').on(t.bedtime),
}))

export const weightLogs = sqliteTable('weight_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
  weightKg: real('weight_kg').notNull(),
  notes: text('notes'),
  meta: text('meta', { mode: 'json' }).$type<{
    fastedState?: boolean
    afterTraining?: boolean
    bodyFatPct?: number
  }>(),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  occurredIdx: index('idx_weight_occurred').on(t.occurredAt),
}))

export const moodLogs = sqliteTable('mood_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: text('date').notNull(), // YYYY-MM-DD
  score: integer('score').notNull(),
  notes: text('notes'),
  meta: text('meta', { mode: 'json' }).$type<{
    energy?: number
    stress?: number
  }>(),
  source: text('source', { enum: ['manual', 'wearable', 'import'] }).notNull().default('manual'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  dateUnique: uniqueIndex('idx_mood_date_unique').on(t.date),
}))

// ═══════════════════════════════════════════════════════════════
// RELATIONS (para queries con Drizzle relational API)
// ═══════════════════════════════════════════════════════════════

export const workoutsRelations = relations(workouts, ({ many }) => ({
  entries: many(exerciseEntries),
}))

export const exerciseEntriesRelations = relations(exerciseEntries, ({ one, many }) => ({
  workout: one(workouts, { fields: [exerciseEntries.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [exerciseEntries.exerciseId], references: [exercises.id] }),
  sets: many(sets),
}))

export const setsRelations = relations(sets, ({ one }) => ({
  entry: one(exerciseEntries, { fields: [sets.exerciseEntryId], references: [exerciseEntries.id] }),
}))

export const mealsRelations = relations(meals, ({ one }) => ({
  savedMeal: one(savedMeals, { fields: [meals.savedMealId], references: [savedMeals.id] }),
}))

// ═══════════════════════════════════════════════════════════════
// EXPORTAR TIPOS
// ═══════════════════════════════════════════════════════════════

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert
export type Exercise = typeof exercises.$inferSelect
export type NewExercise = typeof exercises.$inferInsert
export type Workout = typeof workouts.$inferSelect
export type NewWorkout = typeof workouts.$inferInsert
export type ExerciseEntry = typeof exerciseEntries.$inferSelect
export type Set = typeof sets.$inferSelect
export type WorkoutTemplate = typeof workoutTemplates.$inferSelect
export type Meal = typeof meals.$inferSelect
export type SavedMeal = typeof savedMeals.$inferSelect
export type WaterLog = typeof waterLogs.$inferSelect
export type SleepLog = typeof sleepLogs.$inferSelect
export type WeightLog = typeof weightLogs.$inferSelect
export type MoodLog = typeof moodLogs.$inferSelect
```

---

## §11 Queries comunes (referencia)

Las queries que Claude Code va a escribir más veces. Ten esto a mano:

### Workouts del último mes
```typescript
const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
const recent = await db.query.workouts.findMany({
  where: gte(workouts.date, lastMonth),
  orderBy: desc(workouts.date),
  with: {
    entries: {
      with: {
        exercise: true,
        sets: { orderBy: asc(sets.setNumber) }
      }
    }
  }
})
```

### Progresión de un ejercicio
```typescript
const progression = await db
  .select({
    date: workouts.date,
    maxWeight: max(sets.weight),
    totalVolume: sql<number>`SUM(${sets.weight} * ${sets.reps})`,
  })
  .from(sets)
  .innerJoin(exerciseEntries, eq(sets.exerciseEntryId, exerciseEntries.id))
  .innerJoin(workouts, eq(exerciseEntries.workoutId, workouts.id))
  .where(and(
    eq(exerciseEntries.exerciseId, exerciseId),
    eq(sets.isWarmup, false)
  ))
  .groupBy(workouts.id, workouts.date)
  .orderBy(asc(workouts.date))
```

### Total de agua del día
```typescript
const today = startOfDay(new Date())
const tomorrow = endOfDay(new Date())
const result = await db
  .select({ total: sql<number>`COALESCE(SUM(${waterLogs.amountMl}), 0)` })
  .from(waterLogs)
  .where(and(
    gte(waterLogs.occurredAt, today),
    lte(waterLogs.occurredAt, tomorrow)
  ))
```

### Macros del día
```typescript
const result = await db
  .select({
    kcal: sql<number>`COALESCE(SUM(${meals.kcal}), 0)`,
    protein: sql<number>`COALESCE(SUM(${meals.proteinG}), 0)`,
    carbs: sql<number>`COALESCE(SUM(${meals.carbsG}), 0)`,
    fat: sql<number>`COALESCE(SUM(${meals.fatG}), 0)`,
  })
  .from(meals)
  .where(and(
    gte(meals.occurredAt, today),
    lte(meals.occurredAt, tomorrow)
  ))
```

---

## §12 Estado del documento

- **Versión:** 1.0
- **Estado:** Propuesto, pendiente validación
- **Próxima revisión:** al implementar las primeras tablas (Sprint 1), por si surge necesidad de ajustes

---

## Próximo documento

**`07-plan-implementacion.md`** — sprints concretos, definition of done por feature, dependencias entre tareas, plan de trabajo paso a paso para Claude Code.

(El doc 06 era la capa IA, eliminado tras la simplificación del proyecto.)
