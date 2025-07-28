import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/auth.config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function generateCommentId(): string {
  return `comment-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 15)}`;
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error('No session found');
    return NextResponse.json({ error: 'Please sign in to add a comment' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const { content } = await request.json();
    const comment = await sql`
      INSERT INTO comments (id, content, post_id, user_id)
      VALUES (${generateCommentId()}, ${content}, ${id}, ${session.user.id})
      RETURNING *
    `;
    return NextResponse.json(comment[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
