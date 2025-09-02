import React from "react";
import React from "react";
import { motion } from "framer-motion";
import { RadiantMediaCard } from "./RadiantMediaCard";
import { Edit3 } from "lucide-react";
import { MediaItem } from "../../App";

interface FeaturedSectionProps {
  items: MediaItem[];
  onEdit: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  items,
  onEdit,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Destaques</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
        >
          <Edit3 size={16} /> Editar
        </button>
      </div>
      <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-56"
          >
            <RadiantMediaCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
