import React from 'react';
import { useState, useEffect } from 'react';
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
  Users
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
  { id: 'social', icon: <Users size={20} />, label: 'Social' },
  { id: 'profile', icon: <User size={20} />, label: 'Perfil' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Configurações' },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, settings } = useAppContext();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Simular contagem de notificações não lidas
  useEffect(() => {
    // Aqui você pode integrar com o serviço de notificações real
    const interval = setInterval(() => {
      // Exemplo: setUnreadCount(await getUnreadNotificationsCount());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
              transition-all duration-300 hover:scale-110 hover:rotate-3
              ${activePage === item.id 
                ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 text-pink-400 shadow-lg shadow-pink-500/20 animate-pulse' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:shadow-lg'
              }
            `}
            title={item.label}
          >
            {item.icon}
            
            {/* Notification badge for social tab */}
            {item.id === 'social' && unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
            
            {/* Active indicator */}
            {activePage === item.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-r-full animate-pulse" />
            )}
            
            {/* Tooltip */}
            <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 animate-slide-in-right">
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </button>
        ))}
      </nav>

      {/* User Avatar and Logout */}
      <div className="mt-auto flex flex-col items-center gap-4 animate-slide-up">
        {/* Notification Center */}
        <div className="relative">
          <button
            className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
            title="Notificações"
          >
            <MessageSquare size={18} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </button>
        </div>
        
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden hover:scale-110 transition-all duration-300 hover:shadow-lg">
          {settings.avatar ? (
            <img src={settings.avatar} alt={settings.name} className="w-full h-full object-cover" />
          ) : (
            settings.name.charAt(0).toUpperCase()
          )}
        </div>
        <button
          onClick={logout}
          title="Sair"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:animate-wiggle"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};