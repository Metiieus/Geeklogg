import React, { useState } from 'react';
import { MessageSquare, Star, Plus, Search, Heart, Calendar, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Review } from '../App';
import { AddReviewModal } from './modals/AddReviewModal';
import { EditReviewModal } from './modals/EditReviewModal';
import { deleteReview } from '../services/reviewService';

const Reviews: React.FC = () => {
  const { reviews, setReviews, mediaItems } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter(review => {
    const media = mediaItems.find(item => item.id === review.mediaId);
    return review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (media && media.title.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Tem certeza que deseja excluir esta resenha?')) {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  const handleToggleFavorite = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, isFavorite: !review.isFavorite }
        : review
    ));
  };

  const handleEditReview = (updatedReview: Review) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
    setEditingReview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resenhas</h1>
          <p className="text-slate-400">Seus pensamentos e impressões sobre sua jornada nerd</p>
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
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
            console.log('Review item', review);
            const media = mediaItems.find(item => item.id === review.mediaId);
            return (
              <div key={review.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  {/* Media Cover */}
                  {media && (
                    <div className="w-16 h-20 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                      {media.cover ? (
                        <img src={media.cover} alt={media.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <MessageSquare size={20} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{review.title}</h3>
                        {media && <p className="text-slate-400 text-sm">Resenha de {media.title}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFavorite(review.id)}
                          className={`p-1 rounded transition-colors ${
                            review.isFavorite ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart size={16} fill={review.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400" size={16} fill="currentColor" />
                          <span className="text-white font-medium">{review.rating}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none mb-4">
                      <p className="text-slate-300 leading-relaxed">{review.content}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingReview(review)}
                          className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Excluir
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
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma resenha ainda</h3>
            <p className="text-slate-400 mb-6">Comece a escrever seus pensamentos sobre suas mídias favoritas</p>
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
    </div>
  );
};export default Reviews;

