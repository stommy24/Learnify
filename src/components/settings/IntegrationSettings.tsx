import React, { useState } from 'react';

export const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    slack: false
  });

  const handleSave = () => {
    // Save integration settings to backend or local storage
    console.log('Integrations saved:', integrations);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Integration Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={integrations.googleCalendar}
            onChange={(e) => setIntegrations({ ...integrations, googleCalendar: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Google Calendar</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={integrations.slack}
            onChange={(e) => setIntegrations({ ...integrations, slack: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Slack</label>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Integrations
        </button>
      </div>
    </div>
  );
}; 