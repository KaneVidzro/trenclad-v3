import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendMail } from "@/lib/mailer";
import { PasswordResetEmail } from "@/components/email/PasswordResetEmail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Missing email" }, { status: 400 });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    // Don't reveal if user exists
    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  }

  // Generate a secure token
  // Use crypto.randomBytes for better security

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.upsert({
    where: { identifier_token: { identifier: normalizedEmail, token } },
    update: { expires: new Date(Date.now() + 1000 * 60 * 60) }, // 1 hour expiry
    create: {
      identifier: normalizedEmail,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  // send forgot password email
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

  await sendMail({
    to: normalizedEmail,
    subject: "Reset your password",
    react: PasswordResetEmail({ resetUrl }),
  });

  return NextResponse.json({
    message: "If that email exists, a reset link has been sent.",
  });
}
