import { ReactNode } from "react";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Caroom
            </Link>
            <div>
              {session?.user ? (
                <div className="flex items-center gap-4">
                  <span>Welcome, {session.user.name} </span>
                  <Link href="/api/auth/signout" className="text-blue-500 hover:underline">
                    Sign out
                  </Link>
                </div>
              ) : (
                <Link href="/auth/login" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </header>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}