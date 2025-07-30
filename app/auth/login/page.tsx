'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("An error occurred");
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 72px)" }} // 72px = navbar height
    >
      <div className="card shadow rounded-4 p-4" style={{ minWidth: 350, maxWidth: 400 }}>
        <h1 className="h3 mb-3 fw-bold text-center">Welcome back</h1>
        <p className="text-center text-muted mb-4">Please sign in to your account</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Sign in
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <Link href="/auth/register" className="link-primary">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}