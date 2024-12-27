import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-bold text-neutral-text-primary sm:text-5xl md:text-6xl">
                  <span className="block">Learn Smarter with</span>
                  <span className="block text-primary-main">Learnify</span>
                </h1>
                <p className="mt-3 text-base text-neutral-text-secondary sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Personalized learning experiences for students aged 6-14.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center gap-4">
                  {session ? (
                    <Button onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}>
                      Sign In
                    </Button>
                  )}
                  <Link href="/about">
                    <Button variant="secondary" size="lg">Learn More</Button>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
