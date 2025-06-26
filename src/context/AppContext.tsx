import React, { createContext, useContext } from 'react';
import { MediaItem, Review, Milestone, UserSettings, ActivePage } from '../App';

interface AppContextType {
  mediaItems: MediaItem[];
  setMediaItems: (items: MediaItem[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; value: AppContextType }> = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};