import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '../definitions';

interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
};

export const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
    },
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.cars.findIndex(car => car.id === action.payload.id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
    deleteCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter(car => car.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCars, addCar, updateCar, deleteCar, setLoading, setError } = carSlice.actions;
export default carSlice.reducer;