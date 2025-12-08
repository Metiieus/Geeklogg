import { devLog } from "./utils/logger";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";

// Components & Pages
import { Sidebar } from "./components/Sidebar"; // Still needed? MainLayout uses it.
import { Login } from "./pages/Login";
import { LandingPage } from "./pages/Landing";
import { Register } from "./pages/Register";
// Lazy Loaded Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const ProLibrary = React.lazy(() => import("./pages/Library"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const Timeline = React.lazy(() => import("./pages/Timeline"));
const Statistics = React.lazy(() => import("./pages/Statistics"));
const SettingsComponent = React.lazy(() => import("./pages/Settings"));
const Profile = React.lazy(() => import("./pages/Profile"));
// Named exports handling helper or direct
const AddMediaPage = React.lazy(() => import("./pages/AddMedia").then(module => ({ default: module.AddMediaPage })));
const EditMediaPageWrapper = React.lazy(() => import("./pages/EditMedia"));
const CreateMediaPage = React.lazy(() => import("./pages/CreateMedia"));
const UserProfileView = React.lazy(() => import("./pages/UserProfile").then(module => ({ default: module.UserProfileView })));
import "./utils/connectivityTest";

// Layouts
import { MainLayout } from "./layouts/MainLayout";

// Queries
import { useMedias, useReviews, useMilestones, useSettings, useUpdateSettings } from "./hooks/queries";

// Types
import {
  MediaItem,
  Review,
  Milestone,
  UserSettings,
  UserProfile,
  ActivePage,
} from "./types";

// Loading Screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
      <p className="text-slate-300">Carregando...</p>
    </div>
  </div>
);

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

// Wrapper for UserProfile to handle useParams
const UserProfileRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <Navigate to="/dashboard" />;

  return <UserProfileView userId={id} onBack={() => navigate(-1)} />;
};

// Main App Content
const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(null);

  // --- React Query Implementation ---
  const { data: mediaItems = [], isLoading: mediaLoading } = useMedias(user?.uid);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(user?.uid);
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestones(user?.uid);
  const { data: serverSettings, isLoading: settingsLoading } = useSettings(user?.uid);

  const updateSettingsMutation = useUpdateSettings();

  // Settings State Management (Local + Sync)
  const [localSettings, setLocalSettings] = useState<UserSettings>(defaultSettings);

  // Sync server settings to local state when loaded
  useEffect(() => {
    if (serverSettings) {
      const safeSettings = {
        ...defaultSettings,
        ...serverSettings,
        theme: (serverSettings.theme === "dark" || serverSettings.theme === "light") ? serverSettings.theme : "dark"
      } as UserSettings;
      setLocalSettings(safeSettings);
    }
  }, [serverSettings]);

  // Handle settings update
  const handleSetSettings = useCallback((newSettingsOrFn: UserSettings | ((prev: UserSettings) => UserSettings)) => {
    setLocalSettings(prev => {
      const newSettings = typeof newSettingsOrFn === 'function' ? newSettingsOrFn(prev) : newSettingsOrFn;

      // Debounced save or immediate save could be implemented here
      // For now, we save on change, but verify if user exists
      if (user?.uid) {
        updateSettingsMutation.mutate({ userId: user.uid, settings: newSettings });
      }
      return newSettings;
    });
  }, [user, updateSettingsMutation]);

  // Sync route with activePage for legacy compatibility
  useEffect(() => {
    const path = location.pathname.split('/')[1] || "dashboard";
    // Map path to ActivePage if possible
    const validPages: ActivePage[] = [
      "dashboard", "library", "reviews", "timeline", "statistics",
      "social", "settings", "profile", "add-media", "edit-media", "user-profile"
    ];

    let mappedPage: ActivePage = "dashboard";
    if (path === "user") mappedPage = "user-profile";
    else if (path === "edit-media") mappedPage = "edit-media";
    else if (path === "add-media") mappedPage = "add-media";
    else if (validPages.includes(path as ActivePage)) {
      mappedPage = path as ActivePage;
    }

    setActivePage(mappedPage);
  }, [location.pathname]);


  // Funções de navegação (Legacy/Context support)
  const navigateToAddMedia = useCallback(() => {
    navigate("/add-media");
  }, [navigate]);

  const navigateToEditMedia = useCallback((item: MediaItem) => {
    setEditingMediaItem(item);
    navigate(`/edit-media/${item.id}`);
  }, [navigate]);

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Contexto
  const appContextValue = useMemo(
    () => ({
      mediaItems,
      setMediaItems: () => devLog.warn("Legacy setMediaItems called - prefer using Mutations"), // Placeholder
      reviews,
      setReviews: () => devLog.warn("Legacy setReviews called"),
      milestones,
      setMilestones: () => devLog.warn("Legacy setMilestones called"),
      settings: localSettings,
      setSettings: handleSetSettings,
      activePage,
      setActivePage: (page: ActivePage) => {
        // Backward compatibility: switch route
        if (page === "user-profile") {
          // Can't nav without ID
          return;
        }
        if (page === "edit-media") return; // Handled by navigateToEditMedia

        let path = page as string;
        if (page === "add-media") path = "add-media";
        navigate(`/${path}`);
      },
      selectedUser,
      setSelectedUser,
      editingMediaItem,
      setEditingMediaItem,
      navigateToAddMedia,
      navigateToEditMedia,
      navigateBack,
    }),
    [
      mediaItems, reviews, milestones, localSettings, handleSetSettings, activePage, selectedUser, editingMediaItem,
      navigateToAddMedia, navigateToEditMedia, navigateBack
    ]
  );

  const isLoading = authLoading || (user && (mediaLoading || reviewsLoading || milestonesLoading || settingsLoading));

  if (isLoading) return <LoadingScreen />;

  return (
    <AppProvider value={appContextValue}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/landing" element={
          !user ? <LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />
            : <Navigate to="/dashboard" />
        } />
        <Route path="/login" element={
          !user ? <Login onCancel={() => navigate("/landing")} onRegister={() => navigate("/register")} />
            : <Navigate to="/dashboard" />
        } />
        <Route path="/register" element={
          !user ? <Register onCancel={() => navigate("/landing")} onLogin={() => navigate("/login")} />
            : <Navigate to="/dashboard" />
        } />

        {/* Protected Routes */}
        {user && (
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={
              <ProLibrary
                featured={mediaItems.slice(0, 4)}
                recent={mediaItems.slice(-6)}
                topRated={[...mediaItems]
                  .filter((m) => m.rating !== undefined)
                  .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                  .slice(0, 6)}
                collection={mediaItems}
              />
            } />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<SettingsComponent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-media" element={<AddMediaPage />} />
            <Route path="/media/new" element={<CreateMediaPage />} />
            <Route path="/edit-media/:id" element={<EditMediaPageWrapper />} />
            <Route path="/user/:id" element={<UserProfileRoute />} />
            <Route path="/social" element={
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Users className="mx-auto mb-4 text-purple-400" size={48} />
                  <h2 className="text-xl font-semibold text-white mb-2">Social em Breve</h2>
                  <p className="text-slate-400">Conecte-se com outros nerds e compartilhe suas descobertas!</p>
                </div>
              </div>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}

        {/* Default Redirect if not user */}
        {!user && <Route path="*" element={<Navigate to="/landing" />} />}

      </Routes>
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
    devLog.error("Error boundary caught an error:", error, errorInfo);
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

// Root App is handled in main.tsx (BrowserRouter)
const App: React.FC = () => {
  // Error handlers...
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      try {
        const reason = (event && (event.reason as any)) || null;
        const message = reason && (reason.message || String(reason)) ? (reason.message || String(reason)) : "";
        if (typeof message === "string" && message.includes("ReadableStreamDefaultReader constructor can only accept readable streams")) {
          devLog.warn("Suppressed known Firestore ReadableStream error:", message);
          event.preventDefault();
          return;
        }
      } catch (e) { }
    };
    window.addEventListener("unhandledrejection", handler as any);
    return () => window.removeEventListener("unhandledrejection", handler as any);
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
