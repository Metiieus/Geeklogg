import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
const Dashboard = lazy(() => import('./components/Dashboard'));
const Library = lazy(() => import('./components/Library'));
const Reviews = lazy(() => import('./components/Reviews'));
const Timeline = lazy(() => import('./components/Timeline'));
const Statistics = lazy(() => import('./components/Statistics'));
const Settings = lazy(() => import('./components/Settings'));
const Profile = lazy(() => import('./components/Profile'));
import ErrorBoundary from './components/ErrorBoundary';
import { Login } from './components/Login';
import { getMedias } from './services/mediaService';
import { getReviews } from './services/reviewService';
import { getMilestones } from './services/milestoneService';
import { getSettings } from './services/settingsService';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';

export type MediaType = 'games' | 'anime' | 'series' | 'books' | 'movies';
export type Status = 'completed' | 'in-progress' | 'dropped' | 'planned';

export interface MediaItem {
  id: string;
  title: string;
  cover?: string;
  platform?: string;
  status: Status;
  rating?: number;
  hoursSpent?: number;
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
  bio?: string;
  favorites: {
    characters: FavoriteItem[];
    games: FavoriteItem[];
    movies: FavoriteItem[];
  };
  theme: 'dark' | 'light';
  defaultLibrarySort: string;
}

export type ActivePage = 'dashboard' | 'library' | 'reviews' | 'timeline' | 'statistics' | 'profile' | 'settings';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Nerd',
    bio: '',
    favorites: {
      characters: [],
      games: [],
      movies: []
    },
    theme: 'dark',
    defaultLibrarySort: 'updatedAt'
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [mItems, revs, miles, prefs] = await Promise.all([
        getMedias(),
        getReviews(),
        getMilestones(),
        getSettings(),
      ]);
      setMediaItems(mItems);
      setReviews(revs);
      setMilestones(miles);
      if (prefs) setSettings(prefs);
    })();
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
    setActivePage
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'library':
        return <Library />;
      case 'reviews':
        return <Reviews />;
      case 'timeline':
        return <Timeline />;
      case 'statistics':
        return <Statistics />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 sm:ml-20 pb-16 sm:pb-0">
            <ErrorBoundary>
              <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
                <div className="p-6" key={activePage}>
                  {renderPage()}
                </div>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
        <MobileNav />
      </div>
    </AppProvider>
  );
}

export default App;