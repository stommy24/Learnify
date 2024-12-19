import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IconBell, IconUser } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <IconBell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <IconUser className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {session && (
        <button onClick={() => signOut()}>Sign Out</button>
      )}
    </header>
  );
}; 