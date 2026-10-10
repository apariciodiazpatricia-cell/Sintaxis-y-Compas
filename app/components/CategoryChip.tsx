import type { Episode } from "@/app/data/episodes";

/** Paleta neón por categoría, compartida por todas las rutas */
export const CATEGORY_CHIP: Record<Episode["category"], { label: string; className: string }> = {
    Frontend: {
        label: "Frontend",
        className: "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
    },
    Creativity: {
        label: "Creatividad",
        className: "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-300",
    },
    Architecture: {
        label: "Arquitectura",
        className: "border-purple-400/50 bg-purple-400/10 text-purple-300",
    },
    Career: {
        label: "Carrera",
        className: "border-lime-300/50 bg-lime-300/10 text-lime-300",
    },
};

export default function CategoryChip({
    category,
    className = "",
}: {
    category: Episode["category"];
    className?: string;
}) {
    const chip = CATEGORY_CHIP[category];

    return (
        <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${chip.className} ${className}`}
        >
            {chip.label}
        </span>
    );
}
