import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostsTable } from '../definitions';

interface PostState {
  posts: PostsTable[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostsTable[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<PostsTable>) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action: PayloadAction<PostsTable>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost, setLoading, setError } = postSlice.actions;
export default postSlice.reducer;