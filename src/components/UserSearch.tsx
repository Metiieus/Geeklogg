import React, { useState } from "react";
import { Search, Users, Plus } from "lucide-react";
import { searchUsers, followUser } from "../services/socialService";
import { UserProfile } from "../types/social";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface UserSearchProps {
  onUserSelect: (user: UserProfile) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      // Filtrar o próprio usuário dos resultados
      const filteredResults = results.filter(result => result.uid !== user?.uid);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Erro na busca:", error);
      showError("Erro na busca", "Não foi possível buscar usuários");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (targetUser: UserProfile) => {
    try {
      await followUser(targetUser.uid);
      showSuccess("Seguindo", `Agora você segue ${targetUser.displayName}`);
      
      // Atualizar o resultado local
      setSearchResults(prev => 
        prev.map(result => 
          result.uid === targetUser.uid 
            ? { ...result, isFollowing: true }
            : result
        )
      );
    } catch (error) {
      console.error("Erro ao seguir:", error);
      showError("Erro", "Não foi possível seguir o usuário");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuários por nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Resultados da Busca</h3>
          <div className="space-y-3">
            {searchResults.map((searchUser) => (
              <div
                key={searchUser.uid}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600/50"
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => onUserSelect(searchUser)}
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{searchUser.displayName}</p>
                    <p className="text-sm text-slate-400">{searchUser.email}</p>
                  </div>
                </div>
                
                {!searchUser.isFollowing && (
                  <button
                    onClick={() => handleFollow(searchUser)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Seguir
                  </button>
                )}
                
                {searchUser.isFollowing && (
                  <span className="text-green-400 text-sm">Seguindo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="text-center py-8">
          <Users className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-400">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
};
