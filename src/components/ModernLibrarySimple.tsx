import React from 'react';
import { useAppContext } from '../context/AppContext';

const ModernLibrarySimple: React.FC = () => {
  const { mediaItems } = useAppContext();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Minha Biblioteca</h1>
      <p className="text-white/80 mb-4">Total de itens: {mediaItems.length}</p>
      
      {mediaItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">Sua biblioteca está vazia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
              <h3 className="text-white font-semibold">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.type} - {item.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernLibrarySimple;
