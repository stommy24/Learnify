import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { NotificationType, markAllAsRead, setFilters } from '../../features/notifications/notificationSlice';
import { NotificationList } from './NotificationList';
import { NotificationBell } from './NotificationBell';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, filters } = useAppSelector(
    state => state.notifications
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#notification-center')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleFilterChange = (type?: NotificationType, read?: boolean) => {
    dispatch(setFilters({ ...filters, type, read }));
  };

  return (
    <div id="notification-center" className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mt-4 flex gap-4">
              <select
                className="form-select text-sm border-gray-300 rounded-md"
                value={filters.type || 'all'}
                onChange={(e) => handleFilterChange(
                  e.target.value === 'all' ? undefined : e.target.value as NotificationType
                )}
              >
                <option value="all">All Types</option>
                <option value="assignment">Assignments</option>
                <option value="achievement">Achievements</option>
                <option value="reminder">Reminders</option>
                <option value="feedback">Feedback</option>
                <option value="progress">Progress</option>
                <option value="system">System</option>
              </select>

              <select
                className="form-select text-sm border-gray-300 rounded-md"
                value={filters.read === undefined ? 'all' : filters.read.toString()}
                onChange={(e) => handleFilterChange(
                  filters.type,
                  e.target.value === 'all' ? undefined : e.target.value === 'true'
                )}
              >
                <option value="all">All Status</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
            </div>
          </div>

          <NotificationList
            notifications={notifications}
            filters={filters}
            onClose={() => setIsOpen(false)}
          />

          <div className="p-4 border-t text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 