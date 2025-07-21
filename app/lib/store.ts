import { configureStore } from '@reduxjs/toolkit';
import carReducer from '@/app/lib/features/carSlice';
import postReducer from '@/app/lib/features/postSlice';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;