import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to the Forum</h1>
      <p className="mt-2 text-gray-600">Explore discussions and share your thoughts!</p>
      <Link href="/posts" className="mt-4 inline-block bg-blue-500 text-white p-2 rounded">
        Go to Posts
      </Link>
      <br />
      <Link href="/cars" className="mt-4 inline-block bg-blue-500 text-white p-2 rounded">
        Car List
      </Link>
    </div>
  );
}
