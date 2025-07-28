import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { authOptions } from '@/app/api/auth/auth.config';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
  interface User {
    id: string;
    email: string;
    name: string;
  }
  interface JWT {
    id: string;
    email: string;
    name: string;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };