import React from "react";
import { RadiantMediaCard } from "./RadiantMediaCard";
import { MediaItem } from "../../types/mediaTypes";

interface CollectionGridProps {
  items: MediaItem[];
  onCardClick?: (item: MediaItem) => void; // função para abrir o modal
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  items,
  onCardClick,
}) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 text-center py-10">
        Nenhuma mídia encontrada na coleção.
      </p>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-slate-200">
        Minha Coleção
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onCardClick?.(item)} // dispara o modal
            className="cursor-pointer"
          >
            <RadiantMediaCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};
