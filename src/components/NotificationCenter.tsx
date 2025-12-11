import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  Users,
  Star,
} from "lucide-react";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "../services/socialService";
import { Notification } from "../types/social";
import { useAuth } from "../context/AuthContext";
import { formatTimeAgo } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();

    // Polling para novas notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      if (!user) return;
      const notifs = await getUserNotifications(user.uid);
      // Verificar se notifs é um array válido e filtrar notificações inválidas
      if (Array.isArray(notifs)) {
        const validNotifications = notifs.filter(
          (notif) => notif && typeof notif === "object" && notif.id,
        );
        setNotifications(validNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      setNotifications([]);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // A função markNotificationAsRead precisa ser ajustada ou criada uma nova versão
      // await markNotificationAsRead(getUserId(), notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToUserProfile = (
    fromUserId: string,
  ) => {
    if (!fromUserId) return;
    navigate(`/user/${fromUserId}`);
    setIsOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_follower":
        return <Users size={16} className="text-blue-400" />;
      case "activity_update":
        return <Star size={16} className="text-yellow-400" />;
      case "follow_request":
        return <Users size={16} className="text-purple-400" />;
      default:
        return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-3 hover:bg-slate-700 rounded-lg transition-colors touch-target"
      >
        {unreadCount > 0 ? (
          <BellRing className="text-yellow-400" size={20} />
        ) : (
          <Bell className="text-slate-400" size={20} />
        )}

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-800 rounded-xl border border-white/20 shadow-xl z-50 animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/20">
            <h3 className="text-white font-semibold text-sm sm:text-base">
              Notificações
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50 touch-target"
                >
                  <CheckCheck size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white touch-target"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications
                .slice(0, 10)
                .filter(Boolean)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 border-b border-white/10 hover:bg-slate-700/30 transition-colors ${!notification.read ? "bg-purple-500/5" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
                        onClick={() =>
                          navigateToUserProfile(
                            notification.fromUserId || "",
                          )
                        }
                      >
                        {notification.fromUserAvatar ? (
                          <img
                            src={notification.fromUserAvatar}
                            alt={notification.fromUserName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (notification.fromUserName || "?")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">
                              {notification.title || "Notificação"}
                            </p>
                            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                              {notification.message ||
                                "Nova notificação recebida"}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                className="text-purple-400 hover:text-purple-300 touch-target"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          {getNotificationIcon(notification.type || "default")}
                          <span className="text-xs text-slate-500 capitalize">
                            {notification.type?.replace("_", " ") ||
                              "notificação"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <Bell
                  size={40}
                  className="mx-auto mb-3 sm:mb-4 text-slate-500 opacity-50"
                />
                <p className="text-slate-400 text-sm sm:text-base">
                  Nenhuma notificação
                </p>
              </div>
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-3 text-center border-t border-white/20">
              <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm touch-target">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
