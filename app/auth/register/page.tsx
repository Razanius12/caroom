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
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 72px)" }} // 72px = navbar height
    >
      <div className="card shadow rounded-4 p-4" style={{ minWidth: 350, maxWidth: 400 }}>
        <h1 className="h3 mb-3 fw-bold text-center">Create an account</h1>
        <p className="text-center text-muted mb-4">Join us today and get started</p>
        {error && (
          <div className="alert alert-danger py-2 text-center mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
          >
            Create account
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link href="/auth/login" className="link-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}