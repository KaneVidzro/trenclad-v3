import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }
  const verification = await prisma.verificationToken.findFirst({
    where: { token },
  });
  if (!verification) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }
  const identifier = verification.identifier;
  await prisma.$transaction([
    prisma.user.update({
      where: { email: identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    }),
  ]);

  return NextResponse.json({ message: "Email verified successfully" });
}
