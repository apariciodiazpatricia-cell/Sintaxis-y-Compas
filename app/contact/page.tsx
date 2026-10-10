"use client";

import { useState, type FormEvent } from "react";

const TIPOS = [
    { key: "propuesta", label: "Propuesta de tema", hint: "Una idea que merece episodio" },
    { key: "pregunta", label: "Pregunta de oyente", hint: "La respondemos en el show" },
    { key: "colaboracion", label: "Colaboración", hint: "Proyectos, alianzas y guest mix" },
] as const;

type TipoKey = (typeof TIPOS)[number]["key"];
type Estado = "idle" | "enviando" | "enviado";

interface Errores {
    nombre?: string;
    correo?: string;
    tipo?: string;
    mensaje?: string;
}

const COMUNIDAD = [
    {
        nombre: "Discord",
        descripcion: "Comunidad de desarrolladores y músicos",
        detalle:
            "Canal #saludo, #ayuda-js y #colabora. Entra, preséntate y trae un problema o un riff.",
        href: "https://discord.com",
        color: "#5865F2",
        hover: "hover:border-[#5865F2]/70 hover:text-[#5865F2] hover:shadow-[0_0_18px_rgba(88,101,242,0.45)]",
        glow: "group-hover:text-[#5865F2] group-hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.8)]",
        etiqueta: "Unirse al servidor ↗",
    },
    {
        nombre: "GitHub",
        descripcion: "Repositorio del proyecto",
        detalle:
            "Issues para proponer temas, el código de este sitio y las notas de cada episodio.",
        href: "https://github.com",
        color: "#06B6D4",
        hover: "hover:border-cyan-400/70 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(6,182,212,0.45)]",
        glow: "group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
        etiqueta: "Ver repositorio ↗",
    },
    {
        nombre: "Correo directo",
        descripcion: "hola@sintaxisycompas.dev",
        detalle:
            "Para todo lo que no cabe en un formulario: prensa, invitaciones y colaboraciones largas.",
        href: "mailto:hola@sintaxisycompas.dev",
        color: "#D946EF",
        hover: "hover:border-fuchsia-500/70 hover:text-fuchsia-400 hover:shadow-[0_0_18px_rgba(217,70,239,0.45)]",
        glow: "group-hover:text-fuchsia-400 group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]",
        etiqueta: "Escribir un correo ↗",
    },
] as const;

type CanalNombre = (typeof COMUNIDAD)[number]["nombre"];

const ICONOS: Record<CanalNombre, () => React.JSX.Element> = {
    Discord: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M19.3 5.4A16.6 16.6 0 0 0 15.2 4l-.3.6a12.6 12.6 0 0 1 3.6 1.7 12 12 0 0 0-10.9 0A12.6 12.6 0 0 1 11.2 4.6L10.9 4a16.6 16.6 0 0 0-4.1 1.4C3.9 9.6 3.2 13.7 3.5 17.7a16.7 16.7 0 0 0 5 2.5l.7-1.1a10.7 10.7 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 10.2 0l.4.3a10.7 10.7 0 0 1-1.7.8l.7 1.1a16.7 16.7 0 0 0 5-2.5c.4-4.7-.6-8.8-3.2-12.3ZM9.5 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
        </svg>
    ),
    GitHub: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.65-.2.65-.45v-1.6c-2.65.6-3.2-1.3-3.2-1.3-.45-1.1-1.05-1.4-1.05-1.4-.85-.6.05-.6.05-.6.95.05 1.45 1 1.45 1 .85 1.45 2.2 1.05 2.75.8.1-.6.35-1.05.6-1.3-2.1-.25-4.3-1.05-4.3-4.7 0-1.05.35-1.9 1-2.55-.1-.25-.45-1.2.1-2.55 0 0 .8-.25 2.65 1a9.1 9.1 0 0 1 4.8 0c1.85-1.25 2.65-1 2.65-1 .55 1.35.2 2.3.1 2.55.6.65 1 1.5 1 2.55 0 3.65-2.25 4.45-4.35 4.7.35.3.65.9.65 1.8v2.65c0 .25.15.55.65.45A9.5 9.5 0 0 0 12 2.5Z" />
        </svg>
    ),
    "Correo directo": () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
        >
            <rect x="2.75" y="5" width="18.5" height="14" rx="3" />
            <path d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
        </svg>
    ),
};

const inputBase =
    "w-full rounded-xl border bg-[#06070e]/80 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-600";

export default function ContactoPage() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [tipo, setTipo] = useState<TipoKey | null>(null);
    const [mensaje, setMensaje] = useState("");
    const [errores, setErrores] = useState<Errores>({});
    const [estado, setEstado] = useState<Estado>("idle");

    const validar = (): Errores => {
        const nuevos: Errores = {};

        if (nombre.trim().length < 2) {
            nuevos.nombre = "Escribe tu nombre (mínimo 2 caracteres).";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) {
            nuevos.correo = "Introduce un correo válido, por ejemplo hola@dominio.com.";
        }
        if (!tipo) {
            nuevos.tipo = "Selecciona el tipo de mensaje.";
        }
        if (mensaje.trim().length < 10) {
            nuevos.mensaje = "Cuéntanos algo más: al menos 10 caracteres.";
        }

        return nuevos;
    };

    const enviar = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nuevos = validar();
        setErrores(nuevos);
        if (Object.keys(nuevos).length > 0) return;

        setEstado("enviando");
        // Envío simulado: aquí entraría fetch("/api/contacto", …)
        window.setTimeout(() => setEstado("enviado"), 900);
    };

    const reiniciar = () => {
        setNombre("");
        setCorreo("");
        setTipo(null);
        setMensaje("");
        setErrores({});
        setEstado("idle");
    };

    const claseError = (campo: keyof Errores) =>
        errores[campo] ? "border-fuchsia-500/70 shadow-[0_0_14px_rgba(217,70,239,0.35)]" : "border-cyan-500/25";

    /** Borra el error de un campo en cuanto el usuario vuelve a escribir */
    const limpiarError = (campo: keyof Errores) =>
        setErrores((previos) => (previos[campo] ? { ...previos, [campo]: undefined } : previos));

    const mensajeError = (campo: keyof Errores) =>
        errores[campo] ? (
            <p className="mt-1.5 font-mono text-[11px] text-fuchsia-300" role="alert">
                {errores[campo]}
            </p>
        ) : null;

    return (
        <div className="flex-1">
            {/* Cabecera */}
            <section className="relative overflow-hidden">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-40 top-32 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"
                />

                <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-14 sm:pt-16">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300">
                        // canal abierto
                    </span>

                    <h1 className="mt-5 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] sm:text-5xl">
                        Contacto &amp; Comunidad
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                        ¿Una idea de tema, una duda que llevas semanas dándote vueltas o ganas de
                        colaborar? Elige un canal: respondemos en menos de 48 horas laborables.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Formulario */}
                    <div className="lg:col-span-7">
                        {estado === "enviado" ? (
                            <div
                                className="neon-cyan rounded-2xl border bg-[#0a0c18]/80 p-8 text-center"
                                role="status"
                            >
                                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-[#06070e] shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className="h-7 w-7"
                                    >
                                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                </span>

                                <h2 className="mt-6 text-2xl font-black text-white">
                                    Mensaje enviado
                                </h2>
                                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                                    Gracias, <span className="text-cyan-300">{nombre.trim()}</span>.
                                    Hemos recibido tu
                                    <span className="text-fuchsia-300">
                                        {" "}
                                        {TIPOS.find((t) => t.key === tipo)?.label.toLowerCase()}{" "}
                                    </span>
                                    y te responderemos en <span className="text-white">hola@</span>
                                    <span className="text-white">sintaxisycompas.dev</span>.
                                </p>

                                <div className="mt-7 flex flex-wrap justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={reiniciar}
                                        className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(217,70,239,0.6)]"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                    <a
                                        href="mailto:hola@sintaxisycompas.dev"
                                        className="rounded-xl border border-cyan-500/40 bg-[#06070e]/70 px-5 py-3 text-xs font-black tracking-wide text-cyan-300 transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(6,182,212,0.45)]"
                                    >
                                        Escribir por correo
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={enviar}
                                noValidate
                                className="rounded-2xl border border-cyan-500/20 bg-[#0a0c18]/70 p-6 backdrop-blur-sm sm:p-8"
                            >
                                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
                                    // envía una señal
                                </h2>

                                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="nombre"
                                            className="block font-mono text-[11px] uppercase tracking-widest text-zinc-400"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            autoComplete="name"
                                            value={nombre}
                                            onChange={(event) => {
                                                setNombre(event.target.value);
                                                limpiarError("nombre");
                                            }}
                                            placeholder="Cómo te llamas"
                                            aria-invalid={Boolean(errores.nombre)}
                                            className={`${inputBase} mt-2 focus:border-cyan-400/70 focus:shadow-[0_0_18px_rgba(6,182,212,0.35)] ${claseError("nombre")}`}
                                        />
                                        {mensajeError("nombre")}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="correo"
                                            className="block font-mono text-[11px] uppercase tracking-widest text-zinc-400"
                                        >
                                            Correo
                                        </label>
                                        <input
                                            id="correo"
                                            name="correo"
                                            type="email"
                                            autoComplete="email"
                                            value={correo}
                                            onChange={(event) => {
                                                setCorreo(event.target.value);
                                                limpiarError("correo");
                                            }}
                                            placeholder="tu@correo.com"
                                            aria-invalid={Boolean(errores.correo)}
                                            className={`${inputBase} mt-2 focus:border-cyan-400/70 focus:shadow-[0_0_18px_rgba(6,182,212,0.35)] ${claseError("correo")}`}
                                        />
                                        {mensajeError("correo")}
                                    </div>
                                </div>

                                {/* Tipo de mensaje */}
                                <fieldset className="mt-6">
                                    <legend className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
                                        Tipo de mensaje
                                    </legend>
                                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {TIPOS.map((opcion) => {
                                            const activo = tipo === opcion.key;
                                            return (
                                                <button
                                                    key={opcion.key}
                                                    type="button"
                                                    onClick={() => {
                                                        setTipo(opcion.key);
                                                        limpiarError("tipo");
                                                    }}
                                                    aria-pressed={activo}
                                                    className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                                                        activo
                                                            ? "neon-cyan bg-cyan-400/10"
                                                            : "border-zinc-700/70 bg-[#06070e]/60 hover:border-cyan-400/50"
                                                    }`}
                                                >
                                                    <span
                                                        className={`block text-xs font-bold ${activo ? "text-cyan-200" : "text-white"}`}
                                                    >
                                                        {opcion.label}
                                                    </span>
                                                        <span className="mt-1 block text-[11px] leading-snug text-zinc-500">
                                                        {opcion.hint}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {mensajeError("tipo")}
                                </fieldset>

                                <div className="mt-6">
                                    <label
                                        htmlFor="mensaje"
                                        className="block font-mono text-[11px] uppercase tracking-widest text-zinc-400"
                                    >
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        rows={6}
                                        value={mensaje}
                                        onChange={(event) => {
                                            setMensaje(event.target.value);
                                            limpiarError("mensaje");
                                        }}
                                        placeholder="Cuéntanos tu idea, tu pregunta o en qué te gustaría colaborar…"
                                        aria-invalid={Boolean(errores.mensaje)}
                                        className={`${inputBase} mt-2 resize-y leading-relaxed focus:border-cyan-400/70 focus:shadow-[0_0_18px_rgba(6,182,212,0.35)] ${claseError("mensaje")}`}
                                    />
                                    {mensajeError("mensaje")}
                                </div>

                                <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                    <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                                        Respuesta en menos de 48 h
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={estado === "enviando"}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(217,70,239,0.6),0_0_14px_rgba(6,182,212,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070e] disabled:cursor-wait disabled:opacity-70"
                                    >
                                        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
                                        <span aria-hidden="true">↗</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Comunidad */}
                    <div className="lg:col-span-5">
                        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                            // comunidad
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                            El show no termina cuando se corta el audio. Estos son los tres sitios
                            donde la conversación sigue.
                        </p>

                        <ul className="mt-6 space-y-4">
                            {COMUNIDAD.map((canal) => {
                                const Icono = ICONOS[canal.nombre];
                                return (
                                    <li key={canal.nombre}>
                                        <a
                                            href={canal.href}
                                            target={canal.href.startsWith("mailto:") ? undefined : "_blank"}
                                            rel={
                                                canal.href.startsWith("mailto:")
                                                    ? undefined
                                                    : "noopener noreferrer"
                                            }
                                            className={`group flex items-start gap-4 rounded-2xl border border-cyan-500/20 bg-[#0a0c18]/70 p-5 transition-all duration-300 ${canal.hover}`}
                                        >
                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-[#06070e] text-zinc-400 transition-all duration-300 ${canal.glow}`}
                                            >
                                                <Icono />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-bold text-white transition-colors duration-300 group-hover:text-inherit">
                                                    {canal.nombre}
                                                </span>
                                                <span className="mt-0.5 block font-mono text-[11px] tracking-wide text-zinc-500 transition-colors duration-300 group-hover:text-inherit">
                                                    {canal.descripcion}
                                                </span>
                                                <span className="mt-2 block text-xs leading-relaxed text-zinc-400">
                                                    {canal.detalle}
                                                </span>
                                                <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-widest text-zinc-600 transition-colors duration-300 group-hover:text-inherit">
                                                    {canal.etiqueta}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="neon-magenta mt-6 rounded-2xl border bg-[#0a0c18]/70 p-5">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-fuchsia-300">
                                Horario de la cabina
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                Grabamos los miércoles por la noche y publicamos cada dos semanas.
                                Fuera de ese horario, el correo sigue siendo la vía más rápida.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
