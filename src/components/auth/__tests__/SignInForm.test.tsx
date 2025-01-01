import { render, screen, fireEvent } from '@testing-library/react';
import { SignInForm } from '@/components/auth/SignInForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('SignInForm', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('submits form with email and password', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false,
    });
  });

  test('displays error message on failed sign in', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
}); 
