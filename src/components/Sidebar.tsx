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
import { ActivePage } from "../App";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const isPremium = profile?.isPremium || false;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden sm:flex fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-cyan-500/20 transition-all duration-300 z-40 ${
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
          <div className="flex items-center justify-center mb-8 mt-2">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {isPremium && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
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
                onClick={() => setActivePage(item.id)}
                className={`group relative w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                  activePage === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30"
                    : "hover:bg-gray-800/50 border border-transparent"
                }`}
              >
                {/* Icon com gradiente ativo */}
                <div
                  className={`flex items-center justify-center w-6 h-6 ${
                    activePage === item.id
                      ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>

                {isExpanded && (
                  <span
                    className={`ml-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      activePage === item.id
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {item.label}
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
                    : "text-gray-400 group-hover:text-white"
                }`}
              >
                <User size={20} />
              </div>
              {isExpanded && (
                <span
                  className={`ml-3 text-sm font-medium whitespace-nowrap ${
                    activePage === "profile"
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
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
                    : "text-gray-400 group-hover:text-white"
                }`}
              >
                <Settings size={20} />
              </div>
              {isExpanded && (
                <span
                  className={`ml-3 text-sm font-medium whitespace-nowrap ${
                    activePage === "settings"
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  Configurações
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="group w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/30"
            >
              <div className="flex items-center justify-center w-6 h-6 text-gray-400 group-hover:text-red-400">
                <LogOut size={20} />
              </div>
              {isExpanded && (
                <span className="ml-3 text-sm font-medium text-gray-400 group-hover:text-red-400 whitespace-nowrap">
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
