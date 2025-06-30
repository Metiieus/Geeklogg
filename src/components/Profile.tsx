import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from './modals/EditProfileModal';
import { EditFavoritesModal } from './modals/EditFavoritesModal';
import { saveSettings } from '../services/settingsService';

const Profile: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const { profile, loading } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [editFav, setEditFav] = useState(false);

  const saveProfile = async (newSettings: typeof settings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
    setEditProfile(false);
  };

  const saveFav = async (fav: typeof settings.favorites) => {
    const updated = { ...settings, favorites: fav };
    setSettings(updated);
    await saveSettings(updated);
    setEditFav(false);
  };

  const renderCards = (items: typeof settings.favorites.characters) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((it) => {
        console.log('Favorite item', it);
        return (
          <div key={it.id} className="bg-slate-800/50 p-2 rounded-lg text-center border border-slate-700/50">
            <div className="w-full h-28 bg-slate-700 rounded-md overflow-hidden mb-2">
              {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
            </div>
            <p className="text-sm text-white break-words">{it.name}</p>
          </div>
        );
      })}
      {items.length === 0 && <p className="text-slate-500 col-span-full">Nenhum item</p>}
    </div>
  );

  if (loading) {
    return <div className="text-white text-center p-6">Carregando perfil...</div>;
  }

  if (!profile) {
    return <div className="text-white text-center p-6">Perfil não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Meu Perfil</h1>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            profile.name?.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">{profile.name}</h2>
          <p className="text-slate-400">{profile.bio || 'Sem bio definida.'}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Favoritos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl">
            <h4 className="text-white font-medium mb-2">Personagens</h4>
            {profile.favorites?.characters?.length > 0 ? (
              <ul className="text-slate-400 list-disc list-inside">
                {profile.favorites.characters.map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">Nenhum personagem favorito.</p>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h4 className="text-white font-medium mb-2">Jogos</h4>
            {profile.favorites?.games?.length > 0 ? (
              <ul className="text-slate-400 list-disc list-inside">
                {profile.favorites.games.map((game, idx) => (
                  <li key={idx}>{game}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">Nenhum jogo favorito.</p>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h4 className="text-white font-medium mb-2">Filmes</h4>
            {profile.favorites?.movies?.length > 0 ? (
              <ul className="text-slate-400 list-disc list-inside">
                {profile.favorites.movies.map((movie, idx) => (
                  <li key={idx}>{movie}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">Nenhum filme favorito.</p>
            )}
          </div>
        </div>
      </div>

      {editProfile && profile && (
        <EditProfileModal
          profile={profile}
          onSave={saveProfile}
          onClose={() => setEditProfile(false)}
        />
      )}

      {editFav && profile && (
        <EditFavoritesModal
          favorites={settings.favorites}
          onSave={saveFav}
          onClose={() => setEditFav(false)}
        />
      )}
    </div>
  );
};

export default Profile;
