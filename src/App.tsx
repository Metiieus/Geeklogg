import React, { useMemo, useState } from 'react';
import { DesktopHeader } from './components/DesktopHeader';
import Sidebar from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import Dashboard from './components/Dashboard';
import ModernLibrary from './components/ModernLibrary';
import Reviews from './components/Reviews';
import Timeline from './components/Timeline';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import AccountDeletion from './components/AccountDeletion';
import Profile from './components/Profile';
import { AppProvider } from './context/AppContext';
import { useOptimizedContext } from './hooks/useOptimizedContext';
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

const App: React.FC = () => {
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
      case 'profile':
        return <Profile />;
      // fallback
      default:
        return <Dashboard />;
    }
  }, [activePage]);

  return (
    <AppProvider value={contextValue}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="md:ml-20 xl:ml-64">
          <DesktopHeader />
          <main className="px-4 sm:px-6 md:px-8 py-6">
            {PageComponent}
          </main>
        </div>
        <MobileNav />
      </div>
    </AppProvider>
  );
};

export default App;
