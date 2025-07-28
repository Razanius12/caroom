import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/auth.config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json(
      { error: 'Please sign in to delete a comment' },
      { status: 401 }
    );
  }

  try {
    const result = await sql`
      DELETE FROM comments
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}