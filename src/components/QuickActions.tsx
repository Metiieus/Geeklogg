import React from 'react';
import { Plus, TrendingUp, BarChart3, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
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
      color: 'from-pink-500 to-purple-600',
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
      color: 'from-blue-500 to-cyan-600',
      action: () => navigate('/library'),
    },
    {
      id: 'view-stats',
      title: 'Ver Estatísticas',
      description: 'Analise seus dados',
      icon: <BarChart3 size={20} />,
      color: 'from-green-500 to-emerald-600',
      action: () => navigate('/statistics'),
    },
    {
      id: 'write-review',
      title: 'Escrever Resenha',
      description: 'Compartilhe sua opinião',
      icon: <BookOpen size={20} />,
      color: 'from-orange-500 to-red-600',
      action: () => navigate('/reviews'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="text-yellow-400" size={20} />
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={action.action}
      className={`relative overflow-hidden bg-gradient-to-br ${action.color} rounded-xl p-4 text-left group transition-all duration-300 hover:shadow-lg`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {action.icon}
          </div>
          <motion.div
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 0 }}
            whileHover={{ x: 5, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Zap size={16} className="text-white" />
          </motion.div>
        </div>

        <h4 className="text-white font-semibold text-sm mb-1">{action.title}</h4>
        <p className="text-white/80 text-xs">{action.description}</p>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-all duration-300"
        initial={false}
      />
    </motion.button>
  );
};
