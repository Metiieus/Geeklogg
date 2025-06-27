import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { EditProfileModal } from './modals/EditProfileModal';
import { EditFavoritesModal } from './modals/EditFavoritesModal';

export const Profile: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  const [editProfile, setEditProfile] = useState(false);
  const [editFav, setEditFav] = useState(false);

  const saveProfile = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setEditProfile(false);
  };

  const saveFav = (fav: typeof settings.favorites) => {
    setSettings({ ...settings, favorites: fav });
    setEditFav(false);
  };

  const renderCards = (items: typeof settings.favorites.characters) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.id} className="bg-slate-800/50 p-2 rounded-lg text-center border border-slate-700/50">
          <div className="w-full h-28 bg-slate-700 rounded-md overflow-hidden mb-2">
            {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
          </div>
          <p className="text-sm text-white break-words">{it.name}</p>
        </div>
      ))}
      {items.length === 0 && <p className="text-slate-500 col-span-full">Nenhum item</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-4xl font-bold">
          {settings.avatar ? (
            <img src={settings.avatar} alt={settings.name} className="w-full h-full object-cover" />
          ) : (
            settings.name.charAt(0).toUpperCase()
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">{settings.name}</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => setEditProfile(true)} className="px-4 py-2 bg-slate-800/70 text-white rounded-lg hover:bg-slate-700">Editar Perfil</button>
          <button onClick={() => setEditFav(true)} className="px-4 py-2 bg-slate-800/70 text-white rounded-lg hover:bg-slate-700">Editar Favoritos</button>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 space-y-2">
        <h2 className="text-xl font-semibold text-white">Biografia</h2>
        {settings.bio ? (
          <p className="text-slate-300 whitespace-pre-line">{settings.bio}</p>
        ) : (
          <p className="text-slate-500">Nenhuma biografia definida.</p>
        )}
      </div>

      {/* Favorites */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Personagens Favoritos</h2>
          {renderCards(settings.favorites.characters)}
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Jogos Favoritos</h2>
          {renderCards(settings.favorites.games)}
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Filmes/Séries Favoritos</h2>
          {renderCards(settings.favorites.movies)}
        </div>
      </div>

      {editProfile && (
        <EditProfileModal settings={settings} onSave={saveProfile} onClose={() => setEditProfile(false)} />
      )}
      {editFav && (
        <EditFavoritesModal favorites={settings.favorites} onSave={saveFav} onClose={() => setEditFav(false)} />
      )}
    </div>
  );
};
