// app/api/auth/signout/route.ts

import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

/**
 * Handles POST requests to sign the user out.
 * Deletes the session cookie and returns a confirmation response.
 */
export async function POST() {
  // Remove the session cookie to log the user out
  await deleteSession();

  // Respond with a success message
  return NextResponse.json(
    { message: "Signed out successfully." },
    { status: 200 },
  );
}
