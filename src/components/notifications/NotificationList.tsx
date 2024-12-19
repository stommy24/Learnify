import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { 
  Notification, 
  NotificationType,
  markAsRead,
  deleteNotification 
} from '../../features/notifications/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationListProps {
  notifications: Notification[];
  filters: {
    type?: NotificationType;
    read?: boolean;
  };
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  filters,
  onClose
}) => {
  const dispatch = useAppDispatch();

  const filteredNotifications = notifications.filter(notification => {
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.read !== undefined && notification.read !== filters.read) return false;
    return true;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.actionUrl) {
      onClose();
      window.location.href = notification.actionUrl;
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'assignment':
        return '📝';
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '⏰';
      case 'feedback':
        return '💬';
      case 'progress':
        return '📈';
      case 'system':
        return '⚙️';
      default:
        return '📌';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-50 border-blue-200';
      case 'achievement':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'feedback':
        return 'bg-purple-50 border-purple-200';
      case 'progress':
        return 'bg-indigo-50 border-indigo-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <AnimatePresence>
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications to display
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? 'bg-opacity-80' : 'bg-opacity-50'
              } hover:bg-opacity-100 transition-colors cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteNotification(notification.id));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Delete notification"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  {notification.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {notification.metadata.subject && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {notification.metadata.subject}
                        </span>
                      )}
                      {notification.metadata.dueDate && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                          Due: {new Date(notification.metadata.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {notification.metadata.score !== undefined && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                          Score: {notification.metadata.score}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}; 