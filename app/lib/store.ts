import { configureStore } from '@reduxjs/toolkit';
import carReducer from '@/app/lib/features/carSlice';
import postReducer from '@/app/lib/features/postSlice';
import commentReducer from '@/app/lib/features/commentSlice';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    posts: postReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;