import React, { useState } from "react";
import { X, Check, Star, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMedias } from "../../hooks/queries";
import { ModalWrapper } from "../ModalWrapper";

interface EditFeaturedModalProps {
  isOpen: boolean;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  game: "Jogo",
  anime: "Anime",
  tv: "Série",
  book: "Livro",
  movie: "Filme",
  manga: "Mangá",
};

export const EditFeaturedModal: React.FC<EditFeaturedModalProps> = ({
  isOpen,
  selectedIds,
  onSave,
  onClose,
}) => {
  const { user } = useAuth();
  const { data: mediaItems = [] } = useMedias(user?.uid);
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      )),
  );

  const toggle = (id: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 5) return prev; // Máximo 5 destaques
      return [...prev, id];
    });
  };

  const handleSave = () => {
    onSave(localSelected);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/20 flex flex-col max-h-[85vh] w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="text-yellow-400" size={24} />
              Editar Destaques
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Selecione até 5 itens para destacar na sua biblioteca (
              {localSelected.length}/5)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar na sua biblioteca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Grid de itens */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">
                {searchQuery
                  ? "Nenhum item encontrado"
                  : "Sua biblioteca está vazia"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => {
                const selected = localSelected.includes(item.id);
                const canSelect = localSelected.length < 5 || selected;

                return (
                  <button
                    key={item.id}
                    onClick={() => canSelect && toggle(item.id)}
                    disabled={!canSelect}
                    className={`relative group aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 ${selected
                        ? "ring-2 ring-purple-500 border-purple-400 scale-105 shadow-lg shadow-purple-500/25"
                        : canSelect
                          ? "border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg"
                          : "border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                  >
                    {/* Capa com fallback */}
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback sempre presente */}
                    <div
                      className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center absolute inset-0"
                      style={{ display: item.cover ? "none" : "flex" }}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-2 border border-white/20">
                          <span className="text-white font-bold text-lg">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white/60 text-xs">
                          {typeLabels[item.type] || item.type}
                        </span>
                      </div>
                    </div>

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Título */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white font-semibold text-xs leading-tight line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    {/* Indicador de seleção */}
                    {selected && (
                      <div className="absolute inset-0 bg-purple-500/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Overlay de máximo atingido */}
                    {!canSelect && !selected && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-white/60 text-xs font-medium">
                            Máximo
                          </span>
                          <span className="text-white/60 text-xs font-medium block">
                            atingido
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badge de rating */}
                    {item.rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                        <Star
                          size={10}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="text-white text-xs font-bold">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 bg-gradient-to-t from-slate-900/50 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              {localSelected.length} de 5 destaques selecionados
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Star size={16} />
                Salvar Destaques ({localSelected.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditFeaturedModal;
