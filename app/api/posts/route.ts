import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { authOptions } from '@/app/api/auth/auth.config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function generatePostId(title: string): string {
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

export async function GET() {
  try {
    const posts = await sql`
    SELECT
      posts.*,
      users.name as user_name,
      cars.make as car_make,
      cars.model as car_model
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN cars ON posts.car_id = cars.id
    ORDER BY posts.created_at DESC
`;
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error('No session found');
    return NextResponse.json({ error: 'Please sign in to create a post' }, { status: 401 });
  }

  try {
    const { title, content, car_id, type } = await request.json();

    const postId = generatePostId(title);
    
    const post = await sql`
      INSERT INTO posts (id, user_id, title, content, car_id, type)
      VALUES (${postId}, ${session.user.id}, ${title}, ${content}, ${car_id}, ${type})
      RETURNING *
    `;
    
    return NextResponse.json(post[0]);
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}