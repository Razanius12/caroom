import Link from 'next/link';

export function BackToHome() {
  return (
      <Link href="/" className="text-decoration-none">
        Back to Home
      </Link>
  );
}