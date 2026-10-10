import Link from "next/link";
import { PLATFORMS, platformIcons } from "@/app/components/PlatformIcons";

const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Episodios", href: "/episodes" },
    { name: "Sobre el Show", href: "/about" },
    { name: "Contacto", href: "/contact" },
];

const socialLinks = [
    { name: "X", href: "https://x.com", label: "Perfil en X" },
    { name: "GitHub", href: "https://github.com", label: "Código en GitHub" },
];

function EqualizerCard() {
    const bars = Array.from({ length: 12 });

    return (
        <div className="neon-cyan rounded-2xl border bg-[#0a0c18]/80 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                    </span>
                    Señal · En vivo
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-fuchsia-400">
                    44.1kHz
                </span>
            </div>

            {/* Ecualizador decorativo */}
            <div className="mt-5 flex h-16 items-end justify-between gap-1.5">
                {bars.map((_, i) => (
                    <span
                        key={i}
                        aria-hidden="true"
                        className="eq-bar h-full w-full rounded-sm bg-gradient-to-t from-fuchsia-500 via-cyan-400 to-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    />
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-cyan-500/15 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Compás · 120 BPM
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    ES
                </span>
            </div>
        </div>
    );
}

export default async function Footer() {
    "use cache";
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-cyan-500/20 bg-[#06070e]/90">
            {/* Borde superior con gradiente de luz cian → magenta */}
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            />

            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    {/* Manifiesto del podcast */}
                    <div className="md:col-span-5">
                        <Link href="/" className="group inline-flex items-center gap-3">
                            <div className="neon-cyan flex h-10 w-10 items-center justify-center rounded-xl border bg-cyan-500/10 font-mono text-xs font-black text-cyan-300 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]">
                                &lt;/&gt; ♪
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-300">
                                Sintaxis &amp; Compás
                            </span>
                        </Link>

                        <p className="neon-glow-text mt-6 text-2xl font-semibold leading-snug tracking-tight text-white">
                            Donde el código encuentra su propio ritmo.
                        </p>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                            Un espacio para hablar de desarrollo web, tecnología, diseño y procesos
                            creativos sin perder la voz humana. Compilando ideas, patrones y notas
                            entre terminales oscuras y compases abiertos.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="inline-flex h-9 items-center rounded-lg border border-zinc-800 px-3 text-xs font-semibold text-zinc-400 transition-all duration-300 hover:border-cyan-400/70 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav aria-label="Enlaces de navegación" className="md:col-span-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/80">
                            Navegación
                        </h3>
                        <ul className="mt-5 space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-fuchsia-400 hover:[text-shadow:0_0_10px_rgba(217,70,239,0.6)]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Plataformas de audio */}
                    <nav aria-label="Plataformas de audio" className="md:col-span-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/80">
                            Escúchanos en
                        </h3>
                        <ul className="mt-5 space-y-3">
                            {PLATFORMS.map((platform) => {
                                const Icon = platformIcons[platform.name];
                                return (
                                    <li key={platform.name}>
                                        <a
                                            href={platform.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-300 ${platform.hover}`}
                                        >
                                            <span className={`text-zinc-500 transition-all duration-300 ${platform.glow}`}>
                                                <Icon />
                                            </span>
                                            <span>{platform.name}</span>
                                            <span className="ml-auto text-xs text-zinc-600 transition-colors duration-300 group-hover:text-inherit">
                                                ↗
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Tarjeta de ecualizador decorativa */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <EqualizerCard />
                    </div>
                </div>

                {/* Derechos de autor */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-cyan-500/15 pt-8 sm:flex-row">
                    <p className="text-xs text-zinc-500">
                        © {year} Sintaxis &amp; Compás. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-zinc-600">
                        Grabado con <span className="text-fuchsia-400">♥</span> en español · Hecho con Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
