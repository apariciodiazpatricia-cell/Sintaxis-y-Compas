"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Episodios", href: "/episodes" },
    { name: "Sobre el Show", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-[#06070e]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logotipo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="neon-cyan flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-[#06070e] transition-all duration-300 group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7),0_0_45px_rgba(217,70,239,0.45)]">
            <svg
              viewBox="0 0 40 40"
              className="h-8 w-8 transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(217,70,239,0.9)]"
              role="img"
              aria-label="Logotipo de Sintaxis y Compás: corchetes de código, ondas de ecualizador y nota musical"
            >
              <defs>
                {/* Gradiente neón cian → fuchsia. userSpaceOnUse para que también
                    pinte líneas rectas (bbox con una dimensión a cero). */}
                <linearGradient
                  id="sc-logo-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="2"
                  y1="2"
                  x2="38"
                  y2="38"
                >
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
                {/* Inverso del gradiente para el espectro y la nota musical */}
                <linearGradient
                  id="sc-note-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="2"
                  y1="38"
                  x2="38"
                  y2="2"
                >
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                {/* Halo neón */}
                <filter id="sc-neon-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="1.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g filter="url(#sc-neon-glow)">
                {/* Chip de código: contenedor con esquinas y pines */}
                <rect
                  x="3.5"
                  y="5.5"
                  width="33"
                  height="29"
                  rx="7"
                  fill="none"
                  stroke="url(#sc-logo-gradient)"
                  strokeWidth="1.6"
                  opacity="0.95"
                />
                {/* Pines del chip */}
                <g
                  stroke="url(#sc-logo-gradient)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.8"
                >
                  <line x1="13" y1="5.5" x2="13" y2="2.5" />
                  <line x1="27" y1="5.5" x2="27" y2="2.5" />
                  <line x1="13" y1="34.5" x2="13" y2="37.5" />
                  <line x1="27" y1="34.5" x2="27" y2="37.5" />
                  <line x1="3.5" y1="14" x2="0.5" y2="14" />
                  <line x1="3.5" y1="26" x2="0.5" y2="26" />
                  <line x1="36.5" y1="14" x2="39.5" y2="14" />
                  <line x1="36.5" y1="26" x2="39.5" y2="26" />
                </g>

                {/* Ondas de ecualizador (fondo, espectro de audio) */}
                <g
                  stroke="url(#sc-note-gradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                >
                  <line x1="7" y1="17.5" x2="7" y2="22.5" />
                  <line x1="10.5" y1="13.5" x2="10.5" y2="26.5" />
                  <line x1="14" y1="16" x2="14" y2="24" />
                  <line x1="17.5" y1="11.5" x2="17.5" y2="28.5" />
                  <line x1="21" y1="15" x2="21" y2="25" />
                  <line x1="24.5" y1="12.5" x2="24.5" y2="27.5" />
                  <line x1="29" y1="17" x2="29" y2="23" />
                  <line x1="33.5" y1="16" x2="33.5" y2="25" />
                </g>

                {/* Corchetes de código </> */}
                <path
                  d="M13.5 14 L9 20 L13.5 26"
                  fill="none"
                  stroke="url(#sc-logo-gradient)"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5 14 L27 20 L22.5 26"
                  fill="none"
                  stroke="url(#sc-logo-gradient)"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Slash central del "</>" */}
                <line
                  x1="20"
                  y1="15.5"
                  x2="17"
                  y2="24.5"
                  stroke="url(#sc-logo-gradient)"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                {/* Nota musical (semicorchea) en gradiente magenta → cian */}
                <g>
                  <path
                    d="M31.6 26.2 V9.4 l3.6 1.6 v2.2 l-3.6-1.6"
                    fill="none"
                    stroke="url(#sc-note-gradient)"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <ellipse
                    cx="30"
                    cy="26.6"
                    rx="2.2"
                    ry="1.8"
                    transform="rotate(-18 30 26.6)"
                    fill="url(#sc-note-gradient)"
                  />
                </g>
              </g>
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-300 group-hover:[text-shadow:0_0_12px_rgba(6,182,212,0.6)]">
              Sintaxis &amp; Compás
            </span>
            <span className="block text-xs font-medium tracking-wide text-zinc-400">
              Podcast de Desarrollo &amp; Creatividad
            </span>
          </div>
        </Link>

        {/* Enlaces de navegación */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-cyan-300 font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.name}
                {/* Indicador neón inferior: se enciende en hover y queda activo en la ruta actual */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Botón de acción */}
        <div className="flex items-center gap-3">
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-xs font-black tracking-wide text-[#06070e] shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(217,70,239,0.65),0_0_12px_rgba(6,182,212,0.6)] sm:text-sm"
          >
            <span>Escuchar en Spotify</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
