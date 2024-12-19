import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconHome, IconChartBar, IconSettings, IconUsers, IconBook } from '@tabler/icons-react';

export const Sidebar: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: IconHome, path: '/' },
    { name: 'Question Generator', icon: IconBook, path: '/question-generator' },
    { name: 'Student Progress', icon: IconUsers, path: '/student-progress' },
    { name: 'Analytics', icon: IconChartBar, path: '/analytics' },
    { name: 'Settings', icon: IconSettings, path: '/settings' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Learnify</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map(item => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              router.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}; 