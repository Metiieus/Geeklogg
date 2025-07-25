import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Library, BarChart3, User, Settings, Search, Plus, 
  Gamepad2, BookOpen, Film, Play, TrendingUp, Award, Bell,
  Heart, Star, Clock, Calendar, Filter, Download, Share
} from 'lucide-react';
import { colors, glassmorphism, shadows, animations } from '../tokens';

// ============= GLASS ICON CARD =============

interface GlassIconCardProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'small' | 'large';
  showTooltip?: boolean;
  badge?: number;
  className?: string;
}

export const GlassIconCard: React.FC<GlassIconCardProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  variant = 'default',
  showTooltip = true,
  badge,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  const iconSizes = {
    small: 18,
    default: 22,
    large: 26,
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        className={`
          relative ${sizeClasses[variant]} rounded-2xl overflow-hidden
          ${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}
          flex items-center justify-center group cursor-pointer
          transition-all duration-300 ease-out
          ${isActive ? 'ring-2 ring-cyan-400/50' : ''}
        `}
        style={{
          boxShadow: isHovered || isActive 
            ? shadows.glow.cyan
            : shadows.md,
        }}
      >
        {/* Background Glow */}
        <motion.div
          animate={{
            opacity: isActive ? 0.3 : isHovered ? 0.2 : 0,
            scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-violet-400/20 rounded-2xl"
        />

        {/* Icon */}
        <motion.div
          animate={{
            color: isActive ? colors.primary.cyan : isHovered ? colors.text.primary : colors.text.secondary,
            scale: isActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {React.cloneElement(icon as React.ReactElement, { 
            size: iconSizes[variant]
          })}
        </motion.div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"
          />
        )}

        {/* Badge */}
        {badge && badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900"
          >
            <span className="text-white text-xs font-bold">
              {badge > 99 ? '99+' : badge}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          >
            <div className={`
              px-3 py-2 ${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}
              rounded-lg shadow-xl
            `}>
              <span className="text-white text-sm font-medium whitespace-nowrap">
                {label}
              </span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-white/10 rotate-45 border-r border-b border-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============= GLASS NAVIGATION BAR =============

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface GlassNavigationProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const GlassNavigation: React.FC<GlassNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}
        rounded-2xl p-4 ${glassmorphism.shadow}
        ${orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-4'}
        ${className}
      `}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassIconCard
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => onItemClick?.(item.id)}
            badge={item.badge}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============= GLASS ACTION BUTTON =============

interface GlassActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'default' | 'large';
  isLoading?: boolean;
  className?: string;
}

export const GlassActionButton: React.FC<GlassActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    primary: 'from-violet-500/30 to-cyan-500/30 border-violet-400/50',
    secondary: 'from-white/5 to-white/10 border-white/20',
    success: 'from-emerald-500/30 to-green-500/30 border-emerald-400/50',
    danger: 'from-red-500/30 to-pink-500/30 border-red-400/50',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm gap-2',
    default: 'px-6 py-3 text-base gap-3',
    large: 'px-8 py-4 text-lg gap-4',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center rounded-2xl
        ${glassmorphism.backdrop} bg-gradient-to-r ${variantClasses[variant]}
        border transition-all duration-300 ease-out font-medium text-white
        ${sizeClasses[size]} ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      style={{
        boxShadow: isHovered 
          ? variant === 'primary' ? shadows.glow.violet : shadows.xl
          : shadows.lg,
      }}
    >
      {/* Background Glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${variantClasses[variant]}`}
      />

      {/* Loading Spinner */}
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
        </motion.div>
      ) : (
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {icon}
        </motion.div>
      )}

      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};

// ============= PREDEFINED NAVIGATION SETS =============

export const mainNavigationItems: NavItem[] = [
  { id: 'dashboard', icon: <Home />, label: 'Dashboard' },
  { id: 'library', icon: <Library />, label: 'Biblioteca' },
  { id: 'statistics', icon: <BarChart3 />, label: 'Estatísticas' },
  { id: 'profile', icon: <User />, label: 'Perfil' },
  { id: 'settings', icon: <Settings />, label: 'Configurações' },
];

export const mediaTypeItems: NavItem[] = [
  { id: 'games', icon: <Gamepad2 />, label: 'Jogos' },
  { id: 'anime', icon: <Play />, label: 'Anime' },
  { id: 'series', icon: <Film />, label: 'Séries' },
  { id: 'books', icon: <BookOpen />, label: 'Livros' },
  { id: 'movies', icon: <Film />, label: 'Filmes' },
];

export const actionItems: NavItem[] = [
  { id: 'search', icon: <Search />, label: 'Buscar' },
  { id: 'add', icon: <Plus />, label: 'Adicionar' },
  { id: 'favorites', icon: <Heart />, label: 'Favoritos' },
  { id: 'notifications', icon: <Bell />, label: 'Notificações', badge: 3 },
];

export default GlassIconCard;
