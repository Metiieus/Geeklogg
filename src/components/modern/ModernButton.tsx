import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModernButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'neon' | 'minimal' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25",
  secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600/50 shadow-lg shadow-slate-500/10",
  ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500",
  gradient: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30",
  neon: "bg-slate-900/80 hover:bg-slate-800/80 text-cyan-400 border border-cyan-400/50 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40",
  minimal: "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/20 hover:border-slate-500/30",
  danger: "bg-red-600 hover:bg-red-700 text-white border border-red-500/50 shadow-lg shadow-red-500/25"
};

const sizeVariants = {
  xs: "px-2 py-1 text-xs rounded-md",
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-xl"
};

const buttonAnimation = {
  whileHover: { 
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  whileTap: { 
    scale: 0.98,
    transition: { type: "spring", stiffness: 600, damping: 30 }
  }
};

const glowAnimation = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.4)",
      "0 0 40px rgba(59, 130, 246, 0.6)",
      "0 0 20px rgba(59, 130, 246, 0.4)"
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const rippleVariants = {
  initial: { scale: 0, opacity: 0.6 },
  animate: { scale: 4, opacity: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  rounded = false,
  children,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const [isClicked, setIsClicked] = React.useState(false);

  const buttonClasses = cn(
    "relative inline-flex items-center justify-center font-medium transition-all duration-200 overflow-hidden",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    buttonVariants[variant],
    sizeVariants[size],
    rounded && "rounded-full",
    glow && "animate-pulse",
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    
    onClick?.(e);
  };

  const iconElement = icon && (
    <span className={cn(
      "flex items-center",
      children && iconPosition === 'left' && "mr-2",
      children && iconPosition === 'right' && "ml-2"
    )}>
      {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
    </span>
  );

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...buttonAnimation}
      {...(glow && glowAnimation)}
      {...props}
    >
      {/* Ripple effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-inherit"
          {...rippleVariants}
        />
      )}

      {/* Background gradient animation for gradient variant */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(45deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))"
          }}
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Neon glow effect */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          animate={{
            boxShadow: [
              "inset 0 0 10px rgba(6, 182, 212, 0.2)",
              "inset 0 0 20px rgba(6, 182, 212, 0.4)",
              "inset 0 0 10px rgba(6, 182, 212, 0.2)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center">
        {iconPosition === 'left' && iconElement}
        {children}
        {iconPosition === 'right' && iconElement}
      </span>

      {/* Loading overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-current/20 rounded-inherit flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="animate-spin text-current" size={20} />
        </motion.div>
      )}
    </motion.button>
  );
};

// Specialized button components
export const PrimaryButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="primary" {...props} />
);

export const GradientButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="gradient" {...props} />
);

export const NeonButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="neon" {...props} />
);

export const GhostButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="ghost" {...props} />
);

export const LoadingButton: React.FC<ModernButtonProps> = (props) => (
  <ModernButton loading {...props} />
);
