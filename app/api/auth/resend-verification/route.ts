import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { VerificationEmail } from "@/components/email/VerificationEmail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Missing email" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return NextResponse.json({
      message: "If your account is unverified, a new link has been sent.",
    });
  }
  const token = Math.random().toString(36).substring(2) + Date.now();
  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token } },
    update: { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
    create: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  // TODO: Send verification email (implement email sending logic)

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;
  await sendMail({
    to: email,
    subject: "Verify your email address",
    react: VerificationEmail({ verificationUrl }),
  });

  return NextResponse.json({
    message: "If your account is unverified, a new link has been sent.",
  });
}
