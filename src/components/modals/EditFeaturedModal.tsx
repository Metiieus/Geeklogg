import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { MediaItem } from '../../App';
import { useAppContext } from '../../context/AppContext';
import { ModalWrapper } from '../ModalWrapper';

interface EditFeaturedModalProps {
  isOpen: boolean;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
}

export const EditFeaturedModal: React.FC<EditFeaturedModalProps> = ({
  isOpen,
  selectedIds,
  onSave,
  onClose,
}) => {
  const { mediaItems } = useAppContext();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setLocalSelected(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 6) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/20 flex flex-col max-h-[85vh] w-full">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Editar Destaques</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map(item => {
            const selected = localSelected.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`relative group rounded-xl overflow-hidden border transition-all ${selected ? 'ring-2 ring-purple-500 border-purple-400' : 'border-white/10 hover:border-white/20'}`}
              >
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700 text-white font-bold">
                    {item.title.charAt(0)}
                  </div>
                )}
                {selected && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/20 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white">Salvar</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditFeaturedModal;
