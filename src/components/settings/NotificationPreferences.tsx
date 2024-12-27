import React, { useState } from 'react';

export const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSave = () => {
    // Save preferences to backend or local storage
    console.log('Preferences saved:', preferences);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Email Notifications</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={preferences.smsNotifications}
            onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">SMS Notifications</label>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}; 
