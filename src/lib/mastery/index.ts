import { PrismaClient } from '@prisma/client';
import { StudentErrorTracker } from './StudentErrorTracker';

const prisma = new PrismaClient();
export const errorTracker = new StudentErrorTracker(prisma); 