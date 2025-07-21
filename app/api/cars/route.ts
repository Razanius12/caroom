import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    const cars = await sql`SELECT * FROM cars ORDER BY make, model`;
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { make, model, year, image_url } = await request.json();
    const car = await sql`
      INSERT INTO cars (make, model, year, image_url)
      VALUES (${make}, ${model}, ${year}, ${image_url})
      RETURNING *
    `;
    return NextResponse.json(car[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}