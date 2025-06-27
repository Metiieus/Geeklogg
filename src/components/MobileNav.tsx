import React from 'react';
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ActivePage } from '../App';

interface NavItem {
  id: ActivePage;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
  { id: 'library', icon: <BookOpen size={20} />, label: 'Biblioteca' },
  { id: 'reviews', icon: <MessageSquare size={20} />, label: 'Resenhas' },
  { id: 'timeline', icon: <Clock size={20} />, label: 'Jornada' },
  { id: 'statistics', icon: <BarChart3 size={20} />, label: 'Estat\u00edsticas' },
  { id: 'profile', icon: <User size={20} />, label: 'Perfil' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Configura\u00e7\u00f5es' }
];

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useAppContext();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 flex justify-around items-center z-50">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          className={`flex flex-col items-center text-xs gap-1 ${activePage === item.id ? 'text-pink-400' : 'text-slate-400 hover:text-white'}`}
        >
          {item.icon}
          <span className="text-[10px] leading-none">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
