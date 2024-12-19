import React from 'react';
import { useForm } from 'react-hook-form';

interface NotificationSettingsProps {
  settings: {
    email: boolean;
    push: boolean;
    frequency: string;
    types: string[];
  };
  onUpdate: (settings: any) => Promise<void>;
  loading: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdate,
  loading
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: settings
  });

  return (
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-6">
      <h2 className="text-lg font-semibold">Notification Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('email')}
            className="rounded border-gray-300"
          />
          <label className="text-sm text-gray-700">
            Email Notifications
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('push')}
            className="rounded border-gray-300"
          />
          <label className="text-sm text-gray-700">
            Push Notifications
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notification Frequency
          </label>
          <select
            {...register('frequency')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Types
          </label>
          <div className="space-y-2">
            {['progress', 'achievements', 'system', 'alerts'].map(type => (
              <div key={type} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('types')}
                  value={type}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-700 capitalize">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
}; 