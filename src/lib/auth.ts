import { hash, compare } from 'bcryptjs';
import { AuthOptions } from "next-auth";

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export const authOptions: AuthOptions = {
  // Your NextAuth.js configuration here
  providers: [],
  session: {
    strategy: 'jwt'
  },
  // ... other options
}; 