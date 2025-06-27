import React, { useState } from 'react';
import { Clock, Plus, Star, Calendar, Trophy, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Milestone } from '../App';
import { AddMilestoneModal } from './modals/AddMilestoneModal';
import { EditMilestoneModal } from './modals/EditMilestoneModal';
import { deleteMilestone } from '../services/milestoneService';

export const Timeline: React.FC = () => {
  const { milestones, setMilestones, mediaItems } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const sortedMilestones = milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (confirm('Tem certeza que deseja excluir este marco?')) {
      await deleteMilestone(milestoneId);
      setMilestones(milestones.filter(milestone => milestone.id !== milestoneId));
    }
  };

  const handleEditMilestone = (updatedMilestone: Milestone) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === updatedMilestone.id ? updatedMilestone : milestone
    ));
    setEditingMilestone(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Jornada Nerd</h1>
          <p className="text-slate-400">Sua jornada pessoal e momentos memoráveis</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Marco
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sortedMilestones.length > 0 ? (
          <div className="space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500 opacity-30" />

            {sortedMilestones.map((milestone, index) => (
              <div key={milestone.id} className="relative flex items-start gap-6">
                {/* Timeline Dot */}
                <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{milestone.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{milestone.title}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(milestone.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingMilestone(milestone)}
                        className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-4">{milestone.description}</p>

                  {/* Related Media */}
                  {milestone.mediaId && (() => {
                    const media = mediaItems.find(item => item.id === milestone.mediaId);
                    return media ? (
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                        <div className="w-10 h-12 bg-slate-700 rounded overflow-hidden">
                          {media.cover ? (
                            <img src={media.cover} alt={media.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Star size={14} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{media.title}</p>
                          <p className="text-slate-400 text-xs capitalize">{media.type}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum marco ainda</h3>
            <p className="text-slate-400 mb-6">Comece a registrar seus momentos memoráveis de jogos e entretenimento</p>
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