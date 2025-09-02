import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Wifi, WifiOff, TestTube } from 'lucide-react';
import { db, auth, isFirebaseOffline } from '../firebase';
import { logConnectivityStatus } from '../utils/connectivityTest';

interface FirebaseStatusProps {
  showStatus?: boolean;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ showStatus = true }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check Firebase status
    const checkFirebaseStatus = () => {
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

  const handleTest = async () => {
    try {
      await logConnectivityStatus();
    } catch (error) {
      console.error('Failed to run connectivity test:', error);
    }
  };

  return (
    <>
      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${status.bgColor} ${status.borderColor} backdrop-blur-sm shadow-lg cursor-pointer`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsExpanded(!isExpanded)}
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

          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTest();
                }}
                className="ml-2 p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                title="Run connectivity test"
              >
                <TestTube className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </motion.button>
            )}
          </AnimatePresence>
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
