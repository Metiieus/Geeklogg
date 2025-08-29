import { useMemo } from 'react';
import { MediaItem, Review, Milestone, UserSettings, ActivePage } from '../App';
import { UserProfile } from '../types/social';

interface UseOptimizedContextProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
  selectedUser: UserProfile | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  editingMediaItem: MediaItem | null;
  setEditingMediaItem: React.Dispatch<React.SetStateAction<MediaItem | null>>;
}

export const useOptimizedContext = (props: UseOptimizedContextProps) => {
  const {
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
  } = props;

  // Memoizar funções de navegação para evitar re-renders
  const navigateToAddMedia = useMemo(
    () => () => setActivePage("add-media"),
    [setActivePage]
  );

  const navigateToEditMedia = useMemo(
    () => (item: MediaItem) => {
      setEditingMediaItem(item);
      setActivePage("edit-media");
    },
    [setEditingMediaItem, setActivePage]
  );

  const navigateBack = useMemo(
    () => () => setActivePage("dashboard"),
    [setActivePage]
  );

  // Memoizar valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
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
      setMediaItems,
      setReviews,
      setMilestones,
      setSettings,
      setActivePage,
      setSelectedUser,
      setEditingMediaItem,
      navigateToAddMedia,
      navigateToEditMedia,
      navigateBack,
    ]
  );

  return contextValue;
};
