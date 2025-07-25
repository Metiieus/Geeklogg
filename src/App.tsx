import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
const Dashboard = lazy(() => import("./components/Dashboard"));
const Library = lazy(() => import("./components/Library"));
const Reviews = lazy(() => import("./components/Reviews"));
const Timeline = lazy(() => import("./components/Timeline"));
const Statistics = lazy(() => import("./components/Statistics"));
const Settings = lazy(() => import("./components/Settings"));
const Profile = lazy(() => import("./components/Profile"));
import { SocialFeed } from "./components/SocialFeed";
import ErrorBoundary from "./components/ErrorBoundary";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { LandingPage } from "./components/LandingPage";
import { ArchiviusAgent } from "./components/ArchiviusAgent";

import { NotificationCenter } from "./components/NotificationCenter";
import PremiumSuccessPage from "./components/PremiumSuccessPage";
import PremiumFailure from "./components/PremiumFailure";
import PremiumPending from "./components/PremiumPending";

import { getMedias } from "./services/mediaService";
import { getReviews } from "./services/reviewService";
import { getMilestones } from "./services/milestoneService";
import { getSettings } from "./services/settingsService";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { checkAchievements } from "./services/achievementService";
import { UserProfile } from "./types/social";

export type MediaType =
  | "games"
  | "anime"
  | "series"
  | "books"
  | "movies"
  | "jogos";
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
  | "library"
  | "reviews"
  | "timeline"
  | "statistics"
  | "profile"
  | "settings"
  | "social";

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

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [mItems, revs, miles, prefs] = await Promise.all([
        getMedias(),
        getReviews(),
        getMilestones(),
        getSettings(),
      ]);
      setMediaItems(mItems);
      setReviews(revs);
      setMilestones(miles);
      if (prefs) {
        const normalizedSettings = {
          name: prefs.name || "Usuário",
          bio: prefs.bio || "",
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

    const contextValue = {
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
  };

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

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "library":
        return <Library />;
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
      case "social":
        return <SocialFeed />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <ToastProvider>
        <AppProvider value={contextValue}>
          <Routes>
            <Route path="/premium/success" element={<PremiumSuccessPage />} />
            <Route path="/premium/failure" element={<PremiumFailure />} />
            <Route path="/premium/pending" element={<PremiumPending />} />
            <Route path="*" element={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-cyan-500/15 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-pink-500/15 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-48 h-24 sm:h-48 bg-purple-500/15 rounded-full blur-xl"></div>
            <div className="hidden sm:block absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-600/8 to-purple-600/8 rounded-full blur-3xl"></div>
            <div className="hidden sm:block absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tr from-pink-600/8 to-indigo-600/8 rounded-full blur-3xl"></div>
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-8 sm:w-16 h-8 sm:h-16 bg-cyan-400/25 rotate-45 opacity-40"></div>
            <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-6 sm:w-12 h-6 sm:h-12 bg-pink-400/30 rotate-12 opacity-35"></div>
            <div className="absolute top-1/3 left-2 sm:left-10 w-4 sm:w-8 h-4 sm:h-8 bg-purple-400/35 -rotate-45 opacity-50"></div>
            <div className="absolute bottom-1/3 right-2 sm:right-10 w-6 sm:w-12 h-6 sm:h-12 bg-indigo-400/25 -rotate-12 opacity-40"></div>
          </div>
          <div className="relative z-10 flex min-h-screen">
            <Sidebar />
                        <main className="flex-1 w-full sm:ml-20 pt-16 sm:pt-0 pb-4 sm:pb-0 overflow-x-hidden">
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="p-4 sm:p-6 text-center text-white">
                      <div className="animate-pulse">Carregando...</div>
                    </div>
                  }
                >
                  <div className="p-3 sm:p-6 max-w-full" key={activePage}>
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
