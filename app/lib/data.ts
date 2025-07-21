import postgres from 'postgres';
import { CarStats, LatestPost, PostsTable } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchForumStats() {
  try {
    const data = await sql<CarStats[]>`SELECT * FROM forum_stats`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch forum statistics.');
  }
}

export async function fetchLatestPosts() {
  try {
    const data = await sql<LatestPost[]>`
      SELECT posts.id, posts.title, users.name as user_name, users.avatar_url, posts.created_at
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT 5`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest posts.');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredPosts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await sql<PostsTable[]>`
      SELECT
        posts.id,
        posts.title,
        users.name as user_name,
        cars.make as car_make,
        cars.model as car_model,
        posts.created_at,
        posts.type,
        posts.likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN cars ON posts.car_id = cars.id
      WHERE
        posts.title ILIKE ${`%${query}%`} OR
        users.name ILIKE ${`%${query}%`} OR
        cars.make ILIKE ${`%${query}%`} OR
        cars.model ILIKE ${`%${query}%`}
      ORDER BY posts.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return posts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts.');
  }
}

export async function fetchCars() {
  try {
    const cars = await sql`
      SELECT id, make, model FROM cars ORDER BY make, model
    `;
    return cars;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch car data.');
  }
}