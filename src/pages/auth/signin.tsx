import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral-text-primary">
            Welcome back to Learnify
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-text-secondary">
            Continue your learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-feedback-error text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-text-primary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-neutral-border shadow-sm focus:border-primary-main focus:ring-primary-main"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-text-primary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-neutral-border shadow-sm focus:border-primary-main focus:ring-primary-main"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>

          <div className="text-center">
            <Link href="/auth/signup" className="text-primary-main hover:text-primary-dark">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
} 


