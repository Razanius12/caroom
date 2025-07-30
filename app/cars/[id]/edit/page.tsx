'use client';
import React from 'react'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { updateCar } from '@/app/lib/features/carSlice';
import { Car } from '@/app/lib/definitions';

export default function EditCarPage(context: { params: Promise<{ id: string }> }) {
  const { id } = React.use(context.params);
  const dispatch = useDispatch();
  const router = useRouter();
  const car = useSelector((state: RootState) =>
    state.cars.cars.find((car) => car.id === id)
  );

  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: 2024,
    image_url: '',
  });

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedCar = await response.json();
      dispatch(updateCar(updatedCar));
      router.push('/cars');
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  return (
    <div className="container p-4">
      <Link href={`/cars/${id}`} className="text-decoration-none">
        Back to Car
      </Link>
      <h1 className="h2 mb-4">Edit Car</h1>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <input
          type="text"
          placeholder="Make"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-primary text-white p-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}