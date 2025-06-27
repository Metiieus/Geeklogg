import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { Library } from './components/Library';
import { Reviews } from './components/Reviews';
import { Timeline } from './components/Timeline';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFirestoreSync } from './hooks/useFirestoreSync';
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
  const [mediaItems, setMediaItems] = useLocalStorage<MediaItem[]>('nerdlog-media', []);
  const [reviews, setReviews] = useLocalStorage<Review[]>('nerdlog-reviews', []);
  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('nerdlog-milestones', []);
  const [settings, setSettings] = useLocalStorage<UserSettings>('nerdlog-settings', {
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

  useFirestoreSync('mediaItems', mediaItems, setMediaItems);
  useFirestoreSync('reviews', reviews, setReviews);
  useFirestoreSync('milestones', milestones, setMilestones);
  useFirestoreSync('settings', settings, setSettings);

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
            <div className="p-6">
              {renderPage()}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </AppProvider>
  );
}

export default App;