import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/app/lib/features/counterSlice';
import carReducer from '@/app/lib/features/carSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cars: carReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;