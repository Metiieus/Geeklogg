import React from "react";
import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  User,
  Sparkles,
  Users,
  Crown,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ActivePage } from "../App";
import { ConditionalPremiumBadge } from "./PremiumBadge";

interface NavItem {
  id: ActivePage;
  icon: React.ReactNode;
  label: string;
  gradient?: string;
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    icon: <Home size={20} />,
    label: "Dashboard",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "library",
    icon: <BookOpen size={20} />,
    label: "Biblioteca",
    gradient: "from-pink-400 to-purple-500",
  },
  {
    id: "reviews",
    icon: <MessageSquare size={20} />,
    label: "Resenhas",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    id: "timeline",
    icon: <Clock size={20} />,
    label: "Jornada",
    gradient: "from-indigo-400 to-cyan-500",
  },
  {
    id: "statistics",
    icon: <BarChart3 size={20} />,
    label: "Estatísticas",
    gradient: "from-cyan-400 to-pink-500",
  },
  {
    id: "social",
    icon: <Users size={20} />,
    label: "Social",
    gradient: "from-pink-400 to-purple-500",
  },
];

const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useAppContext();
  const { logout, profile } = useAuth();
  const { showInfo } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const isPremium = profile?.isPremium || false;

  const handleNavigation = (itemId: ActivePage) => {
    if (itemId === "social") {
      showInfo("Em breve", "A seção social estará disponível em breve! 🚀");
      return;
    }
    setActivePage(itemId);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden sm:flex fixed left-0 top-0 h-full backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
          isExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 -left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 -left-5 w-16 h-16 bg-purple-500/20 rotate-45"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 mt-2">
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7f1b9e9c1d27434ebacaa7f16ca51525%2Fa7818e35c5d54df9ba951473e49bd460?format=webp&width=80"
                alt="GeekLog"
                className="w-12 sm:w-16 h-12 sm:h-16 object-contain object-cover"
              />
              <ConditionalPremiumBadge
                isPremium={isPremium}
                variant="avatar"
                size="sm"
                animated={true}
              />
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
                  GeekLog
                </h1>
                {isPremium && (
                  <p className="text-xs text-purple-400 whitespace-nowrap">
                    Premium
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`group relative w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                  item.id === "social"
                    ? "opacity-50 cursor-not-allowed hover:bg-gray-800/30 border border-transparent"
                    : activePage === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30"
                    : "hover:bg-gray-800/50 border border-transparent"
                }`}
              >
                {/* Icon com gradiente ativo */}
                <div
                  className={`flex items-center justify-center w-6 h-6 ${
                    activePage === item.id
                      ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                      : "text-gray-200 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>

                {isExpanded && (
                  <span
                    className={`ml-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      item.id === "social"
                        ? "text-gray-400"
                        : activePage === item.id
                        ? "text-white"
                        : "text-gray-200 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                    {item.id === "social" && (
                      <span className="ml-1 text-xs text-purple-400">Em breve</span>
                    )}
                  </span>
                )}

                {/* Indicador ativo */}
                {activePage === item.id && (
                  <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-pink-500 rounded-l-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-800">
            <button
              onClick={() => setActivePage("profile")}
              className={`group relative w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                activePage === "profile"
                  ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30"
                  : "hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 ${
                  activePage === "profile"
                    ? "text-purple-400"
                    : "text-gray-200 group-hover:text-white"
                }`}
              >
                <User size={20} />
              </div>
              {isExpanded && (
                <span
                  className={`ml-3 text-sm font-medium whitespace-nowrap ${
                    activePage === "profile"
                      ? "text-white"
                      : "text-gray-200 group-hover:text-white"
                  }`}
                >
                  Perfil
                </span>
              )}
            </button>

            <button
              onClick={() => setActivePage("settings")}
              className={`group relative w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                activePage === "settings"
                  ? "bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30"
                  : "hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 ${
                  activePage === "settings"
                    ? "text-gray-300"
                    : "text-gray-200 group-hover:text-white"
                }`}
              >
                <Settings size={20} />
              </div>
              {isExpanded && (
                <span
                  className={`ml-3 text-sm font-medium whitespace-nowrap ${
                    activePage === "settings"
                      ? "text-white"
                      : "text-gray-200 group-hover:text-white"
                  }`}
                >
                  Configurações
                </span>
              )}
            </button>

            {/* Perfil do usuário */}
            <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name || "Usuário"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">
                        {(profile?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {profile?.name || "Usuário"}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {profile?.isPremium ? "Premium" : "Básico"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="group w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/30"
            >
              <div className="flex items-center justify-center w-6 h-6 text-gray-200 group-hover:text-red-400">
                <LogOut size={20} />
              </div>
              {isExpanded && (
                <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-red-400 whitespace-nowrap">
                  Sair
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
