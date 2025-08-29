import React, { useMemo, useState } from 'react';
import { DesktopHeader } from './components/DesktopHeader';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import Dashboard from './components/Dashboard';
import ModernLibrary from './components/ModernLibrary';
import Reviews from './components/Reviews';
import Timeline from './components/Timeline';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import AccountDeletion from './components/AccountDeletion';
import Profile from './components/Profile';
import AddMediaPage from './components/AddMediaPage';
import EditMediaPlaceholder from './components/EditMediaPlaceholder';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AppProvider } from './context/AppContext';
import { useOptimizedContext } from './hooks/useOptimizedContext';
import { useAuth } from './context/AuthContext';
import { Home, BookOpen, MessageSquare, Clock, BarChart3, Settings as SettingsIcon, Users, User } from 'lucide-react';

export type MediaType = 'games' | 'anime' | 'series' | 'books' | 'movies';
export type Status = 'completed' | 'in-progress' | 'dropped' | 'planned';
export type ActivePage =
  | 'dashboard'
  | 'library'
  | 'reviews'
  | 'timeline'
  | 'statistics'
  | 'social'
  | 'settings'
  | 'privacy-policy'
  | 'account-deletion'
  | 'add-media'
  | 'edit-media'
  | 'profile';

export interface MediaItem {
  id: string;
  title: string;
  cover?: string;
  platform?: string;
  status: Status;
  rating?: number;
  hoursSpent?: number;
  totalPages?: number;
  currentPage?: number;
  startDate?: string;
  endDate?: string;
  tags: string[];
  externalLink?: string;
  type: MediaType;
  description?: string;
  isFeatured?: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  mediaId: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  image?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string; // ISO or YYYY-MM-DD
  icon: string;
  mediaId?: string;
}

export interface FavoriteItem {
  id: string;
  name: string;
  image?: string;
}

export interface UserSettings {
  name: string;
  bio: string;
  avatar: string;
  cover: string;
  defaultLibrarySort: 'updatedAt' | 'title' | 'rating' | 'hoursSpent';
  favorites: {
    characters: FavoriteItem[];
    games: FavoriteItem[];
    movies: FavoriteItem[];
  };
}

const defaultSettings: UserSettings = {
  name: '',
  bio: '',
  avatar: '',
  cover: '',
  defaultLibrarySort: 'updatedAt',
  favorites: {
    characters: [],
    games: [],
    movies: [],
  },
};

// Componente principal da aplicaç��o autenticada
const AuthenticatedApp: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(null);

  const contextValue = useOptimizedContext({
    mediaItems,
    setMediaItems,
    reviews,
    setReviews,
    milestones,
    setMilestones,
    settings,
    setSettings,
    activePage,
    setActivePage,
    selectedUser,
    setSelectedUser,
    editingMediaItem,
    setEditingMediaItem,
  });

  const PageComponent = useMemo(() => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'library':
        return <ModernLibrary />;
      case 'reviews':
        return <Reviews />;
      case 'timeline':
        return <Timeline />;
      case 'settings':
        return <Settings />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'account-deletion':
        return <AccountDeletion />;
      case 'add-media':
        return <AddMediaPage />;
      case 'edit-media':
        return <EditMediaPageWrapper />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  }, [activePage]);

  const pageMeta = useMemo(() => {
    const map: Record<ActivePage, { name: string; icon: React.ReactNode }> = {
      'dashboard': { name: 'Dashboard', icon: <Home size={16} /> },
      'library': { name: 'Biblioteca', icon: <BookOpen size={16} /> },
      'reviews': { name: 'Resenhas', icon: <MessageSquare size={16} /> },
      'timeline': { name: 'Jornada', icon: <Clock size={16} /> },
      'statistics': { name: 'Estatísticas', icon: <BarChart3 size={16} /> },
      'social': { name: 'Social', icon: <Users size={16} /> },
      'settings': { name: 'Configurações', icon: <SettingsIcon size={16} /> },
      'privacy-policy': { name: 'Privacidade', icon: <SettingsIcon size={16} /> },
      'account-deletion': { name: 'Excluir Conta', icon: <SettingsIcon size={16} /> },
      'add-media': { name: 'Adicionar Mídia', icon: <BookOpen size={16} /> },
      'edit-media': { name: 'Editar Mídia', icon: <BookOpen size={16} /> },
      'profile': { name: 'Perfil', icon: <User size={16} /> },
    };
    return map[activePage] || map['dashboard'];
  }, [activePage]);

  return (
    <AppProvider value={contextValue}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="md:ml-20 xl:ml-64">
          <DesktopHeader pageName={pageMeta.name} pageIcon={pageMeta.icon} />
          <main className="px-4 sm:px-6 md:px-8 py-6 pt-20 md:pt-6">
            {PageComponent}
          </main>
        </div>
        <MobileNav />
      </div>
    </AppProvider>
  );
};

// Componente principal que gerencia autenticação
const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando GeekLog...</p>
        </div>
      </div>
    );
  }

  // Show login modal
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Login 
          onCancel={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </div>
    );
  }

  // Show register modal
  if (showRegister) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Register 
          onCancel={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  // User is authenticated - show main app
  if (user) {
    return <AuthenticatedApp />;
  }

  // User is not authenticated - show landing page
  return (
    <LandingPage
      onLogin={() => setShowLogin(true)}
      onRegister={() => setShowRegister(true)}
    />
  );
};

export default App;
