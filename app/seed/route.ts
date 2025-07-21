import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, cars, posts, comments, forum_stats } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      join_date DATE NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, avatar_url, join_date)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.avatar_url}, ${user.join_date})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedCars() {
  await sql`
    CREATE TABLE IF NOT EXISTS cars (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      make VARCHAR(255) NOT NULL,
      model VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      image_url TEXT NOT NULL
    );
  `;

  const insertedCars = await Promise.all(
    cars.map(
      (car) => sql`
        INSERT INTO cars (id, make, model, year, image_url)
        VALUES (${car.id}, ${car.make}, ${car.model}, ${car.year}, ${car.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCars;
}

async function seedPosts() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      car_id UUID NOT NULL REFERENCES cars(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      likes INT DEFAULT 0,
      type TEXT CHECK (type IN ('discussion', 'review', 'question', 'news')) NOT NULL
    );
  `;

  const insertedPosts = await Promise.all(
    posts.map((post) => sql`
      INSERT INTO posts (id, user_id, car_id, title, content, created_at, updated_at, likes, type)
      VALUES (${post.id}, ${post.user_id}, ${post.car_id}, ${post.title}, ${post.content}, ${post.created_at}, ${post.updated_at}, ${post.likes}, ${post.type})
      ON CONFLICT (id) DO NOTHING;
    `),
  );

  return insertedPosts;
}

async function seedComments() {
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id),
      user_id UUID NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  const insertedComments = await Promise.all(
    comments.map((comment) => sql`
      INSERT INTO comments (id, post_id, user_id, content, created_at)
      VALUES (${comment.id}, ${comment.post_id}, ${comment.user_id}, ${comment.content}, ${comment.created_at})
      ON CONFLICT (id) DO NOTHING;
    `),
  );

  return insertedComments;
}

async function seedForumStats() {
  await sql`
    CREATE TABLE IF NOT EXISTS forum_stats (
      month VARCHAR(255) PRIMARY KEY,
      posts INT NOT NULL,
      active_users INT NOT NULL
    );
  `;

  const insertedStats = await Promise.all(
    forum_stats.map((stat) => sql`
      INSERT INTO forum_stats (month, posts, active_users)
      VALUES (${stat.month}, ${stat.posts}, ${stat.active_users})
      ON CONFLICT (month) DO NOTHING;
    `),
  );

  return insertedStats;
}

export async function GET() {
  try {
    await seedUsers();
    await seedCars();
    await seedPosts();
    await seedComments();
    await seedForumStats();
    // Add other seed functions as needed

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}