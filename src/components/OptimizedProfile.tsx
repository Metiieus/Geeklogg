import React, { memo } from "react";
import Profile from "../pages/Profile";

// Componente Profile otimizado com memoização
const OptimizedProfile = memo(Profile, (prevProps, nextProps) => {
  // Como Profile não recebe props, sempre será igual
  return true;
});

OptimizedProfile.displayName = "OptimizedProfile";

export default OptimizedProfile;
