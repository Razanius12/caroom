'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setCars, addCar, updateCar, deleteCar } from '@/app/lib/features/carSlice';
import { Car } from '@/app/lib/definitions';

export default function CarsPage() {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: 2024,
    image_url: '',
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      dispatch(setCars(data));
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cars', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (editMode) {
        dispatch(updateCar(data));
      } else {
        dispatch(addCar(data));
      }

      setFormData({ make: '', model: '', year: 2024, image_url: '' });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      dispatch(deleteCar(id));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cars Management</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-4">
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
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editMode ? 'Update Car' : 'Add Car'}
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 rounded">
            <h3>{car.make} {car.model} ({car.year})</h3>
            <img src={car.image_url || ''} alt={`${car.make} ${car.model}`} className="w-32 h-32 object-cover" />
            <div className="mt-2">
              <Link href={`/cars/${car.id}/edit`}>
                <button className="bg-yellow-500 text-white p-2 rounded mr-2">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(car.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}