# 00 · Índice de documentación

> Mapa de qué hay en cada documento. Úsalo para saber dónde buscar antes de abrir un doc completo.

## Documentos principales

### `01-vision-y-principios.md` (9 KB)
- §1-3: qué es VitaRoot, para quién, personalidad
- §4-5: problema que resuelve, qué NO es
- §6: principios rectores (11 reglas)
- §7: métricas de éxito
- §9: los 4 módulos
- §10: filosofía sobre la IA (irrelevante en v1, está sin IA)

**Cuándo leerlo:** al empezar, o cuando dudes si una decisión encaja con la filosofía del proyecto.

### `02-especificacion-funcional.md` (16 KB)
- §1: módulo Gym (8 user stories US-GYM-01 a 08)
- §2: módulo Comidas (4 US: US-MEAL-01 a 04)
- §3: módulo Salud (5 US: US-HEALTH-01 a 05)
- §4: módulo Dashboard (3 US: US-DASH-01 a 03)
- §5: sistema (5 US: US-SYS-01 a 05)
- §6: priorización por sprint

**Cuándo leerlo:** antes de implementar una feature, busca su US y lee solo esa sección.

### `03-diseno-ux-ui.md` (37 KB)
- §1-2: principios visuales y sistema de diseño (colores, tipografía, espacios)
- §3: componentes base (Button, Input, Card, Modal, Toast...)
- §4: layout y navegación (sidebar, atajos de teclado)
- §5: wireframes pantalla por pantalla
- §6: flujos clave de usuario
- §7: microinteracciones y animaciones
- §8: accesibilidad
- §9: guía para Claude Code (stack visual, reglas)

**Cuándo leerlo:** al crear componentes UI. Para uso rápido, prefiere `quick-reference/design-tokens.md`.

### `04-arquitectura-tecnica.md` (36 KB)
- §1: vista general (diagrama de capas)
- §2: ADRs (17 decisiones técnicas razonadas)
- §3: estructura del monorepo
- §4: frontend (Vue 3 + Vite)
- §5: backend (Fastify + Drizzle)
- §6: tipos compartidos
- §7: comunicación frontend-backend (REST)
- §8: persistencia con SQLite
- §9: manejo de errores
- §10: testing
- §11: ejecución local
- §12: guía para Claude Code

**Cuándo leerlo:** al crear un módulo nuevo (lee §5 anatomía de módulo), al tomar una decisión técnica nueva (revisa ADRs).

### `05-modelo-de-datos.md` (50 KB)
- §1-2: principios y convenciones de modelado
- §3: diagrama entidad-relación
- §4: schema por módulo (4.1 sistema, 4.2 gym, 4.3 comidas, 4.4 salud)
- §5: índices
- §6: restricciones y validaciones
- §7: DDRs (10 decisiones de modelado)
- §8: seed inicial (~50 ejercicios)
- §9: estrategia de migraciones
- §10: archivo schema.ts completo (copiar tal cual)
- §11: queries comunes con Drizzle

**Cuándo leerlo:** al crear una tabla nueva, al escribir una query compleja.

### `06-plan-implementacion.md` (42 KB)
- §3: Sprint 0 - preparación
- §4: Sprint 1 - cimientos (T1.1 a T1.10)
- §5: Sprint 2 - módulo Salud (T2.1 a T2.12)
- §6: Sprint 3 - módulo Gym base
- §7: Sprint 4 - módulo Gym progresión
- §8: Sprint 5 - módulo Comidas
- §9: Sprint 6 - dashboard semanal
- §10: Sprint 7 - pulido final
- §11: Definition of Done global
- §12: CLAUDE.md original

**Cuándo leerlo:** al empezar una tarea, lee solo esa tarea concreta. No leas el sprint entero.

---

## Quick-reference (resúmenes para consulta diaria)

### `quick-reference/design-tokens.md` (~2 KB)
Colores, tipografía, espacios, radios, sombras, easings — todos los tokens en una sola página.

### `quick-reference/coding-rules.md` (~2 KB)
Reglas de código no negociables, naming, anti-patterns.

### `quick-reference/api-conventions.md` (~1 KB)
URLs REST, status codes, shape de errores, validación.

### `quick-reference/module-template.md` (~2 KB)
Plantilla de cómo crear un módulo nuevo en backend con sus archivos.

---

## Contexto efímero

### `.ai-context/current-sprint.md`
Qué tarea estás haciendo AHORA. Se actualiza cada sesión.

### `.ai-context/decisions-log.md`
Decisiones técnicas que surjan durante la implementación que aún no están en los docs principales.
