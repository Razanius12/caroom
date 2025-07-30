import Link from 'next/link';

export default function Home() {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold">Welcome to the Forum</h1>
      <p className="mt-2 text-gray-600">Explore discussions and share your thoughts!</p>
      <Link href="/posts" className="mt-5 inline-block bg-primary text-white p-2 rounded text-decoration-none">
        Go to Posts
      </Link>
      <br />
      <br />
      <Link href="/cars" className="mt-5 inline-block bg-primary text-white p-2 rounded text-decoration-none">
        Car List
      </Link>
    </div>
  );
}
