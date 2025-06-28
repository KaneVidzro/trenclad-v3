import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

/**
 * Handles POST requests for user registration.
 *
 * Expects a JSON body with:
 * - name: string
 * - username: string
 * - email: string
 * - password: string
 *
 * Creates a new user account if validations pass, then starts a session.
 */
export async function POST(req: Request) {
  const { name, username, email, password } = await req.json();

  // Validate required fields
  if (!name || !username || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  // Normalize email and username for consistency
  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.toLowerCase();

  // Check for existing user by email or username
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email or username already in use." },
      { status: 409 },
    );
  }

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user record in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  // Automatically create a session for the new user
  await createSession(newUser.id);

  // Respond with success
  return NextResponse.json(
    { message: "User registered and signed in." },
    { status: 201 },
  );
}
