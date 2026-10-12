"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Episode } from "@/app/data/episodes";

const SPEEDS = [1, 1.25, 1.5];

const CATEGORY_STYLES: Record<Episode["category"], string> = {
    Frontend: "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
    Creativity: "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-300",
    Architecture: "border-purple-400/50 bg-purple-400/10 text-purple-300",
    Career: "border-lime-300/50 bg-lime-300/10 text-lime-300",
};

const CATEGORY_LABELS: Record<Episode["category"], string> = {
    Frontend: "Frontend",
    Creativity: "Creatividad",
    Architecture: "Arquitectura",
    Career: "Carrera",
};

function formatTime(seconds: number): string {
    const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
    const total = Math.floor(safe);
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

/** "11:58" → 718 · "42 min" → 2520 (reserva mientras carga el metadata real) */
function durationToSeconds(duration: string): number {
    const [minutesPart, secondsPart] = duration.split(":");
    if (secondsPart !== undefined) {
        const minutes = Number(minutesPart);
        const seconds = Number(secondsPart);
        if (Number.isFinite(minutes) && Number.isFinite(seconds)) return minutes * 60 + seconds;
    }
    const match = duration.match(/(\d+)/);
    return match ? Number(match[1]) * 60 : 0;
}

/* ------------------------------------------------------------------ */
/* Autodetección de formato: .m4a y .mp3                               */
/* ------------------------------------------------------------------ */

function alternateFormat(url: string): string | null {
    if (/\.m4a$/i.test(url)) return url.replace(/\.m4a$/i, ".mp3");
    if (/\.mp3$/i.test(url)) return url.replace(/\.mp3$/i, ".m4a");
    return null;
}

function formatLabel(url: string): string {
    if (/\.m4a$/i.test(url)) return "M4A";
    if (/\.mp3$/i.test(url)) return "MP3";
    return "AUDIO";
}

/* ------------------------------------------------------------------ */
/* Slider neón con arrastre real (pointer capture) + teclado           */
/* ------------------------------------------------------------------ */

interface NeonSliderProps {
    value: number;
    max: number;
    onChange: (value: number) => void;
    ariaLabel: string;
    ariaValueText: string;
    className?: string;
    trackClassName?: string;
    thumbClassName?: string;
}

function NeonSlider({
    value,
    max,
    onChange,
    ariaLabel,
    ariaValueText,
    className = "",
    trackClassName = "h-1.5",
    thumbClassName = "h-3.5 w-3.5",
}: NeonSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const safeMax = max > 0 ? max : 1;
    const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

    const setFromClientX = (clientX: number) => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        if (rect.width === 0) return;
        const ratio = (clientX - rect.left) / rect.width;
        onChange(Math.min(1, Math.max(0, ratio)) * safeMax);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setFromClientX(event.clientX);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        setFromClientX(event.clientX);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const step = safeMax * 0.05;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                event.preventDefault();
                onChange(Math.min(safeMax, value + step));
                break;
            case "ArrowLeft":
            case "ArrowDown":
                event.preventDefault();
                onChange(Math.max(0, value - step));
                break;
            case "Home":
                event.preventDefault();
                onChange(0);
                break;
            case "End":
                event.preventDefault();
                onChange(safeMax);
                break;
            default:
        }
    };

    return (
        <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={Math.round(safeMax * 100) / 100}
            aria-valuenow={Math.round(value * 100) / 100}
            aria-valuetext={ariaValueText}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onKeyDown={handleKeyDown}
            className={`group relative cursor-pointer touch-none select-none rounded-full py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${className}`}
        >
            {/* Pista */}
            <div className={`relative w-full rounded-full bg-cyan-500/15 ${trackClassName}`}>
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    style={{ width: `${percent}%` }}
                />
            </div>
            {/* Thumb */}
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300 bg-[#06070e] shadow-[0_0_12px_rgba(6,182,212,0.95)] transition-transform duration-200 group-hover:scale-125 ${thumbClassName}`}
                style={{ left: `${percent}%` }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Botón reproducir / pausar                                           */
/* ------------------------------------------------------------------ */

function PlayPauseIcon({ playing }: { playing: boolean }) {
    if (playing) {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
                <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
                <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5 h-6 w-6">
            <path d="M8 5.6c0-.9 1-1.45 1.75-.96l9 6.4c.6.43.6 1.37 0 1.8l-9 6.4C9 19.72 8 19.2 8 18.3V5.6z" />
        </svg>
    );
}

function VolumeIcon({ muted }: { muted: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4.5 w-4.5"
        >
            <path d="M4 9.5h3.2L12 5.8v12.4L7.2 14.5H4z" fill="currentColor" stroke="none" />
            {muted ? (
                <>
                    <path d="M16.2 9.4l4 5.2" />
                    <path d="M20.2 9.4l-4 5.2" />
                </>
            ) : (
                <>
                    <path d="M15.4 9.2a4 4 0 0 1 0 5.6" />
                    <path d="M17.9 6.8a7.5 7.5 0 0 1 0 10.4" />
                </>
            )}
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* AudioPlayer — HTML5 nativo (sin síntesis de voz)                    */
/* ------------------------------------------------------------------ */

export default function AudioPlayer({
    initialEpisode,
    activeEpisode,
}: {
    initialEpisode: Episode;
    activeEpisode?: Episode;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const shouldPlayRef = useRef(false);
    const wantPlayRef = useRef(false);
    const lastActiveRef = useRef<Episode | undefined>(initialEpisode);
    /* Formato que ya ha fallado para este episodio (evita bucles de reintento) */
    const failedSrcRef = useRef<string | null>(null);

    const [episode, setEpisode] = useState<Episode>(initialEpisode);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [rate, setRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    /** Fuente que se está reproduciendo de verdad (cambia si hay que probar la otra extensión) */
    const [resolvedSrc, setResolvedSrc] = useState<string>(initialEpisode.audioUrl);
    const [sourceError, setSourceError] = useState(false);

    const active = isPlaying;
    const totalSeconds = duration > 0 ? duration : durationToSeconds(episode.duration);
    const progressValue = Math.min(currentTime, totalSeconds);

    /* Arranque real del archivo local (siempre HTML5, nunca voz sintética) */
    const tryPlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        wantPlayRef.current = true;
        void audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (sourceError) {
            retrySource();
            tryPlay();
            return;
        }
        if (audio.paused) {
            tryPlay();
        } else {
            wantPlayRef.current = false;
            audio.pause();
        }
    };

    /** Si el formato declarado no está, se reintenta una vez con la otra extensión */
    const handleAudioError = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const alternate = alternateFormat(episode.audioUrl);
        if (alternate && !failedSrcRef.current) {
            failedSrcRef.current = episode.audioUrl;
            setResolvedSrc(alternate);
            audio.src = alternate;
            audio.load();
            if (wantPlayRef.current) {
                void audio
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
            return;
        }
        setSourceError(true);
        setIsPlaying(false);
    };

    /** Botón 🔄: vuelve a intentar con el archivo declarado */
    const retrySource = () => {
        const audio = audioRef.current;
        if (!audio) return;
        failedSrcRef.current = null;
        setSourceError(false);
        setResolvedSrc(episode.audioUrl);
        audio.src = episode.audioUrl;
        audio.load();
    };

    /* Cambio de episodio en vivo desde la portada o /episodes */
    useEffect(() => {
        if (!activeEpisode || activeEpisode === lastActiveRef.current) return;
        lastActiveRef.current = activeEpisode;
        shouldPlayRef.current = true;
        setEpisode(activeEpisode);
    }, [activeEpisode]);

    /* Carga la fuente al instante y arranca si lo pidió una tarjeta */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        failedSrcRef.current = null;
        setResolvedSrc(episode.audioUrl);
        setSourceError(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        audio.src = episode.audioUrl;
        audio.load();

        if (shouldPlayRef.current) {
            shouldPlayRef.current = false;
            tryPlay();
        }
    }, [episode]);

    /* Preferencias de reproducción */
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) audio.playbackRate = rate;
    }, [rate]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
        audio.muted = isMuted;
    }, [volume, isMuted]);

    const seek = (time: number) => {
        const audio = audioRef.current;
        if (audio) audio.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <section
            aria-label="Reproductor de audio"
            className="neon-cyan relative overflow-hidden rounded-3xl border bg-[#0a0c18]/85 p-5 backdrop-blur-xl sm:p-7"
        >
            {/* Halos de luz */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-7">
                {/* Botón principal + ecualizador miniatura */}
                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={active ? `Pausar ${episode.title}` : `Reproducir ${episode.title}`}
                        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-[#06070e] shadow-[0_0_25px_rgba(6,182,212,0.55)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070e]"
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute -inset-2 rounded-full border border-cyan-400/60 ${
                                active ? "animate-ping opacity-70" : "opacity-0"
                            }`}
                        />
                        <span className="relative flex items-center justify-center">
                            <PlayPauseIcon playing={active} />
                        </span>
                    </button>

                    <div className="flex flex-col gap-2">
                        {/* Ecualizador miniatura: 4 barras animadas mientras suena */}
                        <div className="flex h-7 items-end gap-1" aria-hidden="true">
                            {[0, 1, 2, 3].map((bar) => (
                                <span
                                    key={bar}
                                    className={`eq-bar h-full w-1.5 rounded-full bg-gradient-to-t from-fuchsia-500 via-cyan-400 to-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.6)] ${
                                        active ? "" : "[animation-play-state:paused]"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/90">
                            {isPlaying ? "♪ sonando" : "⏸ en pausa"}
                        </span>
                    </div>
                </div>

                {/* Información y controles */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${CATEGORY_STYLES[episode.category]}`}
                        >
                            {CATEGORY_LABELS[episode.category]}
                        </span>
                        <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-cyan-300">
                            {episode.number}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            {episode.date}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            · {episode.duration}
                        </span>
                    </div>

                    {/* Indicador de la fuente de audio */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {sourceError ? (
                            <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-fuchsia-200">
                                <span aria-hidden="true">⚠</span>
                                archivo no disponible (.m4a / .mp3)
                                <button
                                    type="button"
                                    onClick={retrySource}
                                    className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-200 transition-colors duration-200 hover:border-cyan-300 hover:text-white"
                                >
                                    🔄 Comprobar audio
                                </button>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.35)]">
                                <span aria-hidden="true">🎧</span>
                                Audio de Estudio · {formatLabel(resolvedSrc)}
                                <span className="flex h-3 items-end gap-[2px] pl-1" aria-hidden="true">
                                    {[0, 1, 2, 3].map((bar) => (
                                        <span
                                            key={bar}
                                            className={`eq-bar h-full w-[2px] rounded-full bg-gradient-to-t from-amber-500 to-amber-200 ${
                                                active ? "" : "[animation-play-state:paused]"
                                            }`}
                                        />
                                    ))}
                                </span>
                            </span>
                        )}
                    </div>

                    <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                        {episode.title}
                    </h2>
                    {episode.guest && (
                        <p className="mt-1 text-xs text-fuchsia-300/90">Con {episode.guest}</p>
                    )}

                    {/* Progreso (duración y tiempo real del archivo) */}
                    <div className="mt-4 flex items-center gap-3">
                        <span className="font-mono text-xs tabular-nums text-cyan-300">
                            {formatTime(progressValue)}
                        </span>
                        <NeonSlider
                            className="flex-1"
                            value={progressValue}
                            max={totalSeconds}
                            onChange={seek}
                            ariaLabel="Progreso de la pista"
                            ariaValueText={`${formatTime(progressValue)} de ${formatTime(totalSeconds)}`}
                        />
                        <span className="font-mono text-xs tabular-nums text-zinc-400">
                            {formatTime(totalSeconds)}
                        </span>
                    </div>

                    {/* Velocidad + volumen */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                Vel
                            </span>
                            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-[#06070e]/70 p-1">
                                {SPEEDS.map((speed) => (
                                    <button
                                        key={speed}
                                        type="button"
                                        onClick={() => setRate(speed)}
                                        aria-pressed={rate === speed}
                                        className={`rounded-md px-2 py-1 font-mono text-[11px] transition-all duration-200 ${
                                            rate === speed
                                                ? "neon-cyan bg-cyan-400/15 text-cyan-200"
                                                : "border border-transparent text-zinc-400 hover:text-cyan-300"
                                        }`}
                                    >
                                        {speed}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex min-w-[9rem] items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsMuted((muted) => !muted)}
                                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                                aria-pressed={isMuted}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
                                    isMuted
                                        ? "neon-magenta bg-fuchsia-500/10 text-fuchsia-300"
                                        : "border-zinc-700/70 bg-[#06070e]/70 text-zinc-400 hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                }`}
                            >
                                <VolumeIcon muted={isMuted} />
                            </button>
                            <NeonSlider
                                className="flex-1"
                                value={isMuted ? 0 : volume}
                                max={1}
                                onChange={(value) => {
                                    setVolume(value);
                                    setIsMuted(false);
                                }}
                                ariaLabel="Volumen"
                                ariaValueText={`${Math.round((isMuted ? 0 : volume) * 100)} por ciento`}
                                trackClassName="h-1"
                                thumbClassName="h-3 w-3"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 📝 Temas clave y notas del debate */}
            <div className="relative mt-6 border-t border-cyan-500/15 pt-5">
                <div className="rounded-2xl border border-cyan-500/20 bg-[#06070e]/70 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                            📝 Temas Clave y Notas del Debate
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            {episode.number} · {episode.keyTopics.length} puntos
                        </span>
                    </div>

                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {episode.keyTopics.map((topic, index) => (
                            <li
                                key={topic}
                                className="flex gap-2.5 rounded-xl border border-zinc-800/70 bg-[#0a0c18]/70 p-2.5"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 h-5 shrink-0 rounded bg-cyan-400/15 px-1.5 font-mono text-[10px] font-bold leading-5 text-cyan-300"
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-sm leading-relaxed text-zinc-300">{topic}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 border-t border-zinc-800/70 pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fuchsia-300/80">
                            Notas técnicas
                        </span>
                        <ul className="mt-2 space-y-1.5">
                            {episode.notes.map((note) => (
                                <li key={note} className="flex gap-2 text-sm text-zinc-400">
                                    <span aria-hidden="true" className="text-fuchsia-400">
                                        ▸
                                    </span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Audio real de HTML5 */}
            <audio
                ref={audioRef}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
                onError={handleAudioError}
                className="hidden"
            />
        </section>
    );
}
