import React from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const EditMediaPlaceholder: React.FC = () => {
  const { editingMediaItem, setEditingMediaItem, setActivePage } = useAppContext();

  const handleBack = () => {
    setEditingMediaItem(null);
    setActivePage('library');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Editar Mídia</h1>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        {editingMediaItem ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Edit className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{editingMediaItem.title}</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Editando: <span className="text-white font-medium">{editingMediaItem.title}</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">
              A funcionalidade de edição será implementada em breve. Por enquanto, você pode gerenciar suas mídias através da biblioteca.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Voltar para Biblioteca
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Edit className="text-slate-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum item selecionado
            </h3>
            <p className="text-slate-400 mb-6">
              Selecione um item da biblioteca para editá-lo.
            </p>
            <button
              onClick={() => setActivePage('library')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Ir para Biblioteca
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMediaPlaceholder;
