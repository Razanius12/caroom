'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { updatePost } from '@/app/lib/features/postSlice';
import { setCars } from '@/app/lib/features/carSlice';

export default function EditPostPage(context: { params: Promise<{ id: string }> }) {
  const { id } = React.use(context.params);
  const dispatch = useDispatch();
  const router = useRouter();
  const { cars } = useSelector((state: RootState) => state.cars);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    car_id: '',
    type: ''
  });

  // Fetch cars and post data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cars first
        const carsResponse = await fetch('/api/cars');
        const carsData = await carsResponse.json();
        dispatch(setCars(carsData));

        // Then fetch post details
        const postResponse = await fetch(`/api/posts/${id}`);
        const postData = await postResponse.json();

        if (postData) {
          setFormData({
            title: postData.title || '',
            content: postData.content || '',
            car_id: postData.car_id || '',
            type: postData.type || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(updatePost(updatedPost));
        router.push('/posts');
      } else {
        console.error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href={`/posts/${id}`} className="text-blue-500 hover:underline">
        Back to Post
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="p-2 border rounded"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          className="p-2 border rounded min-h-[200px]"
        />

        <select
          name="car_id"
          value={formData.car_id}
          onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
          required
          className="p-2 border rounded"
        >
          <option value="">Select a car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.make} {car.model}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
          className="p-2 border rounded"
        >
          <option value="">Select a type</option>
          <option value="discussion">Discussion</option>
          <option value="review">Review</option>
          <option value="question">Question</option>
          <option value="news">News</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Post
        </button>
      </form>
    </div>
  );
}