const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'CarEnthusiast',
    email: 'car@enthusiast.com',
    password: '123456',
    avatar_url: '/avatars/user1.png',
    join_date: '2023-01-01',
  },
];

const cars = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    make: 'Toyota',
    model: 'Supra',
    year: 2021,
    image_url: '/cars/supra.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    make: 'Honda',
    model: 'Civic Type R',
    year: 2023,
    image_url: '/cars/civic.png',
  },
];

const posts = [
  {
    id: 'post1',
    user_id: users[0].id,
    car_id: cars[0].id,
    title: 'My New Supra Review',
    content: 'Just got my hands on the new Supra and here are my thoughts...',
    created_at: '2023-12-06',
    updated_at: '2023-12-06',
    likes: 45,
    type: 'review',
  },
];

const comments = [
  {
    id: 'comment1',
    post_id: 'post1',
    user_id: users[0].id,
    content: 'Great review! I agree with all points.',
    created_at: '2023-12-06',
  },
];

const forum_stats = [
  { month: 'Jan', posts: 156, active_users: 1200 },
  { month: 'Feb', posts: 134, active_users: 1100 },
  { month: 'Mar', posts: 187, active_users: 1300 },
];

export { users, cars, posts, comments, forum_stats };