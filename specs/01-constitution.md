# 🧭 Constitución del Proyecto — **Sintaxis & Compás**

> **Versión:** 1.0 · **Fecha:** 12 de octubre de 2026
> **Alcance:** todo el código, el diseño, el contenido y las decisiones técnicas de la plataforma.
> **Documento maestro:** este archivo define los **principios rectores y no negociables** del proyecto. Cualquier pull request, refactor o nueva función que contradiga una cláusula de esta Constitución se considera *fuera de especificación* y deberá rechazarse o escalarse explícitamente.

---

## 0. Preámbulo

**Sintaxis & Compás** es un podcast en español donde el código encuentra su propio compás: *programar también es componer*. La plataforma no es un simple contenedor de archivos de audio; es la **cabina digital** del show.

Esta Constitución existe para que, pase lo que pase con el stack, el equipo o la moda tecnológica del momento, la plataforma siga siendo:

- **Accesible** para cualquier persona, con cualquier dispositivo, con cualquier forma de navegar.
- **Rápida y honesta** con el audio: sonido real de estudio, reproducción nativa, cero fraude de síntesis.
- **Sostenible** por una sola persona en un fin de semana, sin arqueología de código.
- **Inmersiva** con una identidad sonora y tecnológica propia, sin sacrificar lo anterior.

Cuando dos principios entren en conflicto, se aplica el **orden de prelación del §6**.

---

## 1. Principios rectores (los cinco pilares)

| # | Principio | Lema | Se verifica con |
|---|---|---|---|
| P1 | **Accesibilidad y semántica** | *Si no se puede operar con teclado, no está terminado.* | §2 · revisión manual + auditoría ARIA |
| P2 | **Audio nativo web** | *El navegador ya sabe reproducir audio; no lo reinventes.* | §3 · revisión de dependencias + BDD |
| P3 | **Arquitectura limpia y tipado estricto** | *Tipos que no mienten, carpetas que explican el porqué.* | §4 · `tsc --noEmit` + lint |
| P4 | **Experiencia inmersiva sonora/tecnológica** | *Se escucha con los ojos antes de pulsar play.* | §5 · revisión de diseño |
| P5 | **Continuidad de la escucha** | *El audio no se interrumpe: filtras, navegas, vuelves… y suena.* | §2.5 · escenarios BDD de filtrado/navegación |

---

## 2. P1 — Accesibilidad (a11y) y semántica HTML5 pura

> **No negociable.** La accesibilidad no es una *fase* ni un *mejor esfuerzo*: es un criterio de aceptación con el mismo peso que «la función compila».

### 2.1 Semántica antes que `div`

1. Todo el contenido se marca con elementos HTML5 nativos: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `h1`–`h6` en orden sin saltos, `figure`/`figcaption`, `ul`/`ol` para listas reales.
2. **Prohibido** el «divitis»: un `div` solo está justificado como contenedor de layout o como lienzo decorativo (`aria-hidden="true"`).
3. Un solo `<h1>` por ruta. El árbol de encabezados debe tener sentido leído en orden, sin saltos.
4. Los enlaces navegan (`<a href>`); los botones ejecutan (`<button>`). Nunca un `<div onClick>` sin `role="button"`, `tabIndex={0}` y manejo de teclado — y solo como último recurso.
5. El idioma del documento está declarado (`<html lang="es">`) y los fragmentos en otro idioma llevan `lang` propio.

### 2.2 Roles ARIA: solo para complementar, nunca para reparar

1. Se aplica el **Primera Región de ARIA**: *no uses ARIA si existe un elemento HTML nativo equivalente*.
2. Donde ARIA sea necesario, se usan roles y estados válidos y vigentes: `role="slider"` + `aria-valuenow/min/max/text` en el *scrubber* y el volumen, `aria-pressed` en botones conmutables (mute, play), `aria-current="page"` o `aria-current="true"` en el enlace de ruta activa, `aria-expanded`/`aria-controls` en menús desplegables, `role="status"`/`aria-live="polite"` para cambios de estado del reproductor («sonando» / «en pausa» / «archivo no disponible»).
3. **Prohibido** el ARIA decorativo o contradictorio (`role` que contradice el elemento anfitrión, atributos huérfanos sin gestión de estado, `aria-label` duplicando texto visible innecesariamente).
4. Todo icono SVG decorativo va con `aria-hidden="true"` + `focusable="false"`; los SVG con significado llevan `role="img"` y `<title>` o `aria-label` en español.

### 2.3 Contraste y color

1. Texto normal ≥ **4.5:1** y texto grande (≥ 24 px o 19 px en negrita) ≥ **3:1** contra su fondo real (WCAG 2.2 nivel AA).
2. Los acentos de la paleta **Cyber-Studio Neón** (cian `#06b6d4`, magenta `#d946ef` sobre negro `#06070e`) se verifican *combinados con su fondo efectivo*, incluidos los halos `blur-3xl` y las capas de `linear-gradient`; si un token no llega al umbral, **se ajusta el token, no la regla**.
3. El **estado nunca se comunica solo con color**: reproduciendo, activo, error, filtro seleccionado y foco se acompañan de icono, texto, subrayado o forma.
4. **Foco visible siempre**: anillo de foco neón con contraste ≥ 3:1, nunca `outline: none` sin sustituto. El foco debe verse en botones, enlaces, chips, campos, slider y controles personalizados del reproductor.
5. Se respeta `prefers-reduced-motion`: el ecualizador animado, los desplazamientos y las transiciones se desactivan o atenúan si el usuario lo pide en el sistema.

### 2.4 Navegación por teclado y lector de pantalla

1. **Flujo de tabulación lógico** = orden visual. Nada de `tabIndex` positivos.
2. Todo control del reproductor es operable con teclado:
   - `Espacio`/`Enter` → reproducir/pausar;
   - `←`/`→` y `↑`/`↓` → buscar (seek) y volumen en pasos razonables;
   - `Home`/`End` → inicio y fin del track;
   - controles de velocidad alcanzables y con estado anunciado.
3. **Trampa de foco prohibida** en diálogos y menús; si algo se abre, `Esc` lo cierra y el foco vuelve al disparador.
4. Existe un **enlace «Saltar al contenido»** como primer foco de la página.
5. Los textos alternativos, `aria-label` y mensajes de estado están **en español** y describen la acción, no el aspecto («Reproducir episodio 3», no «botón rosa»).
6. El formulario de contacto tiene `label` asociado por `htmlFor`, errores con `aria-describedby` + `aria-invalid`, y nunca depende del placeholder como única etiqueta.

### 2.5 Reglas de oro de accesibilidad aplicadas al audio

- El reproductor debe ser **enteramente operable sin ratón**.
- Al cambiar de episodio, filtrar o navegar, el **estado anunciado** se mantiene coherente con lo que suena (§6, P5).
- Ninguna función crítica depende del *hover*.
- Prueba mínima antes de cerrar una feature: recorrer la ruta completa con `Tab` + `Espacio`, y leerla con un lector de pantalla (VoiceOver/NVDA) al menos en el bloque del reproductor.

---

## 3. P2 — Prioridad del audio nativo web (sin dependencias pesadas)

> **No negociable.** *«Cero librerías de audio, cero voces sintetizadas.»* Esta es la promesa técnica y editorial del show.

### 3.1 El elemento `<audio>` es la única autoridad

1. La reproducción se apoya **exclusivamente** en la API `<audio>` de HTML5 y Web APIs del navegador (`HTMLMediaElement`, `timeupdate`, `loadedmetadata`, `playbackRate`, `volume`, `muted`).
2. **Prohibido** introducir cualquier librería de audio de terceros (Howler, WaveSurfer, Plyr, liturgy de wrappers, etc.) mientras exista una solución con la plataforma. *Excepción*: ninguna. Si un día se necesita algo que el navegador no da, se abre una RFC y se modifica esta Constitución por PR con quórum, no por conveniencia.
3. **Prohibido** el uso de la síntesis de voz del navegador (`speechSynthesis`) o de cualquier sustituto generado por TTS como fallback de un archivo ausente. Si falta el archivo, se dice **«archivo no disponible (.m4a / .mp3)»** y se ofrece **«🔄 Comprobar audio»**. El sonido del show es *real* o no es.
4. **Fuente única de verdad de la interfaz**: `audio.duration` y `audio.currentTime` alimentan el *scrubber*, los tiempos y el estado. Nada de relojes paralelos, contadores propios ni *estimaciones* que se desincronicen.
5. **Autodetección de formato**: si el `.m4a` declarado falla, se reintenta una única vez con `.mp3`; el chip de estado refleja el formato real (`🎧 Audio de Estudio · M4A/MP3`). Sin bucles infinitos de reintentos.

### 3.2 Coste de dependencias

1. **Presupuesto de dependencias**: `dependencies` se mantiene mínimas y justificadas (`next`, `react`, `react-dom` y poco más). Toda nueva dependencia requiere, en el PR: *qué problema resuelve*, *por qué no se resuelve con < 50 líneas propias*, y *impacto en el bundle*.
2. **Prohibidas** las dependencias que arrastren modelos, códecs, WASM pesado o descargas en tiempo de ejecución para funciones disponibles en la plataforma.
3. Nada de paquetes «de utilidad» monolíticos: si solo usas una función, escribes la función.
4. El JavaScript del cliente es un **recurso escaso**: Server Components por defecto; `"use client"` solo donde haya estado real (reproductor, buscador, formulario).

### 3.3 Entrega de audio

1. Los episodios viven en `public/audio/` como `.m4a` con red de seguridad `.mp3`; el contenido tipado vive en `app/data/episodes.ts`.
2. Ningún audio se bloquea detrás de un *paywall* técnico: la reproducción empieza **sin recargar la página** y sin esperar a hidratar componentes pesados.
3. No se precarga todo el catálogo (`preload="metadata"` como máximo en elementos no activos).
4. La experiencia no puede romperse por un archivo ausente: el estado de error es explícito, recuperable y anunciable (§2.5).

---

## 4. P3 — Arquitectura limpia, tipado estricto y mantenibilidad

> **No negociable.** El código se lee mucho más veces de las que se escribe; se escribe para la persona que llegue después (probablemente tú, en seis meses).

### 4.1 Tipado estricto

1. `tsconfig.json` mantiene `"strict": true` y **no se relaja** — nada de `strict: false`, `noImplicitAny: false`, ni ad-hoc `as any` para silenciar errores.
2. **`any` prohibido en el código de la aplicación.** Se usan `unknown` + narrowing, genéricos o tipos de dominio. Un `as` solo se justifica en la frontera con datos externos y va comentado.
3. Los modelos de dominio son **tipos nombrados y exportados**, no estructuras anónimas repetidas: `Episode`, `Category`, `PlayerStatus`, `SpeedOption`, etc. Si un objeto aparece en más de un sitio, tiene un tipo.
4. Las unions de estado son **discriminadas** (`type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error"`), de modo que el compilador obligue a manejar cada caso.
5. Los datos de contenido son **estáticos y tipados en compile time**; añadir un episodio es añadir un objeto y su archivo, nunca tocar la lógica del reproductor.
6. CI/verificación local: `tsc --noEmit` y `eslint` en verde antes de fusionar. **Cero `eslint-disable` sin justificación en línea.**

### 4.2 Arquitectura limpia aplicada a una web app

1. **Separación por capas con dependencias en una sola dirección:**

   ```text
   app/data  (dominio: episodios tipados)
        ↓
   app/components  (presentación + interacción)
        ↓
   app/*\/page.tsx  (rutas/composición)
        ↓
   app/layout.tsx   (shell global)
   ```

   Un componente de presentación **no** importa datos directamente desde otro componente hermano ni sabe de rutas; recibe props tipadas. La lógica de negocio del reproductor vive **en un único lugar** (`AudioPlayer.tsx`), no dispersa por las páginas.

2. **Responsabilidad única**: un componente, un porqué. Si un archivo supera ~200–250 líneas y mezcla dos preocupaciones, se divide.
3. **Diseño sin sorpresas**: los tokens (colores, tipografías, radios, espaciados) se definen una vez en `app/globals.css` con `@theme inline`. Prohibido el color *hardcodeado* suelto en componentes fuera de los tokens.
4. **Contenido = datos**: la copy, los episodios y las notas viven fuera de la lógica de UI para que cambiar un título no requiera tocar un componente.
5. **Sin código muerto ni duplicado**: si se copia y pega un bloque por segunda vez, se extrae; si queda sin uso, se elimina en el mismo PR.
6. **Comentarios que expliquen el *porqué*, no el *qué*.** El código autoexplicativo no se comenta; las decisiones raras y los paralelismos ingeniería/música sí.
7. **Convención sobre configuración**: estructura de carpetas de Next.js App Router respetada (`app/components`, `app/data`, `app/<ruta>/page.tsx`); nada de carpetas `utils2`, `misc` o `temp`.
8. **Cada PR deja el árbol más limpio de lo que lo encontró** (regla boy-scout).

### 4.3 Verificabilidad

1. Los comportamientos críticos del dominio están descritos en **Gherkin (`tests/bdd/*.feature`, locale `es`)**: reproducción, navegación, filtrado. Una feature sin escenario asociado no está completa.
2. Las condiciones de aceptación de una tarea se derivan de esta Constitución + sus features; lo que no se puede describir, no se puede verificar.

---

## 5. P4 — Experiencia de usuario inmersiva (temática sonora y tecnológica)

> **No negociable en identidad, subordinado en accesibilidad.** La inmersión se construye *sobre* la usabilidad, nunca a su costa.

### 5.1 Identidad: **Cyber-Studio Neón**

1. La plataforma debe sentirse como una **cabina de estudio nocturna**: fondo `#06070e`, rejilla cian `rgba(6,182,212,.09)` y magenta `rgba(217,70,239,.06)` dibujada en capas, halos `blur-3xl` detrás de las tarjetas, acentos cian/magenta reservados para *acción y estado*.
2. **Un solo sistema visual**: todos los componentes usan los mismos tokens; no existen «azules» ni radios alternativos por componente.
3. La metáfora **ingeniería ↔ música** es hilo conductor del contenido y de la interfaz (paralelismos SOLID/armonía, Fiber/metrónomo, refactor/solo, eventos/contrapunto), no un adorno decorativo suelto.

### 5.2 Micro-interacciones con criterio

1. El **ecualizador animado** comunica *que está sonando* (información, no adorno) y se detiene en pausa; con `prefers-reduced-motion` se congela o atenúa.
2. El **scrubber neón** es arrastrable y operable con teclado (§2.4); su feedback visual es inmediato y proporcional a `currentTime`.
3. Transiciones cortas y consistentes (≤ ~200 ms); nada de animaciones que retrasen la reproducción o el primer render.
4. **Rendimiento como parte de la inmersión**: la portada debe pintar rápido; sin *layout shifts*; el audio arranca sin recargar.

### 5.3 Contenido con voz propia

1. Interfaz **en español** (etiquetas, estados, mensajes de error, textos alternativos). El inglés técnico solo dentro de términos consagrados.
2. Tono cercano y musical en los microcopy, pero **los estados de error son claros y literalmente descriptivos** («archivo no disponible (.m4a / .mp3)», no «algo salió mal»).
3. Los episodios muestran sus **notas técnicas** y **temas clave** junto al reproductor: la experiencia incluye leer mientras escuchas.

---

## 6. Orden de prelación ante conflictos

Cuando dos principios no puedan cumplirse a la vez, **gana el de mayor número**:

1. **P1 · Accesibilidad y semántica** — nunca se sacrifica.
2. **P2 · Audio nativo y honestidad del sonido** — nunca se sacrifica.
3. **P5 · Continuidad de la escucha** — el audio no se interrumpe por acciones periféricas.
4. **P3 · Arquitectura limpia y tipado estricto**.
5. **P4 · Inmersión y estética** — cede primero ante todo lo anterior.

> *Ejemplo resuelto:* un efecto visual choca con el contraste mínimo → se cambia el efecto. Una librería de audio promete un *scrubber* más bonito → se rechaza. Un filtro redibuja el listado y corta la reproducción → es un bug bloqueante, no un detalle.

---

## 7. Definición de «Hecho» (checklist de salida)

Una tarea está terminada **solo si** se cumple todo:

- [ ] Semántica HTML5 correcta; jerarquía de encabezados sin saltos; sin `div`/`span` con comportamiento semántico.
- [ ] ARIA válido y mínimo; estados (`aria-pressed`, `aria-current`, `aria-valuenow`, `aria-live`) gestionados de verdad.
- [ ] Contraste AA verificado en los tokens usados; foco visible en todos los controles.
- [ ] Recorrido completo con teclado (incluidos play/pausa, seek, volumen y velocidad) sin trampas de foco.
- [ ] Audio reproducido por `<audio>` nativo, tiempos derivados de `duration`/`currentTime`, sin librerías nuevas ni TTS.
- [ ] Estados de error del audio: mensaje literal + «Comprobar audio» + reintento `.m4a → .mp3`.
- [ ] `tsc --noEmit` y `eslint` en verde; sin `any`, sin `eslint-disable` injustificado.
- [ ] Nueva dependencia justificada (o ausente); `"use client"` solo donde hay estado.
- [ ] Escenario Gherkin añadido/actualizado si el comportamiento es nuevo o cambió.
- [ ] `prefers-reduced-motion` respetado por las animaciones nuevas.
- [ ] Copy en español y coherente con la identidad Cyber-Studio Neón (tokens, no colores sueltos).
- [ ] El árbol de código queda más limpio de lo que estaba.

---

## 8. Enmiendas a esta Constitución

1. Cualquier cambio se propone como **PR sobre `specs/01-constitution.md`** con justificación explícita y mención de qué cláusula deja de cumplirse.
2. Requiere **aprobación del autor del proyecto** (Patricia Aparicio Díaz) y, si el cambio toca §2 o §3, una actualización asociada en `tests/bdd/` o en la checklist de §7.
3. El **preámbulo y el orden de prelación (§6)** solo pueden modificarse con unanimidad; son el núcleo identitario del proyecto.
4. Toda versión actualizada incrementa el número de versión y añade una línea en el historial:

   | Versión | Fecha | Cambio |
   |---|---|---|
   | 1.0 | 2026-10-12 | Constitución inicial: 5 pilares, orden de prelación y checklist de «Hecho». |

---

*Donde el código encuentra su propio compás. Programar también es componer.*
**Sintaxis & Compás** © 2026 Patricia Aparicio Díaz
