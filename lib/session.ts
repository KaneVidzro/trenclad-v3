"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/utils";

// Define session data type
export interface SessionData {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// 1. Get session
export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  return session;
}

// 2. Create session
export async function createSession(user: { id: string; email: string }) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.user = {
    id: user.id,
    email: user.email,
  };
  await session.save();
  revalidatePath("/");
  redirect("/account");
}

// 3. Destroy session (logout)
export async function destroySession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.destroy();
  revalidatePath("/");
  redirect("/auth/signin");
}

// 4. Create or update user in the database
export async function createOAuthAccount(
  user: { id: string; email: string },
  provider: string,
  providerAccountId: string,
) {
  await prisma.account.create({
    data: {
      userId: user.id,
      provider,
      providerAccountId,
      type: "oauth",
    },
  });
}
