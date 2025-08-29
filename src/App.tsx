import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { DesktopHeader } from "./components/DesktopHeader";
const Dashboard = lazy(() => import("./components/Dashboard"));
const Reviews = lazy(() => import("./components/Reviews"));
const Timeline = lazy(() => import("./components/Timeline"));
const Statistics = lazy(() => import("./components/Statistics"));
const Settings = lazy(() => import("./components/Settings"));
const Profile = lazy(() => import("./components/Profile"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const AccountDeletion = lazy(() => import("./components/AccountDeletion"));
import { SocialFeed } from "./components/SocialFeed";
import { AddMediaPage } from "./components/AddMediaPage";
import { EditMediaPage } from "./components/EditMediaPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { LandingPage } from "./components/LandingPage";
import { ArchiviusAgent } from "./components/ArchiviusAgent";

import { NotificationCenter } from "./components/NotificationCenter";
import PremiumSuccessPage from "./components/PremiumSuccessPage";
import PremiumFailure from "./components/PremiumFailure";
import PremiumPending from "./components/PremiumPending";
import PerformanceOptimizer from "./components/PerformanceOptimizer";

import { getMedias } from "./services/mediaService";
import { getReviews } from "./services/reviewService";
import { getMilestones } from "./services/milestoneService";
import { loadProfile } from "./services/profileService";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { checkAchievements } from "./services/achievementService";
import { UserProfile } from "./types/social";
import { useOptimizedContext } from "./hooks/useOptimizedContext";
import { capacitorService } from "./services/capacitorService";

export type MediaType =
  | "games"
  | "anime"
  | "series"
  | "books"
  | "movies";
export type Status = "completed" | "in-progress" | "dropped" | "planned";

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
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  mediaId: string;
  title: string;
  content: string;
  rating: number;
  isFavorite: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  mediaId?: string;
  image?: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  name: string;
  image?: string;
}

export interface UserSettings {
  name: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  favorites: {
    characters: FavoriteItem[];
    games: FavoriteItem[];
    movies: FavoriteItem[];
  };
  defaultLibrarySort: string;
  theme?: string;
}

export type ActivePage =
  | "dashboard"
  | "reviews"
  | "timeline"
  | "statistics"
  | "profile"
  | "settings"
  | "social"
  | "add-media"
  | "edit-media"
  | "privacy-policy"
  | "account-deletion";

type ViewMode = "landing" | "login" | "register";

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [currentView, setCurrentView] = useState<ViewMode>("landing");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [settings, setSettings] = useState<UserSettings>({
    name: "Usuário",
    bio: "",
    favorites: {
      characters: [],
      games: [],
      movies: [],
    },
    theme: "dark",
    defaultLibrarySort: "updatedAt",
  });
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(null);

  // Initialize Capacitor for mobile
  useEffect(() => {
    if (capacitorService.isNativePlatform()) {
      console.log('📱 Aplicação executando em dispositivo móvel');
      capacitorService.initialize();
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [mItems, revs, miles, prefs] = await Promise.all([
        getMedias(),
        getReviews(),
        getMilestones(),
        loadProfile(),
      ]);
      setMediaItems(mItems);
      setReviews(revs);
      setMilestones(miles);
      if (prefs) {
        const normalizedSettings = {
          name: prefs.name || "Usuário",
          bio: prefs.bio || "",
          avatar: prefs.avatar || "",
          cover: prefs.cover || "",
          defaultLibrarySort: prefs.defaultLibrarySort || "updatedAt",
          favorites: {
            characters: Array.isArray(prefs.favorites?.characters)
              ? prefs.favorites.characters
              : [],
            games: Array.isArray(prefs.favorites?.games)
              ? prefs.favorites.games
              : [],
            movies: Array.isArray(prefs.favorites?.movies)
              ? prefs.favorites.movies
              : [],
          },
        };

        setSettings(normalizedSettings);
      }

      if (mItems.length > 0 || revs.length > 0 || prefs) {
        try {
          const newAchievements = await checkAchievements(
            mItems,
            revs,
            prefs || settings,
          );
          if (newAchievements.length > 0) {
          }
        } catch (error) {
          console.error("Erro ao verificar conquistas:", error);
        }
      }
    };

    loadData();
  }, [user]);

  // Global error handler for fetch failures
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('fetch') || event.reason?.name === 'TypeError') {
        console.warn('Network error detected:', event.reason);
        event.preventDefault(); // Prevent console error spam
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

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

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Router>
        <ToastProvider>
          <Routes>
            <Route path="/premium/success" element={<PremiumSuccessPage />} />
            <Route path="/premium/failure" element={<PremiumFailure />} />
            <Route path="/premium/pending" element={<PremiumPending />} />
            <Route path="*" element={
              <>
                {currentView === "landing" && (
                  <LandingPage
                    onLogin={() => setCurrentView("login")}
                    onRegister={() => setCurrentView("register")}
                  />
                )}
                {currentView === "login" && (
                  <Login
                    onCancel={() => setCurrentView("landing")}
                    onRegister={() => setCurrentView("register")}
                  />
                )}
                {currentView === "register" && (
                  <Register
                    onCancel={() => setCurrentView("landing")}
                    onLogin={() => setCurrentView("login")}
                  />
                )}
              </>
            } />
          </Routes>
        </ToastProvider>
      </Router>
    );
  }

  const getPageInfo = () => {
    const pages = {
      dashboard: { name: "Dashboard", icon: React.createElement('div', { className: 'text-cyan-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' }))) },
      library: { name: "Biblioteca", icon: React.createElement('div', { className: 'text-pink-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z' }))) },
      reviews: { name: "Resenhas", icon: React.createElement('div', { className: 'text-purple-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z' }))) },
      timeline: { name: "Jornada", icon: React.createElement('div', { className: 'text-indigo-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' }), React.createElement('path', { d: 'm12.5 7-1 0 0 6 5.25 3.15.75-1.23-4.5-2.67z' }))) },
      statistics: { name: "Estatísticas", icon: React.createElement('div', { className: 'text-cyan-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z' }))) },
      social: { name: "Social", icon: React.createElement('div', { className: 'text-pink-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63a1.5 1.5 0 0 0-1.42-1.01c-.8 0-1.54.5-1.85 1.26l-1.92 5.44c-.22.6-.71 1.94-.71 1.94H16c-1.11 0-2 .89-2 2v5h2v-4h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9v-2c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v2h1.5v7h4z' }))) },
      profile: { name: "Perfil", icon: React.createElement('div', { className: 'text-purple-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }))) },
      settings: { name: "Configurações", icon: React.createElement('div', { className: 'text-gray-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' }))) },
      "add-media": { name: "Adicionar Mídia", icon: React.createElement('div', { className: 'text-green-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' }))) },
      "edit-media": { name: "Editar Mídia", icon: React.createElement('div', { className: 'text-yellow-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' }))) },
      "privacy-policy": { name: "Política de Privacidade", icon: React.createElement('div', { className: 'text-blue-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z' }))) },
      "account-deletion": { name: "Exclusão de Conta", icon: React.createElement('div', { className: 'text-red-400' }, React.createElement('svg', { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' }))) }
    };
    return pages[activePage] || pages.dashboard;
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "reviews":
        return <Reviews />;
      case "timeline":
        return <Timeline />;
      case "statistics":
        return <Statistics />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "privacy-policy":
        return <PrivacyPolicy />;
      case "account-deletion":
        return <AccountDeletion />;
      case "social":
        return <SocialFeed />;
      case "add-media":
        return (
          <AddMediaPage
            onSave={(item) => {
              setMediaItems(prev => [...prev, item]);
            }}
            onBack={() => setActivePage("dashboard")}
          />
        );
      case "edit-media":
        return editingMediaItem ? (
          <EditMediaPage
            item={editingMediaItem}
            onSave={(updatedItem) => {
              setMediaItems(prev =>
                prev.map(item => item.id === updatedItem.id ? updatedItem : item)
              );
              setEditingMediaItem(null);
            }}
            onBack={() => {
              setEditingMediaItem(null);
              setActivePage("dashboard");
            }}
          />
        ) : (
          <Dashboard />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <ToastProvider>
        <PerformanceOptimizer />
        <AppProvider value={contextValue}>
          <Routes>
            <Route path="/premium/success" element={<PremiumSuccessPage />} />
            <Route path="/premium/failure" element={<PremiumFailure />} />
            <Route path="/premium/pending" element={<PremiumPending />} />
            <Route path="*" element={
              <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-5 md:top-20 left-2 md:left-20 w-24 md:w-64 h-24 md:h-64 rounded-full blur-xl md:blur-3xl" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}></div>
            <div className="absolute bottom-5 md:bottom-20 right-2 md:right-20 w-32 md:w-96 h-32 md:h-96 rounded-full blur-xl md:blur-3xl" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 md:w-48 h-16 md:h-48 rounded-full blur-lg md:blur-xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}></div>
            <div className="hidden md:block absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)' }}></div>
            <div className="hidden md:block absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)' }}></div>
            <div className="absolute top-3 md:top-10 right-3 md:right-10 w-6 md:w-16 h-6 md:h-16 rotate-45 opacity-30" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}></div>
            <div className="absolute bottom-20 md:bottom-10 left-3 md:left-10 w-4 md:w-12 h-4 md:h-12 rotate-12 opacity-25" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)' }}></div>
            <div className="absolute top-1/3 left-1 md:left-10 w-3 md:w-8 h-3 md:h-8 -rotate-45 opacity-35" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}></div>
            <div className="absolute bottom-1/3 right-1 md:right-10 w-4 md:w-12 h-4 md:h-12 -rotate-12 opacity-30" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}></div>
          </div>
          <div className="relative z-10 flex min-h-screen">
            <Sidebar />
            <DesktopHeader
              pageName={getPageInfo().name}
              pageIcon={getPageInfo().icon}
            />
            <main className="flex-1 w-full md:ml-20 pt-16 md:pt-16 pb-20 md:pb-4 overflow-x-hidden performance-boost">
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="p-4 sm:p-6 text-center text-white">
                      <div className="animate-pulse">Carregando...</div>
                    </div>
                  }
                >
                  <div className="p-2 sm:p-4 md:p-6 max-w-full" key={activePage}>
                    {renderPage()}
                  </div>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
                    <MobileSidebar />
          <ArchiviusAgent />
          <NotificationCenter />
              </div>
            } />
          </Routes>
        </AppProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
