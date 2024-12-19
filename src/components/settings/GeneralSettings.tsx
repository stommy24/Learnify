import React from 'react';
import { useForm } from 'react-hook-form';

interface GeneralSettingsProps {
  settings: {
    language: string;
    theme: string;
    notifications: boolean;
    autoSave: boolean;
  };
  onUpdate: (settings: any) => Promise<void>;
  loading: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  settings,
  onUpdate,
  loading
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: settings
  });

  return (
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-6">
      <h2 className="text-lg font-semibold">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            {...register('language')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            {...register('theme')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('notifications')}
            className="rounded border-gray-300"
          />
          <label className="text-sm text-gray-700">
            Enable Notifications
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('autoSave')}
            className="rounded border-gray-300"
          />
          <label className="text-sm text-gray-700">
            Enable Auto-Save
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}; 