# 01 · Visión y Principios — VitaRoot

> **Versión 2.0** · Documento fundacional. Tras revisión de scope, se simplifica el proyecto a una app local de tracking, sin servicios externos ni IA.

---

## 1. Visión en una frase

> **VitaRoot es una app personal de tracking de salud que corre en tu propio ordenador. Registra entrenamientos, comidas y métricas de salud en un único lugar bonito, calmado y tuyo. Cero servicios externos. Cero IA. Solo tus datos, contigo.**

No es un tracker más. Es **tu raíz**: el sitio donde está lo fundamental de tu día a día físico, en tu propia máquina.

**Tagline:** *"Tu salud, desde la raíz. En tu propio ordenador."*

---

## 2. Para quién es

**Un único usuario: tú. En tu propio ordenador.**

Esto desbloquea ventajas competitivas:
- Privacidad **absoluta**: tus datos no salen de tu PC
- Cero coste mensual (no hay servicios cloud)
- Personalización extrema (la app conoce tu nombre, tu cuerpo, tu historia)
- Decisiones de producto agresivas (no hay "usuarios medios")
- Estética propia (paleta orgánica, tipografía con carácter, tono cercano)

No diseñamos pensando en escalar. El día que quieras compartirlo o subirlo a la nube, será otro proyecto.

---

## 3. Personalidad de la marca

VitaRoot tiene **carácter orgánico, calmado y enraizado**. No es tech-frío. No es wellness-cursi. Es **tierra firme**.

- 🎨 **Paleta:** verde musgo + papel crudo + tonos tierra + un acento vivo (coral o granate)
- 🔤 **Tipografía:** serif moderna para títulos y números importantes (EB Garamond), sans clara para datos (Inter)
- 🎯 **Tono general:** cercano, calmado, directo. Sin emojis salvo intencionalidad.
- 🌳 **Iconografía:** raíz como símbolo recurrente. Crecimiento lento. Estaciones.

> Cada decisión de diseño pasa por el filtro: *"¿esto se siente como VitaRoot o como otra app más?"*

---

## 4. Qué problema resuelve

### 4.1. Fragmentación
Tienes que usar Strong para el gimnasio, MyFitnessPal para comida, una libreta para el peso, otra para sueño. **Los datos no se hablan entre sí.** VitaRoot los reúne en una sola vista.

### 4.2. Privacidad y propiedad de los datos
Las apps comerciales venden tus datos, los pierden, los rescatan a Cloud, exigen suscripción. VitaRoot **es tuya** literalmente. La BD es un archivo `.db` que puedes copiar, mover, borrar.

### 4.3. Fricción del registro estándar
Apps actuales te obligan a navegar mucho. VitaRoot prioriza **formularios excelentes**: auto-rellenado del último valor, atajos de teclado, comidas guardadas reutilizables, un solo toque para añadir un set.

---

## 5. Qué NO es

- ❌ **NO es una red social.** Sin feed, likes, sharing.
- ❌ **NO es cloud-based.** Corre en tu PC, no en servidores externos.
- ❌ **NO usa servicios externos** (APIs de IA, servicios cloud, autenticación de terceros).
- ❌ **NO es mobile-first.** Es desktop-first; el navegador del PC es tu interfaz.
- ❌ **NO tiene IA en v1.** Sin chatbot, sin parser de texto, sin análisis automático.
- ❌ **NO es multi-usuario.** Único usuario: tú.
- ❌ **NO replica funcionalidades de Strong/MyFitnessPal por completitud.** Solo lo que tú usas.
- ❌ **NO se integra con wearables en v1.** (Aplazado a v2 si surge necesidad.)
- ❌ **NO tiene auth en v1.** Tu PC, tu dato. Si lo abres a LAN o internet en v2, se añade.

Cualquier feature que te plantees añadir, primero pásala por: *"¿esto me ayuda a mí, hoy, en mi PC?"*. Si la respuesta es "puede que algún día", **fuera**.

---

## 6. Principios rectores

Ordenados: si dos chocan, gana el de arriba.

### 6.1. Tú primero, código segundo
La app existe para servirte a ti. Si una decisión técnica "elegante" te hace la vida peor, gana tu vida.

### 6.2. Fricción cero en el momento crítico
Tres momentos donde la fricción es inaceptable:
- Apuntar un set en el gym (en el PC al volver a casa, idealmente en menos de 1 minuto)
- Registrar una comida (mientras está fresca en la cabeza)
- Ver tu estado de hoy de un vistazo

Para el resto (revisar histórico, configurar, gráficas) sí se permite algo de fricción si gana en otras dimensiones.

### 6.3. Local-first, siempre
Todo corre en tu PC. Sin llamadas externas. Sin "modo offline" porque **siempre** está offline (de servicios). Si tu PC funciona, VitaRoot funciona.

### 6.4. Mobile-aware, no mobile-first
Diseñamos para desktop. Pero el HTML/CSS responsive funciona bien en móvil por si abres la URL en un navegador móvil dentro de tu propia red LAN (caso futuro). Sin haptics, sin gestos táctiles, sin PWA.

### 6.5. Datos antes que features
Si un módulo no captura los datos correctos, todas las features encima son humo. Antes de programar UI, el modelo de datos tiene que estar bien.

### 6.6. Type-safe end-to-end, siempre
TypeScript estricto. Tipos compartidos entre frontend y backend (mismo lenguaje en ambos lados). Validación con Zod en los bordes.

### 6.7. Calidad sobre velocidad, pero no sobre acabado
"Calidad sobre velocidad" no significa "perfecto antes de tocarlo". Significa: **terminar bien lo que se empieza** antes de empezar otra cosa.

### 6.8. La estética importa
Esta app la abres todos los días. Si es fea, la abres con menos ganas. Cada pantalla pasa por: *"¿me alegro de mirarla?"*

### 6.9. Animaciones generosas y cuidadas
La estética estática es calmada y minimal. Pero el movimiento es la firma de VitaRoot: cuando algo se mueve, se mueve con elegancia. Es lo opuesto a apps que vibran sin parar.

### 6.10. Extensibilidad sin sobre-ingeniería
Diseñamos para que añadir cosas mañana sea fácil sin construirlo todo hoy:
- Campo `source` en registros (manual / wearable_X / ...) → wearables futuros
- Campo `meta` JSON en entidades clave → añadir contexto sin migrar BD
- Módulos desacoplados → módulo nuevo (meditación, finanzas...) entra sin tocar lo existente
- Capa de datos abstraída → si un día quieres migrar SQLite a Postgres, es un cambio de adaptador

### 6.11. Construye para tu yo del futuro
Tu yo de dentro de 6 meses no se acordará de por qué tomaste una decisión. Comentarios, documentación, ADRs.

---

## 7. Métricas de éxito

### Métricas duras
- 🎯 **Uso real:** la abres ≥5 días/semana durante 3 meses seguidos
- 🎯 **Sustitución:** dejas de usar Strong / MyFitnessPal / libreta
- 🎯 **Decisiones tomadas con datos:** ≥1 cambio de rutina/dieta al mes basado en lo que ves
- 🎯 **Coste mensual:** **0€**. Sin servicios externos.

### Métricas blandas
- ✨ Cuando se la enseñas a alguien, le sorprende
- ✨ Te apetece abrirla, no es obligación
- ✨ Sientes que es **tuya** (porque literalmente lo es)
- ✨ Has aprendido Vue + TypeScript + Node + SQLite + diseño de UX construyéndola

---

## 8. Anti-objetivos

- ❌ Que cualquiera pueda usarla
- ❌ Que sea "limpia y minimal" porque sí (si quieres maximalismo orgánico, adelante)
- ❌ Que tenga todas las features de competidoras
- ❌ Que esté desplegada en la nube
- ❌ Que sea fácil de monetizar
- ❌ Que tenga IA

---

## 9. Los 4 módulos

```
┌──────────────────────────────────────────────────┐
│                    DASHBOARD                      │
│           Vista unificada · "Hoy" · "Semana"      │
└─────────────┬─────────────┬─────────────┬────────┘
              │             │             │
   ┌──────────▼─┐  ┌────────▼────┐  ┌────▼─────┐
   │    GYM     │  │   COMIDAS   │  │  SALUD   │
   │            │  │             │  │          │
   │  Workouts  │  │  Plato +    │  │  Agua    │
   │  Ejercicios│  │  macros     │  │  Sueño   │
   │  Sets      │  │  guardadas  │  │  Peso    │
   │  Progresión│  │             │  │  Ánimo   │
   └────────────┘  └─────────────┘  └──────────┘
```

Cada módulo:
- Es independiente (puedes apagar uno, los demás siguen)
- Tiene su propia DOD (Definition of Done, ver doc 07)

**Sin Coach IA en v1.** El dashboard muestra datos y tendencias, pero no las interpreta.

### Módulo Comidas — alcance v1 simplificado

Tras revisión, se simplifica radicalmente:
- Registro de comidas como **"plato + macros aproximadas"**
- Sin desglose por alimento
- Sin foto
- Sin búsqueda en BD de alimentos
- Lista de **"comidas guardadas"** para reutilizar las habituales rápido

> Si el módulo Comidas no es lo bastante útil con este alcance, en v2 podemos añadir un parser local o catálogo de alimentos. Pero v1 prioriza simplicidad y uso.

---

## 10. Estado del documento

- **Versión:** 2.0 — simplificación de scope: local-only, sin IA, sin servicios externos
- **Estado:** ✅ Aprobado por el usuario
- **Nombre del proyecto:** VitaRoot
- **Próxima revisión:** al terminar el documento 03 (UX/UI), por si el diseño visual obliga a matizar

---

## Próximo documento

**`02-especificacion-funcional.md`** — qué hace exactamente cada módulo, ahora sin features IA.
