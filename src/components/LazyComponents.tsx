import { lazy } from "react";

// Lazy loading para modais que são carregados apenas quando necessário
export const LazyEditFavoritesModal = lazy(() =>
  import("./modals/EditFavoritesModal").then((module) => ({
    default: module.EditFavoritesModal,
  })),
);

export const LazyEditProfileModal = lazy(() =>
  import("./modals/EditProfileModal").then((module) => ({
    default: module.EditProfileModal,
  })),
);

export const LazyLibrarySelector = lazy(() =>
  import("./modals/LibrarySelector").then((module) => ({
    default: module.LibrarySelector,
  })),
);

export const LazyAddMediaFromSearchModal = lazy(() =>
  import("./modals/AddMediaFromSearchModal").then((module) => ({
    default: module.AddMediaFromSearchModal,
  })),
);

export const LazyAchievementModal = lazy(() =>
  import("./AchievementModal").then((module) => ({
    default: module.AchievementModal,
  })),
);

export const LazyAchievementTree = lazy(() =>
  import("./AchievementTree").then((module) => ({
    default: module.AchievementTree,
  })),
);

// Lazy loading para componentes de páginas menos utilizadas
export const LazyArchiviusAgent = lazy(() =>
  import("./ArchiviusAgent").then((module) => ({
    default: module.ArchiviusAgent,
  })),
);

export const LazyUserProfileView = lazy(() =>
  import("./UserProfileView").then((module) => ({
    default: module.UserProfileView,
  })),
);

export const LazyNotificationCenter = lazy(() =>
  import("./NotificationCenter").then((module) => ({
    default: module.NotificationCenter,
  })),
);
