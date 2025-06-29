import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createSession } from "@/lib/session";
import { sendMail } from "@/lib/mailer";
import { VerificationEmail } from "@/components/email/VerificationEmail";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user || !user.password) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }
  if (!user.emailVerified) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: normalizedEmail, token } },
      update: { expires: new Date(Date.now() + 1000 * 60 * 60) }, // 1h expiry
      create: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60), // 1h expiry
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;
    await sendMail({
      to: normalizedEmail,
      subject: "Verify your email address",
      react: VerificationEmail({ verificationUrl }),
    });
    return NextResponse.json(
      { message: "Unverified email. Check inbox." },
      { status: 403 },
    );
  }
  await createSession({ id: user.id, email: user.email });
  return NextResponse.json({ message: "Login successful" });
}
