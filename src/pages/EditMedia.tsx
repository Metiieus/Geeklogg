import React, { useEffect } from "react";
import EditMediaPage from "./EditMediaContent";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMedias, useUpdateMedia } from "../hooks/queries";
import { useToast } from "../context/ToastContext";

const EditMediaPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: mediaItems = [] } = useMedias(user?.uid);
  const updateMediaMutation = useUpdateMedia();
  const { showSuccess, showError } = useToast();

  // Find item by ID from URL
  const itemToEdit = mediaItems.find((item) => item.id === id);

  useEffect(() => {
    if (!itemToEdit && mediaItems.length > 0) {
      // Only redirect if media loaded but item not found
      // navigate("/library"); 
    }
  }, [itemToEdit, mediaItems, navigate]);

  if (!itemToEdit) {
    if (mediaItems.length === 0) {
      return <div className="text-white text-center py-8">Carregando...</div>;
    }
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

  const handleSave = async (updatedItem: any) => {
    try {
      await updateMediaMutation.mutateAsync({
        id: updatedItem.id,
        updates: updatedItem
      });
      showSuccess("Mídia atualizada com sucesso!");
      navigate("/library");
    } catch (error) {
      console.error("Failed to update media", error);
      showError("Erro ao atualizar mídia.");
    }
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
