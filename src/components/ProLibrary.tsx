import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { RadiantMediaCard } from "./RadiantMediaCard"; // Componente estilizado de mídia

// Tipagem para os itens de mídia
interface MediaItem {
  id: string;
  title: string;
  cover?: string;
  category?: string;
  rating?: number;
}

// Props do ProLibrary
interface ProLibraryProps {
  featured?: MediaItem[];
  recent?: MediaItem[];
  topRated?: MediaItem[];
  collection?: MediaItem[];
}

// ==============================
// 📚 Biblioteca principal (ProLibrary)
// ==============================
const ProLibrary: React.FC<ProLibraryProps> = ({
  featured = [],
  recent = [],
  topRated = [],
  collection = [],
}) => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-12 bg-slate-950 text-white">
      {/* Cabeçalho */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-100">Minha Biblioteca</h1>
        <p className="text-slate-400">
          Seu espaço geek com estilo futurista ✨
        </p>
      </header>

      {/* Barra de busca */}
      <div className="relative max-w-md mb-10">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar mídia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800
                     text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <main className="space-y-12">
        {/* 📌 Seção Destaques */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-200">
              Destaques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <RadiantMediaCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* ⏰ Seção Recentes */}
        {recent.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-200">
              Recentes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recent.map((item) => (
                <RadiantMediaCard key={item.id} item={item} compact />
              ))}
            </div>
          </section>
        )}

        {/* ⭐ Seção Melhor Avaliado */}
        {topRated.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-200">
              Melhor Avaliado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRated.map((item) => (
                <RadiantMediaCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* 📚 Coleção completa */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-200">
            Coleção Completa
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {collection
              .filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <RadiantMediaCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// Export default (garante compatibilidade no import)
export default ProLibrary;
