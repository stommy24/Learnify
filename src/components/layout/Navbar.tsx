import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui';
import { Button } from '../ui/button';

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-neutral-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-main">
              Learnify
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <span className="text-neutral-text-secondary hover:text-neutral-text-primary">
                    Dashboard
                  </span>
                </Link>
                <Link href="/courses">
                  <span className="text-neutral-text-secondary hover:text-neutral-text-primary">
                    Courses
                  </span>
                </Link>
                <div className="relative group">
                  <Avatar
                    src={session.user?.image || undefined}
                    alt={session.user?.name || 'User avatar'}
                  />
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none invisible group-hover:visible">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-neutral-text-primary hover:bg-neutral-background">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-neutral-text-primary hover:bg-neutral-background">
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-text-primary hover:bg-neutral-background"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="default">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 