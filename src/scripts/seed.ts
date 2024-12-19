import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashedpassword123', // In production, this should be properly hashed
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT'
    },
  });

  console.log('Created test user:', testUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 