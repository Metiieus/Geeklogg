import React from 'react';
import { Clock, Star, TrendingUp, Calendar, Plus, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaItem, Status } from '../App';

export const Dashboard: React.FC = () => {
  const { mediaItems, reviews, milestones, settings, setActivePage } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getRecentItem = (): MediaItem | null => {
    if (mediaItems.length === 0) return null;
    return mediaItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  };

  const getStats = () => {
    const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
    const completed = mediaItems.filter(item => item.status === 'completed').length;
    const ratedItems = mediaItems.filter(item => item.rating);
    const avgRating = ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length : 0;
    
    return { totalHours, completed, avgRating };
  };

  const getStatusCounts = () => {
    const counts: Record<Status, number> = {
      'completed': 0,
      'in-progress': 0,
      'dropped': 0,
      'planned': 0
    };
    
    mediaItems.forEach(item => {
      counts[item.status]++;
    });
    
    return counts;
  };

  const getStatusLabel = (status: Status) => {
    const labels = {
      'completed': 'Concluído',
      'in-progress': 'Em Progresso',
      'dropped': 'Abandonado',
      'planned': 'Planejado'
    };
    return labels[status];
  };

  const recentItem = getRecentItem();
  const stats = getStats();
  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {settings.name}
          </h1>
          <p className="text-slate-400">Bem-vindo de volta à sua jornada nerd</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Featured Content & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Item */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              Atualizado Recentemente
            </h2>
            
            {recentItem ? (
              <div className="flex gap-4">
                <div className="w-24 h-32 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                  {recentItem.cover ? (
                    <img src={recentItem.cover} alt={recentItem.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{recentItem.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">{getStatusLabel(recentItem.status)}</p>
                  {recentItem.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="text-yellow-400" size={14} fill="currentColor" />
                      <span className="text-sm text-white">{recentItem.rating}/10</span>
                    </div>
                  )}
                  {recentItem.hoursSpent && (
                    <div className="flex items-center gap-1">
                      <Clock className="text-blue-400" size={14} />
                      <span className="text-sm text-white">{recentItem.hoursSpent}h</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">Nenhum item na sua biblioteca ainda</p>
                <button 
                  onClick={() => setActivePage('library')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Adicionar Primeiro Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-blue-400" size={20} />
              <span className="text-blue-400 font-medium">Total de Horas</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalHours.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-green-400 font-medium">Concluídos</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-medium">Nota Média</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/5 to-green-600/5 backdrop-blur-sm rounded-xl p-4 border border-green-500/10">
          <p className="text-green-400 text-sm font-medium">Concluídos</p>
          <p className="text-2xl font-bold text-white">{statusCounts.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/10">
          <p className="text-blue-400 text-sm font-medium">Em Progresso</p>
          <p className="text-2xl font-bold text-white">{statusCounts['in-progress']}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/5 to-red-600/5 backdrop-blur-sm rounded-xl p-4 border border-red-500/10">
          <p className="text-red-400 text-sm font-medium">Abandonados</p>
          <p className="text-2xl font-bold text-white">{statusCounts.dropped}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10">
          <p className="text-purple-400 text-sm font-medium">Planejados</p>
          <p className="text-2xl font-bold text-white">{statusCounts.planned}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="text-purple-400" size={20} />
          Marcos Recentes
        </h2>
        
        {milestones.length > 0 ? (
          <div className="space-y-3">
            {milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="text-2xl">{milestone.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{milestone.title}</p>
                  <p className="text-sm text-slate-400">{new Date(milestone.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Nenhum marco registrado ainda</p>
            <p className="text-sm text-slate-500">Suas conquistas aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};