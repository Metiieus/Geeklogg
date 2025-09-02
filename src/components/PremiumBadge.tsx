import React from "react";
import { Crown, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumBadgeProps {
  variant?: "avatar" | "inline" | "chip" | "icon-only";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
  showLabel?: boolean;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  variant = "avatar",
  size = "md",
  animated = true,
  className = "",
  showLabel = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return { badge: "w-5 h-5", icon: "w-2.5 h-2.5", text: "text-xs" };
      case "lg":
        return { badge: "w-10 h-10", icon: "w-5 h-5", text: "text-sm" };
      case "md":
      default:
        return { badge: "w-6 h-6", icon: "w-3 h-3", text: "text-xs" };
    }
  };

  const sizeClasses = getSizeClasses();

  const BadgeContent = () => {
    const commonMotionProps = animated
      ? {
          initial: { scale: 0.8, rotate: -10 },
          animate: { scale: 1, rotate: 0 },
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.3,
          },
        }
      : {};

    switch (variant) {
      case "avatar":
        return (
          <motion.div
            {...commonMotionProps}
            className={`absolute -bottom-1 -right-1 ${sizeClasses.badge} bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg ${className}`}
          >
            <Crown
              className={`${sizeClasses.icon} text-white drop-shadow-sm`}
            />
            {animated && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        );

      case "inline":
        return (
          <motion.div
            {...commonMotionProps}
            className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-full backdrop-blur-sm ${className}`}
          >
            <Crown className={`${sizeClasses.icon} text-yellow-400`} />
            {showLabel && (
              <span
                className={`${sizeClasses.text} text-yellow-400 font-medium`}
              >
                Premium
              </span>
            )}
          </motion.div>
        );

      case "chip":
        return (
          <motion.div
            {...commonMotionProps}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 rounded-full shadow-lg ${className}`}
          >
            <Crown className={`${sizeClasses.icon} text-white`} />
            <span
              className={`${sizeClasses.text} text-white font-semibold tracking-wide`}
            >
              PREMIUM
            </span>
            <Sparkles className={`${sizeClasses.icon} text-white`} />
            {animated && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full opacity-75 blur-sm"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
          </motion.div>
        );

      case "icon-only":
      default:
        return (
          <motion.div
            {...commonMotionProps}
            className={`inline-flex ${className}`}
          >
            <Crown
              className={`${sizeClasses.icon} text-yellow-400 drop-shadow-sm`}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className={`relative ${variant === "avatar" ? "" : "inline-flex"}`}>
      <BadgeContent />
    </div>
  );
};

// Utility component to check if user is premium and show badge
interface ConditionalPremiumBadgeProps extends PremiumBadgeProps {
  isPremium?: boolean;
}

export const ConditionalPremiumBadge: React.FC<
  ConditionalPremiumBadgeProps
> = ({ isPremium, ...badgeProps }) => {
  if (!isPremium) return null;
  return <PremiumBadge {...badgeProps} />;
};

export default PremiumBadge;
