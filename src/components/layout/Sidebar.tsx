import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Courses', href: '/courses', icon: BookOpenIcon },
  { name: 'Progress', href: '/progress', icon: AcademicCapIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar = () => {
  const router = useRouter();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = router.pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
              ${isActive 
                ? 'bg-primary-main text-white' 
                : 'text-neutral-text-secondary hover:bg-primary-light/10 hover:text-primary-main'
              }
            `}
          >
            <item.icon 
              className={`mr-3 h-6 w-6 ${isActive ? 'text-white' : 'text-neutral-text-secondary group-hover:text-primary-main'}`} 
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}; 