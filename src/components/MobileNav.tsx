import React from "react";
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
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

export const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showInfo } = useToast();

  const getActivePage = (pathname: string): string => {
    const path = pathname.split("/")[1] || "dashboard";
    return path;
  };
  const activePage = getActivePage(location.pathname);

  const handleNavigation = (item: NavItem) => {
    if (item.id === "social") {
      showInfo("Em breve", "A seção social estará disponível em breve! 🚀");
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Background com blur e gradiente */}
      <div className="bg-gray-900/95 backdrop-blur-xl border-t border-cyan-500/20">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-0 right-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
          {navItems.map((item) => {
            if (item.id === "social") {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300 opacity-50 cursor-not-allowed"
                >
                  <div className="relative p-1.5 rounded-lg transition-all duration-300 active:scale-95">
                    <div className="text-gray-400">{item.icon}</div>
                  </div>
                  <span className="text-[10px] font-medium mt-1 truncate max-w-full transition-colors text-gray-500">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300 ${activePage === item.id ? "scale-110" : "active:scale-95"
                  }`}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-all duration-300 ${activePage === item.id
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg shadow-cyan-500/25`
                      : ""
                    }`}
                >
                  <div
                    className={`${activePage === item.id ? "text-white" : "text-gray-400"
                      }`}
                  >
                    {item.icon}
                  </div>
                  {activePage === item.id && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-white/5 pointer-events-none"></div>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium mt-1 truncate max-w-full transition-colors ${activePage === item.id ? "text-white" : "text-gray-400"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
