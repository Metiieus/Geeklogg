import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Wifi, WifiOff } from 'lucide-react';
import { getDB, getAuth, isFirebaseOffline } from '../firebase';

interface FirebaseStatusProps {
  showStatus?: boolean;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ showStatus = true }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check Firebase status
    const checkFirebaseStatus = () => {
      const db = getDB();
      const auth = getAuth();
      const offline = isFirebaseOffline();
      setIsFirebaseConnected(!offline && !!db && !!auth);
    };

    // Check initial status
    checkFirebaseStatus();

    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      // Recheck Firebase status when coming back online
      setTimeout(checkFirebaseStatus, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsFirebaseConnected(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic Firebase status check
    const interval = setInterval(checkFirebaseStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!showStatus) return null;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        message: 'Sem conexão com internet',
        description: 'Dados salvos localmente',
      };
    }

    if (!isFirebaseConnected) {
      return {
        icon: CloudOff,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        message: 'Modo offline',
        description: 'Dados salvos localmente',
      };
    }

    return {
      icon: Cloud,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      message: 'Conectado',
      description: 'Dados sincronizados',
    };
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <>
      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${status.bgColor} ${status.borderColor} backdrop-blur-sm shadow-lg`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className={`w-5 h-5 ${status.color}`} />
          <div className="min-w-0">
            <p className={`font-medium text-sm ${status.color}`}>
              {status.message}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {status.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Connection Change Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${status.bgColor} ${status.borderColor} backdrop-blur-sm shadow-xl`}>
              <Icon className={`w-6 h-6 ${status.color}`} />
              <div>
                <p className={`font-semibold ${status.color}`}>
                  {isOnline ? 'Conexão restaurada' : 'Conexão perdida'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isOnline && isFirebaseConnected 
                    ? 'Dados serão sincronizados automaticamente'
                    : 'Seus dados estão seguros localmente'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FirebaseStatus;
