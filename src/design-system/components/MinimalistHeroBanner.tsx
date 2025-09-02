import React from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Star, Clock } from "lucide-react";

interface MinimalistHeroBannerProps {
  title: string;
  subtitle?: string;
  onAddMedia?: () => void;
  stats?: {
    total: number;
    completed: number;
    inProgress: number;
    avgRating: string;
  };
}

export const MinimalistHeroBanner: React.FC<MinimalistHeroBannerProps> = ({
  title,
  subtitle,
  onAddMedia,
  stats,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Hero Text */}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-6"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Quick Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total:
                  </span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                    {stats.total}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Concluídos:
                  </span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                    {stats.completed}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Média:
                  </span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                    {stats.avgRating}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Button */}
        {onAddMedia && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={onAddMedia}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Adicionar Mídia
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
