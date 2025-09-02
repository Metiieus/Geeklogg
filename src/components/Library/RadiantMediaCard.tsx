import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Tipagem dos itens de mídia
interface MediaItem {
  id: string;
  title: string;
  cover?: string;
  category?: string;
  rating?: number;
}

interface RadiantMediaCardProps {
  item: MediaItem;
  compact?: boolean; // usado para cards menores (Recentes, etc.)
}

// ==============================
// 🎴 RadiantMediaCard
// ==============================
export const RadiantMediaCard: React.FC<RadiantMediaCardProps> = ({
  item,
  compact = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-xl overflow-hidden shadow-lg bg-slate-900/60 
                  border border-slate-800 hover:border-cyan-400/50 transition-all duration-300 
                  ${compact ? "h-40" : "h-72"} flex flex-col`}
    >
      {/* Imagem de capa */}
      <div className="flex-1 relative">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm">
            Sem Capa
          </div>
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
      </div>

      {/* Infos do card */}
      <div className="p-3 z-10">
        <h3
          className={`font-semibold truncate ${
            compact ? "text-sm" : "text-base"
          } text-slate-100`}
        >
          {item.title}
        </h3>

        {/* Categoria (se houver) */}
        {item.category && (
          <p className="text-xs text-cyan-400 mt-1">{item.category}</p>
        )}

        {/* Avaliação com estrelas */}
        {item.rating !== undefined && (
          <div className="flex items-center mt-2 gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-slate-300">{item.rating}/10</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
