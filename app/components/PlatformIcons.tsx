/**
 * Iconos y datos de las plataformas de transmisión.
 * Componentes compartidos entre el Footer y la página de inicio.
 */

export interface Platform {
    name: string;
    href: string;
    /** Color de marca en hexadecimal (para `style`) */
    color: string;
    /** Clases de hover para el contenedor (borde, texto y resplandor) */
    hover: string;
    /** Clases de hover para el icono (color + drop-shadow neón) */
    glow: string;
}

export const PLATFORMS: Platform[] = [
    {
        name: "Spotify",
        href: "https://open.spotify.com",
        color: "#1DB954",
        hover: "hover:border-[#1DB954]/70 hover:text-[#1DB954] hover:shadow-[0_0_18px_rgba(29,185,84,0.45)]",
        glow: "group-hover:text-[#1DB954] group-hover:drop-shadow-[0_0_8px_rgba(29,185,84,0.8)]",
    },
    {
        name: "Apple Podcasts",
        href: "https://podcasts.apple.com",
        color: "#9933FF",
        hover: "hover:border-[#9933FF]/70 hover:text-[#9933FF] hover:shadow-[0_0_18px_rgba(153,51,255,0.45)]",
        glow: "group-hover:text-[#9933FF] group-hover:drop-shadow-[0_0_8px_rgba(153,51,255,0.8)]",
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com",
        color: "#FF0033",
        hover: "hover:border-[#FF0033]/70 hover:text-[#FF0033] hover:shadow-[0_0_18px_rgba(255,0,51,0.45)]",
        glow: "group-hover:text-[#FF0033] group-hover:drop-shadow-[0_0_8px_rgba(255,0,51,0.8)]",
    },
    {
        name: "iVoox",
        href: "https://www.ivoox.com",
        color: "#FF6600",
        hover: "hover:border-[#FF6600]/70 hover:text-[#FF6600] hover:shadow-[0_0_18px_rgba(255,102,0,0.45)]",
        glow: "group-hover:text-[#FF6600] group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)]",
    },
];

export function SpotifyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-5 w-5"
        >
            <circle cx="12" cy="12" r="9.25" />
            <path d="M7.4 9.5c3.1-.95 6.4-.6 9.2 1.05" />
            <path d="M8.1 12.5c2.5-.72 5.1-.46 7.3.9" />
            <path d="M8.8 15.4c1.9-.53 3.9-.36 5.6.64" />
        </svg>
    );
}

export function ApplePodcastsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-5 w-5"
        >
            <circle cx="12" cy="12" r="9.25" />
            <circle cx="12" cy="9.7" r="2.1" fill="currentColor" stroke="none" />
            <path d="M12 12.4v2.1" />
            <path d="M9.3 16.5a3.5 3.5 0 0 1 5.4 0" />
            <path d="M7.4 18.3a6.2 6.2 0 0 1 9.2 0" />
        </svg>
    );
}

export function YouTubeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
        >
            <rect x="2.75" y="5.75" width="18.5" height="12.5" rx="3.5" />
            <path d="M10.6 9.6 15.1 12l-4.5 2.4V9.6z" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function IVooxIcon() {
    return (
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
            <path d="M4.6 14.4v-2.3a7.4 7.4 0 0 1 14.8 0v2.3" />
            <rect x="2.9" y="13.5" width="4.1" height="6.4" rx="1.9" fill="currentColor" stroke="none" />
            <rect x="17" y="13.5" width="4.1" height="6.4" rx="1.9" fill="currentColor" stroke="none" />
        </svg>
    );
}

export const platformIcons: Record<string, () => React.JSX.Element> = {
    Spotify: SpotifyIcon,
    "Apple Podcasts": ApplePodcastsIcon,
    YouTube: YouTubeIcon,
    iVoox: IVooxIcon,
};
