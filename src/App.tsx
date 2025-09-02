// imports principais
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart3,
  Users,
  Settings,
  User,
  Plus,
  Edit3,
} from "lucide-react";

// Loading Screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
      <p className="text-slate-300">Carregando...</p>
    </div>
  </div>
);

// Context Providers
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";

// Components
import { Sidebar } from "./components/Sidebar";
import { DesktopHeader } from "./components/DesktopHeader";
import { MobileNav } from "./components/MobileNav";
import { Login } from "./components/Login";
import { LandingPage } from "./components/LandingPage";
import { Register } from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProLibrary from "./components/Library/ProLibrary"; // ✅ Nova biblioteca integrada
import Reviews from "./components/Reviews";
import Timeline from "./components/Timeline";
import Statistics from "./components/Statistics";
import SettingsComponent from "./components/Settings";
import Profile from "./components/Profile";
import { AddMediaPage } from "./components/AddMediaPage";
import EditMediaPageWrapper from "./components/EditMediaPageWrapper";
import { UserProfileView } from "./components/UserProfileView";
import FirebaseStatus from "./components/FirebaseStatus";
import "./utils/connectivityTest";

// Services
import { getSettings, saveSettings } from "./services/settingsService";
import { getMedias } from "./services/mediaService";
import { getReviews } from "./services/reviewService";
import { getMilestones } from "./services/milestoneService";

// Tipos
export type MediaType = "game" | "movie" | "tv" | "book" | "anime" | "manga";
export type Status = "completed" | "in-progress" | "dropped" | "planned";
export type ActivePage =
  | "dashboard"
  | "library"
  | "reviews"
  | "timeline"
  | "statistics"
  | "social"
  | "settings"
  | "profile"
  | "add-media"
  | "edit-media"
  | "user-profile";

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
  description?: string;
  platform?: string;
  totalPages?: number;
  currentPage?: number;
  externalLink?: string;
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
  type: "achievement" | "goal" | "event";
  mediaId?: string;
  data?: any;
}

export interface UserSettings {
  name: string;
  avatar?: string;
  bio?: string;
  favoriteGenres: string[];
  theme: "dark" | "light";
  language: "pt" | "en";
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
  name: "",
  bio: "",
  favoriteGenres: [],
  theme: "dark",
  language: "pt",
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

// Page metadata
const pageMetadata = {
  dashboard: { name: "Dashboard", icon: <Home size={20} /> },
  library: { name: "Biblioteca", icon: <BookOpen size={20} /> },
  reviews: { name: "Resenhas", icon: <MessageSquare size={20} /> },
  timeline: { name: "Jornada", icon: <Clock size={20} /> },
  statistics: { name: "Estatísticas", icon: <BarChart3 size={20} /> },
  social: { name: "Social", icon: <Users size={20} /> },
  settings: { name: "Configurações", icon: <Settings size={20} /> },
  profile: { name: "Perfil", icon: <User size={20} /> },
  "add-media": { name: "Adicionar Mídia", icon: <Plus size={20} /> },
  "edit-media": { name: "Editar Mídia", icon: <Edit3 size={20} /> },
  "user-profile": { name: "Perfil do Usuário", icon: <User size={20} /> },
};

// ======================================================
// AppContent (conteúdo principal)
// ======================================================
const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Carrega dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔄 Carregando dados do usuário...");

        const [
          loadedSettings,
          loadedMediaItems,
          loadedReviews,
          loadedMilestones,
        ] = await Promise.all([
          getSettings(user.uid),
          getMedias(),
          getReviews(),
          getMilestones(),
        ]);

        setSettings({ ...defaultSettings, ...loadedSettings });
        setMediaItems(loadedMediaItems);
        setReviews(loadedReviews);
        setMilestones(loadedMilestones);

        console.log("✅ Dados carregados com sucesso");
        showSuccess("Bem-vindo!", "Seus dados foram carregados com sucesso");
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        showError("Erro", "Não foi possível carregar todos os seus dados");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadUserData();
    }
  }, [user, authLoading, showSuccess, showError]);

  // Auto-save
  useEffect(() => {
    if (!user || isLoading) return;

    const autoSave = async () => {
      try {
        await saveSettings(user.uid, settings);
      } catch (error) {
        console.warn("⚠️ Auto-save falhou:", error);
      }
    };

    const timeoutId = setTimeout(autoSave, 5000);
    return () => clearTimeout(timeoutId);
  }, [user, settings, isLoading]);

  // Funções de navegação
  const navigateToAddMedia = useCallback(() => {
    setActivePage("add-media");
  }, []);

  const navigateToEditMedia = useCallback((item: MediaItem) => {
    setEditingMediaItem(item);
    setActivePage("edit-media");
  }, []);

  const navigateBack = useCallback(() => {
    setActivePage("dashboard");
    setEditingMediaItem(null);
    setSelectedUser(null);
  }, []);

  // Renderer de páginas
  const PageComponent = useMemo(() => {
    const components = {
      dashboard: Dashboard,
      library: () => (
        <ProLibrary
          featured={mediaItems.slice(0, 4)}
          recent={mediaItems.slice(-6)}
          topRated={[...mediaItems]
            .filter((m) => m.rating !== undefined)
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 6)}
          collection={mediaItems}
        />
      ),
      reviews: Reviews,
      timeline: Timeline,
      statistics: Statistics,
      settings: SettingsComponent,
      profile: Profile,
      "add-media": AddMediaPage,
      "edit-media": EditMediaPageWrapper,
      "user-profile": UserProfileView,
      social: () => (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Users className="mx-auto mb-4 text-purple-400" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">
              Social em Breve
            </h2>
            <p className="text-slate-400">
              Conecte-se com outros nerds e compartilhe suas descobertas!
            </p>
          </div>
        </div>
      ),
    };

    return components[activePage] || components.dashboard;
  }, [activePage, mediaItems]);

  // Contexto
  const appContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  // Renderização especial
  if (authLoading || isLoading) return <LoadingScreen />;

  if (!user) {
    if (showLogin) {
      return (
        <Login
          onCancel={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      );
    }

    if (showRegister) {
      return (
        <Register
          onCancel={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      );
    }

    return (
      <LandingPage
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  const currentPageMeta = pageMetadata[activePage];

  return (
    <AppProvider value={appContextValue}>
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rotate-45"></div>
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <DesktopHeader
          pageName={currentPageMeta.name}
          pageIcon={currentPageMeta.icon}
        />

        {/* Conteúdo */}
        <main className="md:ml-20 md:pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              }
            >
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

        {/* Firebase Status */}
        <FirebaseStatus showStatus={!!user} />
      </div>
    </AppProvider>
  );
};

// Error Boundary
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
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="text-red-400">
            Erro inesperado: {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Root App
const App: React.FC = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;
