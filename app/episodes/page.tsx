"use client";

import { useMemo, useState } from "react";
import AudioPlayer from "@/app/components/AudioPlayer";
import CategoryChip from "@/app/components/CategoryChip";
import { EPISODES, type Episode } from "@/app/data/episodes";

const EP_INICIAL = EPISODES[0];

const FILTROS = [
    { key: "todos", label: "Todos" },
    { key: "Frontend", label: "Frontend" },
    { key: "Creativity", label: "Creatividad" },
    { key: "Architecture", label: "Arquitectura" },
    { key: "Career", label: "Carrera" },
] as const;

type FiltroKey = (typeof FILTROS)[number]["key"];

/** Minúsculas y sin acentos para que "arquitectura" encuentre "Arquitectura" */
const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

export default function EpisodiosPage() {
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroKey>("todos");
    const [episodioActivo, setEpisodioActivo] = useState<Episode>(EP_INICIAL);

    const resultados = useMemo(() => {
        const busqueda = normalizar(query.trim());

        return EPISODES.filter((episode) => {
            if (filtro !== "todos" && episode.category !== filtro) return false;
            if (!busqueda) return true;

            const contenido = normalizar(
                [episode.number, episode.title, episode.description, ...episode.notes].join(" "),
            );
            return contenido.includes(busqueda);
        });
    }, [query, filtro]);

    /** Nueva referencia para que el reproductor reaccione aunque sea el mismo episodio */
    const reproducir = (episode: Episode) => {
        setEpisodioActivo({ ...episode });
        document
            .getElementById("reproductor")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="flex-1">
            <section className="relative overflow-hidden">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-10 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
                />

                <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-14 sm:pt-16">
                    <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-fuchsia-300">
                        // archivo de audio
                    </span>

                    <h1 className="mt-5 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] sm:text-5xl">
                        Catálogo de Episodios
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                        Toda la discografía del show en una sola consola. Busca por título o por
                        notas del programa, filtra por categoría y lanza cualquier pista sin salir
                        de esta página.
                    </p>

                    {/* Reproductor en vivo */}
                    <div id="reproductor" className="mt-8 max-w-4xl scroll-mt-24">
                        <AudioPlayer initialEpisode={EP_INICIAL} activeEpisode={episodioActivo} />
                    </div>
                </div>
            </section>

            {/* Buscador y filtros */}
            <section className="mx-auto max-w-6xl px-6 pb-6">
                <div className="flex flex-col gap-5 rounded-2xl border border-cyan-500/20 bg-[#0a0c18]/70 p-5 backdrop-blur-sm lg:flex-row lg:items-center">
                    <label className="relative block min-w-0 flex-1">
                        <span className="sr-only">Buscar episodios por título o notas</span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-cyan-400"
                        >
                            ⌕
                        </span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar por título o notas del show…"
                            className="w-full rounded-xl border border-cyan-500/25 bg-[#06070e]/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-cyan-400/70 focus:shadow-[0_0_18px_rgba(6,182,212,0.35)]"
                        />
                    </label>

                    <div
                        role="group"
                        aria-label="Filtrar por categoría"
                        className="flex flex-wrap items-center gap-2"
                    >
                        {FILTROS.map(({ key, label }) => {
                            const activo = filtro === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setFiltro(key)}
                                    aria-pressed={activo}
                                    className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 ${
                                        activo
                                            ? "neon-cyan bg-cyan-400/15 text-cyan-200"
                                            : "border-zinc-700/70 bg-[#06070e]/60 text-zinc-400 hover:border-cyan-400/50 hover:text-cyan-300"
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                    {resultados.length} de {EPISODES.length} episodios
                    {query && <span className="text-cyan-400"> · resultados para “{query}”</span>}
                </p>
            </section>

            {/* Listado */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                {resultados.length === 0 ? (
                    <div className="neon-magenta rounded-2xl border bg-[#0a0c18]/70 p-10 text-center">
                        <p className="font-mono text-sm uppercase tracking-widest text-fuchsia-300">
                            Señal perdida
                        </p>
                        <p className="mt-3 text-sm text-zinc-400">
                            No encontramos episodios para
                            <span className="text-white"> “{query}” </span>
                            con el filtro seleccionado. Prueba con otra palabra o vuelve a
                            <span className="text-white"> Todos</span>.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setFiltro("todos");
                            }}
                            className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(217,70,239,0.6)]"
                        >
                            Restablecer búsqueda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {resultados.map((episode, index) => {
                            const glow = index % 2 === 0 ? "neon-cyan" : "neon-magenta";
                            const bullet = index % 2 === 0 ? "text-cyan-400" : "text-fuchsia-400";
                            const activo = episodioActivo.id === episode.id;

                            return (
                                <article
                                    key={episode.id}
                                    className={`relative flex flex-col rounded-2xl border bg-[#0a0c18]/70 p-6 backdrop-blur-sm transition-transform duration-300 ${glow} ${
                                        activo ? "scale-[1.015]" : ""
                                    }`}
                                >
                                    {activo && (
                                        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/60 bg-[#06070e] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                                            En el reproductor
                                        </span>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2">
                                        <CategoryChip category={episode.category} />
                                        <span className="rounded-full border border-zinc-700/70 bg-[#06070e]/70 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-zinc-400">
                                            {episode.number}
                                        </span>
                                        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                                            {episode.date}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold leading-snug text-white">
                                        {episode.title}
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                        {episode.description}
                                    </p>

                                    {episode.guest && (
                                        <p className="mt-3 text-xs font-semibold text-fuchsia-300/90">
                                            Invitada: {episode.guest}
                                        </p>
                                    )}

                                    {/* Notas del show */}
                                    <ul className="mt-4 space-y-1.5 border-t border-cyan-500/10 pt-4">
                                        {episode.notes.map((note) => (
                                            <li
                                                key={note}
                                                className="flex gap-2 text-xs leading-relaxed text-zinc-400"
                                            >
                                                <span
                                                    className={`font-mono ${bullet}`}
                                                    aria-hidden="true"
                                                >
                                                    ▹
                                                </span>
                                                <span>{note}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-1">
                                        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                                            Duración · {episode.duration}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => reproducir(episode)}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(217,70,239,0.6),0_0_14px_rgba(6,182,212,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070e]"
                                        >
                                            ▶ Escuchar ahora
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
