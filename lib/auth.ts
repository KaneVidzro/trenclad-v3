// lib/auth.ts

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Retrieves the currently authenticated user based on session data.
 * @returns The user object or null if not authenticated
 */
export async function getUser() {
  const session = await getSession();

  // No session or user ID in session — user is not authenticated
  if (!session?.userId) return null;

  // Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}

/**
 * Ensures the user is authenticated.
 * If not, redirects to the login page.
 * @returns The authenticated user object
 */
export async function requireUser() {
  const user = await getUser();

  if (!user) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  return user;
}
