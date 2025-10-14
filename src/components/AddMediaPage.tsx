import React, { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";

import { AddMediaOptions } from "./AddMediaOptions";
import { AddMediaFromSearchModal } from "./modals/AddMediaFromSearchModal";
import { ExternalMediaResult } from "../services/externalMediaService";

import { useAppContext } from "../context/AppContext";
import type { MediaItem } from "../App";
import { useToast } from "../context/ToastContext";

/**
 * Página simples para adicionar mídia.
 * Mostra as opções (Buscar online / Adicionar manualmente) e,
 * quando o usuário escolhe um resultado externo, abre o modal de confirmação.
 */
export const AddMediaPage: React.FC = () => {
  const { mediaItems, setMediaItems, navigateToEditMedia } =
    useAppContext() as {
      mediaItems: MediaItem[];
      setMediaItems: (items: MediaItem[]) => void;
      navigateToEditMedia: (item: MediaItem) => void;
    };
  const { showSuccess, showError } = useToast();

  const [selectedResult, setSelectedResult] =
    useState<ExternalMediaResult | null>(null);

  const handleAddFromSearch = useCallback(
    (newItem: MediaItem) => {
      try {
        setMediaItems([...mediaItems, newItem]);
        showSuccess("Mídia adicionada!");
        // navegação simples: volta uma tela (ajuste se você tiver uma rota específica)
        if (typeof window !== "undefined") window.history.back();
      } catch {
        showError("Erro ao adicionar mídia");
      } finally {
        setSelectedResult(null);
      }
    },
    [mediaItems, setMediaItems, showSuccess, showError],
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <button
          onClick={() =>
            typeof window !== "undefined" ? window.history.back() : null
          }
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
          aria-label="Voltar"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white text-balance">Adicionar Mídia</h1>
      </div>

      {/* Card com as opções */}
      <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-4 sm:p-6">
        <AddMediaOptions
          onExternalResultSelect={(r) => setSelectedResult(r)}
          onManualAdd={() => {
            // Se você tiver um formulário de criação manual, navegue para ele:
            // navigateToEditMedia({ ...novoItemVazio })
            // Por enquanto, abre a tela de edição com item vazio ou mantenha como TODO:
            navigateToEditMedia?.({} as MediaItem);
          }}
        />
      </div>

      {/* Modal de adicionar a partir da busca online */}
      {selectedResult && (
        <AddMediaFromSearchModal
          selectedResult={selectedResult}
          onAdd={handleAddFromSearch}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default AddMediaPage;
