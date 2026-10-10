import Link from "next/link";
import CategoryChip from "@/app/components/CategoryChip";

const anfitriones = [
    {
        iniciales: "CM",
        nombre: "Carlos Márquez",
        rol: "Lead Frontend & Productor de Audio",
        color: "from-cyan-400 to-cyan-300",
        borde: "neon-cyan",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.45)]",
        rolClase: "text-cyan-300",
        bio: "Lleva más de una década dando forma a interfaces que se sienten rápidas, claras y humanas. En el estudio es quien convierte una conversación suelta en un episodio con ritmo: guion, edición, mezcla y esa intro sintética que ahora reconoces al segundo segundo. Cree que un buen componente, como un buen compás, se nota cuando nadie lo señala.",
        etiquetas: ["React & Next.js", "Accesibilidad", "Edición de audio"],
    },
    {
        iniciales: "PA",
        nombre: "Patricia Aparicio",
        rol: "Cloud Architect & Compositora Sonora",
        color: "from-fuchsia-400 to-fuchsia-300",
        borde: "neon-magenta",
        glow: "shadow-[0_0_20px_rgba(217,70,239,0.45)]",
        rolClase: "text-fuchsia-300",
        bio: "Diseña sistemas distribuidos de día y compone piezas electroacústicas de noche. Su tesis particular: una arquitectura limpia se parece mucho a una partitura bien escrita —cada módulo tiene su voz, su entrada y su silencio—. Aporta al show la mirada de quien ha visto caer producción en sábado y aun así sigue escribiendo canciones.",
        etiquetas: ["Arquitectura", "Observabilidad", "Síntesis sonora"],
    },
];

const stack = [
    {
        titulo: "Código & Entorno",
        senal: "cyan",
        items: [
            { nombre: "VS Code + Neovim", detalle: "Terminal con fuente mono y tema oscuro" },
            { nombre: "Next.js & TypeScript", detalle: "App Router, Server Components y Turbopack" },
            { nombre: "Git & GitHub", detalle: "Ramas limpias, commits con intención" },
            { nombre: "Figma", detalle: "Bocetos previos a la primera línea" },
        ],
    },
    {
        titulo: "Sintetizadores Analógicos",
        senal: "magenta",
        items: [
            { nombre: "Sequential Prophet Rev2", detalle: "Pad cálido de la cabina" },
            { nombre: "Moog Sub 37", detalle: "Bajos con carácter" },
            { nombre: "Roland Juno-106", detalle: "Cuerdas etéreas del intro" },
            { nombre: "Pedalera Strymon", detalle: "Reverbs y delays para las pausas" },
        ],
    },
    {
        titulo: "Estudio & Captura",
        senal: "cyan",
        items: [
            { nombre: "Shure SM7B", detalle: "Micrófono de referencia, voz cercana" },
            { nombre: "Focusrite + preamp", detalle: "Cadena de ganancia limpia" },
            { nombre: "Consola RØDECaster", detalle: "Mezcla en directo y efectos" },
            { nombre: "Ableton Live", detalle: "Edición, ecualización y master final" },
        ],
    },
] as const;

const senalClase: Record<
    "cyan" | "magenta",
    { punto: string; texto: string; borde: string }
> = {
    cyan: { punto: "bg-cyan-400", texto: "text-cyan-300", borde: "border-cyan-500/25" },
    magenta: {
        punto: "bg-fuchsia-400",
        texto: "text-fuchsia-300",
        borde: "border-fuchsia-500/25",
    },
} as const;

export default function SobrePage() {
    return (
        <div className="flex-1">
            {/* Cabecera */}
            <section className="relative overflow-hidden">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-32 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
                />

                <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-14 sm:pt-16">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300">
                        // sobre el show
                    </span>

                    <h1 className="mt-5 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] sm:text-5xl">
                        Sobre Sintaxis &amp; Compás
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                        Un programa hecho por desarrolladores que también viven rodeados de
                        instrumentos. Grabamos en español, sin filtros corporativos y con la misma
                        disciplina con la que revisamos una pull request.
                    </p>
                </div>
            </section>

            {/* Manifiesto */}
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                            // manifiesto
                        </span>
                        <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                            Por qué programar también es componer música
                        </h2>

                        <div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
                            <p>
                                Porque ambos oficios empiezan con silencio. Antes de la primera
                                función o de la primera nota hay una estructura vacía esperando una
                                decisión: qué entra primero, qué se repite, qué se calla. Esa
                                decisión es el 90 % del trabajo y casi nunca aparece documentada.
                            </p>
                            <p>
                                Programar es ritmo. Un sprint tiene tempo, un módulo tiene voz y un
                                code review es una audición donde alguien te dice, con buenos
                                modos, que el puente no funciona. Cuando un equipo desafina no es
                                por falta de talento: es por falta de partitura compartida.
                            </p>
                            <p>
                                Componer es estructura. Cada arreglista sabe que la libertad sin
                                forma se vuelve ruido, y todo desarrollador ha escrito en algún
                                momento una función que sonaba bien en su cabeza y estallaba en
                                producción. Este podcast vive exactamente en esa intersección.
                            </p>
                        </div>
                    </div>

                    <aside className="md:col-span-5">
                        <figure className="neon-magenta h-full rounded-2xl border bg-[#0a0c18]/70 p-7">
                            <blockquote className="text-lg font-semibold leading-snug text-white sm:text-xl">
                                “Un buen sistema, como una buena canción, se sostiene aunque cambies
                                a quien la toca.”
                            </blockquote>
                            <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-widest text-fuchsia-300">
                                Sintaxis &amp; Compás — Ep. 04
                            </figcaption>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <CategoryChip category="Architecture" />
                                <CategoryChip category="Creativity" />
                            </div>
                        </figure>
                    </aside>
                </div>
            </section>

            {/* Anfitriones */}
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="border-b border-cyan-500/15 pb-6">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
                        // los anfitriones
                    </span>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Dos voces, una cabina
                    </h2>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {anfitriones.map((persona) => (
                        <article
                            key={persona.nombre}
                            className={`rounded-2xl border border-cyan-500/20 bg-[#0a0c18]/70 p-7 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${persona.borde}`}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${persona.color} font-mono text-lg font-black text-[#06070e] ${persona.glow}`}
                                    aria-hidden="true"
                                >
                                    {persona.iniciales}
                                </span>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{persona.nombre}</h3>
                                    <p
                                        className={`font-mono text-[11px] uppercase tracking-widest ${persona.rolClase}`}
                                    >
                                        {persona.rol}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-5 text-sm leading-relaxed text-zinc-400">{persona.bio}</p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {persona.etiquetas.map((etiqueta) => (
                                    <span
                                        key={etiqueta}
                                        className="rounded-full border border-zinc-700/70 bg-[#06070e]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                                    >
                                        {etiqueta}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Stack & Estudio */}
            <section className="mx-auto max-w-6xl px-6 py-10 pb-20">
                <div className="border-b border-cyan-500/15 pb-6">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                        // nuestro stack &amp; estudio
                    </span>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Con qué grabamos y con qué codificamos
                    </h2>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {stack.map((grupo) => {
                        const senal = senalClase[grupo.senal];
                        return (
                            <div
                                key={grupo.titulo}
                                className={`rounded-2xl border ${senal.borde} bg-[#0a0c18]/70 p-6`}
                            >
                                <h3
                                    className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] ${senal.texto}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${senal.punto}`}
                                        aria-hidden="true"
                                    />
                                    {grupo.titulo}
                                </h3>

                                <ul className="mt-5 space-y-4">
                                    {grupo.items.map((item) => (
                                        <li key={item.nombre}>
                                            <p className="text-sm font-semibold text-white">
                                                {item.nombre}
                                            </p>
                                            <p className="text-xs leading-relaxed text-zinc-500">
                                                {item.detalle}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Llamada a la acción */}
                <div className="neon-cyan mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border bg-[#0a0c18]/70 p-7 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            ¿Tienes un tema que merece episodio?
                        </h3>
                        <p className="mt-2 max-w-xl text-sm text-zinc-400">
                            Escríbenos: propuestas de tema, preguntas de oyentes o ganas de
                            colaborar. Leemos todo.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(217,70,239,0.6),0_0_14px_rgba(6,182,212,0.6)]"
                    >
                        Ir a Contacto ↗
                    </Link>
                </div>
            </section>
        </div>
    );
}
