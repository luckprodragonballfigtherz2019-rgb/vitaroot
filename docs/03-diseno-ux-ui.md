# 03 · Diseño UX/UI — VitaRoot

> **Versión 2.0** · Sistema de diseño completo, adaptado a desktop-first y sin pantallas relacionadas con IA.

---

## 📑 Índice

- [§1 Principios de diseño](#1-principios-de-diseño)
- [§2 Sistema de diseño](#2-sistema-de-diseño)
- [§3 Componentes base](#3-componentes-base)
- [§4 Layout y navegación (desktop-first)](#4-layout-y-navegación-desktop-first)
- [§5 Wireframes por pantalla](#5-wireframes-por-pantalla)
- [§6 Flujos clave](#6-flujos-clave)
- [§7 Microinteracciones y animaciones](#7-microinteracciones-y-animaciones)
- [§8 Accesibilidad](#8-accesibilidad)
- [§9 Guía para Claude Code](#9-guía-para-claude-code)

---

## §1 Principios de diseño

### 1.1. Silencio visual, riqueza en interacción
La pantalla en reposo es **calmada, casi vacía**. Cuando la tocas, cobra vida. El contraste entre quietud y movimiento es la firma estética de VitaRoot.

### 1.2. La línea antes que el rectángulo
Preferimos separadores finos antes que cards con bordes pesados. Una línea de 1px puede dividir tan bien como una sombra, y mucho más elegantemente.

### 1.3. Tipografía como decoración
No usamos ilustraciones ni iconos llamativos como decoración. La tipografía es la decoración.

### 1.4. Espacio como respeto
Cada elemento merece aire. El padding generoso comunica calma. No comprimas porque "cabe más". En desktop tienes ancho de sobra.

### 1.5. Densidad de información calibrada
Como diseñamos para desktop: el dashboard puede tener 2-3 zonas con info diferenciada. Pero **nunca un dashboard sobrecargado** estilo Bloomberg.

### 1.6. Una sola fuente de color cálido
El blanco no es blanco. Es papel crudo. La app se siente analógica, cálida, táctil. No fría como un Excel.

---

## §2 Sistema de diseño

### 2.1. Paleta de color (Modo claro — principal)

```
═══════════════════════════════════════════════════════
NEUTROS (la base)
═══════════════════════════════════════════════════════
--paper          #F8F4ED   Fondo principal (papel crudo)
--paper-soft     #F2EDE3   Cards / superficies elevadas
--paper-deep     #E8E1D2   Hover, áreas hundidas
--ink            #2B2A26   Texto principal (no negro puro)
--ink-soft       #5C5A52   Texto secundario
--ink-faint      #9B968A   Texto terciario, placeholders
--line           #DDD6C7   Separadores, bordes finos
--line-soft      #EBE5D7   Separadores aún más sutiles

═══════════════════════════════════════════════════════
PRIMARIOS (verde musgo — la identidad)
═══════════════════════════════════════════════════════
--moss-50        #EEF1EC   Backgrounds suaves de la marca
--moss-100       #D9DFD4   
--moss-300       #A7B49E   
--moss-500       #5C6F58   ⭐ COLOR PRIMARIO PRINCIPAL
--moss-700       #3F4D3C   Hovers, énfasis
--moss-900       #232C21   Texto sobre paper en máximo énfasis

═══════════════════════════════════════════════════════
ACENTOS (uso muy puntual)
═══════════════════════════════════════════════════════
--clay           #B5826A   Tierra cálida — "salud" / peso
--clay-soft      #E5D3C5   
--garnet         #8B4543   Granate — alertas, máximo énfasis
--garnet-soft    #E8D2D0   
--ochre          #C9A961   Ocre — destacar logros, PRs
--ochre-soft     #F0E5C8   

═══════════════════════════════════════════════════════
SEMÁNTICOS
═══════════════════════════════════════════════════════
--success        #5C6F58
--warning        #C9A961
--danger         #8B4543
--info           #5C6F58
```

**Reglas de uso:**
- El **paper** es el fondo siempre. El blanco puro (#FFFFFF) **no existe** en VitaRoot.
- El **moss-500** es el único color de marca. Los acentos son condimentos.
- Cada módulo puede tener un acento dominante: Gym = ink, Comidas = clay, Salud = moss, Dashboard = mezcla. Sutil, no agresivo.

### 2.2. Paleta de color (Modo oscuro)

```
--paper          #1A1916
--paper-soft     #25241F
--paper-deep     #2F2D27
--ink            #EFE8DA
--ink-soft       #BCB5A4
--ink-faint      #807A6E
--line           #3D3A33
--line-soft      #2F2D27
--moss-500       #8FA088  (más claro que en light mode)
```

### 2.3. Tipografía

```
FAMILIES
--font-serif    'EB Garamond', 'Iowan Old Style', Georgia, serif
--font-sans     'Inter', 'SF Pro Text', system-ui, sans-serif
--font-mono     'JetBrains Mono', ui-monospace, monospace

ESCALA TIPOGRÁFICA
display-2xl    serif 56px / 1.05 / weight 500
display-xl     serif 44px / 1.1  / weight 500
display-lg     serif 36px / 1.15 / weight 500
display-md     serif 28px / 1.2  / weight 500
display-sm     serif 22px / 1.3  / weight 500

heading-lg     sans  20px / 1.35 / weight 600
heading-md     sans  17px / 1.4  / weight 600
heading-sm     sans  14px / 1.4  / weight 600   (uppercase para eyebrows)

body-lg        sans  17px / 1.55 / weight 400
body-md        sans  15px / 1.55 / weight 400
body-sm        sans  13px / 1.5  / weight 400
body-xs        sans  11px / 1.4  / weight 500

mono-md        mono  14px / 1.4  / weight 400
mono-sm        mono  12px / 1.4  / weight 400

numeric-xl     serif 72px / 1.0  / weight 400
numeric-lg     serif 44px / 1.0  / weight 400
numeric-md     sans  28px / 1.1  / weight 500
```

**Reglas:**
- Números importantes (peso, kcal del día) en **serif**
- Datos tabulares (60kg×8) en **mono**
- UI estándar siempre en **Inter**
- `font-feature-settings: "tnum"` para números en tablas

### 2.4. Espaciado

```
Sistema de 4px (todo múltiplo)

--space-1    4px      
--space-2    8px      
--space-3    12px     Spacing interno típico
--space-4    16px     Spacing entre items relacionados
--space-6    24px     Spacing entre componentes
--space-8    32px     Spacing entre secciones pequeñas
--space-12   48px     Spacing entre secciones grandes
--space-16   64px     Aire generoso
--space-20   80px     Inicio de pantalla, top hero
--space-24   96px
```

### 2.5. Radios

```
--radius-sm      6px     Inputs pequeños, badges
--radius-md      10px    Botones, cards pequeñas
--radius-lg      16px    Cards principales
--radius-xl      24px    Modales
--radius-full    9999px  Avatares, pills
```

### 2.6. Sombras (uso mínimo)

```
--shadow-sm      0 1px 2px rgba(43,42,38,0.04)
--shadow-md      0 2px 8px rgba(43,42,38,0.06)
--shadow-lg      0 8px 24px rgba(43,42,38,0.08)
--shadow-xl      0 16px 48px rgba(43,42,38,0.12)
```

> Si puedes resolver con `border: 1px solid var(--line)` en lugar de sombra, hazlo.

### 2.7. Iconografía

- **Estilo:** lineal, 1.5px stroke
- **Librería:** **Lucide** (`lucide-vue-next`)
- **Tamaños:** 16px (inline), 20px (estándar UI), 24px (touch targets/buttons), 32px (decorativo)
- **Color:** `--ink-soft` por defecto. `--moss-500` para iconos activos.
- **NO emojis en UI.**

---

## §3 Componentes base

### 3.1. Button

**Variantes:** `primary`, `secondary`, `ghost`, `danger`.
**Tamaños:** `sm` (h-32), `md` (h-40, default), `lg` (h-48), `xl` (h-56).
**Estados:** default, hover (transición 200ms), active (scale 0.97), disabled (opacity 0.4), loading (spinner inline).

### 3.2. Input / TextField

- Label arriba en `heading-sm` uppercase + color `--ink-soft`
- Sin border-box: solo `border-bottom: 1px solid --line`
- Focus → `border-bottom-color: --moss-500`
- Padding generoso: py-12 px-0
- Font: `body-lg` (17px)

**Variantes:** `large-numeric` (peso, vasos), `search` (con icono buscar).

### 3.3. Card

- `flat` — separado por línea fina (default)
- `soft` — fondo `--paper-soft`
- `elevated` — con `--shadow-md` (solo para items destacados como PRs)

### 3.4. List item
Para listas largas (workouts, comidas):
- Sin cards: filas separadas por `--line-soft`
- Padding `--space-4` vertical
- Estructura: icono opcional + contenido + metadata + chevron

### 3.5. Modal / Dialog
- Esquinas `--radius-xl`
- Backdrop con opacity 0.4
- Animación: scale 0.95 → 1 + fade en 250ms
- Cerrar con tecla `Escape`
- Atajos de teclado para acciones primarias (`Enter`, `Cmd+S`)

### 3.6. Toast
- Aparece top-right
- Slide-in 250ms + fade
- Auto-dismiss tras 4s

### 3.7. Skeleton loader
- Forma del contenido a venir
- Background `--paper-soft` con shimmer sutil 1.5s loop

### 3.8. Empty state
- Ilustración botánica minimalista en `--moss-500` (1 sola línea)
- Título serif corto
- Frase secundaria
- Botón primario de creación

---

## §4 Layout y navegación (desktop-first)

```
┌─────────────────────────────────────────────────────────────┐
│ 🌿 VitaRoot                              [Buscar...] [⚙]   │  ← Top bar
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  🏠 Hoy  │                                                  │
│  💪 Gym  │              CONTENIDO                           │
│  🍽 Comi │           (max-width: 960px,                     │
│  🍃 Salud│            centrado o left-align)                │
│          │                                                  │
│          │                                                  │
│  ─────   │                                                  │
│  👤 Perf │                                                  │
│  ⚙ Ajust │                                                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
   240px              flex-grow
```

- **Sidebar fija** de 240px con logo + navegación vertical
- Colapsable a 64px (solo iconos) con shortcut `Cmd+\` o `Ctrl+\`
- Top bar global con buscador y ajustes
- Contenido en columna central con `max-width: 960px` (legibilidad)
- Para gráficas y dashboard analítico: ancho completo permitido
- **Sin FAB**: las acciones primarias están en cabecera de cada vista o atajos de teclado

### Atajos de teclado globales

| Atajo | Acción |
|---|---|
| `Cmd/Ctrl + K` | Buscador / command palette |
| `Cmd/Ctrl + \` | Toggle sidebar |
| `Cmd/Ctrl + S` | Guardar (en formularios) |
| `Esc` | Cerrar modal / cancelar |
| `G` luego `H` | Ir a Hoy |
| `G` luego `G` | Ir a Gym |
| `G` luego `C` | Ir a Comidas |
| `G` luego `S` | Ir a Salud |
| `N` | Nueva entrada (contextual al módulo activo) |

### Breakpoints

```
mobile     <  640px    Adaptación funcional (no optimizada). Sidebar se vuelve menú.
tablet      640-1024   Sidebar colapsada por defecto. Top bar adaptada.
desktop    ≥ 1024px    ⭐ Layout primario. Sidebar expandida.
wide       ≥ 1440px    Layout estándar centrado.
```

Aunque sea desktop-first, el responsive funciona razonablemente bien en móvil para no descartar la idea de usarla desde el navegador del móvil en LAN en el futuro (v2).

---

## §5 Wireframes por pantalla

### 5.1. Pantalla "Hoy" (Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🌿 VitaRoot                            [Buscar... ⌘K]    [⚙]   │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ 🏠 Hoy   │   Buenos días,                                       │
│ 💪 Gym   │   Pablo.                                             │
│ 🍽 Comi  │                                                      │
│ 🍃 Salud │   Miércoles 14 de mayo                               │
│          │                                                      │
│ ──────   │   ─────────────────────────                          │
│ 👤 Perfil│                                                      │
│ ⚙ Ajustes│   ACCIÓN RÁPIDA                                      │
│          │                                                      │
│          │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│          │   │   💪   │ │   🍽   │ │   💧   │ │   ⚖   │         │
│          │   │Entreno │ │Comida  │ │  Agua  │ │ Peso  │         │
│          │   └────────┘ └────────┘ └────────┘ └────────┘        │
│          │                                                      │
│          │   ─────────────────────────                          │
│          │                                                      │
│          │   HOY                                                │
│          │                                                      │
│          │   Agua             5 / 8 vasos                       │
│          │   ████████░░░░                                       │
│          │                                                      │
│          │   Sueño            7h 20m  anoche                    │
│          │   Peso             74,2 kg  hace 2 días              │
│          │   Ánimo            4/5  ayer                         │
│          │                                                      │
│          │   ─────────────────────────                          │
│          │                                                      │
│          │   MACROS HOY                                         │
│          │                                                      │
│          │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│          │   │1.840    │ │  120g   │ │  180g   │ │   45g   │    │
│          │   │  kcal   │ │ proteína│ │  carbs  │ │ grasas  │    │
│          │   └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│          │                                                      │
│          │   ─────────────────────────                          │
│          │                                                      │
│          │   ESTA SEMANA                                        │
│          │                                                      │
│          │   3 workouts · 21.500 kcal · 7h sueño media          │
│          │   Comparativa semana anterior →                      │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

**Sin widget del coach**. En su lugar: el bloque "MACROS HOY" como widget destacado.

### 5.2. Pantalla "Gym — Histórico"

```
┌──────┬────────────────────────────────────────────────────────┐
│ Side │   Gym                            [+ Nuevo workout]      │
│ bar  │                                                         │
│      │   Tu entrenamiento                                      │
│      │                                                         │
│      │   [Buscar...]    Todos · Pecho · Pierna · Espalda ▸    │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   ESTA SEMANA · 3 SESIONES                              │
│      │                                                         │
│      │   Miércoles · Pecho                                     │
│      │   Press banca 4×8 · Aperturas 3×12                      │
│      │   60 min · 1.840 kg volumen                             │
│      │   ──────────────────────                                │
│      │   Lunes · Pierna                                        │
│      │   Sentadilla 4×6 · Peso muerto 3×5                      │
│      │   75 min · 2.310 kg volumen                             │
│      │                                                         │
│      │   SEMANA PASADA · 4 SESIONES                            │
│      │   ...                                                   │
│      │                                                         │
└──────┴────────────────────────────────────────────────────────┘
```

### 5.3. Pantalla "Nuevo workout — formulario excelente"

Lo más importante de toda la app. Tiene que ser **rápido con teclado**.

```
┌──────┬────────────────────────────────────────────────────────┐
│ Side │   ← Volver a Gym                                        │
│      │                                                         │
│      │   Nuevo workout                                         │
│      │                                                         │
│      │   ⏱ 0:00 [▶ Empezar timer]                              │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   EJERCICIO 1                                           │
│      │                                                         │
│      │   [Press banca                            ▼]            │
│      │       ↑ selector con búsqueda fuzzy                     │
│      │                                                         │
│      │   ┌─────────┬─────────┬─────────┬────────┐              │
│      │   │ Set     │ Peso    │ Reps    │  RPE   │              │
│      │   ├─────────┼─────────┼─────────┼────────┤              │
│      │   │   1     │  60 kg  │   8     │   7    │              │
│      │   │   2     │  60 kg  │   8     │   7    │              │
│      │   │   3     │  60 kg  │   8     │   8    │              │
│      │   │   4     │ [62.5]  │  [8]    │ [...]  │ ← edición    │
│      │   └─────────┴─────────┴─────────┴────────┘              │
│      │                                                         │
│      │   [+ Set (Enter)]  [Repetir último]                     │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   [+ Añadir ejercicio (Tab+N)]                          │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   Notas (opcional)                                      │
│      │   [______________________________]                      │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   [Cancelar]            [Guardar workout (Cmd+S)]       │
│      │                                                         │
└──────┴────────────────────────────────────────────────────────┘
```

**Microinteracciones críticas:**
- Auto-foco en el primer campo al cargar
- Tab y Shift+Tab navegan entre campos en orden lógico
- Enter en cualquier campo añade un nuevo set
- Atajos visibles entre paréntesis
- Auto-guardado como borrador cada N segundos
- Selector de ejercicios: typeahead instantáneo + flechas para navegar

### 5.4. Pantalla "Comidas — Hoy"

```
┌──────┬────────────────────────────────────────────────────────┐
│ Side │   Comidas                            [+ Nueva comida]   │
│      │                                                         │
│      │   Tu día                                                │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   MACROS DEL DÍA                                        │
│      │                                                         │
│      │   1.840 kcal     P 120  C 180  G 45                     │
│      │                                                         │
│      │   [Si hay objetivos: barras de progreso ████░░]         │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   COMIDAS DE HOY                                        │
│      │                                                         │
│      │   08:30 · DESAYUNO                                      │
│      │   Avena con plátano y proteína                          │
│      │   480 kcal · P 32 · C 60 · G 8                          │
│      │   ──────────────────────                                │
│      │   14:30 · COMIDA                                        │
│      │   Pollo con arroz y brócoli                             │
│      │   680 kcal · P 52 · C 78 · G 14                         │
│      │   ──────────────────────                                │
│      │   17:00 · SNACK                                         │
│      │   Yogur griego con miel                                 │
│      │   220 kcal · P 18 · C 24 · G 5                          │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   📌 COMIDAS GUARDADAS                                  │
│      │                                                         │
│      │   Pollo con arroz · 680 kcal           [Añadir → hoy]   │
│      │   Avena básica · 320 kcal              [Añadir → hoy]   │
│      │   Tostadas aguacate · 380 kcal         [Añadir → hoy]   │
│      │                                                         │
└──────┴────────────────────────────────────────────────────────┘
```

### 5.5. Pantalla "Nueva comida"

Modal o pantalla dedicada (preferentemente modal para mantener contexto):

```
┌─────────────────────────────────────────────────────┐
│  Nueva comida                                  [×]   │
│                                                      │
│  ─────────────────────────                          │
│                                                      │
│  NOMBRE                                              │
│  [Pollo con arroz y brócoli__________________]      │
│   ↑ autocomplete con comidas guardadas              │
│                                                      │
│  TIPO                  HORA                          │
│  [Comida ▼]            [14:30]                       │
│                                                      │
│  ─────────────────────────                          │
│                                                      │
│  MACROS (opcionales)                                 │
│                                                      │
│  KCAL       PROTEÍNA   CARBOS    GRASAS              │
│  [680]      [52]       [78]      [14]                │
│                                                      │
│  ─────────────────────────                          │
│                                                      │
│  ☐ Guardar también como comida frecuente             │
│                                                      │
│  [Cancelar]                    [Guardar (Cmd+S)]     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 5.6. Pantalla "Salud"

```
┌──────┬────────────────────────────────────────────────────────┐
│ Side │   Salud                                                 │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   ┌────────────────┬────────────────┐                   │
│      │   │      💧         │      😴        │                   │
│      │   │   5 / 8 vasos  │    7h 20m      │                   │
│      │   │   ────░░░░     │    anoche      │                   │
│      │   │   [+ vaso]     │   [editar]     │                   │
│      │   └────────────────┴────────────────┘                   │
│      │                                                         │
│      │   ┌────────────────┬────────────────┐                   │
│      │   │      ⚖         │      🌤        │                   │
│      │   │   74,2 kg      │     4/5        │                   │
│      │   │   hace 2 días  │   ayer "bien"  │                   │
│      │   │  [registrar]   │  [registrar]   │                   │
│      │   └────────────────┴────────────────┘                   │
│      │                                                         │
│      │   ─────────────────────────                             │
│      │                                                         │
│      │   TENDENCIAS DE LOS ÚLTIMOS 30 DÍAS                     │
│      │                                                         │
│      │   [mini-gráfica peso]                                   │
│      │   [mini-gráfica sueño]                                  │
│      │   [mini-gráfica agua]                                   │
│      │   [mini-gráfica ánimo]                                  │
│      │                                                         │
└──────┴────────────────────────────────────────────────────────┘
```

---

## §6 Flujos clave

### 6.1. Flujo "Registrar workout" (camino dorado)

```
1. [Dashboard "Hoy"] click en "Entreno" (o tecla N desde sidebar Gym)
   ↓ (fade transition 250ms)
2. [Nuevo workout] formulario con foco automático en selector de ejercicio
   ↓ (escribir nombre + ↓ para elegir + Enter)
3. Foco salta a "Peso" → tab → "Reps" → tab → "RPE" → Enter = +Set
   ↓ (auto-rellena siguiente set con valores anteriores)
4. Repetir sets. Tab+N para nuevo ejercicio.
   ↓
5. Cmd+S para guardar
   ↓ (animación check + toast "Workout guardado")
6. Vuelve a [Gym Histórico] con el workout nuevo arriba

⏱ Tiempo total objetivo: 1-2 minutos para un workout de 4-5 ejercicios.
```

### 6.2. Flujo "Registrar comida rápida" (reutilizar)

```
1. [Comidas] click en "Añadir → hoy" en una comida guardada
   ↓
2. [Modal] solo pide tipo de ingesta y hora (resto pre-rellenado)
   ↓
3. Cmd+S → guardada

⏱ Tiempo objetivo: 10 segundos.
```

### 6.3. Flujo "Revisar progresión de un ejercicio"

```
1. [Gym] → [Catálogo de ejercicios]
   ↓
2. Click en un ejercicio
   ↓
3. Ficha del ejercicio con tabs: Detalle · Histórico · Progresión
   ↓
4. Tab "Progresión" → gráficas + tabla
```

---

## §7 Microinteracciones y animaciones

> Aquí está la firma de VitaRoot. La estética estática es minimal pero el movimiento es rico.

### 7.1. Curvas de easing

```css
--ease-out-soft     cubic-bezier(0.32, 0.72, 0.32, 1)
--ease-out-expo     cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-soft  cubic-bezier(0.65, 0, 0.35, 1)
--ease-spring       cubic-bezier(0.5, 1.6, 0.5, 1)
```

### 7.2. Duraciones

```
--duration-instant   75ms
--duration-fast      150ms
--duration-base      250ms
--duration-slow      350ms
--duration-slower    500ms
--duration-hero      800ms
```

### 7.3. Transiciones entre páginas (desktop)

- Fade + ligero translateY (de 8px) en 300ms `ease-out-soft`
- Modal: scale 0.95 → 1 + fade en 250ms

### 7.4. Microanimaciones señaladas

**Saludo del dashboard:**
- Fade + translateY desde -8px en 600ms `ease-out-expo`
- Stagger: línea 1 (saludo) → 80ms → línea 2 (nombre)
- Solo la primera vez por sesión

**Botón primary click:**
- Background transition 100ms
- `scale(0.97)` durante 100ms `ease-spring`
- Al soltar: vuelve en 200ms

**Guardado exitoso:**
- Icono check anima stroke-dasharray para "dibujarse" en 300ms
- Toast desliza desde top-right

**PR conseguido:**
- Badge dorado (`--ochre`) pulse-glow 3 veces
- Toast con copy especial: "Récord en press banca · 65 kg × 8"
- Sin confeti, sin sonido. Discreción.

**Animación de "carga"** (ninguna llamada IA pero hay carga de datos):
- SVG de una raíz/brote que dibuja sus líneas progresivamente
- Loop infinito mientras espera
- Texto: "Cargando..."

**Tab change en sidebar:**
- Background del activo: fade 200ms
- Icono activo: scale 1.0 → 1.1 → 1.0 en 250ms (suave bounce)

**Hover sobre cards interactivas:**
- Translate-y -2px + shadow leve en 200ms

### 7.5. `prefers-reduced-motion`

Todo lo decorativo se desactiva. Queda solo:
- Transiciones de color
- Fades simples
- Sin scale, sin translateY decorativo

### 7.6. Librerías

- **Vue Transition** + **CSS** para la mayoría
- **@vueuse/motion** para stagger y spring physics
- **Lottie** opcional para la raíz creciendo (puede sustituirse por SVG animado puro)

---

## §8 Accesibilidad

### 8.1. Contraste
- Texto principal sobre paper: contrast ratio ≥ 7:1 (AAA)
- Texto secundario: ≥ 4.5:1 (AA)

### 8.2. Teclado
- Todo lo interactivo accesible por Tab
- Focus visible: ring de 2px con `--moss-500` separado por 2px
- Atajos de teclado documentados en sección "Ayuda" / Cmd+?

### 8.3. Screen readers
- Labels semánticos en todo (aria-label, aria-describedby)
- Anuncio de cambios dinámicos (aria-live="polite")
- No depender solo de color para transmitir información

### 8.4. Dynamic Type / Zoom
- Todas las fuentes en `rem`
- Permitir hasta 200% zoom sin romper layout

---

## §9 Guía para Claude Code

### 9.1. Stack visual

- **Framework CSS:** Tailwind CSS con preset custom de tokens
- **Componentes UI:** componentes propios construidos sobre primitivas de **radix-vue** (accesibilidad) con estilos VitaRoot
- **Iconos:** `lucide-vue-next`
- **Animaciones:** Vue Transition + `@vueuse/motion`
- **Fonts:** self-hosted con `@fontsource/eb-garamond`, `@fontsource/inter`, `@fontsource/jetbrains-mono`

### 9.2. Estructura de archivos de diseño

```
apps/web/src/
├── assets/
│   ├── fonts/                       (self-hosted)
│   └── animations/
│       └── root-growing.json        (Lottie, opcional)
├── styles/
│   ├── tokens.css                   (CSS variables)
│   ├── typography.css               (clases utilitarias display-*, body-*)
│   ├── reset.css
│   └── globals.css
├── components/
│   ├── ui/                          (Button, Input, Card, Modal...)
│   ├── layout/                      (AppShell, Sidebar, TopBar)
│   └── feature/
│       ├── gym/                     (WorkoutCard, SetInput, etc.)
│       ├── meals/
│       ├── health/
│       └── dashboard/
└── composables/
    ├── useToast.ts
    ├── useShortcuts.ts              (atajos de teclado)
    └── useMotion.ts
```

### 9.3. Reglas de implementación

**Regla 1:** Cero estilos inline salvo dinámicos (transform de drag, etc.). Color, tamaño, padding: siempre clases.

**Regla 2:** Antes de añadir un color/espaciado/radio/duración nuevo, **verificar que no existe ya en tokens**. Si no, discutir antes.

**Regla 3:** Cada componente UI tiene un ejemplo en un Playground route con todos los estados.

**Regla 4:** Desktop-first siempre, pero responsive razonable (mobile breakpoint funcional).

**Regla 5:** Si una pantalla tiene >150 líneas de template, se descompone.

**Regla 6:** Loading states obligatorios. Ningún botón que llame a backend con solo "happy path".

**Regla 7:** Atajos de teclado siempre **registrados centralizadamente** vía `useShortcuts`, no scattered.

### 9.4. Tokens en Tailwind

`tailwind.config.ts` extiende tema con tokens de VitaRoot. Detalle en doc 04.

---

## §10 Estado del documento

- **Versión:** 2.0 — adaptado a desktop-first, sin pantallas de IA
- **Estado:** Propuesto, pendiente validación
