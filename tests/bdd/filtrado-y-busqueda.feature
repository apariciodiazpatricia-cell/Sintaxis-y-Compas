# language: es
Característica: Filtrado y búsqueda en el catálogo de episodios
  Como oyente
  Quiero filtrar los episodios por texto o por categoría
  Para encontrar rápido el tema que me interesa

  Escenario: Buscar por texto en el catálogo
    Dado que estoy en la ruta "/episodes"
    Cuando escribo "arquitectura" en el buscador
    Entonces solo se muestran los episodios cuyo título, descripción o notas contienen "arquitectura"
    Y el reproductor mantiene el episodio que estaba sonando

  Escenario: Filtrar por categoría con los chips
    Dado que estoy en la ruta "/episodes" con todos los episodios visibles
    Cuando pulso el chip "Frontend"
    Entonces solo queda visible el episodio de categoría Frontend
    Cuando pulso el chip "Todos"
    Entonces vuelven a mostrarse los cuatro episodios

  Escenario: Combinar texto y categoría
    Dado que estoy en la ruta "/episodes"
    Cuando escribo "jazz" en el buscador
    Y selecciono el chip "Carrera"
    Entonces solo se muestra el episodio que cumple ambas condiciones

  Escenario: Sin resultados para la búsqueda
    Dado que estoy en la ruta "/episodes"
    Cuando escribo "zzzz-no-existe" en el buscador
    Entonces la lista queda vacía
    Y se muestra un mensaje indicando que no hay episodios coincidentes

  Escenario: El filtrado no interrumpe la reproducción
    Dado que el episodio 3 se está reproduciendo
    Cuando filtro por la categoría "Arquitectura"
    Entonces el audio sigue sonando sin reiniciarse
    Y al limpiar el filtro el episodio 3 sigue asociado al reproductor
