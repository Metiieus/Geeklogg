import React from "react";
import { useAppContext } from "../context/AppContext";
import EditMediaPage from "./EditMediaPage";

const EditMediaPageWrapper: React.FC = () => {
  const {
    editingMediaItem,
    setEditingMediaItem,
    mediaItems,
    setMediaItems,
    setActivePage,
  } = useAppContext();

  if (!editingMediaItem) {
    // Se não há item sendo editado, volta para a biblioteca
    React.useEffect(() => {
      setActivePage("library");
    }, [setActivePage]);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-white">Nenhum item selecionado para edição.</p>
          <button
            onClick={() => setActivePage("library")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar para Biblioteca
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (updatedItem: any) => {
    // Atualiza o item na lista
    const updatedItems = mediaItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    setMediaItems(updatedItems);

    // Limpa o item sendo editado
    setEditingMediaItem(null);

    // Volta para a biblioteca
    setActivePage("library");
  };

  const handleBack = () => {
    setEditingMediaItem(null);
    setActivePage("library");
  };

  return (
    <EditMediaPage
      item={editingMediaItem}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
};

export default EditMediaPageWrapper;
