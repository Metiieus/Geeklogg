import React, { useState } from "react";
import {
  MessageSquare,
  Star,
  Plus,
  Search,
  Heart,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Review } from "../types";
import { AddReviewModal } from "./modals/AddReviewModal";
import { EditReviewModal } from "./modals/EditReviewModal";
import { deleteReview } from "../services/reviewService";

// Componente para texto truncado com "ver mais"
const TruncatedText: React.FC<{ text: string; maxChars: number }> = ({ text, maxChars }) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > maxChars;
  const displayText = needsTruncate && !expanded 
    ? text.substring(0, maxChars) + '...' 
    : text;

  return (
    <div>
      <div 
        className="text-slate-300 leading-relaxed prose prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
      {needsTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mt-2"
        >
          {expanded ? '▲ Ver menos' : '▼ Ver mais'}
        </button>
      )}
    </div>
  );
};

const Reviews: React.FC = () => {
  const { reviews, setReviews, mediaItems } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const media = mediaItems.find((item) => item.id === review.mediaId);
    return (
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (media && media.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const confirmDelete = async () => {
    if (reviewToDelete && reviewToDelete.id) {
      try {
        await deleteReview(reviewToDelete.id);
        setReviews(reviews.filter((review) => review.id !== reviewToDelete.id));
        // Feedback visual
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "✅ Resenha removida!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (error) {
        console.error("Erro ao excluir resenha:", error);
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "❌ Erro ao remover resenha!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleToggleFavorite = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, isFavorite: !review.isFavorite }
          : review,
      ),
    );
  };

  const handleEditReview = (updatedReview: Review) => {
    setReviews(
      reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review,
      ),
    );
    setEditingReview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resenhas</h1>
          <p className="text-slate-400">
            Seus pensamentos e impressões sobre sua jornada nerd
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Escrever Resenha
        </button>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar resenhas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 animate-fade-in">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
            console.log("Review item", review);
            const media = mediaItems.find((item) => item.id === review.mediaId);
            return (
              <div
                key={review.id}
                className="reviews-container bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-slide-up max-w-full overflow-hidden"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Media Cover */}
                  {media && (
                    <div className="w-12 h-16 sm:w-16 sm:h-20 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden hover:scale-110 transition-transform duration-300">
                      {media.cover ? (
                        <img
                          src={media.cover}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 break-words">
                          {review.title}
                        </h3>
                        {media && (
                          <p className="text-slate-400 text-sm break-words">
                            Resenha de {media.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleFavorite(review.id)}
                          className={`p-1 rounded transition-colors ${
                            review.isFavorite
                              ? "text-red-400"
                              : "text-slate-400 hover:text-red-400"
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={review.isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                        <div className="flex items-center gap-1">
                          <Star
                            className="text-yellow-400"
                            size={16}
                            fill="currentColor"
                          />
                          <span className="text-white font-medium">
                            {review.rating}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="reviews-content mb-4 overflow-hidden">
                      <TruncatedText text={review.content} maxChars={1000} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 p-1 rounded touch-target"
                        >
                          <Edit size={14} />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(review)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 p-1 rounded touch-target"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhuma resenha ainda
            </h3>
            <p className="text-slate-400 mb-6">
              Comece a escrever seus pensamentos sobre suas mídias favoritas
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Escrever Primeira Resenha
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <AddReviewModal
          onClose={() => setShowAddModal(false)}
          onSave={(newReview) => {
            setReviews([...reviews, newReview]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSave={handleEditReview}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-400" size={32} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Excluir Resenha
            </h2>

            <p className="text-slate-300 text-center mb-2">
              Tem certeza que deseja excluir a resenha
            </p>
            <p className="text-white font-semibold text-center mb-2">
              "{reviewToDelete?.title}"?
            </p>
            <p className="text-slate-400 text-sm text-center mb-8">
              Todo o conteúdo será perdido permanentemente.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Reviews;
