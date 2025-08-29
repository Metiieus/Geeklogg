import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MediaSearchBar } from '../MediaSearchBar';
import { MediaType } from '../../App';
import { ExternalMediaResult } from '../../services/externalMediaService';
import { ModalWrapper } from '../ModalWrapper';

interface AddMediaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (result: ExternalMediaResult) => void;
}

export const AddMediaSearchModal: React.FC<AddMediaSearchModalProps> = ({
  isOpen,
  onClose,
  onResultSelect,
}) => {
  const [selectedType, setSelectedType] = useState<MediaType>('books');

  const handleResultSelect = (result: ExternalMediaResult) => {
    onResultSelect(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      className="modal-search"
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 w-full flex flex-col max-h-[85vh] min-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-6 border-b border-white/20 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Buscar Mídia Online
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 hidden sm:block">
                Encontre livros, filmes, séries e games em bases de dados online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 transition-colors flex-shrink-0 touch-target"
            type="button"
          >
            <X size={18} className="sm:w-5 sm:h-5 text-white" />
          </button>
        </div>

        {/* Search Content */}
        <div className="flex-1 pt-16 px-6 pb-48 mb-14 overflow-y-visible min-h-0 relative">
          <div className="max-w-3xl mx-auto">
            <MediaSearchBar
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onResultSelect={handleResultSelect}
              placeholder={`Buscar ${
                selectedType === 'books' ? 'livros' :
                selectedType === 'movies' ? 'filmes' :
                selectedType === 'games' ? 'jogos' :
                selectedType === 'series' ? 'séries' : 'mídia'
              }...`}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddMediaSearchModal;
