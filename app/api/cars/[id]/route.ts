import { NextResponse, NextRequest } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { make, model, year, image_url } = await request.json();
    const car = await sql`
      UPDATE cars
      SET make = ${make}, model = ${model}, year = ${year}, image_url = ${image_url}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(car[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await sql`DELETE FROM cars WHERE id = ${id}`;
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}