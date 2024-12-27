import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      aria-label="Notifications"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}; 
