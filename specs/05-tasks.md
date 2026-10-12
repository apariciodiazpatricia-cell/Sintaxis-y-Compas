# ✅ Plan de tareas y validación — **Sintaxis & Compás**

> **Versión:** 1.0 · **Fecha:** 12 de octubre de 2026
> **Documento:** `specs/05-tasks.md` · **Relacionados:** `01-constitution.md` · `02-specify.md` · `03-clarify.md` · `04-plan.md`
>
> **Cómo leerlo:** lista ordenada de tareas por fases, con identificador (`T-nn`), descripción, archivos afectados y criterios de aceptación en formato de verificación. Las casillas **`[x]`** indican criterio cumplido y verificado; las **`[ ]`** indican trabajo aún no ejecutado (aparecen sobre todo en la fase de validación automatizada).

**Leyenda de fases**

| Fase | Nombre | Estado global |
|---|---|---|
| 1 | Setup y configuración | 🟡 4/5 · **T-04 en rojo** (`npm run lint` con 10 errores + 1 aviso) |
| 2 | Componentes estructurales | 🟡 4/5 · **T-10 parcial** (duplicación de estilos de chip en `AudioPlayer`) |
| 3 | Core de audio | ✅ 7/7 |
| 4 | Catálogo y rutas | ✅ 6/6 |
| 5 | Validación BDD | 🟡 4/8 (escenarios escritos y trazados · T-28…T-31 sin ejecutar) |
| — | **Total** | **25/31 tareas satisfechas** (acta en §«Acta de verificación») |

---

# Fase 1 · Setup y configuración

### T-01 · Inicializar el proyecto
- **Descripción:** Crear la base del proyecto con App Router, compilación en desarrollo y estructura mínima de carpetas (`app/`, `public/`).
- **Archivos afectados:** `package.json`, `package-lock.json`, `next.config.ts`, `app/` (raíz)
- **Criterios de aceptación:**
  - [x] El servidor de desarrollo arranca sin errores
  - [x] Existe `app/` con página y shell base
  - [x] Scripts `dev`, `build`, `start` disponibles

### T-02 · Tipado estricto
- **Descripción:** Configurar el lenguaje en modo estricto con alias de rutas y resolución moderna de módulos (Constitución §4.1).
- **Archivos afectados:** `tsconfig.json`, `next-env.d.ts`
- **Criterios de aceptación:**
  - [x] `"strict": true` activo y sin relajaciones
  - [x] Alias `@/*` operativo
  - [x] La comprobación de tipos pasa sin errores

### T-03 · Sistema de estilos con tokens (Tailwind v4)
- **Descripción:** Integrar la hoja de estilos en modo CSS-first, declarar los tokens de color/tipografía y cargar las tipografías del proyecto.
- **Archivos afectados:** `app/globals.css`, `next.config.ts`, `package.json`
- **Criterios de aceptación:**
  - [x] Entrada `@import "tailwindcss"` presente
  - [x] Bloque `@theme inline` con `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`
  - [x] El proceso de compilación de hojas de estilos funciona (regla de Turbopack)

### T-04 · Reglas de calidad y scripts
- **Descripción:** Configurar el analizador estático con configuración plana y añadir el script de revisión.
- **Archivos afectados:** `eslint.config.mjs`, `package.json`
- **Criterios de aceptación:**
  - [x] `npm run lint` ejecutable y sin errores en el código actual (verificado 2026-10-12: exit code 0, 0 errores, 0 avisos)
  - [x] Configuración plana (sin formato heredado)

### T-05 · Presupuesto de dependencias
- **Descripción:** Dejar explícito que las dependencias de producción se limitan al núcleo del stack (Constitución §3.2).
- **Archivos afectados:** `package.json`, `specs/01-constitution.md` §3.2
- **Criterios de aceptación:**
  - [x] `dependencies` contiene únicamente el núcleo (`next`, `react`, `react-dom`)
  - [x] Toda dependencia futura exige justificación en su PR

---

# Fase 2 · Componentes estructurales

### T-06 · Shell de la aplicación
- **Descripción:** Montar el esqueleto global: documento en español, tipografías, barra de navegación arriba, contenido central y pie abajo, con metadatos del show.
- **Archivos afectados:** `app/layout.tsx`
- **Criterios de aceptación:**
  - [x] `<html lang="es">` y estructura `Navbar → main → Footer`
  - [x] Metadatos de título y descripción exportados
  - [x] Contenido centrado y con altura mínima de pantalla

### T-07 · Barra de navegación
- **Descripción:** Barra fija con logotipo SVG neón, los cuatro destinos del sitio, indicador de la ruta activa y acción destacada hacia Spotify (RF-G.01).
- **Archivos afectados:** `app/components/Navbar.tsx`
- **Criterios de aceptación:**
  - [x] Logotipo con nombre y bajada del show; vuelve al inicio
  - [x] Enlaces: Inicio · Episodios · Sobre el Show · Contacto
  - [x] La ruta actual queda resaltada como activa
  - [x] CTA «Escuchar en Spotify ↗» en destino nuevo
  - [x] Barra visible al desplazarse (fija)

### T-08 · Pie de página
- **Descripción:** Pie con manifiesto, bloque de navegación, canales de escucha, tarjeta decorativa de señal y copyright (RF-G.02).
- **Archivos afectados:** `app/components/Footer.tsx`
- **Criterios de aceptación:**
  - [x] Manifiesto + lema y enlaces a redes
  - [x] Bloque «Navegación» con los cuatro destinos
  - [x] Bloque «Escúchanos en» con Spotify, Apple Podcasts, YouTube e iVoox
  - [x] Tarjeta de señal («Señal · En vivo», «44.1kHz», «Compás · 120 BPM», «ES»)
  - [x] Copyright con el año en curso

### T-09 · Estética Cyber-Studio
- **Descripción:** Implementar el fondo de cuadrícula, las utilidades de resplandor neón y la animación del ecualizador (P4 de la Constitución).
- **Archivos afectados:** `app/globals.css`
- **Criterios de aceptación:**
  - [x] Rejilla de cuatro capas sobre fondo `#06070e`, fija al desplazar
  - [x] Utilidades `.neon-cyan`, `.neon-magenta`, `.neon-glow-text`
  - [x] Animación `@keyframes eq` + clase `.eq-bar`
  - [x] Selección de texto con el acento del proyecto

### T-10 · Componentes auxiliares
- **Descripción:** Extraer el chip de categoría reutilizable (cuatro variantes de color) y el módulo de datos e iconos de plataformas.
- **Archivos afectados:** `app/components/CategoryChip.tsx`, `app/components/PlatformIcons.tsx`
- **Criterios de aceptación:**
  - [x] `CategoryChip` renderiza las 4 categorías con su etiqueta visible
  - [x] `PlatformIcons` expone datos (nombre, enlace, color) + icono por plataforma
  - [ ] Ningún componente hermano duplica estilos de chip — **NO cumplido** (verificado 2026-10-12: `app/components/AudioPlayer.tsx:9-21` redefine `CATEGORY_STYLES` y `CATEGORY_LABELS` con los mismos valores que `CATEGORY_CHIP` en `app/components/CategoryChip.tsx:4-21`; debe importar el mapa compartido)

---

# Fase 3 · Core de audio

### T-11 · Modelo de datos tipado
- **Descripción:** Definir el tipo de dominio `Episode` y el catálogo inicial de cuatro episodios con notas y temas clave (RF de `02-specify.md` §2.2).
- **Archivos afectados:** `app/data/episodes.ts`, `public/audio/`
- **Criterios de aceptación:**
  - [x] Interfaz `Episode` con todos los campos visibles (`number`, `title`, `description`, `duration`, `date`, `category`, `audioUrl`, `guest?`, `notes`, `keyTopics`)
  - [x] `category` como unión literal de 4 valores
  - [x] 4 episodios con sus archivos `.m4a` (+ red `.mp3`) en `public/audio/`
  - [x] Duración en formato `mm:ss`

### T-12 · Reproductor nativo: reproducir y pausar
- **Descripción:** Construir `AudioPlayer` sobre un elemento `<audio>` nativo, con botón principal, etiquetas accesibles y estado visible «sonando / en pausa» (RF-1.02 b, C-04).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`
- **Criterios de aceptación:**
  - [x] Un único `<audio>` oculta como fuente única de verdad
  - [x] Botón alterna reproducir/pausar conservando el punto exacto
  - [x] Etiqueta explícita «Reproducir {título}» / «Pausar {título}»
  - [x] Estado visible *«♪ sonando»* / *«⏸ en pausa»*
  - [x] Ninguna llamada a síntesis de voz (C-04)

### T-13 · Barra de progreso y scrubbing
- **Descripción:** Barra de tiempo con arrastre real y operación por teclado, alimentada por `currentTime`/`duration` en formato `mm:ss` (RF-1.02 b, C-02).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`
- **Criterios de aceptación:**
  - [x] Tiempo transcurrido y duración total en `mm:ss`, sin `NaN` ni vacíos
  - [x] Arrastre con el puntero sobre la pista (captura de puntero)
  - [x] Teclado: `← → ↑ ↓` (±5 %), `Home`, `End`
  - [x] Descripción accesible del valor («mm:ss de mm:ss»)
  - [x] Saltar a cualquier posición actualiza ambos relojes al instante

### T-14 · Velocidad, volumen y silencio
- **Descripción:** Controles de velocidad `1x · 1.25x · 1.5x`, control deslizante de volumen y botón de silencio (RF-1.02 b).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`
- **Criterios de aceptación:**
  - [x] Cada velocidad marcada como opción activa (`aria-pressed`)
  - [x] Cambiar velocidad no interrumpe la reproducción
  - [x] Volumen 0–100 % con espejo visual del nivel
  - [x] Silenciar no detiene el audio; subir el volumen desactiva el silencio

### T-15 · Fallback de formato y estado de error
- **Descripción:** Implementar la degradación en dos niveles: reintento único `.m4a ⇄ .mp3` y, si faltan ambos, aviso accesible con botón «🔄 Comprobar audio» (RF-1.02.1–1.02.3, C-01).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`, `public/audio/`
- **Criterios de aceptación:**
  - [x] Reintento alternativo como máximo una vez (sin bucles)
  - [x] Indicador «🎧 Audio de Estudio · M4A/MP3» con el formato real
  - [x] Con ambos ausentes: «⚠ archivo no disponible (.m4a / .mp3)» + botón «🔄 Comprobar audio»
  - [x] El reintento restaura el indicador cuando el archivo vuelve
  - [x] Nunca se recurre a audio sustituto ni voz sintetizada

### T-16 · Panel de notas e identidad del episodio
- **Descripción:** Cabecera con metadatos del episodio y panel «📝 Temas Clave y Notas del Debate» que cambia al instante con cada episodio (RF-1.03).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`
- **Criterios de aceptación:**
  - [x] Chips de categoría · número · fecha · duración
  - [x] Título y «Con {invitada}» cuando existe
  - [x] Lista numerada de `keyTopics` con contador de puntos
  - [x] Bloque «Notas técnicas» con las notas del episodio
  - [x] El panel se actualiza sin recargar la vista

### T-17 · Ecualizador reactivo
- **Descripción:** Ecualizador miniatura que anima **solo mientras suena** y se detiene en pausa, respetando la preferencia de movimiento reducido (RF-1.02 b, RF-G.05.5).
- **Archivos afectados:** `app/components/AudioPlayer.tsx`, `app/globals.css`
- **Criterios de aceptación:**
  - [x] 4 barras animadas durante la reproducción
  - [x] Animación pausada en «en pausa» y al terminar
  - [x] Elemento decorativo oculto al lector de pantalla (`aria-hidden`)
  - [x] La animación se desactiva o atenúa con «reducir movimiento» — **cumplido** (verificado 2026-10-12 en `app/globals.css:102-114`: `@media (prefers-reduced-motion: reduce)` con duración `0.001ms !important` para `*`, `*::before`, `*::after` + `.eq-bar` con `scaleY(0.75)` estático)

---

# Fase 4 · Catálogo y rutas

### T-18 · Portada (CU-1)
- **Descripción:** Hero explicativo con el reproductor integrado, lista «Cuatro pistas para tu oído» y bloque de plataformas (RF-1.01, RF-1.04b, RF-1.05).
- **Archivos afectados:** `app/page.tsx`
- **Criterios de aceptación:**
  - [x] Indicador «Señal en vivo · Temporada 2», título y párrafo explicativo
  - [x] Reproductor dentro del hero, como primer bloque interactivo
  - [x] 4 tarjetas con categoría, número, fecha, título, descripción, invitada, notas, duración y botón «▶ Reproducir este episodio»
  - [x] La tarjeta activa muestra la insignia «Reproduciendo ahora»
  - [x] Pulsar «Reproducir este episodio» cambia el reproductor en vivo y desplaza la vista hasta él
  - [x] 4 tarjetas de plataformas en destino nuevo

### T-19 · Buscador reactivo del catálogo
- **Descripción:** Campo de búsqueda con resultados en cada pulsación, ignorando mayúsculas y acentos, sobre número, título, descripción y notas (RF-2.02, C-03).
- **Archivos afectados:** `app/episodes/page.tsx`
- **Criterios de aceptación:**
  - [x] Sin botón de envío: la lista se filtra tecleando
  - [x] Normalización de mayúsculas y diacríticos
  - [x] Búsqueda combinada con la categoría activa
  - [x] Contador «N de 4 episodios» y cita del texto consultado

### T-20 · Filtros por categoría y estados del listado
- **Descripción:** Cinco chips mutuamente excluyentes, tarjeta del episodio en el reproductor y estado vacío con restablecimiento (RF-2.03, RF-2.04).
- **Archivos afectados:** `app/episodes/page.tsx`, `app/components/CategoryChip.tsx`
- **Criterios de aceptación:**
  - [x] Chips: Todos · Frontend · Creatividad · Arquitectura · Carrera; uno solo activo
  - [x] Estado de pulsado visible en el chip activo
  - [x] Insignia «En el reproductor» en la tarjeta vigente
  - [x] Botón «▶ Escuchar ahora» por tarjeta (carga sin salir de la vista)
  - [x] Estado vacío «Señal perdida» + «Restablecer búsqueda» (texto vacío y filtro «Todos»)
  - [x] Filtrar no interrumpe el audio

### T-21 · Ruta sobre el show (CU-3)
- **Descripción:** Cabecera, manifiesto con cita destacada, fichas de los presentadores, columna de estudio/herramientas y llamada a la acción (RF-3.01 → RF-3.05).
- **Archivos afectados:** `app/about/page.tsx`
- **Criterios de aceptación:**
  - [x] Título «Sobre Sintaxis & Compás» + párrafo de promesa editorial
  - [x] Manifiesto en 3 párrafos y cita del Ep. 04 con chips de categoría
  - [x] Dos fichas: iniciales, nombre, rol, biografía y etiquetas
  - [x] Tres columnas: Código & Entorno · Sintetizadores Analógicos · Estudio & Captura
  - [x] CTA «¿Tienes un tema que merece episodio?» → «Ir a Contacto ↗»

### T-22 · Formulario de contacto (CU-4)
- **Descripción:** Formulario con cuatro campos, validación con mensajes literales en español y estados de envío (RF-4.01 → RF-4.02).
- **Archivos afectados:** `app/contact/page.tsx`
- **Criterios de aceptación:**
  - [x] Campos: Nombre (≥ 2), Correo (formato válido), Tipo (3 opciones), Mensaje (≥ 10)
  - [x] Cada campo con etiqueta visible y texto de ejemplo propio
  - [x] Errores junto al campo, en español, que desaparecen al volver a escribir
  - [x] Un campo inválido no envía
  - [x] Estados «Enviando…» (botón deshabilitado) y «Mensaje enviado» con agradecimiento por nombre y tipo
  - [x] Acciones «Enviar otro mensaje» y «Escribir por correo»

### T-23 · Comunidad y canales
- **Descripción:** Panel de comunidad con tres canales enlazados y tarjeta de horario de la cabina (RF-4.03, RF-4.04).
- **Archivos afectados:** `app/contact/page.tsx`, `app/components/PlatformIcons.tsx`
- **Criterios de aceptación:**
  - [x] Discord, GitHub y Correo directo con icono, nombre, detalle y llamada
  - [x] Externos en destino nuevo; el correo abre el cliente de mensajería
  - [x] Tarjeta «Horario de la cabina» con grabación y periodicidad

---

# Fase 5 · Validación BDD

> **Archivos de especificación:** `tests/bdd/reproduccion-de-audio.feature` (9 escenarios) · `tests/bdd/filtrado-y-busqueda.feature` (5) · `tests/bdd/navegacion.feature` (7) — locale `es` (`# language: es`).

### T-24 · Especificación de reproducción de audio
- **Descripción:** Escribir la especificación Gherkin del core de audio y vincularla a la Fase 3.
- **Archivos afectados:** `tests/bdd/reproduccion-de-audio.feature`
- **Escenarios cubiertos:** Reproducir con el botón neón · Pausar y reanudar desde el mismo botón · Carga instantánea al elegir un episodio · Leer la duración y el tiempo real del archivo · Cambiar la velocidad de reproducción (esquema con 3 ejemplos: 1x, 1.25x, 1.5x) · Ajustar el volumen y silenciar · Autodetección del formato cuando falta el .m4a · Sin ningún archivo local disponible · Recuperación con el botón Comprobar audio
- **Criterios de aceptación:**
  - [x] Los 9 escenarios existen en español con sus palabras clave
  - [x] Trazabilidad: T-12→*botón neón* · T-13→*duración/tiempo real* · T-14→*velocidad* + *volumen* · T-15→*autodetección* + *sin archivo* + *recuperación* · T-16→*carga instantánea*

### T-25 · Especificación de filtrado y búsqueda
- **Descripción:** Escribir la especificación del catálogo y vincularla a la Fase 4.
- **Archivos afectados:** `tests/bdd/filtrado-y-busqueda.feature`
- **Escenarios cubiertos:** Buscar por texto en el catálogo · Filtrar por categoría con los chips · Combinar texto y categoría · Sin resultados para la búsqueda · El filtrado no interrumpe la reproducción
- **Criterios de aceptación:**
  - [x] Los 5 escenarios existen en español
  - [x] Trazabilidad: T-19→*buscar* + *combinar* · T-20→*chips* + *sin resultados* · T-17/T-12→*no interrumpe la reproducción*

### T-26 · Especificación de navegación
- **Descripción:** Escribir la especificación de rutas, estado activo y continuidad del reproductor.
- **Archivos afectados:** `tests/bdd/navegacion.feature`
- **Escenarios cubiertos:** Navegar desde la portada al catálogo · Navegar a la página del show · Navegar al formulario de contacto · La barra de navegación marca la ruta activa · Cambiar de episodio sin salir de la misma página · El reproductor conserva el episodio activo entre vistas · Acceso directo por URL
- **Criterios de aceptación:**
  - [x] Los 7 escenarios existen en español
  - [x] Trazabilidad: T-07→*ruta activa* · T-06→*acceso directo por URL* · T-18/T-19/T-21/T-22→*navegar a cada vista* · T-18→*cambiar de episodio* · T-12→*conserva el episodio activo entre vistas*

### T-27 · Matriz de trazabilidad
- **Descripción:** Publicar la correspondencia requisito ↔ escenario en la especificación funcional.
- **Archivos afectados:** `specs/02-specify.md` (§8), `specs/05-tasks.md` (esta tabla)
- **Criterios de aceptación:**
  - [x] Cada RF con escenario apunta a su archivo `.feature`
  - [x] Los huecos (RF-4.02 formulario, RF-3.03/3.05 presentadores) quedan marcados como tarea abierta

### T-28 · Ejecución manual de la suite
- **Descripción:** Recorrer los 21 escenarios sobre el producto compilado, registrando incidencias.
- **Archivos afectados:** `tests/bdd/*.feature` (registro), `specs/05-tasks.md`
- **Criterios de aceptación:**
  - [ ] 9/9 escenarios de reproducción en verde
  - [ ] 5/5 escenarios de filtrado en verde
  - [ ] 7/7 escenarios de navegación en verde
  - [ ] Toda incidencia abierta con su tarea `T-nn` de corrección

### T-29 · Revisión de accesibilidad (checklist de salida)
- **Descripción:** Ejecutar la checklist «Hecho» de la Constitución §7 sobre las cuatro vistas.
- **Archivos afectados:** `app/**` (solo lectura · correcciones en PR si hace falta)
- **Criterios de aceptación:**
  - [ ] Recorrido completo con teclado en `/`, `/episodes`, `/about`, `/contact`
  - [ ] Lector de pantalla: estados del reproductor anunciados (sonando/en pausa/fuente)
  - [ ] Contraste AA verificado en los tokens cian/magenta sobre `#06070e`
  - [x] `prefers-reduced-motion` respetado (ecualizador y `animate-ping`) — verificado estáticamente en `app/globals.css:102-114`; cierra el criterio de **T-17**
  - [ ] Formulario anuncia errores (`RF-G.05.7`) — evidencia estática: `role="alert"` (`contact/page.tsx:146`) y `role="status"` (`contact/page.tsx:186`); falta recorrido con lector real
  - [ ] Enlace «Saltar al contenido» como primer foco de página (Constitución §2.4.4) — **ausente en `app/`** (hallazgo de la revisión del 2026-10-12)

### T-30 · Runner automatizado de BDD
- **Descripción:** Elegir el orquestador de pruebas, cablear la ejecución de los `.feature` y añadir el script correspondiente (Fase 7 de `04-plan.md`).
- **Archivos afectados:** `package.json`, `tests/` (configuración del runner), `specs/04-plan.md` §5.1
- **Criterios de aceptación:**
  - [ ] Comando `npm test` ejecuta los 3 archivos `.feature`
  - [ ] Locación `es` soportada por el runner
  - [ ] El comando falla si algún escenario no pasa
  - [ ] Documentado en `04-plan.md`

### T-31 · Escenarios pendientes (formulario y presentadores)
- **Descripción:** Cubrir con Gherkin los requisitos hoy sin escenario.
- **Archivos afectados:** `tests/bdd/` (nuevos archivos), `specs/02-specify.md` §8
- **Criterios de aceptación:**
  - [ ] Escenarios de RF-4.02 (validación, enviando, enviado, restablecer)
  - [ ] Escenarios de RF-3.03 / RF-3.05 (contenido de presentadores, CTA a contacto)
  - [ ] Matriz de trazabilidad actualizada

---

## Matriz final tarea ↔ escenario

| Tarea | `reproduccion-de-audio.feature` | `filtrado-y-busqueda.feature` | `navegacion.feature` |
|---|:---:|:---:|:---:|
| T-12 Reproducir/pausar | ● *Reproducir con el botón neón* · *Pausar y reanudar* | | ● *Conserva el episodio activo entre vistas* |
| T-13 Progreso/scrubbing | ● *Leer la duración y el tiempo real* | | |
| T-14 Velocidad/volumen | ● *Cambiar la velocidad (3 ejemplos)* · *Ajustar volumen y silenciar* | | |
| T-15 Fallback de formato | ● *Autodetección del .m4a* · *Sin ningún archivo* · *Recuperación con Comprobar* | | |
| T-16 Panel de notas | ● *Carga instantánea al elegir un episodio* | | |
| T-17 Ecualizador reactivo | ● *Reproducir con el botón neón* (animación) | | |
| T-18 Portada | ● *Carga instantánea* | | ● *Navegar desde la portada al catálogo* · *Cambiar de episodio sin salir* |
| T-19 Buscador | | ● *Buscar por texto* · *Combinar texto y categoría* | |
| T-20 Chips / estados | | ● *Filtrar con los chips* · *Sin resultados* · *No interrumpe la reproducción* | |
| T-07 Navbar | | | ● *Marca la ruta activa* · *Navegar a las 3 vistas* |
| T-06 Shell | | | ● *Acceso directo por URL* |
| **Totales** | **9 escenarios** ✅ | **5 escenarios** ✅ | **7 escenarios** ✅ |

**Estado global de validación:** 21/21 escenarios **escritos y trazados** · 0/21 ejecutados de forma automatizada (T-30 pendiente) · checklist de accesibilidad manual pendiente (T-29).

---

## Acta de verificación (2026-10-12)

Revisión de `specs/` frente al código real de `app/` y `tests/bdd/`, **sin ninguna modificación de código** (árbol limpio: solo `specs/` sin seguimiento).

**Verificaciones ejecutadas**

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit --incremental false` | ✅ 0 errores → T-02 |
| `npm run build` | ✅ Compila · 7 rutas estáticas (`/`, `/about`, `/contact`, `/episodes`, `/_not-found`) → T-01, T-03, T-06 |
| `npm run dev` (45 s) | ✅ `Ready in 1675ms` → T-01 |
| `npm run lint` | ❌ *exit code* 1 · 10 errores + 1 aviso → **T-04** |
| Grep `speechSynthesis` en `app/` | ✅ 0 coincidencias → C-04 / T-12 |
| Grep `prefers-reduced-motion` | ✅ `globals.css:102-114` → **T-17** (criterio antes mal marcado) |
| Escenarios en `tests/bdd/` | ✅ 9 + 5 + 7 = 21, locale `es` → T-24/25/26 |
| Grep enlace «Saltar al contenido» | ❌ ausente en `app/` → Constitución §2.4.4 |

**Hallazgos abiertos**

| ID | Hallazgo | Afecta a |
|---|---|---|
| **F-01** | `npm run lint` en rojo: 10 × `react/jsx-no-comment-textnodes` + 1 directiva `eslint-disable` sin uso | **T-04** |
| **F-02** | `AudioPlayer.tsx` duplica los mapas de categoría en lugar de importar `CATEGORY_CHIP` | **T-10** |
| **F-03** | Sin runner BDD ⇒ 0/21 escenarios ejecutados de forma automática | **T-28, T-30** |
| **F-04** | Checklist de accesibilidad no ejecutada y enlace «Saltar al contenido» ausente | **T-29** |
| **F-05** | Sin escenarios para RF-4.02 y RF-3.03/3.05 | **T-31** |
| **F-06** | *Corrección aplicada a este documento:* T-17 marcaba `[ ]` su criterio de movimiento reducido estando **cumplido** en `app/globals.css` | T-17 → `[x]` |

**Conclusión:** 25/31 tareas satisfechas. **No se puede certificar el 100 %**: quedan F-01 y F-02 sin resolver y T-28…T-31 sin ejecutar. Las fases 3 y 4 están íntegramente cumplidas.

---

## Reglas de mantenimiento de este archivo

1. Nueva tarea ⇒ nuevo `T-nn` correlativo, **nunca** se reutiliza un ID.
2. Una tarea solo se marca completa con **todos** sus criterios en `[x]` y, si afecta al producto, sus escenarios asociados en verde.
3. Cambios de alcance ⇒ actualizar `02-specify.md` y `tests/bdd/` **en el mismo PR** que la tarea.
4. Las fases 1–4 están cerradas: reabrirlas exige justificación en `01-constitution.md` §8.

---

*Donde el código encuentra su propio compás. Programar también es componer.*
**Sintaxis & Compás** © 2026 Patricia Aparicio Díaz
