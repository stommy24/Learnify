import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { PrismaClient, Prisma } from "@prisma/client";
import { UserRole } from "@/types/prisma";

interface AdapterUser {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaUserWithRole {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export function CustomPrismaAdapter(p: PrismaClient) {
  return {
    ...PrismaAdapter(p),
    getUser: async (id: string) => {
      const user = await p.user.findUnique({
        where: { id },
      }) as unknown as PrismaUserWithRole;
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      } satisfies AdapterUser;
    },
    createUser: async (data: Prisma.UserCreateInput) => {
      const user = await p.user.create({
        data: {
          ...data,
          role: "student",
        } as Prisma.UserCreateInput,
      }) as unknown as PrismaUserWithRole;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      } satisfies AdapterUser;
    },
    updateUser: async (data: Prisma.UserUpdateInput & { id: string }) => {
      const { id, ...rest } = data;
      const user = await p.user.update({
        where: { id },
        data: rest,
      }) as unknown as PrismaUserWithRole;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      } satisfies AdapterUser;
    },
  };
} 