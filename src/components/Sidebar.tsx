import React from 'react';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Clock, 
  BarChart3,
  Settings,
  LogOut,
  User,
  Gamepad2,
  Film,
  Tv,
  Book,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage } from '../App';

interface NavItem {
  id: ActivePage;
  icon: React.ReactNode;
  label: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
  { id: 'library', icon: <BookOpen size={20} />, label: 'Biblioteca' },
  { id: 'reviews', icon: <MessageSquare size={20} />, label: 'Resenhas' },
  { id: 'timeline', icon: <Clock size={20} />, label: 'Jornada' },
  { id: 'statistics', icon: <BarChart3 size={20} />, label: 'Estatísticas' },
  { id: 'profile', icon: <User size={20} />, label: 'Perfil' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Configurações' },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, settings } = useAppContext();
  const { logout } = useAuth();

  return (
    <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-20 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8 p-2">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`
              group relative w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-200 hover:scale-105
              ${activePage === item.id 
                ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 text-pink-400 shadow-lg shadow-pink-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }
            `}
            title={item.label}
          >
            {item.icon}
            
            {/* Active indicator */}
            {activePage === item.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-r-full" />
            )}
            
            {/* Tooltip */}
            <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </button>
        ))}
      </nav>

      {/* User Avatar and Logout */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden">
          {settings.avatar ? (
            <img src={settings.avatar} alt={settings.name} className="w-full h-full object-cover" />
          ) : (
            settings.name.charAt(0).toUpperCase()
          )}
        </div>
        <button
          onClick={logout}
          title="Sair"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};