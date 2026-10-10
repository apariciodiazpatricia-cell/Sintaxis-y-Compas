export interface Episode {
    id: number;
    slug: string;
    number: string;
    title: string;
    description: string;
    /** Duración real del archivo de audio (mm:ss) */
    duration: string;
    date: string;
    category: "Frontend" | "Creativity" | "Architecture" | "Career";
    audioUrl: string;
    guest?: string;
    /** Notas técnicas del episodio */
    notes: string[];
    /** Puntos clave y notas del show (tarjeta "Temas Clave") */
    keyTopics: string[];
}

export const EPISODES: Episode[] = [
    {
        id: 1,
        slug: "01-ritmo-del-codigo-limpio",
        number: "EP. 01",
        title: "El ritmo del código limpio: Refactorizar como quien afina una guitarra",
        description: "Analizamos cómo la legibilidad y la cadencia de nuestras funciones impactan en el rendimiento del equipo y en la claridad mental del desarrollador.",
        duration: "11:58",
        date: "8 Octubre, 2026",
        category: "Creativity",
        audioUrl: "/audio/ep-01.m4a",
        notes: [
            "Principios SOLID con analogías musicales",
            "Nombrado de variables con cadencia y coherencia",
            "Cuándo parar de refactorizar y pasar a producción"
        ],
        keyTopics: [
            "SRP: una clase, una sola razón para cambiar — como la mochila del frontend",
            "LSP en la práctica: el subtipo que rompe al sustituir (el clásico Cuadrado/Círculo)",
            "DIP e ISP: contratos claros entre módulos y el antipatrón de la 'API Gorda'",
            "Nombrar es pensar: si no puedes nombrarlo con claridad, aún no lo entiendes",
            "Abierto/cerrado: añadir una voz nueva a la polifonía sin reescribir las demás",
            "Cuándo dejar de refactorizar: afinar hasta que suene afinado y tocar producción"
        ]
    },
    {
        id: 2,
        slug: "02-nextjs-turbopack-sinfonia",
        number: "EP. 02",
        title: "Sinfonía moderna: Next.js, Server Components y el fin de los bundles pesados",
        description: "Conversamos sobre la evolución del renderizado en React y cómo modularizar aplicaciones para que carguen al compás del usuario.",
        duration: "19:40",
        date: "1 Octubre, 2026",
        category: "Frontend",
        audioUrl: "/audio/ep-02.m4a",
        notes: [
            "Server vs Client Components en Next.js",
            "Velocidad de compilación con Turbopack",
            "Streaming de UI y Suspense sin bloqueos"
        ],
        keyTopics: [
            "16,7 ms por fotograma: el presupuesto real de los 60 fps",
            "Cuantización y metrónomo: compás 4/4 a 120 BPM = 500 ms por pulso",
            "Virtual DOM y reconciliación: el árbol mínimo de cambios antes de tocar el DOM",
            "useLayoutEffect vs useEffect: cuándo corregir la intención y cuándo soltar",
            "Server Components: el trabajo pesado se queda en el servidor, viaja solo el resultado",
            "Streaming con Suspense: cada bloque entra en su momento sin bloquear el compás"
        ]
    },
    {
        id: 3,
        slug: "03-sindrome-impostor-solo-jazz",
        number: "EP. 03",
        title: "El solo de jazz y el síndrome del impostor en tecnología",
        description: "La improvisación en directo y la resolución de bugs bajo presión. Cómo gestionar la incertidumbre cuando no hay partitura previa.",
        duration: "19:38",
        date: "24 Septiembre, 2026",
        category: "Career",
        audioUrl: "/audio/ep-03.m4a",
        guest: "Elena Ramos (Staff Engineer)",
        notes: [
            "Aceptar el error como parte de la improvisación",
            "Estrategias de depuración creativa en equipo",
            "Construir seguridad psicológica en ingeniería"
        ],
        keyTopics: [
            "Caracterizar antes de refactorizar: transcribir el tema tal como suena hoy",
            "Ciclo rojo-verde-refactoriza sin cambiar nunca dos cosas a la vez",
            "Deuda técnica como ropa sucia: siempre hay más de la que recuerdas",
            "Volver al motivo: anclarse en una prueba que ya pasa para dar el siguiente paso",
            "El síndrome del impostor: el error es una nota que llega antes de tiempo",
            "Seguridad psicológica en el code review: una jam session donde todos se escuchan"
        ]
    },
    {
        id: 4,
        slug: "04-microservicios-polirritmia",
        number: "EP. 04",
        title: "Polirritmia en la nube: Arquitecturas distribuidas que no desafinan",
        description: "Event-driven architecture, colas de mensajes y cómo orquestar microservicios para evitar la cacofonía en producción.",
        duration: "22:28",
        date: "17 Septiembre, 2026",
        category: "Architecture",
        audioUrl: "/audio/ep-04.m4a",
        notes: [
            "Patrones de mensajería asíncrona",
            "Idempotencia y resiliencia ante caídas",
            "Observabilidad y monitoreo armónico"
        ],
        keyTopics: [
            "Del monolito a los eventos: perder la llamada síncrona y con ella la certeza",
            "Colas y buses de eventos: consumidores idempotentes (dos veces, un solo efecto)",
            "Sagas con eventos compensatorios y el patrón outbox contra la transacción perdida",
            "Observabilidad: trazas distribuidas, métricas y logs correlacionados",
            "El contrapunto a cuatro voces de Bach como modelo de contratos de API",
            "Backpressure y despliegues: las voces entran escalonadas, nunca todas el viernes"
        ]
    }
];
