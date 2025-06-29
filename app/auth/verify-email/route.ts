import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return redirect("/auth/error?error=Missing token");
  }

  const verification = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!verification || verification.expires < new Date()) {
    return redirect("/auth/error?error=Invalid or expired token");
  }

  const { identifier } = verification;

  await prisma.$transaction([
    prisma.user.update({
      where: { email: identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    }),
  ]);

  return redirect("/auth/signin?emailVerified=true");
}
