import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface SubscriptionBadgeProps {
  tier: 'free' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (tier === 'premium') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} 
        bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 
        text-slate-900 shadow-lg shadow-amber-500/50 
        border-2 border-yellow-300
        animate-pulse-slow`}
      >
        <Crown size={iconSizes[size]} className="fill-current" />
        {showLabel && <span>PREMIUM</span>}
        <Sparkles size={iconSizes[size] - 2} className="animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}
      bg-gradient-to-r from-slate-600 to-slate-700 
      text-slate-200 
      border border-slate-500`}
    >
      {showLabel && <span>FREE</span>}
    </div>
  );
};
