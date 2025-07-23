import React, { createContext, useContext, useState, useEffect } from "react";
import { database } from "../services/database";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [settings, setSettings] = useState({
    name: "Usuário",
    bio: "",
    favorites: {
      characters: [],
      games: [],
      movies: [],
    },
    defaultLibrarySort: "updatedAt",
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    games: 0,
    books: 0,
    movies: 0,
    reviews: 0,
  });

  // Load user data when user changes
  useEffect(() => {
    if (user?.uid) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setMediaItems([]);
      setReviews([]);
      setMilestones([]);
      setSettings({
        name: "Usuário",
        bio: "",
        favorites: {
          characters: [],
          games: [],
          movies: [],
        },
        defaultLibrarySort: "updatedAt",
      });
      setStats({
        games: 0,
        books: 0,
        movies: 0,
        reviews: 0,
      });
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Load data in parallel
      const [mediaData, reviewsData, milestonesData, settingsData] =
        await Promise.all([
          database.getUserMedia(user.uid),
          database.getUserReviews(user.uid),
          database.getUserMilestones(user.uid),
          database.getUserSettings(user.uid),
        ]);

      setMediaItems(mediaData || []);
      setReviews(reviewsData || []);
      setMilestones(milestonesData || []);

      if (settingsData) {
        setSettings((prev) => ({ ...prev, ...settingsData }));
      }

      // Calculate stats
      const mediaStats = (mediaData || []).reduce(
        (acc, item) => {
          if (item.type === "game") acc.games++;
          else if (item.type === "book") acc.books++;
          else if (item.type === "movie" || item.type === "series")
            acc.movies++;
          return acc;
        },
        { games: 0, books: 0, movies: 0 },
      );

      setStats({
        ...mediaStats,
        reviews: (reviewsData || []).length,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMediaItem = async (mediaData) => {
    if (!user?.uid) return;

    try {
      const newItem = await database.add(
        ["users", user.uid, "media"],
        mediaData,
      );
      const itemWithId = { id: newItem.id, ...mediaData };
      setMediaItems((prev) => [itemWithId, ...prev]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        [mediaData.type === "series" ? "movies" : `${mediaData.type}s`]:
          prev[mediaData.type === "series" ? "movies" : `${mediaData.type}s`] +
          1,
      }));

      return itemWithId;
    } catch (error) {
      console.error("Error adding media item:", error);
      throw error;
    }
  };

  const updateMediaItem = async (itemId, mediaData) => {
    if (!user?.uid) return;

    try {
      await database.update(["users", user.uid, "media", itemId], mediaData);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, ...mediaData } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating media item:", error);
      throw error;
    }
  };

  const deleteMediaItem = async (itemId, itemType) => {
    if (!user?.uid) return;

    if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
      console.error("ID do item é obrigatório e deve ser uma string válida");
      return;
    }

    try {
      await database.delete(["users", user.uid, "media", itemId]);
      setMediaItems((prev) => prev.filter((item) => item.id !== itemId));

      // Update stats
      setStats((prev) => ({
        ...prev,
        [itemType === "series" ? "movies" : `${itemType}s`]: Math.max(
          0,
          prev[itemType === "series" ? "movies" : `${itemType}s`] - 1,
        ),
      }));
    } catch (error) {
      console.error("Error deleting media item:", error);
      throw error;
    }
  };

  const addReview = async (reviewData) => {
    if (!user?.uid) return;

    try {
      const newReview = await database.add(
        ["users", user.uid, "reviews"],
        reviewData,
      );
      const reviewWithId = { id: newReview.id, ...reviewData };
      setReviews((prev) => [reviewWithId, ...prev]);
      setStats((prev) => ({ ...prev, reviews: prev.reviews + 1 }));
      return reviewWithId;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    if (!user?.uid) return;

    try {
      await database.update(
        ["users", user.uid, "reviews", reviewId],
        reviewData,
      );
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, ...reviewData } : review,
        ),
      );
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user?.uid) return;

    try {
      await database.delete(["users", user.uid, "reviews", reviewId]);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setStats((prev) => ({ ...prev, reviews: Math.max(0, prev.reviews - 1) }));
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  };

  const addMilestone = async (milestoneData) => {
    if (!user?.uid) return;

    try {
      const newMilestone = await database.add(
        ["users", user.uid, "milestones"],
        milestoneData,
      );
      const milestoneWithId = { id: newMilestone.id, ...milestoneData };
      setMilestones((prev) => [milestoneWithId, ...prev]);
      return milestoneWithId;
    } catch (error) {
      console.error("Error adding milestone:", error);
      throw error;
    }
  };

  const updateMilestone = async (milestoneId, milestoneData) => {
    if (!user?.uid) return;

    try {
      await database.update(
        ["users", user.uid, "milestones", milestoneId],
        milestoneData,
      );
      setMilestones((prev) =>
        prev.map((milestone) =>
          milestone.id === milestoneId
            ? { ...milestone, ...milestoneData }
            : milestone,
        ),
      );
    } catch (error) {
      console.error("Error updating milestone:", error);
      throw error;
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (!user?.uid) return;

    try {
      await database.delete(["users", user.uid, "milestones", milestoneId]);
      setMilestones((prev) =>
        prev.filter((milestone) => milestone.id !== milestoneId),
      );
    } catch (error) {
      console.error("Error deleting milestone:", error);
      throw error;
    }
  };

  const updateSettings = async (newSettings) => {
    if (!user?.uid) return;

    try {
      await database.updateUserSettings(user.uid, newSettings);
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const value = {
    // Data
    mediaItems,
    reviews,
    milestones,
    settings,
    stats,
    loading,

    // Actions
    loadUserData,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    addReview,
    updateReview,
    deleteReview,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    updateSettings,

    // Legacy setters (for compatibility)
    setMediaItems,
    setReviews,
    setMilestones,
    setSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
