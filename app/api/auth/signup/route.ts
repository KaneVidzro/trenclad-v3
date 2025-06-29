import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mailer";
import { VerificationEmail } from "@/components/email/VerificationEmail";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  const normalizedEmail = email.trim().toLowerCase();
  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { message: "Email already in use" },
      { status: 400 },
    );
  }
  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Generate verification token
  const token = Math.random().toString(36).substring(2) + Date.now();
  // Create user (unverified)
  await prisma.$transaction([
    prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        emailVerified: null,
      },
    }),
    prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h expiry
      },
    }),
  ]);

  // TODO: Send verification email with token (implement email sending logic)
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;
  await sendMail({
    to: normalizedEmail,
    subject: "Verify your email address",
    react: VerificationEmail({ verificationUrl }),
  });

  return NextResponse.json({
    message: "Signup successful. Please verify your email.",
  });
}
