import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaItem } from '../types';

interface ProgressChartProps {
  mediaItems: MediaItem[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ mediaItems }) => {
  // Prepara dados para o gráfico de mídias completadas por mês
  const completedByMonth = useMemo(() => {
    const last6Months: { [key: string]: number } = {};
    const today = new Date();

    // Inicializa últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      last6Months[key] = 0;
    }

    // Conta mídias completadas por mês
    mediaItems
      .filter((item) => item.status === 'completed' && item.updatedAt)
      .forEach((item) => {
        const date = new Date(item.updatedAt);
        const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (key in last6Months) {
          last6Months[key]++;
        }
      });

    return Object.entries(last6Months).map(([month, count]) => ({
      month,
      count,
    }));
  }, [mediaItems]);

  // Prepara dados para o gráfico de horas por semana
  const hoursByWeek = useMemo(() => {
    const last4Weeks: { [key: string]: number } = {};
    const today = new Date();

    // Inicializa últimas 4 semanas
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7 + today.getDay()));
      const key = `Sem ${4 - i}`;
      last4Weeks[key] = 0;
    }

    // Soma horas por semana
    mediaItems.forEach((item) => {
      if (!item.updatedAt || !item.hoursSpent) return;

      const date = new Date(item.updatedAt);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 28) {
        const weekIndex = Math.floor(diffDays / 7);
        const key = `Sem ${4 - weekIndex}`;
        if (key in last4Weeks) {
          last4Weeks[key] += item.hoursSpent;
        }
      }
    });

    return Object.entries(last4Weeks).map(([week, hours]) => ({
      week,
      hours: Math.round(hours * 10) / 10,
    }));
  }, [mediaItems]);

  // Calcula estatísticas de comparação
  const stats = useMemo(() => {
    const thisMonth = completedByMonth[completedByMonth.length - 1]?.count || 0;
    const lastMonth = completedByMonth[completedByMonth.length - 2]?.count || 0;
    const monthChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    const thisWeek = hoursByWeek[hoursByWeek.length - 1]?.hours || 0;
    const lastWeek = hoursByWeek[hoursByWeek.length - 2]?.hours || 0;
    const weekChange = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return {
      monthChange: Math.round(monthChange),
      weekChange: Math.round(weekChange),
      thisMonth,
      lastMonth,
      thisWeek,
      lastWeek,
    };
  }, [completedByMonth, hoursByWeek]);

  return (
    <div className="space-y-6">
      {/* Completed Media Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} />
              Mídias Completadas
            </h3>
            <p className="text-sm text-slate-400 mt-1">Últimos 6 meses</p>
          </div>
          {stats.monthChange !== 0 && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                stats.monthChange > 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <TrendingUp
                size={14}
                className={stats.monthChange < 0 ? 'rotate-180' : ''}
              />
              <span className="text-sm font-semibold">
                {Math.abs(stats.monthChange)}%
              </span>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={completedByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar
              dataKey="count"
              fill="url(#colorCompleted)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>

        {/* Comparison Text */}
        {stats.thisMonth > 0 && (
          <p className="text-sm text-slate-400 mt-3 text-center">
            Você completou <span className="text-white font-semibold">{stats.thisMonth}</span> {stats.thisMonth === 1 ? 'mídia' : 'mídias'} este mês
            {stats.lastMonth > 0 && (
              <span>
                {' '}vs{' '}
                <span className="text-white font-semibold">{stats.lastMonth}</span> no mês passado
              </span>
            )}
          </p>
        )}
      </motion.div>

      {/* Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="text-blue-400" size={20} />
              Horas Investidas
            </h3>
            <p className="text-sm text-slate-400 mt-1">Últimas 4 semanas</p>
          </div>
          {stats.weekChange !== 0 && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                stats.weekChange > 0
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <TrendingUp
                size={14}
                className={stats.weekChange < 0 ? 'rotate-180' : ''}
              />
              <span className="text-sm font-semibold">
                {Math.abs(stats.weekChange)}%
              </span>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hoursByWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="week"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Comparison Text */}
        {stats.thisWeek > 0 && (
          <p className="text-sm text-slate-400 mt-3 text-center">
            Você investiu <span className="text-white font-semibold">{stats.thisWeek}h</span> esta semana
            {stats.lastWeek > 0 && (
              <span>
                {' '}vs{' '}
                <span className="text-white font-semibold">{stats.lastWeek}h</span> na semana passada
              </span>
            )}
          </p>
        )}
      </motion.div>

      {/* Prediction Card */}
      {stats.thisMonth > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20"
        >
          <p className="text-sm text-slate-300 text-center">
            <span className="text-purple-400 font-semibold">📈 Previsão:</span> No ritmo atual, você completará cerca de{' '}
            <span className="text-white font-bold">{stats.thisMonth * 12}</span> mídias este ano!
          </p>
        </motion.div>
      )}
    </div>
  );
};
