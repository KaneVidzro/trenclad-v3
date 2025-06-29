"use server";

import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date | null;
}

/**
 * Get the currently logged in user from the session.
 */
export async function getUser(): Promise<User | null> {
  const session = await getSession();
  if (!session.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerified: true,
    },
  });

  return user
    ? {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        image: user.image ?? undefined,
        emailVerified: user.emailVerified ?? null,
      }
    : null;
}

/**
 * Find or create a user for OAuth login and create session.
 *
 * @param provider - OAuth provider name (e.g., "google")
 * @param providerAccountId - unique ID from OAuth provider
 * @param email - user email from provider
 * @param name - user name from provider (optional)
 */
export async function oauthLogin(
  provider: string,
  providerAccountId: string,
  email: string,
  name: string,
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  },
): Promise<void> {
  // Find existing account with this provider and providerAccountId
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  if (account) {
    // Update account with new tokens
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      data: {
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken,
      },
    });
    // Account exists, create session for linked user
    await createSession({ id: account.user.id, email: account.user.email });
    return;
  }

  // No account found, check if user exists with email
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Create new user if none exists
    user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: new Date(), // verify email
      },
    });
  }

  // Link OAuth account to user
  await prisma.account.create({
    data: {
      userId: user.id,
      provider,
      providerAccountId,
      type: "oauth",
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
    },
  });

  // Create session for new user
  await createSession({ id: user.id, email: user.email });
}
