'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setPosts, deletePost } from '@/app/lib/features/postSlice';

export default function ViewPostPage(context: { params: Promise<{ id: string }> }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);
  const router = useRouter();
  const { id } = React.use(context.params);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      dispatch(setPosts([data]));
    };
    fetchPost();
  }, [id, dispatch]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    dispatch(deletePost(id));
    redirect('/posts');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const post = posts[0];

  return (
    <div className="container mx-auto p-4">
      <Link href="/posts" className="text-blue-500 hover:underline">
        Back to Posts
      </Link>
      <h1>{post.title}</h1>
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
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded"
        >
          Delete
        </button>
      )}
    </div>
  );
}