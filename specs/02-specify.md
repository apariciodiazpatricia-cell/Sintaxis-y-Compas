# 📋 Especificación Funcional — **Sintaxis & Compás**

> **Versión:** 1.0 · **Fecha:** 12 de octubre de 2026
> **Documento:** `specs/02-specify.md` · **Compañero de specs:** `specs/01-constitution.md` (principios y no negociables)
>
> **Regla de lectura:** este documento describe **el QUÉ** — lo que la persona usuaria ve, hace, oye y espera. Describe interfaces, requisitos funcionales y experiencia de uso. **No define cómo se construye**: toda decisión de implementación queda fuera de este archivo y se resuelve en los documentos técnicos correspondientes.

---

## 1. Propósito y alcance

**Sintaxis & Compás** es la plataforma de escucha de un podcast en español sobre desarrollo, arquitectura y creatividad. Su promesa al visitante es:

> *«Encuentro el episodio que me interesa, lo pongo a sonar en un clic y lo controlo con total libertad, sin perder el hilo de lo que estoy leyendo.»*

Esta especificación cubre **cuatro casos de uso**:

| # | Caso de uso | Vista | Resultado esperado |
|---|---|---|---|
| CU-1 | Portada con hero y reproductor integrado | Inicio | Entender el show y empezar a escuchar en segundos |
| CU-2 | Catálogo con buscador y filtros | Catálogo | Encontrar un episodio concreto y reproducirlo sin salir |
| CU-3 | Página sobre el show y sus presentadores | Sobre el Show | Conocer la propuesta y a las voces del programa |
| CU-4 | Formulario de contacto y canales de audio | Contacto | Escribir al equipo o seguirlo en sus plataformas |

**Fuera de alcance de este documento:** administración de contenido, pagos, cuentas de usuario, aplicaciones móviles y cualquier función no descrita en §3–§6.

---

## 2. Actores, contenido y vocabulario

### 2.1 Actores

| Actor | Descripción |
|---|---|
| **Oyente / visitante** | Persona que llega al sitio, explora el catálogo y escucha episodios. No necesita registro ni cuenta. Único actor activo de todos los casos de uso. |
| **Equipo del show** | Personas que leen y responden los mensajes del formulario (actor pasivo: no usa la interfaz pública). |

### 2.2 Modelo de contenido: el episodio

Todo episodio se presenta siempre con, al menos, estos datos visibles:

| Dato | Ejemplo | Aparece en |
|---|---|---|
| Número | `EP. 02` | Tarjetas, reproductor |
| Título | «Sinfonía moderna: …» | Tarjetas, reproductor, buscador |
| Descripción | Resumen de una o dos frases | Tarjetas |
| Categoría | Frontend · Creatividad · Arquitectura · Carrera | Filtro, chip en tarjeta y reproductor |
| Duración | `19:40` | Tarjetas, reproductor |
| Fecha de publicación | `1 Octubre, 2026` | Tarjetas, reproductor |
| Invitada/o *(opcional)* | «Elena Ramos (Staff Engineer)» | Tarjetas, reproductor |
| Notas técnicas | 3 puntos del programa | Tarjetas y panel de notas |
| Temas clave | 6 puntos numerados del debate | Panel de notas del reproductor |
| Archivo de audio | Pieza sonora real del episodio | Reproductor |

### 2.3 Categorías temáticas

**Cuatro categorías + «Todos»**: `Frontend` (etiqueta visible: *Frontend*), `Creativity` (*Creatividad*), `Architecture` (*Arquitectura*), `Career` (*Carrera*).

### 2.4 Canales de escucha externos

Spotify · Apple Podcasts · YouTube · iVoox. Siempre se abren en un destino nuevo y no interrumpen la escucha en curso.

---

## 3. Elementos globales (presentes en todas las vistas)

### 3.1 Navegación superior — **RF-G.01**

1. Barra fija en la parte superior, visible al desplazarse, con: logotipo + nombre del show, enlaces a **Inicio**, **Episodios**, **Sobre el Show** y **Contacto**, y una acción destacada **«Escuchar en Spotify ↗»**.
2. El enlace de la vista actual aparece **resaltado como activo** y los demás en reposo.
3. El logotipo devuelve siempre al inicio.
4. En pantallas estrechas, los enlaces siguen siendo alcanzables sin abrir menús oscurecedores de difícil salida (cierre con `Escape` y foco de vuelta al disparador si hubiera menú).
5. Todos los destinos funcionan también **accesidos directamente por su dirección**, con la navegación y el pie presentes.

### 3.2 Pie de página — **RF-G.02**

1. Manifiesto breve del show y lema.
2. Bloque **Navegación** con los mismos cuatro destinos.
3. Bloque **Escúchanos en** con los cuatro canales de audio.
4. Tarjeta decorativa de estado de señal (indicador «Señal · En vivo», «44.1kHz», «Compás · 120 BPM», «ES»).
5. Enlaces a las redes del proyecto (X, GitHub) y línea de copyright con el año en curso.

### 3.3 Continuidad de la escucha — **RF-G.03** *(no negociable)*

1. Empezar a reproducir un episodio en una vista y navegar a otra **no interrumpe ni reinicia el audio**.
2. Filtrar, buscar o plegar listados **tampoco** interrumpe la reproducción.
3. El episodio vigente en el reproductor permanece visible y operable en las vistas que incluyen reproductor.
4. Cualquier acción que obligue a perder la escucha debe justificarse explícitamente (en la práctica actual: ninguna acción de las vistas la pierde).

### 3.4 Idioma y tono — **RF-G.04**

Toda la interfaz, los mensajes, los estados y los textos alternativos están **en español**. El inglés técnico solo se tolera dentro de nombres consagrados («Frontend», «Pull request»…).

### 3.5 Accesibilidad experiencial — **RF-G.05**

Requisitos que la persona usuaria percibe, sin entrar en cómo se consiguen:

1. **Todo es operable con teclado**, incluidos los controles del reproductor, el buscador, los filtros y el formulario.
2. El **foco siempre visible**: se ve con claridad dónde estoy pulsando a continuación.
3. **Contraste suficiente** para leer en pantalla brillante; nada de texto gris sobre negro indistinguible.
4. El **estado nunca se comunica solo con color**: acompañan icono, texto o forma.
5. Se respeta la preferencia del sistema **«reducir movimiento»**: las animaciones de ambientación se detienen o atenúan.
6. Los elementos puramente decorativos (halos, brillos, ondas) **no generan ruido** al leer la pantalla con apoyo: se ignoran.
7. Los cambios relevantes («sonando», «archivo no disponible», «mensaje enviado») se **anuncian**, no solo se pintan.
8. Ninguna acción crítica depende de mantener el puntero encima de algo.

### 3.6 Calidad percibida — **RF-G.06**

1. La primera vista aparece **de inmediato**, sin pantallas vacías largas ni saltos de contenido al cargar.
2. Cambiar de vista o filtrar **no vacía la pantalla** mientras se calcula el resultado.
3. En móvil, escritorio y tablet, ningún contenido se corta ni se solapa.

---

## 4. CU-1 · Portada con hero explicativo y reproductor integrado

**Como visitante**, quiero entender de un vistazo de qué va el show y poder reproducir un episodio sin buscarlo, **para** decidir en segundos si me quedo a escuchar.

### 4.1 Hero — **RF-1.01**

1. Indicador de señal: *«Señal en vivo · Temporada 2»* con punto pulsante.
2. Título principal: *«Donde el código encuentra su propio compás»*.
3. Párrafo explicativo: qué es el podcast, en qué idioma, de qué habla y una invitación directa a pulsar play.
4. **El reproductor está integrado dentro del hero**, no escondido al final: es el primer bloque interactivo de la página.

### 4.2 Reproductor de audio — **RF-1.02**

Bloque identificado como *«Reproductor de audio»*, con:

**a) Identidad del episodio cargado**

- Categoría · número · fecha · duración.
- Título del episodio y, si lo hay, «Con {invitada}».
- Indicador de fuente: **🎧 Audio de Estudio · M4A** (o **MP3**, según el formato realmente cargado).

**b) Reproducción**

| Control | Comportamiento |
|---|---|
| **▶ / ⏸** botón principal alterna | Pausa conservando el punto exacto; reanuda desde ahí. Etiqueta explícita: «Reproducir {título}» / «Pausar {título}». |
| Estado visible | *«♪ sonando»* o *«⏸ en pausa»*, con ecualizador que anima **solo mientras suena** y se detiene en pausa. |
| **Barra de progreso / scrubbing** | Muestra tiempo transcurrido y duración total en `mm:ss`. Se arrastra con el puntero **y** se mueve con teclado (pasos del 5 %, inicio y fin). Saltar a cualquier posición es inmediato. |
| **Velocidad** | Tres opciones conmutables: `1x` · `1.25x` · `1.5x`. Cambiarla **no interrumpe** la reproducción. |
| **Volumen** | Control deslizante 0–100 % y botón de silencio. Silenciar **no detiene** la reproducción; subir el volumen desde silenciado lo desactiva. |

**c) Fuente honesta del sonido**

- RF-1.02.1 Si el archivo declarado no está disponible, se intenta **una sola vez** con la versión alternativa y el indicador refleja el formato real.
- RF-1.02.2 Si faltan ambas versiones: indicador **«⚠ archivo no disponible (.m4a / .mp3)»** + botón **«🔄 Comprobar audio»** que reintenta y restaura el indicador cuando vuelve a existir.
- RF-1.02.3 **Prohibido** sustituir el audio por una voz sintetizada o cualquier sonido que no sea el episodio real. La persona usuaria siempre sabe si está escuchando el show o no.

**d) Panel de notas clave — RF-1.03**

Bajo los controles, tarjeta **«📝 Temas Clave y Notas del Debate»**:

1. Cabecera con número de episodio y contador de puntos (*«EP. 02 · 6 puntos»*).
2. Lista numerada (`01`, `02`, …) con los **temas clave**, en dos columnas en pantallas anchas.
3. Bloque **«Notas técnicas»** con las notas del programa.
4. El panel **cambia al instante** cuando se carga otro episodio, sin recargar la vista.

**e) Reglas de estado del reproductor — RF-1.04**

| Situación | Comportamiento |
|---|---|
| Carga inicial | Episodio 1 precargado, **en pausa**, listo para reproducir con un toque. |
| Se elige otro episodio | Carga inmediata, comienza a sonar, título/panel se actualizan, vista desplazada suavemente hasta el reproductor. |
| Final del episodio | Vuelve a estado «en pausa» conservando el final. |
| Vuelta a la vista | El episodio elegido sigue vigente. |

### 4.3 Lista «Cuatro pistas para tu oído» — **RF-1.04b**

1. Cuatro tarjetas de episodio con: chip de categoría, número, fecha, título, descripción, invitada (si la hay), notas técnicas, duración y botón **«▶ Reproducir este episodio»**.
2. La tarjeta del episodio **activo** se marca con la insignia **«Reproduciendo ahora»** y un realce visual diferenciado.
3. Pulsar «Reproducir este episodio» cambia el reproductor **en vivo**, sin salir de la vista.
4. Alternancia de acento cian/magenta entre tarjetas para dar ritmo visual (ambientación, sin información añadida).

### 4.4 Bloque «Escúchanos donde prefieras» — **RF-1.05**

1. Cuatro tarjetas enlazadas: Spotify, Apple Podcasts, YouTube, iVoox, con icono, nombre y llamada *«Escuchar ahora ↗»*.
2. Cada enlace se abre en destino nuevo, con confirmación accesible de «abre fuera del sitio».

---

## 5. CU-2 · Catálogo de episodios con buscador y filtros

**Como oyente**, quiero buscar un episodio por una palabra o acotarlo por tema, **para** encontrar rápido lo que me interesa y ponerlo a sonar sin perder lo que ya estaba escuchando.

### 5.1 Cabecera del catálogo — **RF-2.01**

1. Etiqueta *«// archivo de audio»*, título **«Catálogo de Episodios»** y párrafo que explica que se puede buscar por título o notas y lanzar cualquier pista sin salir de la vista.
2. **Reproductor en vivo** con los mismos controles, estados y panel de notas que el CU-1 (RF-1.02 → RF-1.04).

### 5.2 Buscador en tiempo real — **RF-2.02**

1. Campo de búsqueda con icono de lupa y texto de ejemplo *«Buscar por título o notas del show…»*.
2. **Resultados actualizados en cada pulsación**, sin botón de enviar.
3. La búsqueda es **ignorante de mayúsculas y acentos**: «arquitectura» encuentra «Arquitectura»; «solid» encuentra «SOLID».
4. **Campos consultados:** número, título, descripción y notas técnicas del episodio.
5. La búsqueda **se combina con el filtro de categoría** activo (ambas condiciones a la vez).
6. Contador visible: *«N de 4 episodios»* y, si hay texto, *«· resultados para “{texto}”»*.

### 5.3 Filtrado por categorías — **RF-2.03**

1. Grupo de cinco chips: **Todos · Frontend · Creatividad · Arquitectura · Carrera**.
2. Exactamente **uno activo a la vez**, con estado visible de pulsado; «Todos» es el estado inicial.
3. Cambiar de filtro actualiza la lista **al instante** y no afecta al audio.
4. El filtro permanece mientras el usuario no lo cambie; navegar y volver conserva la lista filtrada.

### 5.4 Estados del listado — **RF-2.04**

| Estado | Contenido |
|---|---|
| Con resultados | Rejilla de tarjetas idénticas a las de la portada, más el chip **«En el reproductor»** en la tarjeta activa y el botón **«▶ Escuchar ahora»**. |
| Sin resultados | Tarjeta **«Señal perdida»**: mensaje que cita el texto buscado, recuerda el filtro activo y ofrece **«Restablecer búsqueda»** (borra texto y vuelve a «Todos»). |

1. La tarjeta del episodio **en el reproductor** conserva su insignia aunque quede fuera del filtro mientras siga sonando (la escucha no se esconde).
2. «Escuchar ahora» carga y reproduce el episodio **sin salir de la vista** y desplaza la mirada al reproductor.

---

## 6. CU-3 · Página sobre el show y sus presentadores

**Como visitante**, quiero conocer la propuesta y a quienes la presentan, **para** decidir si el programa es para mí y saber a quién escribir.

### 6.1 Cabecera — **RF-3.01**

Etiqueta *«// sobre el show»*, título **«Sobre Sintaxis & Compás»** y párrafo con la promesa editorial: hecho por desarrolladores que también viven rodeados de instrumentos, en español y sin filtros corporativos.

### 6.2 Manifiesto — **RF-3.02**

1. Título **«Por qué programar también es componer música»**.
2. Tres párrafos de argumentación (silencio inicial → ritmo del equipo → estructura de la composición).
3. Cita destacada en columna lateral: *«Un buen sistema, como una buena canción, se sostiene aunque cambies a quien la toca.»* con atribución al Ep. 04 y chips de categoría.

### 6.3 Presentadores — **RF-3.03**

Sección **«Dos voces, una cabina»** con dos fichas:

| | **Carlos Márquez** | **Patricia Aparicio** |
|---|---|---|
| Rol | Lead Frontend & Productor de Audio | Cloud Architect & Compositora Sonora |
| Iniciales | CM (acento cian) | PA (acento magenta) |
| Biografía | Más de una década en interfaces rápidas y humanas; guion, edición y mezcla. | Sistemas distribuidos de día, composición electroacústica de noche. |
| Etiquetas | Tres etiquetas de especialidad: interfaz, accesibilidad y audio | Arquitectura · Observabilidad · Síntesis sonora |

1. Cada ficha muestra iniciales, nombre, rol, biografía y etiquetas de especialidad.
2. Las fichas son informativas: **no son enlaces** ni ejecutan acciones.

### 6.4 «Nuestro estudio & herramientas» — **RF-3.04**

1. Título **«Con qué grabamos y con qué codificamos»** y tres columnas: **Código & Entorno**, **Sintetizadores Analógicos**, **Estudio & Captura**.
2. Cada ítem tiene nombre propio y una línea de detalle (ej. *«Shure SM7B — Micrófono de referencia, voz cercana»*).
3. La columna de sintetizadores usa acento magenta y las otras cian (ritmo visual, sin significado adicional).

### 6.5 Llamada a la acción — **RF-3.05**

1. Bloque **«¿Tienes un tema que merece episodio?»** con texto de invitación a proponer temas, preguntas o colaboraciones.
2. Botón **«Ir a Contacto ↗»** que lleva al CU-4.

---

## 7. CU-4 · Formulario de contacto y enlaces a canales de audio

**Como oyente o colaborador**, quiero escribir al equipo o encontrar sus canales, **para** proponer un tema, preguntar o unirme a la comunidad con la certeza de que mi mensaje llega.

### 7.1 Cabecera — **RF-4.01**

Etiqueta *«// canal abierto»*, título **«Contacto & Comunidad»** y párrafo con la promesa de respuesta: *«respondemos en menos de 48 horas laborables»*.

### 7.2 Formulario — **RF-4.02**

**Campos**

| Campo | Tipo | Regla |
|---|---|---|
| **Nombre** | Texto libre | Obligatorio, mínimo 2 caracteres |
| **Correo** | Correo electrónico | Obligatorio, formato válido (ej. `hola@dominio.com`) |
| **Tipo de mensaje** | 3 opciones conmutables: **Propuesta de tema**, **Pregunta de oyente**, **Colaboración** | Obligatorio, exactamente una |
| **Mensaje** | Texto largo multilínea | Obligatorio, mínimo 10 caracteres |

**Comportamiento**

1. Cada campo lleva etiqueta visible y texto de ejemplo propio; el placeholder **nunca** sustituye a la etiqueta.
2. **Validación al enviar** con mensajes en español y literales: *«Escribe tu nombre (mínimo 2 caracteres)»*, *«Introduce un correo válido, por ejemplo hola@dominio.com»*, *«Selecciona el tipo de mensaje»*, *«Cuéntanos algo más: al menos 10 caracteres»*.
3. El error aparece **junto al campo que lo provoca**, con marca visual diferenciada, y **desaparece en cuanto el usuario vuelve a escribir** o elige una opción.
4. Un campo inválido **no envía** nada y pone el foco del usuario en el problema.
5. Pie del formulario: *«Respuesta en menos de 48 h»* + botón **«Enviar mensaje ↗»**.

**Estados**

| Estado | Visible |
|---|---|
| **Reposo** | Formulario íntegro y editable. |
| **Enviando** | Botón deshabilitado con texto *«Enviando…»*; los campos no se pierden. |
| **Enviado** | Tarjeta de confirmación: icono de éxito, **«Mensaje enviado»**, agradecimiento con el nombre y el tipo de mensaje elegido, dirección de respuesta `hola@sintaxisycompas.dev`, y acciones **«Enviar otro mensaje»** (limpia y vuelve a reposo) y **«Escribir por correo»**. |

> **Nota:** el envío está simulado en la versión actual. El requisito funcional de producto es que la confirmación **nunca se muestre si el mensaje no ha podido entregarse**.

### 7.3 Comunidad y canales — **RF-4.03**

1. Título *«// comunidad»* con la idea *«El show no termina cuando se corta el audio»*.
2. Tres tarjetas enlazadas con icono, nombre, descripción y detalle:
   - **Discord** — comunidad de desarrolladores y músicos → *«Unirse al servidor ↗»*
   - **GitHub** — repositorio del proyecto, issues y notas → *«Ver repositorio ↗»*
   - **Correo directo** — `hola@sintaxisycompas.dev` → *«Escribir un correo ↗»*
3. Los enlaces externos se abren en destino nuevo; el correo abre el cliente de mensajería del dispositivo.
4. Tarjeta **«Horario de la cabina»**: días de grabación y periodicidad de publicación, con recordatorio de que el correo es la vía más rápida fuera de horario.

### 7.4 Canales de audio en la interfaz — **RF-4.04**

Además de los enlaces del CU-1 (RF-1.05), el pie de página (RF-G.02) y la barra superior (RF-G.01) ofrecen salida hacia Spotify, Apple Podcasts, YouTube e iVoox, de modo que **desde cualquier vista hay al menos un camino visible hacia los canales de escucha**.

---

## 8. Matriz de trazabilidad a criterios de aceptación

Los escenarios de prueba viven en `tests/bdd/*.feature`. Correspondencia:

| Este documento | Escenario(s) asociado(s) |
|---|---|
| RF-1.02 (reproducción, velocidad, volumen, formatos) | `reproduccion-de-audio.feature` — todos los escenarios |
| RF-1.03 (panel de notas) | `reproduccion-de-audio.feature` → *Instant load when choosing an episode* |
| RF-1.04 / RF-G.03 (cambio y continuidad) | `navegacion.feature` → *Change episode without leaving the page*, *The player keeps the active episode between views* |
| RF-G.01 (navegación, vista activa) | `navegacion.feature` → *Navigate…*, *The navigation bar highlights the active route*, *Direct access by URL* |
| RF-2.02 / RF-2.03 (buscador y filtros) | `filtrado-y-busqueda.feature` → todos los escenarios |
| RF-4.02 (formulario) | Pendiente de escenario Gherkin *(abrir tarea)* |
| RF-3.03 / RF-3.05 (presentadores y CTA) | Pendiente de escenario Gherkin *(abrir tarea)* |

---

## 9. Fuera de esta especificación

Para no inducir a error, este documento **no** cubre: cómo se sirve el audio, qué herramientas o lenguajes intervienen, estructura de carpetas, estrategia de publicación ni decisiones de arquitectura técnica. Todo eso pertenece al ámbito de implementación y se resuelve en `specs/01-constitution.md` (principios) y en los documentos de diseño correspondientes.

---

*Donde el código encuentra su propio compás. Programar también es componer.*
**Sintaxis & Compás** © 2026 Patricia Aparicio Díaz
