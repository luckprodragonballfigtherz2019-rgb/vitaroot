# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.10 (última del sprint)_
**Tareas completadas:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6, T1.7, T1.8, T1.9
**Tareas pendientes del sprint:** T1.10

## Estado del proyecto

**Último commit:** `feat(web): sistema de toasts global con animación`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.10: composable useShortcuts. Sistema de atajos de teclado global. Implementar al menos:
- Cmd/Ctrl + \ → toggle sidebar (colapsar/expandir)
- G luego H → navegar a /
- G luego G → navegar a /gym
- G luego C → navegar a /meals
- G luego S → navegar a /health
Animación de colapso de sidebar (300ms ease-out-soft).

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.9 completada: sistema de toasts funcionando con animación slide-in + auto-dismiss + cierre manual.
- Patrón estado compartido: variable `toasts` declarada FUERA del export en useToast.ts. Singleton de módulo.
- TransitionGroup con `.toast-move` para animar reorganización cuando uno desaparece.
- Lección importante: PowerShell se come el carácter '<' en here-strings TypeScript con generics. Solución: arreglar manualmente en VS Code añadiendo el '<' tras Record.
- Verificado visualmente: 3 variantes funcionan (success verde / info gris / error granate), apilados, auto-dismiss 4s.