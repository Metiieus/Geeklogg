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
import { useAppContext } from "../context/AppContext";
import { Milestone } from "../App";
import { AddMilestoneModal } from "./modals/AddMilestoneModal";
import { EditMilestoneModal } from "./modals/EditMilestoneModal";
import { deleteMilestone } from "../services/milestoneService";

const Timeline: React.FC = () => {
  const { milestones, setMilestones, mediaItems } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);

  const sortedMilestones = milestones.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
        await deleteMilestone(milestoneToDelete.id);
        setMilestones(
          milestones.filter((milestone) => milestone.id !== milestoneToDelete.id),
        );
        // Feedback visual
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "✅ Marco removido!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (error) {
        console.error('Erro ao excluir marco:', error);
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

  const handleEditMilestone = (updatedMilestone: Milestone) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === updatedMilestone.id ? updatedMilestone : milestone,
      ),
    );
    setEditingMilestone(null);
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
              console.log("Timeline milestone", milestone);
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
                  <div className="flex-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 line-clamp-2">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
                          <Calendar size={14} />
                          <span>
                            {new Date(milestone.date).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
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
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="p-1 sm:p-2 text-slate-400 hover:text-red-400 transition-all duration-200 hover:scale-110 hover:animate-wiggle touch-target"
                          title="Excluir"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                      {milestone.description}
                    </p>

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
          onSave={(newMilestone) => {
            setMilestones([...milestones, newMilestone]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <EditMilestoneModal
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSave={handleEditMilestone}
        />
      )}
    </div>
  );
};
export default Timeline;
