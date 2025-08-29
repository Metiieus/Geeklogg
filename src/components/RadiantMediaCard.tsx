import React from "react";
import { motion } from "framer-motion";


export type MediaKind = "games" | "movies" | "series" | "books" | "anime";
export interface RadiantMediaCardProps {
  title: string;
  imageUrl: string;
  kind: MediaKind;     // games | movies | series | books | anime
  genre?: string;      // opcional
  onClick?: () => void;
}

/** Paletas por tipo (moldura neon) */
const PALETTES: Record<MediaKind, { from: string; to: string; ring: string; accent: string }> = {
  games:  { from: "#0ea5e9", to: "#9333ea", ring: "rgba(147,51,234,.55)", accent: "#22d3ee" },
  movies: { from: "#f59e0b", to: "#ef4444", ring: "rgba(245,158,11,.55)", accent: "#f97316" },
  series: { from: "#22c55e", to: "#06b6d4", ring: "rgba(34,197,94,.55)", accent: "#10b981" },
  books:  { from: "#eab308", to: "#8b5cf6", ring: "rgba(234,179,8,.55)",  accent: "#f59e0b" },
  anime:  { from: "#ec4899", to: "#8b5cf6", ring: "rgba(236,72,153,.55)", accent: "#a78bfa" },
};

/** Molduras SVG por tipo */
const FRAMES: Record<MediaKind, string> = {
  games: `
    <svg viewBox="0 0 100 133" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="currentColor" stop-opacity="0.9"/>
          <stop offset="1" stop-color="currentColor" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="97" height="130" rx="8" ry="8" fill="none" stroke="url(#g1)" stroke-width="2.5"/>
      <path d="M2 22 H98" stroke="currentColor" stroke-opacity=".25" stroke-width="1"/>
      <path d="M10 118 H90" stroke="currentColor" stroke-opacity=".25" stroke-width="1"/>
      <circle cx="50" cy="22" r="3" fill="currentColor" opacity=".8"/>
      <path d="M5 35 L95 35 M5 95 L95 95" stroke="currentColor" stroke-opacity=".12" stroke-width=".6"/>
    </svg>
  `,
  movies: `
    <svg viewBox="0 0 100 133" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect x="1.5" y="1.5" width="97" height="130" rx="12" ry="12" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <g stroke="currentColor" stroke-opacity=".3" stroke-width="1">
        <circle cx="12" cy="12" r="3"/><circle cx="88" cy="12" r="3"/>
        <circle cx="12" cy="121" r="3"/><circle cx="88" cy="121" r="3"/>
      </g>
      <path d="M1.5 26 H98.5" stroke="currentColor" stroke-opacity=".22" stroke-width="1"/>
      <path d="M1.5 108 H98.5" stroke="currentColor" stroke-opacity=".22" stroke-width="1"/>
    </svg>
  `,
  series: `
    <svg viewBox="0 0 100 133" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M6 1.5 H94 a6 6 0 0 1 6 6 V125.5 a6 6 0 0 1 -6 6 H6 a6 6 0 0 1 -6 -6 V7.5 a6 6 0 0 1 6 -6 z"
            fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M1.5 18 L98.5 42 L98.5 48 L1.5 24 Z" fill="currentColor" opacity=".08"/>
      <path d="M1.5 115 L98.5 91" stroke="currentColor" stroke-opacity=".18" stroke-width="1"/>
    </svg>
  `,
  books: `
    <svg viewBox="0 0 100 133" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect x="1.5" y="1.5" width="97" height="130" rx="6" ry="6" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M6 20 H94" stroke="currentColor" stroke-opacity=".22" stroke-width="1.2"/>
      <path d="M6 20 Q50 10 94 20" fill="currentColor" opacity=".07"/>
      <path d="M6 113 Q50 123 94 113" fill="currentColor" opacity=".07"/>
    </svg>
  `,
  anime: `
    <svg viewBox="0 0 100 133" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect x="1.5" y="1.5" width="97" height="130" rx="16" ry="16" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <g stroke="currentColor" stroke-opacity=".25" stroke-width="1">
        <path d="M3 30 C25 18, 75 18, 97 30"/>
        <path d="M3 103 C25 115, 75 115, 97 103"/>
      </g>
      <circle cx="50" cy="67" r="2.2" fill="currentColor" opacity=".85"/>
    </svg>
  `,
};

const KIND_LABEL: Record<MediaKind, string> = {
  games: "Jogo",
  movies: "Filme",
  series: "Série",
  books: "Livro",
  anime: "Anime",
};

export const RadiantMediaCard: React.FC<RadiantMediaCardProps> = ({
  title,
  imageUrl,
  kind,
  genre,
  onClick,
}) => {
  const palette = PALETTES[kind];
  const frame = FRAMES[kind];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="group relative w-full aspect-[3/4] rounded-3xl p-[2px] focus:outline-none"
      style={{
        backgroundImage: `linear-gradient(140deg, ${palette.from}, ${palette.to})`,
        boxShadow: `0 10px 40px -10px ${palette.ring}`,
      }}
    >
      <div
        className="absolute -inset-2 rounded-[1.75rem] blur-2xl opacity-40"
        style={{
          backgroundImage: `radial-gradient(60% 60% at 50% 20%, ${palette.from}, transparent),
                            radial-gradient(60% 60% at 50% 80%, ${palette.to}, transparent)`,
        }}
        aria-hidden
      />
      <div className="relative h-full w-full rounded-[calc(theme(borderRadius.3xl)-2px)] overflow-hidden bg-slate-950/70">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[.95] contrast-110 saturate-110"
          loading="lazy"
        />
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-60"
          style={{
            background:
              `linear-gradient(180deg, ${palette.from}15, transparent 35%, transparent 65%, ${palette.to}20)`,
          }}
        />
        <div
          className="absolute inset-0 text-white"
          style={{ color: palette.accent }}
          dangerouslySetInnerHTML={{ __html: frame }}
          aria-hidden
        />
        <div
          className="absolute -inset-x-10 -top-10 h-2/3 rotate-12 opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="line-clamp-1 text-left text-white font-semibold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">
            {title}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/35 px-2 py-0.5 text-[11px] tracking-wide text-white/90 backdrop-blur">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: palette.accent }}
            />
            {KIND_LABEL[kind]}
            {genre && (
              <>
                <span className="mx-1 opacity-50">•</span>
                <span className="opacity-90">{genre}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default RadiantMediaCard;
