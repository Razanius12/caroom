'use client';

import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setPosts, deletePost } from '@/app/lib/features/postSlice';

export default function PostsPage() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        dispatch(setPosts(data));
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchPosts();
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      dispatch(deletePost(id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Home
      </Link>
      <h1>Posts</h1>

      {session && (
        <Link href={`/posts/add`}>
          <button className="bg-yellow-500 text-white p-2 rounded mr-2">
            Create Post
          </button>
        </Link>
      )}


      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-blue-500 hover:underline">{post.title}</h2>
            </Link>
            <p>{post.content}</p>
            <p>By: {post.user_name}</p>
            <p>Car: {post.car_make} {post.car_model}</p>
            <p>Type: {post.type}</p>
            {session?.user?.name === post.user_name && (
              <Link href={`/posts/${post.id}/edit`}>
                <button className="bg-yellow-500 text-white p-2 rounded mr-2">
                  Edit
                </button>
              </Link>
            )}
            {session?.user?.name === post.user_name && (
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}