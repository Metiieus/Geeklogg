import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  User,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { ActivePage } from "../App";

interface NavItem {
  id: ActivePage;
  icon: React.ReactNode;
  label: string;
  gradient: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: <Home size={20} />,
    label: "Home",
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
    label: "Reviews",
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
  {
    id: "profile",
    icon: <User size={20} />,
    label: "Perfil",
    gradient: "from-cyan-400 to-pink-500",
  },
];

export const MobileSidebar: React.FC = () => {
  const { activePage, setActivePage } = useAppContext();
  const { logout, user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [activePage]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getCurrentPageInfo = () => {
    return navItems.find(item => item.id === activePage) || navItems[0];
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="safe-area-inset-top flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 transition-all duration-300 active:scale-95"
          >
            <Menu size={20} className="text-white" />
          </button>

          {/* Current Page Indicator */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCurrentPageInfo().gradient} bg-opacity-20`}>
              <div className={`bg-gradient-to-r ${getCurrentPageInfo().gradient} bg-clip-text text-transparent`}>
                {getCurrentPageInfo().icon}
              </div>
            </div>
            <span className="text-white font-semibold text-lg">
              {getCurrentPageInfo().label}
            </span>
          </div>

          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {profile?.name?.charAt(0) || user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sm:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-r border-cyan-500/20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-40 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="safe-area-inset-top px-6 py-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  GeekLog
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {profile?.name?.charAt(0) || user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">
                    {profile?.name || user?.displayName || user?.email?.split("@")[0] || "Usuário"}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {profile?.isPremium ? "Premium" : "Básico"} • {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                    activePage === item.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 transform scale-105"
                      : "hover:bg-gray-800/50 active:scale-95"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activePage === item.id
                        ? `bg-gradient-to-r ${item.gradient} bg-opacity-20`
                        : "bg-gray-700/50"
                    }`}
                  >
                    <div
                      className={`${
                        activePage === item.id
                          ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                          : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <span
                    className={`font-medium ${
                      activePage === item.id ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                  {activePage === item.id && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-4 border-t border-gray-700/50 space-y-1 safe-area-inset-bottom">
              <button
                onClick={() => setActivePage("settings")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-gray-800/50 active:scale-95"
              >
                <div className="p-2 rounded-lg bg-gray-700/50">
                  <Settings size={20} className="text-gray-400" />
                </div>
                <span className="font-medium text-gray-300">Configurações</span>
              </button>

              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 active:scale-95 border border-red-500/20"
              >
                <div className="p-2 rounded-lg bg-red-500/20">
                  <LogOut size={20} className="text-red-400" />
                </div>
                <span className="font-medium text-red-400">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for top bar */}
      <div className="sm:hidden h-16"></div>
    </>
  );
};
