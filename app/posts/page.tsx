'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setPosts, deletePost } from '@/app/lib/features/postSlice';

export default function PostsPage() {
  const dispatch = useDispatch();
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
    <div>
      <h1>Posts</h1>
      <Link href={`/posts/add`}>
        <button className="bg-yellow-500 text-white p-2 rounded mr-2">
          Create Post
        </button>
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>By: {post.user_name}</p>
            <p>Car: {post.car_make} {post.car_model}</p>
            <p>Type: {post.type}</p>
            <Link href={`/posts/${post.id}/edit`}>
              <button className="bg-yellow-500 text-white p-2 rounded mr-2">
                Edit
              </button>
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}