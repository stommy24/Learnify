import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Create test users
    const users = await Promise.all(
      Array.from({ length: 10 }).map(async () => {
        return prisma.user.create({
          data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: await hashPassword('password123'),
            role: 'STUDENT',
            profile: {
              create: {
                bio: faker.lorem.paragraph(),
                avatar: faker.image.avatar()
              }
            }
          }
        });
      })
    );

    // Create test assessments
    await Promise.all(
      users.map(user => 
        prisma.assessment.createMany({
          data: Array.from({ length: 5 }).map(() => ({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            type: 'QUIZ',
            difficulty: 'INTERMEDIATE',
            questions: [],
            duration: 30,
            points: 100,
            userId: user.id
          }))
        })
      )
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 