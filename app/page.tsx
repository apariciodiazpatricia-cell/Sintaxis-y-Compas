"use client";

import { useState } from "react";
import AudioPlayer from "@/app/components/AudioPlayer";
import CategoryChip from "@/app/components/CategoryChip";
import { PLATFORMS, platformIcons } from "@/app/components/PlatformIcons";
import { EPISODES, type Episode } from "@/app/data/episodes";

/** Misma referencia inicial para no disparar reproducción en el montaje */
const EP_INICIAL = EPISODES[0];

export default function Home() {
    const [episodioActivo, setEpisodioActivo] = useState<Episode>(EP_INICIAL);

    /** Nueva referencia para que el reproductor reaccione aunque sea el mismo episodio */
    const reproducir = (episode: Episode) => {
        setEpisodioActivo({ ...episode });
        document
            .getElementById("reproductor")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="flex-1">
            {/* ============================ HERO ============================ */}
            <section className="relative overflow-hidden">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-40 top-24 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"
                />

                <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-14 sm:pt-20">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300 neon-cyan">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        </span>
                        Señal en vivo · Temporada 2
                    </span>

                    <h1 className="mt-6 max-w-4xl bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-4xl font-black leading-[1.05] tracking-tight text-transparent drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] sm:text-5xl md:text-6xl">
                        Donde el código encuentra su propio compás
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                        Un podcast en español sobre desarrollo web, arquitectura y creatividad.
                        Compilamos ideas, patrones y notas entre terminales oscuras y compases
                        abiertos. Pulsa play y sincroniza tu ritmo con el nuestro.
                    </p>

                    {/* Reproductor destacado en la parte superior del hero */}
                    <div id="reproductor" className="mt-9 max-w-4xl scroll-mt-24">
                        <AudioPlayer
                            initialEpisode={EP_INICIAL}
                            activeEpisode={episodioActivo}
                        />
                    </div>
                </div>
            </section>

            {/* ======================= ÚLTIMOS EPISODIOS ======================= */}
            <section className="mx-auto max-w-6xl px-6 py-14">
                <header className="flex flex-col gap-3 border-b border-cyan-500/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
                            // últimos episodios
                        </span>
                        <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Cuatro pistas para tu oído
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm text-zinc-500">
                        Selecciona cualquier episodio y el reproductor cambiará en vivo, sin
                        recargar la página.
                    </p>
                </header>

                <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {EPISODES.map((episode, index) => {
                        const activo = episodioActivo.id === episode.id;
                        const glow = index % 2 === 0 ? "neon-cyan" : "neon-magenta";
                        const bullet = index % 2 === 0 ? "text-cyan-400" : "text-fuchsia-400";

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
                                        Reproduciendo ahora
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

                                <h3 className="mt-4 text-lg font-bold leading-snug text-white">
                                    {episode.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                    {episode.description}
                                </p>

                                {episode.guest && (
                                    <p className="mt-3 text-xs font-semibold text-fuchsia-300/90">
                                        Invitada: {episode.guest}
                                    </p>
                                )}

                                {/* Notas del episodio */}
                                <ul className="mt-4 space-y-1.5 border-t border-cyan-500/10 pt-4">
                                    {episode.notes.map((note) => (
                                        <li
                                            key={note}
                                            className="flex gap-2 text-xs leading-relaxed text-zinc-400"
                                        >
                                            <span className={`font-mono ${bullet}`} aria-hidden="true">
                                                ▹
                                            </span>
                                            <span>{note}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 flex items-center justify-between gap-3 pt-1">
                                    <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                                        Duración · {episode.duration}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => reproducir(episode)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(217,70,239,0.6),0_0_14px_rgba(6,182,212,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070e]"
                                    >
                                        ▶ Reproducir este episodio
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* ===================== PLATAFORMAS DE TRANSMISIÓN ===================== */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <header className="border-b border-cyan-500/15 pb-6">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                        // plataformas de transmisión
                    </span>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Escúchanos donde prefieras
                    </h2>
                </header>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {PLATFORMS.map((platform) => {
                        const Icon = platformIcons[platform.name];
                        return (
                            <a
                                key={platform.name}
                                href={platform.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex flex-col items-start gap-3 rounded-2xl border border-cyan-500/20 bg-[#0a0c18]/60 p-5 transition-all duration-300 ${platform.hover}`}
                            >
                                <span
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-[#06070e] text-zinc-400 transition-all duration-300 ${platform.glow}`}
                                >
                                    <Icon />
                                </span>
                                <span className="text-sm font-bold text-white transition-colors duration-300 group-hover:text-inherit">
                                    {platform.name}
                                </span>
                                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 transition-colors duration-300 group-hover:text-inherit">
                                    Escuchar ahora ↗
                                </span>
                            </a>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
