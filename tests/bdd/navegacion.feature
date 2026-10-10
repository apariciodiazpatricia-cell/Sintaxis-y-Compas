# language: es
Característica: Navegación entre rutas y continuidad del reproductor
  Como visitante del sitio
  Quiero moverme entre las cuatro rutas del show
  Para explorar el catálogo sin perder el control del audio

  Escenario: Navegar desde la portada al catálogo
    Dado que estoy en la portada "/"
    Cuando pulso "Episodios" en la barra de navegación
    Entonces se muestra la ruta "/episodes"
    Y el buscador y los filtros de categoría están visibles

  Escenario: Navegar a la página del show
    Dado que estoy en cualquier ruta
    Cuando pulso "Sobre el Show" en la barra de navegación
    Entonces se muestra la ruta "/about"
    Y aparecen las fichas de Carlos Márquez y Patricia Aparicio como anfitriones

  Escenario: Navegar al formulario de contacto
    Dado que estoy en la portada
    Cuando pulso "Contacto" en la barra de navegación
    Entonces se muestra la ruta "/contact"
    Y el formulario admite nombre, correo y mensaje

  Escenario: La barra de navegación marca la ruta activa
    Dado que estoy en la ruta "/episodes"
    Entonces el enlace "Episodios" aparece resaltado como activo
    Y los demás enlaces quedan en reposo

  Escenario: Cambiar de episodio sin salir de la misma página
    Dado que estoy en "/episodes" con el episodio 1 reproduciéndose
    Cuando pulso "Escuchar ahora" del episodio 4
    Entonces el reproductor carga "/audio/ep-04.m4a"
    Y la reproducción arranca de inmediato
    Y la tarjeta "Temas Clave y Notas del Debate" muestra los puntos del episodio 4

  Escenario: El reproductor conserva el episodio activo entre vistas
    Dado que he iniciado la reproducción del episodio 2 desde la portada
    Cuando regreso a la portada desde "/about"
    Entonces el reproductor sigue asociado al episodio 2
    Y sus controles siguen operativos

  Escenario: Acceso directo por URL
    Dado que abro directamente la dirección "/contact"
    Entonces la página se renderiza sin errores
    Y la barra de navegación y el pie están presentes
