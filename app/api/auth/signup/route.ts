import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "@/lib/mailer";
import { VerificationEmail } from "@/components/email/VerificationEmail";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.$transaction(async (tx) => {
    // Check if user exists within the transaction
    const existing = await tx.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new Error("Email already in use");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user and token in same transaction
    await tx.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        emailVerified: null,
      },
    });

    await tx.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h expiry
      },
    });
  });

  // Send verification email (outside transaction)
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
