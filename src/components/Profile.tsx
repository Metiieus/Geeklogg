import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Crown, Star, Zap, LogOut, Bell, Edit } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { AchievementTree } from "./AchievementTree";
import { AchievementModal } from "./AchievementModal";
import { EditProfileModal } from "./modals/EditProfileModal";
import { TruncatedBio } from "./TruncatedBio";
import { EditFavoritesModal } from "./modals/EditFavoritesModal";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/socialService";
import { Notification } from "../types/social";
import { saveSettings } from "../services/settingsService";
import { AchievementNode } from "../types/achievements";
import MercadoPagoButton from "./MercadoPagoButton";

const Profile: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const { user, profile, loading, logout } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [editFav, setEditFav] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementNode | null>(null);
  const [activeTab, setActiveTab] = useState<
    "info" | "achievements" | "notifications"
  >("info");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const saveProfile = async (newSettings: typeof settings) => {
    console.log("💾 Salvando perfil:", newSettings);
    setSettings(newSettings);
    if (!user?.uid) {
      console.error("Usuário não autenticado");
      return;
    }
    await saveSettings(user.uid, newSettings);
    setEditProfile(false);
  };

  const saveFav = async (fav: typeof settings.favorites) => {
    const updated = { ...settings, favorites: fav };
    console.log("💾 Salvando favoritos:", updated);
    setSettings(updated);
    if (!user?.uid) {
      console.error("Usuário não autenticado");
      return;
    }
    await saveSettings(user.uid, updated);
    setEditFav(false);
  };

  const loadNotifications = useCallback(async () => {
    if (activeTab !== "notifications") return;
    setLoadingNotifications(true);
    try {
            const userNotifications = await getUserNotifications(user?.uid || "");
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [activeTab]);

  // Carregar notificações quando a aba for selecionada
  useEffect(() => {
    if (activeTab === "notifications") {
      loadNotifications();
    }
  }, [activeTab, loadNotifications]);

  const renderCards = (items: typeof settings.favorites.characters) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {items.map((it) => {
        return (
          <div
            key={it.id}
            className="bg-slate-800/50 p-2 rounded-lg text-center border border-slate-700/50 min-w-0"
          >
            <div className="w-full h-16 sm:h-20 bg-slate-700 rounded-md overflow-hidden mb-2">
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <p
              className="text-xs text-white break-words"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {it.name}
            </p>
          </div>
        );
      })}
      {items.length === 0 && (
        <p className="text-slate-500 col-span-full text-xs sm:text-sm">
          Nenhum item
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="text-white text-center p-6">Carregando perfil...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-white text-center p-6">Usuário não encontrado.</div>
    );
  }

  // Use settings as primary source, fallback to profile data
  const displayName =
    settings.name || profile?.name || user.email?.split("@")[0] || "Usuário";
  const displayAvatar = settings.avatar || profile?.avatar;
  const displayBio = settings.bio || profile?.bio || "Sem bio definida.";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Meu Perfil
          </h1>

          {/* Botão de sair para mobile */}
          <button
            onClick={logout}
            className="sm:hidden flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        {profile?.isPremium && (
          <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center">
            <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-300" />
            <span>Premium Ativo</span>
            <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-300" />
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "info"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "achievements"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Trophy size={16} />
          Conquistas
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "notifications"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bell size={16} />
          Notificações
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Premium Status Card */}
          <div
            className={`p-4 sm:p-6 rounded-2xl border-2 overflow-hidden ${
              profile?.isPremium
                ? "bg-gradient-to-br from-cyan-900/50 to-pink-900/50 border-cyan-500/50"
                : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-cyan-500/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    profile?.isPremium
                      ? "bg-gradient-to-br from-cyan-500 to-pink-500"
                      : "bg-gradient-to-br from-cyan-400 to-pink-400"
                  }`}
                >
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {profile?.isPremium
                      ? "Premium Ativo"
                      : "Upgrade para Premium"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-100">
                    {profile?.isPremium
                      ? "Acesso completo a todas as funcionalidades"
                      : "Desbloqueie recursos exclusivos como o Archivius AI"}
                  </p>
                </div>
              </div>
              {!profile?.isPremium && (
                <MercadoPagoButton className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
                  Assinar Agora
                </MercadoPagoButton>
              )}
            </div>

            {/* Premium Features - responsivo */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-cyan-400" : "text-gray-200"}`}
                >
                  Archivius AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-pink-400" : "text-gray-200"}`}
                >
                  Sugestões Personalizadas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-purple-400" : "text-gray-200"}`}
                >
                  Badge Premium
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-indigo-400" : "text-gray-200"}`}
                >
                  Conquistas Exclusivas
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden w-full relative">
            {/* Capa do perfil */}
            <div className="h-32 sm:h-40 bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 backdrop-blur-[1px]"></div>
              {/* Padrão de partículas na capa */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${2 + Math.random()}s`,
                  }}
                />
              ))}
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative -mt-12">
              {/* Avatar com moldura melhorada */}
              <div className="relative">
                <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {(displayName || "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {/* Badge premium/status */}
                {profile?.isPremium && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-white break-words">
                  {displayName}
                </h2>
                <TruncatedBio
                  bio={displayBio}
                  maxLength={400}
                  className="text-slate-400 text-sm sm:text-base break-words"
                />
                <button
                  onClick={() => setEditProfile(true)}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                >
                  <Edit size={14} />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Favoritos</h3>
              <button
                onClick={() => setEditFav(true)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Editar Favoritos
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="bg-slate-800 p-3 sm:p-4 rounded-xl w-full min-w-0">
                <h4 className="text-white font-medium mb-2 text-center text-sm sm:text-base">
                  Personagens
                </h4>
                {renderCards(settings.favorites.characters)}
              </div>

              <div className="bg-slate-800 p-3 sm:p-4 rounded-xl w-full min-w-0">
                <h4 className="text-white font-medium mb-2 text-center text-sm sm:text-base">
                  Jogos
                </h4>
                {renderCards(settings.favorites.games)}
              </div>

              <div className="bg-slate-800 p-3 sm:p-4 rounded-xl w-full min-w-0">
                <h4 className="text-white font-medium mb-2 text-center text-sm sm:text-base">
                  Filmes
                </h4>
                {renderCards(settings.favorites.movies)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <AchievementTree onAchievementClick={setSelectedAchievement} />
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Notificações</h3>
            <button
              onClick={async () => {
                await markAllNotificationsAsRead();
                loadNotifications();
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            >
              Marcar todas como lidas
            </button>
          </div>

          {loadingNotifications ? (
            <div className="text-center text-slate-400 py-8">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Carregando notificações...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Bell size={48} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.read
                      ? "bg-slate-800/50 border-slate-700/50"
                      : "bg-purple-900/20 border-purple-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">
                        {notification.title}
                      </p>
                      <p className="text-slate-300 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {new Date(notification.createdAt).toLocaleString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={async () => {
                          await markNotificationAsRead(
                            user?.uid || "",
                            notification.id,
                          );
                          loadNotifications();
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                        title="Marcar como lida"
                      >
                        <Bell size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {editProfile && (
        <EditProfileModal
          profile={settings}
          onSave={saveProfile}
          onClose={() => setEditProfile(false)}
        />
      )}

      {editFav && (
        <EditFavoritesModal
          favorites={settings.favorites}
          onSave={saveFav}
          onClose={() => setEditFav(false)}
        />
      )}

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};

export default Profile;
