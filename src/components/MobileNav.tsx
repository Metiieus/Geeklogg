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
import { useAppContext } from "../context/AppContext";
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

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useAppContext();

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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300 ${
                activePage === item.id ? "scale-110" : "active:scale-95"
              }`}
            >
              {/* Container do ícone com efeito ativo */}
              <div
                className={`relative flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-xl transition-all duration-300 ${
                  activePage === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30"
                    : "active:bg-gray-800/50"
                }`}
              >
                <div
                  className={`${
                    activePage === item.id
                      ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                      : "text-gray-200"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Indicador ativo */}
                {activePage === item.id && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"></div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 font-medium transition-colors truncate max-w-full ${
                  activePage === item.id ? "text-white" : "text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
