import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await sql`
      INSERT INTO users (name, email, password, avatar_url, join_date)
      VALUES (${name}, ${email}, ${hashedPassword}, '/avatars/default.png', NOW())
      RETURNING id, name, email
    `;

    // Return success without password
    return NextResponse.json({
      user: newUser[0]
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}