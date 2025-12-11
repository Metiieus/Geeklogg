import React, { useState } from "react";
import {
  Clock,
  Plus,
  Star,
  Calendar,
  Trophy,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMilestones, useMedias, useDeleteMilestone } from "../hooks/queries";
import { Milestone } from "../types";
import { AddMilestoneModal } from "../components/modals/AddMilestoneModal";
import { EditMilestoneModal } from "../components/modals/EditMilestoneModal";
import { parseDate, formatDateShort } from "../utils/dateUtils";

// Componente para texto truncado com "ver mais"
const TruncatedText: React.FC<{ text: string; maxChars: number }> = ({ text, maxChars }) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > maxChars;
  const displayText = needsTruncate && !expanded
    ? text.substring(0, maxChars) + '...'
    : text;

  return (
    <div>
      <p
        className="text-slate-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
      {needsTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mb-3"
        >
          {expanded ? '▲ Ver menos' : '▼ Ver mais'}
        </button>
      )}
    </div>
  );
};

const Timeline: React.FC = () => {
  const { user } = useAuth();
  const { data: milestones = [] } = useMilestones(user?.uid);
  const { data: mediaItems = [] } = useMedias(user?.uid);
  const deleteMilestoneMutation = useDeleteMilestone();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(
    null,
  );

  const sortedMilestones = [...milestones].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
  );

  const handleDeleteClick = (milestone: Milestone) => {
    setMilestoneToDelete(milestone);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMilestoneToDelete(null);
  };

  const confirmDelete = async () => {
    if (milestoneToDelete && milestoneToDelete.id) {
      try {
        await deleteMilestoneMutation.mutateAsync(milestoneToDelete.id);
        // Feedback visual
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "✅ Marco removido!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (error) {
        console.error("Erro ao excluir marco:", error);
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "❌ Erro ao remover marco!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
      setShowDeleteModal(false);
      setMilestoneToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Jornada Nerd
          </h1>
          <p className="text-slate-400 text-sm sm:text-base hidden sm:block">
            Sua jornada pessoal e momentos memoráveis
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-1 sm:gap-2 self-start sm:self-auto"
        >
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Adicionar Marco</span>
          <span className="sm:hidden">Marco</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="relative animate-fade-in">
        {sortedMilestones.length > 0 ? (
          <div className="space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500 opacity-30 animate-pulse" />

            {sortedMilestones.map((milestone, index) => {
              return (
                <div
                  key={milestone.id}
                  className="relative flex items-start gap-3 sm:gap-6 animate-slide-in-left hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 animate-bounce flex-shrink-0">
                    <span className="text-lg sm:text-2xl">
                      {milestone.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 line-clamp-2">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
                          <Calendar size={14} />
                          <span>{formatDateShort(milestone.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => setEditingMilestone(milestone)}
                          className="p-1 sm:p-2 text-slate-400 hover:text-purple-400 transition-all duration-200 hover:scale-110 touch-target"
                          title="Editar"
                        >
                          <Edit size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(milestone)}
                          className="p-1 sm:p-2 text-slate-400 hover:text-red-400 transition-all duration-200 hover:scale-110 hover:animate-wiggle touch-target"
                          title="Excluir"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <TruncatedText text={milestone.description} maxChars={1000} />

                    {/* Images */}
                    {milestone.images && milestone.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-3 sm:mb-4">
                        {milestone.images.map((imageUrl, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative rounded-lg overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-colors group cursor-pointer"
                            onClick={() => window.open(imageUrl, '_blank')}
                          >
                            <img
                              src={imageUrl}
                              alt={`Imagem ${imgIndex + 1} de ${milestone.title}`}
                              className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                                Clique para ampliar
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Related Media */}
                    {milestone.mediaId &&
                      (() => {
                        const media = mediaItems.find(
                          (item) => item.id === milestone.mediaId,
                        );
                        return media ? (
                          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                            <div className="w-10 h-12 bg-slate-700 rounded overflow-hidden">
                              {media.cover ? (
                                <img
                                  src={media.cover}
                                  alt={media.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  <Star size={14} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {media.title}
                              </p>
                              <p className="text-slate-400 text-xs capitalize">
                                {media.type}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum marco ainda
            </h3>
            <p className="text-slate-400 mb-6">
              Comece a registrar seus momentos memoráveis de jogos e
              entretenimento
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Adicionar Primeiro Marco
            </button>
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <AddMilestoneModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <EditMilestoneModal
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSave={() => {
            setEditingMilestone(null);
          }}
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
              Excluir Marco
            </h2>

            <p className="text-slate-300 text-center mb-2">
              Tem certeza que deseja excluir o marco
            </p>
            <p className="text-white font-semibold text-center mb-2">
              "{milestoneToDelete?.title}"?
            </p>
            <p className="text-slate-400 text-sm text-center mb-8">
              Essa memória será perdida para sempre.
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
export default Timeline;
