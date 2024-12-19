import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { wsClient } from '@/lib/websocket';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (session?.user) {
      // Connect to WebSocket
      wsClient.connect(session.user.id);

      // Subscribe to notifications
      wsClient.subscribe('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        toast.custom((t) => (
          <NotificationToast notification={notification} visible={t.visible} />
        ));
      });

      // Fetch existing notifications
      fetchNotifications();

      return () => {
        wsClient.disconnect();
      };
    }
  }, [session]);

  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications');
    const data = await response.json();
    setNotifications(data);
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 