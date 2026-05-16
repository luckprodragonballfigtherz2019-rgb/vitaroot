# Design Tokens · Quick Reference

> Resumen de tokens de VitaRoot para consulta rápida. Detalle completo en `03-diseno-ux-ui.md` §2.

## Colores (modo claro)

### Neutros
```
--paper        #F8F4ED   fondo principal (papel crudo, NO blanco puro)
--paper-soft   #F2EDE3   cards
--paper-deep   #E8E1D2   hover
--ink          #2B2A26   texto principal
--ink-soft     #5C5A52   texto secundario
--ink-faint    #9B968A   texto terciario, placeholders
--line         #DDD6C7   separadores
--line-soft    #EBE5D7   separadores muy sutiles
```

### Marca (verde musgo)
```
--moss-500     #5C6F58   ⭐ primario
--moss-700     #3F4D3C   hovers
--moss-50      #EEF1EC   backgrounds suaves
```

### Acentos (usar con criterio)
```
--clay         #B5826A   tierra cálida — salud/peso
--garnet       #8B4543   granate — danger
--ochre        #C9A961   ocre — logros, PRs
```

**Regla:** sin colores hardcoded. Solo CSS variables o tokens Tailwind.

## Tipografía

| Familia | Uso |
|---|---|
| `EB Garamond` (serif) | títulos largos, números importantes |
| `Inter` (sans) | UI funcional, datos |
| `JetBrains Mono` (mono) | datos tabulares (sets: 60kg×8) |

### Escala
```
display-xl   serif 44px / 1.1   títulos hero
display-md   serif 28px / 1.2   saludos, headers de pantalla
heading-lg   sans  20px / 1.35  headers de sección
heading-md   sans  17px / 1.4   títulos de card
heading-sm   sans  14px / 1.4   eyebrows uppercase
body-lg      sans  17px / 1.55  texto principal
body-md      sans  15px / 1.55  texto estándar
body-sm      sans  13px / 1.5   secundario
mono-md      mono  14px / 1.4   datos
numeric-lg   serif 44px / 1.0   métricas grandes
```

## Espaciado (múltiplos de 4)

```
--space-2   8px      
--space-3   12px     interno típico
--space-4   16px     entre items
--space-6   24px     entre componentes
--space-8   32px     entre secciones pequeñas
--space-12  48px     entre secciones grandes
--space-16  64px     aire generoso
```

## Radios

```
--radius-sm    6px     inputs, badges
--radius-md    10px    botones, cards pequeñas
--radius-lg    16px    cards principales
--radius-xl    24px    modales
--radius-full  9999px  pills
```

## Sombras (uso mínimo, preferir borders)

```
--shadow-sm   0 1px 2px rgba(43,42,38,0.04)
--shadow-md   0 2px 8px rgba(43,42,38,0.06)
--shadow-lg   0 8px 24px rgba(43,42,38,0.08)
```

## Animación

### Easings
```
--ease-out-soft     UI default
--ease-out-expo     entradas dramáticas
--ease-spring       botones, taps
```

### Duraciones
```
--duration-fast    150ms   tap feedback
--duration-base    250ms   default
--duration-slow    350ms   transiciones de pantalla
```

## Iconos

`lucide-vue-next`. Tamaños: 16/20/24/32. Color: `--ink-soft` default, `--moss-500` activos. **NO emojis en UI.**

## Componentes base

| Componente | Variantes/sizes |
|---|---|
| Button | variants: primary/secondary/ghost/danger · sizes: sm(32)/md(40)/lg(48)/xl(56) |
| Input | label arriba, border-bottom only |
| Card | flat (default) / soft / elevated |
| Modal | radius-xl, animación scale + fade 250ms |
| Toast | top-right, slide-in 250ms, auto-dismiss 4s |

## Reglas anti-error

❌ NO blanco puro `#FFFFFF`. SÍ `--paper`.  
❌ NO `font-weight: 600/700`. Usa serif para énfasis.  
❌ NO sombras pesadas. Prefiere `border: 1px solid var(--line)`.  
❌ NO emojis decorativos en UI.  
❌ NO valores arbitrarios. Solo tokens.
