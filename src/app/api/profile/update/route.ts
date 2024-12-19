import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma, User } from '@prisma/client';

type UserResponse = Omit<User, 'password'> & {
  studentProfile: {
    currentLevel: string;
    xpPoints: number;
  } | null;
};

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, avatarId } = body;

    const user = await prisma.user.update({
      where: { 
        id: session.user.id 
      },
      data: {
        name: name || null,
        avatarId: avatarId || null,
      } as Prisma.UserUpdateInput
    });

    const responseData: UserResponse = {
      ...user,
      studentProfile: null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}