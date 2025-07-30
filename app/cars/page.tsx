'use client';

import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setCars, addCar, updateCar, deleteCar } from '@/app/lib/features/carSlice';
import { Car } from '@/app/lib/definitions';
import { BackToHome } from '../components/BackToHome';
import Loading from '../loading';

export default function CarsPage() {
  const { data: session } = useSession();
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
      const response = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.status === 400) {
        alert(data.error);
        return;
      }

      if (response.ok) {
        dispatch(deleteCar(id));
      } else {
        alert('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container p-4">
      <BackToHome />
      <h1 className="h2 mb-4">Car List</h1>

      {session && (
        <form onSubmit={handleSubmit} className="mb-2">
          <div className="d-grid gap-4">
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
            <button type="submit" className="bg-info p-2 rounded">
              {editMode ? 'Update Car' : 'Add Car'}
            </button>
          </div>
        </form>
      )}

      <div className="d-grid gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 rounded">
            <h3>{car.make} {car.model} ({car.year})</h3>

            {car.image_url && (
              <img src={car.image_url} alt={`${car.make} ${car.model}`} className="img-fluid mb-2" />
            )}

            {session && (
              <div className="mt-2">
                <Link href={`/cars/${car.id}/edit`}>
                  <button className="bg-warning p-2 rounded me-2">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-danger text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}