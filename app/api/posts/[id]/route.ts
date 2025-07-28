import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/auth.config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const post = await sql`
      SELECT 
        posts.*,
        users.name as user_name,
        cars.make as car_make,
        cars.model as car_model
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN cars ON posts.car_id = cars.id
      WHERE posts.id = ${id}
      LIMIT 1
    `;

    if (post.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await sql`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        c.user_id,
        u.name as user_name,
        u.avatar_url as user_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${id}
      ORDER BY c.created_at DESC
    `;

    const postWithComments = {
      ...post[0],
      comments: comments
    };

    return NextResponse.json(postWithComments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error('No session found');
    return NextResponse.json({ error: 'Please sign in to create a post' }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const { title, content, car_id, type } = await request.json();
    const post = await sql`
      UPDATE posts
      SET user_id = ${session.user.id}, title = ${title}, content = ${content}, car_id = ${car_id}, type = ${type}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(post[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
