export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar_url: string;
  join_date: string;
};

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  image_url: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  car_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  // Type can be: 'discussion', 'review', 'question', 'news'
  type: 'discussion' | 'review' | 'question' | 'news';
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type CarStats = {
  month: string;
  posts: number;
  active_users: number;
};

export type LatestPost = {
  id: string;
  title: string;
  user_name: string;
  user_avatar: string;
  created_at: string;
};

export type PostsTable = {
  id: string;
  title: string;
  user_name: string;
  car_make: string;
  car_model: string;
  created_at: string;
  type: 'discussion' | 'review' | 'question' | 'news';
  likes: number;
};