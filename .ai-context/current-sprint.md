# Current Sprint · Contexto activo

## Sprint actual

**Sprint:** 1 (Cimientos)
**Tarea activa:** _ninguna, próxima T1.7_
**Tareas completadas:** T1.1, T1.2, T1.3, T1.4, T1.5, T1.6
**Tareas pendientes del sprint:** T1.7, T1.8, T1.9, T1.10

## Estado del proyecto

**Último commit:** `feat(web): layout base con sidebar y topbar`
**Pusheado a GitHub:** sí
**Archivos modificados sin commitear:** ninguno

## Próxima acción concreta

Implementar T1.7: rutas y páginas vacías. Crear las vistas placeholder para Gym, Comidas, Salud, Profile, Settings. Configurar todas las rutas en router/index.ts. Animación de transición entre rutas (fade + translateY).

## Decisiones pendientes

- ninguna

## Bloqueadores

- ninguno

## Notas de la última sesión

- T1.6 completada: layout base funcionando (Sidebar + TopBar + AppShell + Button).
- Lección importante: si haces fix local sin commit, se pierde al cambiar de PC. Recordar siempre `git status` al cerrar.
- Layout verificado visualmente: sidebar 240px fija, topbar sticky, contenido principal con ml-60.
- Navegación entre rutas funciona aunque algunas vistas no existan (queda en blanco, esperado).
- Lecciones técnicas:
  - tsconfig.json necesita `rootDir: "./src"` explícito (TypeScript moderno).
  - Los warnings de LF→CRLF en Git son inofensivos en Windows.