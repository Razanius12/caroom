'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { addPost } from '@/app/lib/features/postSlice';
import { setCars } from '@/app/lib/features/carSlice';

export default function AddPostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cars } = useSelector((state: RootState) => state.cars);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        dispatch(setCars(data));
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      }
    };
    fetchCars();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const postData = {
      title: formData.get('title'),
      content: formData.get('content'),
      car_id: formData.get('car_id'),
      type: formData.get('type')
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add post');
      }

      const newPost = await response.json();
      dispatch(addPost(newPost));
      router.push('/posts');
    } catch (error) {
      console.error('Error adding post:', error);
      // You might want to add some UI feedback here
      alert(error instanceof Error ? error.message : 'Failed to add post');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Post</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" name="title" placeholder="Title" required className="p-2 border rounded" />
        <textarea name="content" placeholder="Content" required className="p-2 border rounded"></textarea>

        <select name="car_id" required className="p-2 border rounded">
          <option value="">Select a car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.make} {car.model}
            </option>
          ))}
        </select>

        <select name="type" required className="p-2 border rounded">
          <option value="">Select post type</option>
          <option value="discussion">Discussion</option>
          <option value="review">Review</option>
          <option value="question">Question</option>
          <option value="news">News</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Post</button>
      </form>
      <Link href="/posts" className="mt-4 inline-block bg-gray-500 text-white p-2 rounded">
        Back to Posts
      </Link>
    </div>
  );
}