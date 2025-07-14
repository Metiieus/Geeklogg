import React, { useState, useEffect } from "react";
import { Search, UserPlus, UserCheck, Users } from "lucide-react";
import {
  searchUsers,
  followUser,
  unfollowUser,
  isFollowing,
} from "../services/socialService";
import { UserProfile } from "../types/social";
import { TruncatedBio } from "./TruncatedBio";

interface UserSearchProps {
  onUserSelect: (user: UserProfile) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingStatus, setFollowingStatus] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (query.length < 2) {
      setUsers([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(query);
        setUsers(results);

        // Verificar status de seguir para cada usuário
        const statusMap: Record<string, boolean> = {};
        for (const user of results) {
          statusMap[user.uid] = await isFollowing(user.uid);
        }
        setFollowingStatus(statusMap);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleFollow = async (userId: string) => {
    try {
      if (followingStatus[userId]) {
        await unfollowUser(userId);
        setFollowingStatus((prev) => ({ ...prev, [userId]: false }));
      } else {
        await followUser(userId);
        setFollowingStatus((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.uid}
            className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
          >
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden"
              onClick={() => onUserSelect(user)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div
              className="flex-1 cursor-pointer"
              onClick={() => onUserSelect(user)}
            >
              <h3 className="text-white font-medium">{user.name}</h3>
              {user.bio && <p className="text-slate-400 text-sm">{user.bio}</p>}
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {user.followers?.length || 0} seguidores
                </span>
                <span>{user.following?.length || 0} seguindo</span>
              </div>
            </div>

            <button
              onClick={() => handleFollow(user.uid)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                followingStatus[user.uid]
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {followingStatus[user.uid] ? (
                <>
                  <UserCheck size={16} />
                  Seguindo
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Seguir
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {query.length >= 2 && users.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-400">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
};
