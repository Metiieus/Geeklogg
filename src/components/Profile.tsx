import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Profile: React.FC = () => {
  const { settings } = useAppContext();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
      </div>

      {/* Bio */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Biografia</h2>
        {settings.bio ? (
          <p className="text-slate-300 whitespace-pre-line">{settings.bio}</p>
        ) : (
          <p className="text-slate-500">Nenhuma biografia definida.</p>
        )}
      </div>
    </div>
  );
};
