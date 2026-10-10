# language: es
Característica: Reproducción de audio nativo
  Como oyente de Sintaxis y Compás
  Quiero reproducir los episodios con el reproductor HTML5 nativo
  Para escuchar el audio real de estudio sin que intervenga ninguna voz sintetizada

  Escenario: Reproducir con el botón neón
    Dado que estoy en la portada con el episodio 1 cargado en el reproductor
    Y la barra de estado indica "en pausa"
    Cuando pulso el botón de reproducción neón
    Entonces el archivo de audio local comienza a sonar
    Y la barra de estado cambia a "sonando"
    Y el ecualizador miniatura se anima mientras dura la reproducción

  Escenario: Pausar y reanudar desde el mismo botón
    Dado que el episodio 1 se está reproduciendo
    Cuando pulso el botón de reproducción neón
    Entonces el audio queda en pausa
    Y el tiempo actual se conserva
    Cuando vuelvo a pulsar el botón
    Entonces la reproducción continúa desde el punto de pausa

  Escenario: Carga instantánea al elegir un episodio
    Dado que estoy en la portada con los cuatro episodios listados
    Cuando pulso "Reproducir este episodio" del episodio 3
    Entonces el reproductor solicita el archivo "/audio/ep-03.m4a"
    Y la reproducción arranca sin recargar la página
    Y el título y los temas clave se actualizan al episodio 3

  Escenario: Leer la duración y el tiempo real del archivo
    Dado que el episodio 2 se está reproduciendo
    Cuando el navegador entrega los metadatos del audio
    Entonces la duración mostrada es la de "audio.duration"
    Y el tiempo transcurrido procede de "audio.currentTime"
    Y la barra de progreso permite saltar a cualquier posición

  Escenario: Cambiar la velocidad de reproducción
    Dado que el episodio 1 se está reproduciendo
    Cuando selecciono la velocidad "<velocidad>"
    Entonces "audio.playbackRate" pasa a ser <valor>
    Y la reproducción continúa sin cortes

    Ejemplos:
      | velocidad | valor |
      | 1x        | 1     |
      | 1.25x     | 1.25  |
      | 1.5x      | 1.5   |

  Escenario: Ajustar el volumen y silenciar
    Dado que el episodio 1 se está reproduciendo
    Cuando muevo el control de volumen hasta el 50 %
    Entonces el nivel del audio queda fijado a 0,5
    Cuando pulso el botón de silencio
    Entonces el audio queda mudo sin detener la reproducción

  Escenario: Autodetección del formato cuando falta el .m4a
    Dado que el archivo "/audio/ep-03.m4a" no existe en public/audio
    Cuando el reproductor intenta cargar la fuente declarada
    Entonces reintenta automáticamente con "/audio/ep-03.mp3"
    Y el indicador muestra "Audio de Estudio · MP3"
    Y el audio se reproduce con normalidad

  Escenario: Sin ningún archivo local disponible
    Dado que faltan los formatos ".m4a" y ".mp3" del episodio actual
    Cuando intento reproducir el episodio
    Entonces el indicador muestra "archivo no disponible (.m4a / .mp3)"
    Y se ofrece el botón "Comprobar audio" para reintentar
    Y no se invoca la síntesis de voz del navegador

  Escenario: Recuperación con el botón Comprobar audio
    Dado que el reproductor está en estado "archivo no disponible"
    Y el archivo "/audio/ep-03.m4a" vuelve a existir
    Cuando pulso "Comprobar audio"
    Entonces el indicador vuelve a "Audio de Estudio · M4A"
    Y al pulsar reproducción suena el archivo local
