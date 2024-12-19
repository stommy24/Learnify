'use client';

import { useState } from 'react';
import AvatarSelector from '@/components/profile/AvatarSelector';
import { useRouter } from 'next/navigation';

type UserWithProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarId: string | null;
  role: string;
  studentProfile: {
    currentLevel: string;
    xpPoints: number;
  } | null;
};

interface ProfileFormProps {
  user: UserWithProfile;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [avatarId, setAvatarId] = useState(user.avatarId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          avatarId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </label>

        <div>
          <span className="block text-gray-700 mb-2">Avatar</span>
          <AvatarSelector
            currentAvatarId={avatarId}
            onSelect={setAvatarId}
          />
        </div>

        {user.studentProfile && (
          <div>
            <span className="block text-gray-700">Current Level</span>
            <span className="block mt-1 text-lg font-medium">
              {user.studentProfile.currentLevel}
            </span>
            <span className="block text-gray-700 mt-2">XP Points</span>
            <span className="block mt-1 text-lg font-medium">
              {user.studentProfile.xpPoints}
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 