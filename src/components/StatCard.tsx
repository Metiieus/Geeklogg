import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'red';
  subtitle?: string;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-400',
    shadow: 'hover:shadow-blue-500/20',
  },
  green: {
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    text: 'text-green-400',
    shadow: 'hover:shadow-green-500/20',
  },
  yellow: {
    bg: 'from-yellow-500/10 to-orange-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-400',
    text: 'text-yellow-400',
    shadow: 'hover:shadow-yellow-500/20',
  },
  purple: {
    bg: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    text: 'text-purple-400',
    shadow: 'hover:shadow-purple-500/20',
  },
  pink: {
    bg: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/20',
    icon: 'text-pink-400',
    text: 'text-pink-400',
    shadow: 'hover:shadow-pink-500/20',
  },
  red: {
    bg: 'from-red-500/10 to-orange-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    text: 'text-red-400',
    shadow: 'hover:shadow-red-500/20',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}) => {
  const colors = colorClasses[color];

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-xl p-4 border ${colors.border} hover:scale-[1.02] transition-all duration-300 hover:shadow-lg ${colors.shadow} group cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`${colors.icon} group-hover:scale-110 transition-transform`} size={20} />
        <span className={`${colors.text} font-medium text-sm`}>{label}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
