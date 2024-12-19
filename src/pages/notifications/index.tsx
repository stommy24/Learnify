import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { NotificationList } from '@/components/notifications/NotificationList';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    read: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  const fetchNotifications = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/notifications?${queryParams}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <NotificationFilters 
          filters={filters}
          onChange={setFilters}
        />

        <NotificationList 
          notifications={notifications}
          onMarkAsRead={async (id) => {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            fetchNotifications();
          }}
        />
      </div>
    </MainLayout>
  );
} 