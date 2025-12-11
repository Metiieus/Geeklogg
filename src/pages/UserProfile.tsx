import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  Star,
  BookOpen,
  Film,
  Gamepad2,
  Trophy,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { MediaItem, Review, Milestone } from "../types";
import { UserProfile } from "../types/social";
import { getMedias } from "../services/mediaService";
import { getReviews } from "../services/reviewService";
import { getMilestones } from "../services/milestoneService";
import {
  getUserProfile,
  followUser,
  unfollowUser,
} from "../services/socialService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userId,
  onBack,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "library" | "reviews" | "milestones"
  >("library");
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profile, media, userReviews, userMilestones] = await Promise.all([
        getUserProfile(userId),
        getMedias(userId),
        getReviews(userId),
        getMilestones(userId),
      ]);

      setUserProfile(profile);
      setMediaItems(media);
      setReviews(userReviews);
      setMilestones(userMilestones);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      showError("Erro", "Não foi possível carregar o perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!userProfile) return;

    try {
      if (userProfile.isFollowing) {
        await unfollowUser(userId);
        setUserProfile((prev) =>
          prev ? { ...prev, isFollowing: false } : null,
        );
        showSuccess(
          "Deixou de seguir",
          `Você deixou de seguir ${userProfile.name}`,
        );
      } else {
        await followUser(userId);
        setUserProfile((prev) =>
          prev ? { ...prev, isFollowing: true } : null,
        );
        showSuccess("Seguindo", `Agora você segue ${userProfile.name}`);
      }
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
      showError("Erro", "Não foi possível atualizar o status de seguimento");
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "books":
        return <BookOpen size={16} className="text-blue-400" />;
      case "movies":
        return <Film size={16} className="text-red-400" />;
      case "games":
        return <Gamepad2 size={16} className="text-green-400" />;
      default:
        return <Star size={16} className="text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto mb-4 text-slate-400" size={48} />
        <p className="text-slate-400">Usuário não encontrado</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-slate-400" size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">
          Perfil de {userProfile.name}
        </h1>
      </div>

      {/* Profile Info */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {userProfile.name}
              </h2>
              <p className="text-slate-400">{userProfile.email}</p>
              {userProfile.bio && (
                <p className="text-slate-300 mt-2">{userProfile.bio}</p>
              )}
            </div>
          </div>

          {user?.uid !== userId && (
            <button
              onClick={handleFollow}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userProfile.isFollowing
                  ? "bg-slate-600 hover:bg-slate-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
            >
              {userProfile.isFollowing ? (
                <>
                  <UserMinus size={16} />
                  Deixar de Seguir
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Seguir
                </>
              )}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {mediaItems.length}
            </div>
            <div className="text-sm text-slate-400">Mídias</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {reviews.length}
            </div>
            <div className="text-sm text-slate-400">Reviews</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {milestones.length}
            </div>
            <div className="text-sm text-slate-400">Marcos</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">
              {mediaItems.filter((item) => item.status === "completed").length}
            </div>
            <div className="text-sm text-slate-400">Concluídos</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
        {[
          { key: "library", label: "Biblioteca", icon: BookOpen },
          { key: "reviews", label: "Reviews", icon: Star },
          { key: "milestones", label: "Marcos", icon: Trophy },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${activeTab === key
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "library" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  {getMediaTypeIcon(item.type)}
                  <span className="text-sm text-slate-400 capitalize">
                    {item.type}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${item.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "in-progress"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                  >
                    {item.status}
                  </span>
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-400"
                        fill="currentColor"
                      />
                      <span className="text-xs text-slate-400">
                        {item.rating}/10
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.map((review) => {
              const media = mediaItems.find(
                (item) => item.id === review.mediaId,
              );
              return (
                <div
                  key={review.id}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {review.title}
                      </h3>
                      {media && (
                        <p className="text-sm text-slate-400">
                          Review de {media.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-400"
                        fill="currentColor"
                      />
                      <span className="text-white font-medium">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {review.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={12} />
                    {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="space-y-4">
            {milestones.map((milestone) => {
              const media = milestone.mediaId
                ? mediaItems.find((item) => item.id === milestone.mediaId)
                : null;
              return (
                <div
                  key={milestone.id}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{milestone.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-300 text-sm mt-1">
                        {milestone.description}
                      </p>
                      {media && (
                        <p className="text-xs text-purple-400 mt-2">
                          Relacionado a: {media.title}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={12} />
                        {new Date(milestone.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty states */}
        {activeTab === "library" && mediaItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-400">Biblioteca vazia</p>
          </div>
        )}

        {activeTab === "reviews" && reviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-400">Nenhuma review ainda</p>
          </div>
        )}

        {activeTab === "milestones" && milestones.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-400">Nenhum marco registrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
