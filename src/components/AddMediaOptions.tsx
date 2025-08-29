// src/components/AddMediaOptions.tsx
import React from "react";
import { Search, Plus } from "lucide-react";
import type { ExternalMediaResult } from "../services/externalMediaService";

interface AddMediaOptionsProps {
  onExternalResultSelect: (result: ExternalMediaResult) => void;
  onManualAdd: () => void;
}

export const AddMediaOptions: React.FC<AddMediaOptionsProps> = ({
  onExternalResultSelect,
  onManualAdd,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Buscar Online */}
      <button
        type="button"
        onClick={() => {
          const mock: ExternalMediaResult = {
            id: "temp-externo",
            title: "Exemplo da Busca Online",
            coverUrl: "https://via.placeholder.com/600x800?text=Poster",
            type: "movies" as any,
          };
          onExternalResultSelect(mock);
        }}
        className="group rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-4 text-left transition"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 p-2">
            <Search className="text-white/90" size={18} />
          </div>
          <div>
            <div className="font-semibold text-white">Buscar Online</div>
            <div className="text-sm text-white/70">Google Books, TMDb, IGDB…</div>
          </div>
        </div>
      </button>

      {/* Adicionar Manualmente */}
      <button
        type="button"
        onClick={onManualAdd}
        className="group rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-4 text-left transition"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 p-2">
            <Plus className="text-white/90" size={18} />
          </div>
          <div>
            <div className="font-semibold text-white">Adicionar Manualmente</div>
            <div className="text-sm text-white/70">Criar entrada personalizada</div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AddMediaOptions;
