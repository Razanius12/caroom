import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';

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

    return NextResponse.json(post[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { title, content, car_id, type } = await request.json();
    const post = await sql`
      UPDATE posts
      SET user_id = '410544b2-4001-4271-9855-fec4b6a6442a', title = ${title}, content = ${content}, car_id = ${car_id}, type = ${type}
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
