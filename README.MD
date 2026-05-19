# VitaRoot 🌱

App personal de tracking de salud — local-only, sin servicios externos, sin IA.

Stack: Vue 3 + Vite + TypeScript (frontend), Node.js + Fastify + Drizzle + SQLite (backend), monorepo con pnpm workspaces.

## Cómo arrancar

### Pre-requisitos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

Arranca frontend (puerto 5173) y backend (puerto 3001) en paralelo.

## Documentación

Toda la documentación del proyecto está en `docs/`:

- `01-vision-y-principios.md` — qué es VitaRoot y por qué
- `02-especificacion-funcional.md` — user stories por módulo
- `03-diseno-ux-ui.md` — sistema de diseño
- `04-arquitectura-tecnica.md` — decisiones técnicas (ADRs)
- `05-modelo-de-datos.md` — schema de BD
- `06-plan-implementacion.md` — sprints y tareas

Para referencia rápida durante el desarrollo: `docs/quick-reference/`.

## Estructura
vitaroot/
├── apps/
│   ├── web/         # Frontend Vue 3
│   └── api/         # Backend Fastify
├── packages/
│   └── shared/      # Tipos compartidos (Zod)
├── data/            # BD SQLite local (gitignored)
└── docs/            # Documentación
## Licencia

Proyecto personal. Sin licencia pública.