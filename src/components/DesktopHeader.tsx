import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, LogOut, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { ConditionalPremiumBadge } from "./PremiumBadge";

interface DesktopHeaderProps {
  pageName: string;
  pageIcon: React.ReactNode;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ pageName, pageIcon }) => {
  const { user, profile, logout } = useAuth();
  const { setActivePage } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMenuAction = (action: string) => {
    setShowUserMenu(false);
    
    switch (action) {
      case 'profile':
        setActivePage('profile');
        break;
      case 'settings':
        setActivePage('settings');
        break;
      case 'logout':
        logout();
        break;
    }
  };

  const displayName = profile?.name || profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Usuário";
  const displayAvatar = profile?.avatar || profile?.profileImage;

  return (
    <header className="hidden md:flex fixed top-0 right-0 left-20 z-30 h-16 backdrop-blur-xl border-b border-white/10 bg-slate-900/95">
      <div className="flex items-center justify-between w-full px-6">
        {/* Título da página atual */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30">
            <div className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              {pageIcon}
            </div>
          </div>
          <h1 className="text-xl font-semibold text-white">{pageName}</h1>
        </div>

        {/* Menu do usuário */}
        <div className="flex items-center gap-4">
          {/* Avatar do usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium hidden lg:block">
                  {displayName}
                </span>
                {profile?.isPremium && (
                  <Crown size={16} className="text-yellow-400 hidden lg:block" />
                )}
              </div>
              
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback se a imagem falhar ao carregar
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.setAttribute('style', 'display: flex');
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-white text-xs font-bold flex items-center justify-center w-full h-full"
                    style={{ display: displayAvatar ? 'none' : 'flex' }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <ConditionalPremiumBadge
                  isPremium={profile?.isPremium || false}
                  variant="avatar"
                  size="sm"
                  animated={true}
                />
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 rounded-xl border border-white/20 shadow-xl animate-slide-down">
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        {displayAvatar ? (
                          <img
                            src={displayAvatar}
                            alt={displayName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{displayName}</p>
                      <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {profile?.isPremium ? "Premium" : "Básico"}
                        </span>
                        {profile?.isPremium && (
                          <Crown size={12} className="text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => handleMenuAction('profile')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-sm">Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => handleMenuAction('settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings size={16} />
                    <span className="text-sm">Configurações</span>
                  </button>

                  <div className="border-t border-white/10 my-2"></div>

                  <button
                    onClick={() => handleMenuAction('logout')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
