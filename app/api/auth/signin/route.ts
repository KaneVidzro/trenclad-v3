import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

/**
 * Handle POST requests for user sign-in.
 *
 * Expects a JSON body with `email` and `password`.
 * Validates user credentials, and if valid, creates a session.
 */
export async function POST(req: Request) {
  // Parse JSON body from the incoming request
  const { email, password } = await req.json();

  // Check for missing fields
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  // Normalize email to lowercase for consistent database lookups
  const normalizedEmail = email.toLowerCase();

  // Attempt to find the user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Return an error if user does not exist or password is not set
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  // Compare provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  // Credentials are valid; create a new session for the user
  await createSession(user.id);

  // Respond with success
  return NextResponse.json({ message: "Sign in successful." }, { status: 200 });
}
