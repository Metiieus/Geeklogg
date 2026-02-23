import React from 'react';
import {
  Clock,
  Star,
  TrendingUp,
  Target,
  Zap,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMedias, useMilestones, useSettings } from '../hooks/queries';
import { MediaItem, Status } from '../types';
import { StreakCard } from '../components/StreakCard';
import { WeeklyChallengesCard } from '../components/WeeklyChallengesCard';
import { QuickActions } from '../components/QuickActions';
import { ProgressChart } from '../components/ProgressChart';
import { AchievementsCard } from '../components/AchievementsCard';
import { GoalsCard } from '../components/GoalsCard';
import { getStreakData } from '../services/streakService';
import { StatCard } from '../components/StatCard';
import { FeaturedMediaCard } from '../components/FeaturedMediaCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: mediaItems = [] } = useMedias(user?.uid);
  const { data: milestones = [] } = useMilestones(user?.uid);
  const { data: settings } = useSettings(user?.uid);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getRecentItem = (): MediaItem | null => {
    if (mediaItems.length === 0) return null;
    return [...mediaItems].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  };

  const getStats = () => {
    const totalHours = mediaItems.reduce(
      (sum, item) => sum + (item.hoursSpent || 0),
      0,
    );
    const completed = mediaItems.filter(
      (item) => item.status === 'completed',
    ).length;
    const inProgress = mediaItems.filter(
      (item) => item.status === 'in-progress',
    ).length;
    const ratedItems = mediaItems.filter((item) => item.rating);
    const avgRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
          ratedItems.length
        : 0;

    return { totalHours, completed, inProgress, avgRating };
  };

  const getStatusCounts = () => {
    const counts: Record<Status, number> = {
      completed: 0,
      'in-progress': 0,
      dropped: 0,
      planned: 0,
    };

    mediaItems.forEach((item) => {
      counts[item.status]++;
    });

    return counts;
  };

  const recentItem = getRecentItem();
  const stats = getStats();
  const statusCounts = getStatusCounts();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {getGreeting()}, {settings?.name || 'Nerd'}! 👋
          </h1>
          <p className="text-slate-400">
            Bem-vindo de volta à sua jornada nerd
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total de Horas"
          value={stats.totalHours.toLocaleString()}
          color="blue"
          subtitle={`${mediaItems.length} itens`}
        />
        <StatCard
          icon={TrendingUp}
          label="Concluídos"
          value={stats.completed}
          color="green"
          subtitle={`${((stats.completed / (mediaItems.length || 1)) * 100).toFixed(0)}% do total`}
        />
        <StatCard
          icon={Zap}
          label="Em Progresso"
          value={stats.inProgress}
          color="yellow"
          subtitle="Ativos agora"
        />
        <StatCard
          icon={Star}
          label="Nota Média"
          value={`${stats.avgRating.toFixed(1)}/10`}
          color="purple"
          subtitle={`${mediaItems.filter((m) => m.rating).length} avaliados`}
        />
      </div>

      {/* Featured Media */}
      <FeaturedMediaCard
        media={recentItem}
        onAddClick={() => navigate('/library')}
      />

      {/* Quick Actions */}
      <QuickActions onAddMedia={() => navigate('/library')} />

      {/* Gamification Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakCard userId={user.uid} />
        <WeeklyChallengesCard userId={user.uid} mediaItems={mediaItems} />
      </div>

      {/* Achievements & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementsCard
          userId={user.uid}
          mediaItems={mediaItems}
          currentStreak={getStreakData(user.uid).currentStreak}
        />
        <GoalsCard mediaItems={mediaItems} />
      </div>

      {/* Progress Chart */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="text-purple-400" size={24} />
          Progresso ao Longo do Tempo
        </h2>
        <ProgressChart mediaItems={mediaItems} milestones={milestones} />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:scale-[1.02] transition-all">
          <p className="text-green-400 text-sm font-medium mb-1">Concluídos</p>
          <p className="text-3xl font-bold text-white">{statusCounts.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:scale-[1.02] transition-all">
          <p className="text-blue-400 text-sm font-medium mb-1">Em Progresso</p>
          <p className="text-3xl font-bold text-white">{statusCounts['in-progress']}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20 hover:scale-[1.02] transition-all">
          <p className="text-red-400 text-sm font-medium mb-1">Abandonados</p>
          <p className="text-3xl font-bold text-white">{statusCounts.dropped}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 hover:scale-[1.02] transition-all">
          <p className="text-yellow-400 text-sm font-medium mb-1">Planejados</p>
          <p className="text-3xl font-bold text-white">{statusCounts.planned}</p>
        </div>
      </div>

      {/* Recent Milestones */}
      {milestones.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="text-pink-400" size={24} />
            Marcos Recentes
          </h2>
          <div className="space-y-3">
            {milestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{milestone.title}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(milestone.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
