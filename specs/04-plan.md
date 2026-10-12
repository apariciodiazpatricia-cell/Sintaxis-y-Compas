# 🛠️ Plan técnico — **Sintaxis & Compás**

> **Versión:** 1.0 · **Fecha:** 12 de octubre de 2026
> **Documento:** `specs/04-plan.md` · **Relacionados:** `01-constitution.md` (principios) · `02-specify.md` (el QUÉ) · `03-clarify.md` (decisiones cerradas)
>
> **Para qué sirve este archivo:** define el **CÓMO** — arquitectura técnica, stack, estructura de componentes, modelo de datos, estrategia de pruebas y reglas de verificación. Es la contraparte técnica de `02-specify.md`: todo requisito funcional (RF-x) debe poder rastrearse hasta aquí.

---

## 1. Stack tecnológico

| Capa | Elección | Versión | Por qué |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 16.4 | Enrutado por carpetas, Server Components por defecto, `metadata` nativo, prefetch parcial |
| Bundler | **Turbopack** | incluido en 16.4 | Arranque y recarga rápidos en desarrollo; integrado con Tailwind v4 vía regla de carga |
| Interfaz | **React** | 19.3 | Server Components, `use`, concurrencia; presupuesto de JavaScript de cliente mínimo |
| Lenguaje | **TypeScript** | 5 (modo `strict`) | Modelo de dominio tipado, unions discriminadas, cero `any` (Constitución §4.1) |
| Estilos | **Tailwind CSS** | 4 (CSS-first) | Sin archivo de configuración: tokens en `@theme`, utilidades y capas en CSS puro |
| Formateo/Lint | **ESLint** + `eslint-config-next` | 9 / 16.4 | Reglas de correctness y accesibilidad, configuración plana (`eslint.config.mjs`) |
| Audio | **`<audio>` nativo + Web APIs** | plataforma | Ver §3 |
| Tipografía | Geist Sans + Geist Mono | cargadas por defecto | Mono para datos/etiquetas, sans para lectura; sin peticiones externas en ejecución |

### 1.1 Ajustes de compilación y ejecución

`next.config.ts`:

| Opción | Valor | Efecto |
|---|---|---|
| `cacheComponents` | `true` | Caché de componentes (modo Cache Components de Next 16) |
| `partialPrefetching` | `true` | Prefetch parcial de rutas: navegación inmediata sin descargar de más |
| `turbopack.rules["*.css"]` | `@tailwindcss/turbopack` | Hoja de estilos procesada por Turbopack |
| `experimental.agentFeedback` | `true` | Retroalimentación de agentes (bloque en `AGENTS.md`, se conserva) |

Scripts (`package.json`): `dev` · `build` · `start` · `lint`.

### 1.2 Reglas de configuración

1. **Alias de rutas:** `@/*` → raíz del proyecto. Importaciones siempre relativas al alias, nunca con saltos `../../../`.
2. **Sin archivo de configuración de estilos**: Tailwind v4 se declara en CSS (`@import "tailwindcss"` + `@theme inline`).
3. **Nada de `strict: false`, `noImplicitAny: false` ni `// eslint-disable` sin justificación en línea.**
4. Toda nueva dependencia se justifica en su PR (Constitución §3.2); hoy `dependencies` solo contiene `next`, `react`, `react-dom`.

---

## 2. Arquitectura de aplicación

### 2.1 Estructura de carpetas

```text
podcast-espanol/
├── app/
│   ├── components/
│   │   ├── AudioPlayer.tsx      # Reproductor: estado de escucha + controles + panel de notas
│   │   ├── Navbar.tsx           # Barra fija: logo, 4 destinos, CTA Spotify
│   │   ├── Footer.tsx           # Manifiesto, navegación, plataformas, tarjeta de señal
│   │   ├── CategoryChip.tsx     # Chip de categoría reutilizable (4 variantes)
│   │   └── PlatformIcons.tsx    # Datos + iconos de Spotify/Apple/YouTube/iVoox
│   ├── data/
│   │   └── episodes.ts          # Modelo tipado + catálogo de episodios
│   ├── episodes/page.tsx        # /episodes  → CU-2
│   ├── about/page.tsx           # /about     → CU-3
│   ├── contact/page.tsx         # /contact   → CU-4
│   ├── globals.css              # Tokens @theme + rejilla + utilidades neón + ecualizador
│   ├── layout.tsx               # Shell: <html lang="es"> + Navbar + main + Footer + metadata
│   └── page.tsx                 # /          → CU-1
├── public/
│   ├── audio/                   # ep-01…ep-04 (.m4a + red de seguridad .mp3)
│   └── banner.svg
├── tests/bdd/                   # Especificaciones Gherkin (locale es)
├── specs/                       # Serie 01–04 (esta)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

### 2.2 Flujo de dependencias (una sola dirección)

```text
app/data/episodes.ts          ← fuente de verdad del dominio (tipada)
        │
        ▼
app/components/*              ← presentación e interacción (props tipadas)
        │
        ▼
app/<ruta>/page.tsx           ← composición por ruta + estado local
        │
        ▼
app/layout.tsx                ← shell global (Navbar + main + Footer)
```

**Reglas**

1. Un componente de presentación **no** importa de otro hermano ni conoce rutas: recibe datos por props.
2. El estado de escucha **no** vive disperso en las páginas: cada ruta que muestra reproductor posee únicamente el *episodio activo*; todo lo demás (tiempo, velocidad, volumen, fuente) vive dentro de `AudioPlayer`.
3. `app/data` **no** importa de `components` ni de `pages` (el dominio no depende de la interfaz).

### 2.3 Shell y metadatos

`app/layout.tsx`:

- `<html lang="es">` con las dos tipografías cargadas por defecto y expuestas como variables CSS (`--font-geist-sans`, `--font-geist-mono`).
- Estructura semántica: `<Navbar />` → `<main class="flex-1">{children}</main>` → `<Footer />`.
- `metadata` exportada: título y descripción del show (SEO y pestaña).
- `Navbar` y `Footer` son persistentes en **todas** las rutas (RF-G.01 / RF-G.02).

---

## 3. API multimedia: audio nativo y Web Audio API

### 3.1 Núcleo: `<audio>` de HTML5 (obligatorio)

Un único elemento `<audio>` oculto (`className="hidden"`, nunca eliminado del árbol) es **la única autoridad de reproducción**. Se controla mediante su API directa y se observa mediante sus eventos:

| Evento / propiedad | Uso en la interfaz |
|---|---|
| `play()` / `pause()` | Alternancia reproducir/pausar, con captura de rechazo (`catch`) para no prometer un estado que no ocurre |
| `onPlay` / `onPause` / `onEnded` | Estado visible *«sonando» / «en pausa»*, animación del ecualizador |
| `onTimeUpdate` → `currentTime` | Reloj transcurrido + barra de progreso (C-02) |
| `onLoadedMetadata` → `duration` | Duración real; sustituye a la provisional del catálogo |
| `playbackRate` | Selector de velocidad `1x · 1.25x · 1.5x` |
| `volume` / `muted` | Control de volumen y silencio |
| `onError` | Cadena de fallback de formato (C-01) |
| `preload="metadata"` | Duración disponible sin descargar el archivo completo |

**Código de control concentrado en `AudioPlayer.tsx`:**

```text
togglePlay()      → si hay error fuente: reintenta + reproduce; si no: play()/pause()
tryPlay()         → marca intención (wantPlayRef) y reproduce; estado solo si tuvo éxito
handleAudioError()→ alterna .m4a ⇄ .mp3 UNA vez (failedSrcRef) o marca sourceError
retrySource()     → 🔄 limpia el fallo y vuelve al archivo declarado
seek(t)           → audio.currentTime = t y espejo inmediato en estado
```

**Refs de coordinación (evitan efectos duplicados y bucles):**

| Ref | Propósito |
|---|---|
| `audioRef` | Acceso de bajo nivel al elemento de audio |
| `shouldPlayRef` | «El cambio de episodio venía de una tarjeta → arrancar al cargar» |
| `wantPlayRef` | «El usuario quiere que suene» (para reintentar tras un fallo de formato) |
| `failedSrcRef` | Fuente ya fallida: **evita bucles de reintento** |
| `lastActiveRef` | Identidad del episodio vigente: evita recargas inúles si la referencia no cambió |

**Garantías derivadas (Constitución §3):** sin librerías de audio de terceros · sin `speechSynthesis` · `currentTime`/`duration` como única fuente de verdad · reintento de formato como máximo una vez.

### 3.2 Web Audio API (reservada, con condiciones)

**Estado actual:** *no se usa*. El ecualizador es **decorativo** (CSS: `@keyframes eq` + clase `.eq-bar`, pausado vía `animation-play-state` cuando no suena). Es una decisión deliberada: cero coste de CPU, cero riesgo de autoreproducción bloqueada y cero complejidad en el hilo crítico.

**Cuándo y cómo se permitirá su uso** (si se decide en una fase futura):

1. Solo para **visualización real** del espectro (`AnalyserNode`) detrás del ecualizador, nunca para producir ni procesar el sonido que escucha el oyente.
2. Se conecta **después de un gesto explícito del usuario** (pulsar play), para respetar las políticas de inicio de audio de los navegadores.
3. Se crea **un solo contexto por página** y se desconecta/reutiliza al cambiar de episodio (nodo por reproducción, sin fugas).
4. Requiere un PR que actualice este documento y justifique el impacto en rendimiento y accesibilidad (Respeto a `prefers-reduced-motion`: con movimiento reducido, la visualización se desactiva aunque el audio siga sonando).
5. **Prohibido** envolver la API en una dependencia pesada (Constitución §3.2): son ~30–50 líneas propias.

---

## 4. Arquitectura de componentes

### 4.1 Inventario

| Archivo | Rol | Cliente/Servidor | Estado que posee |
|---|---|---|---|
| `app/components/AudioPlayer.tsx` | Reproductor completo (controles + panel de notas + `<audio>`) | **Client Component** (`"use client"`) | Episodio vigente, play/pausa, tiempo, duración, velocidad, volumen, silencio, fuente resuelta, estado de error |
| `app/components/Navbar.tsx` | Barra fija con destinos y CTA | **Client Component** | Ruta actual (para el estado activo) |
| `app/components/Footer.tsx` | Pie: manifiesto, navegación, plataformas, tarjeta de señal | **Servidor** (`use cache`) | Ninguno |
| `app/components/CategoryChip.tsx` | Chip visual de categoría | Servidor (presentación pura) | Ninguno (props) |
| `app/components/PlatformIcons.tsx` | Datos e iconos de plataformas | Servidor (datos + SVG) | Ninguno |
| `app/data/episodes.ts` | Modelo de dominio + catálogo | Módulo de datos | Ninguno (constante tipada) |
| `app/page.tsx` | Portada (CU-1) | **Client Component** | `episodioActivo` |
| `app/episodes/page.tsx` | Catálogo (CU-2) | **Client Component** | `query`, `filtro`, `episodioActivo` |
| `app/about/page.tsx` | Sobre el show (CU-3) | **Servidor** | Ninguno |
| `app/contact/page.tsx` | Contacto (CU-4) | **Client Component** | campos, `errores`, `estado` del envío |
| `app/layout.tsx` | Shell + metadata | **Servidor** | — |

> **Criterio `"use client"`:** solo donde existe **estado real o manejo de eventos sostenido**. El resto se resuelve en servidor para minimizar JavaScript enviado (Constitución §3.2).

### 4.2 `AudioPlayer.tsx` — diseño interno

```text
AudioPlayer({ initialEpisode, activeEpisode })
├── NeonSlider              # control deslizante reutilizable (progreso y volumen)
│     · role="slider" + aria-valuenow/min/max/valuetext
│     · pointer capture: arrastre continuo sobre la pista
│     · teclado: ← → ↑ ↓ (±5 %), Home (inicio), End (fin)
├── PlayPauseIcon / VolumeIcon   # SVG inline, aria-hidden
├── Cabecera de estado            # chip categoría · número · fecha · duración
├── Indicador de fuente           # 🎧 Audio de Estudio · M4A/MP3  |  ⚠ + 🔄 Comprobar audio
├── Barra de progreso             # mm:ss ─ NeonSlider ─ mm:ss
├── Velocidad (1x/1.25x/1.5x)     # aria-pressed por opción
├── Volumen                       # mute (aria-pressed) + NeonSlider
├── 📝 Panel «Temas Clave»        # keyTopics numerados + notes
└── <audio preload="metadata">    # fuente única de verdad, oculta visualmente
```

**Máquina de estados simplificada**

```text
                    ┌────────────► [sourceError] ──🔄 retry──► fuente declarada
cargar(episodio) ───┤
                    └──► [idle/en pausa] ──play()──► [sonando] ──pause()/ended──► [en pausa]
                                              │
                                              └── error sin alterno ──► [sourceError]
```

**Ciclo de cambio de episodio** (idéntico en `/` y `/episodes`):

1. Tarjeta → `setEpisodioActivo({ ...episode })` (nueva referencia, fuerza el efecto aunque sea el mismo id).
2. `AudioPlayer` detecta el cambio vía `lastActiveRef` → `shouldPlayRef.current = true` → `setEpisode`.
3. Efecto de episodio: limpia fallos y tiempos, asigna `audio.src`, `load()` y, si había intención de reproducción, `tryPlay()`.
4. La ruta desplaza la vista hasta `#reproductor` (`scrollIntoView({ behavior: "smooth", block: "center" })`).

### 4.3 Estado compartido y continuidad (RF-G.03)

| Situación | Mecanismo |
|---|---|
| Cambiar de ruta | El `<audio>` vive en el cliente de la ruta; al volver, el episodio se re-binda. **La implementación actual garantiza «sigue vinculado y operable»** (escenario *keeps the active episode between views*). |
| Filtrar/buscar | No toca el reproductor: `query` y `filtro` son estado aislado en `episodes/page.tsx`. |
| Futura continuidad total (audio sin cortar entre rutas) | **Decisión abierta:** subir el reproductor al shell (`layout`) o moverlo a una capa flotante persistente. Requiere PR que actualice `02-specify.md` RF-G.03 y este documento. |

### 4.4 Rutas

| Ruta | Archivo | CU | Cliente | Contenido clave |
|---|---|---|---|---|
| `/` | `app/page.tsx` | CU-1 | Sí | Hero + reproductor + 4 tarjetas + plataformas |
| `/episodes` | `app/episodes/page.tsx` | CU-2 | Sí | Buscador, chips, contador, listado/estado vacío, reproductor |
| `/about` | `app/about/page.tsx` | CU-3 | No | Manifiesto, anfitriones, estudio/herramientas, CTA |
| `/contact` | `app/contact/page.tsx` | CU-4 | Sí | Formulario validado, confirmación, comunidad |

Cada `page.tsx` es el punto de entrada de su segmento; no hay rutas dinámicas (`[slug]`) en esta fase: los episodios se seleccionan **dentro** de la vista, no por URL.

### 4.5 Modelo de datos — `app/data/episodes.ts`

```ts
export interface Episode {
    id: number;
    slug: string;
    number: string;      // "EP. 01"
    title: string;
    description: string;
    duration: string;    // "11:58" → valor provisional (C-02)
    date: string;        // "8 Octubre, 2026"
    category: "Frontend" | "Creativity" | "Architecture" | "Career";
    audioUrl: string;    // "/audio/ep-01.m4a"
    guest?: string;
    notes: string[];     // notas técnicas (3)
    keyTopics: string[]; // temas clave del debate (6)
}
```

**Decisiones**

1. **Contenido como datos**: añadir un episodio = un objeto + su archivo en `public/audio/`; **cero** cambios en la interfaz.
2. `category` es una **unión literal**: añadir una categoría exige actualizar también `CATEGORY_LABELS`/`CATEGORY_STYLES` (el compilador obliga por `Record<Episode["category"], …>`).
3. Uniones de estado discriminadas en toda la app:
   `type Estado = "idle" | "enviando" | "enviado"` (formulario) · `sourceError: boolean` (reproductor) · `filtro: "todos" | "Frontend" | …`.
4. Normalización de búsqueda (C-03): `normalize("NFD")` + retirada de diacríticos + `toLowerCase()` sobre `number | title | description | …notes`.

### 4.6 Sistema de estilos

| Pieza | Dónde | Función |
|---|---|---|
| `@import "tailwindcss"` | `globals.css` | Entrada de Tailwind v4 (CSS-first) |
| `@theme inline` | `globals.css` | Tokens: `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono` |
| Rejilla Cyber-Studio | `body` | 4 capas de `linear-gradient` (cian/magenta) sobre `#06070e`, `background-attachment: fixed` |
| `.neon-cyan` / `.neon-magenta` / `.neon-glow-text` | `globals.css` | Utilidades de resplandor reutilizables (sin repetir sombras en plantillas) |
| `@keyframes eq` + `.eq-bar` | `globals.css` | Ecualizador decorativo; pausado cuando no suena |
| `prefers-reduced-motion` | `globals.css` (`@media`, líneas 102-114) | Duración `0.001ms !important` en `*`, `*::before`, `*::after` (detiene `eq`, `animate-ping` y transiciones) + `.eq-bar` con `scaleY(0.75)` estático ✅ *verificado 2026-10-12* |

**Regla:** colores y radios **solo** desde tokens o utilidades del sistema; los halos `blur-3xl` son decorativos (`aria-hidden`, `pointer-events-none`).

---

## 5. Estrategia de pruebas

### 5.1 BDD con Gherkin — `tests/bdd/`

| Archivo | Cubre | Escenarios |
|---|---|---|
| `reproduccion-de-audio.feature` | CU-1 / RF-1.02–1.04 · C-01, C-02, C-04 | 9 (incluye `Scenario Outline` de velocidad con 3 ejemplos) |
| `navegacion.feature` | RF-G.01, RF-G.03 · CU-1/2/3 | 7 |
| `filtrado-y-busqueda.feature` | RF-2.02–2.04 · C-03 | 5 |

**Convenciones**

1. **Locale `es`**: `Dado / Cuando / Entonces / Y` (Keywords: Given/When/Then/And en la cabecera de cada feature).
2. Cada feature se escribe **en orientación al usuario** («Como oyente…») y nombra selectores por **texto visible**, no por implementación.
3. **Trazabilidad obligatoria**: todo requisito RF nuevo ⇒ escenario nuevo o ampliado (ver tabla de `02-specify.md` §8). Huecos hoy: RF-4.02 (formulario) y RF-3.03/3.05 (presentadores/CTA) → **tareas abiertas**.
4. Ejecución automatizada: **pendiente de definir el runner** (decisión de fase 2: elegir orquestador y añadir script `test`). Mientras tanto, las features funcionan como **especificación viva y checklist de aceptación manual**.

### 5.2 Verificación manual (antes de cerrar cada tarea)

| Área | Comprobación |
|---|---|
| Tipos y lint | `npx tsc --noEmit` y `npm run lint` en verde |
| Producción | `npm run build` sin errores ni avisos nuevos |
| Teclado | Recorrer la ruta completa con `Tab` + `Espacio`/`Enter`; probar play, seek (←/→), volumen, velocidad, chips y formulario |
| Lector de pantalla | Bloque del reproductor: estado anunciado (`sonando`/`en pausa`), etiquetas de sliders, chip de fuente |
| Contraste | Verificar tokens cian/magenta sobre `#06070e` (≥ 4.5:1 texto normal) |
| Movimiento | Con «reducir movimiento» activo: ecualizador y `animate-ping` detenidos |
| Fallback de audio | Renombrar un `.m4a` → debe caer a `.mp3`; renombrar ambos → mensaje + 🔄 |
| Responsive | Móvil (360 px), tableta (768 px), escritorio (1280 px): sin solapes ni cortes |

### 5.3 Presupuestos de calidad

| Métrica | Objetivo |
|---|---|
| Dependencias de producción | `next`, `react`, `react-dom` (cero excepciones sin RFC) |
| JavaScript de cliente | Solo rutas con estado (`/`, `/episodes`, `/contact` + `AudioPlayer`) |
| Carga de audio | `preload="metadata"`; nunca precargar el catálogo completo |
| Accesibilidad | WCAG 2.2 AA en contraste y operabilidad (Constitución §2) |
| Contenido | `app/` intacto salvo por tareas con PR y escenario asociado |

---

## 6. Fases de entrega

| Fase | Entregable | Estado |
|---|---|---|
| **0** | Estructura inicial, tokens, shell, rejilla | ✅ Hecho |
| **1** | Navbar, Footer, chips, iconos de plataforma | ✅ Hecho |
| **2** | `AudioPlayer` con controles nativos y panel de notas | ✅ Hecho |
| **3** | Catálogo con contenido tipado, 4 episodios reales | ✅ Hecho |
| **4** | Rutas `/episodes`, `/about`, `/contact` + formulario validado | ✅ Hecho |
| **5** | Especificaciones Gherkin (3 features) y README técnico | ✅ Hecho |
| **6** | **Serie `specs/` 01–04** (constitución, especificación, clarificaciones, plan) | ✅ Hecho |
| **7** | Suite de pruebas automatizadas + runner BDD | ⬜ Pendiente |
| **8** | Auditoría a11y con lector real + enlace «Saltar al contenido» (Constitución §2.4.4, **ausente** en `app/`) | ⬜ Pendiente |
| **9** | Continuidad total del audio entre rutas (§4.3, decisión abierta) | ⬜ Pendiente |
| **10** | Visualización con Web Audio API bajo las condiciones de §3.2 | ⬜ Opcional |
| **11** | Dejar `npm run lint` en verde (10 errores `react/jsx-no-comment-textnodes` + 1 directiva `eslint-disable` sin uso en `AudioPlayer.tsx:332`) y unificar los mapas de categoría de `AudioPlayer` con `CATEGORY_CHIP` (F-01/F-02 del acta de `05-tasks.md`) | ⬜ Pendiente |

---

## 7. Cómo usar este documento

1. **Antes de codificar** una RF, localizar su entrada aquí (ruta, componente, dato implicado).
2. **Si cambia la arquitectura** (nueva dependencia, reproductor en el shell, runner de pruebas), se actualiza **este archivo en el mismo PR**.
3. **Si una decisión técnica contradice la Constitución**, manda la Constitución: se escala como enmienda (§8 de `01-constitution.md`) antes de implementar.
4. Este documento **no** reemplaza los criterios de aceptación: esos viven en `02-specify.md` y `tests/bdd/`.

---

*Donde el código encuentra su propio compás. Programar también es componer.*
**Sintaxis & Compás** © 2026 Patricia Aparicio Díaz
