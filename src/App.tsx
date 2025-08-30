import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  User,
  Plus,
  Users,
  Crown,
  Search,
  Star,
  Calendar,
  Trophy,
  Edit3,
} from 'lucide-react';

// Context Providers
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

// Components
import { Sidebar } from './components/Sidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { MobileNav } from './components/MobileNav';
import Dashboard from './components/Dashboard';
import ModernLibrary from './components/ModernLibrary';
import Reviews from './components/Reviews';
import Timeline from './components/Timeline';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { AddMediaPage } from './components/AddMediaPage';
import { EditMediaPlaceholder } from './components/EditMediaPlaceholder';
import { UserProfileView } from './components/UserProfileView';

// Services
import { getSettings, saveSettings } from './services/settingsService';
import { getMedias } from './services/mediaService';
import { getReviews } from './services/reviewService';
import { getMilestones } from './services/milestoneService';

// Types
export type MediaType = 'game' | 'movie' | 'tv' | 'book' | 'anime' | 'manga';
export type Status = 'completed' | 'in-progress' | 'dropped' | 'planned';
export type ActivePage = 
  | 'dashboard' 
  | 'library' 
  | 'reviews' 
  | 'timeline' 
  | 'statistics' 
  | 'social' 
  | 'settings' 
  | 'profile' 
  | 'add-media' 
  | 'edit-media' 
  | 'user-profile';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: Status;
  rating?: number;
  notes?: string;
  startDate?: string;
  endDate?: string;
  hoursSpent?: number;
  cover?: string;
  genres?: string[];
  platforms?: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  tags?: string[];
  externalId?: string;
}

export interface Review {
  id: string;
  mediaId: string;
  title: string;
  content: string;
  rating: number;
  spoilers: boolean;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  isPublic?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  type: 'achievement' | 'goal' | 'event';
  mediaId?: string;
  data?: any;
}

export interface UserSettings {
  name: string;
  avatar?: string;
  bio?: string;
  favoriteGenres: string[];
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
  notifications: {
    achievements: boolean;
    social: boolean;
    reminders: boolean;
  };
  privacy: {
    profilePublic: boolean;
    reviewsPublic: boolean;
    statsPublic: boolean;
  };
}

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  isPremium?: boolean;
  bio?: string;
  favoriteGenres?: string[];
  profileImage?: string;
}

const defaultSettings: UserSettings = {
  name: '',
  bio: '',
  favoriteGenres: [],
  theme: 'dark',
  language: 'pt',
  notifications: {
    achievements: true,
    social: true,
    reminders: true,
  },
  privacy: {
    profilePublic: false,
    reviewsPublic: false,
    statsPublic: false,
  },
};

// Page metadata for navigation
const pageMetadata = {
  dashboard: { name: 'Dashboard', icon: <Home size={20} /> },
  library: { name: 'Biblioteca', icon: <BookOpen size={20} /> },
  reviews: { name: 'Resenhas', icon: <MessageSquare size={20} /> },
  timeline: { name: 'Jornada', icon: <Clock size={20} /> },
  statistics: { name: 'Estatísticas', icon: <BarChart3 size={20} /> },
  social: { name: 'Social', icon: <Users size={20} /> },
  settings: { name: 'Configurações', icon: <Settings size={20} /> },
  profile: { name: 'Perfil', icon: <User size={20} /> },
  'add-media': { name: 'Adicionar Mídia', icon: <Plus size={20} /> },
  'edit-media': { name: 'Editar Mídia', icon: <Edit3 size={20} /> },
  'user-profile': { name: 'Perfil do Usuário', icon: <User size={20} /> },
};

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F7f1b9e9c1d27434ebacaa7f16ca51525%2Fa7818e35c5d54df9ba951473e49bd460?format=webp&width=80"
          alt="GeekLog"
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">GeekLog</h2>
      <p className="text-slate-400">Carregando sua jornada nerd...</p>
    </div>
  </div>
);

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md w-full text-center">
      <h2 className="text-xl font-semibold text-red-400 mb-4">Erro inesperado</h2>
      <p className="text-slate-300 mb-4">Algo deu errado ao carregar o aplicativo.</p>
      <p className="text-sm text-slate-400 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Recarregar Página
      </button>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // App State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on authentication
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔄 Carregando dados do usuário...');
        
        const [loadedSettings, loadedMediaItems, loadedReviews, loadedMilestones] = await Promise.all([
          getSettings(user.uid),
          getMedias(),
          getReviews(),
          getMilestones(),
        ]);

        setSettings({ ...defaultSettings, ...loadedSettings });
        setMediaItems(loadedMediaItems);
        setReviews(loadedReviews);
        setMilestones(loadedMilestones);

        console.log('✅ Dados carregados com sucesso');
        showSuccess('Bem-vindo!', 'Seus dados foram carregados com sucesso');
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showError('Erro', 'Não foi possível carregar todos os seus dados');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadUserData();
    }
  }, [user, authLoading, showSuccess, showError]);

  // Auto-save functionality - implementar quando necessário
  useEffect(() => {
    if (!user || isLoading) return;

    const autoSave = async () => {
      try {
        // Auto-save será implementado conforme necessário
        await saveSettings(user.uid, settings);
      } catch (error) {
        console.warn('⚠️ Auto-save falhou:', error);
      }
    };

    const timeoutId = setTimeout(autoSave, 5000); // Auto-save depois de 5 segundos de inatividade
    return () => clearTimeout(timeoutId);
  }, [user, settings, isLoading]);

  // Navigation functions
  const navigateToAddMedia = useCallback(() => {
    setActivePage('add-media');
  }, []);

  const navigateToEditMedia = useCallback((item: MediaItem) => {
    setEditingMediaItem(item);
    setActivePage('edit-media');
  }, []);

  const navigateBack = useCallback(() => {
    setActivePage('dashboard');
    setEditingMediaItem(null);
    setSelectedUser(null);
  }, []);

  // Page component renderer
  const PageComponent = useMemo(() => {
    const components = {
      dashboard: Dashboard,
      library: ModernLibrary,
      reviews: Reviews,
      timeline: Timeline,
      statistics: Statistics,
      settings: Settings,
      profile: Profile,
      'add-media': AddMediaPage,
      'edit-media': EditMediaPlaceholder,
      'user-profile': UserProfileView,
      social: () => (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Users className="mx-auto mb-4 text-purple-400" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">Social em Breve</h2>
            <p className="text-slate-400">
              Conecte-se com outros nerds e compartilhe suas descobertas!
            </p>
          </div>
        </div>
      ),
    };

    return components[activePage] || components.dashboard;
  }, [activePage]);

  // App context value
  const appContextValue = useMemo(() => ({
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
    navigateToAddMedia,
    navigateToEditMedia,
    navigateBack,
  }), [
    mediaItems,
    reviews,
    milestones,
    settings,
    activePage,
    selectedUser,
    editingMediaItem,
    navigateToAddMedia,
    navigateToEditMedia,
    navigateBack,
  ]);

  // Loading states
  if (authLoading || isLoading) {
    return <LoadingScreen />;
  }

  // Unauthenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-white/10">
          <div className="w-16 h-16 mx-auto mb-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F7f1b9e9c1d27434ebacaa7f16ca51525%2Fa7818e35c5d54df9ba951473e49bd460?format=webp&width=80"
              alt="GeekLog"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">GeekLog</h1>
          <p className="text-slate-400 mb-6">
            Faça login para continuar sua jornada nerd
          </p>
        </div>
      </div>
    );
  }

  const currentPageMeta = pageMetadata[activePage];

  return (
    <AppProvider value={appContextValue}>
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rotate-45"></div>
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Desktop Header */}
        <DesktopHeader 
          pageName={currentPageMeta.name} 
          pageIcon={currentPageMeta.icon} 
        />

        {/* Main Content */}
        <main className="md:ml-20 md:pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <PageComponent />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </AppProvider>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
