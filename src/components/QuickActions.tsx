import React from 'react';
import { Plus, TrendingUp, BarChart3, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  action: () => void;
}

interface QuickActionsProps {
  onAddMedia?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAddMedia }) => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'add-media',
      title: 'Adicionar Mídia',
      description: 'Expanda sua biblioteca',
      icon: <Plus size={20} />,
      iconColor: 'text-purple-400',
      action: () => {
        if (onAddMedia) {
          onAddMedia();
        } else {
          navigate('/library');
        }
      },
    },
    {
      id: 'update-progress',
      title: 'Atualizar Progresso',
      description: 'Marque o que assistiu',
      icon: <TrendingUp size={20} />,
      iconColor: 'text-cyan-400',
      action: () => navigate('/library'),
    },
    {
      id: 'view-stats',
      title: 'Ver Estatísticas',
      description: 'Analise seus dados',
      icon: <BarChart3 size={20} />,
      iconColor: 'text-emerald-400',
      action: () => navigate('/statistics'),
    },
    {
      id: 'write-review',
      title: 'Escrever Resenha',
      description: 'Compartilhe sua opinião',
      icon: <BookOpen size={20} />,
      iconColor: 'text-amber-400',
      action: () => navigate('/reviews'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-yellow-400">⚡</span>
        <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <QuickActionButton key={action.id} action={action} index={index} />
        ))}
      </div>
    </div>
  );
};

// Quick Action Button Component
interface QuickActionButtonProps {
  action: QuickAction;
  index: number;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action, index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={action.action}
      className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-left group transition-all duration-300 hover:bg-slate-800/80 hover:border-white/20"
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 bg-slate-900/50 rounded-lg ${action.iconColor}`}>
            {action.icon}
          </div>
        </div>

        <h4 className="text-white font-semibold text-sm mb-1">{action.title}</h4>
        <p className="text-slate-400 text-xs">{action.description}</p>
      </div>

      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-300" />
    </motion.button>
  );
};
