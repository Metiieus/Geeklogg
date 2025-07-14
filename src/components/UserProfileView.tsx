import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  UserPlus,
  UserCheck,
  Calendar,
  Star,
  Clock,
} from "lucide-react";
import { UserProfile } from "../types/social";
import {
  getUserProfile,
  followUser,
  unfollowUser,
  isFollowing,
} from "../services/socialService";
import { getMedias } from "../services/mediaService";
import { getReviews } from "../services/reviewService";
import { getMilestones } from "../services/milestoneService";
import { MediaItem, Review, Milestone } from "../App";
import { TruncatedBio } from "./TruncatedBio";

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userId,
  onBack,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);

      if (userProfile?.isPublic) {
        // Carregar dados públicos do usuário
        // Nota: Em produção, você criaria endpoints específicos para dados públicos
        const following = await isFollowing(userId);
        setIsFollowingUser(following);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowingUser) {
        await unfollowUser(userId);
        setIsFollowingUser(false);
      } else {
        await followUser(userId);
        setIsFollowingUser(true);
      }
      // Atualizar contadores
      await loadUserData();
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  };

  const getStats = () => {
    const totalHours = mediaItems.reduce(
      (sum, item) => sum + (item.hoursSpent || 0),
      0,
    );
    const completed = mediaItems.filter(
      (item) => item.status === "completed",
    ).length;
    const ratedItems = mediaItems.filter((item) => item.rating);
    const avgRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
          ratedItems.length
        : 0;

    return { totalHours, completed, avgRating };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Usuário não encontrado</p>
        <button
          onClick={onBack}
          className="mt-4 text-purple-400 hover:text-purple-300"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!profile.isPublic) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto mb-4 text-slate-500" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Perfil Privado
        </h3>
        <p className="text-slate-400 mb-6">
          Este usuário mantém seu perfil privado
        </p>
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300"
        >
          Voltar
        </button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-slate-400" size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">Perfil do Usuário</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {profile.name}
              </h2>
              {profile.bio && (
                <p className="text-slate-400 mb-4">{profile.bio}</p>
              )}

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-white font-medium">
                    {profile.followers?.length || 0}
                  </span>
                  <span className="text-slate-400">seguidores</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white font-medium">
                    {profile.following?.length || 0}
                  </span>
                  <span className="text-slate-400">seguindo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-400">
                    Desde{" "}
                    {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              isFollowingUser
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 text-white"
            }`}
          >
            {isFollowingUser ? (
              <>
                <UserCheck size={18} />
                Seguindo
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Seguir
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="text-blue-400" size={20} />
            </div>
            <span className="text-blue-400 font-medium">Total de Horas</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.totalHours.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="text-green-400" size={20} />
            </div>
            <span className="text-green-400 font-medium">Concluídos</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.completed}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="text-yellow-400" size={20} />
            </div>
            <span className="text-yellow-400 font-medium">Nota Média</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.avgRating.toFixed(1)}/10
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">
          Atividade Recente
        </h3>

        {milestones.length > 0 ? (
          <div className="space-y-3">
            {milestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="text-2xl">{milestone.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{milestone.title}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(milestone.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">Nenhuma atividade recente</p>
          </div>
        )}
      </div>
    </div>
  );
};
