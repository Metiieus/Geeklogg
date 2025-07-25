import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Gamepad2, BookOpen, Film } from 'lucide-react';
import { gradients, colors, typography, shadows } from '../tokens';

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  onAddMedia?: () => void;
  className?: string;
}

const HERO_GRADIENTS = [
  {
    id: 'warmCold',
    name: 'Warm Cold',
    gradient: gradients.hero.warmCold,
    accent: colors.primary.magenta,
  },
  {
    id: 'intrigue',
    name: 'Intrigue',
    gradient: gradients.hero.intrigue,
    accent: colors.primary.violet,
  },
  {
    id: 'techOrganic',
    name: 'Tech Organic',
    gradient: gradients.hero.techOrganic,
    accent: colors.primary.cyan,
  },
];

const FLOATING_ICONS = [
  { Icon: Gamepad2, delay: 0 },
  { Icon: BookOpen, delay: 0.5 },
  { Icon: Film, delay: 1 },
  { Icon: Sparkles, delay: 1.5 },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Minha Biblioteca",
  subtitle = "Organize sua jornada geek com estilo e inteligência",
  onAddMedia,
  className = "",
}) => {
  const [currentGradient, setCurrentGradient] = useState(0);

  // Cycle through gradients every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % HERO_GRADIENTS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const activeGradient = HERO_GRADIENTS[currentGradient];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGradient}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl"
          style={{ background: activeGradient.gradient }}
        />
      </AnimatePresence>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-3xl" />

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOATING_ICONS.map(({ Icon, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, rotate: -10 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [-20, -60, -100],
              rotate: [-10, 10, -5],
              x: [0, Math.random() * 100 - 50, Math.random() * 50 - 25],
            }}
            transition={{
              duration: 6,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${20 + index * 20}%`,
              top: `${60 + Math.random() * 20}%`,
            }}
          >
            <Icon 
              size={24} 
              className="text-white/40"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{
              fontFamily: typography.fontFamily.primary,
              lineHeight: typography.lineHeight.tight,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            style={{
              fontFamily: typography.fontFamily.primary,
              lineHeight: typography.lineHeight.normal,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onAddMedia}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 20px 40px -10px ${activeGradient.accent}40`
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/25"
              style={{
                boxShadow: shadows.xl,
                fontFamily: typography.fontFamily.primary,
              }}
            >
              {/* Button Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${activeGradient.accent}20, transparent)`,
                  filter: 'blur(10px)',
                }}
              />
              
              {/* Plus Icon with Rotation */}
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Plus size={20} className="relative z-10" />
              </motion.div>
              
              <span className="relative z-10">Adicionar Mídia</span>
              
              {/* Sparkle Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={16} className="relative z-10 text-yellow-300" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Gradient Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center gap-2 mt-8"
          >
            {HERO_GRADIENTS.map((gradient, index) => (
              <motion.button
                key={gradient.id}
                onClick={() => setCurrentGradient(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-3 h-3 rounded-full border-2 border-white/50 transition-all duration-300 ${
                  index === currentGradient 
                    ? 'bg-white scale-110' 
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl" />
    </div>
  );
};

export default HeroBanner;
