import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, X, Filter } from 'lucide-react';
import { colors, glassmorphism, typography, animations } from '../tokens';

// ============= GLASS INPUT =============

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  variant?: 'default' | 'search' | 'light';
  onClear?: () => void;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({
  icon = <Search size={18} />,
  label,
  error,
  variant = 'default',
  className = '',
  onClear,
  value,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const variantClasses = {
    default: `${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}`,
    search: `${glassmorphism.backdrop} bg-white/5 border border-white/10`,
    light: `${glassmorphism.light.backdrop} ${glassmorphism.light.background} ${glassmorphism.light.border}`,
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/90 mb-2">
          {label}
        </label>
      )}
      
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? `0 0 0 2px ${colors.primary.cyan}40, 0 8px 32px -8px ${colors.primary.cyan}30`
            : '0 4px 16px -4px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative rounded-xl overflow-hidden
          ${variantClasses[variant]}
          ${error ? 'border-red-500/50' : ''}
          transition-all duration-200
        `}
      >
        {/* Icon */}
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10">
          <div className={`text-white/60 transition-colors duration-200 ${isFocused ? 'text-cyan-400' : ''}`}>
            {icon}
          </div>
        </div>

        {/* Input */}
        <input
          ref={ref}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-transparent text-white placeholder-white/50
            focus:outline-none focus:placeholder-white/70
            transition-all duration-200 text-sm sm:text-base
          `}
          style={{ fontFamily: typography.fontFamily.primary }}
          {...props}
        />

        {/* Clear Button */}
        {value && onClear && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 touch-target"
          >
            <X size={16} />
          </motion.button>
        )}

        {/* Focus Ring */}
        <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-xl border-2 border-cyan-400/50 pointer-events-none"
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

// ============= GLASS SELECT =============

interface GlassSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  label,
  icon = <Filter size={18} />,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/90 mb-2">
          {label}
        </label>
      )}

      <motion.div
        animate={{
          scale: isFocused || isOpen ? 1.02 : 1,
          boxShadow: isFocused || isOpen
            ? `0 0 0 2px ${colors.primary.violet}40, 0 8px 32px -8px ${colors.primary.violet}30`
            : '0 4px 16px -4px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative
          ${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}
          rounded-xl overflow-hidden cursor-pointer
          transition-all duration-200
        `}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Selected Value */}
        <div className="flex items-center h-12 px-4">
          <div className={`text-white/60 mr-3 transition-colors duration-200 ${isOpen ? 'text-violet-400' : ''}`}>
            {icon}
          </div>
          
          <span className={`flex-1 text-white ${!selectedOption ? 'text-white/50' : ''}`}>
            {selectedOption?.label || placeholder}
          </span>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/60"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>

        {/* Focus Ring */}
        <motion.div
          animate={{
            opacity: isFocused || isOpen ? 1 : 0,
            scale: isFocused || isOpen ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-xl border-2 border-violet-400/50 pointer-events-none"
        />
      </motion.div>

      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          scale: isOpen ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
        className={`
          absolute top-full left-0 right-0 mt-2 z-50
          ${glassmorphism.backdrop} ${glassmorphism.background} ${glassmorphism.border}
          rounded-xl shadow-2xl overflow-hidden
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        <div className="max-h-64 overflow-y-auto">
          {options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left text-white hover:bg-white/10
                transition-all duration-150 border-b border-white/5 last:border-b-0
                ${value === option.value ? 'bg-white/10 text-cyan-400' : ''}
              `}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// ============= GLASS FILTER BAR =============

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface GlassFilterBarProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export const GlassFilterBar: React.FC<GlassFilterBarProps> = ({
  options,
  selected,
  onChange,
  className = '',
}) => {
  const toggleFilter = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        
        return (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFilter(option.id)}
            className={`
              relative px-4 py-2 rounded-full border transition-all duration-200
              ${glassmorphism.backdrop}
              ${isSelected 
                ? 'bg-gradient-to-r from-violet-500/30 to-cyan-500/30 border-violet-400/50 text-white shadow-lg' 
                : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30'
              }
            `}
            style={{ fontFamily: typography.fontFamily.primary }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {option.label}
              {option.count !== undefined && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${isSelected ? 'bg-white/20' : 'bg-white/10'}
                `}>
                  {option.count}
                </span>
              )}
            </span>

            {/* Selected Ring */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default GlassInput;
