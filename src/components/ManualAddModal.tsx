import React, { useState } from "react";
import { X } from "lucide-react";

interface ManualAddModalProps {
  onClose: () => void;
}

export const ManualAddModal: React.FC<ManualAddModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("➕ Nova mídia:", { title, type });
    // TODO: salvar no backend
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-white">
          Adicionar Mídia Manualmente
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
          >
            <option value="movie">Filme</option>
            <option value="game">Jogo</option>
            <option value="anime">Anime</option>
            <option value="tv">Série</option>
            <option value="book">Livro</option>
            <option value="manga">Mangá</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};
