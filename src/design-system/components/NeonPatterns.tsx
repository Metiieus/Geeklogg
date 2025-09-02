import React from "react";
import { motion } from "framer-motion";
import { colors } from "../tokens";

// ============= TRIBAL DIVIDER PATTERN =============

interface TribalDividerProps {
  variant?: "default" | "minimal" | "complex";
  color?: keyof typeof colors.primary;
  opacity?: number;
  className?: string;
  animated?: boolean;
}

export const TribalDivider: React.FC<TribalDividerProps> = ({
  variant = "default",
  color = "cyan",
  opacity = 0.6,
  className = "",
  animated = true,
}) => {
  const colorValue = colors.primary[color];

  const patterns = {
    default: (
      <svg viewBox="0 0 400 60" className="w-full h-full">
        <defs>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main tribal pattern */}
        <path
          d="M0,30 Q50,10 100,30 T200,30 Q250,45 300,30 T400,30"
          stroke={colorValue}
          strokeWidth="2"
          fill="none"
          opacity={opacity}
          filter={`url(#glow-${color})`}
        />

        {/* Secondary lines */}
        <path
          d="M20,40 Q70,20 120,40 T220,40 Q270,55 320,40 T400,40"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.7}
        />

        {/* Accent dots */}
        <circle cx="100" cy="30" r="2" fill={colorValue} opacity={opacity} />
        <circle cx="200" cy="30" r="2" fill={colorValue} opacity={opacity} />
        <circle cx="300" cy="30" r="2" fill={colorValue} opacity={opacity} />
      </svg>
    ),

    minimal: (
      <svg viewBox="0 0 400 40" className="w-full h-full">
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={colorValue} stopOpacity="0" />
            <stop offset="50%" stopColor={colorValue} stopOpacity={opacity} />
            <stop offset="100%" stopColor={colorValue} stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1="0"
          y1="20"
          x2="400"
          y2="20"
          stroke={`url(#gradient-${color})`}
          strokeWidth="2"
        />

        {/* Central ornament */}
        <g transform="translate(200,20)">
          <circle r="4" fill={colorValue} opacity={opacity} />
          <circle
            r="8"
            fill="none"
            stroke={colorValue}
            strokeWidth="1"
            opacity={opacity * 0.5}
          />
        </g>
      </svg>
    ),

    complex: (
      <svg viewBox="0 0 400 80" className="w-full h-full">
        <defs>
          <filter id={`complex-glow-${color}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central flowing line */}
        <path
          d="M0,40 Q60,15 120,40 Q180,65 240,40 Q300,15 360,40 L400,40"
          stroke={colorValue}
          strokeWidth="3"
          fill="none"
          opacity={opacity}
          filter={`url(#complex-glow-${color})`}
        />

        {/* Upper ornamental line */}
        <path
          d="M50,25 Q100,10 150,25 Q200,10 250,25 Q300,10 350,25"
          stroke={colorValue}
          strokeWidth="1.5"
          fill="none"
          opacity={opacity * 0.8}
        />

        {/* Lower ornamental line */}
        <path
          d="M50,55 Q100,70 150,55 Q200,70 250,55 Q300,70 350,55"
          stroke={colorValue}
          strokeWidth="1.5"
          fill="none"
          opacity={opacity * 0.8}
        />

        {/* Tribal symbols */}
        <g transform="translate(120,40)" opacity={opacity}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={colorValue} />
        </g>

        <g transform="translate(240,40)" opacity={opacity}>
          <polygon points="0,-8 6,0 0,8 -6,0" fill={colorValue} />
        </g>

        {/* Corner flourishes */}
        <g transform="translate(40,40)" opacity={opacity * 0.6}>
          <path
            d="M-10,-10 Q0,-5 10,-10 Q5,0 10,10 Q0,5 -10,10 Q-5,0 -10,-10 Z"
            stroke={colorValue}
            strokeWidth="1"
            fill="none"
          />
        </g>

        <g transform="translate(360,40)" opacity={opacity * 0.6}>
          <path
            d="M-10,-10 Q0,-5 10,-10 Q5,0 10,10 Q0,5 -10,10 Q-5,0 -10,-10 Z"
            stroke={colorValue}
            strokeWidth="1"
            fill="none"
          />
        </g>
      </svg>
    ),
  };

  const PatternComponent = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { opacity: 0, scaleX: 0 },
        animate: { opacity: 1, scaleX: 1 },
        transition: { duration: 1.5, ease: "easeOut" },
      }
    : {};

  return (
    <PatternComponent
      className={`w-full h-16 ${className}`}
      {...animationProps}
    >
      {patterns[variant]}
    </PatternComponent>
  );
};

// ============= NEON ORNAMENT =============

interface NeonOrnamentProps {
  type?: "corner" | "center" | "side";
  color?: keyof typeof colors.primary;
  size?: "small" | "medium" | "large";
  opacity?: number;
  className?: string;
  animated?: boolean;
}

export const NeonOrnament: React.FC<NeonOrnamentProps> = ({
  type = "corner",
  color = "violet",
  size = "medium",
  opacity = 0.8,
  className = "",
  animated = true,
}) => {
  const colorValue = colors.primary[color];

  const sizeMap = {
    small: 80,
    medium: 120,
    large: 160,
  };

  const ornamentSize = sizeMap[size];

  const ornaments = {
    corner: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id={`ornament-glow-${color}-${type}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`ornament-gradient-${color}`}>
            <stop offset="0%" stopColor={colorValue} stopOpacity={opacity} />
            <stop
              offset="100%"
              stopColor={colorValue}
              stopOpacity={opacity * 0.3}
            />
          </radialGradient>
        </defs>

        {/* Corner flourish */}
        <path
          d="M10,10 Q30,5 50,10 Q70,15 90,10 Q85,30 90,50 Q85,70 90,90 Q70,85 50,90 Q30,85 10,90 Q15,70 10,50 Q15,30 10,10 Z"
          stroke={colorValue}
          strokeWidth="2"
          fill={`url(#ornament-gradient-${color})`}
          opacity={opacity}
          filter={`url(#ornament-glow-${color}-${type})`}
        />

        {/* Inner pattern */}
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.7}
        />

        <circle
          cx="50"
          cy="50"
          r="10"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.5}
        />

        {/* Central dot */}
        <circle cx="50" cy="50" r="2" fill={colorValue} opacity={opacity} />
      </svg>
    ),

    center: (
      <svg viewBox="0 0 120 60" className="w-full h-full">
        <defs>
          <filter id={`center-glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central mandala-like pattern */}
        <g transform="translate(60,30)">
          <circle
            r="20"
            stroke={colorValue}
            strokeWidth="2"
            fill="none"
            opacity={opacity}
            filter={`url(#center-glow-${color})`}
          />
          <circle
            r="15"
            stroke={colorValue}
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.8}
          />
          <circle
            r="10"
            stroke={colorValue}
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.6}
          />
          <circle
            r="5"
            stroke={colorValue}
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.4}
          />

          {/* Radiating lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="0"
              y1="-25"
              x2="0"
              y2="-30"
              stroke={colorValue}
              strokeWidth="2"
              opacity={opacity * 0.7}
              transform={`rotate(${angle})`}
            />
          ))}

          {/* Central star */}
          <polygon
            points="0,-8 2,0 8,0 3,5 5,12 0,8 -5,12 -3,5 -8,0 -2,0"
            fill={colorValue}
            opacity={opacity}
          />
        </g>
      </svg>
    ),

    side: (
      <svg viewBox="0 0 40 120" className="w-full h-full">
        <defs>
          <filter id={`side-glow-${color}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Vertical flowing pattern */}
        <path
          d="M20,10 Q30,30 20,50 Q10,70 20,90 Q30,110 20,120"
          stroke={colorValue}
          strokeWidth="3"
          fill="none"
          opacity={opacity}
          filter={`url(#side-glow-${color})`}
        />

        {/* Side ornaments */}
        <circle
          cx="20"
          cy="30"
          r="3"
          fill={colorValue}
          opacity={opacity * 0.8}
        />
        <circle
          cx="20"
          cy="60"
          r="3"
          fill={colorValue}
          opacity={opacity * 0.8}
        />
        <circle
          cx="20"
          cy="90"
          r="3"
          fill={colorValue}
          opacity={opacity * 0.8}
        />

        {/* Flowing accents */}
        <path
          d="M15,20 Q25,25 15,30"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.6}
        />

        <path
          d="M25,40 Q15,45 25,50"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.6}
        />

        <path
          d="M15,80 Q25,85 15,90"
          stroke={colorValue}
          strokeWidth="1"
          fill="none"
          opacity={opacity * 0.6}
        />
      </svg>
    ),
  };

  const OrnamentComponent = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8, rotate: -10 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        transition: { duration: 1, ease: "easeOut", delay: 0.5 },
      }
    : {};

  return (
    <OrnamentComponent
      className={className}
      style={{ width: ornamentSize, height: ornamentSize }}
      {...animationProps}
    >
      {ornaments[type]}
    </OrnamentComponent>
  );
};

// ============= FLOATING PARTICLES =============

interface FloatingParticlesProps {
  count?: number;
  color?: keyof typeof colors.primary;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 12,
  color = "cyan",
  className = "",
}) => {
  const colorValue = colors.primary[color];

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: colorValue }}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [null, "-100px", "-200px"],
            opacity: [0, 0.8, 0],
            x: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default TribalDivider;
