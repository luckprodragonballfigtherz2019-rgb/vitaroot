# 02 · Especificación Funcional — VitaRoot

> **Versión 2.0** · Espec actualizada para v2 del proyecto: sin IA, local-only, desktop-first. Las user stories que dependían de IA (registro por voz, foto, coach) se han eliminado. Comidas se ha simplificado.

---

## 📑 Índice

- [§0 Convenciones](#0-convenciones)
- [§1 Módulo Gym](#1-módulo-gym)
- [§2 Módulo Comidas](#2-módulo-comidas)
- [§3 Módulo Salud](#3-módulo-salud)
- [§4 Módulo Dashboard](#4-módulo-dashboard)
- [§5 Configuración / Sistema](#5-configuración--sistema)
- [§6 Priorización por sprint](#6-priorización-por-sprint)

---

## §0 Convenciones

### Formato de user story

```
US-XX-NN: [Título corto]
Como [usuario], quiero [acción] para [beneficio].

Criterios de aceptación:
- AC1: ...
- AC2: ...

Casos límite / consideraciones:
- ...
```

### Niveles de prioridad
- 🔴 **MUST** — sin esto v1 no funciona
- 🟡 **SHOULD** — debería estar en v1
- 🟢 **COULD** — bonito de tener, puede esperar a v2
- ⚪ **WON'T** — no se hace en v1

### Numeración
- `US-GYM-NN`, `US-MEAL-NN`, `US-HEALTH-NN`, `US-DASH-NN`, `US-SYS-NN`

---

## §1 Módulo Gym

### Concepto

Registro de **sesiones de entrenamiento de fuerza**. Modelo conceptual:

```
Workout (sesión)
  └── ExerciseEntry (un ejercicio dentro de la sesión)
       └── Set (cada serie con reps, peso, RPE opcional)
```

Hay un **catálogo de ejercicios** propio donde se guardan los movimientos con grupo muscular y notas técnicas.

### User stories

---

#### 🔴 US-GYM-01: Registrar un workout manualmente

Como atleta, quiero **un formulario excelente** para añadir un workout rápidamente desde mi PC.

**Criterios de aceptación:**
- AC1: Botón "+ Nuevo workout" siempre accesible en el módulo Gym
- AC2: Selector de ejercicios con búsqueda fuzzy ("press" → press banca, press militar, press inclinado…). Atajos de teclado para resultados (↑↓ enter).
- AC3: Para cada ejercicio: añadir sets uno a uno o "repetir último set" con un toque/atajo
- AC4: Auto-rellena el siguiente set con valores del set anterior (con opción "limpiar")
- AC5: Botones grandes y claros con atajos de teclado: `+ Set` (Enter), `+ Ejercicio` (Tab+N), `Guardar` (Cmd+S)
- AC6: Guardado optimista: la UI responde al instante, sincroniza con backend en background
- AC7: Editor inline en histórico (puedes editar workouts pasados)

**Casos límite:**
- Olvidé añadir un set después de guardar → poder editar workout pasado fácilmente
- Misma sesión, mismo ejercicio dos veces (drop sets) → permitir
- RPE opcional (1-10), no obligatorio

---

#### 🔴 US-GYM-02: Ver histórico de workouts

Como atleta, quiero **ver mis workouts pasados** organizados por fecha.

**Criterios de aceptación:**
- AC1: Lista cronológica inversa (más recientes arriba)
- AC2: Cada item muestra: fecha, día de la semana, duración, ejercicios principales (máx 3 + "...")
- AC3: Click → ficha completa del workout con todos los sets
- AC4: Filtros: por mes, por grupo muscular, por ejercicio concreto
- AC5: Búsqueda libre: "workouts donde hice sentadilla"
- AC6: Paginación de 30 en 30 o scroll infinito

**Casos límite:**
- Workouts del mismo día (mañana y tarde): mostrar ambos diferenciados por hora

---

#### 🟡 US-GYM-03: Ver progresión de un ejercicio

Como atleta, quiero **ver la evolución de un ejercicio concreto** en el tiempo.

**Criterios de aceptación:**
- AC1: Desde la ficha de un ejercicio del catálogo → "Ver progresión"
- AC2: Gráfica de peso máximo por sesión (línea temporal)
- AC3: Gráfica de volumen total (sets × reps × peso) por sesión
- AC4: Tabla con últimas N sesiones del ejercicio
- AC5: Highlight visual de **récords personales** (PR de peso, de volumen, de reps)
- AC6: Selector de rango temporal: 1 mes / 3 meses / 6 meses / 1 año / todo

---

#### 🟡 US-GYM-04: Récords personales (PRs) destacados

Como atleta, quiero **ver mis PRs** y que la app me avise cuando bato uno.

**Criterios de aceptación:**
- AC1: Al guardar un set que supera un PR previo del mismo ejercicio, mostrar badge animado
- AC2: Tipos de PR: peso máximo, reps máximas a un peso dado, volumen máximo por sesión
- AC3: Sección "Mis PRs" en el módulo gym con vista de todos los PRs por ejercicio
- AC4: La animación de PR es **discreta pero satisfactoria** (no party mode con confeti)

---

#### 🔴 US-GYM-05: Catálogo de ejercicios

Como atleta, quiero **gestionar mi catálogo de ejercicios**.

**Criterios de aceptación:**
- AC1: Lista de ejercicios con filtro por grupo muscular
- AC2: Cada ejercicio tiene: nombre, grupo muscular principal, grupos secundarios (opt), notas técnicas (opt)
- AC3: Crear ejercicio nuevo manualmente
- AC4: Editar ejercicios existentes (renombrar afecta histórico, sin perder datos)
- AC5: Eliminar ejercicio: si tiene histórico, archivar en lugar de borrar
- AC6: Pre-poblado con ~50 ejercicios comunes en español (script de seed)

---

#### 🟢 US-GYM-06: Rutinas predefinidas (plantillas)

Como atleta, quiero **guardar rutinas como plantillas** ("Día Push", "Día Pull").

**Criterios de aceptación:**
- AC1: Crear plantilla desde un workout existente ("guardar como plantilla")
- AC2: Crear plantilla desde cero
- AC3: Lista de plantillas en módulo gym
- AC4: "Empezar workout desde plantilla" → pre-rellena ejercicios, falta solo registrar sets

---

#### ⚪ US-GYM-07 (v2+): Importar workouts de Strong / Hevy
**No se hace en v1.**

---

#### ⚪ US-GYM-08 (eliminada): Registro por voz/texto natural con IA
**Eliminada.** Era la US-GYM-01 original. Sin IA, no aplica.

---

#### ⚪ US-GYM-09 (eliminada): Timer de descanso
**Aplazada a v2.** Solo tiene sentido en mobile (lo abres entre sets). En desktop no, porque estás en casa.

---

## §2 Módulo Comidas

### Concepto

Registro **simplificado** de comidas como "plato + macros aproximadas".

```
Meal (una ingesta)
  ├── name (texto libre: "Pollo con arroz y brócoli")
  ├── type (desayuno / comida / snack / cena)
  ├── time
  └── macros (kcal, proteína, carbs, grasas)

SavedMeal (comida guardada para reutilizar)
  ├── name
  ├── macros
  └── favorite (boolean)
```

**No hay desglose por alimento. No hay base de datos de alimentos. No hay foto.** Es deliberado: sin IA, esto sería un infierno de fricción.

### User stories

---

#### 🔴 US-MEAL-01: Registrar una comida

Como persona, quiero **registrar una comida en menos de 30 segundos**.

**Criterios de aceptación:**
- AC1: Botón "+ Nueva comida" siempre accesible
- AC2: Formulario simple con:
  - Nombre del plato (texto libre)
  - Tipo de ingesta (selector: desayuno/comida/snack/cena, default según hora)
  - Hora (default: ahora, editable)
  - Macros: kcal, proteína (g), carbohidratos (g), grasas (g)
- AC3: Tab natural entre campos para registro rápido con teclado
- AC4: Sugerencia mientras escribes el nombre: busca en comidas anteriores y permite "Usar igual"
- AC5: Botón "Guardar" + atajo Cmd/Ctrl + S
- AC6: Tras guardar, opcional: botón "Guardar también como comida frecuente"

**Casos límite:**
- Macros no son obligatorias todas. Si solo registras kcal, se acepta (los otros campos quedan vacíos)
- Si no sabes las macros, puedes dejar todo vacío y solo registrar el nombre + hora (modo "diario libre")

---

#### 🔴 US-MEAL-02: Comidas guardadas / favoritas

Como persona que come **lo mismo a menudo**, quiero acceso rápido a mis comidas habituales.

**Criterios de aceptación:**
- AC1: Pantalla "Mis comidas guardadas" con lista
- AC2: Crear una nueva comida guardada manualmente o desde una comida existente
- AC3: Click en una comida guardada → se añade al día actual con sus macros (pidiendo solo el tipo de ingesta y hora)
- AC4: Editar/eliminar comidas guardadas
- AC5: Marcar como "favorita" → aparecen primero en la lista
- AC6: Búsqueda en la lista por nombre

**Casos límite:**
- Si editas una comida guardada, los registros pasados que la usaron **NO cambian** (son copias independientes)

---

#### 🔴 US-MEAL-03: Ver histórico de comidas y macros diarios

Como persona, quiero **ver el resumen del día y los días pasados**.

**Criterios de aceptación:**
- AC1: Vista "Hoy": todas las comidas del día con macros acumuladas (kcal · P · C · G)
- AC2: Vista "Semana": gráfica de barras con kcal/proteína/carbs/grasas por día
- AC3: Histórico por mes con días navegables
- AC4: Cada comida en la lista es editable y eliminable

---

#### 🟡 US-MEAL-04: Objetivos de macros (opcional)

Como persona con objetivos, quiero **definir mis macros diarias objetivo**.

**Criterios de aceptación:**
- AC1: Configurable en "Ajustes": kcal/proteína/carbs/grasas objetivo (todos opcionales)
- AC2: Si están definidos, vista "Hoy" muestra barra de progreso por macro
- AC3: Si no están definidos, vista "Hoy" solo muestra totales

---

#### ⚪ US-MEAL-05 (eliminada): Foto de comida con IA
**Eliminada.** Sin IA, no aplica.

---

#### ⚪ US-MEAL-06 (eliminada): Planificador semanal + lista de la compra
**Aplazada a v2.** Compleja para el alcance v1.

---

## §3 Módulo Salud

### Concepto

Registro de **4 métricas básicas**: agua, sueño, peso, ánimo.

### User stories

---

#### 🔴 US-HEALTH-01: Registrar consumo de agua

Como persona, quiero **incrementar mi consumo de agua diario** con un clic.

**Criterios de aceptación:**
- AC1: Widget en dashboard con: "X / Y vasos hoy" + botón "+1 vaso"
- AC2: Configurable: tamaño del vaso (default 250ml), objetivo diario (default 2L)
- AC3: Click derecho o icono "..." → opciones: añadir cantidad custom, restar
- AC4: Animación discreta al alcanzar objetivo del día

---

#### 🔴 US-HEALTH-02: Registrar sueño

Como persona, quiero **registrar mi sueño**.

**Criterios de aceptación:**
- AC1: Vista "Sueño" con: hora de acostarse, hora de despertar, calidad subjetiva (1-5 estrellas)
- AC2: Calcula horas dormidas automáticamente
- AC3: Nota libre opcional ("me desperté 2 veces")

---

#### 🔴 US-HEALTH-03: Registrar peso

Como persona, quiero **registrar mi peso** periódicamente.

**Criterios de aceptación:**
- AC1: Input rápido: número con decimal + botón "Guardar"
- AC2: Pre-rellena con el último peso registrado (para tocar solo lo que cambia)
- AC3: Default = momento actual; editable
- AC4: Lista histórica con gráfica de evolución (1 mes / 3 meses / 6 meses / 1 año / todo)
- AC5: Nota opcional ("antes de desayunar", "después de gym")

---

#### 🔴 US-HEALTH-04: Registrar ánimo

Como persona, quiero **registrar mi estado de ánimo** del día.

**Criterios de aceptación:**
- AC1: Vista con escala 1-5 (emojis o iconos discretos, sin infantilismo)
- AC2: Nota corta opcional (≤140 caracteres)
- AC3: 1 registro por día (si vuelves, sobreescribes con confirmación)

---

#### 🟡 US-HEALTH-05: Ver tendencias

Como persona, quiero **ver gráficas simples** de evolución de las 4 métricas.

**Criterios de aceptación:**
- AC1: Vista "Tendencias" con 4 mini-gráficas (agua, sueño, peso, ánimo)
- AC2: Click en una → vista detalle con rango temporal configurable
- AC3: Estadísticas básicas: media, mín, máx del periodo

---

## §4 Módulo Dashboard

### Concepto

**Primera pantalla al abrir la app.** Vista unificada y accionable.

### User stories

---

#### 🔴 US-DASH-01: Vista "Hoy" en home

Como usuario, quiero **abrir VitaRoot y ver inmediatamente** lo que importa de hoy.

**Criterios de aceptación:**
- AC1: Al abrir, se carga directamente la vista "Hoy"
- AC2: Contenido (en orden de prioridad visual):
  - Saludo personalizado según hora del día ("Buenos días, [tu nombre]")
  - **Acciones rápidas**: botones grandes "+ Entreno", "+ Comida", "+ Agua"
  - **Resumen del día**: macros consumidas, vasos de agua, sueño anoche, ánimo
  - **Workout de hoy** si lo hubo (resumen breve)
- AC3: Datos cargados al instante con caché local
- AC4: Refresh manual con botón o tecla F5

**Casos límite:**
- Primera vez (sin datos): vista de bienvenida con call-to-action a configurar perfil

---

#### 🟡 US-DASH-02: Vista "Semana" — revisión semanal

Como usuario, quiero **una vista de revisión semanal** para reflexionar.

**Criterios de aceptación:**
- AC1: Tab "Semana" en dashboard
- AC2: Resumen agregado: workouts hechos, kcal promedio, sueño promedio, agua promedio, ánimo promedio, peso inicio/fin
- AC3: Comparativa numérica con semana anterior (subió/bajó)
- AC4: Gráficas semanales agregadas de los 4 módulos

---

#### 🟢 US-DASH-03: Personalización del dashboard

Como usuario, quiero **reordenar / ocultar widgets**.

**Criterios de aceptación:**
- AC1: Modo edición → drag & drop de widgets
- AC2: Ocultar widgets de módulos que no uso esa temporada

---

#### ⚪ US-DASH-04 (eliminada): Insight diario del coach IA
**Eliminada.** Sin IA, no aplica.

---

## §5 Configuración / Sistema

---

#### 🔴 US-SYS-01: Mi perfil

Como usuario, quiero **un perfil con mis datos básicos**.

**Criterios de aceptación:**
- AC1: Sección "Perfil" en ajustes
- AC2: Campos: nombre, edad, altura, peso actual (referencia al último registro), unidades (métrico/imperial)
- AC3: Los datos del perfil afectan a algunos cálculos del dashboard (BMI opcional, edad para macros sugeridas, etc.)

---

#### 🔴 US-SYS-02: Tema visual

Como usuario, quiero **modo claro y oscuro**.

**Criterios de aceptación:**
- AC1: Selector: auto / claro / oscuro (default: claro, según decisión del doc 03)
- AC2: Modo oscuro coherente con la estética orgánica de VitaRoot (no negro puro)

---

#### 🔴 US-SYS-03: Exportar mis datos

Como usuario, quiero **exportar todos mis datos** en JSON / CSV.

**Criterios de aceptación:**
- AC1: Botón "Exportar todo" en ajustes → genera ZIP con JSON por módulo + CSV agregado
- AC2: Backup manual del archivo de BD copiándolo a otra ubicación (la app muestra dónde está)

---

#### 🔴 US-SYS-04: Importar / restaurar datos

Como usuario, quiero **poder importar un backup** o un archivo .db existente.

**Criterios de aceptación:**
- AC1: Botón "Importar backup" → permite subir un JSON exportado anteriormente
- AC2: Botón "Restaurar BD" → permite reemplazar el archivo `.db` con una copia anterior (con confirmación)

---

#### 🟢 US-SYS-05: Backup automático

Como usuario, quiero que la app **haga backups automáticos** de la BD periódicamente.

**Criterios de aceptación:**
- AC1: Cada N días (configurable, default 7), la app copia `vitaroot.db` a una carpeta `backups/` con timestamp
- AC2: Mantiene los últimos N backups (configurable, default 10)
- AC3: Configurable en ajustes (activar/desactivar, frecuencia, ubicación)

---

#### ⚪ US-SYS-06 (eliminada): Auth con password
**Eliminada en v1.** Local-only, no aplica. Si en v2 se abre a LAN, se reintroduce.

---

#### ⚪ US-SYS-07 (eliminada): PWA instalable
**Aplazada a v2.** Local-only, navegador del PC.

---

## §6 Priorización por sprint

> Orientativa. La versión vinculante está en el documento 07 (Plan de Implementación).

### Sprint 1 — Cimientos
Setup del repo, Vue + Vite + TS, Fastify + Drizzle + SQLite, layout base, sidebar. Sin features de usuario, pero al final ya se navega entre páginas vacías.

### Sprint 2 — Módulo Salud (el más simple, valida arquitectura)
- 🔴 US-HEALTH-01, 02, 03, 04
- 🔴 US-DASH-01 (versión básica con widgets de salud)
- 🔴 US-SYS-01, 02

### Sprint 3 — Módulo Gym
- 🔴 US-GYM-01 (manual con UX excelente)
- 🔴 US-GYM-02 (histórico)
- 🔴 US-GYM-05 (catálogo)

### Sprint 4 — Módulo Gym (progresión y PRs)
- 🟡 US-GYM-03 (progresión)
- 🟡 US-GYM-04 (PRs)

### Sprint 5 — Módulo Comidas
- 🔴 US-MEAL-01 (registro)
- 🔴 US-MEAL-02 (comidas guardadas)
- 🔴 US-MEAL-03 (histórico)
- 🟡 US-MEAL-04 (objetivos)

### Sprint 6 — Dashboard semanal y tendencias
- 🟡 US-DASH-02 (semana)
- 🟡 US-HEALTH-05 (tendencias)
- 🟢 US-DASH-03 (personalización)

### Sprint 7 — Exportar / importar / pulido final
- 🔴 US-SYS-03 (exportar)
- 🔴 US-SYS-04 (importar)
- 🟢 US-SYS-05 (backup automático)
- 🟢 US-GYM-06 (plantillas)
- Pulido visual, animaciones finales, micro-detalles

### Backlog para v2+
Todo lo verde 🟢 y todo lo blanco ⚪.

---

## 7. Estado del documento

- **Versión:** 2.0 — adaptado a proyecto local sin IA
- **Estado:** Propuesto, pendiente de validación
