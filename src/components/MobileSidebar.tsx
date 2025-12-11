import React, { useState, useEffect, memo, useCallback } from "react";
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
import LanguageSwitcher from "./LanguageSwitcher";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useSettings } from "../hooks/queries";
import { ActivePage } from "../types";

interface NavItem {
  id: ActivePage;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: <Home size={20} />,
    label: "Home",
    gradient: "from-cyan-400 to-blue-500",
    path: "/dashboard",
  },
  {
    id: "library",
    icon: <BookOpen size={20} />,
    label: "Biblioteca",
    gradient: "from-pink-400 to-purple-500",
    path: "/library",
  },
  {
    id: "reviews",
    icon: <MessageSquare size={20} />,
    label: "Reviews",
    gradient: "from-purple-400 to-indigo-500",
    path: "/reviews",
  },
  {
    id: "timeline",
    icon: <Clock size={20} />,
    label: "Jornada",
    gradient: "from-indigo-400 to-cyan-500",
    path: "/timeline",
  },
  {
    id: "statistics",
    icon: <BarChart3 size={20} />,
    label: "Estatísticas",
    gradient: "from-cyan-400 to-pink-500",
    path: "/statistics",
  },
  {
    id: "social",
    icon: <Users size={20} />,
    label: "Social",
    gradient: "from-pink-400 to-purple-500",
    path: "/social",
  },
  {
    id: "profile",
    icon: <User size={20} />,
    label: "Perfil",
    gradient: "from-cyan-400 to-pink-500",
    path: "/profile",
  },
];

const MobileSidebar: React.FC = () => {
  const { logout, user, profile } = useAuth();
  const { data: settings } = useSettings(user?.uid);
  const { showInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getActivePage = (pathname: string): string => {
    const path = pathname.split("/")[1] || "dashboard";
    return path;
  };
  const activePage = getActivePage(location.pathname);

  const handleNavigation = useCallback(
    (item: NavItem) => {
      if (item.id === "social") {
        showInfo("Em breve", "A seção social estará disponível em breve! 🚀");
        return;
      }
      navigate(item.path);
    },
    [showInfo, navigate],
  );

  // Close sidebar when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
    return (
      navItems.find((item) => item.id === activePage) ||
      navItems.find((item) => item.id === "dashboard") ||
      navItems[0]
    );
  };

  const currentPage = getCurrentPageInfo();

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-white/10"
        style={{ backgroundColor: "rgba(17, 24, 39, 0.95)" }}
      >
        <div className="safe-area-inset-top flex items-center justify-between px-3 py-3">
          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 transition-all duration-300 active:scale-95 touch-target"
          >
            <Menu size={20} className="text-white" />
          </button>

          {/* Current Page Indicator */}
          <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
            <div
              className={`relative p-2 rounded-lg bg-gradient-to-r ${currentPage.gradient} shadow-lg transition-all duration-300 flex-shrink-0`}
            >
              <div className="text-white">{currentPage.icon}</div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-white/5 pointer-events-none"></div>
            </div>
            <span className="text-white font-semibold text-lg truncate">
              {currentPage.label}
            </span>
          </div>

          {/* Profile Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              {profile?.avatar || profile?.profileImage || settings?.avatar ? (
                <img
                  src={
                    profile?.avatar || profile?.profileImage || settings?.avatar
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Fallback se a imagem falhar ao carregar
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.setAttribute(
                      "style",
                      "display: flex",
                    );
                  }}
                />
              ) : null}
              <span
                className="text-white font-semibold text-sm flex items-center justify-center w-full h-full"
                style={{
                  display:
                    profile?.avatar || profile?.profileImage || settings?.avatar
                      ? "none"
                      : "flex",
                }}
              >
                {profile?.name?.charAt(0) ||
                  user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in will-change-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sm:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div
          className="h-full border-r border-white/10 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)",
          }}
        >
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
                <div className="flex items-center gap-2">
                  <div className="block lg:hidden">
                    <LanguageSwitcher />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {profile?.avatar ||
                      profile?.profileImage ||
                      settings?.avatar ? (
                      <img
                        src={
                          profile?.avatar ||
                          profile?.profileImage ||
                          settings?.avatar
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.setAttribute(
                            "style",
                            "display: flex",
                          );
                        }}
                      />
                    ) : null}
                    <span
                      className="text-white font-semibold flex items-center justify-center w-full h-full"
                      style={{
                        display:
                          profile?.avatar ||
                            profile?.profileImage ||
                            settings?.avatar
                            ? "none"
                            : "flex",
                      }}
                    >
                      {profile?.name?.charAt(0) ||
                        user?.displayName?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">
                    {settings?.name ||
                      profile?.name ||
                      user?.displayName ||
                      user?.email?.split("@")[0] ||
                      "Usuário"}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {profile?.isPremium ? "Premium" : "Básico"} • {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                if (item.id === "social") {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 opacity-50 cursor-not-allowed hover:bg-gray-800/30`}
                    >
                      <div
                        className={`relative p-2 rounded-lg transition-all duration-300 bg-gray-700/50`}
                      >
                        <div className="text-gray-400">{item.icon}</div>
                      </div>
                      <span className="font-medium transition-colors duration-300 text-gray-400">
                        {item.label}
                        <span className="ml-1 text-xs text-purple-400">
                          Em breve
                        </span>
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${activePage === item.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 transform scale-105 shadow-lg"
                        : "hover:bg-gray-800/50 active:scale-95"
                      }`}
                  >
                    <div
                      className={`relative p-2 rounded-lg transition-all duration-300 ${activePage === item.id
                        ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                        : "bg-gray-700/50"
                        }`}
                    >
                      <div
                        className={`transition-colors duration-300 ${activePage === item.id ? "text-white" : "text-gray-400"
                          }`}
                      >
                        {item.icon}
                      </div>
                      {activePage === item.id && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-white/5 pointer-events-none"></div>
                      )}
                    </div>
                    <span
                      className={`font-medium transition-colors duration-300 ${activePage === item.id
                        ? "text-white"
                        : "text-gray-300"
                        }`}
                    >
                      {item.label}
                    </span>
                    {activePage === item.id && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-4 border-t border-gray-700/50 space-y-1 safe-area-inset-bottom">
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-gray-800/50 active:scale-95"
              >
                <div className="relative p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-300">
                  <Settings
                    size={20}
                    className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                  />
                </div>
                <span className="font-medium text-gray-300 hover:text-white transition-colors duration-300">
                  Configurações
                </span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 active:scale-95 border border-red-500/20 hover:border-red-500/40 group"
              >
                <div className="relative p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-all duration-300">
                  <LogOut
                    size={20}
                    className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
                  />
                </div>
                <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors duration-300">
                  Sair
                </span>
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

const MemoizedMobileSidebar = memo(MobileSidebar);
MemoizedMobileSidebar.displayName = "MobileSidebar";

export { MemoizedMobileSidebar as MobileSidebar };
