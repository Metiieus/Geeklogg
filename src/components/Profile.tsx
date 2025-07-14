import React, { useState } from "react";
import { Trophy, Crown, Star, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { AchievementTree } from "./AchievementTree";
import { AchievementModal } from "./AchievementModal";
import { EditProfileModal } from "./modals/EditProfileModal";
import { EditFavoritesModal } from "./modals/EditFavoritesModal";
import { saveSettings } from "../services/settingsService";
import { AchievementNode } from "../types/achievements";

const Profile: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const { user, profile, loading } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [editFav, setEditFav] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementNode | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "achievements">("info");

  const saveProfile = async (newSettings: typeof settings) => {
    console.log("💾 Salvando perfil:", newSettings);
    setSettings(newSettings);
    await saveSettings(newSettings);
    setEditProfile(false);
  };

  const saveFav = async (fav: typeof settings.favorites) => {
    const updated = { ...settings, favorites: fav };
    console.log("💾 Salvando favoritos:", updated);
    setSettings(updated);
    await saveSettings(updated);
    setEditFav(false);
  };

  const renderCards = (items: typeof settings.favorites.characters) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((it) => {
        return (
          <div
            key={it.id}
            className="bg-slate-800/50 p-2 rounded-lg text-center border border-slate-700/50"
          >
            <div className="w-full h-28 bg-slate-700 rounded-md overflow-hidden mb-2">
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <p className="text-sm text-white break-words">{it.name}</p>
          </div>
        );
      })}
      {items.length === 0 && (
        <p className="text-slate-500 col-span-full">Nenhum item</p>
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white mb-4">Meu Perfil</h1>
        {!profile?.isPremium && (
          <button
            onClick={() =>
              window.open(
                "https://checkout.stripe.com/pay/cs_test_premium",
                "_blank",
              )
            }
            className="group bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Crown className="w-5 h-5 group-hover:animate-bounce" />
            Assinar Premium
            <Star className="w-4 h-4" />
          </button>
        )}
        {profile?.isPremium && (
          <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
            <Crown className="w-5 h-5 text-cyan-300" />
            <span>Premium Ativo</span>
            <Zap className="w-4 h-4 text-cyan-300" />
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
      </div>
      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Premium Status Card */}
          <div
            className={`p-6 rounded-2xl border-2 ${
              profile?.isPremium
                ? "bg-gradient-to-br from-cyan-900/50 to-pink-900/50 border-cyan-500/50"
                : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-cyan-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    profile?.isPremium
                      ? "bg-gradient-to-br from-cyan-500 to-pink-500"
                      : "bg-gradient-to-br from-cyan-400 to-pink-400"
                  }`}
                >
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {profile?.isPremium
                      ? "Premium Ativo"
                      : "Upgrade para Premium"}
                  </h3>
                  <p className="text-gray-300">
                    {profile?.isPremium
                      ? "Acesso completo a todas as funcionalidades"
                      : "Desbloqueie recursos exclusivos como o Archivius AI"}
                  </p>
                </div>
              </div>
              {!profile?.isPremium && (
                <button
                  onClick={() =>
                    window.open(
                      "https://checkout.stripe.com/pay/cs_test_premium",
                      "_blank",
                    )
                  }
                  className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Assinar Agora
                </button>
              )}
            </div>

            {/* Premium Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-cyan-400" : "text-gray-400"}`}
                >
                  Archivius AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-pink-400" : "text-gray-400"}`}
                >
                  Sugestões Personalizadas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-purple-400" : "text-gray-400"}`}
                >
                  Badge Premium
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`${profile?.isPremium ? "text-indigo-400" : "text-gray-400"}`}
                >
                  Conquistas Exclusivas
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                {displayName}
              </h2>
              <p className="text-slate-400">{displayBio}</p>
              <button
                onClick={() => setEditProfile(true)}
                className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                Editar Perfil
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Favoritos</h3>
              <button
                onClick={() => setEditFav(true)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Editar Favoritos
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl">
                <h4 className="text-white font-medium mb-2">Personagens</h4>
                {renderCards(settings.favorites.characters)}
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                <h4 className="text-white font-medium mb-2">Jogos</h4>
                {renderCards(settings.favorites.games)}
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                <h4 className="text-white font-medium mb-2">Filmes</h4>
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
