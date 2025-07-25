import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectivityErrorProps {
  onRetry?: () => void;
  className?: string;
}

export const ConnectivityError: React.FC<ConnectivityErrorProps> = ({
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30"
      >
        <WifiOff className="text-red-400" size={32} />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Problema de Conectividade
      </h3>
      
      <p className="text-white/60 mb-6 max-w-md">
        Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
        >
          <RefreshCw size={18} />
          Tentar Novamente
        </motion.button>
      )}
      
      <div className="mt-8 flex items-center gap-2 text-white/40 text-sm">
        <Wifi size={16} />
        <span>Verificando conectividade...</span>
      </div>
    </motion.div>
  );
};

export default ConnectivityError;
