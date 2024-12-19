import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile/ProfileForm';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type UserWithProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarId: string | null;
  role: string;
  studentProfile: {
    currentLevel: string;
    xpPoints: number;
  } | null;
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { 
      id: session.user.id 
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const userForProfile: UserWithProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarId: null,
    role: 'student',
    studentProfile: null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
      <ProfileForm user={userForProfile} />
    </div>
  );
}