import React, { memo } from "react";
import { useOptimizedAvatar } from "../hooks/useOptimizedAvatar";

interface OptimizedAvatarProps {
  avatarUrl?: string;
  fallbackText: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  alt?: string;
  onClick?: () => void;
  showLoadingSpinner?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

/**
 * Componente de Avatar otimizado com lazy loading e fallbacks
 */
export const OptimizedAvatar = memo<OptimizedAvatarProps>(
  ({
    avatarUrl,
    fallbackText,
    size = "md",
    className = "",
    alt,
    onClick,
    showLoadingSpinner = false,
  }) => {
    const {
      displayAvatar,
      fallbackInitial,
      isLoading,
      hasError,
      handleImageError,
    } = useOptimizedAvatar({
      avatarUrl,
      fallbackText,
      size,
    });

    const containerClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    bg-gradient-to-br 
    from-pink-500 
    via-purple-500 
    to-cyan-500 
    p-0.5 
    flex-shrink-0
    ${onClick ? "cursor-pointer hover:scale-105 transition-transform duration-200" : ""}
    ${className}
  `;

    const innerClasses = `
    w-full 
    h-full 
    rounded-full 
    bg-slate-900 
    flex 
    items-center 
    justify-center 
    overflow-hidden
    relative
  `;

    return (
      <div className={containerClasses} onClick={onClick}>
        <div className={innerClasses}>
          {/* Loading spinner */}
          {isLoading && showLoadingSpinner && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-full">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Avatar image */}
          {displayAvatar && !hasError && (
            <img
              src={displayAvatar}
              alt={alt || fallbackText}
              className="w-full h-full object-cover rounded-full"
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Fallback text */}
          {(!displayAvatar || hasError) && !isLoading && (
            <span
              className={`text-white font-bold ${textSizeClasses[size]} flex items-center justify-center w-full h-full`}
            >
              {fallbackInitial}
            </span>
          )}
        </div>
      </div>
    );
  },
);

OptimizedAvatar.displayName = "OptimizedAvatar";
