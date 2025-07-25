'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      router.push("/auth/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md grid gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}