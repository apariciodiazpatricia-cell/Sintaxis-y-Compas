# ❓ Clarificaciones previas al desarrollo — **Sintaxis & Compás**

> **Versión:** 1.0 · **Fecha:** 12 de octubre de 2026
> **Documento:** `specs/03-clarify.md` · **Relacionados:** `specs/01-constitution.md` (principios) · `specs/02-specify.md` (especificación funcional)
>
> **Para qué sirve este archivo:** registra las **preguntas clave que se resolvieron antes de escribir la primera línea de código**, con su respuesta definitiva, su motivación y sus consecuencias verificables. Es un **diario de decisiones cerradas**: cualquier persona que llegue al proyecto puede saber *por qué* la cosa funciona así sin tener que preguntarlo de nuevo.

---

## Resumen de decisiones

| ID | Pregunta | Decisión | Estado |
|---|---|---|---|
| **C-01** | ¿Qué pasa si el archivo `.m4a` no está disponible? | Fallback automático a `.mp3`; si faltan ambos, aviso accesible + botón de reintento | ✅ Resuelta |
| **C-02** | ¿Cómo se calculan los tiempos del reproductor? | Tiempo transcurrido y duración total en formato `mm:ss`, tomados del propio audio | ✅ Resuelta |
| **C-03** | ¿El filtrado del catálogo es instantáneo o requiere enviar un formulario? | Reactivo e instantáneo, sin envíos ni refresco | ✅ Resuelta |
| **C-04** | ¿El reproductor debe sintetizar voz o usar audios reales? | Audios de estudio pregrabados; **jamás voz sintetizada** | ✅ Resuelta |

---

## C-01 · Archivo de audio `.m4a` no disponible

### Pregunta

¿Qué ocurre cuando la persona oyente pulsa «Reproducir» y el archivo de audio en su formato principal (`.m4a`) **no está disponible en el servidor** (falta, mal subido, renombrado o caído)?

### Decisión

**Degradación en dos niveles, siempre visible y accesible:**

1. **Fallback automático de formato.** Si el `.m4a` no resuelve, se reintenta **una sola vez** con la versión `.mp3` del mismo episodio. Si la reproducción arranca, nadie tiene que hacer nada: el indicador de fuente refleja el formato realmente en uso (**🎧 Audio de Estudio · MP3**).
2. **Si faltan ambos formatos:** no hay reproducción, pero sí **información honesta**:
   - Indicador **«⚠ archivo no disponible (.m4a / .mp3)»**.
   - Botón **«🔄 Comprobar audio»** que vuelve a intentar la carga y restaura el indicador cuando el archivo ya existe.
   - El estado y el botón son **plenamente accesibles**: anunciables, operables con teclado y comprensibles sin depender solo del color.

### Por qué

- Es la respuesta que exige el principio de **honestidad del sonido** (Constitución §3): el oyente debe saber si está escuchando el show o no.
- Un fallo silencioso (botón que no hace nada) y un fallo ruidoso (pantalla de error técnica) rompen la experiencia; la degradación **explicada** no.
- El reintento único evita bucles infinitos de peticiones que congestione la carga de la página.

### Consecuencias verificables

- [ ] El formato declarado se intenta primero y el alternativo **solo una vez**.
- [ ] El indicador de fuente muestra siempre el formato real, nunca el supuesto.
- [ ] Con ambos formatos ausentes: mensaje literal + botón «Comprobar audio», ambos operables con teclado.
- [ ] **Nunca** se recurre a voz sintetizada ni a sonido sustituto (ver C-04).
- [ ] Escenario asociado: `reproduccion-de-audio.feature` → *Format auto-detection when the .m4a is missing*, *No local file available*, *Recovery with the Check audio button*.

---

## C-02 · Cálculo de los tiempos del reproductor

### Pregunta

¿De dónde salen el tiempo transcurrido, la duración total y la posición de la barra de progreso? ¿Se estiman, se precargan de los metadatos del catálogo o se toman del audio?

### Decisión

**Formato `mm:ss` para ambos valores, y el audio es la única fuente de verdad:**

| Dato | Fuente | Formato |
|---|---|---|
| **Tiempo transcurrido** | Posición real del audio que suena en cada instante | `mm:ss` (`07:23`) |
| **Duración total** | Duración real del archivo, leída cuando el navegador entrega sus metadatos | `mm:ss` (`19:40`) |
| **Barra de progreso** | Proporción entre ambos dos, de 0 % a 100 % | Desplazamiento continuo |

1. Mientras el archivo carga, se muestra la duración declarada del catálogo como **valor provisional**; en cuanto llega la duración real, sustituye al anterior sin saltos bruscos.
2. Un tiempo inválido o aún desconocido se pinta como `00:00`, nunca como `NaN`, `undefined` ni cadena vacía.
3. Arrastrar la barra (o moverla con teclado) **salta a esa posición exacta** y ambos relojes se actualizan de inmediato.
4. Cambiar la velocidad de reproducción **no altera** los tiempos mostrados: solo cambia a qué velocidad se llega a ellos.

### Por qué

- La duración «de catálogo» es una **etiqueta**; la duración del archivo es un **hecho**. Mostrar una mientras suena la otra desincroniza la barra y genera desconfianza en el control.
- `mm:ss` es el formato que la gente asocia al audio: sin cálculos mentales, legible a 10 px en móvil.
- Regla de la Constitución §3.1: *«nada de relojes paralelos ni estimaciones que se desincronicen»*.

### Consecuencias verificables

- [ ] Tiempos mostrados = valores reales del audio, con formato `mm:ss` siempre (nunca `NaN` ni vacío).
- [ ] La barra salta a cualquier posición y los relojes la reflejan al instante.
- [ ] La duración provisional del catálogo se reemplaza por la real sin parpadeos ni saltos.
- [ ] Escenario asociado: `reproduccion-de-audio.feature` → *Read real duration and current time*.

---

## C-03 · Filtrado del catálogo: ¿instantáneo o con envío?

### Pregunta

¿El buscador y los chips de categoría del catálogo requieren pulsar un botón «Buscar» / enviar un formulario, o se aplican solos mientras la persona escribe o pulsa?

### Decisión

**Reactivo e instantáneo, sin envíos ni refresco de la vista.**

1. **Buscador:** los resultados se actualizan **en cada pulsación**, sin botón de envío y sin esperas perceptibles.
2. **Chips de categoría:** se aplican **al instante** al pulsarlos; exactamente uno activo a la vez («Todos» es el estado inicial).
3. **Combinación:** texto y categoría se aplican **a la vez** (intersección): ambos criterios deben cumplirse.
4. **Sin recargas:** ni el texto ni el filtro provocan pérdida del contenido en pantalla, parpadeos ni pérdida del audio en reproducción.
5. **Estado vacío:** si no hay coincidencias, se muestra «Señal perdida» con el texto buscado y el botón **«Restablecer búsqueda»** (borra el texto y vuelve a «Todos»).
6. El contador **«N de 4 episodios»** se actualiza junto con la lista y refleja el texto consultado.

### Por qué

- Es una lista **pequeña y estable** (4 episodios): cualquier espera artificial sería más lenta que el propio filtrado y rompería la sensación de «consola» del catálogo.
- El oyente suele llegar con una palabra en la cabeza («jazz», «arquitectura»): la respuesta inmediata es lo que hace útil al buscador.
- Enviar un formulario asociaría **acción de envío** a una operación que no envía nada a ningún sitio: semántica engañosa y peor accesibilidad ( foco que salta, botón que no hace falta).

### Consecuencias verificables

- [ ] Cada tecla filtra; ningún botón «Buscar» ni envío de formulario.
- [ ] Cada chip filtra al pulsarlo; estado de pulsado visible en el activo.
- [ ] Texto y categoría se combinan; «Todos» + vacío muestra los 4 episodios.
- [ ] Filtrar **nunca interrumpe** el audio en curso.
- [ ] Estado vacío con restablecimiento en un solo clic.
- [ ] Escenarios asociados: `filtrado-y-busqueda.feature` → todos.

---

## C-04 · ¿Voz sintetizada o audios reales de estudio?

### Pregunta

¿Debe el reproductor **sintetizar voz** (o generar audio de reserva) cuando falte un episodio, o reproducir **audios de estudio pregrabados**?

### Decisión

**Audios de estudio pregrabados. Cero síntesis. Sin excepciones.**

1. Todo episodio suena desde su **archivo real de estudio** (grabado, editado y masterizado para el show).
2. **Prohibido** invocar la síntesis de voz del dispositivo o cualquier sonido generado como sustituto del episodio.
3. Si el audio no puede reproducirse, se aplica C-01: se intenta el formato alternativo y, si tampoco existe, se **dice con claridad** («archivo no disponible») en lugar de rellenar el hueco con algo que no es el programa.
4. El botón «Comprobar audio» es el único camino de recuperación: reintenta el archivo real, nunca inventa contenido.

### Por qué

- **Es la promesa editorial del show**: voces reales de Carlos y Patricia (y sus invitadas), no una voz generada. Un sustituto sintético sería mentir al oyente sobre lo que está escuchando.
- Queda escrito como **no negociable** en la Constitución (§3.1): *«Cero librerías de audio, cero voces sintetizadas.»* y se refuerza en §7 (checklist de «Hecho»).
- Un error explícito es recuperable (el oyente reintenta o avisa); un audio falso corrompe la confianza en todo el catálogo.

### Consecuencias verificables

- [ ] Reproducir siempre entrega el archivo de estudio del episodio elegido.
- [ ] En ningún estado se invoca la síntesis de voz ni se ofrece «audio de reserva» generado.
- [ ] Falta de archivo ⇒ aviso accesible + reintento (C-01), jamás contenido sintético.
- [ ] Escenario asociado: `reproduccion-de-audio.feature` → *No local file available* («the browser speech synthesis is never invoked»).

---

## Tabla de cruces (decisión ↔ resto de la serie)

| | C-01 Fallback | C-02 Tiempos | C-03 Filtrado | C-04 Audio real |
|---|:---:|:---:|:---:|:---:|
| **Constitución §2 (accesibilidad)** | Aviso + botón accesible | — | Sin botón «enviar» | — |
| **Constitución §3 (audio nativo)** | Reintento único | `duration`/`currentTime` | — | No negociable |
| **Constitución §7 (checklist «Hecho»)** | ✅ | ✅ | ✅ | ✅ |
| **`specs/02-specify.md`** | RF-1.02.1–1.02.3 | RF-1.02 b) | RF-2.02 / RF-2.03 / RF-2.04 | RF-1.02.3 |
| **`tests/bdd/*.feature`** | 3 escenarios | 1 escenario | 5 escenarios | 1 escenario |

---

## Otras dudas menores resueltas en la misma sesión

| Duda | Respuesta |
|---|---|
| ¿Se puede escuchar sin registro? | Sí. **Cero cuentas, cero login**: todo el catálogo es público. |
| ¿Se pierde el audio al cambiar de vista? | No. La escucha **continúa** entre vistas (Constitución P5 / RF-G.03). |
| ¿El buscador distingue acentos? | No. Ignora mayúsculas y acentos: «arquitectura» encuentra «Arquitectura». |
| ¿Qué pasa con la velocidad al cambiar de episodio? | La preferencia de velocidad y volumen **se conserva**; el tiempo vuelve a `00:00`. |
| ¿Y si el oyente prefiere menos movimiento? | Se respeta la preferencia del sistema de «reducir movimiento»: las animaciones se atenúan o detienen. |
| ¿Hay idioma alternativo? | No. Interfaz **en español** en su totalidad (RF-G.04). |

---

## Cómo actualizar este documento

1. Nuevas preguntas **al final**, con ID correlativo (`C-05`, `C-06`…), antes de empezar a desarrollar la función que las motiva.
2. Toda decisión nueva debe enlazar con su cláusula de `01-constitution.md`, su requisito de `02-specify.md` y su escenario de `tests/bdd/`.
3. Una decisión **ya tomada no se reabre por comodidad**: solo por PR que actualice la Constitución (§8 de `01-constitution.md`).

---

*Donde el código encuentra su propio compás. Programar también es componer.*
**Sintaxis & Compás** © 2026 Patricia Aparicio Díaz
