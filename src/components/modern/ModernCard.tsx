import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ModernCardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'gradient' | 'glass' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: "bg-slate-800/80 backdrop-blur-sm border border-white/10",
  gradient: "bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-md border border-slate-600/30",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg",
  neon: "bg-slate-900/80 backdrop-blur-sm border border-cyan-400/50 shadow-lg shadow-cyan-400/20",
  minimal: "bg-slate-800/40 backdrop-blur-sm border border-slate-600/20"
};

const sizeVariants = {
  sm: "p-3 sm:p-4 rounded-lg sm:rounded-xl",
  md: "p-4 sm:p-6 rounded-xl sm:rounded-2xl",
  lg: "p-6 sm:p-8 rounded-xl sm:rounded-2xl",
  xl: "p-8 sm:p-10 rounded-2xl sm:rounded-3xl"
};

const interactiveVariants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02,
    y: -4,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 30 
    }
  }
};

const glowAnimation = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 40px rgba(59, 130, 246, 0.5)",
      "0 0 20px rgba(59, 130, 246, 0.3)"
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const ModernCard: React.FC<ModernCardProps> = ({
  variant = 'default',
  size = 'md',
  glow = false,
  interactive = false,
  children,
  className,
  ...props
}) => {
  const cardClasses = cn(
    cardVariants[variant],
    sizeVariants[size],
    "relative overflow-hidden transition-all duration-300",
    glow && "shadow-xl",
    interactive && "cursor-pointer",
    className
  );

  const motionProps = {
    ...props,
    className: cardClasses,
    ...(interactive && {
      variants: interactiveVariants,
      initial: "idle",
      whileHover: "hover",
      whileTap: "tap"
    }),
    ...(glow && glowAnimation)
  };

  return (
    <motion.div {...motionProps}>
      {/* Animated background gradient */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
              "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Neon border animation */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          animate={{
            boxShadow: [
              "inset 0 0 20px rgba(6, 182, 212, 0.2)",
              "inset 0 0 40px rgba(6, 182, 212, 0.4)",
              "inset 0 0 20px rgba(6, 182, 212, 0.2)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative elements */}
      {interactive && (
        <>
          <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60" />
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-40" />
        </>
      )}
    </motion.div>
  );
};

// Specialized card components
export const GlassCard: React.FC<Omit<ModernCardProps, 'variant'>> = (props) => (
  <ModernCard variant="glass" {...props} />
);

export const NeonCard: React.FC<Omit<ModernCardProps, 'variant'>> = (props) => (
  <ModernCard variant="neon" {...props} />
);

export const GradientCard: React.FC<Omit<ModernCardProps, 'variant'>> = (props) => (
  <ModernCard variant="gradient" {...props} />
);

export const InteractiveCard: React.FC<Omit<ModernCardProps, 'interactive'>> = (props) => (
  <ModernCard interactive {...props} />
);
