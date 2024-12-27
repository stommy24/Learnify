import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from '../SignInForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('SignInForm', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('submits the form with valid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on invalid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
}); 
