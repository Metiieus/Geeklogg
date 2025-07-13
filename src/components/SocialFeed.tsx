import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Activity } from 'lucide-react';
import { UserSearch } from './UserSearch';
import { UserProfileView } from './UserProfileView';
import { getFollowingActivities } from '../services/socialService';
import { UserActivity, UserProfile } from '../types/social';

export const SocialFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'search'>('feed');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'feed') {
      loadActivities();
    }
  }, [activeTab]);

  const loadActivities = async () => {
    try {
      const followingActivities = await getFollowingActivities();
      setActivities(followingActivities);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'media_added':
        return '📚';
      case 'media_completed':
        return '✅';
      case 'review_added':
        return '📝';
      case 'milestone_added':
        return '🏆';
      case 'achievement_unlocked':
        return '🎖️';
      default:
        return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'media_added':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'media_completed':
        return 'border-green-500/20 bg-green-500/5';
      case 'review_added':
        return 'border-purple-500/20 bg-purple-500/5';
      case 'milestone_added':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'achievement_unlocked':
        return 'border-pink-500/20 bg-pink-500/5';
      default:
        return 'border-slate-500/20 bg-slate-500/5';
    }
  };

  if (selectedUser) {
    return (
      <UserProfileView 
        userId={selectedUser.uid} 
        onBack={() => setSelectedUser(null)} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Social</h1>
          <p className="text-slate-400">Conecte-se com outros nerds e acompanhe suas jornadas</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'feed'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity size={16} />
          Feed de Atividades
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'search'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search size={16} />
          Buscar Usuários
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                    {activity.userAvatar ? (
                      <img 
                        src={activity.userAvatar} 
                        alt={activity.userName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      activity.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      <span className="text-white font-medium">{activity.userName}</span>
                      <span className="text-slate-400">{activity.description}</span>
                      <span className="text-xs text-slate-500 ml-auto">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-1">{activity.title}</h3>
                    
                    {activity.mediaTitle && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Mídia:</span>
                        <span className="text-purple-400">{activity.mediaTitle}</span>
                        {activity.mediaType && (
                          <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">
                            {activity.mediaType}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-slate-500 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma atividade ainda</h3>
              <p className="text-slate-400 mb-6">Siga outros usuários para ver suas atividades aqui</p>
              <button 
                onClick={() => setActiveTab('search')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Search size={18} />
                Buscar Usuários
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <UserSearch onUserSelect={setSelectedUser} />
        </div>
      )}
    </div>
  );
};