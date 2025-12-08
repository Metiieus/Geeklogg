import React from "react";
import { useAppContext } from "../context/AppContext";
import EditMediaPage from "./EditMediaContent";

import { useParams, useNavigate } from "react-router-dom";

const EditMediaPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    mediaItems,
    setMediaItems,
    setActivePage,
  } = useAppContext();

  // Find item by ID from URL
  const itemToEdit = mediaItems.find((item) => item.id === id);

  if (!itemToEdit) {
    // Item not found
    React.useEffect(() => {
      // navigate("/library"); // Better to navigate explicitly than use setActivePage side-effect
      // But preventing immediate redirect loop logic if possible
    }, []);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-white">Item não encontrado.</p>
          <button
            onClick={() => navigate("/library")}
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
    navigate("/library");
  };

  const handleBack = () => {
    navigate("/library");
  };

  return (
    <EditMediaPage
      item={itemToEdit}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
};

export default EditMediaPageWrapper;
