import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { UserRole } from '@/types/prisma';

interface User {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
}

type UserWithRole = User & { role: UserRole };

// Mock the credentials provider
const mockCredentialsProvider = {
  id: 'credentials',
  name: 'Credentials',
  type: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials: { email: string; password: string }) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Invalid credentials');
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    }) as UserWithRole | null;

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
};

describe('Authentication', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await prisma.user.deleteMany();
    vi.clearAllMocks();
  });

  describe('Credentials Provider', () => {
    it('should authenticate valid credentials', async () => {
      // Create a test user
      const password = 'testpassword';
      const hashedPassword = await hash(password, 10);
      
      const userData = {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'student',
      } as const;
      
      const user = await prisma.user.create({
        data: userData
      }) as UserWithRole;

      // Attempt to authenticate
      const credentials = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const result = await mockCredentialsProvider.authorize(credentials);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'student',
      });
    });

    it('should reject invalid credentials', async () => {
      await expect(
        mockCredentialsProvider.authorize({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Session Handling', () => {
    it('should include user role in session', async () => {
      const token = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'student' as const,
      };

      const session = await authOptions.callbacks!.session!({
        session: { user: {} } as any,
        token,
      } as any);

      expect(session.user).toEqual({
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      });
    });
  });
}); 